let Common = require('app/wx/Common.js');
let statistics = require('common/statistics.js');

let Video = {
    next() {
        let left = Device.width() * 0.2 + Device.width() * 0.7 * Math.random();
        let bottom = Device.height() * (0.7 + 0.10 * Math.random());
        let left2 = left + Math.random() * 20;
        let r = 100 * Math.random();
        let top = Device.height() * (0.3 - 0.10 * Math.random());
        let duration = 100 + 30 * Math.random();

        Log.log("滑动参数：" + left + ":" + bottom + ":" + left2 + ":" + top + ":" + duration);
        Gesture.swipe(left, bottom, left2, top, duration);
        Common.sleep(2000 + 1000 * Math.random());
    },

    getZanTag(index) {
        if (index === undefined) {
            index = 0;
        }

        let tag;
        if (index > 0) {
            tag = Common.id('ng5').findOnce();
            if (!tag || !tag.isVisibleToUser()) {
                throw new Error('-没有找到赞标签');
            }
        } else {
            tag = Common.id('ng3').isVisibleToUser(true).findOnce();
        }

        console.log(tag);
        if (tag) {
            //900 1208 180 201
            console.log(tag.bounds().left, tag.bounds().top, tag.bounds().width(), tag.bounds().height());
            return tag;
        }

        throw new Error('没有找到赞标签');
    },

    getZanCount() {
        let zan = this.getZanTag(1);
        return Common.numDeal(zan.text());
    },

    isZan() {
        let zan = this.getZanTag();
        return zan.isSelected();
    },

    clickZan() {
        let zanTag = this.getZanTag();
        if (zanTag) {
            //zanTag.click();
            Common.click(zanTag);
            statistics.zan();
            return true;
        }
        throw new Error('点赞失败');
    },

    getCommentTag(index) {
        if (index === undefined) {
            index = 0;
        }

        let tag;
        if (index > 0) {
            tag = Common.id('c6s').isVisibleToUser(true).findOnce();
            if (!tag || !tag.parent().isVisibleToUser()) {
                throw new Error('-没有找到评论标签');
            }
        } else {
            tag = Common.id('c79').isVisibleToUser(true).findOnce();
        }

        Log.log("评论标签：：：", index, tag);
        if (tag) {
            return tag;
        }

        throw new Error('没有找到评论标签');
    },

    getCommentCount() {
        let comment = this.getCommentTag(1);
        return Common.numDeal(comment.text());
    },

    //评论  type 为true表示有评论数，否则为无评论数
    openComment(type) {
        let comment = this.getCommentTag();
        Log.log('comment', comment, comment.bounds());
        Common.click(comment, 0.2);
        if (type) {
            Common.sleep(2000 + 1500 * Math.random());
        } else {
            Common.sleep(2000 + 1000 * Math.random());
            //Common.back();
        }

        return true;
    },

    getCollectTag(index) {
        if (index === undefined) {
            index = 0;
        }

        let tag;
        if (index > 0) {
            tag = Common.id('a_x').findOnce();
            if (!tag || !tag.isVisibleToUser()) {
                throw new Error('-没有找到收藏标签');
            }
        } else {
            tag = Common.id('i1g').isVisibleToUser(true).findOnce();
        }

        if (tag) {
            return tag;
        }

        throw new Error('没有找到收藏标签');
    },

    getCollectCount() {
        let collect = this.getCollectTag(1);
        return Common.numDeal(collect.text());
    },

    collect() {
        let tag = this.getCollectTag();
        return Common.click(tag);
    },

    isCollect() {
        let tag = this.getCollectTag();
        return tag.isSelected();
    },

    getShareTag(index) {
        if (index === undefined) {
            index = 0;
        }

        let tag;
        if (index > 0) {
            tag = Common.id('msw').findOnce();
            if (!tag || !tag.isVisibleToUser()) {
                throw new Error('-没有找到分享标签');
            }
        } else {
            tag = Common.id('msm').isVisibleToUser(true).findOnce();
        }

        if (tag) {
            return tag;
        }

        throw new Error('没有找到分享标签');
    },

    getShareCount() {
        let share = this.getShareTag(1);
        return Common.numDeal(share.text());
    },

    getContentTag() {
        let tag = Common.id('o45').isVisibleToUser(true).findOne();
        Log.log('视频标题内容', tag);
        if (tag) {
            console.log("视频标题内容：", tag);
            return tag;
        }

        return false;//极端情况是可以没有内容的
    },

    getContent() {
        let tag = this.getContentTag();
        return tag ? tag.text() : '';
    },

    //是否直播中
    isLiving() {
        let tags = UiSelector().textContains('进入直播间').isVisibleToUser(true).exists();
        if (tags) {
            return true;
        }

        return false;
    },

    //有没有查看详情  有的话大概率是广告  广告的话，不能操作广告主
    viewDetail() {
        return false;
    },

    getNicknameTag() {
        return Common.id('dzo').isVisibleToUser(true).findOne();
    },

    intoUserPage() {
        let head = this.getNicknameTag();
        Log.log(head);
        Common.click(head, 0.35);
        Common.sleep(3000 + Math.random() * 2000);
        statistics.viewUser();//目标视频数量加1
    },

    /**
     * 
     * @returns {string|null}
     */
    getNickname() {
        let tag = this.getNicknameTag();
        let focusTag = Common.id('gac').isVisibleToUser(true).findOne();
        let width = tag.bounds().width();
        if (focusTag) {
            width = tag.bounds().left - focusTag.bounds().left;
        }

        let image = Images.capture();
        let titles = Images.findTextInRegion(image, tag.bounds().left, tag.bounds().top, tag.bounds().width(), tag.bounds().height());
        return titles ? titles[0] : null;
    },

    getDistanceTag() {
        return {
            text: () => {
                return '100';//如果找不到，则设置为1000km，直接过滤掉
            }
        };
    },

    getDistance() {
        let tag = this.getDistanceTag();
        return parseInt(tag.text());
    },

    getInTimeTag() {
        return {
            text() {
                return '0分钟前';
            }
        }
    },

    getInTime() {
        let inTimeTag = this.getInTimeTag();
        let time = inTimeTag.text().replace('· ', '');
        let incSecond = 0;
        if (time.indexOf('分钟前') !== -1) {
            incSecond = parseInt(time.replace('分钟前', '')) * 60;
        } else if (time.indexOf('小时前') !== -1) {
            incSecond = parseInt(time.replace('小时前', '')) * 3600;
        } else if (time.indexOf('刚刚') !== -1) {
            incSecond = 0;
        } else if (time.indexOf('天前') !== -1) {
            incSecond = parseInt(time.replace('天前', '')) * 86400;
        } else if (time.indexOf('周前') !== -1) {
            incSecond = parseInt(time.replace('周前', '')) * 86400 * 7;
        } else if (time.indexOf('昨天') !== -1) {
            let times = time.replace('昨天', '').split(':');
            incSecond = 86400 - parseInt(times[0]) * 3600 - parseInt(times[1]) * 60 + (new Date()).getHours() * 3600 + (new Date()).getMinutes() * 60;
        } else if (/[\d]{2}\-[\d]{2}/.test(time) || /[\d]{2}\月[\d]{2}日/.test(time)) {
            time = time.replace('日', '').replace('月', '-');
            time = (new Date()).getFullYear() + '-' + time;
            incSecond = Date.now() / 1000 - (new Date(time)).getTime() / 1000;//日期
        } else {
            time = time.replace('日', '').replace('月', '-').replace('年', '-');
            incSecond = Date.now() / 1000 - (new Date(time)).getTime() / 1000;//直接是日期
        }
        return incSecond;
    },

    getInfo(isCity, params) {
        if (!params) {
            params = {};
        }

        let info = {
            zanCount: params && params['zanCount'] ? this.getZanCount() : 0,
            commentCount: params && params['commentCount'] ? this.getCommentCount() : 0,
            collectCount: params && params['collectCount'] ? this.getCollectCount() : 0,
            shareCount: params && params['shareCount'] ? this.getShareCount() : 0,
        }

        if (!params['nickname']) {
            info.nickname = this.getNickname();
        } else {
            info.nickname = params['nickname'];
        }

        if (!params['title']) {
            info.title = this.getContent();
        } else {
            info.title = params['title'];
        }

        Log.log('同城数据');
        if (isCity) {
            Log.log('同城数据1');
            info.distance = this.getDistance();
        }
        Log.log('同城数据结束', info);
        return info;
    },

    getProcessBar() {
        return false;
    },

    intoUserVideo() {
        return true;
    },

    videoSlow() {
        Common.sleep(1000 + Math.random() * 1000);
    },
}


module.exports = Video;
