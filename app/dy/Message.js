let Common = require('app/dy/Common.js');
let Comment = require('app/dy/Comment.js');
let User = require('app/dy/User.js');
let Video = require('app/dy/Video.js');
let statistics = require('common/statistics');
let V = require('version/V.js');

let Message = {
    showAll() {
        let showTag = Common.id(V.Message.showAll[0]).text(V.Message.showAll[1]).clickable(true).isVisibleToUser(true).findOnce();

        if (showTag) {
            showTag.click();
            Common.sleep(1000 * Math.random() + 2000);
        }
    },

    getNumForDetail(str) {
        hour = /(\d+)小时前/.exec(str);
        if (hour && hour[1]) {
            return hour * 60;
        }

        minute = /(\d+)分钟前/.exec(str);
        return minute && minute[1];
    },

    //监听回复用户消息
    backMsg() {
        let rp = 3;
        while (rp--) {
            //读取消息数量
            let commentCountTags = Common.id(V.Message.backMsg[0]).descContains(V.Message.backMsg[1]).isVisibleToUser(true).find();
            if (!commentCountTags || commentCountTags.length === 0) {
                Common.sleep(10 * 1000);//休眠10秒
                Log.log('没消息，休息10秒');
                return false;
            }

            for (let i in commentCountTags) {
                if (isNaN(i)) {
                    continue;
                }

                let msgTag = commentCountTags[i].parent().children().findOne(Common.id(V.Message.backMsg[2]).descContains(V.Message.backMsg[3]));
                if (!msgTag) {
                    continue;
                }

                Log.log('点击评论数量');
                Common.click(msgTag);
                Common.sleep(3000 + 2000 * Math.random());
            }

            let hudongTag = Common.id(V.Message.backMsg[2]).descContains(V.Message.backMsg[3]).isVisibleToUser(true).findOnce();

            if (hudongTag) {
                Common.click(hudongTag);
                Common.sleep(3000 + 2000 * Math.random());
            }
            Log.log('点击成功');
            break;
        }

        //进入了消息详情
        //this.showAll();
        let contents = [];
        let rpCount = 0;
        let stopCount = 0;

        while (true) {
            let containers = Common.id(V.Message.backMsg[4]).descMatches("[\\s\\S]+[小时|分钟]前，[\\s\\S]+").isVisibleToUser(true).clickable(true).className(V.Message.backMsg[5]).find();
            if (containers.length === 0) {
                stopCount++;
            }

            for (let i in containers) {
                if (isNaN(i)) {
                    continue;
                }

                rpCount++;
                if (contents.includes(containers[i].desc())) {
                    continue;
                }

                let minutes = this.getNumForDetail(containers[i].desc());
                if (!minutes && minutes < 60) {
                    continue;
                }

                contents.push(containers[i].desc());

                let zanTag = containers[i].children().findOne(Common.id(V.Message.backMsg[6]).descContains(V.Message.backMsg[7]));
                if (zanTag) {
                    zanTag.click();
                    Common.sleep(500);
                }

                let commentTag = containers[i].children().findOne(Common.id(V.Message.backMsg[8]).descContains(V.Message.backMsg[9]));
                if (!commentTag) {
                    continue;
                }

                if (commentTag.click()) {
                    Common.sleep(2000 + 1000 * Math.random());
                }

                let iptTag = Common.id(V.Message.backMsg[10]).isVisibleToUser(true).findOnce();
                if (iptTag) {
                    Comment.iptEmoj(1 + Math.round(Math.random() * 3));
                    let rp = 3;
                    while (rp--) {
                        let submitTag = Common.id(V.Message.backMsg[11]).findOnce();
                        if (!submitTag) {
                            break;
                        }

                        Common.click(submitTag);
                        Common.sleep(1000 + 1000 * Math.random());
                    }
                }
            }

            if (containers.length === rpCount) {
                stopCount++;
            } else {
                stopCount = 0;
            }

            if (stopCount >= 4) {
                Common.back();
                return true;
            }

            Log.log('stopCount', containers.length, rpCount);
            Common.swipe(0, 0.7);
            Common.sleep(3000 + 2000 * Math.random());
        }
    },

    search(account) {
        let searchTag = Common.id(V.Message.search[0]).clickable(true).desc(V.Message.search[1]).isVisibleToUser(true).findOnce();
        if (!searchTag) {
            throw new Error('遇到错误，找不到输入框');
        }
        Common.click(searchTag);
        Common.sleep(2000);

        let iptTag = Common.id(V.Message.search[2]).clickable(true).text(V.Message.search[1]).isVisibleToUser(true).findOnce();
        if (!iptTag) {
            Log.log(Common.id(V.Message.search[2]).clickable(true).text(V.Message.search[1]).isVisibleToUser(true).findOne());
            throw new Error('遇到错误，找不到输入框-2');
        }

        iptTag.setText(account);
        Common.sleep(2000 + 1000 * Math.random());
    },

    intoFansGroup(account, index) {
        this.search(account);
        let contents = [];

        let rpCount = 0;
        while (true) {
            let rp = 0;
            let allRp = 0;
            let groupTag = Common.id(V.Message.intoFansGroup[0]).text(V.Message.intoFansGroup[1]).isVisibleToUser(true).findOnce();
            if (!groupTag) {
                throw new Error('找不到群聊');
            }

            let contains = Common.id(V.Message.intoFansGroup[2]).isVisibleToUser(true).find();
            if (contains.length === 0) {
                throw new Error('找不到群聊-2');
            }

            for (let i in contains) {
                if (isNaN(i)) {
                    continue;
                }

                if (contains[i].bounds().top < groupTag.bounds().top) {
                    Log.log('非群聊');
                    continue;
                }

                let titleTag = contains[i].children().findOne(Common.id(V.Message.intoFansGroup[3]));
                if (!titleTag || !titleTag.text()) {
                    continue;
                }

                allRp++;
                if (contents.includes(titleTag.text())) {
                    rp++;
                    continue;
                }

                contents.push(titleTag.text());
                if (contents.length === index) {
                    contains[i].click();
                    Common.sleep(3000 + 2000 * Math.random());
                    return true;
                }
            }
            if (allRp === rp) {
                rpCount++;
            } else {
                rpCount = 0;
            }

            if (rpCount >= 3) {
                return false;
            }
            Common.swipe(0, 0.5);
        }
    },

    intoGroupUserList(contents, getMsg, machineInclude, machineSet) {
        let tag;
        if (App.getAppVersionCode('com.ss.android.ugc.aweme') < 310701) {
            tag = Common.id(V.Message.intoGroupUserList[0]).desc(V.Message.intoGroupUserList[1]).isVisibleToUser(true).findOnce();
        } else {
            tag = UiSelector().className(V.Message.intoGroupUserList[0]).desc(V.Message.intoGroupUserList[1]).isVisibleToUser(true).clickable(true).findOnce();
        }

        if (!tag) {
            throw new Error('找不到“更多“');
        }
        tag.click();
        Common.sleep(2000 + 2000 * Math.random());

        let groupTag;
        if (App.getAppVersionCode('com.ss.android.ugc.aweme') < 310701) {
            groupTag = UiSelector().descContains(V.Message.intoGroupUserList[2]).isVisibleToUser(true).findOnce();

            if (!groupTag) {
                groupTag = UiSelector().descContains(V.Message.intoGroupUserList[2]).findOnce();

                if (!groupTag) {
                    throw new Error('找不到“groupTag“');
                }
            }

            groupTag.click();
            Common.sleep(2300);
            Log.log(groupTag);

            let groupTag2 = UiSelector().textContains(V.Message.intoGroupUserList[3]).isVisibleToUser(true).findOnce();

            if (groupTag2) {
                Common.click(groupTag2);
                Common.sleep(3000);
            }
        } else {
            let tag = Common.id(V.Message.intoGroupUserList[2]).text(V.Message.intoGroupUserList[3]).isVisibleToUser(true).findOne();
            if (!tag) {
                tag = Common.id(V.Message.intoGroupUserList[2]).text(V.Message.intoGroupUserList[3]).findOne();
                if (!tag) {
                    throw new Error('找不到“groupTag“');
                }
            }

            Common.click(tag);
            Common.sleep(2300);
            Log.log(tag);

            groupTag = Common.id(V.Message.intoGroupUserListAdd[0]).text(V.Message.intoGroupUserListAdd[1]).findOne();
        }

        let rpCount = 0;
        let rpContains = [];
        while (true) {
            let contains = Common.id(V.Message.intoGroupUserList[4]).clickable(true).isVisibleToUser(true).find();
            if (0 == contains.length) {
                return true;
            }

            let isAddFirst = false;
            for (let i in contains) {
                if (isNaN(i)) {
                    continue;
                }

                Log.log('第几个：' + i);
                if (contains[i].bounds().top < groupTag.bounds().top) {
                    continue;
                }

                if (contains[i].bounds().top > Device.height()) {
                    continue;
                }

                if (contains[i].bounds().top + contains[i].bounds().height() > Device.height()) {
                    continue;
                }

                let titleTag;
                if (App.getAppVersionCode('com.ss.android.ugc.aweme') < 310701) {
                    titleTag = contains[i].children().findOne(Common.id(V.Message.intoGroupUserList[5])) || contains[i].children().findOne(Common.id(V.Message.intoGroupUserList[6]));
                    if (!titleTag || !titleTag.text()) {
                        Log.log('无内容');
                        continue;
                    }
                } else {
                    let t = contains[i].bounds().top;
                    let h = contains[i].bounds().height();
                    titleTag = Common.id(V.Message.intoGroupUserList[5]).filter(v => {
                        return v && v.bounds() && v.bounds().top > t && v.bounds().top + v.bounds().height() < t + h && v.bounds().left >= 0;
                    }).findOne() || Common.id(V.Message.intoGroupUserList[6]).filter(v => {
                        return v && v.bounds() && v.bounds().top > t && v.bounds().top + v.bounds().height() < t + h && v.bounds().left >= 0;
                    }).findOne();
                    if (!titleTag || !titleTag.text()) {
                        Log.log('无内容');
                        continue;
                    }
                }

                if (!isAddFirst) {
                    rpContains.push(titleTag.text());
                    if (rpContains[0] == rpContains[1]) {
                        rpCount++;
                    } else {
                        rpCount = 0;
                    }

                    if (rpContains.length >= 2) {
                        rpContains.shift();
                    }
                    Log.log('rpContains', rpContains, rpCount);
                    isAddFirst = true;
                }

                if (contents.includes(titleTag.text()) || machineInclude(titleTag.text())) {
                    continue;
                }

                Log.log('点击元素，准备进入个人中心');
                Common.click(contains[i]);
                Common.sleep(2000 + 2000 * Math.random());
                statistics.viewUser();
                let isPrivateAccount = User.isPrivate();
                if (isPrivateAccount) {
                    Common.back();
                    machineSet(titleTag.text());
                    contents.push(titleTag.text());
                    continue;
                }
                Log.log('是否是私密账号：' + isPrivateAccount);

                Log.log('即将进入视频');
                if (Video.intoUserVideo()) {
                    //点赞
                    if (Math.random() < 0.7) {
                        Video.clickZan();
                    }
                    Common.sleep(5000 + 5000 * Math.random());

                    //随机评论视频
                    let msg = getMsg(0, Video.getContent());
                    if (msg) {
                        Video.openComment(!!Video.getCommentCount());
                        Log.log('开启评论窗口');
                        Comment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                        Log.log('评论了');
                        Common.back(2, 800);
                    } else {
                        Common.back();//从视频页面到用户页面
                    }
                } else {
                    Log.log('未进入视频');
                }

                machineSet(titleTag.text());
                contents.push(titleTag.text());
                Common.back();
                Common.sleep(1500);
            }

            if (rpCount >= 3) {
                return true;
            }
            Common.swipeFansGroupListOp();
            Log.log('滑动');
            Common.sleep(1000 + 1000 * Math.random());
        }
    }
}

module.exports = Message;
