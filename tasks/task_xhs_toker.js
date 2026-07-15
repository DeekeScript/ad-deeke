let storage = require("../common/storage.js");
let machine = require("../common/machine.js");
let Common = require("../app/xhs/Common.js");
let xhs = require("../app/xhs/xhs.js");
let baiduWenxin = require('../service/baiduWenxin.js');

let task = {
    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-xhs-toker-" + file + ".txt";
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

    run() {
        this.log();
        Common.openApp();
        return xhs.run(this.getMsg);
    }
}

let config = {
    isCity: storage.get('toker_xhs_is_city', 'bool'),
    opWait: storage.get('toker_xhs_op_second', 'int') * 1000,//操作间隔
    workWait: storage.get('toker_xhs_view_video_second', 'int') * 1000,
    keywords: storage.get('toker_xhs_view_video_keywords', 'string'),
    toker_view_video_ip: storage.get('toker_xhs_view_video_ip', 'string'),
    zanRate: storage.get('toker_xhs_zan_rate', 'int') / 100,
    commentRate: storage.get('toker_xhs_comment_rate', 'int') / 100,
    focusRate: storage.get('toker_focus_rate', 'int') / 100,
    privatMsgRate: storage.get('toker_xhs_private_msg_rate', 'int') / 100,
    zanCommentRate: storage.get('toker_comment_area_zan_rate', 'int') / 100,
    sex: storage.getArray('toker_xhs_run_sex'),
    minAge: storage.get('toker_xhs_run_min_age', 'int'),
    maxAge: storage.get('toker_xhs_run_max_age', 'int'),
    toker_run_hour: storage.getArray('toker_xhs_run_hour'),//运行时间
};

//点赞点赞识别需要
if (!Access.isMediaProjectionEnable()) {
    FloatDialogs.show('温馨提示', '请打开主界面侧边栏，开启“图色查找”权限');
    System.exit();
}

System.setAccessibilityMode('fast');
while (true) {
    task.log();
    try {
        let code = task.run();
        if (code === 101) {
            // tCommon.closeApp();
            Common.showToast('不在任务时间，休息一会儿');
            Log.log('不在任务时间，休眠一会儿');
            Common.backApp();
            //App.notifySuccess('通知', '即将返回到App');
            let hours = config.toker_run_hour;
            console.log(Array.isArray(hours), hours, (new Date()).getHours(), hours.includes("0"));
            while (true) {
                Common.sleep(1 * 60 * 1000 / 6);
                if (hours.includes((new Date()).getHours().toString())) {
                    break;
                }
            }
            throw new Error('重新进入');
        }
        Common.sleep(3000);
    } catch (e) {
        Log.log(e);
        Common.backHome();
    }
}