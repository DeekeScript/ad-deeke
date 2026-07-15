let tCommon = require('../app/dy/Common.js');
let DyIndex = require('../app/dy/Index.js');
let DySearch = require('../app/dy/Search.js');
let DyUser = require('../app/dy/User.js');
let storage = require('../common/storage.js');
let machine = require('../common/machine.js');
let baiduWenxin = require('../service/baiduWenxin.js');

let task = {
    contents: [],
    /** @type {any} */
    me: {},
    /**
     * 
     * @param {any} settingData 
     * @returns 
     */
    run(settingData) {
        return this.testTask(settingData);
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-dy-toker-fans-" + file + ".txt";
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
     * @param {any} settingData 
     * @returns 
     */
    testTask(settingData) {
        //首先进入点赞页面
        DyIndex.intoMyPage();
        this.me = {
            nickname: DyUser.isCompany() ? DyUser.getDouyin() : DyUser.getNickname(),
            douyin: DyUser.getDouyin(),
        }

        Log.log(JSON.stringify({
            '账号：': this.me.douyin,
            '昵称：': this.me.nickname,
        }));
        tCommon.sleep(1000 + 1000 * Math.random());
        DyIndex.intoHome();

        if (tCommon.getRemark(settingData.account)) {
            settingData.account = settingData.account.substring(1);
            App.gotoIntent('snssdk1128://user/profile/' + settingData.account);
            tCommon.sleep(5000 + 2000 * Math.random());
        } else {
            if (settingData.account.indexOf('+') === 0) {
                DyIndex.intoMyPage();
            } else {
                DyIndex.intoSearchPage();
            }

            DySearch.homeIntoSearchUser(settingData.account);
        }

        return DyUser.focusUserList(1, this.getMsg, machine, settingData, this.contents, this.me.nickname);
    },
}

let settingData = machine.getFansSettingRate();//weilan31045

Log.log('settingData', settingData);
console.log(machine.getMsg(0));
console.log(settingData.opCount);

if (!settingData.account) {
    FloatDialogs.toast('未设置账号，取消执行');
    System.exit();
}

tCommon.openApp();
System.setAccessibilityMode('fast');
//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

let thr = undefined;
while (true) {
    Log.log('日志开始');
    task.log();
    try {
        let res = task.run(settingData);
        if (res) {
            tCommon.sleep(3000);
            let iSettingData = machine.getFansSettingRate();
            FloatDialogs.show('提示', "已完成数量：" + (iSettingData.opCount * 1 - settingData.opCount) + "/" + iSettingData.opCount);
            break;
        }

        if (res === false) {
            break;
        }

        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        tCommon.closeAlert(1);
        tCommon.backHome();
    }
}
