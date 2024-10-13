let tCommon = require("app/dy/Common");
let DyIndex = require('app/dy/Index.js');
let DySearch = require('app/dy/Search.js');
// const DyUser = require('app/dy/User.js');
const DyLive = require('app/dy/Live.js');
// let DyComment = require('app/dy/Comment.js');

// let dy = require('app/iDy');
// let config = require('config/config');
let storage = require("common/storage");

let task = {
    rp: 0,
    run(account, second) {
        return this.testTask(account, second);
    },

    log(){
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-live-zan-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask(account, second) {
        //首先进入点赞页面
        DyIndex.intoSearchPage();
        this.rp++;
        if (this.rp >= 3) {
            return true;
        }

        DySearch.intoSearchList(account, 1);
        DySearch.intoLiveRoom(account);
        this.rp = 0;
        while (true) {
            Log.log('开始点赞了');
            if (false === DyLive.loopClick(20 + Math.round(20 * Math.random()))) {
                throw new Error('可能异常');
            }

            let s = (second / 2 + second / 2 * Math.random());
            Log.log('休眠' + s + '秒')
            tCommon.sleep(s * 1000);
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

let account = Dialogs.input('请输入直播账号：', storage.get('task_dy_live_zan_account') || '');
if (!account) {
    tCommon.showToast('你取消了执行');
     //console.hide();();
    System.exit();
}

Log.log('account', account, !account);
storage.set('task_dy_live_zan_account', account);

let second = Dialogs.input('请输入点赞最大间隔（秒）：', storage.get('task_dy_live_zan_second') || '');
if (!second || isNaN(second)) {
    tCommon.showToast('你取消了执行');
     //console.hide();();
    System.exit();
}
storage.set('task_dy_live_zan_second', second);

tCommon.openApp();

let thr = undefined;
while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        if (task.run(account, second)) {
            if (thr) {
                thr.interrupt();
                Threads.shutDownAll();
                tCommon.sleep(1000);
            }
            FloatDialogs.show('提示', '直播结束了');
            break;
        }
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

try {
    Engines.closeAll(true);
} catch (e) {
    Log.log('停止脚本');
}
