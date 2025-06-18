let Common = require('app/wx/Common.js');
let statistics = require('common/statistics.js');
let V = require('version/WxV.js');
let storage = require('common/storage.js');

let Comment = {
    tag: undefined,//当前的tag标签
    containers: [],//本次遍历的内容  主要用于去重
    getAvatarTag(tag) {
        if (tag) {
            return tag.children().findOne(Common.id(V.Comment.getAvatarTag[0]).desc(V.Comment.getAvatarTag[1]).isVisibleToUser(true));
        }
        return this.tag.children().findOne(Common.id(V.Comment.getAvatarTag[0]).desc(V.Comment.getAvatarTag[1]).isVisibleToUser(true));
    },

    getNicknameTag() {
        return this.tag.children().findOne(Common.id(V.Comment.getNicknameTag[0]));
    },

    getContentTag() {
        return this.tag.children().findOne(Common.id(V.Comment.getContentTag[0]));
    },

    getTimeTag() {
        return this.tag.children().findOne(Common.id(V.Comment.getTimeTag[0]));
    },

    getIpTag() {
        return this.tag.children().findOne(Common.id(V.Comment.getIpTag[0]));
    },


    getZanTag(tag) {
        if (tag) {
            return tag.children().findOne(Common.id(V.Comment.getZanTag[0]).isVisibleToUser(true));
        }
        return this.tag.children().findOne(Common.id(V.Comment.getZanTag[0]).isVisibleToUser(true));
    },

    isAuthor() {
        return this.tag.children().findOne(Common.id(V.Comment.isAuthor[0]).textContains(V.Comment.isAuthor[1])) ? true : false;
    },

    getNickname() {
        let tag = this.getNicknameTag();
        if (tag) {
            return tag.text();
        }
        return false;
    },

    getContent() {
        let tag = this.getContentTag();
        if (!tag || !tag.text()) {
            return '';
        }

        return tag.text();
    },

    getZanCountTag() {
        return this.tag.children().findOne(Common.id(V.Comment.getZanCountTag[0]));
    },

    getZanCount() {
        return Common.numDeal(this.getZanCountTag().text());
    },

    isZan() {
        return this.getZanTag().isSelected();
    },

    //data 是getList返回的参数
    clickZan(data) {
        let zanTag = this.getZanTag(data.tag);
        zanTag && Common.click(zanTag);
        statistics.zanComment();
        return true;
    },

    getTime() {
        let timestamp = Math.ceil(Date.parse(new Date()) / 1000);
        let incSecond = 0;

        let time = this.getTimeTag();
        if (!time) {
            return 0;
        }

        time = time.text();
        time = time.split(' ');
        time = time[0];

        if (time.indexOf('分钟前') !== -1) {
            incSecond = time.replace('分钟前', '') * 60;
        } else if (time.indexOf('小时前') !== -1) {
            incSecond = time.replace('小时前', '') * 3600;
        } else if (time.indexOf('刚刚') !== -1) {
            incSecond = 0;
        } else if (time.indexOf('天前') !== -1) {
            incSecond = time.replace('天前', '') * 86400;
        } else if (time.indexOf('昨天') !== -1) {
            time = time.replace('昨天', '').split(':');
            incSecond = 86400 - time[0] * 3600 - time[1] * 60 + (new Date()).getHours() * 3600 + (new Date()).getMinutes() * 60;
        } else if (/[\d]{2}\-[\d]{2}/.test(time)) {
            time = (new Date()).getFullYear() + '-' + time;
            return (new Date(time)).getTime() / 1000 + ((new Date()).getHours() - 8) * 3600 + (new Date()).getMinutes() * 60;//减去默认的8点
        } else {
            return (new Date(time)).getTime() / 1000;//直接是日期
        }
        return timestamp - incSecond;
    },

    getIp() {
        let tag = this.getIpTag();
        if (!tag) {
            return '未知';
        }
        let msg = tag.text();
        if (!msg) {
            return '未知';
        }

        return msg;
    },

    swipeTop() {
        Common.swipeCommentListOp();
    },

    getList() {
        let contains = Common.id(V.Comment.getList[0]).isVisibleToUser(true).filter(v => {
            if (v && v.bounds()) {
                Log.log('位置', v.bounds().top, v.bounds().height(), v.bounds().left, Device.height());
            }
            return v && v.bounds() && v.bounds().left <= 10 && v.bounds().top + v.bounds().height() < Device.height();//过滤评论回复内容
        }).find();
        Log.log("数量：", contains.length);
        let contents = [];
        let data = {};

        for (let i in contains) {
            //不需要二次回复的内容
            Log.log("左边距", contains[i].bounds().left);
            // if (contains[i].bounds().left > 0) {
            //     continue;
            // }

            this.tag = contains[i];//主要给当前方法使用的，比如下面的this.getIp()方法等
            Log.log("tag", this.tag);
            try {
                data = {
                    tag: contains[i],
                    nickname: this.getNickname(),
                    content: this.getContent(),
                    zanCount: this.getZanCount(),
                    isZan: this.isZan(),
                    isAuthor: this.isAuthor(),
                    ip: this.getIp(),
                }
            } catch (e) {
                Log.log("部分内容不在屏幕内导致的问题" + e);
                continue;
            }
            Log.log("Data", data);
            if (data.nickname === false) {
                Log.log('评论区nickname无');
                continue;
            }

            if (this.containers && this.containers.length > 100) {
                this.containers.shift();
            }

            if (this.containers.includes(data.nickname + '_' + data.content)) {
                continue;
            }

            contents.push(data);
            this.containers.push(data.nickname + '_' + data.content);
        }
        return contents;
    },
    //这里其实使用back最方便
    closeCommentWindow() {
        let closeTag = Common.id(V.Comment.closeCommentWindow[0]).desc(V.Comment.closeCommentWindow[1]).isVisibleToUser(true).findOnce();
        if (!closeTag) {
            return;
            //throw new Error('找不到关闭按钮');
        }
        Common.back();
        return true;
    },

    //data 是getList返回的参数
    intoUserPage(data) {
        let headTag = this.getAvatarTag(data.tag);
        Log.log('headTag', headTag);
        //Log.log('headTag-', headTag.parent().parent());
        Common.click(headTag);
        statistics.viewUser();
        //headTag.parent().parent().click();
        Common.sleep(3000 + 1000 * Math.random());
    },

    //视频评论
    commentMsg(msg) {
        let iptTag = Common.id(V.Comment.commentMsg[0]).isVisibleToUser(true).findOnce();
        try {
            Common.click(iptTag);
            Common.sleep(1500 + 500 * Math.random());
        } catch (e) {
            Log.log(e);
        }

        iptTag = Common.id(V.Comment.commentMsg[1]).isVisibleToUser(true).findOne();
        //获取是否评论图片
        Log.log("带图评论概率：" + storage.get("setting_comment_with_photo", "int"));
        if (storage.get("setting_comment_with_photo", "int") > Math.random() * 100) {
            this.commentImage();
            // Common.click(iptTag);
            Common.sleep(100);
        }

        Log.log('msg', msg);

        let iText = '';
        for (let i = 0; i < msg.length; i++) {
            iText = msg.substring(0, i + 1);
            iptTag.setText(iText);
            Common.sleep(100 + 300 * Math.random());
        }

        Common.sleep(500 + Math.random() * 1000);

        let rp = 3;
        while (rp--) {
            try {
                let submitTag = Common.id(V.Comment.commentMsg[2]).isVisibleToUser(true).findOne();
                Log.log(submitTag);
                if (!submitTag) {
                    continue;
                }
                Common.click(submitTag);
                Common.sleep(1000);
                break;
            } catch (e) {
                Log.log(e);
            }
        }

        statistics.comment();

        //查看dg0位置有没有下来
        iptTag = Common.id(V.Comment.commentMsg[2]).isVisibleToUser(true).findOne();
        Log.log(iptTag);
        if (iptTag) {
            Common.back();
            Log.log("点击失败：返回");
        }

        Common.sleep(1500 + 1500 * Math.random());
    },

    //暂未变更
    commentImage() {
        let imgTag = Common.id(V.Comment.commentImage[0]).isVisibleToUser(true).findOne();
        Log.log(imgTag);

        if (!imgTag) {
            Log.log('异常，没有看到表情按钮');
            return;
        }

        Log.log("表情呢", imgTag);
        Common.click(imgTag);
        Common.sleep(2000 + 500 * Math.random());
        let tag = Common.id(V.Comment.commentImage[1]).desc(V.Comment.commentImage[2]).isVisibleToUser(true).findOnce();
        Log.log(tag);
        if (!tag) {
            Common.sleep(2000 + 500 * Math.random());
            tag = Common.id(V.Comment.commentImage[1]).desc(V.Comment.commentImage[2]).isVisibleToUser(true).findOnce();
            Log.log("再次获取", tag);
        }
        Common.click(tag);
        Common.sleep(1000 + 500 * Math.random());

        console.log("开始找表情");
        let imgs = Common.id(V.Comment.commentImage[3]).isVisibleToUser(true).find();

        console.log("表情数量：" + imgs.length);
        let rand = Math.round(Math.random() * (imgs.length - 1));
        console.log('点击第几个：' + rand);
        console.log(imgs[rand]);

        if (rand == 0) {
            rand = 1;
        }
        Common.click(imgs[rand]);
        Common.sleep(1000);
    },
}

module.exports = Comment;
