let tCommon = require("../app/dy/Common");
let DyIndex = require('../app/dy/Index.js');
let storage = require("../common/storage");
let machine = require("../common/machine");
let DyMessage = require('../app/dy/Message.js');
let baiduWenxin = require('../service/baiduWenxin.js');

let task = {
    contents: [],
    lib_id: undefined,
    /**
     * 
     * @param {string} keyword 
     * @param {number} index 
     * @returns 
     */
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
    /**
     * 
     * @param {number} type 
     * @param {string} [title] 
     * @param {number} [age] 
     * @param {number} [gender] 
     * @returns {any}
     */
    getMsg(type, title, age, gender = 2) {
        let genderStr = ['女', '男', '未知'][gender];
        if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, genderStr) : baiduWenxin.getComment(title) };
        }
        return machine.getMsg(type) || false;//永远不会结束
    },

    /**
     * 
     * @param {string} keyword 
     * @param {number} index 
     * @returns 
     */
    testTask(keyword, index) {
        //首先进入点赞页面
        console.log('开始进入首页');
        DyIndex.intoHome();
        console.log('开始进入消息页面');
        DyIndex.intoMyMessage();
        Log.log('keyword', keyword, index);
        if (!DyMessage.intoFansGroup(keyword, index)) {
            return false;
        }

        /** @ts-ignore */
        return DyMessage.intoGroupUserList(this.contents, (type, title, age, gender) => this.getMsg(type, this.lib_id, title, age, gender), (v) => machine.get('task_dy_fans_group_' + keyword + '_' + v, 'bool'), (v) => machine.set('task_dy_fans_group_' + keyword + '_' + v, true));
    },
}


let keyword = storage.get('task_dy_fans_group');
if (!keyword) {
    tCommon.showToast('你取消了执行');
    System.exit();
    tCommon.sleep(2000);
}

let index = storage.get('task_dy_fans_group_index', 'int');
if (!index) {
    tCommon.showToast('你取消了执行');
    System.exit();
    tCommon.sleep(2000);
}

if (!Access.isMediaProjectionEnable()) {
    FloatDialogs.show('温馨提示', '请打开主界面侧边栏，开启“图色查找”权限');
    System.exit();
    tCommon.sleep(2000);
}

tCommon.openApp();
//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

while (true) {
    System.setAccessibilityMode('!fast');//快速模式
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