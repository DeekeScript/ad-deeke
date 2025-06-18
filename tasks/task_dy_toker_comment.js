let tCommon = require("app/dy/Common");
let DyIndex = require("app/dy/Index");
let DySearch = require("app/dy/Search");
let DyUser = require("app/dy/User");
let DyVideo = require("app/dy/Video");
let DyComment = require("app/dy/Comment");
let storage = require("common/storage");
let machine = require("common/machine");
let baiduWenxin = require("service/baiduWenxin");
let statistics = require("common/statistics");

let task = {
    index: -1,
    nicknames: [],
    contents: [],
    run(input, kw, sleepSecond) {
        return this.testTask(input, kw, sleepSecond);
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

    testTask(input, kw, sleepSecond) {
        //首先进入页面
        let intoUserFansList = input.indexOf('+') === 0;
        let hasRemark = tCommon.getRemark(input);
        this.index++;
        let douyin;
        if (!hasRemark) {
            if (intoUserFansList) {
                input = input.substring(1);
                DyIndex.intoMyPage();
                DyUser.intoFocusList();
                tCommon.sleep(3000);
            } else {
                DyIndex.intoSearchPage();
            }
            input = tCommon.splitKeyword(input);
            douyin = input[this.index];
        } else {
            input = input.substring(1);
            input = tCommon.splitKeyword(input);
            douyin = input[this.index];
            App.gotoIntent('snssdk1128://user/profile/' + douyin);
            tCommon.sleep(5000 + 2000 * Math.random());
            DyVideo.intoUserVideo();
        }

        kw = tCommon.splitKeyword(kw);
        Log.log('账号：', input);
        Log.log('关键词：', kw);

        if (this.index >= input.length) {
            this.index = 0;
        }

        let res;
        if (!hasRemark) {
            if (intoUserFansList) {
                res = DyUser.focusListSearch(douyin);
            } else {
                res = DySearch.intoUserVideoPage(input[this.index], 1);
            }

            if (!res) {
                System.toast('找不到用户账号：' + input);
                return 'exit';
            }

            if (intoUserFansList) {
                DyVideo.intoUserVideo();
            }
        }

        //获取最新的前三视频
        let i = 3;
        while (i-- > 0) {
            let title = DyVideo.getContent();
            let commentCount = DyVideo.getCommentCount();
            if (commentCount === 0 || this.contents.includes(title)) {
                Log.log('下一个视频', i);
                DyVideo.next();
                tCommon.sleep(3000);
                continue;
            }

            statistics.viewVideo();
            statistics.viewTargetVideo();

            DyVideo.openComment(commentCount);
            tCommon.sleep(2000 + 1000 * Math.random());
            let rp = 0;
            let lastComment = undefined;
            let maxSwipe = 1200;
            while (true) {
                let comments = DyComment.getList();
                maxSwipe--;
                if (maxSwipe <= 0) {
                    tCommon.back();
                    tCommon.sleep(1000);
                    Log.log('滑动了1200次了');
                    break;
                }

                if (JSON.stringify(comments) === lastComment) {
                    rp++;
                } else {
                    rp = 0;
                }
                // Log.log(JSON.stringify(comments), lastComment, rp);

                if (rp >= 3) {
                    tCommon.back();
                    tCommon.sleep(1000);
                    Log.log('评论扫描完了');
                    break;
                }
                lastComment = JSON.stringify(comments);

                for (let k in comments) {
                    if (comments[k]['content'] == "" || !this.includesKw(comments[k]['content'], kw) || this.nicknames.includes(comments[k].nickname)) {
                        Log.log('数据：', comments[k]['content'], !this.includesKw(comments[k]['content'], kw), this.nicknames.includes(comments[k].nickname));
                        continue;
                    }

                    if (machine.get('task_dy_toker_comment_' + douyin + '_' + comments[k].nickname, 'bool')) {
                        Log.log('重复');
                        continue;
                    }
                    Log.log('找到了关键词', comments[k]['content']);

                    try {
                        if (!DyComment.isZan()) {
                            DyComment.clickZan(comments[k]);
                        }
                    } catch (e) {
                        Log.log('异常处理：', e);
                        continue;
                    }

                    this.nicknames.push(comments[k].nickname);
                    machine.set('task_dy_toker_comment_' + douyin + '_' + comments[k].nickname, true);
                    DyComment.intoUserPage(comments[k]);
                    //私密账号
                    if (DyUser.isPrivate()) {
                        tCommon.back();
                        tCommon.sleep(500);
                        Log.log('私密账号');
                        continue;
                    }

                    //开始操作评论
                    if (DyVideo.intoUserVideo()) {
                        Log.log('有视频，直接操作视频引流');
                        DyVideo.clickZan();
                        let msg = this.getMsg(0, DyVideo.getContent());
                        if (msg) {
                            DyVideo.openComment(!!DyVideo.getCommentCount());
                            Log.log('开启评论窗口');
                            DyComment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                            Log.log('评论了');
                            tCommon.back(2);//视频页面回到用户页面
                        } else {
                            tCommon.back();//从视频页面到用户页面
                        }
                    } else {
                        Log.log('无视频，直接操作关注和私信引流');
                        DyUser.focus();
                        let msg = this.getMsg(1, comments[k].nickname, DyUser.getAge(), DyUser.getGender());
                        if (msg) {
                            DyUser.privateMsg(msg.msg);
                        }
                    }
                    tCommon.back();
                    tCommon.sleep(1000);
                }

                Log.log('下一页评论');
                tCommon.swipeCommentListOp();
                tCommon.sleep(1500 + 500 * Math.random());
            }
            Log.log('下一个视频', i);
            this.contents.push(title);
            DyVideo.next();
            tCommon.sleep(4000 + Math.random() * 2000);
        }

        if (intoUserFansList) {
            tCommon.back(5, 1500);
        } else {
            tCommon.back(5, 1500);
        }

        tCommon.backApp();
        if (this.index === input.length - 1) {
            System.toast('一轮完成，休息' + sleepSecond + '秒');
            Log.log('一轮完成，休息' + sleepSecond + '秒');
            tCommon.sleep(sleepSecond * 1000);//休眠十分钟
        } else {
            System.toast('一个账号完成，休息3分钟');
            Log.log('一个账号完成，休息3分钟');
            tCommon.sleep(180 * 1000);//休眠十分钟
        }
        return true;//重启
    },
}

let input = machine.get('task_dy_toker_comment_account');
Log.log("input内容：" + machine.get('task_dy_toker_comment_account', 'string'));
if (!input) {
    System.toast('请输入账号');
    System.exit();
}

let kw = machine.get('task_dy_toker_comment_kw');

Log.log("keyword：" + machine.get('task_dy_toker_comment_kw'));
if (!kw) {
    System.toast('请输入关键词');
    System.exit();
}

let sleepSecond = machine.get('task_dy_toker_comment_sleep_second', "int");

if (sleepSecond <= 0) {
    System.toast('休眠时间不能为空');
    System.exit();
}

tCommon.openApp();
//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {
        let r = task.run(input, kw, sleepSecond);
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
        tCommon.backHome();
    }
}