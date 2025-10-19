let Common = require("app/dy/Common.js");
let User = require('app/dy/User.js');
let Index = require('app/dy/Index.js');
let baiduWenxin = require('service/baiduWenxin.js');

let MessageNew = {
    scrollCount: 0,
    /**
     * 
     * @param {number} type 
     * @param {string} msg 
     * @returns {string}
     */
    getMsg(type, msg) {
        //这里必须调用智能话术
        //return "😄";
        return baiduWenxin.getChatByMsg(type, msg);
    },

    /**
     * 返回消息
     * @param {string} msg 
     */
    dealMsg(msg) {
        let contents = msg.split(' ');//谢谢您[比心][比心][比心] 8小时前
        let res = '';
        for (let i = 0; i < contents.length - 1; i++) {
            res += ' ' + contents[i];
        }
        if (res.indexOf(' ') == 0) {
            res = res.substring(1);
        }
        return res;
    },

    /**
     * 进入消息页面
     * @returns {boolean}
     */
    intoMessage() {
        //判断是否已经在消息页面
        return Index.intoMyMessage();
    },

    /**
     * 默认下滑，type为true则滑动回去
     * @param {number} type 
     * @returns {boolean}
     */
    scroll(type) {
        let res = Common.swipeMessageList(type);
        Common.sleep(3000 + 2000 * Math.random());
        return res;
    },

    /**
     * 获取最新一条记录
     * @returns {string}
     */
    getLastMessageContent() {
        let tags = UiSelector().id('com.ss.android.ugc.aweme:id/content_layout').className('android.widget.TextView').filter(v => {
            return v.bounds().left < Device.width() - v.bounds().right;
        }).isVisibleToUser(true).find();

        if (tags.length === 0) {
            return false;
        }
        return tags[tags.length - 1].text();
    },

    /**
     * 陌生人消息滑动
     * @returns {boolean}
     */
    noUserMessageBackScroll() {
        let tag = UiSelector().className('androidx.recyclerview.widget.RecyclerView').scrollable(true).isVisibleToUser(true).findOne();
        if (tag) {
            return tag.scrollForward();
        }
        return -1;
    },

    /**
     * 好友私信
     * @param {object} config 
     * @returns {boolean}
     */
    backMsg(config) {
        let msg = this.getLastMessageContent();
        if (msg === false) {
            return;//没有消息标签，可能不是私信
        }
        Log.log('msg', msg);
        Log.log('粉丝之间的消息处理');
        if (!config.ai_back_friend_private_switch) {
            return;
        }
        return User.privateMsg(this.getMsg(0, msg), true, true);
    },

    /**
     * 互动消息
     * @param {number} msgCount 
     * @returns {boolean}
     */
    interact(msgCount) {
        let k = 10;
        while (k-- > 0) {
            let tags = UiSelector().className('android.view.ViewGroup').clickable(true).filter(v => {
                return v.desc();
            }).isVisibleToUser(true).find();
            Log.log('互动消息', tags.length);
            for (let i in tags) {
                if (msgCount-- <= 0) {
                    return true;
                }

                Log.log('评论或者回复', tags[i].desc());
                if (tags[i].desc().indexOf('评论') == -1 && tags[i].desc().indexOf('回复') == -1) {
                    continue;
                }

                //回复: 谢谢您[比心][比心][比心] 8小时前
                //评论了你: 贴完[泪奔] 3分钟前
                let index = tags[i].desc().indexOf('评论了你:');
                let length = '评论了你:'.length;
                if (index == -1) {
                    index = tags[i].desc().indexOf('回复:');
                    length = '回复:'.length;
                }
                let lastIndex = tags[i].desc().lastIndexOf(' ');

                //谢谢您[比心][比心][比心] 8小时前
                let msg = tags[i].desc().substring(index + length, lastIndex);
                Log.log('回复内容', msg);
                //msg = this.dealMsg(msg);
                Log.log('结果', msg);
                let backTag = tags[i].children().findOne(UiSelector().className('android.widget.TextView').descContains('回复').isVisibleToUser(true))
                if (!backTag) {
                    continue;
                }

                backTag.click();
                System.sleep(2000 + 1000 * Math.random());

                let iptTag = UiSelector().className('android.widget.EditText').filter(v => {
                    return v.isEditable();
                }).isVisibleToUser(true).findOne();
                if (!iptTag) {
                    Log.log('没有输入框');
                    continue;
                }
                iptTag.setText(this.getMsg(1, msg));
                Common.sleep(500 + 500 * Math.random());
                let btnTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).text('发送').findOne();
                btnTag.parent().click();
                System.sleep(3000 + 2000 * Math.random());
            }

            if (msgCount-- <= 0) {
                return true;
            }

            if (!Common.swipeMessageDetailsList()) {
                return true;
            }
            System.sleep(1000 + 1000 * Math.random());
        }
    },

    /**
     * 消息操作（含陌生人消息）
     * @param {object} config 
     * @param {boolean} noScrollTop 
     * @returns {boolean}
     */
    readMessage(config, noScrollTop) {
        Log.log('开始阅读消息');
        while (this.scrollCount-- > 0) {
            this.scroll(true);
            System.sleep(1000 + 500 * Math.random());
        }

        let k = 0;
        while (true) {
            System.sleep(3000 + 2000 * Math.random());
            let tags = UiSelector().className('android.widget.Button').clickable(true).isVisibleToUser(true).filter(v => {
                return v.bounds().width() == Device.width();
            }).descContains('未读').find();

            Log.log('tags', tags.length);
            for (let i in tags) {
                Log.log('tags', tags[i].desc());
                if (tags[i].desc().indexOf('互动消息,') == 0) {
                    Log.log('互动消息处理');
                    if (!config.ai_back_comment_switch) {
                        continue;
                    }
                    let num = Common.numDeal(tags[i].desc());
                    tags[i].click();
                    System.sleep(3000 + 2000 * Math.random());
                    this.interact(num);
                    Common.back();
                    break;
                }

                if (tags[i].desc().indexOf('陌生人消息,') != -1) {
                    Log.log('陌生人消息处理');
                    if (!config.ai_back_private_switch) {
                        continue;
                    }
                    tags[i].click();
                    System.sleep(2500 + 2000 * Math.random());
                    this.readMessage(config, true);
                    Common.back();
                    break;
                }

                Log.log('私信或者未知的tag', tags[i]);//这里统一当做私信来处理
                //如果是私信，则回复
                tags[i].click();
                System.sleep(2000 + 1500 * Math.random());
                if (!UiSelector().className('android.widget.EditText').clickable(true).isVisibleToUser(true).findOne()) {
                    Common.back();
                } else {
                    this.backMsg(config);
                    Common.back();
                    Common.sleep(1000 + 500 * Math.random());
                    Log.log('返回一次');//这里不执行break，防止对方也是AI，导致卡死在某个回复上
                }
            }

            k++;
            if (!this.scroll()) {
                break;
            }
        }

        //滑动回去
        if (noScrollTop) {
            return;
        }

        while (k-- >= 0) {
            this.scroll(true);
            Common.sleep(500 + 500 * Math.random());
        }
    },
}

module.exports = MessageNew;
