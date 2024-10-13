let tCommon = require("app/dy/Common");
let DyIndex = require('app/dy/Index.js');
let DySearch = require('app/dy/Search.js');
const DyUser = require('app/dy/User.js');
let machine = require("common/machine");
let mHttp = require('unit/mHttp');
let Wx = require('app/wx/Wx.js');
let storage = require("common/storage");

let task = {
    setting: {},
    keyword: undefined,
    wxCount: 1,//微信index
    startTime: undefined,
    txlSuc: false,//通讯录是否完成
    change() {
        if (Date.parse(new Date()) / 1000 - this.startTime > 86400) {
            //完成了一天，需要重新获取setting
            Log.log('一天完成了', this.startTime, Date.parse(new Date()) / 1000)
            this.startTime = Date.parse(new Date()) / 1000;
            //所有数值回归
            storage.set('dy_grab_setting', null);
            storage.set('dy_grab_hasContact', null);
        }
    },

    getKeyword() {
        return this.keyword || storage.get('dy_grab_keyword');
    },

    setKeyword(keyword) {
        this.keyword = keyword;
        storage.set('dy_grab_keyword', keyword);
    },

    //将每日数据删除1，如果已经是0，则直接返回
    decData(key, value) {
        if (!value) {
            value = 1;
        }

        let res = storage.get('dy_grab_setting');
        if (res) {
            if (res[key] <= 0) {
                return 0;
            }
            res[key] = res[key] - value;
            storage.set('dy_grab_setting', res);
            return res[key];
        }

        return 0;
    },

    getSetting(key) {
        let res = storage.get('dy_grab_setting');
        if (!res) {
            return false;
        }

        this.setting = res;

        if (key) {
            return res[key] || 0;
        }
        return res;
    },

    setSetting(setting) {
        this.setting = setting;
        storage.set('dy_grab_setting', setting);
    },

    hasContact() {
        return storage.get('dy_grab_hasContact');
    },

    setContact() {
        return storage.set('dy_grab_hasContact', true);
    },

    friendContacts() {
        let res = storage.get('dy_grab_friendContats');
        if (!res) {
            return false;
        }

        return JSON.parse(res);
    },

    setFriendContacts(friends) {
        return storage.set('dy_grab_friendContats', JSON.stringify(friends));
    },

    run() {
        //获取手机号采集关键词
        this.keyword = this.getKeyword();
        if (!this.keyword || !this.keyword.keyword) {
            let res = mHttp.post('dke', 'getKeyword', {});
            Log.log('getKeyword', res);
            if (res.success) {
                this.keyword = res.data;
                storage.set('dy_grab_keyword', this.keyword);
            }
        }

        Log.log(this.keyword);
        if (!this.keyword || !this.keyword.keyword) {
            Log.log('找不到关键词');
            Wx.sleep(60 * 1000);//休眠60秒
            return true;
        }

        Log.log('开始执行关键词：', this.keyword.keyword, this.keyword.id);
        //执行搜索
        if (this.testTask(this.keyword.keyword, this.keyword.id)) {
            let res = mHttp.post('dke', 'updateGrabKeywordStatus', { id: this.keyword.id, status: 1 });
            Log.log('关键词任务结束：', res);
        }
        this.setKeyword(null);//下次获取新的关键词  这里只能是null，不能是undefine
        return true;
    },

    runWx() {
        this.change();
        //如果设置没有，则获取一次设置
        /**
            机器数量：'machine_count' => '5',
            通讯录初始化数量：'contact_count' => '2000',
            通讯录每日新增数量：'contact_add_count' => '20',
            搜索每日新增数量：'search_add_count' => 30,
            添加通讯录好友数量：'add_contact_friend_count' => 5,
            添加搜索好友数量：'add_search_friend_count' => 1,
            添加好友间隔：'add_friend_sec' => 450,
        */
        if (!this.getSetting()) {
            let res = mHttp.post('dke', 'getGrabTaskSetting', {});
            Log.log('getGrabTaskSetting结果');
            if (res.success) {
                this.setSetting(res.data);
            }
        } else {
            Log.log('getGrabTaskSetting2', this.getSetting());
        }

        //通讯录完成
        if (!this.hasContact()) {
            let contactsData = mHttp.post('dke', 'getContacts', {});//['mb' => $item['mobile'], 'wx' => $item['wx'], 'nick' => $item['nickname']];
            Log.log('contactsData', contactsData);
            if (contactsData.success && contactsData.data && contactsData.data.length) {
                for (let i in contactsData.data) {
                    Wx.addContacts(contactsData.data[i]['nick'] + '@tel:' + contactsData.data[i]['mb'], contactsData.data[i]['mb']);
                }
                //数据添加完成
                let res = mHttp.post('dke', 'updateContact', {});
                Log.log('updateContact结果');
            }
            if (contactsData.data.length) {
                this.setContact();
            }
        }

        //获取一个手机号
        let friends = this.friendContacts();
        if (!friends && this.getSetting('search_add_count')) {
            res = mHttp.post('dke', 'getFriendContacts', { limit: this.getSetting('search_add_count') });
            friends = res.data;
            Log.log('friend结果', this.getSetting('search_add_count'));
            this.setFriendContacts(friends);
        } else {
            Log.log('friend2', friends, this.getSetting('search_add_count'));
        }

        this.wxTask(friends);//微信群控
    },

    log(){
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-dy-grab-" + file + ".txt";
        Log.setFile(allFile);
    },

    //users  {nick: nickname, mb: 13232322323, wx: '234dsf'}
    wxTask(users) {
        for (let i = 0; i < this.wxCount; i++) {
            if (Wx.openApp(this.index)) {
                if (users) {
                    for (let m = 0; m < this.setting.add_search_friend_count; m++) {
                        let wx_status = Wx.addFriend(users[0].wx || users[0].mb);
                        if (wx_status) {
                            users.shift();
                            this.setFriendContacts(users);
                            Log.log('更新电话状态-1')
                            mHttp.post('dke', 'updatePhoneStatus', { _mobile: users[0].wx || users[0].mb, type: users[0].mb ? 0 : 2, wx_status: wx_status });
                        }
                        Wx.sleep(2000);
                    }
                }

                if (!this.txlSuc) {
                    this.txlSuc = Wx.addTxlFriend(this.setting.send_text || '', (mobile) => {
                        //删除对应的通讯录
                        if (mobile && mobile.length === 11) {
                            Wx.deleteContact();
                            Log.log('更新电话状态-2');
                            mHttp.post('dke', 'updatePhoneStatus', { _mobile: mobile, type: 0, wx_status: 2 });
                        }

                        return this.decData('contact_add_count');
                    }, this.setting.add_contact_friend_count);
                    Log.log('通讯录结果', this.txlSuc);
                }
            }

            Log.log('即将切换到下一个账号');
            Wx.sleep(10000 + 20000 * Math.random());
        }
        //每次添加好友的频率
        Log.log('this.setting.add_friend_sec', this.setting.add_friend_sec);
        let sleepSecond = this.setting.add_friend_sec * 1000 + this.setting.add_friend_sec / 10 * 1000 * Math.random();
        Log.log('一次加好友完成，即将休眠！', sleepSecond);
        System.toast('一次加好友完成，即将休眠！');
        Wx.sleep(sleepSecond);
    },

    testTask(keyword, keyword_id) {
        //首先进入点赞页面
        DyIndex.intoHome();
        tCommon.sleep(3000);
        DyIndex.intoSearchPage();
        tCommon.sleep(2000);
        DySearch.intoSearchList(keyword, 1);
        //开始采集电话号码
        let filename = '/sdcard/dke/web-手机号.txt';
        let errorCount = 0;

        let contains = [];
        let rp = 0;

        while (true) {
            let tags = UiSelector().className('com.lynx.tasm.behavior.ui.LynxFlattenUI').textContains('粉丝').filter((v) => {
                return v && !!v.bounds() && v.bounds().left > 0 && v.bounds().width() > 0 && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height();
            }).find();

            arr.push(contains ? (contains[0] && contains[0]._addr) : null);
            if (contains.length > 2) {
                contains.shift();
            }

            if (contains[0] == contains[1]) {
                rp++;
                if (rp >= 3) {
                    return true;
                }
            } else {
                rp = 0;
            }

            for (let i in tags) {
                try {
                    if (isNaN(i)) {
                        continue;
                    }

                    let text = tags[i].text().split(/[,|，]/);
                    let account = text[2].replace('抖音号：', '').replace('按钮', '');
                    errorCount = 0;
                    if (machine.get('phone_' + account, 'int')) {
                        System.toast('已经采集过了');
                        continue;
                    }

                    tCommon.click(tags[i]);
                    tCommon.sleep(3000);

                    let contentTag = UiSelector().className('android.widget.TextView').clickable(true).filter((v) => {
                        return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().width() > 0;
                    }).textContains('更多').findOnce();

                    Log.log(contentTag);
                    if (contentTag) {
                        if (contentTag.text().indexOf('@') !== -1) {
                            tCommon.back(1, 800);
                            continue;
                        }

                        //点击10次确保点击正常
                        let h = contentTag.bounds().top + contentTag.bounds().height() - 20;
                        let step = contentTag.bounds().width() / 20;
                        for (let i = 0; i < 20; i++) {
                            Gesture.click(contentTag.bounds().left + i * step, h);
                            System.sleep(30);
                        }
                        tCommon.sleep(2000);
                        contentTag = UiSelector().className('android.widget.TextView').filter((v) => {
                            return v && v.bounds() && v.bounds().left == contentTag.bounds().left && v.bounds().top == contentTag.bounds().top && v.bounds().width() == contentTag.bounds().width();
                        }).clickable(true).findOnce();
                    } else {
                        let tag = tCommon.id('nes').filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0;
                        }).findOnce();

                        contentTag = UiSelector().className('android.widget.TextView').filter((v) => {
                            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top == tag.bounds().top + tag.bounds().height() && v.bounds().width() > 0;
                        }).clickable(true).findOnce();
                    }

                    let info = {};
                    if (contentTag && contentTag.text()) {
                        let p = /[\d-—]{11,14}/.exec(contentTag.text());
                        Log.log('p', p);
                        if (p && p.length) {
                            let mobile = p[0].replace(/[-]*/g, '');
                            info = {
                                _mobile: mobile,
                                nickname: DyUser.getNickname(),
                                douyin: DyUser.getDouyin(),
                                age: DyUser.getAge() || 0,
                                introduce: DyUser.getIntroduce(),
                                zanCount: DyUser.getZanCount(),
                                focusCount: DyUser.getFocusCount(),
                                fansCount: DyUser.getFansCount(),
                                worksCount: DyUser.getWorksCount(),
                                ip: DyUser.getIp(),
                                gender: DyUser.getGender(),
                                keyword_id: keyword_id,
                            };
                            files.append(filename, "手机号：" + mobile + "       昵称：" + info.nickname + "       抖音号：" + info.douyin + "\r\n");
                            System.toast('手机号写入成功');
                        } else {
                            p = /(\d{3})[\S\s]*(\d{4})[\S\s]*(\d{4})/.exec(contentTag.text());
                            Log.log('p', p);
                            if (p && p.length >= 4) {
                                let mobile = p[1] + p[2] + p[3];
                                info = {
                                    _mobile: mobile,
                                    nickname: DyUser.getNickname(),
                                    douyin: DyUser.getDouyin(),
                                    age: DyUser.getAge() || 0,
                                    introduce: DyUser.getIntroduce(),
                                    zanCount: DyUser.getZanCount(),
                                    focusCount: DyUser.getFocusCount(),
                                    fansCount: DyUser.getFansCount(),
                                    worksCount: DyUser.getWorksCount(),
                                    ip: DyUser.getIp(),
                                    gender: DyUser.getGender(),
                                    keyword_id: keyword_id,
                                };
                                files.append(filename, "手机号：" + mobile + "       昵称：" + info.nickname + "       抖音号：" + info.douyin + "\r\n");
                                System.toast('手机号写入成功');
                            } else {
                                //微信查看
                                p = /[a-zA-Z0-9_-]{5,20}/.exec(contentTag.text());
                                Log.log('p', p);
                                if (p && p.length && isNaN(p[0])) {
                                    let mobile = p[0];
                                    info = {
                                        wx: mobile,
                                        nickname: DyUser.getNickname(),
                                        douyin: DyUser.getDouyin(),
                                        age: DyUser.getAge() || 0,
                                        introduce: DyUser.getIntroduce(),
                                        zanCount: DyUser.getZanCount(),
                                        focusCount: DyUser.getFocusCount(),
                                        fansCount: DyUser.getFansCount(),
                                        worksCount: DyUser.getWorksCount(),
                                        ip: DyUser.getIp(),
                                        gender: DyUser.getGender(),
                                        keyword_id: keyword_id,
                                    };
                                    files.append(filename, "微信号：" + mobile + "       昵称：" + info.nickname + "       抖音号：" + info.douyin + "\r\n");
                                    System.toast('微信号写入成功');
                                }
                            }
                        }
                    }

                    Log.log(info);
                    if (info._mobile || info.wx) {
                        let res = mHttp.post('dke', 'grabKeywordPhone', info);
                        Log.log(res);
                        if (!res.success) {
                            Log.log('上传失败：', info);
                        }
                    }

                    machine.set('phone_' + account, 1);
                    tCommon.back(1, 800);
                    continue;
                } catch (e) {
                    Log.log(e);
                    errorCount++;
                    if (errorCount > 3) {
                        throw new Error('超过三次错误');
                    }
                }
            }

            let left = (1 / 5 + 3 / 5 * Math.random()) * Device.width();
            let rd = Math.random();
            Gesture.swipe(left, Device.height() * (2 / 3 + 1 / 8 * rd), left + Math.random() * 50 * Math.random(), Device.height() * (1 / 4 + 1 / 8 * rd), 400 + Math.random() * 100);
            tCommon.sleep(3000 + 2000 * Math.random());
        }
    },
}

Wx.awaitPermisson("android.permission.READ_CONTACTS");
Wx.awaitPermisson("android.permission.WRITE_CONTACTS");

let i = Dialogs.input('请输入当前手机微信数量：', storage.get('dy_grab_wx_count') || '1');
if (!i || isNaN(i) || i > 2) {
    System.toast('输入有误');
    Log.log('输入有误');
    System.exit();
}

storage.set('dy_grab_wx_count', i);

//采集和微信群控
let type = storage.get('dy_grab_wx_type');
if (!type) {
    type = [];
} else {
    type = JSON.parse(type);
}

let res = dialogs.multiChoice('请选择操作类型', ['采集数据', '智能添加微信'], type.length ? type : [0, 1]);
if (res.length == 0) {
    System.toast('你停止了任务');
    Log.log('你停止了任务');
    System.exit();
}
storage.set('dy_grab_wx_type', JSON.stringify(res));

if (res.includes(0)) {
    tCommon.openApp();
}
let thr = undefined;
task.startTime = Date.parse(new Date()) / 1000;

// storage.set('dy_grab_hasContact', false);

while (true) {
    task.log();

    //数据采集
    if (res.includes(0)) {
        Log.log('开始执行搜索');
        try {
            //先执行搜索，再执行群控
            if (!thr) {
                thr = tCommon.closeAlert();
            }

            task.run();
        } catch (e) {
            Log.log(e);
            try {
                if (thr) {
                    thr.interrupt();
                }
                Threads.shutDownAll();
                tCommon.showToast("遇到错误，即将自动重启");
                tCommon.closeApp();
                tCommon.sleep(3000);
                tCommon.showToast('开启抖音');
                tCommon.openApp();
            } catch (e) {
                Log.log('启停bug', e);
            }
        }
    }

    //微信加好友
    if (res.includes(1)) {
        if (res.includes(0)) {
            tCommon.backApp();
            tCommon.sleep(4000);
        }

        //工作时间 从上午9点到晚上9点
        if ((new Date()).getHours() < 9 || (new Date()).getHours() > 21) {
            Log.log('非工作时间，休眠1分钟')
            Wx.sleep(60 * 1000);//休息5分钟
            continue;
        }

        try {
            if (thr) {
                thr.interrupt();
            }
            Threads.shutDownAll();
            //先执行搜索，再执行群控
            task.runWx();
        } catch (e) {
            Log.log(e);
            try {
                Threads.shutDownAll();
                tCommon.showToast("遇到错误，即将自动重启");
                Wx.closeApp();
                tCommon.sleep(3000);
            } catch (e) {
                Log.log('-启停bug', e);
            }
            Wx.sleep(10000);
        }
    }
}
