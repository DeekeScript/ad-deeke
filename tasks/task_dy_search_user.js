import { Common as tCommon } from 'app/dy/Common.js';
import { Index as DyIndex } from 'app/dy/Index.js';
import { Search as DySearch } from 'app/dy/Search.js';
import { User as DyUser } from 'app/dy/User.js';
import { Video as DyVideo } from 'app/dy/Video.js';
import { storage } from 'common/storage.js';
import { machine } from 'common/machine.js';
import { Comment as DyComment } from 'app/dy/Comment.js';
import { baiduWenxin } from 'service/baiduWenxin.js';

// let dy = require('app/iDy');
// let config = require('config/config');

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
        let allFile = "log/log-search-user-" + file + ".txt";
        Log.setFile(allFile);
    },

    //type 0 评论，1私信
    getMsg(type, title, age, gender) {
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
            (v) => machine.get('task_dy_search_user_' + v),
            () => this.decCount(),
            DyUser,
            DyComment,
            DyVideo,
            (v) => machine.set('task_dy_search_user_' + v, true),
            (v, title, age, gender) => this.getMsg(v, title, age, gender),
            this.params
        );
    },
}


let settingData = machine.getSearchUserSettingRate();
settingData.isFirst = true;
Log.log('settingData', settingData);

if (!settingData.keyword) {
    tCommon.showToast('未设置关键词，停止运行');
    //console.hide();();
    System.exit();
}

task.count = settingData.opCount;
if (!task.count) {
    tCommon.showToast('未设置操作次数，停止运行');
    //console.hide();();
    System.exit();
}

tCommon.openApp();

while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        Engines.executeScript("unit/dialogClose.js");
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
        Log.log(e.stack);
        tCommon.backHome();
    }
}