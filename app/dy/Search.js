let Common = require('./Common.js');
let User = require('./User.js');
let statistics = require('../../common/statistics');
let Video = require('./Video.js');
let Comment = require('./Comment.js');

const Search = {
    /** @type {Array<string>} */
    contents: [],
    /**
     * type = 0 视频  type = 1 用户  需要先进入搜索页  2 综合
     * @param {string} keyword 
     * @param {number} [type]
     * @param {any} [config]
     * @returns 
     */
    intoSearchList(keyword, type, config) {
        if (!type) {
            type = 0;
        }

        //开始搜索
        let iptTag = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).isVisibleToUser(true).findOne();
        iptTag.setText(keyword);
        Common.sleep(1000 + 500 * Math.random());

        //找到搜索按钮
        let searchBtnTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).text('搜索').findOne() || UiSelector().className('android.widget.TextView').isVisibleToUser(true).desc('搜索').findOne();
        Log.log('searchBtnTag', searchBtnTag);
        Common.click(searchBtnTag);
        Common.sleep(4000 + 2000 * Math.random());
        if (type == 2) {
            return true;
        }
        let videoTag;
        let rp = 3;
        while (!videoTag) {
            if (type === 0) {
                videoTag = UiSelector().id('android:id/text1').className('android.widget.Button').text('视频').findOne();
            } else if (type === 1) {
                videoTag = UiSelector().id('android:id/text1').className('android.widget.Button').text('用户').findOne();
            }

            if (rp-- <= 0 || videoTag) {
                break;
            }

            Common.swipeSearchTabToLeft();
            Common.sleep(1500);
        }

        if (!videoTag) {
            console.log('找不到用户tab');
            throw new Error('找不到视频或者用户tab;type=' + type);
        }

        console.log('进入用户或者视频：', videoTag);
        videoTag.parent().click();
        Common.sleep(3500 + 1500 * Math.random());

        if (config) {
            let num = 0;
            for (let i in config) {
                num += config[i];
            }

            if (num > 0) {
                //开始搜索
                let filterTag = UiSelector().descContains('筛选').clickable(true).isVisibleToUser(true).findOne();
                if (filterTag) {
                    filterTag = UiSelector().className('android.view.ViewGroup').clickable(true).filter(v => {
                        return v.bounds().left > Device.width() * 0.8 && v.bounds().bottom < Device.height() / 5;
                    }).findOne();
                }

                Common.log('filterTag', filterTag);
                filterTag.click();
                Common.sleep(1000);

                let textConfig = {
                    sort: ['综合排序', '最新发布', '最多点赞'],
                    time: ['不限', '一天内', '一周内', '半年内'],
                    minute: ['不限', '1分钟以下', '1-5分钟', '5分钟以上'],
                    random: ['不限', '关注的人', '最近看过', '还未看过'],
                }

                let baseTop = {
                    sort: '排序依据',
                    time: '发布时间',
                    minute: '视频时长',
                    random: '搜索范围',
                }

                for (let i in config) {
                    if (config[i] == 0) {
                        continue;
                    }

                    /** @ts-ignore */
                    let baseTopTag = UiSelector(false).text(baseTop[i]).isVisibleToUser(true).findOne();
                    /** @ts-ignore */
                    let tag = UiSelector(false).text(textConfig[i][config[i]]).filter(v => {
                        return v.bounds().top > baseTopTag.bounds().top + baseTopTag.bounds().height();
                    }).findOne();
                    tag.parent().click();
                    Common.sleep(1000 + 1000 * Math.random());
                    continue;
                }

                Common.sleep(3000 + 1000 * Math.random());
                Gesture.click(filterTag.parent().bounds().left + 10 * Math.random(), filterTag.parent().bounds().top + 10 * Math.random());
                Common.sleep(500);

                Common.sleep(500);
            }
        }
    },

    /**
     * 从搜索列表进入详情
     * @returns {boolean}
     */
    intoSearchVideo() {
        //需要进入视频栏
        let videoTag = Common.aId('text1').text('视频').isVisibleToUser(true).findOne();
        Common.click(videoTag, 0.2);
        Common.sleep(3000 + 1000 * Math.random());

        let descTag = Common.id('desc').className('android.widget.TextView').filter(v => {
            return !!v.text();
        }).isVisibleToUser(true).findOne();

        if (descTag) {
            Common.click(descTag);
            return true;
        }
        throw new Error('找不到视频输入');
    },

    /**
     * 从搜索页进入用户主页
     * @param {string} keyword 
     * @returns {boolean}
     */
    intoSeachUser(keyword) {
        Log.log("开始寻找抖音号了哈", keyword);
        let userTag = UiSelector().className('android.view.ViewGroup').descContains('关注').isVisibleToUser(true).findOne();
        let userTag2 = UiSelector().className('android.view.ViewGroup').descContains('发私信').isVisibleToUser(true).findOne();
        if (userTag2 && userTag2.bounds().top < userTag.bounds().top) {
            userTag = userTag2;
            Common.log('userTag2', '发私信位置更近，采用发私信对应的用户');
        }

        if (!userTag) {
            FloatDialogs.toast('找不到抖音号：' + keyword);
            return false;
        }

        let parent = userTag.parent();
        let centerX = parent.bounds().centerX() - 50;
        let height = parent.bounds().height();
        let top = parent.bounds().top;
        console.log('点击位置', centerX, top, height);
        let res = Gesture.click(centerX + 100 * Math.random(), top + height * (0.1 + 0.8 * Math.random()));
        Common.sleep(2000 + 1000 * Math.random());
        return res;
    },

    /**
     * 搜索列表进入直播间
     * @param {string} douyin 
     * @returns {boolean}
     */
    intoLiveRoom(douyin) {
        let tag = UiSelector().className('android.view.ViewGroup').descContains('直播').isVisibleToUser(true).findOne();
        if (!tag) {
            FloatDialogs.toast('找不到抖音号：' + douyin);
            return false;
        }

        Log.log('点击位置：', tag.bounds().left + 100 + 20 * Math.random(), tag.bounds().centerY() * 0.4 + tag.bounds().centerY() * 0.2 * Math.random());
        Gesture.click(tag.bounds().left + 100 + 20 * Math.random(), tag.bounds().top + tag.bounds().height() * 0.5 * Math.random());//头像高度实际低于parent一些
        Common.sleep(7000 + 2000 * Math.random());
        return true;
    },

    /**
     * 主页进入搜索视频详情
     * @param {string} keyword 
     */
    homeIntoSearchVideo(keyword) {
        Search.intoSearchList(keyword, 0);
        Search.intoSearchVideo();
    },

    /**
     * 主页进入搜索用户页面
     * @param {string} keyword 
     */
    homeIntoSearchUser(keyword) {
        let res;
        if (keyword.indexOf('+') !== 0) {
            Search.intoSearchList(keyword, 1);
            res = Search.intoSeachUser(keyword);
        } else {
            keyword = keyword.substring(1);
            User.intoFocusList();
            Common.sleep(3000);
            res = User.focusListSearch(keyword);
        }
        return res;
    },

    /**
     * 进入搜索后的用户直播间
     * @param {string} douyin 
     * @param {number} type 
     * @returns 
     */
    intoUserLiveRoom(douyin, type) {
        this.intoSearchList(douyin, type);
        return this.intoLiveRoom(douyin);
    },

    /**
     * 搜索，进入用户页面，再进入视频页面
     * @param {string} douyin 
     * @param {number} type 
     * @returns {boolean}
     */
    intoUserVideoPage(douyin, type) {
        this.intoSearchList(douyin, type);
        this.intoSeachUser(douyin);
        Common.sleep(3000);
        return Video.intoUserVideo();
    },


    notInList() {
        let i = 3;
        while (i-- > 0) {
            if (Common.aId('text1').text('用户').isVisibleToUser(true).findOne()) {
                Log.log('在用户页面');
                return;
            }

            Common.sleep(5000);
        }

        Common.back();//偶尔会出现没有返回回来的情况，这里加一个判断
        Common.sleep(2000);
        Log.log('不在用户页面， 返回');
    },

    /**
     * 
     * @param {function} getAccounts 
     * @param {function} decCount 
     * @param {function} setAccount 
     * @param {function} getMsg 
     * @param {any} params 
     * @returns {boolean}
     */
    userList(getAccounts, decCount, setAccount, getMsg, params) {
        let settingData = params.settingData;
        Log.log('开始执行用户列表');
        let errorCount = 0;

        /** @type Array<string> */
        let rects = [];
        while (true) {
            let tag = UiSelector().className('androidx.recyclerview.widget.RecyclerView').isVisibleToUser(true).findOne();
            let tags = tag.children().find(UiSelector().className('android.widget.FrameLayout').isVisibleToUser(true));
            Log.log('tags', tags.length);
            if (tags.length === 0) {
                errorCount++;
                Log.log('containers为0');
            } else {
                errorCount = 0;
            }

            try {
                for (let i in tags) {
                    this.notInList();
                    if (rects.includes(tags[i].bounds().toString())) {
                        continue;
                    }
                    Common.click(tags[i], 0.35);
                    rects.push(tags[i].bounds().toString());
                    Common.sleep(3000 + 1500 * Math.random());
                    //看看有没有视频，有的话，操作评论一下，按照20%的频率即可
                    statistics.viewUser();
                    let isPrivateAccount = User.isPrivate();
                    let account = User.getDouyin();
                    Log.log(account, 'account');
                    if (!account) {
                        Log.log('点击没有进入');
                        continue;
                    }

                    if (this.contents.includes(account) || getAccounts(account)) {
                        Common.back();
                        Log.log('重复');
                        Common.sleep(1000 + 500 * Math.random());
                        continue;
                    }

                    Log.log('是否是私密账号：' + isPrivateAccount);
                    if (isPrivateAccount) {
                        Common.back();
                        Log.log('私密账号');
                        Common.sleep(1000 + 500 * Math.random());
                        if (decCount() <= 0) {
                            Log.log('数量操作完了');
                            return true;
                        }
                        setAccount(account);
                        this.contents.push(account);
                        continue;
                    }

                    //查看粉丝和作品数是否合格
                    let worksCount = User.getWorksCount();
                    if (worksCount < settingData.worksMinCount || worksCount > settingData.worksMaxCount) {
                        Log.log('作品数不符合', worksCount, settingData.worksMinCount, settingData.worksMaxCount);
                        setAccount(account);
                        Common.back();
                        Common.sleep(1000 + 500 * Math.random());
                        continue;
                    }

                    //查看粉丝和作品数是否合格
                    let fansCount = 0;
                    try {
                        fansCount = User.getFansCount();
                    } catch (e) {
                        Log.log(e);
                        Log.log('获取粉丝数量失败');
                        Common.back();
                        Common.sleep(1000 + 500 * Math.random());
                        continue;//大概率是没有点击进去
                    }

                    if (fansCount < settingData.fansMinCount * 1 || fansCount > settingData.fansMaxCount * 1) {
                        Log.log('粉丝数不符合', fansCount, settingData.fansMinCount, settingData.fansMaxCount);
                        setAccount(account);
                        Common.back();
                        Common.sleep(1000 + 500 * Math.random());
                        continue;
                    }

                    let nickname = User.getNickname();
                    Log.log('获取名称', nickname);

                    if (Math.random() * 100 <= settingData.focusRate * 1) {
                        User.focus();
                        Log.log('关注');
                    }

                    if (Math.random() * 100 <= settingData.privateRate * 1) {
                        User.privateMsg(getMsg(1, nickname, User.getAge(), User.getGender()).msg);
                        Log.log('私信');
                    }

                    let commentRate = Math.random() * 100;
                    let zanRate = Math.random() * 100;

                    Log.log('即将进入视频', commentRate, zanRate);
                    if ((commentRate < settingData.commentRate * 1 || zanRate < settingData.zanRate * 1) && Video.intoUserVideo()) {
                        //点赞
                        Log.log('点赞频率检测', zanRate, settingData.zanRate * 1);
                        if (zanRate <= settingData.zanRate * 1) {
                            Video.clickZan();
                            Log.log('点赞');
                        }

                        //随机评论视频
                        Log.log('评论频率检测', commentRate, settingData.commentRate * 1);
                        if ((commentRate <= settingData.commentRate * 1) && !UiSelector().text('作者仅允许互关朋友评论').isVisibleToUser(true).findOne()) {
                            let msg = getMsg(0, Video.getContent());
                            if (msg) {
                                Log.log('开启评论窗口');
                                Comment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                                Log.log('评论了');
                                Common.sleep(1000 + 500 * Math.random());//回到视频页面
                            }
                        }
                        User.backHome();
                        Log.log('返回home检测');
                    } else {
                        Log.log('未进入视频');
                    }

                    let r = decCount();
                    Log.log('r', r);
                    if (r <= 0) {
                        return true;
                    }

                    setAccount(account);
                    Log.log(account, getAccounts(account));
                    this.contents.push(account);
                    Common.back();
                    Log.log('返回到列表-可能不成功');
                    Common.sleep(1000 + 500 * Math.random());//用户页到列表页
                    this.notInList();
                    Common.sleep(1000 + 500 * Math.random());
                }
            } catch (e) {
                errorCount++;
                //查看是不是不在视频页面，不是则返回
                this.gotoVedioPage();
            }

            if (errorCount >= 3) {
                throw new Error('遇到3次错误');
            }

            if (!Common.swipeSearchUserOp()) {
                FloatDialogs.toast('操作完了');
                Log.log('滑动失败了，认为是成功');
                return true;
            }
            Common.sleep(2000 + 1000 * Math.random());
        }
    },

    gotoVedioPage() {
        let k = 3;
        while (k-- > 0) {
            if (Common.id('back_btn').filter(v => {
                return v.bounds().left > Device.width() / 2 && v.bounds().top > Device.height() / 4;
            }).isVisibleToUser(true).findOne()) {
                Common.back();
                Common.sleep(1000 + 500 * Math.random());
                Common.log('在评论窗口，关闭');
            }
        }
    }
}

module.exports = Search;
