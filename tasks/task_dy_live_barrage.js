let tCommon = require("app/dy/Common");
let DyIndex = require('app/dy/Index.js');
let DySearch = require('app/dy/Search.js');
let DyUser = require('app/dy/User.js');
let DyLive = require('app/dy/Live.js');
// let DyComment = require('app/dy/Comment.js');

// let dy = require('app/iDy');
// let config = require('config/config');
let storage = require("common/storage");
let machine = require("common/machine");

let task = {
    rp: 0,
    msg: [],
    run(account, second) {
        return this.testTask(account, second);
    },

    getMsg(type, title, age, gender) {
        let comments = storage.get('task_dy_live_barrage_comments');
        if (comments) {
            let tmp = comments.split("\n");
            let rd = Math.floor(Math.random() * tmp.length);
            return { msg: tmp[rd] };
        }

        if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
        }
        return machine.getMsg(type) || false;//永远不会结束
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-live-barrage-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask(account, second) {
        //首先进入点赞页面
        if (!tCommon.getRemark(account)) {
            DyIndex.intoSearchPage();
            this.rp++;
            if (this.rp >= 3) {
                return true;
            }

            DySearch.intoSearchList(account, 1);
            DySearch.intoLiveRoom(account);
        } else {
            account = account.substring(1);
            App.gotoIntent('snssdk1128://user/profile/' + account);
            tCommon.sleep(5000 + 2000 * Math.random());
            if (!DyUser.intoLive()) {
                return true;
            }
            tCommon.sleep(5000 + 2000 * Math.random());
        }

        this.rp = 0;
        while (true) {
            Log.log('开始点赞了');
            if (storage.get('task_dy_live_barrage_zan_rate', 'int') > Math.random() * 100 && false === DyLive.loopClick(20 + Math.round(20 * Math.random()))) {
                throw new Error('可能异常');
            }

            let msg = this.getMsg(0);
            Log.log('开始评论了', msg);
            if (msg && msg.msg && storage.get('task_dy_live_barrage_comment_rate', 'int') > Math.random() * 100 && false === DyLive.loopComment(msg.msg, storage.get('task_dy_live_barrage_comment_emoji_switch', 'bool'))) {
                throw new Error('可能异常');
            }

            let s = (second / 2 + second / 2 * Math.random());
            Log.log('休眠' + s + '秒')
            tCommon.sleep(s * 1000);
        }
    },
}

let account = storage.get('task_dy_live_barrage_account', 'string');
if (!account) {
    tCommon.showToast('直播账号不能为空');
    //console.hide();();
    System.exit();
}

tCommon.openApp();
//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        if (task.run(account, storage.get('task_dy_live_barrage_second', 'int'))) {
            FloatDialogs.show('提示', '直播结束了');
            break;
        }
        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        tCommon.closeAlert(1);
        tCommon.backHome();
    }
}
