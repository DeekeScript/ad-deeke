let Common = require('app/dy/Common.js');
let User = require('app/dy/User.js');
let statistics = require('common/statistics');
let Video = require('app/dy/Video.js');
let Comment = require('app/dy/Comment.js');

const Search = {
    contents: [],
    /**
     * type = 0 视频  type = 1 用户  需要先进入搜索页  2 综合
     * @param {string} keyword 
     * @param {number} type 
     * @returns 
     */
    intoSearchList(keyword, type) {
        if (!type) {
            type = 0;
        }

        //开始搜索
        let iptTag = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).isVisibleToUser(true).findOne();
        iptTag.setText(keyword);
        Common.sleep(1000 + 500 * Math.random());

        //找到搜索按钮
        let searchBtnTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).desc('搜索').findOne();
        Log.log('searchBtnTag', searchBtnTag);
        Common.click(searchBtnTag);
        Common.sleep(4000 + 2000 * Math.random());
        if (type == 2) {
            return true;
        }
        let videoTag;
        let rp = 3;
        while (!videoTag) {
            if (type === 0) {
                videoTag = UiSelector().id('android:id/text1').className('android.widget.Button').text('视频').findOne();
            } else if (type === 1) {
                videoTag = UiSelector().id('android:id/text1').className('android.widget.Button').text('用户').findOne();
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

    /**
     * 从搜索列表进入详情
     * @returns {boolean}
     */
    intoSearchVideo() {
        let descTag = UiSelector().id('com.ss.android.ugc.aweme:id/desc').className('android.widget.TextView').filter(v => {
            return v.text();
        }).isVisibleToUser(true).findOne();

        if (descTag) {
            Common.click(descTag);
            return true;
        }
        throw new Error('找不到视频输入');
    },

    /**
     * 从搜索页进入用户主页
     * @param {string} keyword 
     * @returns {boolean}
     */
    intoSeachUser(keyword) {
        Log.log("开始寻找抖音号了哈", keyword);
        let userTag = UiSelector().className('com.lynx.tasm.behavior.ui.LynxFlattenUI').descContains('抖音号：' + keyword).filter(v => {
            return v.bounds().width() < Device.width() / 2; //取短的这个，防止下面的点击把“关注”或者“发私信”点了
        }).isVisibleToUser(true).findOne();
        if (!userTag) {
            userTag = UiSelector().className('android.view.ViewGroup').descContains('关注').isVisibleToUser(true).findOne();
            if (!userTag) {
                loatDialogs.toast('找不到抖音号：' + keyword);
                return false;
            }
            let parent = userTag.parent();
            let centerX = parent.bounds().centerX() - 50;
            let height = parent.bounds().height();
            let top = parent.bounds().top;
            console.log('点击位置', centerX, top, height);
            let res = Gesture.click(centerX + 100 * Math.random(), top + height * Math.random());
            Common.sleep(2000 + 1000 * Math.random());
            return res;
        }

        Common.click(userTag);
        Common.sleep(2000 + 1000 * Math.random());
        return true;
    },

    /**
     * 搜索列表进入直播间
     * @param {string} douyin 
     * @returns {boolean}
     */
    intoLiveRoom(douyin) {
        let tag = UiSelector().className('com.lynx.tasm.behavior.ui.LynxFlattenUI').descContains(douyin).descContains('抖音号：').isVisibleToUser(true).findOnce();
        console.log(douyin);
        console.log('找进入用户内容', tag);
        if (!tag) {
            tag = UiSelector().className('android.view.ViewGroup').descContains('直播').isVisibleToUser(true).findOne();
            if (!tag) {
                FloatDialogs.toast('找不到抖音号：' + douyin);
                return false;
            }
        }

        if (tag.desc().indexOf('直播') == -1) {
            FloatDialogs.toast('找不到直播间');
            return false;
        }

        Log.log('点击位置：', tag.bounds().left + 100 + 20 * Math.random(), tag.bounds().centerY() * 0.4 + tag.bounds().centerY() * 0.2 * Math.random());
        Gesture.click(tag.bounds().left + 100 + 20 * Math.random(), tag.bounds().top + tag.bounds().height() * 0.5 * Math.random());//头像高度实际低于parent一些
        Common.sleep(7000 + 2000 * Math.random());
        return true;
    },

    /**
     * 主页进入搜索视频详情
     * @param {string} keyword 
     */
    homeIntoSearchVideo(keyword) {
        Search.intoSearchList(keyword, 0);
        Search.intoSearchVideo();
    },

    /**
     * 主页进入搜索用户页面
     * @param {string} keyword 
     */
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

    /**
     * 进入搜索后的用户直播间
     * @param {string} douyin 
     * @param {number} type 
     * @returns 
     */
    intoUserLiveRoom(douyin, type) {
        this.intoSearchList(douyin, type);
        return this.intoLiveRoom(douyin);
    },

    /**
     * 搜索，进入用户页面，再进入视频页面
     * @param {string} douyin 
     * @param {number} type 
     * @returns {boolean}
     */
    intoUserVideoPage(douyin, type) {
        this.intoSearchList(douyin, type);
        this.intoSeachUser(douyin);
        Common.sleep(3000);
        return Video.intoUserVideo();
    },

    /**
     * 
     * @param {function} getAccounts 
     * @param {function} decCount 
     * @param {function} setAccount 
     * @param {function} getMsg 
     * @param {object} params 
     * @returns {boolean}
     */
    userList(getAccounts, decCount, setAccount, getMsg, params) {
        let settingData = params.settingData;
        Log.log('开始执行用户列表');
        let errorCount = 0;

        let topTag = UiSelector().className('android.widget.HorizontalScrollView').isVisibleToUser(true).findOne();
        let minTop = topTag.bounds().top + topTag.bounds().height();
        while (true) {
            let tag = UiSelector().className('androidx.recyclerview.widget.RecyclerView').isVisibleToUser(true).findOne();
            let tags = tag.children().find(UiSelector().className('com.lynx.tasm.behavior.ui.LynxFlattenUI').isVisibleToUser(true).filter(v => {
                return v.desc() && v.desc().indexOf('粉丝') != -1 && v.bounds().top + v.bounds().height() > minTop + 5 && v.bounds().width() < Device.width() / 2;
            }).clickable(false));

            Log.log('tags', tags.length);
            if (tags.length === 0) {
                errorCount++;
                Log.log('containers为0');
            } else {
                errorCount = 0;
            }

            for (let i in tags) {
                if (tags[i].bounds().top + tags[i].bounds().height() > Device.height()) {
                    let top = tags[i].bounds().top + (Device.height() - tags[i].bounds().top) * Math.random();
                    Gesture.click(tags[i].bounds().left + tags[i].bounds().width() * Math.random(), top);
                } else if (tags[i].bounds().top > minTop) {
                    Common.click(tags[i]);
                } else {
                    let top = minTop + (tags[i].bounds().top + tags[i].bounds().height() - minTop) * Math.random();
                    Gesture.click(tags[i].bounds().left + tags[i].bounds().width() * Math.random(), top);
                }

                Common.sleep(3000 + 1500 * Math.random());
                //看看有没有视频，有的话，操作评论一下，按照20%的频率即可
                statistics.viewUser();
                let isPrivateAccount = User.isPrivate();
                let account = User.getDouyin();
                Log.log(account, 'account');
                if (!account) {
                    Log.log('点击没有进入');
                    continue;
                }

                if (this.contents.includes(account) || getAccounts(account)) {
                    Common.back();
                    Common.sleep(1000 + 500 * Math.random());
                    continue;
                }

                Log.log('是否是私密账号：' + isPrivateAccount);
                if (isPrivateAccount) {
                    Common.back();
                    Common.sleep(1000 + 500 * Math.random());
                    if (decCount() <= 0) {
                        return true;
                    }
                    setAccount(account);
                    this.contents.push(account);
                    continue;
                }

                //查看粉丝和作品数是否合格
                let worksCount = User.getWorksCount();
                if (worksCount < settingData.worksMinCount || worksCount > settingData.worksMaxCount) {
                    Log.log('作品数不符合', worksCount, settingData.worksMinCount, settingData.worksMaxCount);
                    setAccount(account);
                    Common.back();
                    Common.sleep(1000 + 500 * Math.random());
                    continue;
                }

                //查看粉丝和作品数是否合格
                let fansCount = 0;
                try {
                    fansCount = User.getFansCount();
                } catch (e) {
                    Log.log(e);
                    continue;//大概率是没有点击进去
                }

                if (fansCount < settingData.fansMinCount * 1 || fansCount > settingData.fansMaxCount * 1) {
                    Log.log('粉丝数不符合', fansCount, settingData.fansMinCount, settingData.fansMaxCount);
                    setAccount(account);
                    Common.back();
                    Common.sleep(1000 + 500 * Math.random());
                    continue;
                }

                let nickname = User.getNickname();

                if (Math.random() * 100 <= settingData.focusRate * 1) {
                    User.focus();
                }

                if (Math.random() * 100 <= settingData.privateRate * 1) {
                    User.privateMsg(getMsg(1, nickname, User.getAge(), User.getGender()).msg);
                }

                let commentRate = Math.random() * 100;
                let zanRate = Math.random() * 100;

                Log.log('即将进入视频', commentRate, zanRate);
                if ((commentRate < settingData.commentRate * 1 || zanRate < settingData.zanRate * 1) && Video.intoUserVideo()) {
                    //点赞
                    Log.log('点赞频率检测', zanRate, settingData.zanRate * 1);
                    if (zanRate <= settingData.zanRate * 1) {
                        Video.clickZan();
                    }

                    //随机评论视频
                    Log.log('评论频率检测', commentRate, settingData.commentRate * 1);
                    if ((commentRate <= settingData.commentRate * 1) && !UiSelector().text('作者仅允许互关朋友评论').isVisibleToUser(true).findOne()) {
                        let msg = getMsg(0, Video.getContent());
                        if (msg) {
                            Log.log('开启评论窗口');
                            Comment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                            Log.log('评论了');
                            Common.sleep(1000 + 500 * Math.random());//回到视频页面
                        }
                    }
                    User.backHome();
                } else {
                    Log.log('未进入视频');
                }

                let r = decCount();
                Log.log('r', r);
                if (r <= 0) {
                    return true;
                }

                setAccount(account);
                Log.log(account, getAccounts(account));
                this.contents.push(account);
                Common.back();
                Common.sleep(1000 + 500 * Math.random());//用户页到列表页
                if (!Common.aId('text1').text('用户').isVisibleToUser(true).findOne()) {
                    Common.back();//偶尔会出现没有返回回来的情况，这里加一个判断
                }
                Common.sleep(1000 + 500 * Math.random());
            }

            if (errorCount >= 3) {
                throw new Error('遇到3次错误');
            }

            if (!Common.swipeSearchUserOp()) {
                FloatDialogs.toast('操作完了');
                return true;
            }
            Common.sleep(2000 + 1000 * Math.random());
        }
    }
}

module.exports = Search;
