import { Common } from 'app/dy/Common.js';
export let Live = {
    getUserCountTag() {
        return Common.id('o4u').filter((v) => {
            return v && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height();
        }).findOnce();
    },

    //打开粉丝列表
    openUserList() {
        let tag = this.getUserCountTag();
        Common.click(tag);
        Common.sleep(3000);
    },

    getUserTags() {
        let tags = Common.id('ah0').findOnce().children().find(new UiSelector().textMatches("[\\s\\S]+")).filter((v) => {
            return v && !v.text().includes('我的信息') && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() - 300 && v.bounds().left === 0 && v.bounds().width() === Device.width();
        });
        return tags;
    },

    getUsers() {
        let tags = this.getUserTags();
        let users = [];
        for (let i in tags) {
            let tp = /第(\d+)名/.exec(tags[i].text());
            users.push({
                title: tags[i].text(),
                tag: tags[i],
                index: (tp && tp[1]) || 1000,
            });
        }
        Log.log("粉丝列表：" + tags.length);
        Log.log(tags);
        return users;
    },

    intoFansPage(data) {
        Log.log(data.tag);
        Common.click(data.tag);
        Log.log('点击list');
        Common.sleep(2000);
        let nickTag = Common.id('opq').findOnce();
        Common.click(nickTag);
        Log.log('点击弹窗');
        Common.sleep(3500);
    },

    swipeFansList(rate) {
        if (rate === undefined) {
            rate = 1;
        }
        let left = Math.random() * Device.width() * 0.8 + Device.width() * 0.2;
        let bottom = Device.height() * 2 / 3;
        let top = Device.height() / 2;
        Gesture.swipe(left, bottom * rate, left, top * rate, 150 + 100 * Math.random());//从下往上推，清除
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
                let tags = new UiSelector().id("com.ss.android.ugc.aweme:id/text").className("android.widget.TextView").find();
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
            let closeTag = new UiSelector().desc('关闭').clickable(true).filter((v) => {
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
                Common.sleep(100 + 100 * Math.random());
            }
        } catch (e) {
            Log.log(e);
        }

        if (!Common.id('o4u').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().left > 0;
        }).findOnce()) {
            return false;
        }
    },

    comment(msg) {
        let tag = Common.id('f9h').clickable(true).filter((v) => {
            return v && v.bounds() && v.bounds().top && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().left > 0 && v.bounds().width() > 0;
        }).findOnce();

        if (tag) {
            tag.click();
            Common.sleep(2000);
        }

        let iptTag = new UiSelector().className('android.widget.EditText').clickable(true).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0;
        }).findOnce();

        iptTag.setText(msg);
        let submitTag = Common.id('x_9').desc('发送').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0;
        }).findOnce();

        if (submitTag) {
            Common.click(submitTag);
            Common.sleep(3000);
        }
    },

    loopComment(msg) {
        try {
            this.comment(msg);
        } catch (e) {
            Log.log(e);
        }

        if (!Common.id('o4u').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().left > 0;
        }).findOnce()) {
            return false;
        }
    }
}
