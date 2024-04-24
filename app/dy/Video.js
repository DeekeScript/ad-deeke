import { Common } from 'app/dy/Common.js';
export const Video = {
    next() {
        let left = Device.width() * 0.2 + Device.width() * 0.7 * Math.random();
        let bottom = Device.height() * (0.7 - 0.10 * Math.random());
        let left2 = left + Math.random() * 50;
        let r = 100 * Math.random();
        let top = bottom - 300 - r;
        let duration = 100 + 30 * Math.random();

        Log.log("滑动参数：" + left + ":" + bottom + ":" + left2 + ":" + top + ":" + duration);
        Gesture.swipe(left, bottom, left2, top, duration);
        Common.sleep(300);
    },

    getZanTag() {
        let tag = Common.id('e3z').filter((v) => {
            return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().width() > 0;
        }).findOnce();
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
        return zan.desc().indexOf('已点赞') !== -1;
    },

    clickZan() {
        let zanTag = this.getZanTag();
        if (zanTag) {
            Common.click(zanTag);
            return true;
        }
        throw new Error('点赞失败');
    },

    getCommentTag() {
        let tag = Common.id('dms').filter((v) => {
            return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().width() > 0;
        }).findOnce();
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
        let tag = Common.id('dcx').filter((v) => {
            return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().width() > 0;
        }).findOnce();
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
        return tag.desc().indexOf('未选中') === -1;
    },

    getShareTag() {
        let tag = Common.id('tu3').filter((v) => {
            return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().width() > 0;
        }).findOnce();
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
        let tag = Common.id('desc').filter((v) => {
            return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().width() > 0;
        }).findOnce();
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
        let tag = Common.id('title').filter((v) => {
            return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().width() > 0;
        }).findOnce();
        if (tag) {
            return tag;
        }
        throw new Error('找不到标题内容');
    },

    getAtNickname() {
        return this.getTitleTag().text().replace('@', '');
    },

    getTimeTag() {
        let tag = Common.id('a=6').filter((v) => {
            return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().width() > 0;
        }).findOnce();
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
        let tags = Common.id('mdo').descContains('点击进入直播间').filter((v) => {
            return v.bounds() && (v.bounds().height() > 0 && v.bounds().top >= 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().width() > 0);
        }).exists();

        if (tags) {
            return true;
        }

        console.log("直播1检测完成");
        tags = Common.id('yz4').descContains('直播中').filter((v) => {
            return v.bounds() && (v.bounds().height() > 0 && v.bounds().top >= 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().width() > 0);
        }).exists();//Common.id('xpk')   Common.id('yz4')

        console.log("直播2检测完成");
        return tags ? true : false;
    },

    //头像查找经常出问题，这里做3次轮训
    getAvatar(times) {
        if (!times) {
            times = 1;
        }
        try {
            let name = 'user_avatar';
            let tag = Common.id(name).filter((v) => {
                return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().width() > 0;
            }).findOnce();
            if (tag) {
                return tag;
            }
            throw new Error('找不到头像' + times);
        } catch (e) {
            if (times < 3) {
                Log.log(Common.id(name).find());
                return this.getAvatar(++times);
            }
        }

        throw new Error('找不到头像');
    },

    getLivingAvatarTag() {
        let name = 'yz4';
        let tag = Common.id(name).clickable(true).descContains('直播中').filter((v) => {
            return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().width() > 0;
        }).findOnce();
        if (tag) {
            return tag;
        }
        throw new Error('找不到直播头像' + times);
    },

    getLivingNickname() {
        return this.getLivingAvatarTag().desc().replace('直播中', '');
    },

    //有没有查看详情  有的话大概率是广告  广告的话，不能操作广告主
    viewDetail() {
        //let name = 'k+t';//Common.id(name).find()
        let tags = new UiSelector().text('查看详情').descContains('查看详情').filter((v) => {
            return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().width() > 0;
        }).findOne();

        if (tags) {
            return true;
        }

        tags = new UiSelector().text('查看详情').filter((v) => {
            return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().width() > 0;
        }).findOne();
        return tags || false;
    },

    intoUserPage() {
        let head = this.getAvatar(3);
        Log.log(head);
        Common.click(head, 0.3);
        Common.sleep(2000 + Math.random() * 1000);
    },

    getNickname() {
        let avatar = this.getAvatar(3);
        return avatar.desc();
    },

    getDistanceTag(loop) {
        let name = 'p_j';
        if (loop) {
            name = 'qj3';
        }

        let tag = Common.id(name).filter((v) => {
            return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().width() > 0;
        }).findOne(1000);//比findOne更快
        if (tag) {
            return tag;
        }

        if (!loop) {
            return this.getDistanceTag(1);
        }

        if (loop) {
            return {
                text: () => {
                    return '10000';//如果找不到，则设置为1000km，直接过滤掉
                }
            };
        }
    },

    getDistance() {
        let tag = this.getDistanceTag();
        return tag.text().replace('>', '').replace('<', '').replace('公里', '').replace('km', '') * 1;
    },

    getInTimeTag() {
        let name = 'x19';
        let tag = Common.id(name).filter((v) => {
            return v.bounds() && v.bounds().top > 200 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0 && v.bounds().width() > 0;
        }).findOne(1000);

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
            // info.distance = this.getDistance();
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
        let workTag = new UiSelector().id('android:id/text1').descContains('作品').findOnce();
        if (Common.numDeal(workTag.text()) === 0) {
            return false;
        }

        let bottom = Device.height() - 200 - Math.random() * 300;
        let top = bottom - 400 - Math.random() * 200;
        let left = Device.width() * 0.1 + Math.random() * (Device.width() * 0.8);
        Gesture.swipe(left, bottom, left, top, 300);
        Common.sleep(2500);

        //这里需要判断是否是商家
        workTag = new UiSelector().id('android:id/text1').descContains('作品').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() > 0 && v.bounds().top < Device.height() - v.bounds().height();
        }).findOnce();
        if (workTag && !workTag.parent().isSelected()) {
            Common.click(workTag);
            Log.log('点击workTag');
            Common.sleep(2000);

            // press(workTag.bounds().centerX(), workTag.bounds().centerY(), 50);
            // //press(workTag.bounds().centerX(), workTag.bounds().centerY(), 50);
            // Common.sleep(3000);
        }

        let containers = Common.id('container').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() > 0 && v.bounds().top < Device.height() - v.bounds().height();
        }).find();

        if (containers.length === 0) {
            return false;
        }

        let videoIndex = null;
        let baseZanCount = 0;
        let jc = 0
        for (let i in containers) {
            if (isNaN(i)) {
                continue;
            }

            jc++
        }

        videoIndex = Math.floor(Math.random() * jc)

        Log.log('最小赞', baseZanCount);
        if (containers.length === 0 && baseZanCount === null) {
            return false;
        }

        if (!containers[videoIndex]) {
            return false;
        }

        Log.log(containers[videoIndex]);
        Common.click(containers[videoIndex], 0.2);
        Common.sleep(3000 + Math.random() * 1000);
        return true;
    },

    videoSlow() {
        Common.sleep(1000 + Math.random() * 1000);
    },

    //是否已关注
    isFocus() {
        return Common.id('hrg').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().left < Device.width() && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().height() > 0;
        }).findOnce() ? false : true;
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
