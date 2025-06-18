let tCommon = require("app/dy/Common");
let DyIndex = require('app/dy/Index.js');
// let DySearch = require('app/dy/Search.js');
const DyUser = require('app/dy/User.js');
let DyVideo = require('app/dy/Video.js');
const DyMessage = require('app/dy/Message.js');
// let DyComment = require('app/dy/Comment.js');

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    run() {
        return this.testTask();
    },

    log(){
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-cancel-focus-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask() {
        //首先进入点赞页面
        DyIndex.intoMyPage();
        DyIndex.intoMyMessage();
        while (true) {
            DyMessage.backMsg();
        }
    },
}

let i = false;
Dialogs.confirm('提示', '确定开始执行嘛？', (_true) => {
    i = _true;
});

if (!i) {
    tCommon.showToast('你取消了执行');
     //console.hide();();
    System.exit();
}

tCommon.openApp();

let thr = undefined;
while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        task.run();
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
