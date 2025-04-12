
let dy = {
    scrollCount: 0,
    log(...msg) {
        Log.log(msg);
        console.log(msg);
    },

    getMsg(msg) {
        //这里必须调用智能话术
    },

    click(tag) {
        Gesture.click(tag.bounds().left + tag.bounds().width() * Math.random(), tag.bounds().top + tag.bounds().height() * Math.random());
        System.sleep(500 + 500 * Math.random());
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
        let tag = UiSelector().id('com.ss.android.ugc.aweme:id/x90').filter(v => {
            return v && v.bounds() && v.bounds().left > Device.width() / 2 && v.bounds().top > Device.height() * 0.8;
        }).isVisibleToUser(true).findOne();
        this.log(tag);
        if (!tag || tag.text() === "0") {
            this.log('没有消息');
            return false;
        }
        return true;
    },

    //第一步
    intoMessage() {
        if (!this.hasMessage()) {
            return false;
        }

        let messageTag = UiSelector().id('com.ss.android.ugc.aweme:id/x_t').text('消息').isVisibleToUser(true).findOne();
        if (messageTag) {
            this.click(messageTag);
            Log.log('进入消息中心');
            System.sleep(2000 + 500 * Math.random());
        }
    },

    //默认下滑，type为true则滑动回去
    scroll(type) {
        let tag = UiSelector().id('com.ss.android.ugc.aweme:id/wal').scrollable(true).isVisibleToUser(true).findOne();
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
        let tags = UiSelector().id('com.ss.android.ugc.aweme:id/content_layout').isVisibleToUser(true).find();
        if (tags.length === 0) {
            return false;
        }
        return tags[tags.length - 1].text();
    },

    noUserMessageBackScroll() {
        let tag = UiSelector().id('com.ss.android.ugc.aweme:id/xox').scrollable(true).isVisibleToUser(true).findOne();
        if (tag) {
            tag.scrollForward();
            return true;
        }
        return false;
    },

    //陌生人消息
    noUserMessageBack() {
        let titleTag = UiSelector().id('com.ss.android.ugc.aweme:id/v4o').text('陌生人消息').isVisibleToUser(true).findOne();
        if (!titleTag) {
            return;
        }

        let contains = [];
        let k = 10;
        while (k-- > 0) {
            this.log('k', k);
            let tags = UiSelector().id('com.ss.android.ugc.aweme:id/wat').isVisibleToUser(true).find();
            if (tags.length <= 0) {
                break;
            }

            for (let i in tags) {
                let tag = tags[i].children().findOne(UiSelector().id('com.ss.android.ugc.aweme:id/ua5').isVisibleToUser(true));
                //测试使用
                // tag = {
                //     text: () => 3
                // };

                if (!tag || tag.text() <= 0) {
                    continue;
                }

                if (tag.text()) {
                    contains.push(tag.text());
                    if (contains.length > 3) {
                        contains.shift();//去掉第一个
                        if (contains[0] === contains[1] && contains[0] === contains[2]) {
                            this.log('完成');
                            break;
                        }
                    }
                }

                this.click(tags[i]);
                System.sleep(3000 + 1000 * Math.random());

                //看看是不是有确定聊天
                let sureMsgTag = UiSelector().id('com.ss.android.ugc.aweme:id/c_-').isVisibleToUser(true).findOne();
                if (sureMsgTag) {
                    this.click(sureMsgTag);
                    System.sleep(2000 + 2000 * Math.random());
                }

                //获取最后一次聊天的消息内容
                let msg = this.getLastMessageContent();
                this.log('msg', msg);
                //这里直接私信
                //DyUser.privateMsgTwo(this.getMsg(msg));
                Gesture.back();
                System.sleep(2000 + 1000 * Math.random());
            }

            this.noUserMessageBackScroll();
        }
    },

    //好友私信
    backMsg() {
        let msg = this.getLastMessageContent();
        if (msg === false) {
            return;//没有消息标签，可能不是私信
        }
        this.log('msg', msg);
        //DyUser.privateMsgTwo(this.getMsg(msg));
    },

    //互动消息
    interact() {
        let k = 20;
        while (k-- > 0) {
            let tags = UiSelector().id('com.ss.android.ugc.aweme:id/q26').isVisibleToUser(true).find();
            let count = tags.length;
            for (let i in tags) {
                let dotTag = tags[i].children().findOne(UiSelector().id('com.ss.android.ugc.aweme:id/q3f').isVisibleToUser(true));
                if (!dotTag) {
                    count--;
                    continue;
                }

                //回复: 谢谢您[比心][比心][比心] 8小时前
                //评论了你: 贴完[泪奔] 3分钟前
                let msgTag = tags[i].children().findOne(UiSelector().id('com.ss.android.ugc.aweme:id/q2l').isVisibleToUser(true));
                if (!msgTag || !msgTag.text()) {
                    continue;
                }

                //谢谢您[比心][比心][比心] 8小时前
                let msg = msgTag.text().replace('回复: ', '').replace('评论了你: ', '');
                msg = this.dealMsg(msg);
                let backTag = tags[i].children().findOne(UiSelector().id('com.ss.android.ugc.aweme:id/q1-').isVisibleToUser(true));
                if (!backTag) {
                    continue;
                }

                this.click(backTag);
                System.sleep(1000 + 1000 * Math.random());

                let iptTag = UiSelector().id('com.ss.android.ugc.aweme:id/dmi').isVisibleToUser(true).findOne();
                iptTag.setText(msg);
                let btnTag = UiSelector().id('com.ss.android.ugc.aweme:id/dqq').isVisibleToUser(true).findOne();
                this.click(btnTag);
                System.sleep(3000 + 2000 * Math.random());
            }

            if (count === 0) {
                return true;
            }

            let scrollTag = UiSelector().id('com.ss.android.ugc.aweme:id/q24').isVisibleToUser(true).scrollable(true).findOne();
            if (scrollTag) {
                scrollTag.scrollForward();
                System.sleep(3000 + 2000 * Math.random());
            }
        }
    },

    readMessage() {
        while (this.scrollCount-- > 0) {
            this.scroll(true);
            System.sleep(1000 + 500 * Math.random());
        }


        // this.log(tags);
        let contains = [];
        while (true) {
            let tags = UiSelector().id('com.ss.android.ugc.aweme:id/wat').isVisibleToUser(true).find();
            this.log('一轮开始进行');
            for (let i in tags) {
                let tvTag = tags[i].children().findOne(UiSelector().id('com.ss.android.ugc.aweme:id/tv_title'));
                //过滤非当前查找的控件
                if (!tvTag) {
                    continue;
                }

                if (tvTag.text()) {
                    contains.push(tvTag.text());
                    if (contains.length > 3) {
                        contains.shift();//去掉第一个
                        if (contains[0] === contains[1] && contains[0] === contains[2]) {
                            break;
                        }
                    }
                }

                // this.log(tvTag);
                //过滤消息数为0的
                let messageTag = tags[i].children().findOne(UiSelector().id('com.ss.android.ugc.aweme:id/ua5'));//钱包通知，用户的私信消息
                let tipTag = tags[i].children().findOne(UiSelector().id('com.ss.android.ugc.aweme:id/red_tips_count_view'));//互动消息，新关注我的  消息数
                let dotTag = tags[i].children().findOne(UiSelector().id('com.ss.android.ugc.aweme:id/red_tips_dot_view'));//陌生人消息  服务通知
                if ((!messageTag || messageTag.text()) <= 0 && (!tipTag && tipTag.text() <= 0) && (!dotTag && dotTag.text() <= 0)) {
                    continue;
                }

                this.log('开始操作：', tvTag.text());
                //下面将Click分开，主要便于测试工作
                if ((messageTag && tvTag.text() === '钱包通知') || (tipTag && tvTag.text() === '新关注我的') || (dotTag && tvTag.text() === '服务通知')) {
                    //什么都不干
                    this.click(tvTag);
                    System.sleep(3000 + 2000 * Math.random());
                } else if (tipTag && tvTag.text() === '互动消息' && tipTag.text() > 0) {
                    Log.log('互动消息处理');
                    this.click(tvTag);
                    System.sleep(3000 + 2000 * Math.random());
                    this.interact();
                } else if (dotTag && tvTag.text() === '陌生人消息') {
                    this.click(tvTag);
                    System.sleep(3000 + 2000 * Math.random());
                    this.noUserMessageBack();
                } else if (messageTag && messageTag.text() > 0) {
                    Log.log('可能是未知的tvTag', tvTag);//这里统一当做私信来处理
                    //如果是私信，则回复
                    this.click(tvTag);
                    System.sleep(3000 + 2000 * Math.random());
                    this.backMsg();
                } else {
                    Log.log('什么都不干，意外的情况', tvTag.text());
                    continue;
                }

                Gesture.back();
                System.sleep(1000 + 1000 * Math.random());
            }
            //查看消息数是不是为0  不是则滑动
            if (!this.hasMessage()) {
                break;
            }

            this.scroll();
        }
    },

    //最后一步
    backApp() {
        //直接返回退出抖音
        Gesture.back();
        System.sleep(500);
        Gesture.back();
        System.sleep(500);
        Gesture.back();
        System.sleep(500);
    }
}

// dy.intoMessage();
// dy.readMessage();

// dy.noUserMessageBack();

let tags = UiSelector().id('com.ss.android.ugc.aweme:id/wat').isVisibleToUser(true).find();
console.log('tags', tags.length, tags[1].bounds(), tags[1].children().length());
let tag = tags[1].children().findOne(UiSelector().id('com.ss.android.ugc.aweme:id/red_tips_count_view').isVisibleToUser(true));
console.log('tag', tag, tag ? tag.text() : '-');
console.log('停止了');