import { Common as tCommon } from "app/dy/Common";
import { Index as DyIndex } from 'app/dy/Index.js';
// import { Search as DySearch } from 'app/dy/Search.js';
import { User as DyUser } from 'app/dy/User.js';
//import { Video as DyVideo } from 'app/dy/Video.js';
// import { Comment as DyComment } from 'app/dy/Comment.js';

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    nicknames: [],
    run() {
        return this.testTask();
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-fans-back-view-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask() {
        //首先进入点赞页面
        DyIndex.intoMyPage();
        return DyUser.viewFansList(this.nicknames);
    },
}

tCommon.openApp();
while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        // thr = tCommon.closeAlert();
        if (task.run()) {
            tCommon.sleep(1000);
            FloatDialogs.show('提示', '回访已完成');
            break;
        }
        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e.stack);
        tCommon.backHome();
    }
}
