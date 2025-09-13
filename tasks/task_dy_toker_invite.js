let tCommon = require("app/dy/Common");
const DyUser = require('app/dy/User.js');
let storage = require("common/storage");
let machine = require("common/machine");

let task = {
    index: 0,
    run(accounts, second) {
        return this.testTask(accounts, second);
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-dy-toker-uid-" + file + ".txt";
        Log.setFile(allFile);
    },

    //type 0 评论，1私信
    getMsg(type, title, age, gender) {
        if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
        }

        //return { msg: ['厉害', '六六六', '666', '拍得很好', '不错哦', '关注你很久了', '学习了', '景色不错', '真的很不错', '太厉害了', '深表认同', '来过了', '茫茫人海遇见你', '太不容易了', '很好', '懂了', '我看到了', '可以的', '一起加油', '真好', '我的个乖乖'][Math.round(Math.random() * 20)] };
        return machine.getMsg(type) || false;//永远不会结束
    },

    testTask(accounts, second) {
        //首先进入点赞页面
        Log.log('账号：', accounts, second);
        for (let i in accounts) {
            if (i < this.index) {
                continue;
            }

            try {
                //进入用户主页，私信，关注
                Log.log('开始进入主页', 'snssdk1128://user/profile/' + accounts[i]);
                App.gotoIntent('snssdk1128://user/profile/' + accounts[i]);
                tCommon.sleep(5000 + 3000 * Math.random());
                Log.log('发送卡片');
                DyUser.privateMsgCard(1);
                tCommon.sleep(500 + 1000 * Math.random());
            } catch (e) {
                Log.log("报错捕获：", e);
                tCommon.sleep(500 + 1000 * Math.random());
            }

            this.index++;
            let s = (second / 2 + second / 2 * Math.random());
            Log.log('休眠' + s + '秒')
            tCommon.sleep(s * 1000);
        }

        if (this.index >= accounts.length) {
            return true;
        }
    },
}

let accounts = storage.get('task_dy_toker_invite_account');
Log.log('accounts', accounts);
if (!accounts) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
    System.exit();
}
accounts = accounts.split("\n");

//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");
tCommon.openApp();//兜底，防止跑到外面去了

task.log();
try {
    //开启线程  自动关闭弹窗
    if (task.run(accounts, storage.get('task_dy_toker_invite_interval', 'int'))) {
        FloatDialogs.show('提示', '执行完成');
    }
    tCommon.sleep(3000);
} catch (e) {
    Log.log(e);
    try {
        tCommon.showToast("遇到错误，即将自动重启");
        tCommon.sleep(3000);
    } catch (e) {
        Log.log('启停bug', e);
    }
}
