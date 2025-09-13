let Common = require("app/wx/Common.js");
let User = require('app/wx/User.js');
let V = require('version/WxV.js');
let baiduWenxin = require('service/baiduWenxin.js');

let MessageNew = {
    scrollCount: 0,
    //0评论，1私信
    getMsg(type, msg) {
        //这里必须调用智能话术
        Log.log(1 - type, msg);
        //return {msg: msg};
        return baiduWenxin.getChatByMsg(1 - type, msg, 3);
    },

    hasMessage() {
        let shipinhaoTag = Common.aId(V.Index.intoVideo[0]).text(V.Index.intoVideo[1]).isVisibleToUser(true).findOne();
        console.log(shipinhaoTag);
        let msgTag = shipinhaoTag.parent().children().findOne(Common.id(V.Index.intoVideo[2]).isVisibleToUser(true));
        // let msgTag = Common.id(V.Index.intoVideo[2]).isVisibleToUser(true).filter(v => {
        //     return v.bounds().top >= shipinhaoTag.parent().bounds().top && v.bounds().top + v.bounds().height() <= shipinhaoTag.parent().bounds().top + shipinhaoTag.parent().bounds().height();
        // }).findOne();
        console.log(msgTag);
        if (!msgTag || msgTag.text() * 1 <= 0) {
            return false;
        }
        return true;
    },

    //第一步
    intoMessage() {
        if (!this.hasMessage()) {
            return false;
        }

        let shipinhaoTag = Common.aId(V.Index.intoVideo[0]).text(V.Index.intoVideo[1]).isVisibleToUser(true).findOne();
        if (!shipinhaoTag) {
            throw new Error('没有视频号');
        }
        Common.click(shipinhaoTag);
        Log.log('进入视频号');
        Common.sleep(3000 + 3000 * Math.random());
        let closeTag = Common.id(V.Index.intoVideo[3]).isVisibleToUser(true).findOne();
        if (closeTag) {
            Common.click(closeTag);
            Log.log('关闭”知道了“');
            Common.sleep(1000 + 1000 * Math.random());
        }

        let accountTag = Common.id(V.Index.intoVideo[4]).isVisibleToUser(true).findOne();
        if (!accountTag) {
            throw new Error('找不到消息入口');
        }
        Common.click(accountTag);
        Log.log('进入账号中心');
        Common.sleep(2000 + 3000 * Math.random());
        return true;
    },

    //互动消息
    interact() {
        let tag = Common.id(V.Account.interact[0]).text(V.Account.interact[1]).isVisibleToUser(true).findOne();
        if (!tag) {
            throw new Error('找不到视频号消息入口');
        }
        let tipCountTag = tag.parent().children().findOne(Common.id(V.Account.interact[2]).isVisibleToUser(true));
        // let tipCountTag = Common.id(V.Account.interact[2]).isVisibleToUser(true).filter(v => {
        //     return v.bounds().top >= tag.parent().bounds().top && v.bounds().top + v.bounds().height() <= tag.parent().bounds().top + tag.parent().bounds().height();
        // }).findOne();
        if (!tipCountTag || tipCountTag.text() * 1 <= 0) {
            return true;
        }
        let count = tipCountTag.text() * 1;
        Common.click(tipCountTag);
        Log.log('进入视频号消息');
        Common.sleep(3000 + 3000 * Math.random());

        //真正的评论数量
        let cTag = Common.id(V.Account.comment[0]).text(V.Account.comment[1]).isVisibleToUser(true).findOne();
        let commentTag = Common.id(V.Account.comment[2]).isVisibleToUser(true).filter(v => {
            return v.bounds().left > cTag.parent().bounds().left && v.bounds().left + v.bounds().width() < cTag.parent().bounds().left + cTag.parent().bounds().width();
        }).findOne();
        count = 0;//这里才是真正的消息数
        if (commentTag && commentTag.text()) {
            count = commentTag.text().replace('+', '') * 1;
        }
        Log.log('消息数量', count);
        if (count <= 0) {
            Log.log('没有评论消息');
            return true;
        }

        if (!cTag.isSelected()) {
            Log.log('进入消息tab');
            Common.click(cTag);
            Common.sleep(1000 + 1000 * Math.random());
        }

        let tags = Common.id(V.Account.interact[3]).isVisibleToUser(true).find();
        Log.log('tags', tags);
        let contains = [];
        while (true) {
            let dl = 0;
            for (let i in tags) {
                let filter = (v) => {
                    return v.bounds().top >= tags[i].bounds().top && v.bounds().top + v.bounds().height() <= tags[i].bounds().top + tags[i].bounds().height();
                }
                let nicknameTag = Common.id(V.Account.interact[4]).isVisibleToUser(true).filter(filter).findOne();
                let msgTag = Common.id(V.Account.interact[5]).isVisibleToUser(true).filter(filter).findOne();
                Log.log(nicknameTag.text(), msgTag.text());
                if (contains.includes(nicknameTag.text() + '@@@' + msgTag.text())) {
                    continue;//重复
                }
                contains.push(nicknameTag.text() + '@@@' + msgTag.text());
                let backTag = Common.id(V.Account.interact[6]).isVisibleToUser(true).filter(filter).findOne();
                if (!backTag) {
                    Log.log('没有回复按钮');
                    continue;
                }
                Log.log(tags[i].bounds(), backTag.bounds());

                if (count-- <= 0) {
                    break;
                }
                dl++;
                Common.click(backTag, 0.2);
                Log.log('点击回复按钮');
                Common.sleep(1500 + 2000 * Math.random());

                let inputTag = Common.id(V.Account.interact[7]).isVisibleToUser(true).findOne();
                if (!inputTag) {
                    Log.log('没有输入框');
                    continue;
                }
                Common.click(inputTag);
                Common.sleep(1500 + 1500 * Math.random());

                inputTag = Common.id(V.Account.interact[7]).isVisibleToUser(true).findOne();
                if (!inputTag) {
                    Log.log('没有输入框2');
                    continue;
                }
                inputTag.setText(this.getMsg(0, msgTag.text()));
                Common.sleep(1000 + 1000 * Math.random());

                let sendTag = Common.id(V.Account.interact[8]).text(V.Account.interact[9]).isVisibleToUser(true).findOne();
                if (!sendTag) {
                    Log.log('没有发送回复按钮');
                    continue;
                }

                Common.click(sendTag);
                Common.sleep(3000 + 3000 * Math.random());//这里有回复弹窗，所以等待久一点
            }

            if (count-- <= 0 || dl == 0) {
                Log.log('评论执行完了');
                break;
            }

            let scrollTag = UiSelector().scrollable(true).isVisibleToUser(true).findOne();
            if (scrollTag) {
                scrollTag.scrollForward();
                Log.log('滑动');
                Common.sleep(2000 + 2000 * Math.random());
            }
        }
        Common.back();
        Log.log('返回到视频号消息、视频号私信主界面');
    },

    privateDealMain() {
        let dealCount = 10;
        while (dealCount-- > 0) {
            let tags = Common.id(V.Account.privateDeal[4]).isVisibleToUser(true).find();
            let nicknames = [];
            if (tags.length > 0) {
                let dl = 0;
                for (let i in tags) {
                    let tipTag = Common.id(V.Account.privateDeal[5]).isVisibleToUser(true).filter(v => {
                        return v.bounds().left > tags[i].bounds().left && v.bounds().top > tags[i].bounds().top && v.bounds().left + v.bounds().width() < tags[i].bounds().left + tags[i].bounds().width();
                    }).findOne();

                    if (!tipTag || tipTag.text() * 1 <= 0) {
                        continue;
                    }

                    let nicknameTag = Common.id(V.Account.privateDeal[6]).isVisibleToUser(true).filter(v => {
                        return v.bounds().left >= tags[i].bounds().left && v.bounds().top >= tags[i].bounds().top && v.bounds().left + v.bounds().width() <= tags[i].bounds().left + tags[i].bounds().width();
                    }).findOne();
                    if (!nicknameTag || nicknameTag.text() == V.Account.privateDeal[7]) {
                        continue;
                    }

                    if (nicknames.includes(nicknameTag.text())) {
                        Log.log('重复');
                        continue;
                    }

                    nicknames.push(nicknameTag.text());
                    Common.click(tipTag);
                    Common.sleep(2000 + 2000 * Math.random());
                    Log.log('进入了对话页面');

                    dl++;
                    let latestMsgTags = Common.id(V.Account.privateDeal[8]).isVisibleToUser(true).filter(v => {
                        return v.bounds().left < Device.width() - v.bounds().left - v.bounds().width();
                    }).find();
                    let latestMsgTag = latestMsgTags[latestMsgTags.length - 1];
                    let msg = latestMsgTag.text();
                    let inputTag = Common.id(V.Account.privateDeal[9]).isVisibleToUser(true).findOne();
                    if (!inputTag) {
                        throw new Error('找不到输入框');
                    }

                    Common.click(inputTag);
                    Common.sleep(1000 + 1000 * Math.random());
                    inputTag = Common.id(V.Account.privateDeal[9]).textMatches("\.+").isVisibleToUser(true).findOne();
                    if (!inputTag) {
                        throw new Error('找不到输入框');
                    }
                    inputTag.setText(this.getMsg(1, msg));
                    Common.sleep(1500 + 1500 * Math.random());
                    let sendTag = Common.id(V.Account.privateDeal[10]).text(V.Account.privateDeal[11]).isVisibleToUser(true).findOne();
                    if (!sendTag) {
                        throw new Error('找不到发送按钮');
                    }
                    Common.click(sendTag);
                    Common.sleep(1500 + 1500 * Math.random());
                    Common.back();
                    Common.sleep(500 + 500 * Math.random());
                    Common.back();
                    Common.sleep(1000 + 1000 * Math.random());
                }
                if (dl == 0) {
                    break;
                }
            }
        }
    },

    privateDeal() {
        let tag = Common.id(V.Account.interact[0]).text(V.Account.privateDeal[0]).isVisibleToUser(true).findOne();
        if (!tag) {
            throw new Error('找不到视频号消息入口');
        }
        let dotCountTag = tag.parent().children().findOne(Common.id(V.Account.privateDeal[1]).isVisibleToUser(true)) || tag.parent().children().findOne(Common.id(V.Account.privateDealT[0]).isVisibleToUser(true));
        // let dotCountTag = Common.id(V.Account.privateDeal[1]).isVisibleToUser(true).filter(v => {
        //     return v.bounds().top >= tag.parent().bounds().top && v.bounds().top + v.bounds().height() <= tag.parent().bounds().top + tag.parent().bounds().height();
        // }).findOne();
        if (!dotCountTag) {
            Log.log('没有进入私信消列表')
            return true;
        }
        Log.log('进入私信列表');
        Common.click(dotCountTag);
        Common.sleep(3000);

        let dazhaohuTag = Common.id(V.Account.privateDeal[2]).text(V.Account.privateDeal[3]).isVisibleToUser(true).findOne();
        if (dazhaohuTag) {
            Log.log('进入打招呼');
            Common.click(dazhaohuTag);
            Log.log('进入了打招呼用户列表页面');
            Common.sleep(3000 + 2000 * Math.random());
            this.privateDealMain();
            Common.back();
            Common.sleep(2000 + 2000 * Math.random());
            Log.log('打招呼进返回到私信');
        }
        Log.log('进入私信');
        this.privateDealMain();
        Common.back();
        Common.sleep(3000);
        Log.log('返回到私信和消息处理界面');
    },

    readMessage(config) {
        try {
            if (config.ai_back_comment_switch) {
                this.interact();
                Common.sleep(3000 + 2000 * Math.random());
            }

            if (config.ai_back_friend_private_switch) {
                this.privateDeal();
                Common.back(2);//返回到微信”发现“
            }
        } catch (e) {
            Common.backHome();
            Common.sleep(3000);
            throw new Error('出错了', e);
        }
    },
}

module.exports = MessageNew;
