let tCommon = require("app/dy/Common");
let DyIndex = require('app/dy/Index.js');
let DyVideo = require('app/dy/Video.js');

let task = {
    rp: 0,
    run() {
        return this.testTask();
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-cancel-zan-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask() {
        //首先进入点赞页面
        DyIndex.intoMyPage();
        let res = DyIndex.intoLikeVideo();
        if (!res) {
            FloatDialogs.toast('未进入视频页面，请检查当前账号是否有“喜欢”视频');
            return true;
        }

        while (true) {
            //查看是不是直播中
            let isZan = DyVideo.isZan();
            Log.log('isZan', isZan);
            if (isZan) {
                DyVideo.clickZan();
            }
            tCommon.sleep(1500);
            if (!DyVideo.next(true)) {
                return true;
            }
        }
    },
}

/**
 * 有视频进入操作，如果使用快速模式，则视频进入操作会失败
 * 视频滑动也需要非快速模式
 */
System.setAccessibilityMode('fast');//非快速模式
tCommon.log();
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
