let Common = require("app/xhs/Common.js");
let User = require('app/xhs/User.js');
let V = require('version/XhsV.js');
let baiduWenxin = require('service/baiduWenxin.js');

let MessageNew = {
    scrollCount: 0,
    getMsg(type, msg) {
        //这里必须调用智能话术
        // return "😄";
        return baiduWenxin.getChatByMsg(type, msg, 1);
    },

    hasMessage() {
        let tag = Common.id(V.Index.intoMyMessage[0]).descContains(V.Index.intoMyMessage[2]).filter(v => {
            return v && v.bounds() && v.bounds().left > Device.width() / 2 && v.bounds().top > Device.height() * 0.8;
        }).isVisibleToUser(true).findOne();
        Log.log('消息控件', tag);
        console.log('消息控件', tag);
        if (!tag) {
            Log.log('没有消息');
            return false;
        }
        return true;
    },

    //第一步
    intoMessage() {
        if (!this.hasMessage()) {
            return false;
        }

        //判断是否已经在消息页面
        if (Common.id(V.Index.intoMyMessage[0]).descContains(V.Index.intoMyMessage[1]).isVisibleToUser(true).selected(true).findOne()) {
            return true;
        }

        let messageTag = Common.id(V.Index.intoMyMessage[0]).descContains(V.Index.intoMyMessage[1]).isVisibleToUser(true).findOne();
        if (messageTag) {
            Common.click(messageTag);
            Log.log('进入消息中心');
            Common.sleep(2000 + 500 * Math.random());
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
            return true;
        }
        return false;
    },

    getLastMessageContent() {
        let tags = Common.id(V.Message.chat[0]).isVisibleToUser(true).find();
        if (tags.length === 0) {
            return false;
        }
        Log.log('消息：', tags[0].text());
        // return tags[tags.length - 1].text();
        return tags[0].text();//居然第一条是距离输入框最近的那条，而不是最后一条
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

        let k = 10;
        while (k-- > 0) {
            Log.log('k', k);
            //消息
            let tags = Common.id(V.Message.stranger[3]).isVisibleToUser(true).filter(v => {
                return v && v.text() > 0;
            }).find();

            if (tags.length <= 0) {
                break;
            }

            for (let i in tags) {
                Common.click(tags[i]);
                Common.sleep(3000 + 1000 * Math.random());
                //获取最后一次聊天的消息内容
                let msg = this.getLastMessageContent();
                Log.log('msg', msg);
                //这里直接私信
                User.privateMsgTwo(this.getMsg(0, msg));
                Gesture.back();
                Common.sleep(2000 + 1000 * Math.random());
            }

            this.noUserMessageBackScroll();
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
        User.privateMsgTwo(this.getMsg(0, msg));
    },

    //互动消息
    interact() {
        if (!config.ai_back_comment_switch) {
            return;//评论开关关闭
        }

        let commentCountTag = Common.id(V.Message.messageCount[2]).isVisibleToUser(true).findOne();
        if (!commentCountTag || commentCountTag.text() <= 0) {
            Log.log('没有评论消息');
            return true;
        }

        let allCount = commentCountTag ? commentCountTag.text() * 1 : 0;
        Log.log('消息总数', allCount);
        commentCountTag ? Common.click(commentCountTag) : Gesture.click(803, 301);
        Common.sleep(4000 + 2000 * Math.random());
        let k = 20;
        let contains = [];
        while (k-- > 0) {
            let tags = UiSelector().className(V.Message.interact[0]).filter(v => {
                return v && v.bounds() && v.bounds().left <= 1 && v.bounds().width() <= Device.height() - 1;
            }).isVisibleToUser(true).find();
            Log.log('tags', tags.length);

            let isDeal = false;
            for (let i in tags) {
                let left = tags[i].bounds().left;
                let top = tags[i].bounds().top;
                let bottom = top + tags[i].bounds().height();

                let isMsgTag = Common.id(V.Message.interact[1]).text(V.Message.interact[2]).isVisibleToUser(true).filter(v => {
                    return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                }).findOne();
                if (!isMsgTag) {
                    Log.log('isMsgTag', '无');
                    continue;
                }

                let msgTag = Common.id(V.Message.interact[3]).isVisibleToUser(true).filter(v => {
                    return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                }).findOne();

                let nicknameTag = Common.id(V.Message.interact[8]).isVisibleToUser(true).filter(v => {
                    return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                }).findOne();

                Log.log('msgTag', msgTag);
                if (!msgTag || !msgTag.text()) {
                    continue;
                }

                let msg = msgTag.text();
                if (contains.includes(nicknameTag.text() + ':::' + msg)) {
                    Log.log('已经存在系统评论');
                    continue;
                }

                contains.push(nicknameTag.text() + ':::' + msg);
                let backTag = Common.id(V.Message.interact[4]).text(V.Message.interact[5]).isVisibleToUser(true).filter(v => {
                    return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                }).findOne();
                if (!backTag) {
                    Log.log('没有backTag');
                    continue;
                }

                isDeal = true;
                Common.click(backTag);
                Common.sleep(1000 + 1000 * Math.random());

                let iptTag = Common.id(V.Message.interact[6]).isVisibleToUser(true).findOne();
                iptTag.setText(this.getMsg(1, msg));
                Common.sleep(1000 + 1000 * Math.random());

                let btnTag = Common.id(V.Message.interact[7]).isVisibleToUser(true).findOne();
                Common.click(btnTag);
                Common.sleep(3000 + 2000 * Math.random());
            }

            if (!isDeal) {
                Log.log('处理完了');
                break;
            }

            let scrollTag = Common.id(V.Message.interact[9]).isVisibleToUser(true).scrollable(true).findOne();
            if (scrollTag) {
                scrollTag.scrollForward();
                Common.sleep(3000 + 2000 * Math.random());
            }
        }
        Common.back();
        Common.sleep(2000 + 2000 * Math.random());
    },

    privateMsgCount() {
        //消息数量分布，如果没有私信，则不需要做私信操作
        let allMessageTag = Common.id(V.Index.intoMyMessage[0]).descContains(V.Index.intoMyMessage[2]).filter(v => {
            return v && v.bounds() && v.bounds().left > Device.width() / 2 && v.bounds().top > Device.height() * 0.8;
        }).isVisibleToUser(true).findOne();

        let zanTag = Common.id(V.Message.messageCount[0]).isVisibleToUser(true).findOne();
        let focuTag = Common.id(V.Message.messageCount[1]).isVisibleToUser(true).findOne();
        let commentTag = Common.id(V.Message.messageCount[2]).isVisibleToUser(true).findOne();
        let allMessageCount = (zanTag ? zanTag.text() : 0) * 1 + (focuTag ? focuTag.text() : 0) * 1 + (commentTag ? commentTag.text() : 0) * 1;
        let a_count = Common.numDeal(allMessageTag.desc()) - allMessageCount;
        Log.log('剩余消息数量：', a_count, allMessageTag.desc(), allMessageCount);
        return a_count;
    },

    readMessage(config) {
        Log.log('开始阅读消息');
        try {
            this.interact();//评论消息处理
        } catch (e) {
            Log.log('interact异常了');
            Log.log(e);
            Common.back();
            Common.sleep(2000 + 2000 * Math.random());
        }

        while (this.scrollCount-- > 0) {
            this.scroll(true);
            Common.sleep(1000 + 500 * Math.random());
        }

        let a_count = this.privateMsgCount();
        let contains = [];
        let k = 10;
        let kk = 0;
        while (a_count > 0 && k-- > 0) {
            let tags = UiSelector().className(V.Message.readMessage[0]).isVisibleToUser(true).filter(v => {
                return v && v.bounds() && v.bounds().left <= 1 && v.bounds().width() >= Device.width() - 1;
            }).descMatches('[\\s\\S]+').find()

            Log.log('tags', tags.length);
            Log.log('一轮开始进行');
            for (let i in tags) {
                let tvTag = tags[i].children().findOne(Common.id(V.Message.readMessage[1]).isVisibleToUser(true));
                //过滤非当前查找的控件
                if (!tvTag) {
                    continue;
                }

                if (tvTag.text() && i == 0) {
                    contains.push(tvTag.text());
                    if (contains.length >= 3) {
                        contains.shift();//去掉第一个
                        if (contains[0] === contains[1] && contains[0] === contains[2]) {
                            break;
                        }
                    }
                }

                let left = tags[i].bounds().left;
                let top = tags[i].bounds().top;
                let bottom = top + tags[i].bounds().height();

                let messageTag = Common.id(V.Message.readMessage[2]).isVisibleToUser(true).filter(v => {
                    return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                }).findOne();

                if (!messageTag || messageTag.text() <= 0) {
                    continue;
                }

                Log.log('开始操作：', tvTag.text());
                Log.log('messageTag', messageTag ? messageTag.text() : 0);

                //下面将Click分开，主要便于测试工作
                if (!messageTag) {
                    continue;
                }

                if (tvTag.text() === '陌生人消息') {
                    Log.log('陌生人消息处理');
                    if (!config.ai_back_private_switch) {
                        continue;
                    }
                    Common.click(tvTag);
                    Common.sleep(3000 + 2000 * Math.random());
                    this.noUserMessageBack();
                } else {
                    Log.log('可能是未知的tvTag', tvTag);//这里统一当做私信来处理
                    //如果是私信，则回复
                    Common.click(tvTag);
                    Common.sleep(3000 + 2000 * Math.random());
                    this.backMsg(config);
                }

                a_count--;
                Log.log('剩余消息数量：', a_count);
                Gesture.back();
                Common.sleep(1000 + 1000 * Math.random());
            }
            //查看消息数是不是为0  不是则滑动
            if (this.privateMsgCount() <= 0) {
                Log.log('没有额外的消息');
                break;
            }

            this.scroll();
            kk++;
            Common.sleep(2000 + 1000 * Math.random());
        }

        //滑动回去
        while (kk-- >= 0) {
            this.scroll(true);
            Common.sleep(500 + 500 * Math.random());
        }
    },
}

module.exports = MessageNew;
