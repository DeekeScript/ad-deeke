let Common = require('app/dy/Common.js');
let statistics = require('common/statistics.js');

const Video = {
    /**
     * 滑动视频  （非fast模式下运行，否则视频划不动）
     * @returns {boolean}
     */
    next(fast) {
        //推荐页面滑动视频
        if (fast) {
            System.setAccessibilityMode('!fast');
        }
        let tag = UiSelector().id('com.ss.android.ugc.aweme:id/viewpager').desc('视频').scrollable(true).isVisibleToUser(true).findOne();
        if (!tag) {
            tag = UiSelector().id('com.ss.android.ugc.aweme:id/viewpager').filter(v => {
                //注意，这里的过滤，防止左滑进入用户页面
                return v.bounds().height() < Device.height();
            }).scrollable(true).className('androidx.viewpager.widget.ViewPager').isVisibleToUser(true).findOne();
        }
        let res = tag.scrollForward();
        if (fast) {
            System.setAccessibilityMode('fast');
        }
        return res;
    },

    /**
     * 获取点赞标签
     * @returns {object}
     */
    getZanTag() {
        let tag = UiSelector().className('android.widget.LinearLayout').descContains('点赞').clickable(true).isVisibleToUser(true).findOne();
        Log.log(tag);
        if (tag) {
            //900 1208 180 201
            console.log(tag.bounds().left, tag.bounds().top, tag.bounds().width(), tag.bounds().height());
            return tag;
        }

        throw new Error('没有找到赞标签');
    },

    /**
     * 获取点赞数量
     * @returns {number}
     */
    getZanCount() {
        let zan = this.getZanTag();
        return Common.numDeal(zan.desc());
    },

    /**
     * 是否已赞
     * @returns {boolean}
     */
    isZan() {
        let zan = this.getZanTag();
        return zan.desc().indexOf('已点赞') !== -1;
    },

    /**
     * 点赞
     * @returns {boolean}
     */
    clickZan() {
        let zanTag = this.getZanTag();
        if (zanTag) {
            let res = zanTag.click();
            statistics.zan();
            return res;
        }
        Log.log('点赞失败');
        return false;
    },

    /**
     * 获取评论标签
     * @returns {object}
     */
    getCommentTag() {
        let tag = UiSelector().className('android.widget.LinearLayout').descContains('评论').clickable(true).isVisibleToUser(true).findOne();
        Log.log("评论标签：：：", tag.desc(), tag);
        if (tag) {
            return tag;
        }

        throw new Error('没有找到评论标签');
    },

    /**
     * 获取评论数量
     * @returns {number}
     */
    getCommentCount() {
        let comment = this.getCommentTag();
        return Common.numDeal(comment.desc());
    },

    /*
     * 打开评论
     * @param {number} type
     * @returns {boolean}
     */
    openComment(type) {
        let comment = this.getCommentTag();
        let res = comment.click();
        if (type) {
            Common.sleep(2000 + 1500 * Math.random());
        } else {
            Common.sleep(2000 + 1000 * Math.random());
            Common.back();
        }

        return res;
    },

    /*
     * 获取收藏控件
     * @returns {object}
     */
    getCollectTag() {
        let tag = UiSelector().className('android.widget.LinearLayout').descContains('收藏').clickable(true).isVisibleToUser(true).findOne();
        if (tag) {
            return tag;
        }

        throw new Error('没有找到收藏标签');
    },

    /*
     * 获取收藏数量
     * @returns {number}
     */
    getCollectCount() {
        let collect = this.getCollectTag();
        return Common.numDeal(collect.desc());
    },

    /*
     * 收藏
     * @returns {boolean}
     */
    collect() {
        let tag = this.getCollectTag();
        return tag.click();
    },

    /*
     * 是否收藏
     * @returns {boolean}
     */
    isCollect() {
        let tag = this.getCollectTag();
        return tag.desc().indexOf('已收藏') !== -1;
    },

    /*
     * 分享控件获取
     * @returns {object}
     */
    getShareTag() {
        let tag = UiSelector().className('android.widget.LinearLayout').descContains('分享').clickable(true).isVisibleToUser(true).findOne();
        if (tag) {
            return tag;
        }

        throw new Error('没有找到分享标签');
    },

    /*
     * 获取分享数量
     * @returns {number}
     */
    getShareCount() {
        let share = this.getShareTag();
        return Common.numDeal(share.desc());
    },

    /*
     * 获取视频内容控件
     * @returns {object}
     */
    getContentTag() {
        let tag = Common.id('desc').isVisibleToUser(true).findOne();
        if (tag) {
            console.log("视频标题内容：", tag);
            return tag;
        }

        return false;//极端情况是可以没有内容的
    },

    /**
     * 获取视频内容
     * @returns {object}
     */
    getContent() {
        let tag = this.getContentTag();
        return tag ? tag.text() : '';
    },

    /**
     * 获取标题上方的昵称控件
     * @returns {object}
     */
    getTitleTag() {
        let tag = Common.id('title').isVisibleToUser(true).findOnce();
        if (tag) {
            return tag;
        }
        throw new Error('找不到标题内容');
    },

    /**
     * 获取标题上的昵称
     * @returns {string}
    */
    getAtNickname() {
        let tag = this.getTitleTag();
        if (!tag) {
            return false;
        }
        return this.getTitleTag().text().replace('@', '');
    },

    getAvatarTag() {
        let tag = Common.id('user_avatar').isVisibleToUser(true).findOnce();
        if (tag) {
            return tag;
        }
        throw new Error('找不到头像');
    },

    /**
     * 获取用户的视频的发布时间
     * @returns {object}
     */
    getTimeTag() {
        let tag = UiSelector().descContains('发布时间').isVisibleToUser(true).findOne();
        if (tag) {
            return tag;
        }
        throw new Error('找不到发布时间');
    },

    /**
     * 获取用户的视频的发布时间
     * @returns {string}
     */
    getTime() {
        //发布时间：2025-09-29 07:00 IP属地：湖北
        let tag = this.getTimeTag();
        return tag.desc().split(' IP属地')[0].replace('发布时间：', '');
    },

    /**
     * 是否直播中
     * @returns {string}
     */
    isLiving() {
        //两种方式，一种是屏幕上展示，一种是头像
        if (UiSelector().text('点击进入直播间').isVisibleToUser(true).findOne()) {
            return true;
        }

        console.log("直播1检测完成");
        let tag = UiSelector().descContains('直播中').filter((v) => {
            return v && v.bounds() && v.bounds().top > Device.height() / 7 && v.bounds().top < Device.height() * 0.7 && v.bounds().left > Device.width() * 0.8;
        }).isVisibleToUser(true).exists();

        console.log("直播2检测完成");
        return tag ? true : false;
    },

    /**
     * 有没有【点击查看、查看详情】 有的话大概率是广告  广告的话，不能操作广告主
     * @returns {boolean}
     */
    viewDetail() {
        let tags = UiSelector().descMatches('(查看|了解详情)').isVisibleToUser(true).findOne() || UiSelector().textMatches('(查看|了解详情)').isVisibleToUser(true).findOne();
        if (tags) {
            return true;
        }

        return false;
    },

    /**
     * 进入用户主页
     * @returns {boolean}
     */
    intoUserPage() {
        let nicknameTag = this.getTitleTag();
        Log.log(nicknameTag);
        let res = nicknameTag.click();
        Common.sleep(3000 + Math.random() * 1000);
        statistics.viewUser();//目标视频数量加1
        return res;
    },

    /**
     * 同城进入用户主页
     * @returns {boolean}
     */
    intoLocalUserPage() {
        let nicknameTag = this.getAvatarTag();
        Log.log(nicknameTag);
        let res = nicknameTag.click();
        Common.sleep(3000 + Math.random() * 1000);
        statistics.viewUser();//目标视频数量加1
        return res;
    },

    /**
     * 获取用户昵称  不再通过头像获取，因为经常出问题
     * @returns {string}
     */
    getNickname() {
        return this.getAtNickname();
    },

    /*
    * 获取距离
    * @param {boolean} loop
    * @returns {string}
    */
    getDistanceTag() {
        let tag = UiSelector().descMatches('[m|公里]').filter(v => {
            return !isNaN(v.desc().substring(0, 1));
        }).isVisibleToUser(true).findOne();

        console.log("同城--", tag ? '1' : '0', typeof (tag));
        if (tag) {
            console.log("同城--", tag);
            return tag;
        }

        return {
            desc: () => {
                return '100';//如果找不到，则设置为1000km，直接过滤掉
            }
        };
    },

    /**
     * 获取同城视频距离
     * @returns number
     */
    getDistance() {
        let tag = this.getDistanceTag();
        let f = parseFloat(tag.desc());
        if (tag.desc().indexOf('公里') !== -1 || tag.desc().indexOf('km') !== -1) {
            //公里，什么都不做
        } else if (tag.desc().indexOf('米') !== -1 || tag.desc().indexOf('m') !== -1) {
            f = f / 1000;
        }

        if (isNaN(f)) {
            return 100;//默认100公里
        }
        return f;
    },

    /**
     * 获取视频发布时间
     * @return {object}
     */
    getInTimeTag() {
        let tag = UiSelector().descContains('发布时间：').isVisibleToUser(true).findOne();
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
     * 获取视频发布时间 返回距离当前时间的秒数（过去）
     * @return {number}
     */
    getInTime() {
        let inTimeTag = this.getInTimeTag();
        let time = inTimeTag.desc().replace('发布时间：', '');
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
     * 获取视频的详细信息
     * @param {number} isCity 
     * @param {object} params 
     * @returns {object}
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
     * @return {object}
     */
    getProcessBar() {
        return UiSelector().desc('进度条').isVisibleToUser(true).findOne();
    },

    /**
     * 进入非顶置的最小赞视频
     * @return {boolean}
     */
    intoUserVideo() {
        let workTag = UiSelector().descContains('作品').clickable(true).className('androidx.appcompat.app.ActionBar$Tab').isVisibleToUser(true).findOne();
        if (!workTag || Common.numDeal(workTag.desc()) === 0) {
            return false;
        }

        let bottom = Device.height() - 200 - Math.random() * 300;
        let top = bottom - 400 - Math.random() * 200;
        let left = Device.width() * 0.1 + Math.random() * (Device.width() * 0.8);
        Gesture.swipe(left, bottom, left, top, 300);
        Common.sleep(2200 + 300 * Math.random());

        //这里需要判断是否是商家
        if (!workTag.isSelected()) {
            workTag.click();
            Log.log('点击workTag');
            Common.sleep(2000);
        }

        let containers = UiSelector().descMatches('(视频|图文)').className('android.view.View').filter(v => {
            return v.desc().indexOf('置顶') === -1;
        }).clickable(true).isVisibleToUser(true).find();
        let videoIndex = 0;
        let baseZanCount = 1000000000;
        let res;

        //老视频好像没有这种容器，新视频适用这个模式
        if (containers.length > 0) {
            for (let i in containers) {
                let zanCount = parseInt(containers[i].desc().split('点赞数')[1]);
                if (zanCount < baseZanCount) {
                    baseZanCount = zanCount;
                    videoIndex = i;
                }
            }

            Log.log('最小赞', baseZanCount);
            Log.log("容器", containers[videoIndex]);
            //注意，这里偶尔通过tag.click点不进去
            res = Common.click(containers[videoIndex]);
        } else {
            containers = UiSelector().id('com.ss.android.ugc.aweme:id/container').isVisibleToUser(true).find();
            if (containers.length > 0) {
                res = Common.click(containers[videoIndex]);
            }
        }

        if (containers.length === 0) {
            return false;
        }

        Common.sleep(4000 + Math.random() * 1000);
        statistics.viewVideo();
        statistics.viewTargetVideo();
        return res;
    },

    /**
     * 慢点
     * @returns {boolean}
     */
    videoSlow() {
        //Common.sleep(1000 + Math.random() * 1000);
        return true;
    },
}


module.exports = Video;
