let tCommon = require("app/dy/Common");
let dy = require('app/iDy');
let config = require('config/config');
let machine = require("common/machine");

let task = {
    me: {},//我的抖音号和昵称
    run() {
        return this.testTask();
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-city-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask() {
        return dy.run(1);
    },

    setLogConsole() {
        tCommon.toast("感谢你对" + config.name + "的信任，有任何问题或者建议，请第一时间联系" + config.name + "官方！", 1000);
    }
}

tCommon.openApp();
//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {
        tCommon.openApp();
        let code = task.run();
        if (code === 101) {
            // tCommon.closeApp();
            tCommon.showToast('不在任务时间，休息一会儿');
            Log.log('不在任务时间，休眠一会儿');
            let hours = machine.getTokerData(1).toker_run_hour;
            console.log(hours, (new Date()).getHours(), hours.includes("0"));
            tCommon.backApp();
            while (true) {
                tCommon.sleep(1 * 60 * 1000);
                if (hours.includes((new Date()).getHours().toString())) {
                    break;
                }
            }
            Log.log("内存清理");
            System.cleanUp();
            throw new Error('重新进入');
        }

        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        System.cleanUp();
        tCommon.closeAlert(1);
        tCommon.backHome();
    }
}
