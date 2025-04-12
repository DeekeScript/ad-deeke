let tCommon = require("app/wx/Common");
let wx = require('app/iWx');
let machine = require("common/machine");
// let baiduWenxin = require("service/baiduWenxin");

let task = {
    me: {},//我的抖音号和昵称
    run() {
        return this.testTask();
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-wx-toker-city-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask() {
        return wx.run(1);
    },
}

//开启线程  自动关闭弹窗
// Engines.executeScript("unit/dialogClose.js");
task.log();

while (true) {
    try {
        tCommon.openApp();//兜底，防止跑到外面去了
        let code = task.run();
        if (code === 101) {
            // tCommon.closeApp();
            tCommon.showToast('不在任务时间，休息一会儿');
            Log.log('不在任务时间，休眠一会儿');
            tCommon.backApp();
            //App.notifySuccess('通知', '即将返回到App');
            let hours = machine.getWxTokerData(1).toker_run_hour;
            console.log(Array.isArray(hours), hours, (new Date()).getHours(), hours.includes("0"));
            while (true) {
                tCommon.sleep(1 * 60 * 1000 / 6);
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
        Log.log("全局异常：", e);
        System.cleanUp();
        tCommon.closeAlert(1);
        tCommon.backHome();
    }
}
