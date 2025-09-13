let tCommon = require("app/dy/Common");
let DyIndex = require('app/dy/Index.js');
// let DySearch = require('app/dy/Search.js');
// const DyUser = require('app/dy/User.js');
let DyVideo = require('app/dy/Video.js');
// let DyComment = require('app/dy/Comment.js');

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    rp: 0,
    run() {
        return this.testTask();
    },

    log(){
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-cancel-zan-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask() {
        //首先进入点赞页面
        DyIndex.intoMyPage();
        let res = DyIndex.intoMyLikeVideo();
        if (!res) {
            this.rp++; //没有视频，三次之后确定全部取消了
            if (this.rp >= 3) {
                return true;//完成了
            }
            Log.log('错误');
            return System.toast('错误');
        }

        this.rp = 0;//有视频
        let container = [];
        let _rp = 0;
        while (true) {
            //查看是不是直播中
            Log.log('开始');
            let title = DyVideo.getContent();
            let nickname;
            if (DyVideo.isLiving()) {
                Log.log('直播中的主播');
                try {
                    nickname = DyVideo.getLivingNickname();
                } catch (e) {
                    nickname = 'living';
                }
            } else {
                Log.log('不是直播');
                nickname = DyVideo.getNickname();
            }

            Log.log('nickname:title', nickname + ':' + title);
            if (container.includes(nickname + ':' + title)) {
                DyVideo.next();
                _rp++;
                if (_rp >= 3) {
                    Log.log('_rp', _rp);
                    return false;//这里可能还没有完成 可能是各种问题导致的卡顿
                }
                continue;
            }
            container.push(nickname + ':' + title);
            _rp = 0;

            let isZan = DyVideo.isZan();
            Log.log('isZan', isZan);
            if (isZan) {
                DyVideo.clickZan();
            }
            tCommon.sleep(1500);
            DyVideo.next();
        }
    },
}

tCommon.openApp();
Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        if (task.run()) {
            tCommon.sleep(1000);
            FloatDialogs.show('提示', '一键取赞完成');
            break;
        }
        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        tCommon.closeAlert(1);
        tCommon.backHome();
    }
}
