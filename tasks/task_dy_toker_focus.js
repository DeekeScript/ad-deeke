import { Common as tCommon } from 'app/dy/Common.js';
import { Index as DyIndex } from 'app/dy/Index.js';
import { Search as DySearch } from 'app/dy/Search.js';
import { User as DyUser } from 'app/dy/User.js';
import { Video as DyVideo } from 'app/dy/Video.js';
import { storage } from 'common/storage.js';
import { machine } from 'common/machine.js';
import { Comment as DyComment } from 'app/dy/Comment.js';
import { baiduWenxin } from 'service/baiduWenxin.js';

let task = {
    contents: [],
    run(settingData) {
        return this.testTask(settingData);
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-dy-toker-focus-" + file + ".txt";
        Log.setFile(allFile);
    },

    //type 0 评论，1私信
    getMsg(type, title, age, gender) {
        if (storage.get('setting_baidu_wenxin_switch',  'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
        }
        return machine.getMsg(type) || false;//永远不会结束
    },

    testTask(settingData) {
        //首先进入点赞页面
        DyIndex.intoHome();
        if (settingData.account.indexOf('+') === 0) {
            DyIndex.intoMyPage();
        } else {
            DyIndex.intoSearchPage();
        }
        let res = DySearch.homeIntoSearchUser(settingData.account);
        if (res) {
            return res;
        }

        return DyUser.focusUserList(0, this.getMsg, DyVideo, DyComment, machine, settingData, this.contents);
    },
}

let settingData = machine.getFocusSettingRate();//weilan31045

Log.log('settingData', settingData);
console.log(machine.getMsg(0));
console.log(settingData.opCount);

if (!settingData.account) {
    tCommon.showToast('未设置账号，取消执行');
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
            FloatDialogs.show('提示', '截流关注已完成');
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

