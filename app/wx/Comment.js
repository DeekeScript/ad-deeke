let Common = require('app/wx/Common.js');
let statistics = require('common/statistics.js');
let storage = require('common/storage.js');

let Comment = {
    tag: undefined,//当前的tag标签
    containers: [],//本次遍历的内容  主要用于去重
    getAvatarTag(tag) {
        if (tag) {
            return tag.children().findOne(Common.id('a_4').desc('头像').isVisibleToUser(true));
        }
        return this.tag.children().findOne(Common.id('a_4').desc('头像').isVisibleToUser(true));
    },

    isChannel() {//判断是否是视频号，不是则不能进入主页
        return this.tag.children().findOne(UiSelector().className('android.widget.ImageView').descContains('logo'));
    },

    getNicknameTag() {
        return this.tag.children().findOne(Common.id('kbf'));
    },

    getContentTag() {
        return Common.id('c1_').filter(v => {
            return v.bounds().centerY() > this.tag.bounds().top && v.bounds().centerY() < this.tag.bounds().bottom;
        }).findOne();
    },

    getTimeTag() {
        return this.tag.children().findOne(Common.id('c85'));
    },

    getIpTag() {
        return this.tag.children().findOne(Common.id('hgh'));
    },


    getZanTag(tag) {
        if (tag) {
            return tag.children().findOne(Common.id('iht').isVisibleToUser(true));
        }
        return this.tag.children().findOne(Common.id('iht').isVisibleToUser(true));
    },

    isAuthor() {
        return this.tag.children().findOne(Common.id('l23').textContains('作者')) ? true : false;
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
        return this.tag.children().findOne(Common.id('aa0'));
    },

    getZanCount() {
        let tag = this.getZanTag();
        if (!tag) {
            return 0;
        }
        return Common.numDeal(tag.text());
    },

    isZan() {
        return this.getZanTag().isSelected();
    },

    //data 是getList返回的参数
    clickZan(data) {
        let zanTag = this.getZanTag(data.tag);
        if (zanTag && zanTag.isSelected()) {
            return true;
        }

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
        return Common.swipeCommentListOp();
    },

    commentCount: 0,
    getCommentCount() {
        return this.commentCount;
    },

    getList() {
        let contains = Common.id('dz_').isVisibleToUser(true).filter(v => {
            if (v && v.bounds()) {
                Log.log('位置', v.bounds().top, v.bounds().height(), v.bounds().left, Device.height());
            }
            return v && v.bounds() && v.bounds().left <= 10 && v.bounds().top + v.bounds().height() < Device.height();//过滤评论回复内容
        }).find();
        Log.log("数量：", contains.length);
        this.commentCount = contains.length;
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
                    //zanCount: this.getZanCount(),
                    //isZan: this.isZan(),
                    isAuthor: this.isAuthor(),
                    ip: this.getIp(),
                    headTag: this.getAvatarTag(),
                    isChannel: this.isChannel(),//是不是视频号
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
        Common.back();
        return true;
    },

    //data 是getList返回的参数
    intoUserPage(headTag) {
        Log.log('headTag', headTag);
        //Log.log('headTag-', headTag.parent().parent());
        Common.click(headTag, 0.24);
        statistics.viewUser();
        //headTag.parent().parent().click();
        Common.sleep(3000 + 2000 * Math.random());
    },

    //视频评论
    commentMsg(msg) {
        let iptTag = Common.id('c6v').isVisibleToUser(true).findOnce();
        try {
            Common.click(iptTag, 0.2);
            Common.sleep(1500 + 500 * Math.random());
        } catch (e) {
            Log.log(e);
        }

        iptTag = Common.id('c6v').isVisibleToUser(true).findOne();
        //获取是否评论图片
        Log.log("带图评论概率：" + storage.get("setting_comment_with_photo", "int"));
        if (storage.get("setting_comment_with_photo", "int") > Math.random() * 100) {
            this.commentImage();
            // Common.click(iptTag);
            Common.sleep(100);
        }

        Log.log('msg', msg);

        System.setClip(msg);
        Common.sleep(500 + Math.random() * 1000);
        iptTag.paste();
        Common.sleep(500 + Math.random() * 1000);

        let rp = 3;
        while (rp--) {
            try {
                let submitTag = Common.id('uet').isVisibleToUser(true).findOne();
                Log.log(submitTag);
                if (!submitTag) {
                    continue;
                }
                Common.click(submitTag, 0.2);
                Common.sleep(3000 + 1000 * Math.random());
                break;
            } catch (e) {
                Log.log(e);
            }
        }

        statistics.comment();
        Common.sleep(1000 + 1000 * Math.random());
        return true;
    },

    //暂未变更
    commentImage() {
        let imgTag = Common.id('ueu').isVisibleToUser(true).findOne();
        Log.log(imgTag);

        if (!imgTag) {
            Log.log('异常，没有看到表情按钮');
            return;
        }

        Log.log("表情呢", imgTag);
        Common.click(imgTag, 0.2);
        Common.sleep(2000 + 500 * Math.random());
        let tag = Common.id('n0v').desc('自定义表情').isVisibleToUser(true).findOnce();
        Log.log(tag);
        if (!tag) {
            Common.sleep(2000 + 500 * Math.random());
            tag = Common.id('n0v').desc('自定义表情').isVisibleToUser(true).findOnce();
            Log.log("再次获取", tag);
        }
        Common.click(tag, 0.2);
        Common.sleep(1000 + 500 * Math.random());

        console.log("开始找表情");
        let imgs = Common.id('a50').isVisibleToUser(true).find();

        console.log("表情数量：" + imgs.length);
        let rand = Math.round(Math.random() * (imgs.length - 1));
        console.log('点击第几个：' + rand);
        console.log(imgs[rand]);

        if (rand == 0) {
            rand = 1;
        }
        Common.click(imgs[rand], 0.2);
        Common.sleep(1000);
    },
}

module.exports = Comment;
