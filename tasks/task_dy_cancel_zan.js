import {Common as tCommon} from "app/dy/Common";
import { Index as DyIndex } from 'app/dy/Index.js';
// import { Search as DySearch } from 'app/dy/Search.js';
// const DyUser = require('app/dy/User.js');
import { Video as DyVideo } from 'app/dy/Video.js';
// import { Comment as DyComment } from 'app/dy/Comment.js';

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    rp: 0,
    run() {
        return this.testTask();
    },

    log(){
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-cancel-zan-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask() {
        //首先进入点赞页面
        DyIndex.intoMyPage();
        let res = DyIndex.intoMyLikeVideo();
        if (!res) {
            this.rp++; //没有视频，三次之后确定全部取消了
            if (this.rp >= 3) {
                return true;//完成了
            }
            Log.log('错误');
            return System.toast('错误');
        }

        this.rp = 0;//有视频
        let container = [];
        let _rp = 0;
        while (true) {
            //查看是不是直播中
            Log.log('开始');
            let title = DyVideo.getContent();
            let nickname;
            if (DyVideo.isLiving()) {
                Log.log('直播中的主播');
                try {
                    nickname = DyVideo.getLivingNickname();
                } catch (e) {
                    nickname = 'living';
                }
            } else {
                Log.log('不是直播');
                nickname = DyVideo.getNickname();
            }

            Log.log('nickname:title', nickname + ':' + title);
            if (container.includes(nickname + ':' + title)) {
                DyVideo.next();
                _rp++;
                if (_rp >= 3) {
                    Log.log('_rp', _rp);
                    return false;//这里可能还没有完成 可能是各种问题导致的卡顿
                }
                continue;
            }
            container.push(nickname + ':' + title);
            _rp = 0;

            let isZan = DyVideo.isZan();
            Log.log('isZan', isZan);
            if (isZan) {
                DyVideo.clickZan();
            }
            tCommon.sleep(500);
            DyVideo.next();
        }
    },
}

let i = false;
Dialogs.confirm('提示', '确定开始执行嘛？', (_true) => {
    i = _true;
});

if (!i) {
    tCommon.showToast('你取消了执行');
     //console.hide();();
    System.exit();
}

tCommon.openApp();

let thr = undefined;
while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        if (task.run()) {
            if (thr) {
                thr.interrupt();
                Threads.shutDownAll();
                tCommon.sleep(1000);
            }
            FloatDialogs.show('提示', '一键取赞完成');
            break;
        }
        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        try {
            if (thr) {
                thr.interrupt();
                Threads.shutDownAll();
            }
            tCommon.showToast("遇到错误，即将自动重启");
            tCommon.closeApp();
            tCommon.sleep(3000);
            tCommon.showToast('开启抖音');
            tCommon.openApp();
        } catch (e) {
            Log.log('启停bug', e);
        }
    }
}

try {
    Engines.closeAll(true);
} catch (e) {
    Log.log('停止脚本');
}
