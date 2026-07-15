let tCommon = require("../app/dy/Common");
let DyIndex = require("../app/dy/Index");
let DySearch = require("../app/dy/Search");
let DyUser = require("../app/dy/User");
let DyVideo = require("../app/dy/Video");
let DyComment = require("../app/dy/Comment");
let storage = require("../common/storage");
let machine = require("../common/machine");
let baiduWenxin = require("../service/baiduWenxin");
let statistics = require("../common/statistics");

let task = {
    index: -1,
    nicknames: [],
    contents: [],
    /**
     * 
     * @param {string} input 
     * @param {string} kw 
     * @returns 
     */
    run(input, kw) {
        return this.testTask(input, kw);
    },

    
    //type 0 评论，1私信
    /**
     * 
     * @param {number} type 
     * @param {string} [title] 
     * @param {number} [age] 
     * @param {number} [gender] 
     * @returns {any}
     */
    getMsg(type, title, age, gender = 2) {
        let genderStr = ['女', '男', '未知'][gender];
        if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, genderStr) : baiduWenxin.getComment(title) };
        }
        return machine.getMsg(type) || false;//永远不会结束
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-comment-" + file + ".txt";
        Log.setFile(allFile);
    },

    /**
     * 
     * @param {string} str 
     * @param {string[]} kw 
     * @returns 
     */
    includesKw(str, kw) {
        for (let i in kw) {
            if (str.includes(kw[i])) {
                return true;
            }
        }
        return false;
    },

    /**
     * 
     * @param {any} input 
     * @param {any} kw 
     * @returns 
     */
    testTask(input, kw) {
        //首先进入页面
        this.index++;
        input = input.replace("\r", "").split("\n");
        if (this.index >= input.length) {
            this.index = 0;
        }
        let douyin = input[this.index];
        /**
         * 0.23 复制打开抖音，看看【留住芳华⭐的作品】漫长等待，终迎曙光，白玉山地铁缓缓而来。# 城市记... https://v.douyin.com/yPH8ccZBmHM/ 11/10 s@E.uS YZm:/ 
         */
        Log.log('打开链接', douyin, tCommon.packageName());
        App.openUrl(douyin, tCommon.packageName());
        tCommon.sleep(8000 + 1000 * Math.random());

        kw = tCommon.splitKeyword(kw);
        Log.log('账号：', input);
        Log.log('关键词：', kw);

        let title = DyVideo.getContent();
        let commentCount = DyVideo.getCommentCount();

        statistics.viewVideo();
        statistics.viewTargetVideo();

        DyVideo.openComment(!!commentCount);
        tCommon.sleep(2000 + 1000 * Math.random());
        while (true) {
            let comments = DyComment.getList();
            for (let k in comments) {
                /** @ts-ignore */
                if (!comments[k]['content'] || !this.includesKw(comments[k]['content'], kw) || this.nicknames.includes(comments[k].nickname)) {
                    /** @ts-ignore */
                    Log.log('数据：', comments[k]['content'], kw, this.nicknames.includes(comments[k].nickname));
                    continue;
                }

                if (machine.get('task_dy_toker_comment_' + douyin + '_' + comments[k].nickname, 'bool')) {
                    Log.log('重复');
                    continue;
                }
                Log.log('找到了关键词', comments[k]['content']);

                try {
                    if (DyComment.isZan()) {
                        continue;
                    } else {
                        DyComment.clickZan(comments[k]);
                    }
                } catch (e) {
                    Log.log('异常处理：', e);
                    continue;
                }

                /** @ts-ignore */
                this.nicknames.push(comments[k].nickname);
                machine.set('task_dy_toker_comment_' + douyin + '_' + comments[k].nickname, true);
                try {
                    let res = DyComment.intoUserPage(comments[k]);
                    Log.log('是否进入用户页面：', res);
                } catch (e) {
                    Log.log('进入用户页异常处理：', e);
                    break;
                }
                //私密账号
                if (DyUser.isPrivate()) {
                    tCommon.back();
                    tCommon.sleep(500);
                    Log.log('私密账号');
                    continue;
                }

                //开始操作评论
                System.setAccessibilityMode('!fast');
                try {
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
                } catch (e) {
                    Log.log('异常了', e);
                    tCommon.sleep(2000);
                    DyUser.backHome();
                }
                tCommon.back();
                System.setAccessibilityMode('fast');
                tCommon.sleep(1000);
            }

            Log.log('下一页评论');
            if (!tCommon.swipeCommentListOp()) {
                tCommon.back();
                tCommon.sleep(1000);
                Log.log('到底了');
                break;
            }
            tCommon.sleep(1500 + 500 * Math.random());
        }
        Log.log('下一个视频');
        /** @ts-ignore */
        this.contents.push(title);
        tCommon.sleep(4000 + Math.random() * 2000);

        tCommon.back(2, 1500);
        tCommon.backApp();
        this.contents = [];
        return true;//重启
    },
}

let input = machine.get('task_dy_toker_comment_video');
Log.log("input内容：" + machine.get('task_dy_toker_comment_video', 'string'));
if (!input) {
    FloatDialogs.toast('请输入账号');
    System.exit();
}

let kw = machine.get('task_dy_toker_comment_kw');

Log.log("keyword：" + machine.get('task_dy_toker_comment_kw'));
if (!kw) {
    FloatDialogs.toast('请输入关键词');
    System.exit();
}

tCommon.openApp();
System.setAccessibilityMode('fast');
//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {
        /** @type {any} */
        let r = task.run(input, kw);
        if (r === 'exit') {
            FloatDialogs.show('找不到用户，停止执行');
            break;
        }

        if (r === "break") {
            FloatDialogs.show('执行完成');
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