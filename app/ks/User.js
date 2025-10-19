let Common = require('app/ks/Common.js');
let statistics = require('common/statistics.js');

let User = {
    /**
     * 发送私信
     * @param {string} msg 
     * @returns {boolean}
     */
    privateMsg(msg) {
        if (this.isPrivate()) {
            Log.log('私密账号');
            return false;
        }

        let settingTag = Common.id('more_btn').isVisibleToUser(true).findOne();
        if (!settingTag) {
            Log.log('找不到setting按钮');
            return false;
        }

        settingTag.click();
        Log.log("私信");
        Common.sleep(1500 + 500 * Math.random());

        let sendTag = UiSelector().text('发私信').className('android.widget.TextView').isVisibleToUser(true).findOnce();
        if (!sendTag) {
            Log.log('找不到发私信按钮');
            return false;
        }

        sendTag.parent().click();
        Common.sleep(2000);

        let res = this.privateMsgTwo(msg);
        if (res) {
            //Common.back(1);  多返回了
        }
        return res;
    },

    /**
     * 发私信
     * @param {string} msg 
     * @returns {boolean}
     */
    privateMsgTwo(msg) {
        let textTag = UiSelector().isVisibleToUser(true).className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).findOne();

        if (!textTag) {
            Log.log('找不到发私信输入框');//可能是企业号，输入框被隐藏了
            Common.back();
            return false;
        }

        textTag.setText(msg);
        Common.sleep(500 + 300 * Math.random());

        let sendTextTag = sendTag = Common.id('send_btn').isVisibleToUser(true).findOne();
        if (!sendTextTag) {
            Log.log('发送消息失败');
            return false;
        }

        let res = sendTextTag.click();
        Log.log("私信发送完成");
        statistics.privateMsg();
        Common.sleep(1500 + Math.random() * 500);
        Log.log("成功：返回2次");
        Common.back(1);
        return res;
    },

    /**
     * 获取昵称
     * @returns {string}
     */
    getNickname() {
        //一般用户
        let nickname = Common.id('user_name_tv').isVisibleToUser(true).findOnce();
        if (nickname && nickname.text()) {
            return nickname.text();
        }

        throw new Error('找不到昵称');
    },

    /**
     * 机构 媒体等账号 公司
     * @returns {UiObject}
     */
    isCompany() {
        return Common.id('header_vip_tv').findOne();
    },

    /**
     * 快手号
     * @returns {string}
     */
    getDouyin() {
        let douyin = Common.id('profile_user_kwai_id').isVisibleToUser(true).findOnce();
        if (douyin && douyin.text()) {
            return douyin.text().replace('快手号：', '');
        }

        //企业账号  profile_user_setting
        let setting = Common.id('more_btn').isVisibleToUser(true).findOne();
        if (!setting || !setting.click()) {
            throw new Error('未找到用户信息');
        }

        Common.sleep(1000);
        douyin = Common.id('operation_user_nickname').isVisibleToUser(true).findOne();
        Common.back();
        if (douyin && douyin.text()) {
            return douyin.text().replace('快手号：', '');
        }
        return this.getNickname();
    },

    /**
     * 获取获赞数
     * @returns {number}
     */
    getZanCount() {
        let zan = UiSelector().descContains('获赞数').findOne();
        if (!zan) {
            throw new Error('找不到赞');
        }

        return Common.numDeal(zan.desc());
    },

    /**
     * 关注数
     * @returns {number}
     */
    getFocusCount() {
        let focus = UiSelector().descContains('关注数').findOne();
        if (!focus) {
            throw new Error('找不到关注');
        }

        return Common.numDeal(focus.desc());
    },

    /**
     * 粉丝数
     * @returns {number}
     */
    getFansCount() {
        let fans = UiSelector().descContains('粉丝数').findOne();
        if (!fans) {
            throw new Error('找不到粉丝');
        }

        return Common.numDeal(fans.desc());
    },

    /**
     * 用户介绍
     * @returns {string}
     */
    getIntroduce() {
        let tag = Common.id('user_text').findOnce();
        if (!tag) {
            return '';
        }
        return tag.text();
    },

    /**
     * 获取Ip
     * @returns {string}
     */
    getIp() {
        let tag = Common.id('label_name').textContains('IP：').findOne();
        if (!tag) {
            return '';
        }

        return tag.text().replace('IP：', '');
    },

    /**
     * 获取年龄
     * @returns {number}
     */
    getAge() {
        let tag = Common.id('label_name').textContains('岁').findOnce();
        let text = 0;
        if (!tag) {
            return '';
        }

        if (/^[\d]+岁$/.test(tag.text())) {
            return Common.numDeal(tag.text());
        }

        return text;
    },

    /**
     * 获取作品控件
     * @returns {UiObject}
     */
    getWorksTag() {
        let tag = Common.id('tab_text').textContains('作品').findOnce();
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

    /**
     * 获取作品数
     * @returns {number}
     */
    getWorksCount() {
        let tag = this.getWorksTag();
        return Common.numDeal(tag.text());
    },

    /**
     * 获取性别
     * @returns {number}
     */
    getGender() {
        //1男，0女，2未知
        let tag = Common.id('label_name').textContains('女').findOnce();
        if (tag) {
            return '0';
        }

        tag = tag = Common.id('label_name').textContains('男').findOnce();
        if (tag) {
            return '1';
        }

        return '2';//未知，或者图标的方式
    },

    /**
     * 是否是私密账号
     * @returns {boolean}
     */
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

    /**
     * 是否已关注
     * @returns {boolean}
     */
    isFocus() {
        let tag = UiSelector().filter(v => {
            return v.className().includes('Button');
        }).descContains('关注').findOne();
        if (tag && (tag.desc() == '已关注' || tag.desc() == '互相关注')) {
            return true;
        }
        return false;
    },

    /**
     * 关注操作
     * @returns {boolean}
     */
    focus() {
        let focusTag = UiSelector().filter(v => {
            return v.className().includes('Button');
        }).descContains('关注').findOne() || UiSelector().descContains('回关').findOne();
        if (focusTag) {
            let res = focusTag.click();
            statistics.focus();
            return res;
        }

        if (this.isFocus()) {
            return true;
        }

        throw new Error('找不到关注和已关注');
    },

    /**
     * 取消关注
     * @returns {boolean}
     */
    cancelFocus() {
        let hasFocusTag = UiSelector().filter(v => {
            return v.className().includes('Button');
        }).descContains('关注').findOne();//text(已关注) || text(互相关注)
        if (hasFocusTag && (hasFocusTag.desc() == '已关注' || hasFocusTag.desc() == '互相关注')) {
            hasFocusTag.click();
            Log.log('点击了已关注')
            Common.sleep(1500);
            //真正地点击取消
            let res = false;
            for (let i = 0; i < 2; i++) {
                let tag = UiSelector().text('取消关注').findOne();
                if (!tag) {
                    break;
                }
                tag.parent().click();
                Common.sleep(1000 + 1000 * Math.random());
            }
            return false;
        }

        if (!this.isFocus()) {
            Log.log('取消关注了');
            return true;
        }

        Log.log('没有取消关注');
        return false;
    },

    /**
     * 获取用户信息
     * @returns {object}
     */
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
