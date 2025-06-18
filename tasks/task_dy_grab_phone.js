let tCommon = require("app/dy/Common");
let DyIndex = require('app/dy/Index.js');
let DySearch = require('app/dy/Search.js');
const DyUser = require('app/dy/User.js');
let machine = require("common/machine");
// let DyVideo = require('app/dy/Video.js');
// let DyComment = require('app/dy/Comment.js');

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    run(keyword) {
        return this.testTask(keyword);
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-dy-grab-phone-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask(keyword) {
        //首先进入点赞页面
        DyIndex.intoHome();
        tCommon.sleep(3000);
        DyIndex.intoSearchPage();
        tCommon.sleep(2000);
        DySearch.intoSearchList(keyword, 1);
        //开始采集电话号码
        let filename = '/sdcard/dke/手机号.txt';
        let errorCount = 0;

        let contains = [];
        let rp = 0;
        let grabLvError = 0;

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
                    if (machine.get('phone_' + account, 'int') == 1) {
                        System.toast('已经采集过了');
                        continue;
                    }

                    tCommon.click(tags[i]);
                    tCommon.sleep(3000);

                    let contentTag = UiSelector().className('android.widget.TextView').filter((v) => {
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
                    }

                    if (contentTag && contentTag.text()) {
                        let p = /[\d-—]{11,14}/.exec(contentTag.text());
                        Log.log('p', p);
                        if (p && p.length) {
                            let mobile = p[0];
                            let dyAccount = DyUser.getDouyin();
                            let dyNickname = DyUser.getNickname();
                            files.append(filename, "手机号：" + mobile + "       昵称：" + dyNickname + "       抖音号：" + dyAccount + "\r\n");
                            System.toast('手机号写入成功');
                        } else {
                            p = /\d{3}.*\d{4}.*\d{4}/.exec(contentTag.text());
                            Log.log('p', p);
                            if (p && p.length) {
                                let mobile = p[0];
                                let dyAccount = DyUser.getDouyin();
                                let dyNickname = DyUser.getNickname();
                                files.append(filename, "手机号：" + mobile + "       昵称：" + dyNickname + "       抖音号：" + dyAccount + "\r\n");
                                System.toast('手机号写入成功');
                            } else {
                                //微信查看
                                p = /[a-zA-Z0-9_\-]{5,20}/.exec(contentTag.text());
                                Log.log('p', p);
                                if (p && p.length) {
                                    let mobile = p[0];
                                    let dyAccount = DyUser.getDouyin();
                                    let dyNickname = DyUser.getNickname();
                                    files.append(filename, "微信号：" + mobile + "       昵称：" + dyNickname + "       抖音号：" + dyAccount + "\r\n");
                                    System.toast('微信号写入成功');
                                }
                            }
                        }
                    }

                    let tag = tCommon.id('waw').textContains('联系').findOnce() || tCommon.id('waw').textContains('电话').findOnce();//联系电话，联系我们 官方电话  三种
                    if (grabLvError < 2 && tag) {
                        let dyAccount = DyUser.getDouyin();
                        let dyNickname = DyUser.getNickname();
                        tCommon.click(tag);
                        tCommon.sleep(3000);

                        let mobile = tCommon.id('gib').filter((v) => {
                            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() > 0;
                        }).findOnce();
                        if (!mobile) {
                            tCommon.back(1, 800);
                            grabLvError++;
                            continue;
                        }
                        mobile = mobile.text().replace('呼叫', '').replace(' ', '');

                        files.append(filename, "[蓝V]手机号：" + mobile + "       昵称：" + dyNickname + "       抖音号：" + dyAccount + "\r\n");
                        machine.set('phone_' + account, 1);
                        System.toast('手机号写入成功');
                        tCommon.back(2, 800);
                        continue;
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

let keyword = Dialogs.input('请输入搜索内容', machine.get('phone_kw') || '');

if (!keyword) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
    System.exit();
}

machine.set('phone_kw', keyword);
Dialogs.confirm('提示', '手机号放在"/sdcard/dke/手机.txt"文件中');
tCommon.openApp();

let thr = undefined;
while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        if (task.run(keyword)) {
            if (thr) {
                thr.interrupt();
                Threads.shutDownAll();
            }
            tCommon.sleep(2000);
            FloatDialogs.show('任务完成了');
            break;
        }
        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        try {
            if (thr) {
                thr.interrupt();
                Threads.shutDownAll();
            }
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


try {
    Engines.closeAll(true);
} catch (e) {
    Log.log('停止脚本');
}
