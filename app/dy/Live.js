let Common = require('app/dy/Common.js');
let statistics = require('common/statistics');
let V = require('version/V.js');

let Live = {
    getUserCountTag() {
        return Common.id(V.Live.getUserCountTag[0]).isVisibleToUser(true).findOnce();
    },

    //打开粉丝列表
    openUserList() {
        let tag = this.getUserCountTag();
        Common.click(tag);
        Common.sleep(3000);
    },

    _getUserTags() {
        //小米手机的left是1，华为是0，这里10控制
        console.log("length", Common.id(V.Live.getUserTags[0]).findOnce().children().length());
        let tags = Common.id(V.Live.getUserTags[0]).findOnce().children().find(UiSelector().textMatches(V.Live.getUserTags[1]).isVisibleToUser(true).filter((v) => {
            //console.log("vvv", v);
            return v && !v.text().includes('我的信息') && v.bounds().left < 10 && v.bounds().width() >= Device.width() - 10;
        }));
        return tags;
    },

    getUserTags() {
        let tags = Common.id(V.Live.getUserTags[0]).findOnce().children().find(UiSelector().className(V.Live.getUserTags[2]).isVisibleToUser(true).filter((v) => {
            //console.log("vvv", v);
            return v && v.bounds().left < 10 && v.bounds().width() >= Device.width() - 10;
        }));
        return tags;
    },

    //userCount: 0,
    getUsers() {
        let tags = this.getUserTags();
        let users = [];
        for (let i in tags) {
            users.push({
                //title: tags[i].text(),//_addr
                tag: tags[i],
                //index: ++this.userCount,
            });
            Log.log(tags[i]);
        }
        Log.log("粉丝列表：" + tags.length);
        return users;
    },

    getNickname() {
        let userTag = Common.id(V.Live.intoFansPage[0]).isVisibleToUser(true).findOne();
        return userTag ? userTag.text() : '';
    },

    intoFansPage() {
        let nickTag = Common.id(V.Live.intoFansPage[0]).findOnce();
        Common.click(nickTag);
        statistics.viewUser();
        Log.log('点击弹窗');
        Common.sleep(3500);
    },

    swipeFansList() {
        let a = UiSelector().scrollable(true).isVisibleToUser(true).findOne();
        if (a) {
            a.scrollForward();
            Log.log('滑动成功');
        } else {
            Log.log('滑动失败');
        }
    },

    getNewRecord: function (baseRecord, grabRecord) {
        //grabRecord最大是6条  现在从有6条全部重复假设  然后 5条，4条，直到0条；  如果刚刚好N的时候，全部重复，那么则退出
        if (baseRecord.length == 0) {
            return grabRecord;
        }
        let inCount = 0;//计算新抓取的记录有几个在历史内
        for (let i = grabRecord.length; i > 0; i--) {
            inCount = 0;
            for (let m = 0; m < i; m++) {
                if (baseRecord[baseRecord.length - i + m] == grabRecord[m].repeat) {
                    inCount++;
                }
            }
            if (inCount == i) {
                break;
            }
        }
        let result = [];
        for (let i = inCount; i < grabRecord.length; i++) {
            result.push(grabRecord[i]);
        }
        return result;
    },

    //读取弹幕 
    listenBarrage(postFunc, otherPostFunc) {
        Log.log('开始');
        let allIn = [];//存储10个，如果重复则不计入，否则覆盖，超过10个，移除最前面的一个
        let data = [];
        //其他数据，大概4种类型
        //文哥💥 为主播点赞了
        //隔壁我大爷 来了
        //恭喜白马成为在线观众音浪TOP1
        //灵在 送出抖币红包  x1，价值1000抖币       用户82832774 送出玫瑰 .  x1
        let otherData = [];
        while (true) {
            try {
                data = [];
                let tags = Common.id(V.Live.listenBarrage[0]).className(V.Live.listenBarrage[1]).find();
                if (!tags || tags.length == 0) {
                    continue;
                }

                for (let i in tags) {
                    if (isNaN(i) || !tags[i].text()) {
                        continue;
                    }

                    let tmp = tags[i].text().replace(/\$+/g, '');
                    if (tmp.charAt(0) == ' ') {
                        tmp = tmp.replace(' ', '');
                    }

                    if (tmp.indexOf('* * * * * ') === 0) {
                        tmp = tmp.substring(10);
                    } else if (tmp.indexOf('* * * * ') === 0) {
                        tmp = tmp.substring(8);
                    } else if (tmp.indexOf('* * * ') === 0) {
                        tmp = tmp.substring(6);
                    } else if (tmp.indexOf('* * ') === 0) {
                        tmp = tmp.substring(4);
                    } else if (tmp.indexOf('* ') === 0) {
                        tmp = tmp.substring(2);
                    }

                    let index = tmp.indexOf('：');
                    if (index == -1) {
                        if (otherData.indexOf(tmp) == -1) {
                            otherData.push(tmp);
                            if (otherData.length > 16) {
                                otherData.shift();
                            }
                            otherPostFunc && otherPostFunc(tmp);
                        }

                        //Log.log('-1', tmp);
                        continue;
                    }

                    data.push({
                        nickname: tmp.substring(0, index),
                        comment: tmp.substring(index + 1),
                        repeat: tmp.substring(0, index) + ':' + tmp.substring(index + 1),
                    });
                }
                Log.log('查找新用户');
                let postUsers = this.getNewRecord(allIn, data);
                //Log.log('新用户：', postUsers);
                if (postUsers && postUsers.length) {
                    //Log.log(postUsers);
                    for (let u of postUsers) {
                        allIn.push(u.repeat);
                        Log.log('all length', allIn.length);
                        if (allIn.length > 20) {
                            allIn.shift();
                        }
                    }
                    postFunc(postUsers);
                }
            } catch (e) {
                Log.log(e);
            }
        }
    },

    loopClick(times) {
        try {
            let closeTag = UiSelector().desc(V.Live.loopClick[0]).clickable(true).isVisibleToUser(true).filter((v) => {
                return v && v.bounds() && v.bounds().top > Device.height() / 3 && v.bounds().width > 0 && v.bounds().left > 0;
            }).findOnce();
            if (closeTag) {
                closeTag.click();
                Common.sleep(1000);
            }

            let left = Device.width() * (0.35 + 0.3 * Math.random());
            let top = Device.height() / 3 + Device.height() / 4 * Math.random();
            for (let i = 0; i < times; i++) {
                Gesture.click(left, top + i);
                Common.sleep(50 + 50 * Math.random());
            }
        } catch (e) {
            Log.log(e);
        }

        if (!this.getUserCountTag()) {
            return false;
        }
    },

    comment(msg, withEmoji) {
        let tag = Common.id(V.Live.comment[0]).clickable(true).isVisibleToUser(true).findOnce();
        if (tag) {
            tag.click();
            Common.sleep(2000);
        }

        let iptTag = UiSelector().className(V.Live.comment[1]).clickable(true).isVisibleToUser(true).findOnce();

        iptTag.setText(msg);


        //是否带表情
        if (withEmoji) {
            let emojiTag = Common.id(V.Live.comment[4]).clickable(true).isVisibleToUser(true).findOne();
            if (emojiTag) {
                emojiTag.click();
                Common.sleep(1000);

                let lists = Common.id(V.Live.comment[5]).scrollable(true).findOne();
                let emojisTag = lists.children().find(UiSelector().clickable(true).className(V.Live.comment[6]));

                console.log(emojisTag.length);
                let max = emojisTag.length;

                let rd = Math.floor(Math.random() * max);
                emojisTag[rd].click();
                Common.sleep(1000);
            }
        }

        let submitTag = Common.id(V.Live.comment[2]).desc(V.Live.comment[3]).isVisibleToUser(true).findOnce();

        if (submitTag) {
            Common.click(submitTag);
            Common.sleep(3000);
        }
    },

    loopComment(msg, withEmoji) {
        try {
            this.comment(msg, withEmoji);
        } catch (e) {
            Log.log(e);
        }
    }
}

module.exports = Live;
