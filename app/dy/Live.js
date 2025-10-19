let Common = require('app/dy/Common.js');
let statistics = require('common/statistics');

let Live = {
    /**
     * 获取在线观众数量控件
     * @returns {UiObject}
     */
    getUserCountTag() {
        return UiSelector().descContains('在线观众').isVisibleToUser(true).findOne();
    },

    /**
     * 打开在线观众列表
     * @returns {boolean}
     */
    openUserList() {
        let tag = this.getUserCountTag();
        let res = Common.click(tag);
        Common.sleep(5000);
        return res;
    },

    /**
     * 获取在线观众列表  【这里面比较坑，内容拿不到了，只能点击后获取列表内容】
     * 第一个View是用户登录信息，在列表最底部，需要单独处理
     * @returns {UiObject[]}
     */
    getUserTags() {
        let parent = UiSelector().className('com.lynx.tasm.behavior.ui.swiper.ViewPager').isVisibleToUser(true).findOnce();
        if (!parent) {
            Log.log('找不到观众列表');
            FloatDialogs.toast('找不到观众列表');
            return [];
        }

        let tags = parent.children().find(UiSelector().className('android.view.View').filter((v) => {
            return v && v.bounds().left < 10 && v.bounds().width() >= Device.width() - 10 && v.getChildCount() == 0 && v.bounds().top < Device.height();
        }));
        return tags;
    },

    /**
     * 获取用户列表控件
     * @returns {UiObject[]}
     */
    getUsers() {
        let tags = this.getUserTags();
        let users = [];
        for (let i in tags) {
            users.push({
                tag: tags[i],
            });
            Log.log(tags[i]);
        }
        Log.log("粉丝列表：" + tags.length);
        return users;
    },

    /**
     * 获取用户昵称
     * @param tag
     * @returns {string}
     */
    getNickname() {
        let userTag = UiSelector().className('android.widget.Button').isVisibleToUser(true).filter(v => {
            return v.desc() && v.bounds().height() < Device.height() / 10;
        }).findOne();
        return userTag ? userTag.desc() : '';
    },

    /**
     * 进入粉丝页面
     * @returns {boolean}
     */
    intoFansPage() {
        let nickTag = UiSelector().className('android.widget.Button').isVisibleToUser(true).filter(v => {
            return v.desc() && v.bounds().height() < Device.height() / 10;
        }).clickable(true).findOne();
        let res = nickTag.click();
        statistics.viewUser();
        Log.log('点击弹窗');
        Common.sleep(3000 + 1000 * Math.random());
        return res;
    },

    /**
     * 滑动粉丝列表
     * @returns {boolean}
     */
    swipeFansList() {
        let tag = UiSelector().className('com.lynx.tasm.behavior.ui.swiper.ViewPager').isVisibleToUser(true).findOne();
        if (!tag) {
            return false;
        }
        let container = tag.children().findOne(UiSelector().className('android.widget.LinearLayout').filter(v => {
            return v.bounds().top > Device.height() / 3;
        }));

        if (!container) {
            return false;
        }

        let left = container.bounds().left + container.bounds().width() * (0.2 + Math.random() * 0.6);
        let bottom = container.bounds().top + container.bounds().height() * (0.6 + 0.1 * Math.random());
        let top = container.bounds().top + container.bounds().height() * (0.1 + 0.1 * Math.random());
        return Gesture.swipe(left, bottom, left, top, 200 + 100 * Math.random());
    },

    /**
     * 循环点击
     * @param {number} times 
     * @returns {boolean}
     */
    loopClick(times) {
        try {
            let closeTag = UiSelector().desc('关闭').clickable(true).isVisibleToUser(true).filter((v) => {
                return v && v.bounds() && v.bounds().top > Device.height() / 3 && v.bounds().width > 0 && v.bounds().left > 0;
            }).findOnce();
            if (closeTag) {
                closeTag.click();
                Common.sleep(1000);
            }

            let left = Device.width() * (0.35 + 0.3 * Math.random());
            let top = Device.height() / 3 + Device.height() / 4 * Math.random();
            for (let i = 0; i < times; i++) {
                Gesture.press(left, top + i, 100 + 100 * Math.random());
                System.sleep(200);
            }
        } catch (e) {
            Log.log(e);
        }

        if (!this.getUserCountTag()) {
            return false;
        }
        return true;
    },

    /**
     * 直播间评论带表情
     * @param {string} msg 
     * @param {boolean} withEmoji 
     */
    comment(msg, withEmoji) {
        let iptTag = UiSelector().className('android.widget.EditText').clickable(true).isVisibleToUser(true).findOnce();
        if (iptTag) {
            iptTag.click();
            Common.sleep(2000);
        }

        iptTag = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).isVisibleToUser(true).findOnce();

        iptTag.setText(msg);
        Common.sleep(1000 + 1000 * Math.random());

        //是否带表情
        if (withEmoji) {
            let emojiTag = UiSelector().className('android.widget.FrameLayout').desc('表情').isVisibleToUser(true).findOnce();
            if (emojiTag) {
                emojiTag.click();
                Common.sleep(1000);

                let emjs = UiSelector().className('android.widget.FrameLayout').isVisibleToUser(true).filter(v => {
                    return v.desc() && v.desc().indexOf('[') == 0 && v.desc().indexOf(']') > 0;
                }).find();

                let count = 1 + Math.floor(Math.random() * 3);
                while (count-- > 0) {
                    let emj = emjs[Math.floor(Math.random() * emjs.length)];
                    emj.click();
                    Common.sleep(500 + 500 * Math.random());
                }
            }
        }

        let btnTag = UiSelector().className('android.widget.Button').desc('发送').findOne();
        btnTag.click();
        Common.sleep(500 + 500 * Math.random());
    },

    /**
     * 循环弹幕
     * @param {string} msg 
     * @param {boolean} withEmoji 
     */
    loopComment(msg, withEmoji) {
        try {
            this.comment(msg, withEmoji);
        } catch (e) {
            Log.log(e);
        }
    }
}

module.exports = Live;
