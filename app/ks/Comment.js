let Common = require('app/ks/Common.js');
let statistics = require('common/statistics.js');
let storage = require('common/storage.js');

let Comment = {
    tag: undefined,//当前的tag标签
    containers: [],//本次遍历的内容  主要用于去重
    /**
     * 
     * @param {UiObject} tag 
     * @returns {UiObject}
     */
    getAvatarTag(tag) {
        if (tag) {
            return tag.children().findOne(Common.id('avatar').desc('头像').isVisibleToUser(true));
        }
        return this.tag.children().findOne(Common.id('avatar').desc('头像').isVisibleToUser(true));
    },

    /**
     * 获取昵称控件
     * @returns {UiObject}
     */
    getNicknameTag() {
        return this.tag.children().findOne(Common.id('name'));
    },

    /**
     * 获取评论内容
     * @returns {UiObject}
     */
    getContentTag() {
        return this.tag.children().findOne(Common.id('comment'));
    },

    /**
     * 获取评论时间  09-07 浙江
     * @returns {UiObject}
     */
    getTimeTag() {
        return this.tag.children().findOne(UiSelector().id('com.smile.gifmaker.comment_detail:id/comment_created_time_and_loc'));
    },

    /**
     * 获取Ip 09-07 浙江
     * @returns {UiObject}
     */
    getIpTag() {
        return this.getTimeTag();
    },

    /**
     * 获取点赞控件
     * @param tag
     * @returns {UiObject}
     */
    getZanTag(tag) {
        if (tag) {
            return tag.children().findOne(UiSelector().descContains('点赞'));
        }
        return this.tag.children().findOne(UiSelector().descContains('点赞'));
    },

    /**
     * 是否是作者
     * @param tag
     * @returns {UiObject}
     */
    isAuthor() {
        return this.tag.children().findOne(UiSelector().text('作者')) ? true : false;
    },

    /**
     * 获取昵称
     * @param tag
     * @returns {string|false}
     */
    getNickname() {
        let tag = this.getNicknameTag();
        if (tag) {
            return tag.text();
        }
        return false;
    },

    /**
     * 获取内容
     * @param tag
     * @returns {string}
     */
    getContent() {
        let tag = this.getContentTag();
        if (!tag || !tag.text()) {
            return '';
        }

        return tag.text();
    },

    /**
     * 获取点赞数
     * @param tag
     * @returns {string}
     */
    getZanCount() {
        return Common.numDeal(this.getZanTag().text());
    },

    /**
     * 是否点赞
     * @returns {boolean}
     */
    isZan() {
        let tag = this.getZanTag();
        if (!tag) {
            return false;
        }
        return tag.children().getChildren(0).isSelected();
    },

    //data 是getList返回的参数
    clickZan(data) {
        let zanTag = this.getZanTag(data.tag);
        zanTag && zanTag.click();
        statistics.zanComment();
        return true;
    },

    /**
     * 获取评论时间
     * @returns {string}
     */
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

    /**
     * 获取Ip
     * @returns {string}
     */
    getIp() {
        let tag = this.getIpTag();
        if (!tag) {
            return '未知';
        }
        let msg = tag.text();
        if (!msg) {
            return '未知';
        }

        return msg.split(' ')[1];
    },

    /**
     * 滚动评论
     * @returns {boolean}
     */
    swipeTop() {
        return Common.swipeCommentListOp();
    },

    /**
     * 获取列表
     * @returns {Array}
     */
    getList() {
        let contains = Common.id('comment_frame').isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left <= 10 && v.bounds().top + v.bounds().height() < Device.height();//过滤评论回复内容
        }).find();
        Log.log("数量：", contains.length);
        let contents = [];
        let data = {};

        for (let i in contains) {
            //不需要二次回复的内容
            Log.log("左边距", contains[i].bounds().left);
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

    /**
     * 关闭评论窗口
     * @returns {boolean}
     */
    closeCommentWindow() {
        let closeTag = Common.id('tabs_panel_close').desc('关闭评论区').isVisibleToUser(true).findOnce();
        if (!closeTag) {
            return;
            //throw new Error('找不到关闭按钮');
        }
        closeTag.click();
        return true;
    },

    /**
     * 从评论内容进入用户页面
     * data 是getList返回的参数
     * @param {UiObject} data 
     * @returns {boolean}
     */
    intoUserPage(data) {
        let headTag = this.getAvatarTag(data.tag);
        Log.log('headTag', headTag);
        let res = headTag.click();
        statistics.viewUser();
        Common.sleep(3000 + 1000 * Math.random());
        return res;
    },

    /**
     * 视频评论
     * @param {string} msg 
     * @returns {boolean}
     */
    commentMsg(msg) {
        if (UiSelector().className('android.widget.TextView').descContains('仅作者的好友可评论').isVisibleToUser(true).findOne()) {
            Log.log('仅作者的好友可评论');
            return;
        }

        let iptTag = Common.id('editor_holder_text').isVisibleToUser(true).findOnce();

        try {
            iptTag.parent().click();
            Common.sleep(1500 + 500 * Math.random());
        } catch (e) {
            Log.log(e);
        }

        iptTag = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).isVisibleToUser(true).findOne()
        //获取是否评论图片
        Log.log("带图评论概率：" + storage.get("setting_comment_with_photo", "int"));
        if (storage.get("setting_comment_with_photo", "int") > Math.random() * 100) {
            this.commentImage();
            // Common.click(iptTag);
            Common.sleep(100);
        }

        Log.log('msg', msg);
        iptTag.setText(msg);
        Common.sleep(500 + Math.random() * 1000);
        statistics.comment();
        //查看dg0位置有没有下来
        let btnTag = UiSelector().className('android.widget.Button').desc('发送').isVisibleToUser(true).findOne();
        let res = btnTag.click();
        Common.sleep(1500 + 1500 * Math.random());
        return res;
    },

    /**
     * 评论收藏图片
     * @returns {boolean}
     */
    commentImage() {
        let imgTagParent = Common.id('emotion_bottom_tab').isVisibleToUser(true).findOne();
        let imgTag = imgTagParent.children().getChildren(1);
        Log.log(imgTag);

        if (!imgTag) {
            Log.log('异常，没有看到表情按钮');
            return;
        }

        Log.log("表情呢", imgTag);
        imgTag.click();
        Common.sleep(2000 + 500 * Math.random());

        console.log("开始找表情");
        let imgs = Common.id('emotion_img').desc('表情').isVisibleToUser(true).find();

        console.log("表情数量：" + imgs.length);
        let rand = Math.round(Math.random() * (imgs.length - 1));
        console.log('点击第几个：' + rand);
        console.log(imgs[rand]);

        if (rand == 0) {
            rand = 1;
        }
        let res = imgs[rand].parent().click();
        Common.sleep(1000);
        return res;
    },
}

module.exports = Comment;
