let tCommon = require('app/dy/Common.js');
let DyIndex = require('app/dy/Index.js');
let DySearch = require('app/dy/Search.js');
let storage = require('common/storage.js');
let machine = require('common/machine.js');
let baiduWenxin = require('service/baiduWenxin.js');

let task = {
    contents: [],
    count: 100,
    fans: 20000,
    params: { clickZan: false, comment: false, },
    run(settingData) {
        return this.testTask(settingData);
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-search-user-" + file + ".txt";
        Log.setFile(allFile);
    },

    //type 0 评论，1私信
    getMsg(type, title, age, gender) {
        gender = ['女', '男', '未知'][gender];
        if (storage.getMachineType() === 1) {
            if (storage.get('setting_baidu_wenxin_switch',  'bool')) {
                return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
            }
            return machine.getMsg(type) || false;//永远不会结束
        }
    },

    decCount() {
        Log.log("剩余数量：" + (this.count - 1));
        return --this.count;
    },

    testTask(settingData) {
        //首先进入点赞页面
        DyIndex.intoHome();
        DyIndex.intoSearchPage();
        DySearch.intoSearchList(settingData.keyword, 1);
        tCommon.sleep(3000);
        this.params.settingData = settingData;
        return DySearch.userList(
            (v) => machine.get('task_dy_search_user_' + v, 'bool'),
            () => this.decCount(),
            (v) => machine.set('task_dy_search_user_' + v, true),
            (v, title, age, gender) => this.getMsg(v, title, age, gender),
            this.params
        );
    },
}


let settingData = machine.getSearchUserSettingRate();//commentRate
Log.log('settingData', settingData);
settingData.keyword = settingData.keyword.replace(/\s+/g, '')

if (!settingData.keyword) {
    FloatDialogs.toast('未设置关键词，停止运行');
    System.exit();
}

task.count = settingData.opCount;
if (!task.count) {
    FloatDialogs.toast('未设置操作次数，停止运行');
    System.exit();
}

tCommon.openApp();
//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");
System.setAccessibilityMode('fast');//快速模式
while (true) {
    task.log();
    try {
        let res = task.run(settingData);
        if (res) {
            tCommon.sleep(3000);
            let iSettingData = machine.getSearchUserSettingRate();
            FloatDialogs.show('提示', '已完成数量：' + (iSettingData.opCount * 1 - task.count));
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