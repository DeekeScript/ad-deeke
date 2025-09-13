let Common = require('app/ks/Common.js');
let statistics = require('common/statistics.js');
let V = require('version/KsV.js');


let User = {
    privateMsg(msg) {
        if (Common.id(V.User.isPrivate[0]).isVisibleToUser(true).findOnce() || Common.id(V.User.isPrivate[1]).isVisibleToUser(true).findOnce() || Common.id(V.User.isPrivate[2]).isVisibleToUser(true).findOnce()) {
            Log.log('私密账号');
            return false;
        }

        let settingTag = Common.id(V.User.privateMsg[0]).descContains(V.User.privateMsg[1]).isVisibleToUser(true).findOnce() || Common.id(V.User.privateMsg[0]).descContains(V.User.privateMsg[1]).findOnce();
        if (!settingTag) {
            Log.log('找不到setting按钮');
            return false;
        }

        Common.click(settingTag);
        Log.log("私信");
        Common.sleep(1000);

        let sendTag = Common.id(V.User.privateMsg[2]).text(V.User.privateMsg[3]).isVisibleToUser(true).findOnce();
        if (!sendTag) {
            Log.log('找不到发私信按钮');
            return false;
        }

        Common.click(sendTag.parent());
        Common.sleep(2000);

        let res = this.privateMsgTwo(msg);
        if (res) {
            Common.back(1);
        }
        return res;
    },

    privateMsgTwo(msg) {
        let textTag = Common.id(V.User.privateMsg[4]).isVisibleToUser(true).filter(v => {
            return v.isEditable();
        }).findOnce();
        if (!textTag) {
            Log.log('找不到发私信输入框');//可能是企业号，输入框被隐藏了
            Common.back();
            return false;
        }
        Common.click(textTag);
        Common.sleep(500);

        textTag = Common.id(V.User.privateMsg[4]).isVisibleToUser(true).findOnce();
        let iText = '';
        for (let i = 0; i < msg.length; i++) {
            iText = msg.substring(0, i + 1);
            textTag.setText(iText);
            Common.sleep(200 + 300 * Math.random());
        }

        Common.sleep(500);
        let sendTextTag = Common.id(V.User.privateMsg[5]).isVisibleToUser(true).findOnce();
        if (!sendTextTag) {
            Log.log('发送消息失败');
            return false;
        }

        Common.click(sendTextTag);
        Common.sleep(1000);
        Log.log("私信发送完成");
        statistics.privateMsg();
        Common.sleep(Math.random() * 1000);
        Log.log("成功：返回2次");
        Common.back(1);
        return true;
    },

    getNickname() {
        //一般用户
        let i = 3;
        while (i--) {
            let nickname = Common.id(V.User.getNickname[0]).isVisibleToUser(true).findOnce();
            if (nickname && nickname.text()) {
                return nickname.text();
            }
            Common.sleep(200);
        }

        throw new Error('找不到昵称');
    },

    //机构 媒体等账号 公司
    isCompany() {
        return this.getDouyin() == this.getNickname();
    },

    getDouyin() {
        let douyin = Common.id(V.User.getDouyin[0]).isVisibleToUser(true).findOnce();
        if (douyin && douyin.text()) {
            return douyin.text().replace(V.User.getDouyin[1], '');
        }

        //部分机型ID不一样
        douyin = UiSelector().id(V.User.getDouyin[2]).findOnce();
        if (douyin && douyin.text()) {
            return douyin.text().replace(V.User.getDouyin[1], '');
        }

        return this.getNickname();
    },

    getZanCount() {
        let zan = Common.id(V.User.getZanCount[0]).findOnce();
        if (!zan || !zan.text()) {
            throw new Error('找不到赞');
        }

        return Common.numDeal(zan.text());
    },

    getFocusCount() {
        let focus = Common.id(V.User.getFocusCount[0]).findOnce();
        if (!focus) {
            throw new Error('找不到关注');
        }

        return Common.numDeal(focus.text());
    },

    getFansCount() {
        let fans = Common.id(V.User.getFansCount[0]).findOnce();
        if (!fans) {
            throw new Error('找不到粉丝');
        }

        return Common.numDeal(fans.text());
    },

    getIntroduce() {
        let tag = Common.id(V.User.getIntroduce[0]).findOnce();
        if (!tag) {
            return '';
        }
        return tag.text();
    },

    getIp() {
        let tag = Common.id(V.User.getIp[0]).isVisibleToUser(true).textContains(V.User.getIp[1]).findOnce();
        if (!tag) {
            return '';
        }

        return tag.text().replace(V.User.getIp[1], '');
    },

    getAge() {
        let tag = Common.id(V.User.getAge[0]).textContains(V.User.getAge[1]).findOnce();
        let text = 0;
        if (!tag) {
            return '';
        }

        if (/^[\d]+岁$/.test(tag.text())) {
            return Common.numDeal(tag.text());
        }

        return text;
    },

    getWorksTag() {
        let tag = Common.id(V.User.getWorksTag[0]).textContains(V.User.getWorksTag[1]).findOnce();
        console.log("tag", tag);
        if (!tag) {
            return {
                text: function () {
                    return 0;
                }
            }
        }

        return tag;
    },

    getWorksCount() {
        let tag = this.getWorksTag();
        return Common.numDeal(tag.text());
    },

    getGender() {
        //1男，0女，2未知
        let tag = Common.id(V.User.getGender[0]).textContains(V.User.getGender[1]).findOnce();
        if (tag) {
            return '0';
        }

        tag = Common.id(V.User.getGender[0]).textContains(V.User.getGender[2]).findOnce();
        if (tag) {
            return '1';
        }

        return '2';
    },

    //是否是私密账号
    isPrivate() {
        Log.log("是否是私密账号？");
        if (UiSelector().textContains(V.User.isPrivate[0]).findOnce() ? true : false) {
            return true;
        }

        //帐号已被封禁
        if (UiSelector().textContains(V.User.isPrivate[1]).findOnce()) {
            return true;
        }

        //注销了
        if (UiSelector().textContains(V.User.isPrivate[2]).findOnce()) {
            return true;
        }

        Log.log("不是私密账号");
        return false;
    },

    isFocus() {
        let focusTag = Common.id(V.User.isFocus[0]).text(V.User.isFocus[1]).isVisibleToUser(true).findOnce();//关注按钮
        if (!focusTag) {
            return true;
        }
        return false;
    },

    focus() {
        let focusTag = Common.id(V.User.isFocus[0]).text(V.User.isFocus[1]).isVisibleToUser(true).findOnce();//.text('关注')  .text('回关')
        if (focusTag) {
            Common.click(focusTag);
            statistics.focus();
            return true;
        }

        let hasFocusTag = Common.id(V.User.isFocus[2]).isVisibleToUser(true).findOnce();//已关注  （相互关注目前不确定，应该也是这个ID）
        if (hasFocusTag) {
            return true;
        }

        throw new Error('找不到关注和已关注');
    },

    cancelFocus() {
        let hasFocusTag = Common.id(V.User.isFocus[2]).isVisibleToUser(true).findOnce();//text(已关注) || text(互相关注)
        if (hasFocusTag) {
            hasFocusTag.click();
            Log.log('点击了已关注')
            Common.sleep(1500);
            //真正地点击取消
            let cancelTag = Common.id(V.User.cancelFocus[0]).text(V.User.cancelFocus[1]).isVisibleToUser(true).findOnce();
            Log.log('cancelTag', cancelTag);
            if (cancelTag) {
                Common.click(cancelTag);
                Common.sleep(2000);
            }
        }

        let focusTag = Common.id(V.User.isFocus[0]).text(V.User.isFocus[1]).findOnce();
        if (focusTag) {
            Log.log('取消关注了');
            return true;
        }

        throw new Error('找不到关注和已关注');
    },

    getUserInfo() {
        let res = {};
        res = {
            nickname: this.getNickname(),
            douyin: this.getDouyin(),
            age: this.getAge() || 0,
            // introduce: this.getIntroduce(),
            // zanCount: this.getZanCount(),
            // focusCount: this.getFocusCount(),
            // fansCount: this.getFansCount(),
            worksCount: 0,
            // openWindow: 0,//开启橱窗
            // tuangouTalent: this.isTuangouTalent(),
            ip: this.getIp(),
            // isCompany: this.isCompany(),//是否是机构 公司
            gender: this.getGender(),
            isPrivate: this.isPrivate(),
        };

        if (res.isPrivate) {
            return res;
        }

        let newRes = {
            worksCount: this.getWorksCount(),
            // openWindow: this.openWindow(),
        };

        for (let i in newRes) {
            res[i] = newRes[i];
        }
        return res;
    },
}

module.exports = User;
