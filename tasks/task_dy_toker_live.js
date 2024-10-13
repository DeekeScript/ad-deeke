let tCommon = require("app/dy/Common");
let DyIndex = require("app/dy/Index");
let DySearch = require("app/dy/Search");
let DyComment = require("app/dy/Comment");
let DyUser = require("app/dy/User");
let DyVideo = require("app/dy/Video");
let storage = require("common/storage");
let machine = require("common/machine");
let DyLive = require("app/dy/Live");
let baiduWenxin = require("service/baiduWenxin");

let task = {
    index: -1,
    nicknames: [],
    intoErrorCount: 0,//根据错误次数判断直播是否结束
    run(input, preIndex) {
        return this.testTask(input, preIndex);
    },

    getMsg(type, title, age, gender) {
        if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
        }
        return machine.getMsg(type) || false;//永远不会结束
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-toker-live-" + file + ".txt";
        Log.setFile(allFile);
    },

    includesKw(str, kw) {
        for (let i in kw) {
            if (str.includes(kw[i])) {
                return true;
            }
        }
        return false;
    },

    testTask(douyin, preIndex) {
        Log.log('账号：', douyin);
        Log.log('preIndex:', preIndex);
        if (!tCommon.getRemark(douyin)) {
            //首先进入页面
            DyIndex.intoSearchPage();
            let res = DySearch.intoUserLiveRoom(douyin, 1);
            if (!res) {
                System.toast('找不到用户账号：' + douyin);
                this.intoErrorCount++;
                Threads.shutDownAll();
                tCommon.sleep(500);
                if (this.intoErrorCount >= 3) {
                    return true;//完成了
                }
                throw new Error('找不到用户账号：' + douyin);
            }
        } else {
            douyin = douyin.substring(1);
            App.gotoIntent('snssdk1128://user/profile/' + douyin);
            tCommon.sleep(5000 + 2000 * Math.random());
            if (!DyUser.intoLive()) {
                return true;
            }
            tCommon.sleep(5000 + 2000 * Math.random());
        }

        this.intoErrorCount = 0;

        let rp = 0;
        while (true) {
            DyLive.openUserList();
            let onlineTag = UiSelector().descContains('在线观众').textContains('在线观众').filter((v) => {
                return v && v.bounds() && v.bounds().top && v.bounds().width() && v.bounds().height() && v.bounds().top + v.bounds().height() < Device.height();
            }).findOneBy(2000);

            if (!onlineTag) {
                throw new Error('找不到“在线观众”tag');
            }

            let addr = undefined;
            let hiddenI = 0;
            let ignoreIndex = 0;
            while (true) {
                let users = DyLive.getUsers();
                if (users.length == 0) {
                    tCommon.back();
                    tCommon.sleep(1000);
                    Log.log('无数据');
                    break;
                }

                if (rp >= 3) {
                    tCommon.back();
                    tCommon.sleep(1000);
                    Log.log('扫描完了');
                    break;
                }

                for (let k in users) {
                    Log.log('index', ignoreIndex);
                    if (ignoreIndex++ <= preIndex) {
                        continue;
                    }

                    if (!tCommon.clickRange(users[k].tag, onlineTag.bounds().top, Device.height() - users[k].tag.bounds().height())) {
                        Log.log('边界超出');
                        continue;
                    }

                    tCommon.sleep(1000 + 2000 * Math.random());
                    let nickname = DyLive.getNickname();
                    if (nickname == '') {
                        Log.log('没有点击成功');
                        if (hiddenI++ >= 3) {
                            break;
                        }
                        continue;
                    }
                    hiddenI = 0;

                    if (k == 0) {
                        if (nickname === addr) {
                            rp++;
                        } else {
                            rp = 0;
                        }
                        addr = nickname;
                    }

                    if (this.nicknames.includes(nickname)) {
                        tCommon.back();
                        Log.log('重复-');
                        continue;
                    }

                    if (machine.get('task_dy_toker_live_' + douyin + '_' + nickname, 'bool')) {
                        Log.log('重复');
                        tCommon.back();
                        continue;
                    }

                    Log.log('开始操作用户：', nickname, machine.get('task_dy_toker_live_' + douyin + '_' + nickname, 'bool'));
                    this.nicknames.push(nickname);
                    machine.set('task_dy_toker_live_' + douyin + '_' + nickname, true);
                    Log.log('设置后：' + machine.get('task_dy_toker_live_' + douyin + '_' + nickname, 'bool'));
                    Log.log('进入粉丝列表');
                    DyLive.intoFansPage();
                    if (DyUser.isPrivate()) {
                        Log.log('私密账号');
                        tCommon.back(1, 1000);
                        continue;
                    }

                    try {
                        if (machine.get('task_dy_toker_live_focus_switch', 'bool')) {
                            DyUser.focus();
                        }

                        if (machine.get('task_dy_toker_live_private_switch', 'bool')) {
                            let msg = this.getMsg(1, DyUser.getNickname(), DyUser.getAge(), DyUser.getGender());
                            if (msg) {
                                DyUser.privateMsg(msg.msg);
                            }
                        }

                    } catch (e) {
                        Log.log(e);
                    }

                    //开始操作评论
                    let comment_user_video_rate = machine.get('task_dy_toker_live_comment_user_video_rate', 'int');
                    if (comment_user_video_rate > Math.random() * 100 && DyVideo.intoUserVideo()) {
                        Log.log('有视频，直接操作视频引流');
                        DyVideo.clickZan();
                        tCommon.sleep(1000);
                        let msg = this.getMsg(0, DyVideo.getContent());
                        if (msg) {
                            DyVideo.openComment(!!DyVideo.getCommentCount());
                            Log.log('开启评论窗口');
                            DyComment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                            Log.log('评论了');
                            tCommon.back(2);
                        } else {
                            tCommon.back();//从视频页面到用户页面
                        }
                    }

                    tCommon.sleep(1000);
                    Log.log('back 1');
                    tCommon.back();
                    System.toast('操作间隔：' + machine.get('task_dy_toker_live_focus_rate', 'int'));
                    tCommon.sleep(machine.get('task_dy_toker_live_focus_rate', 'int') * 1000);
                }

                if (hiddenI++ >= 3) {
                    break;
                }
                Log.log('下一页');
                DyLive.swipeFansList();
                tCommon.sleep(2000);
            }
            System.toast('休眠2分钟后继续执行');
            tCommon.sleep(120 * 1000);//休眠2分钟
        }
    },
}

let input = machine.get('task_dy_toker_live_account') || '';

if (!input) {
    System.toast('你取消了任务');
    System.exit();
}

let preIndex = machine.get('task_dy_toker_live_index', 'int');

if (!preIndex) {
    preIndex = 0;
}

tCommon.openApp();
//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {
        let res = task.run(input, preIndex);
        if (res == true) {
            tCommon.sleep(5000);
            FloatDialogs.show('提示', '任务完成了');
            break;
        }

        if (res === -1) {
            //设置隐私了，不能操作
            tCommon.sleep(5000);
            FloatDialogs.show('提示', '直播间用户被设置隐私，不能操作');
            break;
        }
        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        tCommon.closeAlert(1);
        tCommon.backHome();
    }
}
