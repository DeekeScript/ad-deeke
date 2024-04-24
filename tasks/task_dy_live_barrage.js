import {Common as tCommon} from "app/dy/Common";
import { Index as DyIndex } from 'app/dy/Index.js';
import { Search as DySearch } from 'app/dy/Search.js';
// const DyUser = require('app/dy/User.js');
const DyLive = require('app/dy/Live.js');
// import { Comment as DyComment } from 'app/dy/Comment.js';

// let dy = require('app/iDy');
// let config = require('config/config');
import {storage} from "common/storage";

let task = {
    rp: 0,
    msg: [],
    run(account, second, msg) {
        this.msg = tCommon.splitKeyword(msg);
        Log.log('msg', this.msg);
        return this.testTask(account, second);
    },

    getMsg() {
        return this.msg[Math.round(Math.random() * (this.msg.length - 1))];
    },

    log(){
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-live-barrage-" + file + ".txt";
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
            Log.log('开始评论了');
            if (false === DyLive.loopComment(this.getMsg())) {
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

let account = Dialogs.input('请输入直播账号：', storage.get('task_dy_live_barrage_account') || '');
if (!account) {
    tCommon.showToast('你取消了执行');
     //console.hide();();
    System.exit();
}
storage.set('task_dy_live_barrage_account', account);

let second = Dialogs.input('请输入弹幕最大间隔(秒):', storage.get('task_dy_live_barrage_second') || '');
if (!second || isNaN(second)) {
    tCommon.showToast('你取消了执行');
     //console.hide();();
    System.exit();
}
storage.set('task_dy_live_barrage_second', second);

let msg = Dialogs.input('请输入评论内容（多个使用逗号隔开）：', storage.get('task_dy_live_barrage_msg') || '');
if (!msg) {
    tCommon.showToast('你取消了执行');
     //console.hide();();
    System.exit();
}
storage.set('task_dy_live_barrage_msg', msg);

tCommon.openApp();

let thr = undefined;
while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        if (task.run(account, second, msg)) {
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
