let tCommon = require('app/ks/Common.js');
// let KsIndex = require('app/ks/Index.js');
let KsSearch = require('app/ks/Search.js');
let KsUser = require('app/ks/User.js');
let KsVideo = require('app/ks/Video.js');
let storage = require('common/storage.js');
let machine = require('common/machine.js');
let KsComment = require('app/ks/Comment.js');
let baiduWenxin = require('service/baiduWenxin.js');

let task = {
    contents: [],
    count: 100,
    fans: 20000,
    params: { clickZan: false, comment: false, },
    lib_id: undefined,
    run(settingData) {
        return this.testTask(settingData);
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-ks-search-user-" + file + ".txt";
        Log.setFile(allFile);
    },

    //type 0 评论，1私信
    getMsg(type, title, age, gender) {
        if (storage.getMachineType() === 1) {
            if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
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
        //KsIndex.intoHome(true);
        //KsIndex.intoSearchPage();
        //KsSearch.intoSearchList(settingData.keyword, 1);

        tCommon.sleep(3000);
        this.params.settingData = settingData;
        return KsSearch.userList(
            (v) => machine.get('task_ks_search_user_' + v, 'bool'),
            () => this.decCount(),
            KsUser,
            KsComment,
            KsVideo,
            (v) => machine.set('task_ks_search_user_' + v, true),
            (v, title, age, gender) => this.getMsg(v, title, age, gender),
            this.params
        );
    },
}


let settingData = machine.getKsSearchUserSettingRate();//commentRate
settingData.isFirst = false;//首个视频必操作，关闭
Log.log('settingData', settingData);

task.count = settingData.opCount;
if (!task.count) {
    tCommon.showToast('未设置操作次数，停止运行');
    //console.hide();();
    System.exit();
}

// tCommon.openApp(); //已经自动打开了，不需要再次打开
//开启线程  自动关闭弹窗
//Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {
        let res = task.run(settingData);
        if (res) {
            tCommon.sleep(3000);
            let iSettingData = machine.getKsSearchUserSettingRate();
            FloatDialogs.show('提示', '已完成数量：' + (iSettingData.opCount * 1 - task.count));
            break;
        }

        if (res === false) {
            break;
        }

        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        let tag = UiSelector().className('android.widget.Button').text('点击重播').findOne();
        if (tag) {
            tCommon.click(tag);
        }
        tCommon.closeAlert(1);
        tCommon.back();
        tCommon.sleep(1000);
    }
}