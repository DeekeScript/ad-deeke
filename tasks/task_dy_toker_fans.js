import { Common as tCommon } from 'app/dy/Common.js';
import { Index as DyIndex } from 'app/dy/Index.js';
import { Search as DySearch } from 'app/dy/Search.js';
import { User as DyUser } from 'app/dy/User.js';
import { Video as DyVideo } from 'app/dy/Video.js';
import { storage } from 'common/storage.js';
import { machine } from 'common/machine.js';
import { Comment as DyComment } from 'app/dy/Comment.js';
import { mHttp as Http } from 'unit/mHttp.js';
import { baiduWenxin } from 'service/baiduWenxin.js';

let task = {
    contents: [],
    me: {},
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
    getMsg(type, title, age, gender) {
        if (storage.get('setting_baidu_wenxin_switch',  'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
        }

        //return { msg: ['厉害', '六六六', '666', '拍得很好', '不错哦', '关注你很久了', '学习了', '景色不错', '真的很不错', '太厉害了', '深表认同', '来过了', '茫茫人海遇见你', '太不容易了', '很好', '懂了', '我看到了', '可以的', '一起加油', '真好', '我的个乖乖'][Math.round(Math.random() * 20)] };
        return machine.getMsg(type) || false;//永远不会结束
    },

    testTask(settingData) {
        //首先进入点赞页面
        DyIndex.intoMyPage();
        this.me = {
            nickname: DyUser.isCompany() ? DyUser.getDouyin() : DyUser.getNickname(),
            douyin: DyUser.getDouyin(),
            focusCount: DyUser.getFocusCount(),
        }

        tCommon.toast(JSON.stringify({
            '账号：': this.me.douyin,
            '昵称：': this.me.nickname,
        }));
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

        return DyUser.focusUserList(1, this.getMsg, DyVideo, DyComment, machine, settingData, this.contents, this.me.nickname);
    },
}

let settingData = machine.getFansSettingRate();//weilan31045

settingData.isFirst = true;
Log.log('settingData', settingData);
console.log(machine.getMsg(0));
console.log(settingData.opCount);

if (!settingData.account) {
    tCommon.showToast('未设置账号，取消执行');
    //console.hide();();
    System.exit();
}

tCommon.openApp();

let thr = undefined;
while (true) {
    Log.log('日志开始');
    task.log();
    try {
        //开启线程  自动关闭弹窗
        Engines.executeScript("unit/dialogClose.js");
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
        Log.log(e.stack);
        tCommon.backHome();
    }
}
