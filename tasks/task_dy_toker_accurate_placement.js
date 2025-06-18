let tCommon = require("app/dy/Common");
let DyIndex = require("app/dy/Index");
let DySearch = require("app/dy/Search");
let DyUser = require("app/dy/User");
let DyVideo = require("app/dy/Video");
let DyComment = require("app/dy/Comment");
let Http = require('unit/mHttp');
let storage = require("common/storage");
let machine = require("common/machine");

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    nicknames: [],//已经艾特的不再处理
    count: 0,
    run(count, kw) {
        return this.testTask(count, kw);
    },

    getMsg(type) {
        return machine.getMsg(type) || false;//永远不会结束
    },

    log(){
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-task_dy_toker_accurate_placement-" + file + ".txt";
        Log.setFile(allFile);
    },

    includesKw(str, kw) {
        for (let i in kw) {
            if (str.includes(kw[i])) {
                return true;
            }
        }
        return false;
    },

    testTask(count, kw) {
        if (count <= this.count) {
            return true;
        }

        //首先进入页面
        DyIndex.intoSearchPage();
        Log.log('链接：', kw);

        let res = DySearch.intoSearchLinkVideo(kw);
        if (!res) {
            System.toast('找不到视频');
            throw new Error('找不到视频：' + kw);
        }

        DyVideo.openComment(!!DyVideo.getCommentCount());
        let baseCount = 8;
        let times = Math.ceil(count / baseCount);
        for (let i = 0; i < times; i++) {
            let opCount = count - this.count > baseCount ? baseCount : count - this.count;
            DyComment.commentAtUser(opCount, this.nicknames);
            Log.log('一轮完成');
            this.count += opCount;
        }

        if (count <= this.count) {
            return true;
        }
        return false;
    },
}

let kw = Dialogs.input('请输入视频链接：', machine.get('task_dy_toker_accurate_placement') || '');
if (!kw) {
    System.toast('你取消了任务');
    System.exit();
}

machine.set('task_dy_toker_accurate_placement', kw);

let count = Dialogs.input('请输入精准投放用户数量：', machine.get('task_dy_toker_accurate_placement_count') || '');
if (!count) {
    System.toast('你取消了任务');
    System.exit();
}

if (count > 100) {
    System.toast('每次操作，数量不得大于100');
    System.exit();
}

machine.set('task_dy_toker_accurate_placement_count', count);

tCommon.openApp();

let thr = undefined;
while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        thr = tCommon.closeAlert();
        if (task.run(count, kw)) {
            if (thr) {
                thr.interrupt();
                Threads.shutDownAll();
            }
            tCommon.sleep(2000);
            FloatDialogs.show('精准投放完成');
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
