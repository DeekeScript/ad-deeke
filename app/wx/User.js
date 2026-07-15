let Common = require('app/wx/Common.js');
let statistics = require('common/statistics.js');

let User = {
    privateMsg(msg) {
        if (
            UiSelector().textContains('私密').isVisibleToUser(true).findOnce() ||
            UiSelector().textContains('注销').isVisibleToUser(true).findOnce() ||
            UiSelector().textContains('封禁').isVisibleToUser(true).findOnce()
        ) {
            Log.log('私密账号');
            return false;
        }

        let sendTag = Common.id('mld').descContains('私信').isVisibleToUser(true).findOnce();
        if (!sendTag) {
            Log.log('找不到发私信按钮');
            return false;
        }

        Common.click(sendTag, 0.2);
        Common.sleep(2000 + 2000 * Math.random());

        let textTag = Common.id('bkk').isVisibleToUser(true).findOnce();
        if (!textTag) {
            Log.log('找不到发私信输入框');//可能是企业号，输入框被隐藏了
            Common.back();
            return false;
        }
        Common.click(textTag, 0.35);
        Common.sleep(500 + 500 * Math.random());

        //我知道了
        let knowTag = UiSelector().text('我知道了').clickable(true).isVisibleToUser(true).findOnce();
        if (knowTag) {
            Common.click(knowTag, 0.2);
            Common.sleep(1000 + 1000 * Math.random());
            Common.click(textTag, 0.35);
            Common.sleep(500 + 500 * Math.random());
        }

        System.setClip(msg);
        textTag = UiSelector().editable(true).isVisibleToUser(true).findOnce();
        textTag.paste();
        Common.sleep(2000 + 1000 * Math.random());
        let sendTextTag = Common.id('bql').isVisibleToUser(true).findOnce();
        if (!sendTextTag) {
            Log.log('发送消息失败');
            return false;
        }

        Common.click(sendTextTag, 0.2);
        Common.sleep(1000 + 1000 * Math.random());
        Log.log("私信发送完成");
        statistics.privateMsg();
        Log.log("成功：返回2次");
        Common.back(2);
        return true;
    },

    getNickname() {
        let tag = Common.id('fzm').findOne();
        let r = tag.bounds();
        let title = Images.findTextInRegion(Images.capture(), r.left - 20, r.top, r.width() * 2.5, r.height());
        return title ? title[0] : null;
    },

    getDouyin() {
        return this.getNickname();
    },

    getZanCount() {
        return 0;
    },

    getFocusCount() {
        return 0;
    },

    getFansCount() {
        return 0;
    },

    getIp() {
        let tag = Common.id('ov9').isVisibleToUser(true).findOnce();
        if (!tag) {
            return '';
        }

        return tag.text();
    },

    /**
     * 
     * @returns {number}
     */
    getGender() {
        //1男，0女，2未知
        let tag = Common.id('ov9').textContains('女').findOnce();
        if (tag) {
            return 0;
        }

        tag = Common.id('ov9').textContains('男').findOnce();
        if (tag) {
            return 1;
        }

        return 2;
    },

    //是否是私密账号
    isPrivate() {
        Log.log("是否是私密账号？");
        if (UiSelector().textContains('私密').findOnce() ? true : false) {
            return true;
        }

        //帐号已被封禁
        if (UiSelector().textContains('封禁').findOnce()) {
            return true;
        }

        //注销了
        if (UiSelector().textContains('注销').findOnce()) {
            return true;
        }

        Log.log("不是私密账号");
        return false;
    },

    isFocus() {
        let focusTag = Common.id('fyl').text('已关注').isVisibleToUser(true).findOnce() || Common.id('fyl').text('互相关注').isVisibleToUser(true).findOnce();//关注按钮
        if (!focusTag) {
            return true;
        }
        return false;
    },

    focus() {
        let focusTag = Common.id('fyl').text('关注').isVisibleToUser(true).findOnce() || Common.id('fyl').text('回关').isVisibleToUser(true).findOnce();//.text('关注')  .text('回关')
        if (focusTag && focusTag) {
            Common.click(focusTag, 0.2);
            statistics.focus();
            return true;
        }

        let hasFocusTag = this.isFocus();//已关注  （相互关注目前不确定，应该也是这个ID）
        if (hasFocusTag) {
            return true;
        }

        throw new Error('找不到关注和已关注');
    },

    getUserInfo() {
        /** @type {any} */
        let res = {};
        res = {
            nickname: this.getNickname(),
            douyin: this.getDouyin(),
            ip: this.getIp(),
            gender: this.getGender(),
            isPrivate: this.isPrivate(),
        };

        if (res.isPrivate) {
            return res;
        }
        return res;
    },

    intoVideo() {
        let videoTag = UiSelector().desc('视频').className('androidx.appcompat.app.a').isVisibleToUser(true).findOne();
        if (videoTag) {
            if (!videoTag.isSelected()) {
                Log.log('视频标签未选中');
                Common.click(videoTag, 0.2);
                Common.sleep(3000 + 2000 * Math.random());
                Log.log('点击了视频标签');
            } else {
                Log.log('视频标签已选中');
            }
        } else {
            Log.log('没有找到视频标签');
        }

        let intoVideoTag = Common.id('l9e').isVisibleToUser(true).findOne();
        if (!intoVideoTag) {
            Log.log('没有找到视频标签');
            return false;
        }

        Common.click(intoVideoTag, 0.18);
        Common.sleep(5000 + 3000 * Math.random());
        return true;
    },
}

module.exports = User;
