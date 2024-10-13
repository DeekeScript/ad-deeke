let tCommon = require("app/dy/Common");
let DyIndex = require('app/dy/Index.js');
//let DySearch = require('app/dy/Search.js');
// const DyUser = require('app/dy/User.js');
//let DyVideo = require('app/dy/Video.js');
let storage = require("common/storage");
let machine = require("common/machine");
let DyMessage = require('app/dy/Message.js');
let baiduWenxin = require('service/baiduWenxin.js');
// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    contents: [],
    lib_id: undefined,
    run(keyword, index) {
        return this.testTask(keyword, index);
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-fans-group-" + file + ".txt";
        Log.setFile(allFile);
    },

    //type 0 评论，1私信
    getMsg(type, lib_id, title, age, gender) {
        if (storage.getMachineType() === 1) {
            if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
                return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
            }
            return machine.getMsg(type) || false;//永远不会结束
        }
    },

    testTask(keyword, index) {
        //首先进入点赞页面
        DyIndex.intoHome();
        DyIndex.intoMyMessage();
        Log.log('keyword', keyword, index);
        if (!DyMessage.intoFansGroup(keyword, index)) {
            return false;
        }

        return DyMessage.intoGroupUserList(this.contents, (type, title, age, gender) => this.getMsg(type, this.lib_id, title, age, gender), (v) => machine.get('task_dy_fans_group_' + keyword + '_' + v), (v) => machine.set('task_dy_fans_group_' + keyword + '_' + v, true));
    },
}


let keyword = storage.get('task_dy_fans_group');
if (!keyword) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
    System.exit();
}

let index = storage.get('task_dy_fans_group_index', 'int');
if (!index) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
    System.exit();
}

tCommon.openApp();
//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {

        let res = task.run(keyword, index);
        if (res || res === false) {
            tCommon.sleep(1000);
            FloatDialogs.show('提示', res ? '已完成' : '找不到群');
            break;
        }

        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        tCommon.closeAlert(1);
        tCommon.backHome();
    }
}