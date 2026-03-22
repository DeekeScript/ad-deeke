let Common = require("app/xhs/Common.js");
let User = require('app/xhs/User.js');
let baiduWenxin = require('service/baiduWenxin.js');

let MessageNew = {
    scrollCount: 0,
    getMsg(type, msg) {
        //这里必须调用智能话术
        //return "😄";
        return baiduWenxin.getChatByMsg(type, msg, 1);
    },

    hasMessage() {
        let tag = UiSelector().className('android.view.ViewGroup').descContains('消息').filter(v => {
            return v.desc().indexOf('未读') !== -1;
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
        if (UiSelector().className('android.widget.RelativeLayout').descContains('赞和收藏').isVisibleToUser(true).findOne()) {
            return true;
        }

        let messageTag = UiSelector().className('android.view.ViewGroup').descContains('消息').filter(v => {
            return v.desc().indexOf('未读') !== -1;
        }).isVisibleToUser(true).findOne();
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
        let tag = UiSelector().scrollable(true).isVisibleToUser(true).filter(v => {
            return v.className() == 'androidx.recyclerview.widget.RecyclerView' && v.id() != null;
        }).findOne();

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
        let tag = UiSelector().className('androidx.recyclerview.widget.RecyclerView').isVisibleToUser(true).findOne();
        if (!tag) {
            return false;
        }

        let childs = tag.children();
        if (childs.length == 0) {
            return false;
        }

        let tags = childs.find(UiSelector().className('android.widget.TextView').filter(v => {
            return v.text().indexOf('由于你和对方未互相关注') !== 0;//由于你和对方未互相关注，你回复之前，ta只能发送1条文字消息
        }).isVisibleToUser(true));
        if (tags.length === 0) {
            return false;
        }
        Log.log('消息：', tags[0].text());
        return tags[tags.length - 1].text();
    },

    noUserMessageBackScroll() {
        let tag = UiSelector().scrollable(true).isVisibleToUser(true).filter(v => {
            return v.className() == 'androidx.recyclerview.widget.RecyclerView' && v.id() != null;
        }).findOne();

        if (tag) {
            tag.scrollForward();
            return true;
        }
        return false;
    },

    //陌生人消息
    noUserMessageBack() {
        //消息界面点击进入的陌生人列表页 头部的 “陌生人消息“
        let titleTag = UiSelector().className('android.widget.TextView').text('陌生人消息').isVisibleToUser(true).findOne();
        if (!titleTag) {
            return;
        }

        let k = 10;
        while (k-- > 0) {
            Log.log('k', k);
            //消息
            let tags = UiSelector().className('android.view.ViewGroup').isVisibleToUser(true).filter(v => {
                return v && v.bounds() && v.bounds().left <= 1 && v.bounds().width() >= Device.width() - 1 && v.parent().className() == 'androidx.recyclerview.widget.RecyclerView';
            }).find();

            Log.log('陌生人消息数量', tags.length);
            if (tags.length <= 0) {
                break;
            }

            let noMsgCount = 0;
            let baseChilds = [];
            for (let i in tags) {
                baseChilds.push(tags[i].children());
            }
            for (let i in tags) {
                let childs = baseChilds[i].children().find(UiSelector().className('android.widget.TextView').isVisibleToUser(true));
                Log.log('是否有消息', childs[3]);
                if (!childs[3] || isNaN(childs[3].text()) || childs[3].text() * 1 <= 0) {
                    noMsgCount++;
                    continue;
                }

                Common.click(baseChilds[i], 0.15);
                Common.sleep(3000 + 1000 * Math.random());
                //获取最后一次聊天的消息内容
                let msg = this.getLastMessageContent();
                Log.log('msg', msg);
                //这里直接私信
                User.privateMsgTwo(this.getMsg(0, msg));
                Gesture.back();
                Common.sleep(2000 + 1000 * Math.random());
            }

            if (noMsgCount == tags.length) {
                return;
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

        let commentCountTag = UiSelector().className('android.widget.RelativeLayout').descContains('评论').filter(v => {
            return v.desc().indexOf('未读') !== -1;
        }).isVisibleToUser(true).findOne();
        if (!commentCountTag) {
            Log.log('没有评论消息');
            return true;
        }

        let allCount = Common.numDeal(commentCountTag.desc());
        Log.log('消息总数', allCount);
        if (allCount === 0) {
            return true;
        }

        Common.click(commentCountTag, 0.15);
        Common.sleep(4000 + 2000 * Math.random());
        let tipTag = UiSelector().className('android.widget.Button').text('不再提醒').isVisibleToUser(true).findOne();
        if (tipTag) {
            Common.click(tipTag, 0.15);
            Log.log('点击 不再提醒');
            Common.sleep(2000 + 2000 * Math.random());
        }

        let k = 20;
        let contains = [];
        while (k-- > 0) {
            let tags = UiSelector().className('android.view.ViewGroup').filter(v => {
                return v && v.bounds() && v.bounds().left <= 1 && v.bounds().width() >= Device.width() - 1;
            }).isVisibleToUser(true).find();
            Log.log('tags', tags.length);

            let isDeal = false;
            for (let i in tags) {
                let left = tags[i].bounds().left;
                let top = tags[i].bounds().top;
                let bottom = top + tags[i].bounds().height();

                let isMsgTag = UiSelector().className('android.widget.TextView').filter(v => {
                    return v.text().indexOf('回复了你的评论') !== -1 || v.text().indexOf('评论了你的笔记') !== -1;
                }).isVisibleToUser(true).filter(v => {
                    return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                }).findOne();
                if (!isMsgTag) {
                    Log.log('isMsgTag', '无');
                    continue;
                }

                //0昵称、1评论了你的笔记、2时间、3评论、4赞按钮，5回复按钮
                let childs = tags[i].children().find(UiSelector().isVisibleToUser(true).className('android.widget.TextView'));
                let k = 0;
                for (let i in childs) {
                    if (childs[i].text().indexOf('评论了你的笔记') !== -1 || childs[i].text().indexOf('回复了你的评论') !== -1) {
                        k = i;
                        break;
                    }
                }
                let msgTag = childs[k * 1 + 2];//去掉回复和赞

                let nicknameTag = childs[0];
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
                let backTag = UiSelector().text('回复').isVisibleToUser(true).filter(v => {
                    return v && v.bounds() && v.bounds().left >= left && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                }).findOne();
                if (!backTag) {
                    Log.log('没有backTag');
                    continue;
                }

                isDeal = true;
                Common.click(backTag.parent(), 0.15);
                Common.sleep(1000 + 1000 * Math.random());

                let iptTag = UiSelector().className('android.widget.EditText').filter(v => {
                    return v.isEditable();
                }).isVisibleToUser(true).findOne();
                iptTag.setText(this.getMsg(1, msg));
                Common.sleep(1000 + 1000 * Math.random());

                let btnTag = UiSelector().className('android.widget.TextView').text('发送').isVisibleToUser(true).findOne();
                Common.click(btnTag, 0.15);
                Common.sleep(3000 + 2000 * Math.random());
            }

            if (!isDeal) {
                Log.log('处理完了');
                break;
            }

            let scrollTag = UiSelector().scrollable(true).isVisibleToUser(true).filter(v => {
                return v.className() == 'androidx.recyclerview.widget.RecyclerView' && v.id() != null;
            }).findOne();

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
        let allMessageTag = UiSelector().className('android.view.ViewGroup').descContains('消息').filter(v => {
            return v.desc().indexOf('未读') !== -1 && v.desc().indexOf('消息') == 0;//最后这个是为了过滤 “陌生人消息”
        }).isVisibleToUser(true).findOne();

        let zanTag = UiSelector().className('android.widget.RelativeLayout').descContains('赞和收藏').isVisibleToUser(true).findOne();
        let focuTag = UiSelector().className('android.widget.RelativeLayout').descContains('新增关注').isVisibleToUser(true).findOne();
        let commentTag = UiSelector().className('android.widget.RelativeLayout').descContains('评论').isVisibleToUser(true).findOne();
        let allMessageCount = Common.numDeal(zanTag.desc()) + Common.numDeal(focuTag.desc()) + Common.numDeal(commentTag.desc());
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
            let tags = UiSelector().className('android.view.ViewGroup').isVisibleToUser(true).filter(v => {
                return v && v.bounds() && v.bounds().left <= 1 && v.bounds().width() >= Device.width() - 1;
            }).descMatches(/[\s\S]+/).find();

            Log.log('tags', tags.length);
            Log.log('一轮开始进行');
            for (let i in tags) {
                let childs = tags[i].children().find(UiSelector().className('android.widget.TextView').isVisibleToUser(true));
                //过滤非当前查找的控件
                let tvTag = childs[0];
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

                let messageTag = childs[3] ? childs[3] : 0;
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
            if (a_count <= 0) {
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
