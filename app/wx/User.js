let Common = require('app/wx/Common.js');
let statistics = require('common/statistics.js');
let V = require('version/WxV.js');


let User = {
    privateMsg(msg) {
        if (Common.id(V.User.isPrivate[0]).isVisibleToUser(true).findOnce() || Common.id(V.User.isPrivate[1]).isVisibleToUser(true).findOnce() || Common.id(V.User.isPrivate[2]).isVisibleToUser(true).findOnce()) {
            Log.log('私密账号');
            return false;
        }

        let sendTag = Common.id(V.User.privateMsg[0]).text(V.User.privateMsg[1]).isVisibleToUser(true).findOnce();
        if (!sendTag) {
            Log.log('找不到发私信按钮');
            return false;
        }

        Common.click(sendTag.parent());
        Common.sleep(2000 + 2000 * Math.random());

        let textTag = Common.id(V.User.privateMsg[2]).isVisibleToUser(true).findOnce();
        if (!textTag) {
            Log.log('找不到发私信输入框');//可能是企业号，输入框被隐藏了
            Common.back();
            return false;
        }
        Common.click(textTag);
        Common.sleep(500 + 500 * Math.random());

        textTag = Common.id(V.User.privateMsg[2]).isVisibleToUser(true).filter(v => {
            return v && v.children().length() === 0;
        }).findOnce();

        textTag.setText(msg);
        Common.sleep(2000 + 1000 * Math.random());
        let sendTextTag = Common.id(V.User.privateMsg[3]).isVisibleToUser(true).findOnce();
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
        if (App.getAppVersionCode('com.tencent.mm') >= "2841") {
            let tag = Common.id(V.User.getNickname[1]).findOne();
            let r = tag.bounds();
            let title = Images.findTextInRegion(Images.capture(), r.left - 20, r.top, r.width() * 2.5, r.height());
            return title ? title[0] : false;
        }

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
        // let douyin = Common.id(V.User.getDouyin[0]).isVisibleToUser(true).findOnce();
        // if (douyin && douyin.text()) {
        //     return douyin.text().replace(V.User.getDouyin[1], '');
        // }

        // //部分机型ID不一样
        // douyin = UiSelector().id(V.User.getDouyin[2]).findOnce();
        // if (douyin && douyin.text()) {
        //     return douyin.text().replace(V.User.getDouyin[1], '');
        // }

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

    getIntroduce() {
        let tag = Common.id(V.User.getIntroduce[0]).isVisibleToUser(true).findOnce();
        if (!tag) {
            return '';
        }
        return tag.text();
    },

    getIp() {
        let tag = Common.id(V.User.getIp[0]).isVisibleToUser(true).findOnce();
        if (!tag) {
            return '';
        }

        return tag.text();
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
        if (focusTag && focusTag.parent()) {
            Common.click(focusTag.parent());
            statistics.focus();
            return true;
        }

        let hasFocusTag = Common.id(V.User.isFocus[0]).text(V.User.isFocus[2]).isVisibleToUser(true).findOnce();//已关注  （相互关注目前不确定，应该也是这个ID）
        if (hasFocusTag) {
            return true;
        }

        throw new Error('找不到关注和已关注');
    },

    cancelFocus() {
        let hasFocusTag = Common.id(V.User.isFocus[0]).text(V.User.isFocus[2]).isVisibleToUser(true).findOnce() || Common.id(V.User.isFocus[0]).text(V.User.isFocus[3]).isVisibleToUser(true).findOnce();//text(已关注) || text(互相关注)
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

        let intoVideoTag = UiSelector().className('android.widget.FrameLayout').filter(v => {
            return v.parent() != null && v.parent().className() == 'androidx.recyclerview.widget.RecyclerView' && v.getChildCount() >= 1;//最少是2个子项
        }).isVisibleToUser(true).findOne();
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
