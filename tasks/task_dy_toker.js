let tCommon = require("app/dy/Common");
let dy = require('app/iDy');
let machine = require("common/machine");

let task = {
    me: {},//我的抖音号和昵称
    run() {
        return this.testTask();
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-toker-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask() {
        return dy.run(0);
    },
}

//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {
        tCommon.openApp();//兜底，防止跑到外面去了
        System.setAccessibilityMode('fast');//快速模式
        let code = task.run();
        if (code === 101) {
            FloatDialogs.toast('不在任务时间，休息一会儿');
            Log.log('不在任务时间，休眠一会儿');
            tCommon.backApp();
            let hours = machine.getTokerData(0).toker_run_hour;
            console.log(Array.isArray(hours), hours, (new Date()).getHours(), hours.includes("0"));
            while (true) {
                tCommon.sleep(1 * 60 * 1000 / 6);
                if (hours.includes((new Date()).getHours().toString())) {
                    break;
                }
            }
            throw new Error('重新进入');
        }
        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        tCommon.closeAlert(1);
        tCommon.backHome();
    }
}
