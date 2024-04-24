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
    me: {},
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

        return DyUser.fansIncList(this.getMsg, DyVideo, DyComment, machine, settingData, this.contents, this.me.nickname);
    },
}

let settingData = machine.getFansIncSettingRate();//weilan31045

Log.log('settingData', settingData);
//重新计算百分比

let count = settingData.task_dy_fans_inc_head_zan_rate + settingData.task_dy_fans_inc_video_zan_rate + settingData.task_dy_fans_inc_comment_rate + settingData.task_dy_fans_inc_collection_rate;
if (count == 0) {
    count = 1;
}

settingData.task_dy_fans_inc_head_zan_rate = (settingData.task_dy_fans_inc_head_zan_rate / count) * 100;
settingData.task_dy_fans_inc_video_zan_rate = (settingData.task_dy_fans_inc_video_zan_rate / count) * 100;
settingData.task_dy_fans_inc_comment_rate = (settingData.task_dy_fans_inc_comment_rate / count) * 100;
settingData.task_dy_fans_inc_collection_rate = (settingData.task_dy_fans_inc_collection_rate / count) * 100;

console.log(machine.getMsg(0));
Log.log('settingData', settingData);

let tmp = settingData.task_dy_fans_inc_account.split(',');

tCommon.openApp();
Engines.executeScript("unit/dialogClose.js"); //开启线程  自动关闭弹窗
Log.log('日志开始');
task.log();

while (true) {
    try {
        let index = Math.round(Math.random() * tmp.length);
        if (index > 0) {
            index -= 1;
        }
        settingData.account = tmp[index];

        if (task.run(settingData)) {
            tCommon.back(4);
            tCommon.sleep(3000);
        }
    } catch (e) {
        Log.log(e.stack);
        tCommon.backHome();
    }
}
