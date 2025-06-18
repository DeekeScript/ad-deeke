let storage = require("common/storage.js");
let machine = require("common/machine.js");
let Common = require("app/xhs/Common.js");
let xhs = require("app/xhs/xhs.js");
let baiduWenxin = require('service/baiduWenxin.js');

let task = {
    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-xhs-toker-" + file + ".txt";
        Log.setFile(allFile);
    },

    //type 0 评论，1私信
    getMsg(type, title, age, gender) {
        if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
        }

        //return { msg: ['厉害', '六六六', '666', '拍得很好', '不错哦', '关注你很久了', '学习了', '景色不错', '真的很不错', '太厉害了', '深表认同', '来过了', '茫茫人海遇见你', '太不容易了', '很好', '懂了', '我看到了', '可以的', '一起加油', '真好', '我的个乖乖'][Math.round(Math.random() * 20)] };
        return machine.getMsg(type) || false;//永远不会结束
    },

    run() {
        this.log();
        Common.openApp();
        xhs.run(this.getMsg);
    }
}

if (task.run()) {
    FloatDialogs.show('提示', '已完成');
}
