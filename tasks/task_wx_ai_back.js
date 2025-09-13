let tCommon = require("app/wx/Common");
let tMessageNew = require("app/wx/MessageNew");
let tIndex = require('app/wx/Index');
let storage = require("common/storage");

let task = {
    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-wx-ai-back-" + file + ".txt";
        Log.setFile(allFile);
    },
    //最后一步
    backApp() {
        //直接返回退出抖音
        tCommon.backHome();
        tCommon.sleep(2000);
        tCommon.backApp();
    },

    run(config) {
        tIndex.intoFund();
        Log.log('进入了发现页面');
        if (tMessageNew.intoMessage()) {
            Log.log('有消息');
            tMessageNew.readMessage(config);
        }else{
            Log.log('没有消息');
        }
    }
}

let config = {
    ai_back_comment_switch: storage.get('wx_ai_back_comment_switch', 'bool'),
    ai_back_friend_private_switch: storage.get('wx_ai_back_friend_private_switch', 'bool'),
    ai_back_minitue: storage.get('wx_ai_back_minitue', 'int'),
    ai_back_comment_run_other_fun: storage.get('wx_ai_back_comment_run_other_fun'),
}

if (!storage.get('setting_baidu_wenxin_switch', 'bool')) {
    Dialogs.show('提示', '请开启智能AI话术');
    System.exit();
}

Log.log('config', config);
while (true) {
    try {
        tCommon.openApp();
        task.log();
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
    let file = ['tasks/task_wx_toker.js', 'tasks/task_wx_toker_city.js'][config.ai_back_comment_run_other_fun - 1];
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
