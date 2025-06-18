let Common = require('app/dy/Common.js');
let User = require('app/dy/User.js');
let statistics = require('common/statistics');
let V = require('version/V.js');
let Video = require('app/dy/Video.js');

const Search = {
    //type = 0 视频  type = 1 用户  需要先进入搜索页
    intoSearchList(keyword, type) {
        if (!type) {
            type = 0;
        }
        //开始搜索
        let iptTag = Common.id(V.Search.intoSearchList[0]).isVisibleToUser(true).findOneBy(5000);
        if (!iptTag) {
            throw new Error('没有找到输入框');
        }
        iptTag.setText(keyword);

        Common.sleep(1500);
        //找到搜索按钮
        let searchBtnTag = Common.id(V.Search.intoSearchList[1]).desc(V.Search.intoSearchList[2]).isVisibleToUser(true).findOnce();
        if (!searchBtnTag) {
            Log.log('新按钮');
            searchBtnTag = UiSelector().className('android.widget.TextView').text(V.Search.intoSearchList[2]).isVisibleToUser(true).findOne() || UiSelector().className('android.widget.TextView').text(V.Search.intoSearchList[2]).findOne();
            if (!searchBtnTag) {
                throw new Error('没有找到搜索点击按钮');
            }
        }

        Log.log('searchBtnTag', searchBtnTag);
        Common.click(searchBtnTag);
        Common.sleep(3000 + 2000 * Math.random());
        let videoTag;
        let rp = 3;
        while (!videoTag) {
            if (type === 0) {
                videoTag = Common.aId(V.Search.intoSearchList[5]).text(V.Search.intoSearchList[3]).isVisibleToUser(true).findOnce();
            } else if (type === 1) {
                videoTag = Common.aId(V.Search.intoSearchList[5]).text(V.Search.intoSearchList[4]).isVisibleToUser(true).findOnce();
            }

            if (rp-- <= 0 || videoTag) {
                break;
            }

            Common.swipeSearchTabToLeft();
            Common.sleep(1500);
        }

        if (!videoTag) {
            console.log('找不到用户tab');
            throw new Error('找不到视频或者用户tab;type=' + type);
        }

        console.log('进入用户或者视频：', videoTag);
        Common.click(videoTag, 0.2);
        Common.sleep(3000 + 2000 * Math.random());
    },

    //跟上面的方法基本相同，搜索链接进入视频  不需要点击搜索列表，系统自动跳转到对应视频
    intoSearchLinkVideo(keyword) {
        //开始搜索
        let iptTag = Common.id(V.Search.intoSearchLinkVideo[0]).findOneBy(3000);
        if (!iptTag) {
            throw new Error('没有找到输入框');
        }

        iptTag.setText(keyword);
        Common.sleep(1500);
        //找到搜索按钮
        let searchBtnTag = Common.id(V.Search.intoSearchLinkVideo[1]).desc(V.Search.intoSearchLinkVideo[2]).isVisibleToUser(true).findOnce();
        if (!searchBtnTag) {
            Log.log('新按钮');
            searchBtnTag = UiSelector().className('android.widget.TextView').text(V.Search.intoSearchLinkVideo[2]).isVisibleToUser(true).findOne() || UiSelector().className('android.widget.TextView').text(V.Search.intoSearchLinkVideo[2]).findOne();
            if (!searchBtnTag) {
                throw new Error('没有找到搜索点击按钮');
            }
        }

        Log.log('searchBtnTag', searchBtnTag);
        Common.click(searchBtnTag);
        Common.sleep(5000 + 2000 * Math.random());
        return true;
    },

    //从列表进入详情
    intoSearchVideo() {
        let descTag = Common.id(V.Search.intoSearchVideo[0]).isVisibleToUser(true).findOnce();
        if (descTag) {
            Common.click(descTag);
            return true;
        }

        let container = Common.id(V.Search.intoSearchVideo[1]).isVisibleToUser(true).findOnce();
        if (container) {
            Common.click(container);
            return true;
        }

        let titleTag = Common.id(V.Search.intoSearchVideo[2]).isVisibleToUser(true).findOnce();
        if (titleTag) {
            Common.click(titleTag);
            return true;
        }
        throw new Error('找不到视频输入');
    },

    //从搜索页进入用户主页
    intoSeachUser(keyword) {
        Log.log("开始寻找抖音号了哈", keyword);
        let userTag = UiSelector().descContains(V.Search.intoSeachUser[0] + keyword).isVisibleToUser(true).filter((v) => {
            return v && v.bounds() && v.bounds().left > 0 && v.bounds().top > 0;
        }).findOnce();

        if (!userTag) {
            userTag = UiSelector().descContains(V.Search.intoSeachUser[1]).descContains(keyword).isVisibleToUser(true).filter((v) => {
                return v && v.bounds() && v.bounds().left > 0 && v.bounds().top > 0;
            }).findOnce();
        }

        if (userTag) {
            Log.log('userTag', userTag.bounds(), userTag.bounds().width(), userTag.bounds().height());
            Common.click(userTag);
            Common.sleep(2000 + 1000 * Math.random());
            return true;
        }

        throw new Error('找不到用户');
    },

    intoLiveRoom(douyin) {
        let tag = UiSelector().textContains(douyin).textContains(V.Search.intoUserLiveRoom[1]).filter((v) => {
            return v && v.bounds() && v.bounds().top >= 0 && v.bounds().left >= 0 && v.bounds().width() > 0 && v.bounds().height() > 0;
        }).isVisibleToUser(true).filter((v) => {
            return v && v._id == null;
        }).findOnce().parent();

        console.log(douyin, V.Search.intoUserLiveRoom[0]);
        console.log('找进入用户内容', tag);
        if (!tag) {
            return false;
        }

        //Common.click(tag);
        console.log('点击位置：', tag.bounds().left + 100 + 20 * Math.random(), tag.bounds().centerY() * 0.4 + tag.bounds().centerY() * 0.2 * Math.random());
        Gesture.click(tag.bounds().left + 100 + 20 * Math.random(), tag.bounds().top + tag.bounds().height() * 0.5 * Math.random());//头像高度实际低于parent一些
        Common.sleep(5000);
        return true;
    },

    backIntoHome() {
        Common.back(3);
        return true;
    },

    //主页进入搜索视频详情
    homeIntoSearchVideo(keyword) {
        Search.intoSearchList(keyword, 0);
        Search.intoSearchVideo();
    },

    //主页进入搜索用户页面
    homeIntoSearchUser(keyword) {
        if (keyword.indexOf('+') !== 0) {
            Search.intoSearchList(keyword, 1);
            Search.intoSeachUser(keyword);
        } else {
            keyword = keyword.substring(1);
            User.intoFocusList();
            Common.sleep(3000);
            User.focusListSearch(keyword);
        }
    },

    //进入搜索后的用户直播间
    intoUserLiveRoom(douyin, type) {
        this.intoSearchList(douyin, type);

        return this.intoLiveRoom(douyin);
    },

    //搜索，进入用户页面，再进入视频页面
    intoUserVideoPage(douyin, type) {
        this.intoSearchList(douyin, type);
        let topTag = Common.id(V.Search.userList[0]).isVisibleToUser(true).findOne();
        let tag = UiSelector().textContains(douyin).isVisibleToUser(true).filter((v) => {
            return v && v._id == null && v.bounds().top > topTag.bounds().top + topTag.bounds().height();
        }).findOnce()
        Log.log("进入搜索用户页面：", tag);
        if (!tag) {
            return false;
        }
        Common.click(tag);
        Common.sleep(2500);

        return Video.intoUserVideo();
    },

    contents: [],
    userList(getAccounts, decCount, DyUser, DyComment, DyVideo, setAccount, getMsg, params) {
        let settingData = params.settingData;
        Log.log('开始执行用户列表');
        let textTag = Common.id(V.Search.userList[0]).isVisibleToUser(true).findOnce();//需注意V.Search.userList不仅仅在当前方法使用
        let rpCount = 0;
        let arr = [];
        let errorCount = 0;
        let _top = textTag.bounds().top;
        let _height = textTag.bounds().height();

        while (true) {
            let tags = UiSelector().className(V.Search.userList[1]).isVisibleToUser(true).focusable(true).filter((v) => {
                return v && v.bounds() && v.bounds().left === 0 && v.bounds().top > _top + _height && v.bounds().top + v.bounds().height() < Device.height() && !!v.children() && !!v.children().findOne(UiSelector().textContains(V.Search.userList[2]));
            }).find();

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
                if (isNaN(i)) {
                    continue;
                }

                let child = tags[i].children().findOne(UiSelector().isVisibleToUser(true).textContains(V.Search.userList[2]));
                if (!child || !child.text()) {
                    continue;
                }

                if (child.bounds().top <= textTag.bounds().top + textTag.bounds().height()) {
                    continue;
                }

                let text = child.text().split(/[,|，]/);
                let account = text[2].replace(V.Search.userList[3], '').replace('按钮', '');
                Log.log(account, 'account');

                if (!account || this.contents.includes(account) || getAccounts(account)) {
                    continue;
                }

                try {
                    Common.click(child);//部分机型超出范围
                } catch (e) {
                    continue;
                }
                Common.sleep(2000 + 1000 * Math.random());

                //看看有没有视频，有的话，操作评论一下，按照20%的频率即可
                statistics.viewUser();
                let isPrivateAccount = DyUser.isPrivate();
                Log.log('是否是私密账号：' + isPrivateAccount);
                if (isPrivateAccount) {
                    Common.back();
                    Common.sleep(500);
                    if (decCount() <= 0) {
                        return true;
                    }
                    setAccount(account);
                    this.contents.push(account);
                    continue;
                }

                //查看粉丝和作品数是否合格
                let worksCount = DyUser.getWorksCount();
                if (worksCount < settingData.worksMinCount || worksCount > settingData.worksMaxCount) {
                    Log.log('作品数不符合', worksCount, settingData.worksMinCount, settingData.worksMaxCount);
                    setAccount(account);
                    Common.back();
                    Common.sleep(1000);
                    continue;
                }

                //查看粉丝和作品数是否合格
                let fansCount = 0;
                try {
                    fansCount = DyUser.getFansCount();
                } catch (e) {
                    Log.log(e);
                    continue;//大概率是没有点击进去
                }

                if (fansCount < settingData.fansMinCount * 1 || fansCount > settingData.fansMaxCount * 1) {
                    Log.log('粉丝数不符合', fansCount, settingData.fansMinCount, settingData.fansMaxCount);
                    setAccount(account);
                    Common.back();
                    Common.sleep(1000);
                    continue;
                }

                let nickname = DyUser.getNickname();

                if (Math.random() * 100 <= settingData.focusRate * 1) {
                    DyUser.focus();
                }

                if (Math.random() * 100 <= settingData.privateRate * 1) {
                    DyUser.privateMsg(getMsg(1, nickname, DyUser.getAge(), DyUser.getGender()).msg);
                }

                let commentRate = Math.random() * 100;
                let zanRate = Math.random() * 100;

                Log.log('即将进入视频', commentRate, zanRate);
                if ((settingData.isFirst || commentRate < settingData.commentRate * 1 || zanRate < settingData.zanRate * 1) && DyVideo.intoUserVideo()) {
                    //点赞
                    Log.log('点赞频率检测', zanRate , settingData.zanRate * 1);
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
                            Common.back(1, 800);//回到视频页面
                        }
                    }
                    Log.log('视频页面到用户页面')
                    Common.back(1, 800);//从视频页面到用户页面
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
                Common.back(1, 800);//用户页到列表页
                if (Common.id(V.Search.userList[4]).filter((v) => {
                    return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0;
                }).findOnce()) {
                    Common.back(1, 800);//偶尔会出现没有返回回来的情况，这里加一个判断
                }

                Common.sleep(500 + 500 * Math.random());
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

            Common.swipeSearchUserOp();
            Common.sleep(2000 + 1000 * Math.random());
        }
    }
}

module.exports = Search;
