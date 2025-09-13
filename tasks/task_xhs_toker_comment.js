let tCommon = require("app/xhs/Common");
let XhsIndex = require("app/xhs/Index");
let XhsSearch = require("app/xhs/Search");
let XhsUser = require("app/xhs/User");
let XhsWork = require("app/xhs/Work");
let XhsComment = require("app/xhs/Comment");
let storage = require("common/storage");
let machine = require("common/machine");
let baiduWenxin = require("service/baiduWenxin");
let statistics = require("common/statistics");

let task = {
    index: -1,
    nicknames: [],
    ignoreTitles: [],
    run(input, kw, sleepSecond) {
        return this.testTask(input, kw, sleepSecond);
    },

    ips: '',
    getIp() {
        this.ips = machine.get('task_xhs_toker_comment_ip', 'string');
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
        let allFile = "log/log-xhs-toker-comment-" + file + ".txt";
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

    testTask(input, kw, sleepSecond) {
        //首先进入页面
        this.index++;
        this.ignoreTitles = [];
        this.getIp();
        XhsIndex.intoSearchPage();
        input = tCommon.splitKeyword(input);
        let douyin = input[this.index];

        kw = tCommon.splitKeyword(kw);
        Log.log('账号：', input);
        Log.log('关键词：', kw);

        if (this.index >= input.length) {
            this.index = 0;
        }

        tCommon.sleep(2000 + 2000 * Math.random());
        let res = XhsSearch.intoUserVideoPage(input[this.index]);
        if (!res) {
            System.toast('找不到用户账号：' + input);
            return 'exit';
        }

        //获取最新的前三视频
        let i = 3;
        while (i-- > 0) {
            Log.log('进入一个视频', 3 - i);
            let r = XhsUser.intoVideoX(this.ignoreTitles, 3);
            if (r === -1) {
                break;
            }
            //let title = XhsWork.getContent();
            let commentCount = XhsWork.getCommentCount();
            if (commentCount === 0) {
                Log.log('评论为0 ，下一个视频', i);
                tCommon.back();
                tCommon.sleep(2000 + 2000 * Math.random());
                continue;
            }

            statistics.viewVideo();
            statistics.viewTargetVideo();
            let isVideo = XhsWork.isVideo();
            XhsWork.openComment();
            Log.log('打开或者滑动到评论区域');

            tCommon.sleep(2000 + 1000 * Math.random());
            let maxSwipe = commentCount;//最多滑动次数
            while (maxSwipe-- > 0) {
                let comments = XhsWork.getCommenList();//nicknameTag列表
                for (let k in comments) {
                    let nickname = comments[k].nicknameTag.text();
                    if (comments[k]['content'] == "" || !this.includesKw(comments[k]['content'], kw) || this.nicknames.includes(nickname)) {
                        Log.log('数据：', comments[k]['content'], !this.includesKw(comments[k]['content'], kw), this.nicknames.includes(nickname));
                        continue;
                    }

                    if (machine.get('task_xhs_toker_comment_' + douyin + '_' + nickname, 'bool')) {
                        Log.log('重复');
                        continue;
                    }
                    Log.log('找到了关键词', comments[k]['content'], comments[k]['ip']);
                    if (this.ips && !tCommon.containsWord(this.ips, comments[k]['ip'])) {
                        Log.log('不包含ip', comments[k]['ip']);
                        continue;
                    }

                    XhsComment.clickZan(comments[k].zanTag);
                    this.nicknames.push(nickname);
                    machine.set('task_xhs_toker_comment_' + douyin + '_' + nickname, true);
                    XhsComment.intoUserPage(comments[k].nicknameTag);
                    //私密账号
                    if (XhsUser.isPrivate()) {
                        tCommon.back();
                        tCommon.sleep(1000 + 500 * Math.random());
                        Log.log('私密账号');
                        continue;
                    }

                    //开始操作评论
                    if (XhsUser.intoVideo()) {
                        Log.log('有视频，直接操作视频引流');
                        XhsWork.zan();
                        let msg = this.getMsg(0, XhsWork.getContent());
                        if (msg) {
                            XhsWork.msg(0, msg.msg);///////////////////////////////////操作  评论视频
                            Log.log('评论了');
                            // if(XhsWork.isVideo()){
                            //     tCommon.back();
                            //     tCommon.sleep(1000 + 1000 * Math.random());
                            // }
                        }
                        tCommon.back();//从视频页面到用户页面
                    } else {
                        Log.log('无视频，直接操作关注和私信引流');
                        XhsUser.focus();
                        let msg = this.getMsg(1, comments[k].nickname);
                        if (msg) {
                            XhsUser.privateMsg(msg.msg);
                        }
                    }
                    tCommon.back();
                    tCommon.sleep(1000);
                }

                if (UiSelector().className('android.widget.TextView').textContains('- 到底了 -').isVisibleToUser(true).findOne()) {
                    tCommon.sleep(1000);
                    Log.log('评论扫描完了，已到底');
                    break;
                }

                Log.log('下一页评论');
                XhsWork.commentListSwipe();
                tCommon.sleep(1500 + 500 * Math.random());
            }

            if (isVideo) {
                tCommon.back();
                tCommon.sleep(1000 + 1000 * Math.random());//注意，如果是视频，这里需要返回一次（关闭评论框）
            }
            tCommon.back();
            tCommon.sleep(4000 + Math.random() * 2000);
        }

        tCommon.back(5, 1500);
        tCommon.backApp();
        if (this.index === input.length - 1) {
            System.toast('一轮完成，休息' + sleepSecond + '秒');
            Log.log('一轮完成，休息' + sleepSecond + '秒');
            tCommon.sleep(sleepSecond * 1000);//休眠十分钟
        } else {
            System.toast('一个账号完成，休息3分钟');
            Log.log('一个账号完成，休息3分钟');
            tCommon.sleep(sleepSecond * 1000);//休眠十分钟
        }
        return true;//重启
    },
}

let input = machine.get('task_xhs_toker_comment_account');
Log.log("input内容：" + machine.get('task_xhs_toker_comment_account', 'string'));
if (!input) {
    System.toast('请输入账号');
    System.exit();
}

let kw = machine.get('task_xhs_toker_comment_kw');

Log.log("keyword：" + machine.get('task_xhs_toker_comment_kw'));
if (!kw) {
    System.toast('请输入关键词');
    System.exit();
}

let sleepSecond = machine.get('task_xhs_toker_comment_sleep_second', "int");

if (sleepSecond <= 0) {
    System.toast('休眠时间不能为空');
    System.exit();
}

tCommon.openApp();

while (true) {
    task.log();
    try {
        let r = task.run(input, kw, sleepSecond);
        if (r === 'exit') {
            tCommon.sleep(3000);
            FloatDialogs.show('找不到用户，停止执行');
            break;
        }

        if (r) {
            throw new Error('一个任务完成，重启，进入新的账号');
        }

        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        tCommon.backHome();
    }
}