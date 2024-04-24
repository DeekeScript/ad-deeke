import { Common as tCommon } from "app/dy/Common";
import { Index as DyIndex } from 'app/dy/Index.js';
import { User as DyUser } from 'app/dy/User.js';

let task = {
    run() {
        return this.testTask();
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-cancel-focus-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask() {
        //首先进入点赞页面
        DyIndex.intoMyPage();
        return DyUser.cancelFocusList();
    },
}


tCommon.openApp();

while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        Engines.executeScript("unit/dialogClose.js");
        if (task.run()) {
            tCommon.sleep(1000);
            FloatDialogs.show('提示', '取消关注已完成');
            break;
        }
        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e.stack);
        tCommon.backHome();
    }
}