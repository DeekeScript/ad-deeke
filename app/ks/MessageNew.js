let Common = require("./Common.js");
let User = require('./User.js');
let baiduWenxin = require('../../service/baiduWenxin.js');

let MessageNew = {
    scrollCount: 0,
    getMsg(type, msg) {
        //这里必须调用智能话术
        //return "😄";
        return baiduWenxin.getChatByMsg(type, msg, 2);
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
        // let tag = Common.id(V.Message.hasMessage[0]).filter(v => {
        //     return v && v.bounds() && v.bounds().left > Device.width() / 2 && v.bounds().top > Device.height() * 0.8;
        // }).isVisibleToUser(true).findOne();
        // Log.log('消息控件', tag);
        // if (!tag || tag.text() === "0") {
        //     Log.log('没有消息');
        //     return false;
        // }
        return true;
    },

    //第一步
    intoMessage() {
        if (!this.hasMessage()) {
            //return false;
        }

        //判断是否已经在消息页面
        Log.log('是否在消息页面');
        let msgTag = UiSelector().className(V.Index.home[4]).desc(V.Index.home[2]).findOne();
        // if (msgTag && msgTag.isSelected()) {
        //     return true; 这段代码无法使用，经常出现isSelected不准确
        // }
        Log.log('准备进入消息页面', msgTag);

        if (msgTag) {
            Common.click(msgTag);
            Log.log('进入消息中心');
            System.sleep(2000 + 500 * Math.random());

            //点击消息进入最顶端
            let tabs = Common.id(V.Message.tabs[0]).isVisibleToUser(true).findOne();
            let msgTag2 = UiSelector().desc(V.Message.tabs[1]).filter(v => {
                return v.bounds().top >= tabs.bounds().top && v.bounds().top + v.bounds().height() <= tabs.bounds().top + tabs.bounds().height();
            }).findOne();
            Common.click(msgTag2);

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

            for (let i in tags) {
                //let tag = tags[i].children().findOne(Common.id(V.Message.stranger[4]).isVisibleToUser(true));
                let left = tags[i].bounds().left;
                let top = tags[i].bounds().top;
                let bottom = tags[i].bounds().top + tags[i].bounds().height();
                let tag = Common.id(V.Message.stranger[4]).isVisibleToUser(true).filter(v => {
                    return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                }).findOne();
                //测试使用
                // tag = {
                //     text: () => 3
                // };

                if (!tag || tag.text() <= 0) {
                    Log.log('找不到内容');
                    continue;
                }

                if (tag.text() && i == 0) {
                    contains.push(tag.text());
                    if (contains.length > 2) {
                        contains.shift();//去掉第一个
                        if (contains[0] === contains[1] && contains[0] === contains[2]) {
                            Log.log('完成');
                            break;
                        }
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
                User.privateMsgTwo(this.getMsg(0, msg));
                System.sleep(2000 + 1000 * Math.random());
            }

            this.noUserMessageBackScroll();
        }
    },

    //好友私信
    backMsg(config) {
        let msg = this.getLastMessageContent();
        if (msg === false) {
            Gesture.back();
            return;//没有消息标签，可能不是私信
        }
        Log.log('msg', msg);
        Log.log('粉丝之间的消息处理');
        if (!config.ai_back_friend_private_switch) {
            Gesture.back();
            return;
        }
        User.privateMsgTwo(this.getMsg(0, msg));
        Gesture.back();
    },

    //互动消息
    interact(c) {
        let k = 20;
        while (k-- > 0 || c <= 0) {
            //let tags = UiSelector().className(V.Message.interact[1]).textContains(V.Message.interact[4]).find();
            let parents = UiSelector().className(V.Message.interact[5]).filter(v => {
                return v && v.bounds().width() >= Device.width() - 1 && v.bounds().height() < Device.height() / 4 && v.bounds().left == 0 && v.bounds().height() > Device.height() / 12;
            }).isVisibleToUser(true).find();
            let isDeal = false;
            Log.log('互动消息');
            for (let i in parents) {
                if (i % 2 == 1) {
                    Log.log('未操作', parents[i].bounds());
                    //continue;//目前有2次相同，这里过滤
                }
                Log.log('操作了', parents[i].bounds());
                let left = parents[i].bounds().left;
                let top = parents[i].bounds().top;
                let bottom = top + parents[i].bounds().height();

                let tag = UiSelector().className(V.Message.interact[1]).textContains(V.Message.interact[4]).filter(v => {
                    return v.bounds().top > parents[i].bounds().top && v.bounds().top + v.bounds().height() < parents[i].bounds().top + parents[i].bounds().height();
                }).findOne();

                // let dotTag = tag.children().findOne(Common.id(V.Message.interact[1]).isVisibleToUser(true));
                if (!tag || !tag.text() || (tag.text().indexOf(V.Message.interact[2]) == -1 && tag.text().indexOf(V.Message.interact[3]) == -1)) {
                    //赞了你的作品 
                    if (UiSelector().className(V.Message.interact[1]).textContains(V.Message.interact[9]).filter(v => {
                        return v.bounds().top > parents[i].bounds().top && v.bounds().top + v.bounds().height() < parents[i].bounds().top + parents[i].bounds().height();
                    }).findOne()) {
                        Log.log('赞了你的作品');
                        c--;
                    };
                    continue;
                }

                //回复: 谢谢您[比心][比心][比心] 8小时前
                //评论了你: 贴完[泪奔] 3分钟前

                let msg = tag.text().replace(V.Message.interact[2], '').replace(V.Message.interact[3], '');
                msg = this.dealMsg(msg);
                // let backTag = tag.children().findOne(Common.id(V.Message.interact[5]).isVisibleToUser(true));
                let backTag = UiSelector().text(V.Message.interact[6]).isVisibleToUser(true).filter(v => {
                    return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                }).findOne();
                if (!backTag) {
                    c--;
                    continue;
                }
                isDeal = true;
                Common.click(backTag);
                System.sleep(1000 + 1000 * Math.random());

                let iptTag = Common.id(V.Message.interact[7]).isVisibleToUser(true).findOne();
                iptTag.setText(this.getMsg(1, msg));
                let btnTag = Common.id(V.Message.interact[8]).isVisibleToUser(true).findOne();
                Common.click(btnTag);
                c--;
                if (c <= 0) {
                    break;
                }
                System.sleep(3000 + 2000 * Math.random());
            }

            if (c <= 0) {
                break;
            }

            if (!isDeal) {
                break;
            }

            let scrollTag = Common.id(V.Message.interact[0]).isVisibleToUser(true).scrollable(true).findOne();
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

        //先处理 互动消息
        let hudongTag = UiSelector().className(V.Message.readMessage[0]).isVisibleToUser(true).filter(v => {
            return !!Common.id(V.Message.readMessage[2]).text(V.Message.readMessage[3]).filter((vv) => {
                return vv.bounds().top >= v.bounds().top && vv.bounds().top + vv.bounds().height() <= v.bounds().top + v.bounds().height();
            }).findOne();
        }).findOne();
        if (hudongTag) {
            let tipTag = Common.id(V.Message.readMessage[4]).filter(v => {
                return v.bounds().top > hudongTag.bounds().top && v.bounds().top + v.bounds().height() < hudongTag.bounds().top + hudongTag.bounds().height();
            }).findOne();

            Log.log('互动消息', hudongTag.bounds());
            if (tipTag) {
                Common.click(tipTag);
                System.sleep(5000 + 2000 * Math.random());
                Log.log('消息数量：', tipTag.text());
                this.interact(tipTag.text() * 1);
                Gesture.back();
                Common.sleep(3000 + 2000 * Math.random());
            }
        }

        //私信处理
        let contains = [];
        let k = 10;
        let kk = 0;
        while (k-- > 0) {
            let tags = Common.id(V.Message.readMessageName[1]).isVisibleToUser(true).filter(v => {
                return !!Common.id(V.Message.readMessageName[0]).filter((vv) => {
                    return vv.bounds().top >= v.bounds().top && vv.bounds().top + vv.bounds().height() <= v.bounds().top + v.bounds().height();
                }).findOne();
            }).find();
            Log.log('tags', tags);
            Log.log('一轮开始进行，确保是最新');
            for (let i in tags) {
                let filter = (vv) => {
                    return vv.bounds().top >= tags[i].bounds().top && vv.bounds().top + vv.bounds().height() <= tags[i].bounds().top + tags[i].bounds().height();
                }

                let tvTag = Common.id(V.Message.readMessageName[0]).filter(filter).findOne();
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

                let notifyTag = Common.id(V.Message.readMessage[6]).filter(v => {
                    return v.bounds().top > tags[i].bounds().top && v.bounds().top + v.bounds().height() < tags[i].bounds().top + tags[i].bounds().height();
                }).findOne();
                Log.log('开始操作：', tvTag.text());
                if (notifyTag) {
                    Log.log(notifyTag.bounds(), notifyTag.text());
                    Log.log('可能是未知的tvTag', tvTag);//这里统一当做私信来处理
                    //如果是私信，则回复
                    Common.click(tvTag);
                    System.sleep(3000 + 2000 * Math.random());
                    this.backMsg(config);
                }

                System.sleep(1000 + 1000 * Math.random());
            }

            if (contains.length >= 3) {
                contains.shift();//去掉第一个
                if (contains[0] === contains[1] && contains[0] === contains[2]) {
                    break;
                }
            }
            //查看消息数是不是为0  不是则滑动
            if (!this.hasMessage()) {
                break;
            }

            this.scroll();
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
