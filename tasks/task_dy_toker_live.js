import { Common as tCommon } from "app/dy/Common";
import { Index as DyIndex } from "app/dy/Index";
import { Search as DySearch } from "app/dy/Search";
import { Comment as DyComment } from "app/dy/Comment";
import { User as DyUser } from "app/dy/User";
import { Video as DyVideo } from "app/dy/Video";
import { storage } from "common/storage";
import { machine } from "common/machine";
import { Live as DyLive } from "app/dy/Live";
import { baiduWenxin } from "service/baiduWenxin";

let task = {
    index: -1,
    nicknames: [],
    intoErrorCount: 0,//根据错误次数判断直播是否结束
    run(input, preIndex) {
        return this.testTask(input, preIndex);
    },

    getMsg(type, title, age, gender) {
        if (storage.get('setting_baidu_wenxin_switch',  'bool')) {
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
        //首先进入页面
        DyIndex.intoSearchPage();
        Log.log('账号：', douyin);
        Log.log('preIndex:', preIndex);
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

        this.intoErrorCount = 0;

        let rp = 0;
        while (true) {
            DyLive.openUserList();
            let onlineTag = new UiSelector().descContains('在线观众').textContains('在线观众').filter((v) => {
                return v && v.bounds() && v.bounds().top && v.bounds().width() && v.bounds().height() && v.bounds().top + v.bounds().height() < Device.height();
            }).findOne(2000);

            if (!onlineTag) {
                throw new Error('找不到“在线观众”tag');
            }

            let lastUser = undefined;
            while (true) {
                let users = DyLive.getUsers();
                if (JSON.stringify(users) === lastUser) {
                    rp++;
                } else {
                    rp = 0;
                }

                if (rp >= 3) {
                    tCommon.back();
                    tCommon.sleep(1000);
                    Log.log('扫描完了');
                    break;
                }

                lastUser = JSON.stringify(users);
                for (let k in users) {
                    if (this.nicknames.includes(users[k].title)) {
                        continue;
                    }

                    Log.log('index', users[k].index * 1);
                    if (users[k].index * 1 <= preIndex) {
                        continue;
                    }

                    let tmp = /第\d+名/.exec(users[k].title);
                    let title = users[k].title;
                    if (tmp && tmp[0]) {
                        title = title.replace(tmp[0], '');
                    }

                    if (title.indexOf('***') !== -1) {
                        return -1;
                    }

                    if (machine.get('task_dy_toker_live_' + douyin + '_' + title, 'bool')) {
                        Log.log('重复');
                        continue;
                    }

                    if (users[k].tag.bounds().top <= onlineTag.bounds().top + onlineTag.bounds().height()) {
                        Log.log('边界超出');
                        continue;
                    }

                    Log.log('开始操作用户：', title, machine.get('task_dy_toker_live_' + douyin + '_' + title, 'bool'));
                    this.nicknames.push(users[k].title);
                    machine.set('task_dy_toker_live_' + douyin + '_' + title, true);
                    Log.log('设置后：' + machine.get('task_dy_toker_live_' + douyin + '_' + title, 'bool'));
                    Log.log('进入粉丝列表');
                    DyLive.intoFansPage(users[k]);
                    if (DyUser.isPrivate()) {
                        Log.log('私密账号');
                        tCommon.back(1, 1000);
                        continue;
                    }

                    //开始操作评论
                    if (DyVideo.intoUserVideo()) {
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
                    } else {
                        Log.log('无视频，直接操作关注和私信引流');
                        try {
                            DyUser.focus();
                            let msg = this.getMsg(1, DyUser.getNickname(), DyUser.getAge(), DyUser.getGender());
                            if (msg) {
                                DyUser.privateMsg(msg.msg);
                            }
                        } catch (e) {
                            Log.log(e);
                        }
                    }
                    tCommon.sleep(1000);
                    Log.log('back 1');
                    tCommon.back();
                    tCommon.sleep(2000);
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
while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        Engines.executeScript("unit/dialogClose.js");
        let res = task.run(input, preIndex);
        if (res) {
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
        Log.log(e.stack);
        tCommon.backHome();
    }
}

try {
    Engines.closeAll(true);
} catch (e) {
    Log.log('停止脚本');
}
