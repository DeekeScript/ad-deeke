let tCommon = require("app/dy/Common");
let DyIndex = require('app/dy/Index.js');
let DyUser = require('app/dy/User.js');

let task = {
    nicknames: [],
    run() {
        return this.testTask();
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-fans-back-view-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask() {
        //首先进入点赞页面
        DyIndex.intoMyPage();
        return DyUser.viewFansList(this.nicknames);
    },
}

System.setAccessibilityMode('fast');//快速模式
tCommon.openApp();
while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        if (task.run()) {
            tCommon.sleep(1000);
            FloatDialogs.show('提示', '回访已完成');
            break;
        }
        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        tCommon.backHome();
    }
}
