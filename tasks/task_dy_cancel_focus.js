let tCommon = require("app/dy/Common");
let DyIndex = require('app/dy/Index.js');
let DyUser = require('app/dy/User.js');
let machine = require('common/machine.js');

let task = {
    run() {
        return this.testTask();
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-cancel-focus-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask() {
        //首先进入点赞页面
        DyIndex.intoMyPage();
        return DyUser.cancelFocusList(machine);
    },
}

tCommon.openApp();
//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {
        if (task.run()) {
            tCommon.sleep(1000);
            FloatDialogs.show('提示', '取消关注已完成');
            break;
        }
        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        tCommon.closeAlert(1);
        tCommon.backHome();
    }
}