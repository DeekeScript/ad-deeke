let tCommon = require("app/ks/Common");
let tMessageNew = require("app/ks/MessageNew");
let storage = require("common/storage");

let task = {
    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-ks-ai-back-" + file + ".txt";
        Log.setFile(allFile);
    },
    //最后一步
    backApp() {
        //直接返回退出抖音
        tCommon.back(3);
        tCommon.backApp();
    },

    run(config) {
        Log.log('run---');
        if (tMessageNew.intoMessage()) {
            tMessageNew.readMessage(config);
        }
    }
}

let config = {
    ai_back_comment_switch: storage.get('ks_ai_back_comment_switch', 'bool'),
    ai_back_friend_private_switch: storage.get('ks_ai_back_friend_private_switch', 'bool'),
    ai_back_private_switch: storage.get('ks_ai_back_private_switch', 'bool'),
    ai_back_minitue: storage.get('ks_ai_back_minitue', 'int'),
    ai_back_comment_run_other_fun: storage.get('ks_ai_back_comment_run_other_fun'),
}

if (!storage.get('setting_baidu_wenxin_switch', 'bool')) {
    Dialogs.show('提示', '请开启智能AI话术');
    System.exit();
}

System.setAccessibilityMode('fast');
task.log();
Log.log('config', config);
while (true) {
    try {
        tCommon.openApp();
        //task.log();
        task.run(config);
        Log.log('开始休眠');
    } catch (e) {
        Log.log('全局异常');
        Log.log(e);
    }

    task.backApp();
    tCommon.sleep(5000);//休眠10秒

    Log.log('开始执行核心功能');
    if (config.ai_back_comment_run_other_fun == 0) {
        tCommon.sleep(config.ai_back_minitue * 60 * 1000);
        continue;
    }

    let endTime = Date.parse(new Date()) / 1000 + config.ai_back_minitue * 60;
    let file = ['tasks/task_ks_toker.js', 'tasks/task_ks_toker_city.js', 'tasks/task_ks_search_user.js'][config.ai_back_comment_run_other_fun - 1];
    Log.log('开始执行');
    Engines.executeScript(file);
    Log.log('执行过了');
    do {
        Log.log('时间判断', Date.parse(new Date()) / 1000, endTime)
        if (Date.parse(new Date()) / 1000 >= endTime) {
            Engines.closeOther();//关闭其他线程
            Log.log('中断其他线程');
            tCommon.backHome();
            break;
        }
        Log.log('开始判断');
        tCommon.sleep(60 * 1000);//一分钟后判断
    } while (true);
    Log.log('又开始执行了');
}
