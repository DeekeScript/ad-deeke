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
    getMsg(type, msg = undefined) {
        //这里必须调用智能话术
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
     * @param {boolean} type 
     * @returns {boolean}
     */
    scroll(type = false) {
        try {
            let res = Common.swipeMessageList(type);
            Common.sleep(3000 + 2000 * Math.random());
            return res;
        } catch (e) {
            Log.log('滑动失败', e);
            return false;
        }
    },

    /**
     * 获取最新一条记录
     * @returns {string}
     */
    getLastMessageContent() {
        let tags = Common.id('content_layout').className('android.widget.TextView').filter(v => {
            let headerTag = UiSelector().className('android.widget.Button').filter(vv => {
                return vv.bounds().left > v.bounds().left + v.bounds().width() && vv.bounds().top >= v.parent().parent().parent().bounds().top && vv.bounds().top + vv.bounds().height() < v.bounds().top + v.bounds().height();
            }).isVisibleToUser(true).findOne();
            if (headerTag) {
                return false;
            }
            return v.bounds().left <= Device.width() - v.bounds().right;
        }).isVisibleToUser(true).find();

        if (tags.length === 0) {
            return null;
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
        return null;
    },

    /**
     * 好友私信
     * @param {object} config 
     * @returns {boolean}
     */
    backMsg(config) {
        let msg = this.getLastMessageContent();
        if (msg === null) {
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
        Common.sleep(5000);
        while (k-- > 0) {
            let tags = UiSelector().className('android.view.ViewGroup').clickable(true).filter(v => {
                return !!v.desc();
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
                let backTag = tags[i].children().findOne(UiSelector().className('android.widget.TextView').text('回复评论').isVisibleToUser(true))
                if (!backTag) {
                    continue;
                }

                Common.click(backTag);
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

    focus(num) {
        while (true) {
            let tags = UiSelector().className('android.widget.Button').isVisibleToUser(true).descContains('关注').find();
            if (tags.length === 0) {
                Log.log('没有关注用户');
                return false;
            }

            for (let i in tags) {
                let backFocusButton = tags[i].children().findOne(UiSelector().className('android.widget.Button').textContains('回关'));
                if (backFocusButton) {
                    backFocusButton.click();
                    Log.log('点击回关');
                    System.sleep(1000 + 2000 * Math.random());
                    tags[i].click();
                    System.sleep(3000 + 1000 * Math.random());
                    User.privateMsg(this.getMsg(0) + "\n请留下联系方式");
                    System.sleep(1000);
                    Common.back();
                    System.sleep(1000 + 500 * Math.random());
                    if (num-- <= 0) {
                        Log.log('关注处理完了');
                        return true;
                    }
                }
            }

            if (!Common.swipeSearchUserOp()) {
                return true;
            }
            Common.sleep(2000 + 1000 * Math.random());
        }
    },

    /**
     * 消息操作（含陌生人消息）
     * @param {object} config 
     * @param {boolean} noScrollTop 
     * @returns {boolean}
     */
    readMessage(config, noScrollTop = false) {
        Log.log('开始阅读消息');
        while (!noScrollTop && this.scrollCount-- > 0) {
            this.scroll(true);
            System.sleep(1000 + 500 * Math.random());
        }

        let k = 0;
        let mosr = '陌生人消息,';
        let rrr = 5;
        try {
            System.setAccessibilityMode('!fast');
            while (rrr-- > 0) {
                System.sleep(1000 + 500 * Math.random());
                let tags = UiSelector().className('android.widget.Button').clickable(true).filter(v => {
                    return v.bounds().width() > Device.width() - 10;
                }).find();

                Log.log('tags', tags);
                let opCount = 0;
                for (let i in tags) {
                    let countTag = tags[i].children().findOne(UiSelector().className('android.widget.TextView').textMatches(/^\d+$/).filter(v => {
                        return v.bounds().left > Device.width() * 0.8;
                    }));

                    let tvTitle = Common.id('tv_title').filter(v => {
                        return v.bounds().left >= tags[i].bounds().left && v.bounds().right <= tags[i].bounds().right && v.bounds().top >= tags[i].bounds().top && v.bounds().bottom <= tags[i].bounds().bottom;
                    }).findOne();

                    if (!tvTitle || !tvTitle.text()) {
                        Log.log('没有消息标题');
                        continue;
                    }

                    if (!countTag && tvTitle.text().indexOf('陌生人消息') == -1) {
                        Log.log('没有消息');
                        continue;
                    }

                    Log.log('tvTitle', tvTitle.text(), countTag ? countTag.text() : 0);

                    if (tvTitle.text().indexOf('互动消息,') == 0) {
                        Log.log('互动消息处理');
                        if (!config.ai_back_comment_switch) {
                            continue;
                        }
                        let num = Common.numDeal(countTag.text()) || 5;
                        tags[i].click();
                        System.sleep(3000 + 2000 * Math.random());
                        opCount++;
                        this.interact(num);
                        Common.back();
                        Common.sleep(1000);
                        break;
                    }

                    if (!noScrollTop && tvTitle.text().indexOf('陌生人消息') != -1) {
                        Log.log('陌生人消息处理');
                        if (!config.ai_back_private_switch) {
                            continue;
                        }
                        opCount++;
                        tags[i].click();
                        System.sleep(2500 + 2000 * Math.random());
                        this.readMessage(config, true);
                        Common.back();
                        Common.sleep(1000);
                        mosr += 'XXXX';//不处理陌生人消息
                        break;
                    }

                    Log.log('私信或者未知的tag', tags[i]);//这里统一当做私信来处理
                    //如果是私信，则回复
                    //tags[i].click();
                    Common.click(tags[i], 0.2);
                    System.sleep(2000 + 1500 * Math.random());
                    let sureTag = UiSelector().className('android.widget.Button').clickable(true).desc('确认聊天').findOne() || UiSelector().className('android.widget.Button').clickable(true).text('确认聊天').findOne();
                    if (sureTag) {
                        sureTag.click();
                        Common.sleep(2200);
                    }

                    Log.log('输入框');
                    opCount++;
                    let iptTag = UiSelector().className('android.widget.EditText').isVisibleToUser(true).findOne();
                    Log.log(iptTag);
                    if (!iptTag) {
                        Common.sleep(2000);
                        if (!iptTag) {
                            Common.back();
                            Common.sleep(1500 + 500 * Math.random());
                        }
                    }

                    this.backMsg(config);
                    Common.back();
                    Common.sleep(1500 + 500 * Math.random());
                    Log.log('返回一次');//这里不执行break，防止对方也是AI，导致卡死在某个回复上
                    break;
                }

                k++;
                if (opCount > 0) {
                    //处理了列表，则继续，而不是返回
                    Log.log('处理过消息，继续');
                    continue;
                }

                if (!this.scroll()) {
                    break;
                }
            }
        } catch (e) {
            Log.log(e.message, e);
        }

        //滑动回去
        if (noScrollTop) {
            return;
        }

        System.setAccessibilityMode('fast');
        while (k-- >= 0) {
            this.scroll(true);
            Common.sleep(500 + 500 * Math.random());
        }
    },
}

module.exports = MessageNew;
