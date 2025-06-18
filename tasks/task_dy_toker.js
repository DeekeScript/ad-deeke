let tCommon = require("app/dy/Common");
let dy = require('app/iDy');
let config = require('config/config');
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
        let allFile = "log/log-toker-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask() {
        return dy.run(0);
    },

    setLogConsole() {
        tCommon.toast("感谢你对" + config.name + "的信任，有任何问题或者建议，请第一时间联系" + config.name + "官方！", 1000);
    },
}

// let a = System.getDataFrom('setting_baidu_wenxin_role', 'role', 'content');
// Log.log(a);
// Log.log(baiduWenxin.testChat('你好啊'));

//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {
        tCommon.openApp();//兜底，防止跑到外面去了
        let code = task.run();
        if (code === 101) {
            // tCommon.closeApp();
            tCommon.showToast('不在任务时间，休息一会儿');
            Log.log('不在任务时间，休眠一会儿');
            tCommon.backApp();
            //App.notifySuccess('通知', '即将返回到App');
            let hours = machine.getTokerData(0).toker_run_hour;
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
        Log.log(e);
        System.cleanUp();
        tCommon.closeAlert(1);
        tCommon.backHome();
    }
}
