import {Common as tCommon} from "app/dy/Common";
import { Index as DyIndex } from 'app/dy/Index.js';
// import { Search as DySearch } from 'app/dy/Search.js';
const DyUser = require('app/dy/User.js');
import { Video as DyVideo } from 'app/dy/Video.js';
// import { Comment as DyComment } from 'app/dy/Comment.js';

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    run() {
        return this.testTask();
    },

    log(){
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-cancel-fans-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask() {
        //首先进入点赞页面
        DyIndex.intoMyPage();
        DyUser.cancelFocusList();
    },
}

FloatDialogs.show('提示', '该功能将在后续版本中上线，尽情期待！')
System.exit();

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
        Engines.executeScript("tasks/task_close_alert.js");
        task.run(task.taskId);
        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        tCommon.backHome();
    }
}
