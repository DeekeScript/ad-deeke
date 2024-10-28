let Common = require('app/dy/Common.js');
let statistics = require('common/statistics.js');
let V = require('version/V.js');

const Video = {
    next() {
        let left = Device.width() * 0.2 + Device.width() * 0.7 * Math.random();
        let bottom = Device.height() * (0.7 + 0.10 * Math.random());
        let left2 = left + Math.random() * 20;
        let r = 100 * Math.random();
        let top = Device.height() * (0.3 - 0.10 * Math.random());
        let duration = 100 + 30 * Math.random();

        Log.log("滑动参数：" + left + ":" + bottom + ":" + left2 + ":" + top + ":" + duration);
        Gesture.swipe(left, bottom, left2, top, duration);
        Common.sleep(600);
    },

    getZanTag() {
        let tag = Common.id(V.Video.getZanTag[0]).isVisibleToUser(true).findOnce();
        console.log(tag);
        if (tag) {
            return tag;
        }

        throw new Error('没有找到赞标签');
    },

    getZanCount() {
        let zan = this.getZanTag();
        return Common.numDeal(zan.desc());
    },

    isZan() {
        let zan = this.getZanTag();
        return zan.desc().indexOf(V.Video.isZan[0]) !== -1;
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

    getCommentTag() {
        let tag = Common.id(V.Video.getCommentTag[0]).isVisibleToUser(true).findOnce();
        Log.log("评论标签：：：", tag.desc(), tag);
        if (tag) {
            return tag;
        }

        throw new Error('没有找到评论标签');
    },

    getCommentCount() {
        let comment = this.getCommentTag();
        return Common.numDeal(comment.desc());
    },

    //评论  type 为true表示有评论数，否则为无评论数
    openComment(type) {
        let comment = this.getCommentTag();
        Common.click(comment);
        if (type) {
            Common.sleep(2000 + 1500 * Math.random());
        } else {
            Common.sleep(2000 + 1000 * Math.random());
            Common.back();
        }

        return true;
    },

    getCollectTag() {
        let tag = Common.id(V.Video.getCollectTag[0]).isVisibleToUser(true).findOnce();
        if (tag) {
            return tag;
        }

        throw new Error('没有找到收藏标签');
    },

    getCollectCount() {
        let collect = this.getCollectTag();
        return Common.numDeal(collect.desc());
    },

    collect() {
        let tag = this.getCollectTag();
        return Common.click(tag);
    },

    isCollect() {
        let tag = this.getCollectTag();
        return tag.desc().indexOf(V.Video.isCollect[0]) === -1;
    },

    getShareTag() {
        let tag = Common.id(V.Video.getShareTag[0]).isVisibleToUser(true).findOnce();
        if (tag) {
            return tag;
        }

        throw new Error('没有找到分享标签');
    },

    getShareCount() {
        let share = this.getShareTag();
        return Common.numDeal(share.desc());
    },

    getContentTag() {
        let tag = Common.id(V.Video.getContentTag[0]).isVisibleToUser(true).findOnce();
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

    getTitleTag() {
        let tag = Common.id(V.Video.getTitleTag[0]).isVisibleToUser(true).findOnce();
        if (tag) {
            return tag;
        }
        throw new Error('找不到标题内容');
    },

    getAtNickname() {
        return this.getTitleTag().text().replace(V.Video.getAtNickname[0], '');
    },

    getTimeTag() {
        let tag = Common.id(V.Video.getTimeTag[0]).isVisibleToUser(true).findOnce();
        if (tag) {
            return tag;
        }
        throw new Error('找不到标题内容');
    },

    getTime() {
        return this.getTimeTag().text();
    },

    //是否直播中
    isLiving() {
        //两种方式，一种是屏幕上展示，一种是头像
        let tags;
        if (App.getAppVersionCode('com.ss.android.ugc.aweme') < 310701) {
            tags = Common.id(V.Video.isLiving[0]).descContains(V.Video.isLiving[1]).filter((v) => {
                return v && v.bounds() && v.bounds().top > Device.height() / 7 && v.bounds().top < Device.height() * 0.8 && v.bounds().left > 0;
            }).isVisibleToUser(true).exists();
        } else {
            tags = Common.id(V.Video.isLiving[0]).textContains(V.Video.isLiving[1]).filter((v) => {
                return v && v.bounds() && v.bounds().top > Device.height() / 7 && v.bounds().top < Device.height() * 0.8 && v.bounds().left > 0;
            }).isVisibleToUser(true).exists();
        }
        if (tags) {
            return true;
        }

        console.log("直播1检测完成");
        tags = Common.id(V.Video.isLiving[2]).descContains(V.Video.isLiving[3]).filter((v) => {
            return v && v.bounds() && v.bounds().top > Device.height() / 7 && v.bounds().top < Device.height() * 0.7 && v.bounds().left > Device.width() * 0.8;
        }).isVisibleToUser(true).exists();//Common.id('xpk')   Common.id('yz4')

        console.log("直播2检测完成");
        return tags ? true : false;
    },

    //头像查找经常出问题，这里做3次轮训
    getAvatar(times) {
        if (!times) {
            times = 1;
        }
        try {
            let name = V.Video.getAvatar[0];
            let tag = Common.id(name).isVisibleToUser(true).findOnce();
            if (tag) {
                return tag;
            }
            throw new Error('找不到头像' + times);
        } catch (e) {
            if (times < 3) {
                Log.log(Common.id(V.Video.getAvatar[0]).find());
                return this.getAvatar(++times);
            }
        }

        throw new Error('找不到头像');
    },

    getLivingAvatarTag() {
        let tag = Common.id(V.Video.getLivingAvatarTag[0]).clickable(true).descContains(V.Video.getLivingAvatarTag[1]).filter((v) => {
            return v && v.bounds() && v.bounds().top > Device.height() / 7 && v.bounds().top < Device.height() * 0.8 && v.bounds().left > 0;
        }).isVisibleToUser(true).findOnce();
        if (tag) {
            return tag;
        }
        throw new Error('找不到直播头像' + times);
    },

    getLivingNickname() {
        return this.getLivingAvatarTag().desc().replace(V.Video.getLivingNickname[0], '');
    },

    //有没有查看详情  有的话大概率是广告  广告的话，不能操作广告主
    viewDetail() {
        let tags = UiSelector().text(V.Video.viewDetail[0]).descContains(V.Video.viewDetail[0]).isVisibleToUser(true).findOne();
        if (tags) {
            return true;
        }

        tags = UiSelector().text(V.Video.viewDetail[0]).isVisibleToUser(true).findOne();
        return tags || false;
    },

    intoUserPage() {
        let head = this.getAvatar(3);
        Log.log(head);
        Common.click(head, 0.3);
        Common.sleep(2000 + Math.random() * 1000);
        statistics.viewUser();//目标视频数量加1
    },

    getNickname() {
        let avatar = this.getAvatar(3);
        return avatar.desc();
    },

    getDistanceTag(loop) {
        let name = V.Video.getDistanceTag[0];
        if (loop) {
            name = V.Video.getDistanceTag[1];
        }

        let tag = Common.id(name).isVisibleToUser(true).findOneBy(1000);//等待作用
        console.log("同城--", tag ? '1' : '0', typeof (tag));
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

    getDistance() {
        let tag = this.getDistanceTag();
        let f = parseFloat(tag.text().toString().replace('>', '').replace('<', '').replace('公里', '').replace('km', ''));
        if (isNaN(f)) {
            return 100;//默认100公里
        }
        return f;
    },

    getInTimeTag() {
        let name = V.Video.getInTimeTag[0];
        let tag = Common.id(name).isVisibleToUser(true).findOneBy(1000);

        if (tag) {
            return tag;
        }

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
            // Log.log('同城数据2');
            // info.in_time = this.getInTime();
        }

        Log.log('同城数据结束', info);

        return info;
    },

    getProcessBar() {
        //        let tag = Common.id('zhj').findOnce();
        //        if (!tag) {
        //            return false;
        //        }
        //
        //        if (tag['info']['actions'] === 144205) {
        //            return true;
        //        }
        return false;
    },

    intoUserVideo() {
        let workTag = UiSelector().id(V.Video.intoUserVideo[0]).descContains(V.Video.intoUserVideo[1]).findOnce();
        if (Common.numDeal(workTag.text()) === 0) {
            return false;
        }

        let bottom = Device.height() - 200 - Math.random() * 300;
        let top = bottom - 400 - Math.random() * 200;
        let left = Device.width() * 0.1 + Math.random() * (Device.width() * 0.8);
        Gesture.swipe(left, bottom, left, top, 300);
        Common.sleep(2500);

        //这里需要判断是否是商家
        workTag = UiSelector().id(V.Video.intoUserVideo[0]).descContains(V.Video.intoUserVideo[1]).isVisibleToUser(true).findOnce();
        if (workTag && !workTag.parent().isSelected()) {
            Common.click(workTag);
            Log.log('点击workTag');
            Common.sleep(2000);
        }

        let containers = Common.id(V.Video.intoUserVideo[2]).isVisibleToUser(true).filter((v) => {
            return v && v.bounds().width() <= Device.width() / 3;
        }).find();
        if (containers.length === 0) {
            return false;
        }

        let videoIndex = null;
        let baseZanCount = 0;
        let jc = 0
        // for (let i in containers) {
        //     if (isNaN(i)) {
        //         continue;
        //     }

        //     //置顶的返回
        //     Log.log("判断是否有置顶");
        //     Log.log(Common.id(V.Video.intoUserVideo[3]).find());
        //     if (containers[i].children().findOne(Common.id(V.Video.intoUserVideo[3]))) {
        //         videoIndex = jc;
        //         Log.log("置顶了:" + videoIndex);
        //         break;
        //     }
        //     jc++
        // }

        let zhidingTag = Common.id(V.Video.intoUserVideo[3]).find();
        if (containers.length > zhidingTag.length) {
            videoIndex = zhidingTag.length;//点击第几个，这里不需要加1，因为控件是从0开始
        } else {
            videoIndex = 0;//没有置顶，或者都是置顶的的从0开始
        }

        //videoIndex = Math.floor(Math.random() * jc)
        //videoIndex = 0;//首部作品操作

        Log.log('最小赞', baseZanCount);
        if (containers.length === 0 && baseZanCount === null) {
            return false;
        }

        if (videoIndex == null || !containers[videoIndex]) {
            return false;
        }

        Log.log("容器", containers[videoIndex]);
        Common.click(containers[videoIndex], 0.2);
        Common.sleep(3000 + Math.random() * 1000);
        statistics.viewVideo();
        statistics.viewTargetVideo();
        return true;
    },

    videoSlow() {
        Common.sleep(1000 + Math.random() * 1000);
    },

    clickZanForNewVideo(count) {
        let nicks = [];
        let rp = 0;
        while (count--) {
            nicks.push(this.getContent());
            if (nicks.length > 2) {
                nicks.shift();
            }

            if (nicks[0] === nicks[1]) {
                count++;
                rp++;
            } else {
                rp = 0;
            }

            if (rp >= 3) {
                return false;
            }

            if (!this.isZan()) {
                this.clickZan();
                return true;
            }
            this.next();
        }
        return false;
    }
}


module.exports = Video;
