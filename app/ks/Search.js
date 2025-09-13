let tCommon = require('app/ks/Common.js');
// let KsUser = require('app/ks/User.js');
let statistics = require('common/statistics.js');
let V = require('version/KsV.js');

let Search = {
    contents: [],
    userList(getAccounts, decCount, KsUser, DyComment, DyVideo, setAccount, getMsg, params) {
        let settingData = params.settingData;
        Log.log('开始执行用户列表');
        let rpCount = 0;
        let arr = [];
        let errorCount = 0;

        while (true) {
            let tags = tCommon.id(V.Common.userList[0]).isVisibleToUser(true).find();
            Log.log('tags', tags.length);
            if (tags.length === 0) {
                errorCount++;
                Log.log('containers为0');
            }

            arr.push(tags ? (tags[0] && tags[0]._addr) : null);
            if (arr.length >= 3) {
                arr.shift();
            }

            errorCount = 0;
            for (let i in tags) {
                let avatarTag = tags[i].children().findOne(tCommon.id(V.Common.userList[1]).isVisibleToUser(true));
                let nicknameTag = tags[i].children().findOne(tCommon.id(V.Common.userList[2]).isVisibleToUser(true));
                if (!nicknameTag || !avatarTag) {
                    Log.log('没有内容');
                    continue;
                }

                avatarTag.click();
                tCommon.sleep(2500 + 1000 * Math.random());

                //看看有没有视频，有的话，操作评论一下，按照20%的频率即可
                statistics.viewUser();
                let isPrivateAccount = KsUser.isPrivate();
                Log.log('是否是私密账号：' + isPrivateAccount);
                let account;
                try {
                    account = KsUser.getDouyin();
                } catch (e) {
                    Log.log('找不到昵称');
                    //看看是不是直播，是的话，下一个
                    if (tCommon.id(V.Live.viewCount[0]).isVisibleToUser(true).findOne()) {
                        Log.log('直播间');
                        tCommon.back(1, 1000);
                        tCommon.sleep(1000 * Math.random());
                        continue;
                    }
                    if (tCommon.id(V.Common.userList[0]).isVisibleToUser(true).findOne()) {
                        //应该是账号封禁了，没有点击进去，直接下一个
                        continue;
                    } else {
                        throw new Error(e);
                    }
                }
                if (isPrivateAccount || !account) {
                    tCommon.back();
                    tCommon.sleep(500);
                    if (decCount() <= 0) {
                        return true;
                    }
                    setAccount(account);
                    this.contents.push(account);
                    continue;
                }

                //查看粉丝和作品数是否合格
                let worksCount = KsUser.getWorksCount();
                if (worksCount < settingData.worksMinCount || worksCount > settingData.worksMaxCount) {
                    Log.log('作品数不符合', worksCount, settingData.worksMinCount, settingData.worksMaxCount);
                    setAccount(account);
                    tCommon.back();
                    tCommon.sleep(1000);
                    continue;
                }

                //查看粉丝和作品数是否合格
                let fansCount = 0;
                try {
                    fansCount = KsUser.getFansCount();
                } catch (e) {
                    Log.log(e);
                    continue;//大概率是没有点击进去
                }

                if (fansCount < settingData.fansMinCount * 1 || fansCount > settingData.fansMaxCount * 1) {
                    Log.log('粉丝数不符合', fansCount, settingData.fansMinCount, settingData.fansMaxCount);
                    setAccount(account);
                    tCommon.back();
                    tCommon.sleep(1000);
                    continue;
                }

                let nickname = KsUser.getNickname();

                if (Math.random() * 100 <= settingData.focusRate * 1) {
                    KsUser.focus();
                }

                if (Math.random() * 100 <= settingData.privateRate * 1) {
                    KsUser.privateMsg(getMsg(1, nickname, KsUser.getAge(), KsUser.getGender()).msg);
                }

                let commentRate = Math.random() * 100;
                let zanRate = Math.random() * 100;

                Log.log('即将进入视频', commentRate, zanRate);
                if ((settingData.isFirst || commentRate < settingData.commentRate * 1 || zanRate < settingData.zanRate * 1) && DyVideo.intoUserVideo()) {
                    //点赞
                    Log.log('点赞频率检测', zanRate, settingData.zanRate * 1);
                    if (settingData.isFirst || zanRate <= settingData.zanRate * 1) {
                        DyVideo.clickZan();
                    }

                    //随机评论视频
                    Log.log('评论频率检测', commentRate, settingData.commentRate * 1);
                    if (settingData.isFirst || commentRate <= settingData.commentRate * 1) {
                        let msg = getMsg(0, DyVideo.getContent());
                        if (msg) {
                            DyVideo.openComment(!!DyVideo.getCommentCount());
                            Log.log('开启评论窗口');
                            DyComment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                            Log.log('评论了');
                            tCommon.back(1, 800);//回到视频页面
                        }
                    }
                    Log.log('视频页面到用户页面')
                    tCommon.back(1, 800);//从视频页面到用户页面
                } else {
                    Log.log('未进入视频');
                }

                let r = decCount();
                settingData.isFirst = false;
                Log.log('r', r);
                if (r <= 0) {
                    return true;
                }

                setAccount(account);
                Log.log(account, getAccounts(account));
                this.contents.push(account);
                tCommon.back(1, 1000);//用户页到列表页
                if (!tCommon.id(V.Common.userList[0]).isVisibleToUser(true).findOnce()) {
                    tCommon.sleep(1000);
                    if (!tCommon.id(V.Common.userList[0]).isVisibleToUser(true).findOnce()) {
                        Log.log('没有看到列表，返回');
                        tCommon.back(1, 800);//偶尔会出现没有返回回来的情况，这里加一个判断
                    }
                }

                tCommon.sleep(500 + 500 * Math.random());
            }

            if (errorCount >= 3) {
                throw new Error('遇到3次错误');
            }

            if (arr[0] === arr[1]) {
                rpCount++;
            } else {
                rpCount = 0;
            }
            Log.log('rpCount', rpCount);

            if (rpCount >= 5) {
                return true;
            }

            if (!tCommon.id(V.Common.userList[0]).isVisibleToUser(true).findOnce()) {
                Log.log('没有看到列表，返回2');
                tCommon.back(1, 800);//偶尔会出现没有返回回来的情况，这里加一个判断
            }

            if (!tCommon.id(V.Common.userList[0]).isVisibleToUser(true).findOnce()) {
                Log.log('没有看到列表，返回2');
                tCommon.back(1, 800);//偶尔会出现没有返回回来的情况，这里加一个判断
            }

            tCommon.swipeSearchUserOp();
            tCommon.sleep(2000 + 1000 * Math.random());
        }
    },

    homeIntoSearchVideo(keyword){
        this.intoUserVideoPage(keyword);
    },

    //适配全版本支持
    /**
     * 
     * @param {*} keyword 
     * @param {*} type 默认进入视频，type为2进入用户页面
     */
    intoUserVideoPage(keyword, type) {
        let tag = UiSelector().className('android.widget.EditText').filter(v => v.isEditable()).isVisibleToUser(true).findOne();
        tag.setText(keyword);
        tCommon.sleep(2000 + 2000 * Math.random());
        let searchTag = UiSelector().className('android.widget.TextView').text('搜索').isVisibleToUser(true).findOne();
        tCommon.click(searchTag);
        System.setTimeWindowShow(false);
        tCommon.sleep(4000 + 2000 * Math.random());

        let imageFile = Images.capture();
        let arr;
        if (type == 2) {
            arr = Images.findTextPosition(imageFile, "用户");
        } else {
            arr = Images.findTextPosition(imageFile, "视频");
        }

        System.setTimeWindowShow(true);
        console.log(arr);
        tCommon.clickBounds(arr[0]);
        tCommon.sleep(2000 + 2000 * Math.random());

        let child;
        if (type == 2) {
            let container = UiSelector().className('android.widget.TextView').textContains('匹配').isVisibleToUser(true).findOne();
            if (!container) {
                return false;//没有匹配
            }
            child = container.parent().parent().parent();
        } else {
            let container = tCommon.id('container').isVisibleToUser(true).findOne();
            child = container.children().findOne(UiSelector().className('android.widget.ImageView').filter(v => {
                return v.bounds().width() > Device.width() / 3 && v.bounds().height() > Device.height() / 4;
            }));
        }

        tCommon.click(child);
        tCommon.sleep(3000 + 3000 * Math.random());
        //如果type为2，还需要进入用户视频
        if (type == 2) {
            let workTag = UiSelector().className('android.widget.ImageView').desc('作品').isVisibleToUser(true).findOne();
            tCommon.click(workTag);
            tCommon.sleep(3000 + 3000 * Math.random());
        }
    }
}

module.exports = Search;
