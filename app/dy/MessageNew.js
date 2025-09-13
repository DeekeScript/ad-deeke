let Common = require("app/dy/Common.js");
let User = require('app/dy/User.js');
let V = require('version/V.js');
let baiduWenxin = require('service/baiduWenxin.js');

let MessageNew = {
    scrollCount: 0,
    getMsg(type, msg) {
        //这里必须调用智能话术
        //return "😄";
        return baiduWenxin.getChatByMsg(type, msg);
    },

    dealMsg(msg) {
        let contents = msg.split(' ');//谢谢您[比心][比心][比心] 8小时前
        let res = '';
        for (let i = 0; i < contents.length - 1; i++) {
            res += ' ' + contents[i];
        }
        return res.substring(1);
    },

    hasMessage() {
        let tag = Common.id(V.Message.hasMessage[0]).filter(v => {
            return v && v.bounds() && v.bounds().left > Device.width() / 2 && v.bounds().top > Device.height() * 0.8;
        }).isVisibleToUser(true).findOne();
        Log.log('消息控件', tag);
        if (!tag || tag.text() === "0") {
            Log.log('没有消息');
            return false;
        }
        return true;
    },

    //第一步
    intoMessage() {
        if (!this.hasMessage()) {
            //return false;
        }

        //判断是否已经在消息页面
        Log.log('是否在消息页面');
        if (Common.id(V.Message.readMessage[1]).text(V.Index.intoMyMessage[1]).isVisibleToUser(true).findOne()) {
            return true;
        }
        Log.log('准备进入消息页面');

        let messageTag = Common.id(V.Index.intoMyMessage[0]).text(V.Index.intoMyMessage[1]).findOne();
        Log.log('messageTag', messageTag, V.Index.intoMyMessage[0], V.Index.intoMyMessage[1]);
        if (messageTag) {
            Common.click(messageTag);
            Log.log('进入消息中心');
            System.sleep(2000 + 500 * Math.random());
            return true;
        }
        return false;
    },

    //默认下滑，type为true则滑动回去
    scroll(type) {
        let tag = Common.id(V.Message.scroll[0]).scrollable(true).isVisibleToUser(true).findOne();
        if (!type) {
            this.scrollCount++;
        } else {
            this.scrollCount--;
        }

        if (tag) {
            type ? tag.scrollBackward() : tag.scrollForward();
            Common.sleep(3000 + 2000 * Math.random());
            return true;
        }
        return false;
    },

    getLastMessageContent() {
        let tags = Common.id(V.Message.chat[0]).className('android.widget.TextView').isVisibleToUser(true).find();
        if (tags.length === 0) {
            return false;
        }
        return tags[tags.length - 1].text();
    },

    noUserMessageBackScroll() {
        let tag = Common.id(V.Message.stranger[0]).scrollable(true).isVisibleToUser(true).findOne();
        if (tag) {
            tag.scrollForward();
            return true;
        }
        return false;
    },

    //陌生人消息
    noUserMessageBack() {
        let titleTag = Common.id(V.Message.stranger[1]).text(V.Message.stranger[2]).isVisibleToUser(true).findOne();//消息界面点击进入的陌生人列表页 头部的 “陌生人消息“
        if (!titleTag) {
            return;
        }

        let contains = [];
        let k = 10;
        while (k-- > 0) {
            Log.log('k', k);
            let tags = Common.id(V.Message.stranger[3]).isVisibleToUser(true).find();
            if (tags.length <= 0) {
                Log.log('没有陌生人消息');
                break;
            }

            while (true) {
                let _break = true;
                for (let i in tags) {
                    //let tag = tags[i].children().findOne(Common.id(V.Message.stranger[4]).isVisibleToUser(true));
                    let left = tags[i].bounds().left;
                    let top = tags[i].bounds().top;
                    let bottom = tags[i].bounds().top + tags[i].bounds().height();
                    let tag = Common.id(V.Message.stranger[4]).isVisibleToUser(true).filter(v => {
                        return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                    }).findOne();

                    if (!tag || tag.text() <= 0) {
                        Log.log('找不到内容');
                        continue;
                    }

                    if (App.getAppVersionCode('com.ss.android.ugc.aweme') == 330901) {
                        let msgCount = Common.id('v2p').filter(v => {
                            return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                        }).isVisibleToUser(true).findOnce();
                        if (!msgCount || msgCount.text() <= 0) {
                            Log.log('没有新消息1');
                            continue;
                        }
                    }

                    Common.click(tag);
                    System.sleep(3000 + 1000 * Math.random());

                    //看看是不是有确定聊天
                    let sureMsgTag = Common.id(V.Message.stranger[5]).isVisibleToUser(true).findOne();//点击 ”确定聊天“之后，才会出现聊天输入框
                    if (sureMsgTag) {
                        Common.click(sureMsgTag);
                        System.sleep(2000 + 2000 * Math.random());
                    }

                    //获取最后一次聊天的消息内容
                    let msg = this.getLastMessageContent();
                    Log.log('msg', msg);
                    //这里直接私信
                    User.privateMsgTwo(this.getMsg(0, msg), true);
                    System.sleep(2000 + 1000 * Math.random());
                    _break = false;
                }

                if (_break) {
                    break;
                }
            }
        }
    },

    //好友私信
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
        User.privateMsgTwo(this.getMsg(0, msg), true);
    },

    //互动消息
    interact() {
        let k = 20;
        while (k-- > 0) {
            let tags = Common.id(V.Message.interact[0]).isVisibleToUser(true).find();
            let count = tags.length;
            Log.log('互动消息', count);
            for (let i in tags) {
                // let dotTag = tags[i].children().findOne(Common.id(V.Message.interact[1]).isVisibleToUser(true));
                let left = tags[i].bounds().left;
                let top = tags[i].bounds().top;
                let bottom = top + tags[i].bounds().height();
                let dotTag = Common.id(V.Message.interact[1]).isVisibleToUser(true).filter(v => {
                    return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                }).findOne();
                Log.log('dotTag', dotTag ? '存在' : '不存在');
                if (!dotTag) {
                    count--;
                    continue;
                }

                //回复: 谢谢您[比心][比心][比心] 8小时前
                //评论了你: 贴完[泪奔] 3分钟前
                // let msgTag = tags[i].children().findOne(Common.id(V.Message.interact[2]).isVisibleToUser(true));
                let msgTag = Common.id(V.Message.interact[2]).isVisibleToUser(true).filter(v => {
                    return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                }).findOne();
                if (!msgTag || !msgTag.text()) {
                    continue;
                }

                //谢谢您[比心][比心][比心] 8小时前
                let msg = msgTag.text().replace(V.Message.interact[3], '').replace(V.Message.interact[4], '');
                msg = this.dealMsg(msg);
                // let backTag = tags[i].children().findOne(Common.id(V.Message.interact[5]).isVisibleToUser(true));
                let backTag = Common.id(V.Message.interact[5]).isVisibleToUser(true).filter(v => {
                    return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                }).findOne();
                if (!backTag) {
                    continue;
                }

                Common.click(backTag);
                System.sleep(1000 + 1000 * Math.random());

                let iptTag = Common.id(V.Message.interact[6]).isVisibleToUser(true).findOne();
                iptTag.setText(this.getMsg(1, msg));
                let btnTag = Common.id(V.Message.interact[7]).isVisibleToUser(true).findOne();
                Common.click(btnTag);
                System.sleep(3000 + 2000 * Math.random());
            }

            if (count === 0) {
                break;
            }

            let scrollTag = Common.id(V.Message.interact[8]).isVisibleToUser(true).scrollable(true).findOne();
            if (scrollTag) {
                scrollTag.scrollForward();
                System.sleep(3000 + 2000 * Math.random());
            }
        }
    },

    readMessage(config) {
        Log.log('开始阅读消息');
        while (this.scrollCount-- > 0) {
            this.scroll(true);
            System.sleep(1000 + 500 * Math.random());
        }

        let contains = [];
        let k = 10;
        let kk = 0;
        let repeat = 0;
        while (k-- > 0) {
            let tags = Common.id(V.Message.readMessage[0]).isVisibleToUser(true).find();
            Log.log('tags', tags);
            Log.log('一轮开始进行，确保是最新');
            let childs = [];
            for (let i in tags) {
                childs.push(tags[i].children().findOne(Common.id(V.Message.readMessage[1]).isVisibleToUser(true)));//提前存储内容，否则进入私信后，回来找不到内容
            }

            for (let i in tags) {
                let tvTag = childs[i];
                //过滤非当前查找的控件
                if (!tvTag) {
                    Log.log('没有内容tvTag');
                    continue;
                }
                Log.log('tvTag', tvTag.text());

                if (tvTag.text() && i == 0) {
                    contains.push(tvTag.text());
                    if (contains.length >= 3) {
                        contains.shift();//去掉第一个
                        if (contains[0] === contains[1] && contains[0] === contains[2]) {
                            break;
                        }
                    }
                }

                // Log.log('tvTag', tvTag, tvTag.text());
                //过滤消息数为0的
                /**  下面的代码在deeke中无法正常运行，进行优化调整
                let messageTag = tags[i].children().findOne(Common.id(V.Message.readMessage[2]));//钱包通知，用户的私信消息
                let tipTag = tags[i].children().findOne(Common.id(V.Message.readMessage[3]));//互动消息，新关注我的  消息数
                let dotTag = tags[i].children().findOne(Common.id(V.Message.readMessage[4]));//陌生人消息  服务通知
                */

                let left = tags[i].bounds().left;
                let top = tags[i].bounds().top;
                let bottom = top + tags[i].bounds().height();
                let messageTag = Common.id(V.Message.readMessage[2]).isVisibleToUser(true).filter(v => {
                    return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                }).findOne();
                let tipTag = Common.id(V.Message.readMessage[3]).isVisibleToUser(true).filter(v => {
                    return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                }).findOne();
                let dotTag = Common.id(V.Message.readMessage[4]).isVisibleToUser(true).filter(v => {
                    return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                }).findOne();
                dotTag = { text: () => 0 };//陌生人消息，可能存在里面还有未读消息，这里直接不判断消息数量了，直接允许点击进入

                if ((!messageTag || messageTag.text() <= 0) && (!tipTag || tipTag.text() <= 0) && !dotTag) {
                    Log.log('---跳过---');
                    continue;
                }

                Log.log('开始操作：', tvTag.text(), tvTag);
                Log.log('tipTag', tipTag ? tipTag.text() : 0);
                Log.log('dotTag', dotTag ? dotTag.text() : 0);
                Log.log('messageTag', messageTag ? messageTag.text() : 0);

                //下面将Click分开，主要便于测试工作
                if ((messageTag && tvTag.text() === V.Message.tag[0]) || (tipTag && tvTag.text() === V.Message.tag[1]) || (dotTag && tvTag.text() === V.Message.tag[2])) {
                    Common.click(tvTag);
                    System.sleep(3000 + 2000 * Math.random());
                    Gesture.back();
                } else if (tipTag && tvTag.text() === V.Message.tag[3] && tipTag.text() > 0) {
                    Log.log('互动消息处理');
                    if (!config.ai_back_comment_switch) {
                        continue;
                    }
                    Common.click(tvTag);
                    System.sleep(3000 + 2000 * Math.random());
                    this.interact();
                    Gesture.back();
                    System.sleep(3000 + 2000 * Math.random());
                    break;
                } else if (dotTag && tvTag.text() === V.Message.tag[4]) {
                    Log.log('陌生人消息处理');
                    if (!config.ai_back_private_switch) {
                        continue;
                    }
                    Common.click(tvTag);
                    System.sleep(3000 + 2000 * Math.random());
                    this.noUserMessageBack();
                    Gesture.back();
                    System.sleep(3000 + 2000 * Math.random());
                    break;
                } else if (messageTag && messageTag.text() > 0) {
                    Log.log('可能是未知的tvTag', tvTag);//这里统一当做私信来处理
                    //如果是私信，则回复
                    Common.click(tvTag);
                    System.sleep(3000 + 2000 * Math.random());
                    this.backMsg(config);
                    System.sleep(3000 + 2000 * Math.random());
                    break;
                    // Gesture.back();//这里不需要，已经返回回来了
                } else {
                    Log.log('什么都不干，意外的情况', tvTag.text());
                    continue;
                }

                System.sleep(1000 + 1000 * Math.random());
            }
            //查看消息数是不是为0  不是则滑动
            if (!this.hasMessage()) {
                break;
            }

            if (repeat == 0) {
                repeat++;
                continue;
            }
            
            this.scroll();
            repeat = 0;
            kk++;
        }

        //滑动回去
        while (kk-- >= 0) {
            this.scroll(true);
            Common.sleep(500 + 500 * Math.random());
        }
    },
}

module.exports = MessageNew;
