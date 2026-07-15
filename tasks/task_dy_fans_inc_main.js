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
    remark: false,//是否是#开头
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
        let allFile = "log/log-dy-fans-inc-main-" + file + ".txt";
        Log.setFile(allFile);
    },


    //type 0 评论，1私信
    /**
     * 
     * @param {number} type 
     * @param {string} [title] 
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
        Log.log(settingData);
        DyIndex.intoMyPage();
        this.me = {
            nickname: DyUser.isCompany() ? DyUser.getDouyin() : DyUser.getNickname(),
            douyin: DyUser.getDouyin(),
        }

        Log.log(JSON.stringify({
            '账号：': this.me.douyin,
            '昵称：': this.me.nickname,
        }));
        DyIndex.intoHome();

        if (this.remark) {
            App.gotoIntent('snssdk1128://user/profile/' + settingData.account);
            tCommon.sleep(5000 + 2000 * Math.random());
        } else {
            if (settingData.account.indexOf('+') === 0) {
                DyIndex.intoMyPage();
            } else {
                DyIndex.intoSearchPage();
            }

            let res = DySearch.homeIntoSearchUser(settingData.account);
            if (res) {
                return res;
            }
        }

        return DyUser.fansIncList(this.getMsg, machine, settingData, this.contents, this.me.nickname);
    },
}

/** @type {any} */
let settingData = machine.getFansIncSettingRate();//weilan31045

Log.log('settingData', settingData);
//重新计算百分比

let count = settingData.task_dy_fans_inc_head_zan_rate + settingData.task_dy_fans_inc_video_zan_rate + settingData.task_dy_fans_inc_comment_rate + settingData.task_dy_fans_inc_collection_rate;
if (count == 0) {
    count = 100;
}

settingData.task_dy_fans_inc_head_zan_rate = (settingData.task_dy_fans_inc_head_zan_rate / count) * 100;
settingData.task_dy_fans_inc_video_zan_rate = (settingData.task_dy_fans_inc_video_zan_rate / count) * 100;
settingData.task_dy_fans_inc_comment_rate = (settingData.task_dy_fans_inc_comment_rate / count) * 100;
settingData.task_dy_fans_inc_collection_rate = (settingData.task_dy_fans_inc_collection_rate / count) * 100;

console.log(machine.getMsg(0));
Log.log('settingData', settingData);

task.remark = tCommon.getRemark(settingData.task_dy_fans_inc_accounts);
if (task.remark) {
    settingData.task_dy_fans_inc_accounts = settingData.task_dy_fans_inc_accounts.substring(1);
}
let tmp = settingData.task_dy_fans_inc_accounts.split("\n");

tCommon.openApp();
Engines.executeScript("unit/dialogClose.js"); //开启线程  自动关闭弹窗
System.setAccessibilityMode('fast');//快速模式
Log.log('日志开始', tmp);
task.log();

while (true) {
    try {
        let index = Math.floor(Math.random() * tmp.length);
        settingData.account = tmp[index];

        if (task.run(settingData)) {
            tCommon.back(4);
            tCommon.sleep(3000);
        }
    } catch (e) {
        Log.log(e);
        tCommon.closeAlert(1);
        tCommon.backHome();
    }
}
