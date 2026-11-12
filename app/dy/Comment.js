let Common = require('./Common.js');
let CommentNew = require('./CommentNew.js');
let storage = require('../../common/storage.js');
let statistics = require('../../common/statistics.js');
let Voice = require('../../service/Voice.js');

const Comment = {
    /** @type {UiObject|undefined}  */
    tag: undefined,//当前的tag标签
    /** @type {string[]}  */
    containers: [],//本次遍历的内容  主要用于去重
    isNew: false,
    /**
     * 返回头像控件
     * @param {UiObject} tag 
     * @returns Object
     */
    getAvatarTag(tag) {
        if (this.isNew) {
            if (tag) {
                return tag.children().findOne(UiSelector().className('android.widget.TextView').clickable(true));
            }

            // @ts-ignore
            return this.tag.children().findOne(UiSelector().className('android.widget.TextView').clickable(true));
        }

        if (tag) {
            return tag.children().findOne(Common.id('avatar'));
        }

        // @ts-ignore
        return this.tag.children().findOne(Common.id('avatar'));
    },

    /**
     * 返回昵称控件，也可以通过TextView的第一个的方式来返回，注意这个可以被点击，另外如果isVisibleToUser为false也能点击
     * @returns Object
     */
    getNicknameTag() {
        // @ts-ignore
        return this.tag.children().findOne(Common.id('title'));
    },

    /**
     * 返回评论内容控件
     * @returns Object
     */
    getContentTag() {
        // @ts-ignore
        return this.tag.children().findOne(Common.id('content'));
    },

    /**
     * 获取Ip控件
     * @returns object
     */
    getIpTag() {
        // @ts-ignore
        return this.tag.children().findOne(UiSelector().textContains(' · ').isVisibleToUser(true));
    },

    /**
     * 返回回复控件
     * @param {UiObject} tag 
     * @returns 
     */
    getBackTag(tag) {
        if (tag) {
            return tag.children().findOne(UiSelector().text('回复').filter(v => {
                return v.bounds().left > Device.width() / 4;
            }));
        }

        // @ts-ignore
        return this.tag.children().findOne(UiSelector().text('回复').filter(v => {
            return v.bounds().left > Device.width() / 4;
        }));
    },

    /**
     * 获取点赞控件  注意它的父控件可以直接使用click方法点击
     * @param {undefined|UiObject} tag 
     * @returns {UiObject}
     */
    getZanTag(tag) {
        if (tag) {
            return tag.children().findOne(UiSelector().descContains('赞'));
        }

        // @ts-ignore
        return this.tag.children().findOne(UiSelector().descContains('赞'));
    },

    /**
     * 是否是作者
     * @returns boolean
     */
    isAuthor() {
        // @ts-ignore
        return this.tag.children().findOne(UiSelector().text('作者')) ? true : false;
    },

    /**
     * 返回昵称
     * @returns string|false
     */
    getNickname() {
        let tag = this.getNicknameTag();
        if (tag) {
            return tag.text();
        }
        return false;
    },

    /**
     * 返回评论内容
     * @returns string|false
     */
    getContent() {
        let tag = this.getContentTag();
        if (tag) {
            return tag.text();
        }
        return false;
    },

    /**
     * 获取点赞数量
     * @returns number
     */
    getZanCount() {
        let tag = this.getZanTag(undefined);
        return tag ? Common.numDeal(tag.desc()) : 0;
    },

    /**
     * 是否已点赞
     * @returns boolean
     */
    isZan() {
        let tag = this.getZanTag(undefined);
        if (!tag) {
            return false;
        }
        return tag.desc().indexOf('已选中') !== -1;
    },

    /**
     * 点赞
     * @param {{tag:UiObject}} data 
     * @returns 
     */
    clickZan(data) {
        let zanTag = this.getZanTag(data.tag);
        zanTag && zanTag.parent() && zanTag.parent().click();
        statistics.zanComment();
        return true;
    },

    /**
     * 获取Ip 城市（省份）
     * @returns string
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
        return msg.replace(' · ', '');
    },

    /**
     * 往上滑
     * @returns boolean
     */
    swipeTop() {
        return Common.swipeCommentListOp(this.isNew);
    },

    isOld() {
        let tag = Common.id('avatar').isVisibleToUser(true).findOne();
        if (!tag) {
            return false;//没有avatar的表示是新的
        }
        return tag.className() == '按钮';//老的头像等于按钮
    },

    /**
     * 新方式的获取评论区
     * @returns {{tag:UiObject,nickname:string,content:string,isAuthor:boolean,isZan:boolean,ip:string}[]}
     */
    getListNew() {
        let items = CommentNew.getList();
        let contents = [];

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            this.tag = item.container;
            // 提取点赞信息
            let zanTag = item.container.children().findOne(UiSelector().className('android.view.View').descContains('赞'));
            let isZan = false;
            if (zanTag && zanTag.desc() && zanTag.desc().indexOf('已选中') !== -1) {
                isZan = true;
            }

            let zanCount = 0;
            if (zanTag && zanTag.desc()) {
                zanCount = Common.numDeal(zanTag.desc());
            }

            Log.log("nickname", item.nickname);
            let data = {
                nickname: item.nickname,
                content: item.content || undefined,
                date: item.date,
                zanCount: zanCount,
                isZan: isZan,
                isAuthor: false,
                ip: item.ip,
                tag: item.container,
            };
            Log.log("Data", data);

            if (!data.nickname) {
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
     * 返回评论内容（外层控件、昵称、评论内容、Ip、是否点赞、点赞数、作者）
     * @returns {{tag:UiObject,nickname:string,content:string,isAuthor:boolean,isZan:boolean,ip:string}[]}
     */
    getList() {
        let moreTag = UiSelector().text('已折叠部分评论').isVisibleToUser(true).findOne();
        if (moreTag) {
            Log.log('点击展开');
            Common.click(moreTag);
            Common.sleep(3000 + Math.random() * 1500);
        }

        if (!this.isOld()) {
            this.isNew = true;
            Log.log('isNew=true,使用新版本');
            return this.getListNew();
        }

        let contains = UiSelector().className('android.widget.FrameLayout').filter(v => {
            return !!(v.desc() && v.bounds().width() >= Device.width() - 10);
        }).isVisibleToUser(true).find();

        Log.log("数量：", contains.length);
        let contents = [];
        /** @type {any} */
        let data = {};

        for (let i in contains) {
            this.tag = contains[i];//主要给当前方法使用的，比如下面的this.getIp()方法等
            Log.log("tag", this.tag);
            data = {
                tag: contains[i],
                nickname: this.getNickname(),
                content: this.getContent(),
                zanCount: this.getZanCount(),
                isZan: this.isZan(),
                isAuthor: this.isAuthor(),
                ip: this.getIp(),
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
     * @returns boolean
     */
    closeCommentWindow() {
        // let closeTag = UiSelector().desc('关闭').isVisibleToUser(true).clickable(true).findOne();
        let closeTag = Common.id('back_btn').clickable(true).filter(v => {
            return v.bounds().left > Device.width() / 2;
        }).findOne();
        if (!closeTag) {
            return false;
        }
        return Common.click(closeTag, 0.2);
    },

    /**
     * 进入用户主页
     * @param {{tag:UiObject}} data 
     * @returns boolean
     */
    intoUserPage(data) {
        let headTag = this.getAvatarTag(data.tag);
        Log.log('headTag', headTag);
        let res = headTag.click();
        Common.sleep(3000 + 1000 * Math.random());
        return res;
    },

    /**
     * 回复
     * @param {{tag:UiObject}} data 
     * @param {string} msg 
     */
    backMsg(data, msg) {
        let backTag = this.getBackTag(data.tag);
        Log.log(backTag.bounds());
        backTag.click();
        Common.sleep(2500 + 500 * Math.random());

        let iptTag = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).isVisibleToUser(true).findOne();

        if (!iptTag) {
            Common.back(1, 1000, 0);
            Log.log('没有找到输入框');
            return true;
        }
        iptTag.setText(msg);
        Common.sleep(500 + Math.random() * 1000);

        let submitTag = UiSelector().className('android.widget.TextView').text('发送').isVisibleToUser(true).findOne();
        let res = Common.click(submitTag);
        Common.sleep(2000 * Math.random());
        return res;
    },

    /**
     * 评论视频
     * @param {string} msg 
     * @returns boolean
     */
    commentMsg(msg) {
        let iptTag = UiSelector().className('android.widget.EditText').isVisibleToUser(true).filter(v => {
            return v.isEditable();
        }).findOne();

        if (!iptTag) {
            iptTag = UiSelector().className('android.widget.TextView').textMatches(/[\s\S]+/).filter(v => {
                return v.bounds().bottom > Device.height() * 0.95;
            }).isVisibleToUser(true).findOne();
            Log.log('iptTag', iptTag);

            //作者仅允许粉丝评论,作者仅允许互关朋友评论,作者仅允许互相关注的人评论
            if (UiSelector().textContains('作者仅允许').filter(v => {
                return v.text().indexOf('作者仅允许') == 0;
            }).isVisibleToUser(true).findOne()) {
                Log.log('作者仅允许粉丝评论');
                return false;
            }
            iptTag = iptTag.parent();
        }

        //作者仅允许粉丝评论,作者仅允许互关朋友评论,作者仅允许互相关注的人评论
        if (UiSelector().textContains('作者仅允许').filter(v => {
            return v.text().indexOf('作者仅允许') == 0;
        }).isVisibleToUser(true).findOne()) {
            Log.log('作者仅允许粉丝评论');
            return false;
        }

        if (iptTag.isClickable()) {
            iptTag.click();
            Log.log('输入框点击成功');
        } else {
            Common.click(iptTag, 0.2);
            Log.log('输入框不能点击, 使用click 函数点击');
        }

        Common.sleep(1500 + 500 * Math.random());
        iptTag = UiSelector().className('android.widget.EditText').isVisibleToUser(true).filter(v => {
            return v.isEditable();
        }).findOne();

        //获取是否评论图片
        Log.log("带图评论概率：" + storage.get("setting_comment_with_photo", "int"));
        if (storage.get("setting_comment_with_photo", "int") >= Math.random() * 100) {
            this.commentImage();
            iptTag.click();
            Common.sleep(100);
        }

        Log.log('msg', msg);
        if (Voice.isOpen()) {
            let tag = UiSelector().desc('语音评论').isVisibleToUser(true).findOne();
            if (!tag) {
                FloatDialogs.toastLong('找不到语音评论按钮');
                Common.log('找不到语音评论按钮');
                if (UiSelector().text('发送').isVisibleToUser(true).findOne()) {
                    Common.back(1);
                    Common.log('返回');
                    return false;
                }
                return false;
            }
            Common.click(tag, 0.2);
            Common.log('点击语音评论');
            Common.sleep(1000 + 500 * Math.random());
            let voiceTag = UiSelector().className('android.widget.TextView').filter(v => {
                return v.bounds().top > Device.height() * 0.4 && ((v.text() && v.text().indexOf('按住') != -1 && v.text().indexOf('说话') != -1) || (v.desc() && v.desc().indexOf('按住') != -1 && v.desc().indexOf('说话') != -1));
            }).isVisibleToUser(true).findOne();
            if (!voiceTag) {
                FloatDialogs.toastLong('找不到"按住 说话"按钮');
                Common.log('找不到"按住 说话"按钮');
                return false;
            }
            Voice.tts(voiceTag, msg);
        } else {
            iptTag.setText(msg);
        }

        Common.sleep(500 + Math.random() * 1000);

        let btnTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).text('发送').findOne();
        Common.click(btnTag, 0.2);
        Common.sleep(500 + 500 * Math.random());
        statistics.comment();

        //查看dg0位置有没有下来
        iptTag = UiSelector().className('android.widget.EditText').isVisibleToUser(true).filter(v => {
            return v.isEditable();
        }).findOne();
        if (iptTag && iptTag.bounds().top < Device.height() * 2 / 3) {
            Common.back();
            Log.log("点击失败：返回");
        }

        Common.sleep(1000 + 1000 * Math.random());
        return true;
    },

    /**
     * 表情评论
     * @returns boolean
     */
    commentImage() {
        let imgTag = UiSelector().desc('表情').isVisibleToUser(true).findOne();
        Log.log("表情呢", imgTag);
        Common.click(imgTag, 0.2);
        Common.sleep(1500 + 1000 * Math.random());

        let customTag = UiSelector().desc('自定义表情').isVisibleToUser(true).findOne();
        if (!customTag) {
            Common.sleep(5000);
            customTag = UiSelector().desc('自定义表情').isVisibleToUser(true).findOne();
        }

        customTag.click();
        Common.sleep(1000 + 500 * Math.random());

        console.log("开始找表情");
        let imgs = UiSelector().className('android.widget.LinearLayout').descContains('自定义表情').filter(v => {
            return v.desc().indexOf('自定义表情') == 0;
        }).isVisibleToUser(true).find();
        if (imgs.length === 0) {
            return false;
        }

        console.log("表情数量：" + imgs.length);
        let rand = Math.round(Math.random() * (imgs.length - 1));
        console.log('点击第几个：' + rand);
        console.log(imgs[rand]);
        let res = imgs[rand].click();
        Common.sleep(1000);
        return res;
    },

    /**
     * 
     * @param {number} zanCount 
     * @param {string|undefined} meNickname 
     * @param {number} [maxZanCount] 评论已有点赞数高于该值时不点赞
     */
    zanComment(zanCount, meNickname, maxZanCount) {
        //随机点赞 评论回复
        /** @type {string[]} */
        let contains = [];//防止重复的
        let rps = 0;//大于2 则退出
        let opCount = 5;

        while (true) {
            Log.log('获取评论列表-开始');
            let comments = this.getList();
            Log.log('获取到了评论列表：' + comments.length);
            if (comments.length === 0) {
                break;
            }

            let rpCount = 0;
            for (let comment of comments) {
                //移除了comment.content
                if (contains.includes(comment.nickname)) {
                    rpCount++;
                    continue;
                }

                Log.log('是否作者？', comment.isAuthor, comment.nickname);
                if (comment.nickname === meNickname || comment.isAuthor) {
                    if (typeof maxZanCount === 'number') {
                        System.toast(comment.isAuthor ? '作者评论，不点赞' : '自己的评论，不点赞');
                    }
                    Log.log('作者或者自己忽略');
                    continue;
                }

                if (typeof maxZanCount === 'number' && comment.zanCount > maxZanCount) {
                    System.toast('评论点赞数超过限制：' + comment.zanCount + '，限制' + maxZanCount);
                    Log.log('评论点赞数超过限制，不点赞', comment.zanCount, maxZanCount);
                    continue;
                }

                rps = 0;//只要有一个不在列表，则清零
                contains.push(comment.nickname);

                Log.log('赞评论了哦', comment);
                try {
                    this.clickZan(comment);
                    Common.sleep(1000 + 1000 * Math.random());
                    // statistics.zanComment();//赞评论数量加1
                } catch (e) {
                    Log.log(e);
                }

                zanCount--;
                if (zanCount <= 0) {
                    break;
                }
            }

            if (rpCount === comments.length) {
                rps++;
            } else {
                opCount--;
            }

            if (rps >= 2 || opCount <= 0) {
                Log.log(rps + ':' + opCount);
                break;
            }

            Log.log('滑动评论');
            this.swipeTop();
            Common.sleep(2000 + 1000 * Math.random());
        }

        Log.log('返回了哦');
        Common.sleep(300);

        //漏洞修复  如果此时还在评论页面，则再一次返回
        this.closeCommentWindow();
        Common.sleep(500 + 500 * Math.random());
    }
}

module.exports = Comment;
