let Common = require("app/xhs/Common.js");
let V = require("version/XhsV.js");

let Work = {
    getZanTag() {
        return Common.id(V.Work.zan[0]).isVisibleToUser(true).findOne() || Common.id(V.Work.zan[1]).isVisibleToUser(true).findOne();
    },

    zan() {
        if (this.isZan()) {
            Log.log('已经点过赞了');
            return;
        }

        let zanTag = this.getZanTag();
        if (zanTag) {
            Common.click(zanTag);
            Log.log('点赞成功');
        }
    },

    isZan() {
        let zanTag = this.getZanTag();
        if (zanTag) {
            return zanTag.isSelected();
        }

        return false;
    },

    getCollectTag() {
        return Common.id(V.Work.collect[0]).isVisibleToUser(true).findOne() || Common.id(V.Work.collect[1]).isVisibleToUser(true).findOne();
    },

    collect() {
        if (this.isCollect()) {
            Log.log('已经点过赞了');
            return;
        }

        let collectTag = this.getCollectTag();
        if (collectTag) {
            Common.click(collectTag);
            Log.log('点赞成功');
        }
    },

    isCollect() {
        let collectTag = this.getCollectTag();
        if (collectTag) {
            return collectTag.isSelected();
        }

        return false;
    },

    zanUserListSwipe() {
        let tag = Common.id(V.Work.zanUserList[0]).isVisibleToUser(true).findOne();
        if (tag) {
            tag.scrollForward();
            return true;
        }
        return false;
    },

    getCommentCount(type) {
        let tag;
        if (type == 0) {
            tag = Common.id(V.Work.commentCount[0]).findOne();
        } else {
            tag = Common.id(V.Work.videoComment[0]).findOne();
        }

        return Common.numDeal(tag);
    },

    msg(type, msg) {
        let inputTag;
        if (type == 0) {
            inputTag = Common.id(V.Work.comment[0]).isVisibleToUser(true).findOne();
        } else {
            inputTag = Common.id(V.Work.videoCommentOpen[0]).isVisibleToUser(true).findOne();
        }

        if (!inputTag) {
            Log.log('没有找到输入框');
            return false;
        }

        inputTag.click();
        Common.sleep(1500 + 1000 * Math.random());

        let iptTag = Common.id(V.Work.comment[1]).isVisibleToUser(true).findOne();
        if (!iptTag) {
            Log.log('输入框没有');
            return false;
        }

        iptTag.setText(msg);
        Common.sleep(1500 + 500 * Math.random());
        let sendTag = Common.id(V.Work.sendBtn[0]).textContains(V.Work.sendBtn[1]).isVisibleToUser(true).findOne();
        if (!sendTag) {
            return false;
        }

        sendTag.click();
        if (type == 1) {
            Common.sleep(1000 + 1000 * Math.random());
            Common.back();//视频，还需要关闭评论
        }
        Log.log('发送了');
        Common.sleep(500 + 500 * Math.random());
    },

    commentListSwipe(type) {
        let tag = Common.id(type == 0 ? V.Work.zanCommentList[0] : V.Work.videoComment[1]).isVisibleToUser(true).findOne();
        if (!tag) {
            Log.log('赞评论列表滑动失败');
        }
        return tag.scrollForward();
    },

    intoBottom() {
        let tag = Common.id(V.Work.intoBottom[0]).isVisibleToUser(true).textContains(V.Work.intoBottom[1]).findOne();
        return tag ? true : false;
    },

    zanComment(type, count) {
        if (type == 1) {
            let commentTag = Common.id(V.Work.videoComment[0]).isVisibleToUser(true).findOne();
            if (!commentTag) {
                return false;
            }
            commentTag.click();
            Common.sleep(2000 + 1000 * Math.random());
        }

        let rp = 0;
        let arr = [];
        while (true) {
            let zanTags = Common.id(V.Work.zanCommentList[1]).isVisibleToUser(true).find();
            if (zanTags.length == 0) {
                break;
            }

            for (let i in zanTags) {
                if (arr.indexOf(zanTags[0]._addr) != -1) {
                    if (rp++) {
                        Common.back();
                        return count;//操作完了
                    }
                    continue;
                }

                rp = 0;
                arr.push(zanTags[i].zanTags[0]._addr);
                if (arr.length >= 20) {
                    arr.shift()
                }

                zanTags[i].click();
                Common.sleep(1000 + 1000 * Math.random());
                if (count-- <= 0) {
                    return count;
                }
            }

            if (this.intoBottom()) {
                Log.log('到底了');
                break;
            }

            this.commentListSwipe(type);
            Common.sleep(2000 + 1000 * Math.random());
        }
        Common.back();
        return count;
    },

    isFocus(type) {
        let tag;
        if (type == 1) {
            tag = Common.id(V.Work.videoFocus[0]).isVisibleToUser(true).findOne();
        } else {
            tag = Common.id(V.Work.focus[0]).isVisibleToUser(true).findOne();
        }
        return tag && tag.isSelected();
    },

    focus(type) {
        let tag;
        if (type == 1) {
            tag = Common.id(V.Work.videoFocus[0]).isVisibleToUser(true).findOne();
        } else {
            tag = Common.id(V.Work.focus[0]).isVisibleToUser(true).findOne();
        }

        if (tag && tag.isSelected()) {
            Log.log('已关注');
            return true;
        }

        tag.click();
        return true;
    },

    getNickname() {
        let tag = Common.id(V.Work.nickname).isVisibleToUser(true).findOne();
        return tag ? tag.text() : '';
    },

    getContent() {
        let tag = Common.id(V.Work.title).isVisibleToUser(true).findOne() || Common.id(V.Work.videoTitle).isVisibleToUser(true).findOne();
        return tag ? tag.text() : '';
    },

    getType() {
        if (Common.id(V.Work.nickname).isVisibleToUser(true).findOne()) {
            return 0;//笔记
        }

        if (Common.id(V.Work.VideoNickname).isVisibleToUser(true).findOne()) {
            return 1;//视频
        }

        return -1;
    }
}

module.exports = Work;
