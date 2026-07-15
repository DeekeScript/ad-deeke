let tCommon = require("../app/dy/Common");
const DyUser = require('../app/dy/User.js');
let storage = require("../common/storage");
let machine = require("../common/machine");
let baiduWenxin = require("../service/baiduWenxin.js");

let task = {
    index: 0,
    /**
     * 
     * @param {string[]} accounts 
     * @param {number} second 
     * @returns 
     */
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
    /**
     * 
     * @param {number} type 
     * @param {string} title 
     * @param {number} [age] 
     * @param {number} [gender] 
     * @returns {any}
     */
    getMsg(type, title, age, gender = 2) {
        let genderStr = ['女', '男', '未知'][gender];
        if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, genderStr) : baiduWenxin.getComment(title) };
        }
        return machine.getMsg(type) || false;//永远不会结束
    },

    /**
     * 
     * @param {string[]} accounts 
     * @param {number} second 
     * @returns 
     */
    testTask(accounts, second) {
        //首先进入点赞页面
        Log.log('账号：', accounts, second);
        for (let i in accounts) {
            if (parseInt(i) < this.index) {
                continue;
            }

            try {
                //进入用户主页，私信，关注
                Log.log('开始进入主页', 'snssdk1128://user/profile/' + accounts[i]);
                App.gotoIntent('snssdk1128://user/profile/' + accounts[i]);
                tCommon.sleep(5000 + 3000 * Math.random());
                Log.log('发送卡片');
                DyUser.privateMsgCard(1);
                tCommon.back();
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
    FloatDialogs.toast('你取消了执行');
    System.exit();
    tCommon.sleep(2000);
}

if (!Access.isMediaProjectionEnable()) {
    FloatDialogs.show('温馨提示', '请打开主界面侧边栏，开启“图色查找”权限');
    System.exit();
    tCommon.sleep(2000);
}

accounts = accounts.split("\n");

//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");
tCommon.openApp();//兜底，防止跑到外面去了
System.setAccessibilityMode('fast');

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
