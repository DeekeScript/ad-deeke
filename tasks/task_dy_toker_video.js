let tCommon = require("app/dy/Common");
let DyUser = require("app/dy/User");
let DySearch = require("app/dy/Search");
let DyVideo = require("app/dy/Video");
let DyComment = require("app/dy/Comment");
let storage = require("common/storage");
let machine = require("common/machine");
let baiduWenxin = require("service/baiduWenxin");
let statistics = require("common/statistics");

let task = {
    nicknames: [],
    contents: [],
    run(input, sleepSecond) {
        return this.testTask(input, sleepSecond);
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
        let allFile = "log/log-comment-" + file + ".txt";
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

    testTask(input, sleepSecond) {
        //首先进入页面
        let commentKw = tCommon.splitKeyword(input);
        Log.log('评论关键词：', commentKw);
        DySearch.intoSearchVideo();

        let rateCount = storage.get('task_dy_toker_live_video_zan_head_rate', 'int') + storage.get('task_dy_toker_live_video_focus_rate', 'int') + storage.get('task_dy_toker_live_video_zan_comment_rate', 'int');
        let zanHeadRate = 0;
        let zanCommentRate = 0;
        let focuRate = 0;
        if (rateCount > 0) {
            zanHeadRate = storage.get('task_dy_toker_live_video_zan_head_rate', 'int') / rateCount;
            zanCommentRate = storage.get('task_dy_toker_live_video_zan_comment_rate', 'int') / rateCount;
            focuRate = storage.get('task_dy_toker_live_video_focus_rate', 'int') / rateCount;
        }
        Log.log('总的点赞：', rateCount, zanCommentRate, zanHeadRate, focuRate);

        while (true) {
            tCommon.sleep(4000 + Math.random() * 2000);
            let title = DyVideo.getContent();
            let commentCount = DyVideo.getCommentCount();
            statistics.viewVideo();
            if (commentCount === 0 || this.contents.includes(title)) {
                Log.log('下一个视频');
                DyVideo.next();
                continue;
            }

            statistics.viewTargetVideo();
            DyVideo.openComment(commentCount);
            tCommon.sleep(2000 + 1000 * Math.random());

            let rp = 0;
            let lastComment = [];
            let firstComment = true;
            while (true) {
                let comments = DyComment.getList();
                if (comments.length == 0) {
                    tCommon.back();
                    tCommon.sleep(1000);
                    Log.log('没有评论内容');
                    break;
                }

                if (lastComment.length == 2 && lastComment[0] == lastComment[1]) {
                    rp++;
                } else {
                    rp = 0;
                }

                lastComment.push(comments[0].nickname + ':' + comments[0].content);
                if (lastComment.length > 2) {
                    lastComment.shift();
                }

                if (rp >= 3) {
                    tCommon.back();
                    tCommon.sleep(1000);
                    Log.log('评论扫描完了');
                    break;
                }

                for (let k in comments) {
                    if (firstComment && Math.random() * 100 <= storage.get('task_dy_toker_live_video_comment_first_comment_rate', 'int')) {
                        DyComment.backMsg(comments[k], this.getMsg(0, comments[k].content).msg);
                        Log.log('首评');
                        tCommon.sleep(1000);
                        comments = DyComment.getList();
                        firstComment = false;
                        continue;
                    }
                    firstComment = false;
                    Log.log('comments[k]', comments[k]);
                    if (!comments[k]) {
                        continue;
                    }

                    if (comments[k]['content'] == "" || !this.includesKw(comments[k]['content'], commentKw) || this.nicknames.includes(comments[k].nickname)) {
                        Log.log('数据：', comments[k]['content'], !this.includesKw(comments[k]['content'], commentKw), this.nicknames.includes(comments[k].nickname));
                        continue;
                    }

                    if (machine.get('task_dy_toker_video_' + comments[k].nickname, 'bool')) {
                        Log.log('重复');
                        continue;
                    }

                    Log.log('找到了关键词', comments[k]['content']);
                    let opRate = Math.random();
                    if (opRate <= zanHeadRate) {
                        DyComment.intoUserPage(comments[k]);
                        if (DyUser.isPrivate()) {
                            tCommon.back();
                        } else {
                            DyUser.zanHead();
                            tCommon.sleep(1000 + 1000 * Math.random());
                            tCommon.back();
                        }
                    } else if (opRate <= zanHeadRate + zanCommentRate) {
                        try {
                            Log.log('点赞');
                            if (!DyComment.isZan()) {
                                DyComment.clickZan(comments[k]);
                                tCommon.sleep(1000 + 1000 * Math.random());
                            }
                        } catch (e) {
                            Log.log('异常处理：', e);
                            continue;
                        }
                    } else {
                        DyComment.intoUserPage(comments[k]);
                        if (DyUser.isPrivate()) {
                            tCommon.back();
                        } else {
                            DyUser.focus();
                            Log.log('关注');
                            tCommon.sleep(1000 + 1000 * Math.random());
                            tCommon.back();
                        }
                    }

                    this.nicknames.push(comments[k].nickname);
                    machine.set('task_dy_toker_video_' + comments[k].nickname, true);
                    tCommon.sleep(sleepSecond * 1000);
                }

                Log.log('下一页评论');
                tCommon.swipeCommentListOp();
                tCommon.sleep(1500 + 500 * Math.random());
            }
            Log.log('下一个视频');
            this.contents.push(title);
            DyVideo.next();
        }
    },
}

let input = machine.get('task_dy_toker_live_video_comment_keyword');
Log.log("input内容：" + machine.get('task_dy_toker_live_video_comment_keyword', 'string'));
if (!input) {
    System.toast('请输入评论关键词');
    System.exit();
}

//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {
        let r = task.run(input, storage.get('task_dy_toker_live_video_second', 'int'));
        if (r === 'exit') {
            if (thr) {
                tCommon.sleep(3000);
                FloatDialogs.show('找不到用户，停止执行');
            }
            break;
        }

        if (r) {
            throw new Error('一个任务完成，重启，进入新的账号');
        }

        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        tCommon.closeAlert(1);
    }
}