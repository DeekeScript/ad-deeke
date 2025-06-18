let tCommon = require("app/dy/Common");
// let DyIndex = require('app/dy/Index.js');
// let DySearch = require('app/dy/Search.js');
// const DyUser = require('app/dy/User.js');
// let DyVideo = require('app/dy/Video.js');
// let DyComment = require('app/dy/Comment.js');

let dy = require('app/iDy');
let config = require('config/config');

let task = {
    me: {},//我的抖音号和昵称
    taskId: undefined,
    run(taskId) {
        dy.taskId = taskId;
        return this.testTask(taskId);
    },

    log(){
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask(taskId) {
        return dy.run(taskId, 1);
    },

    setLogConsole() {
        //let dpi = context.getResources().getDisplayMetrics().densityDpi;
        // console.show(true);
        // console.setTitle(config.name + "提醒", "#FFFFFF", 40);
        // console.setCanInput(false);
        // console.setBackgroud("#2E78FC");
        // tCommon.sleep(40);
        // console.setSize(Device.width(), Device.height() / 6);
        tCommon.toast("感谢你对" + config.name + "的信任，有任何问题或者建议，请第一时间联系" + config.name + "官方！", 1000);
    },
}

task.setLogConsole();
let i = false;
Dialogs.confirm('运行前说明', '本功能主要通过表情霸屏，请保证表情库充足！', (_true) => {
    i = _true
});

if (!i) {
    tCommon.toast('你取消了任务', 2000);
     //console.hide();();
    System.exit();
}

let isCity = -1;
dialogs.select('请选择任务类型', ['推荐', '同城'], (v) => {
    isCity = v;
});

Log.log('isCity', isCity);

if (isCity === -1) {
    tCommon.toast('你取消了任务', 2000);
     //console.hide();();
    System.exit();
}

dy.setIsCity(isCity);
let tasks = dy.getTask({ isCity: isCity ? 1 : 0 });
if (tasks.code !== 0) {
    FloatDialogs.show(tasks.msg);
     //console.hide();();
    System.exit();
}

if (tasks.data.length === 0) {
    FloatDialogs.show('请创建任务后运行！');
     //console.hide();();
    System.exit();
}

let options = tasks.data.map((item) => {
    return item.name;
});

let selectTaskIndex = dialogs.select("请选择一个任务", options);
if (selectTaskIndex >= 0) {
    tCommon.toast("您选择的任务：" + options[selectTaskIndex]);
} else {
    tCommon.toast("您取消了选择");
    System.exit();
}

task.taskId = tasks.data[selectTaskIndex]['id'];

tCommon.openApp();
// //console.hide();();  在index里面进行关闭
let thr = undefined;
while (true) {
    task.log();
    //Threads.shutDownAll();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        let code = task.run(task.taskId, 1);
        if (code === false) {
            tCommon.showToast('相关异常，请重试！');
            tCommon.backApp();
            tCommon.sleep((300 + 300 * Math.random()) * 1000);//休眠5-10分钟
        }
        Log.log(code);
        if ([102, 103, 104, 105].includes(code)) {
            if (thr) {
                thr.interrupt();
                Threads.shutDownAll();
            }
            tCommon.showToast('任务结束了');
            tCommon.backApp();
            tCommon.sleep(2000);
            System.exit();
        }

        if ([107].includes(code)) {
            Log.log('任务因为某种原因中断了');
            if (thr) {
                thr.interrupt();
                Threads.shutDownAll();
            }
            tCommon.backApp();
            tCommon.sleep(2000);
            FloatDialogs.show('没有自定义表情，任务无法进行');
            System.exit();
        }

        if (code === 106) {
            tCommon.showToast('频率达到了，休息一会儿');
            tCommon.sleep(2000);
            tCommon.backApp();
            tCommon.sleep((300 + 300 * Math.random()) * 1000);//休眠5-10分钟
            tCommon.openApp();
        }

        if (code === 101) {
            // tCommon.closeApp();
            tCommon.showToast('不在任务时间，休息一会儿');
            tCommon.sleep(2000);
            tCommon.backApp();
            let hours = JSON.parse(dy.getData('taskConfig').hour);
            while (true) {
                tCommon.sleep(5 * 60 * 1000);
                if (hours.includes((new Date()).getHours())) {
                    break;
                }
            }
            tCommon.openApp();
        }

        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        try {
            if (thr) {
                thr.interrupt();
                Threads.shutDownAll();
            }
            tCommon.toast("遇到错误，即将自动重启");
            tCommon.closeApp();
            tCommon.sleep(3000);
            tCommon.toast('开启抖音');
            tCommon.openApp();
        } catch (e) {
            Log.log('启停bug', e);
        }
    }
}
