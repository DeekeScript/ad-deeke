let Common = require('app/ks/Common.js');
let statistics = require('common/statistics.js');

let Video = {
    /**
     * 下一个视频
     * @returns {boolean}
     */
    next() {
        let tag = UiSelector().className('androidx.viewpager.widget.ViewPager').filter(v => {
            return v.id();
        }).scrollable(true).isVisibleToUser(true).findOne();

        if (!tag) {
            throw new Error('滑动失败');
        }
        return tag.scrollForward();
    },

    /**
     * 获取视频赞控件
     * @returns {UiObject}
     */
    getZanTag() {
        let tag = UiSelector().descContains('点赞').clickable(true).isVisibleToUser(true).findOne();
        if (tag) {
            return tag;
        }

        throw new Error('没有找到赞标签');
    },

    /**
     * 获取视频赞数
     * @returns {number}
     */
    getZanCount() {
        let zan = this.getZanTag();
        Log.log('zan', zan);
        return Common.numDeal(zan.desc());
    },

    /**
     * 是否已点赞
     * @returns {boolean}
     */
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

    /**
     * 获取评论控件
     * @returns {UiObject}
     */
    getCommentTag() {
        let tag = UiSelector().descContains('评论').clickable(true).isVisibleToUser(true).findOne();
        if (tag) {
            return tag;
        }

        throw new Error('没有找到评论标签');
    },

    /**
     * 获取评论数
     * @returns {number}
     */
    getCommentCount() {
        let comment = this.getCommentTag();
        Log.log('comment', comment);
        return Common.numDeal(comment.desc());
    },

    /**
     * 评论  type 为true表示有评论数，否则为无评论数
     * @param {number} type 
     * @returns {boolean}
     */
    openComment(type) {
        let comment = this.getCommentTag();
        comment.click();
        if (type) {
            Common.sleep(2000 + 1500 * Math.random());
        } else {
            Common.sleep(2000 + 1000 * Math.random());
            if (UiSelector().className('android.widget.TextView').descContains('仅作者的好友可评论').isVisibleToUser(true).findOne()) {
                Log.log('仅作者的好友可评论，不需要返回');
                return true;
            }
            Common.back();
        }

        return true;
    },

    /**
     * 收藏控件
     * @returns {boolean}
     */
    getCollectTag() {
        let tag = UiSelector().className('android.widget.FrameLayout').descContains('收藏').isVisibleToUser(true).findOne();
        if (tag) {
            return tag;
        }

        throw new Error('没有找到收藏标签');
    },

    /**
     * 获取收藏数
     * @returns {number}
     */
    getCollectCount() {
        let collect = this.getCollectTag();
        Log.log('collect', collect);
        return Common.numDeal(collect.desc());
    },

    /**
     * 收藏
     * @returns {boolean}
     */
    collect() {
        let tag = this.getCollectTag();
        return tag.click();
    },

    /**
     * 是否收藏
     * @returns {boolean}
     */
    isCollect() {
        let tag = this.getCollectTag();
        return tag.isSelected();
    },

    /**
     * 获取分享控件
     * @returns {UiObject}
     */
    getShareTag() {
        let tag = UiSelector().className('android.widget.FrameLayout').descContains('分享').isVisibleToUser(true).findOne();
        if (tag) {
            return tag;
        }

        throw new Error('没有找到分享标签');
    },

    /**
     * 获取分享数量
     * @returns {number}
     */
    getShareCount() {
        let share = this.getShareTag();
        Log.log('share', share);
        return Common.numDeal(share.desc());
    },

    /**
     * 获取内容标签
     * @returns {UiObject}
     */
    getContentTag() {
        let tag = Common.id('element_caption_label').isVisibleToUser(true).findOnce();
        if (tag) {
            console.log("视频标题内容：", tag);
            return tag;
        }

        return false;//极端情况是可以没有内容的
    },

    /**
     * 获取内容
     * @returns {string}
     */
    getContent() {
        let tag = this.getContentTag();
        return tag ? tag.text() : '';
    },

    /**
     * 获取昵称tag
     * @returns {string}
     */
    getTitleTag() {
        let tag = Common.id('user_name_text_view').isVisibleToUser(true).findOnce();
        if (tag) {
            return tag;
        }
        throw new Error('找不到标题内容');
    },

    /**
     * 获取昵称
     * @returns {string}
     */
    getAtNickname() {
        return this.getTitleTag().text().replace('@', '');
    },

    /**
     * 获取时间
     * @returns {string}
     */
    getTimeTag() {
        let tag = Common.id('create_date_tv').isVisibleToUser(true).findOnce();
        if (tag) {
            return tag;//2025-10-17 11:34 · 发布于贵州
        }
        throw new Error('找不到标题内容');
    },

    /**
     * 获取日期时间
     * @returns {string}
     */
    getTime() {
        let str = this.getTimeTag().text();
        let matchs = str.match(/\d{4}-\d{2}-\d{2}( \d{2}:\d{2})*/);//匹配日期和日期时间
        return matchs ? matchs[0] : '';
    },

    /**
     * 是否直播中
     * @returns {boolean}
     */
    isLiving() {
        //两种方式，一种是屏幕上展示，一种是头像
        let tags = UiSelector().id('com.smile.gifmaker:id/slide_play_cdn_living_tip').isVisibleToUser(true).findOne();
        if (tags) {
            return true;
        }

        return false;
    },

    //有没有查看详情  有的话大概率是广告  广告的话，不能操作广告主
    viewDetail() {
        return false;
    },

    /**
     * 进入用户主页
     * @returns {boolean}
     */
    intoUserPage() {
        let head = this.getTitleTag();
        let res = head.click();
        Common.sleep(3000 + Math.random() * 1000);
        statistics.viewUser();//目标视频数量加1
        return res;
    },

    /**
     * 获取昵称
     * @returns {string}
     */
    getNickname() {
        return this.getAtNickname();
    },

    /**
     * 获取距离控件
     * @param {number} loop 
     * @returns {UiObject}
     */
    getDistanceTag(loop) {
        let tag = Common.id('label_text').isVisibleToUser(true).findOneBy(1000);//等待作用
        if (tag) {
            console.log("同城--", tag);
            return tag;
        }

        if (!loop) {
            return this.getDistanceTag(1);
        }

        if (loop) {
            return {
                text: () => {
                    return '100';//如果找不到，则设置为1000km，直接过滤掉
                }
            };
        }
    },

    /**
     * 获取视频距离
     * @returns {number}
     */
    getDistance() {
        let tag = this.getDistanceTag();
        let f = tag.text();
        if (f.indexOf('km') > 0 || f.indexOf('公里') > 0) {
            f = f.replace('公里', '').replace('km', '');
        } else if (f.indexOf('m') > 0) {
            f = parseInt(f) / 1000;//如果是米，转为公里
        } else {
            f = 100;//没有找到距离
        }

        if (isNaN(f)) {
            return 100;//默认100公里
        }
        return f;
    },

    /**
     * 获取视频时间控件
     * @returns {UiObject}
     */
    getInTimeTag() {
        let tag = Common.id('create_date_tv').isVisibleToUser(true).findOne();
        if (tag) {
            return tag;
        }

        return {
            text() {
                return '0分钟前';
            }
        }
    },

    /**
     * 获取视频创建时间
     * @returns {number}
     */
    getInTime() {
        let inTimeTag = this.getInTimeTag();
        let time = inTimeTag.text().replace('· ', '');
        let incSecond = 0;
        if (time.indexOf('分钟前') !== -1) {
            incSecond = time.replace('分钟前', '') * 60;
        } else if (time.indexOf('小时前') !== -1) {
            incSecond = time.replace('小时前', '') * 3600;
        } else if (time.indexOf('刚刚') !== -1) {
            incSecond = 0;
        } else if (time.indexOf('天前') !== -1) {
            incSecond = time.replace('天前', '') * 86400;
        } else if (time.indexOf('周前') !== -1) {
            incSecond = time.replace('周前', '') * 86400 * 7;
        } else if (time.indexOf('昨天') !== -1) {
            time = time.replace('昨天', '').split(':');
            incSecond = 86400 - time[0] * 3600 - time[1] * 60 + (new Date()).getHours() * 3600 + (new Date()).getMinutes() * 60;
        } else if (/[\d]{2}\-[\d]{2}/.test(time) || /[\d]{2}\月[\d]{2}日/.test(time)) {
            time = time.replace('日', '').replace('月', '-');
            time = (new Date()).getFullYear() + '-' + time;
            incSecond = Date.parse(new Date()) / 1000 - (new Date(time)).getTime() / 1000;//日期
        } else {
            time = time.replace('日', '').replace('月', '-').replace('年', '-');
            incSecond = Date.parse(new Date()) / 1000 - (new Date(time)).getTime() / 1000;//直接是日期
        }
        return incSecond;
    },

    /**
     * 获取视频信息
     * @param {boolean} isCity 
     * @param {Object} params 
     * @returns {Object}
     */
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

    /**
     * 获取进度条
     */
    getProcessBar() {
        return false;
    },

    intoUserVideo() {
        let workTag = Common.id('tab_text').textContains('作品').findOne();
        if (!workTag || Common.numDeal(workTag.text()) === 0) {
            return false;
        }


        let bottom = Device.height() - 200 - Math.random() * 300;
        let top = bottom - 400 - Math.random() * 200;
        let left = Device.width() * 0.1 + Math.random() * (Device.width() * 0.8);
        Gesture.swipe(left, bottom, left, top, 300);
        Common.sleep(2500);


        workTag = workTag.parent();
        if (workTag && !workTag.isSelected()) {
            Common.click(workTag);
            Log.log('点击workTag');
            Common.sleep(2000);
        }

        let containers = UiSelector().descContains('作品').className('android.widget.RelativeLayout').filter(v => {
            return v.desc().indexOf('置顶') === -1;
        }).clickable(true).isVisibleToUser(true).find();
        let videoIndex = 0;
        let baseZanCount = 1000000000;
        let res;

        //老视频好像没有这种容器，新视频适用这个模式
        if (containers.length > 0) {
            for (let i in containers) {
                let zanCount = parseInt(containers[i].desc().split('获赞数，')[1]);
                if (zanCount < baseZanCount) {
                    baseZanCount = zanCount;
                    videoIndex = i;
                }
            }

            Log.log('最小赞', baseZanCount);
            Log.log("容器", containers[videoIndex]);
            //注意，这里偶尔通过tag.click点不进去
            res = containers[videoIndex].click();
        }

        if (containers.length === 0) {
            return false;
        }

        Common.sleep(4000 + Math.random() * 1000);
        statistics.viewVideo();
        statistics.viewTargetVideo();
        return res;
    },

    videoSlow() {
        Common.sleep(1000 + Math.random() * 1000);
    },
}


module.exports = Video;
