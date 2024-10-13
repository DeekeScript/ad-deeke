let Common = require("app/xhs/Common.js");
let V = require("version/XhsV.js");

let User = {
    swipeFans(selectText) {
        if (selectText == V.User.fans[1]) {
            Common.swipeFocusListOp();
        } else if (selectText == V.User.fans[2]) {
            Common.swipeFansListOp();
        } else if (selectText == V.User.fans[3]) {
            Common.swipeRecommendListOp();
        }
        Log.log("滑动异常：" + selectText);
    },

    intoVideo() {
        let videoTag = Common.id(V.User.fans[7]).findOne();
        if (!videoTag) {
            return false;
        }

        videoTag.click();
        Common.sleep(5000);
        return true;
    },

    privateMsg(msg) {
        let focusTag = Common.id(V.User.focus[0]).findOne();
        if (focusTag && focusTag.text() == V.User.focus[2]) {
            focusTag.click();
            Common.sleep(2000 + 1000 * Math.random());
        } else {
            let sendMsgTag = Common.id(V.User.sendMsg[0]).findOne();
            sendMsgTag.click();
            Common.sleep(2000 + 1000 * Math.random());
        }

        let sendIptTag = Common.id(V.User.msgBtn[0]).findOne();
        Common.click(sendIptTag);
        Common.sleep(500 + 1000 * Math.random());

        sendIptTag = Common.id(V.User.msgBtn[0]).findOne();
        Log.log('开始设置私信', msg);
        sendIptTag.setText(msg);
        Common.sleep(500 + 500 * Math.random());

        //发送
        let sendBtnTag = Common.id(V.User.sendBtn[0]).findOne();
        Common.click(sendBtnTag);
        Log.log('点击发送');

        Common.back();
        Common.sleep(500 + 500 * Math.random());
        Common.back();
    },

    isFocus() {
        let focusTag = Common.id(V.User.focus[0]).findOne();
        if (focusTag && focusTag.text() == V.User.focus[2]) {
            Log.log('已经关注过了');
            return true;
        }
        return false;
    },

    focus() {
        if (this.isFocus()) {
            return true;
        }

        let focusTag = Common.id(V.User.focus[0]).findOne();
        focusTag.click();
        return true;
    },

    getListWorkCount(tag) {
        let workCountTag = tag.children().findOne(Common.id(V.User.fans[8]));//笔记·44|粉丝·38
        if (!workCountTag) {
            return 0;
        }

        let workCount = workCountTag.text().split('|')[0].replace('笔记·', '').replace('万', '0000').replace('w', '0000').replace('W', '0000');
        return workCount * 1 || 0;
    },

    getListFansCount(tag) {
        let workCountTag = tag.children().findOne(Common.id(V.User.fans[8]));//笔记·44|粉丝·38
        if (!workCountTag) {
            return 0;
        }

        let workCount = workCountTag.text().split('|')[1].replace('粉丝·', '').replace('万', '0000').replace('w', '0000').replace('W', '0000');
        return workCount * 1 || 0;
    },

    getFansCount() {
        let fansCountTag = Common.id(V.User.fansText[0]).findOne();
        if (!fansCountTag) {
            return 0;
        }

        let fansCount = fansCountTag.text().replace('万', '0000').replace('w', '0000').replace('W', '0000');
        return fansCount * 1 || 0;
    }
}

module.exports = User;
