let tCommon = require("app/dy/Common");
let DyIndex = require('app/dy/Index.js');
const DyUser = require('app/dy/User.js');
let DyVideo = require('app/dy/Video.js');
let DyComment = require('app/dy/Comment.js');
let storage = require("common/storage");
let baiduWenxin = require("service/baiduWenxin");
let machine = require("common/machine");

let task = {
    msg: [],
    titles: [],
    nicknames: [],
    me: {},
    startTime: undefined,
    setting: {
        keyword: '',
        videoOpRate: 100,
        commentRate: 100,
        zanRate: 100,
        zanCommentRate: 100,
        zanCount: 5,
    },

    run() {
        return this.testTask(this.setting);
    },

    getMsg(type, title, age, gender) {
        if (storage.get('setting_baidu_wenxin_switch',  'bool')) {
            let res = { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
            return res.msg;
        }
        // let rd = Math.round(Math.random() * (this.msg.length - 1));
        // return this.msg[rd];
        return machine.getMsg(type) || false;//永远不会结束
    },

    log(){
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-fans-inc-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask(setting) {
        //首先进入点赞页面
        DyIndex.intoMyPage();
        this.me = {
            nickname: DyUser.isCompany() ? DyUser.getDouyin() : DyUser.getNickname(),
            douyin: DyUser.getDouyin(),
            focusCount: DyUser.getFocusCount(),
        }

        tCommon.toast(JSON.stringify({
            '账号：': this.me.douyin,
            '昵称：': this.me.nickname,
        }));
        DyIndex.intoHome();

        let noTitleCount = 5;
        let rpCount = 0;
        let errorCount = 0;
        while (true) {
            if (!this.startTime) {
                this.startTime = Date.parse(new Date()) / 1000;
            }

            //刷1个小时，休息 5-10分钟
            if (Date.parse(new Date()) / 1000 - this.startTime > 3600) {
                this.startTime = Date.parse(new Date()) / 1000;
                tCommon.backApp();
                tCommon.sleep((5 + 5 * Math.random()) * 60 * 1000);
                tCommon.openApp();
                Log.log('休息一会儿');
            }

            DyVideo.next();
            tCommon.sleep(1000 + 500 * Math.random());
            tCommon.toast('滑动视频');
            try {
                let lookStartTime = Date.parse(new Date()) / 1000;
                let vContent = DyVideo.getContent();
                if (!vContent) {
                    noTitleCount--;
                    if (noTitleCount <= 0) {
                        throw new Error('可能异常！');
                    }
                    DyVideo.videoSlow();
                    continue;
                }

                noTitleCount = 5;
                if (DyVideo.isLiving()) {
                    tCommon.toast('直播中，切换下一个视频');
                    DyVideo.videoSlow();
                    continue;
                }

                let vNickname = DyVideo.getNickname();
                let unique = vNickname + '_' + vContent;
                if (this.titles.includes(unique)) {
                    tCommon.toast('重复视频');
                    rpCount++;
                    if (rpCount >= 3) {
                        throw new Error('三次都没有解决错误，重启');
                    }
                    continue;
                }

                rpCount = 0;
                if (this.titles.length >= 1000) {
                    this.titles.shift();
                }

                this.titles.push(unique);

                if (this.nicknames.includes(vNickname)) {
                    tCommon.toast(vNickname + '：重复');
                    continue;
                }

                if (this.nicknames.length > 3000) {
                    this.nicknames.shift();
                }

                this.nicknames.push(vNickname);
                let sleepSecond = Date.parse(new Date()) / 1000 - lookStartTime;//每个视频随机观看5-20秒
                //
                if (Math.random() > setting.videoOpRate / 100) {
                    Log.log('不观看');
                    continue;
                }

                this.deal(sleepSecond, setting.zanRate, setting.commentRate, setting.zanCommentRate, setting.zanCount);//观看，评论，点赞
            } catch (e) {
                errorCount++
                Log.log(e);
                if (errorCount > 3) {
                    throw new Error('三次都没有解决错误');
                }
                continue;
            }
            errorCount = 0;
        }
    },

    getSecond(sleepSecond, sleepSec) {
        if (sleepSec >= sleepSecond) {
            return sleepSec - sleepSecond;
        }
        return 0.1;
    },

    deal(sleepSecond, zanRate, commentRate, zanCommentRate, zanCount) {
        let processBar = DyVideo.getProcessBar();
        //Log.log('processBar', processBar, processBar && processBar.bounds().height(), processBar && processBar.bounds().top);
        if (storage.getPackage() !== 'org.autojs.autoxjs.v6') {
            if (processBar) {
                let sleepSec = 20 + 20 * Math.random() - 5;
                Log.log('休眠' + this.getSecond(sleepSecond, sleepSec) + 's');
                tCommon.sleep(this.getSecond(sleepSecond, sleepSec) * 1000);//最后减去视频加载时间  和查询元素的时间
            } else {
                let sleepSec = (15 + 10 * Math.random() - 5);
                Log.log('休眠' + this.getSecond(sleepSecond, sleepSec) + 's');
                tCommon.sleep(this.getSecond(sleepSecond, sleepSec) * 1000);//最后减去视频加载时间  和查询元素的时间
            }
        } else {
            let sleepSec = (5 + 10 * Math.random() - 5);
            Log.log('休眠' + this.getSecond(sleepSecond, sleepSec) + 's');
            tCommon.sleep(this.getSecond(sleepSecond, sleepSec) * 1000);//最后减去视频加载时间  和查询元素的时间
        }

        if (Math.random() <= zanRate) {
            DyVideo.clickZan();
            tCommon.sleep(1000 + 1000 * Math.random());
        }

        let zanCommentRage2 = Math.random();
        let zanComment = false;

        if (Math.random() <= commentRate) {
            let videoTitle = DyVideo.getContent();
            DyVideo.openComment(!!DyVideo.getCommentCount());
            Log.log('开启评论窗口-1');
            DyComment.commentMsg(this.getMsg(0, videoTitle).msg);//操作  评论视频
            Log.log('评论了');
            tCommon.sleep(1000 + 1000 * Math.random());
            if (zanCommentRage2 <= zanCommentRate) {
                zanComment = true;
                DyComment.zanComment(tCommon, zanCount, this.me.nickname);
                Log.log('路径1');
            } else {
                tCommon.back(800);
            }

            tCommon.sleep(1000 + 1000 * Math.random());
        }

        if (!zanComment && zanCommentRage2 <= zanCommentRate) {
            DyComment.zanComment(tCommon, zanCount, this.me.nickname);
            Log.log('路径2');
        }
    },
}

task.setting = machine.getFansIncPageRate();
Log.log('fansIncPageRate', task.setting);

tCommon.openApp();

let thr = undefined;
while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        if (task.run()) {
            if (thr) {
                thr.interrupt();
                Threads.shutDownAll();
                tCommon.sleep(1000);
            }
            FloatDialogs.show('提示', '直播结束了');
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
