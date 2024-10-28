let Common = require('app/dy/Common.js');
let statistics = require('common/statistics.js');
let V = require('version/V.js');

const User = {
    //保证执行的时候在哪个页面，执行完成也是哪个界面
    //返回false是失败，true是成功，-1是被封禁
    privateMsg(msg) {
        if (Common.id(V.User.privateMsg[0]).text(V.User.privateMsg[1]).findOnce()) {
            Log.log('私密账号');
            return false;
        }

        let settingTag;
        if (App.getAppVersionCode('com.ss.android.ugc.aweme') < 310701) {
            settingTag = Common.id(V.User.privateMsg[2]).desc(V.User.privateMsg[3]).isVisibleToUser(true).findOnce();
            if (!settingTag) {
                Log.log('找不到setting按钮');
                return false;
            }
        } else {
            settingTag = UiSelector().className(V.User.privateMsg[2]).desc(V.User.privateMsg[3]).isVisibleToUser(true).findOnce();
            if (!settingTag) {
                Log.log('找不到setting按钮');
                return false;
            }
        }

        Common.click(settingTag);
        Log.log("私信");
        Common.sleep(1000);

        let sendTag = Common.id(V.User.privateMsg[4]).text(V.User.privateMsg[5]).findOnce();
        if (!sendTag) {
            Log.log('找不到发私信按钮');
            return false;
        }

        Common.click(sendTag.parent());
        Common.sleep(2000);

        let textTag = Common.id(V.User.privateMsg[6]).findOnce();
        if (!textTag) {
            Log.log('找不到发私信输入框');//可能是企业号，输入框被隐藏了
            Common.back();
            return false;
        }
        Common.click(textTag);
        Common.sleep(500);

        textTag = Common.id(V.User.privateMsg[6]).findOnce();
        let iText = '';
        for (let i = 0; i < msg.length; i++) {
            iText = msg.substring(0, i + 1);
            textTag.setText(iText);
            Common.sleep(200 + 300 * Math.random());
        }

        Common.sleep(500);
        let sendTextTag = Common.id(V.User.privateMsg[7]).findOnce();
        if (!sendTextTag) {
            Log.log('发送消息失败');
            return false;
        }

        Common.click(sendTextTag);
        Common.sleep(1000);
        Log.log("私信发送完成");
        let closePrivateMsg = UiSelector().textContains(V.User.privateMsg[8]).findOneBy(1000);
        Log.log("私信被关闭了么？");
        if (closePrivateMsg) {
            Common.sleep(Math.random() * 1000);
            Common.back(2);
            Log.log("返回两次");
            return -1;
        }
        statistics.privateMsg();
        Common.sleep(Math.random() * 1000);
        Log.log("成功：返回2次");
        Common.back(2);
        return true;
    },

    getNickname() {
        //一般用户
        let i = 3;
        while (i--) {
            let nickname = Common.id(V.User.getNickname[0]).isVisibleToUser(true).findOnce();
            if (nickname && nickname.text()) {
                if (290701 <= App.getAppVersionCode('com.ss.android.ugc.aweme')) {
                    return nickname.text();
                }
                return nickname.text().replace(V.User.getNickname[1], '');
            }
            Common.sleep(200);
        }

        throw new Error('找不到昵称');
    },

    //机构 媒体等账号 公司
    isCompany() {
        return this.getDouyin() == this.getNickname();
    },

    getDouyin() {
        let douyin = Common.id(V.User.getDouyin[0]).isVisibleToUser(true).findOnce();
        if (douyin && douyin.text()) {
            return douyin.text().replace(V.User.getDouyin[1], '');
        }

        //部分机型ID不一样
        douyin = UiSelector().textContains(V.User.getDouyin[1]).findOnce();
        if (douyin && douyin.text()) {
            return douyin.text().replace(V.User.getDouyin[1], '');
        }

        //官方账号等等
        if (App.getAppVersionCode('com.ss.android.ugc.aweme') < 310701) {
            douyin = Common.id(V.User.getDouyin[2]).isVisibleToUser(true).findOnce();
            if (douyin && douyin.text()) {
                return douyin.text();
            }
        } else {
            douyin = Common.id(V.User.getDouyin[2]).isVisibleToUser(true).findOnce();
            if (douyin) {
                Log.log(douyin);
                douyin = douyin.findOne(UiSelector().textMatches("[\\s\\S]+"));
                Log.log(douyin);
                if (douyin && douyin.text()) {
                    return douyin.text();
                }
            }
        }

        return this.getNickname();
    },

    getZanCount() {
        let zan = Common.id(V.User.getZanCount[0]).findOnce();
        if (!zan || !zan.text()) {
            throw new Error('找不到赞');
        }

        return Common.numDeal(zan.text());
    },

    getFocusCount() {
        let focus = Common.id(V.User.getFocusCount[0]).findOnce();
        if (!focus) {
            throw new Error('找不到关注');
        }

        return Common.numDeal(focus.text());
    },

    getFansCount() {
        let fans = Common.id(V.User.getFansCount[0]).findOnce();
        if (!fans) {
            throw new Error('找不到粉丝');
        }

        return Common.numDeal(fans.text());
    },

    getIntroduce() {
        let tags = Common.id(V.User.getIntroduce[0]).findOnce().children().find(UiSelector().textMatches("[\\s\\S]+"));
        let text = '';
        if (!tags) {
            return text;
        }
        for (let i in tags) {
            if (tags[i].text().indexOf('IP：') === 0) {
                continue;
            } else if (/^[\d]+岁$/.test(tags[i].text())) {
                continue;
            } else if (tags[i].text() === '男' || tags[i].text() === '女') {
                continue;
            }
            text += "\n" + tags[i].text();
        }
        return text.substring(1);
    },

    getIp() {
        let tags = Common.id(V.User.getIp[0]).findOnce().children().find(UiSelector().textMatches("[\\s\\S]+"));
        let text = '';
        if (!tags) {
            return text;
        }
        for (let i in tags) {
            if (tags[i].text().indexOf('IP：') === 0) {
                return tags[i].text().replace('IP：', '');
            }
        }
        return text;
    },

    getAge() {
        let tags = Common.id(V.User.getAge[0]).findOnce().children().find(UiSelector().textMatches("[\\s\\S]+"));
        let text = 0;
        if (!tags) {
            return text;
        }
        for (let i in tags) {
            if (/^[\d]+岁$/.test(tags[i].text())) {
                return tags[i].text().replace('岁', '');
            }
        }
        return text;
    },

    getWorksTag() {
        let tags = Common.aId(V.User.getWorksTag[1]).textContains(V.User.getWorksTag[0]).findOnce();//rj5 或者 ptm
        console.log("tags", tags);
        if (!tags) {
            return {
                text: function () {
                    return 0;
                }
            }
        }
        console.log(tags);
        return tags;
    },

    getWorksCount() {
        let tag = this.getWorksTag();
        return Common.numDeal(tag.text());
    },

    openWindow() {
        //let file = UiSelector().textMatches([\\d]+件好物).findOnce();
        // let tag = Common.id('nee').findOnce();
        // if (!tag) {
        //     return false;
        // }
        // return tag.children().findOne(text('进入橱窗')) ? true : false;
        return false
    },

    //比较耗时，需要优化
    //比较耗时，需要优化
    getGender() {
        let genderTag = Common.id(V.User.getIp[0]).findOnce().children().findOne(UiSelector().descContains("男"));
        if (genderTag && genderTag.bounds().height() > 0 && genderTag.bounds().left > 0 && genderTag.bounds().top > 0) {
            return '1';
        }

        genderTag = Common.id(V.User.getIp[0]).findOnce().children().findOne(UiSelector().descContains("女"));
        if (genderTag && genderTag.bounds().height() > 0 && genderTag.bounds().left > 0 && genderTag.bounds().top > 0) {
            return '0';
        }

        return '2';
    },

    //是否是私密账号
    isPrivate() {
        Log.log("是否是私密账号？");
        if (UiSelector().text(V.User.isPrivate[0]).findOnce() ? true : false) {
            return true;
        }

        //帐号已被封禁
        if (UiSelector().textContains(V.User.isPrivate[1]).findOnce()) {
            return true;
        }

        //注销了
        if (UiSelector().textContains(V.User.isPrivate[2]).findOnce()) {
            return true;
        }

        Log.log("不是私密账号");
        return false;
    },

    isTuangouTalent() {
        // let tag = Common.id('nee').findOnce();
        // if (!tag) {
        //     return false;
        // }

        // return tag.children().findOne(text('团购推荐')) ? true : false;
        return false
    },

    isFocus() {
        let hasFocusTag = Common.id(V.User.isFocus[0]).text(V.User.isFocus[1]).findOnce() || Common.id(V.User.isFocus[0]).text(V.User.isFocus[2]).findOnce();
        if (hasFocusTag) {
            return true;
        }
        return false;
    },

    focus() {
        let focusTag = Common.id(V.User.focus[0]).findOnce();//.text('关注')  .text('回关')
        if (focusTag) {
            Common.click(focusTag);
            statistics.focus();
            return true;
        }

        let hasFocusTag = Common.id(V.User.focus[1]).text(V.User.focus[2]).findOnce() || Common.id(V.User.focus[1]).text(V.User.focus[3]).findOnce();
        if (hasFocusTag) {
            return true;
        }

        throw new Error('找不到关注和已关注');
    },

    cancelFocus() {
        let hasFocusTag = Common.id(V.User.cancelFocus[0]).findOnce();//text(已关注) || text(互相关注)
        if (hasFocusTag) {
            hasFocusTag.click();
            Common.sleep(500);

            //真正地点击取消
            let cancelTag = Common.id(V.User.cancelFocus[1]).text(V.User.cancelFocus[2]).findOnce();
            if (!cancelTag || cancelTag.bounds().top > Device.height() - 200) {
                let x = Math.random() * 500 + 100;
                Gesture.swipe(x, Device.height() / 2, x, 200, 200);
                Common.sleep(1000);
                cancelTag = Common.id(V.User.cancelFocus[1]).text(V.User.cancelFocus[2]).findOnce();
                if (!cancelTag) {
                    throw new Error('取消关注的核心按钮找不到');
                }
                Common.click(cancelTag);
                Common.sleep(1000 + Math.random() * 500);
                cancelTag = Common.id(V.User.cancelFocus[1]).text(V.User.cancelFocus[2]).findOneBy(1000);
                if (cancelTag) {
                    cancelTag.parent() ? cancelTag.parent().click() : Common.click(cancelTag);
                }
            } else {
                cancelTag.parent() ? cancelTag.parent().click() : Common.click(cancelTag);
            }
        }

        Common.sleep(2000);
        //私密账号会再次弹出“取消关注”的底部弹窗，需要再次点击
        let cancelBtn = UiSelector().text(V.User.cancelFocus[2]).findOne();
        console.log('私密账号', UiSelector().textContains(V.User.cancelFocus[2]).findOne());
        console.log(cancelBtn);

        if (cancelBtn) {
            Common.sleep(1000);
            cancelBtn.click();
            Common.sleep(1000);
        }

        let focusTag = Common.id(V.User.cancelFocus[3]).findOnce();//.text('关注') 或者回关
        if (focusTag) {
            return true;
        }

        throw new Error('找不到关注和已关注');
    },

    getUserInfo() {
        let res = {};
        res = {
            nickname: this.getNickname(),
            douyin: this.getDouyin(),
            age: this.getAge() || 0,
            // introduce: this.getIntroduce(),
            // zanCount: this.getZanCount(),
            // focusCount: this.getFocusCount(),
            // fansCount: this.getFansCount(),
            worksCount: 0,
            // openWindow: 0,//开启橱窗
            // tuangouTalent: this.isTuangouTalent(),
            // ip: this.getIp(),
            // isCompany: this.isCompany(),//是否是机构 公司
            gender: this.getGender(),
            isPrivate: this.isPrivate(),
        };

        if (res.isPrivate) {
            return res;
        }

        let newRes = {
            worksCount: this.getWorksCount(),
            // openWindow: this.openWindow(),
        };

        for (let i in newRes) {
            res[i] = newRes[i];
        }
        return res;
    },

    contents: [],
    cancelFocusList(machine) {
        let focus = Common.id(V.User.cancelFocusList[0]).findOnce();
        if (!focus) {
            throw new Error('找不到关注');
        }

        Gesture.click(focus.bounds().centerX(), focus.bounds().centerY());
        Common.sleep(5000);

        let focusCountTag = Common.id(V.User.cancelFocusList[1]).findOnce();
        if (!focusCountTag) {
            throw new Error('找不到focus');
        }

        let focusCount = Common.numDeal(focusCountTag.text());
        if (focusCount === 0) {
            return true;
        }

        let errorCount = 0;
        let loop = 0;
        let arr = [];
        while (true) {
            let containers = Common.id(V.User.cancelFocusList[2]).filter((v) => {
                return v && v.bounds() && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < Device.height();
            }).find();

            if (containers.length === 0) {
                errorCount++;
                Log.log('containers为0');
            }

            arr.push(containers ? (containers[0] && containers[0]._addr) : null);
            if (arr.length > 2) {
                arr.shift();
            }

            for (let i in containers) {
                if (isNaN(i)) {
                    continue;
                }
                let titleTag = containers[i].children().findOne(Common.id(V.User.cancelFocusList[3]));
                Log.log("获取_addr：" + titleTag._addr);
                if (!titleTag || this.contents.includes(titleTag.text())) {
                    continue;
                }

                Log.log(this.contents.length, this.contents.includes(titleTag.text()));
                let nickname = titleTag.text();

                let titleBarTag = Common.id(V.User.cancelFocusList[4]).findOnce();
                if (titleBarTag && titleTag.bounds().top <= titleBarTag.bounds().top + titleBarTag.bounds().height()) {
                    continue;
                }

                if (titleTag.bounds().height() < 0) {
                    continue;
                }

                let hasFocusTag = containers[i].children().findOne(Common.id(V.User.cancelFocusList[5]));
                if (!hasFocusTag) {
                    continue;
                }

                //第一种机型
                Log.log(machine.get('task_dy_cancel_focus_mutual_switch', 'bool'), hasFocusTag.text());
                if (hasFocusTag.text() === '已关注' || (machine.get('task_dy_cancel_focus_mutual_switch', 'bool') && hasFocusTag.text() === '互相关注')) {
                    let setting = containers[i].children().findOne(Common.id(V.User.cancelFocusList[6]));
                    Log.log('setting', setting);
                    if (!setting) {
                        Log.log('找不到focus setting-1');
                        errorCount++;
                        continue;
                    }

                    setting.click();
                    Common.sleep(1000);

                    let cancelTag = Common.id(V.User.cancelFocusList[7]).text(V.User.cancelFocusList[8]).filter((v) => {
                        return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height();
                    }).findOnce();
                    Common.click(cancelTag);
                } else if (hasFocusTag.text() !== V.User.cancelFocusList[9] && hasFocusTag.text() !== V.User.cancelFocusList[10]) {
                    //既不是“已关注”也不是“相互关注” 还不是“关注”  适配老机型
                    let setting = containers[i].children().findOne(Common.id(V.User.cancelFocusList[6]));
                    if (!setting) {
                        errorCount++;
                        Log.log('找不到focus setting');
                        continue;
                    }

                    Common.click(titleTag);
                    Common.sleep(1000);

                    let focusTag = UiSelector().text(V.User.cancelFocusList[11]).findOnce();
                    if (machine.get('task_dy_cancel_focus_mutual_switch', 'bool') && !focusTag) {
                        focusTag = UiSelector().text(V.User.cancelFocusList[9]).findOnce();
                    }

                    if (!focusTag) {
                        Common.back();
                        this.contents.push(nickname);
                        continue;
                    }

                    errorCount = 0;
                    this.cancelFocus();
                    Common.sleep(1500);
                    Common.back();
                }

                this.contents.push(nickname);
                Common.sleep(500);
            }

            if (errorCount >= 3) {
                throw new Error('遇到3次错误');
            }

            Log.log('滑动');
            Common.swipeFocusListOp();
            Common.sleep(1500);

            if (arr[0] === arr[1]) {
                loop++;
            } else {
                loop = 0;
            }

            if (loop >= 3) {
                return true;
            }
        }
    },

    fansIncListOp(contents, account, nickname, machine) {
        machine.set('task_dy_toker_fans_inc_main_' + account + '_' + nickname, true);
        contents.push(nickname);
        Common.sleep(500 + 500 * Math.random());
    },

    //快速涨粉
    fansIncList(getMsg, DyVideo, DyComment, machine, settingData, contents, meNickname) {
        let account;
        if (settingData && settingData.account) {
            account = settingData.account;
        }

        let times = 3;
        while (times--) {
            let fans = Common.id(V.User.fansIncList[0]).findOnce();
            if (!fans) {
                throw new Error('找不到粉丝');
            }

            Common.click(fans);
            Common.sleep(2000);
            fans = Common.id(V.User.fansIncList[0]).findOnce();
            if (fans) {
                continue;
            }
            break;
        }

        if (times <= 0) {
            return true;
        }

        let topTag = Common.id(V.User.fansIncList[1]).isVisibleToUser(true).findOnce();
        let errorCount = 0;
        let loop = 0;
        let arr = [];
        while (true) {
            let containers = Common.id(V.User.fansIncList[2]).isVisibleToUser(true).find();
            Log.log("containers长度：" + containers.length);

            if (containers.length === 0) {
                errorCount++;
                Log.log('containers为0');
            }

            arr.push(containers ? (containers[0] && containers[0]._addr) : null);
            if (arr.length >= 3) {
                arr.shift();
            }

            for (let i in containers) {
                Log.log("i:" + i + ":" + (isNaN(i) ? "yes" : "no"));
                if (isNaN(i)) {
                    continue;
                }

                let titleTag = containers[i].children().findOne(Common.id(V.User.fansIncList[3]));
                if (titleTag.bounds().top < topTag.bounds().top + topTag.bounds().height()) {
                    continue;
                }

                if (!titleTag || contents.includes(titleTag.text())) {
                    continue;
                }

                Log.log("title", titleTag.text());

                if (290701 != App.getAppVersionCode('com.ss.android.ugc.aweme')) {
                    if (containers[i].children().findOne(Common.id(V.User.fansIncList[4]))) {
                        //rp++;//是自己（从自己的粉丝页面搜索进入之后，第一个用户很可能是自己）
                        continue;
                    }
                }

                Log.log(contents.length, contents.includes(titleTag.text()));
                let nickname = titleTag.text();

                if (titleTag.bounds().height() < 0) {
                    continue;
                }

                if (machine.get('task_dy_toker_inc_main_' + account + '_' + nickname, 'bool')) {
                    Log.log('重复');
                    continue;
                }

                //进入用户首页
                let intoUserCount = 3;
                while (intoUserCount--) {
                    Common.click(titleTag);
                    Common.sleep(1500 + 1000 * Math.random());
                    try {
                        this.getNickname();
                    } catch (e) {
                        Log.log('点击进入失败', e);
                        continue;
                    }
                    break;
                }

                if (this.isPrivate()) {
                    Log.log('私密账号');
                    machine.set('task_dy_toker_focus_' + account + '_' + nickname, true);
                    Common.back();
                    Common.sleep(1000);
                    continue;
                }

                //查看是否休眠
                if (settingData.task_dy_fans_inc_user_page_wait > 0) {
                    Common.sleep(1000 * settingData.task_dy_fans_inc_user_page_wait);
                }

                let rateCurrent = Math.random() * 100;
                //查看是否头像点赞 id=pgn
                this.fansIncListOp(contents, account, nickname, machine);

                //注意31.7.0已经取消了头像赞
                Log.log("点击头像概率：" + settingData.task_dy_fans_inc_head_zan_rate);
                if (App.getAppVersionCode('com.ss.android.ugc.aweme') < 310701 && rateCurrent <= settingData.task_dy_fans_inc_head_zan_rate * 1) {
                    Log.log("准备点击头像");
                    let header = Common.id(V.User.fansIncList[5]).isVisibleToUser(true).findOne();
                    Log.log(header);
                    if (header) {
                        Common.click(header);
                        Common.sleep(1000);
                        let zanTag = Common.id(V.User.fansIncList[6]).textContains(V.User.fansIncList[7]).isVisibleToUser(true).findOne();
                        Common.click(zanTag);
                        Common.sleep(1000);
                        Common.back(1);
                        Common.sleep(1000);
                    }
                    Common.back();
                    Common.sleep(1000);
                    continue;
                }

                //查看粉丝和作品数是否合格
                let worksCount = 0;

                Log.log("获取作品数");
                try {
                    worksCount = this.getWorksCount() * 1;
                } catch (e) {
                    Log.log(e);
                }
                Log.log("debug", "作品数为：" + worksCount);

                if (worksCount == 0) {
                    Common.back();
                    Common.sleep(1000);
                    continue;
                }

                rateCurrent -= settingData.task_dy_fans_inc_head_zan_rate * 1;
                if (DyVideo.intoUserVideo()) {
                    Common.sleep(1000 * settingData.task_dy_fans_inc_user_video_wait * 1);//视频休眠
                    Log.log("视频休眠：" + settingData.task_dy_fans_inc_user_video_wait);//视频休眠
                    if (rateCurrent <= settingData.task_dy_fans_inc_video_zan_rate * 1) {
                        !DyVideo.isZan() && DyVideo.clickZan();
                        Common.sleep(1000);
                        Common.back(2);
                        Common.sleep(1000);
                        continue;
                    }

                    rateCurrent -= settingData.task_dy_fans_inc_video_zan_rate * 1;

                    if (rateCurrent <= settingData.task_dy_fans_inc_comment_rate * 1) {
                        let videoTitle = DyVideo.getContent();
                        DyVideo.openComment(!!DyVideo.getCommentCount());
                        DyComment.commentMsg(getMsg(0, videoTitle).msg);
                        Common.sleep(1000 + 1000 * Math.random());
                        DyComment.zanComment(Common, settingData.task_dy_fans_inc_comment_zan_count * 1, meNickname);
                        Common.sleep(1000);
                        Common.back(2);
                        Common.sleep(1000);
                        continue;
                    }

                    rateCurrent -= settingData.task_dy_fans_inc_comment_rate * 1;
                    if (rateCurrent <= settingData.task_dy_fans_inc_collection_rate * 1) {
                        DyVideo.collect();
                        Common.sleep(1000);
                        Common.back(2);
                        Common.sleep(1000);
                        continue;
                    }

                    Common.sleep(1000);
                    Common.back(2);
                    Common.sleep(1000);
                    continue;
                }
            }

            if (errorCount >= 3) {
                throw new Error('遇到3次错误');
            }

            Log.log('滑动');
            Common.swipeFansListOp();
            Common.sleep(1500);

            if (arr[0] === arr[1]) {
                loop++;
            } else {
                loop = 0;
            }
            Log.log('loop', loop);

            if (loop >= 3) {
                return true;
            }
        }
    },

    //type=0关注截流，type=1粉丝截流
    focusUserList(type, getMsg, DyVideo, DyComment, machine, settingData, contents, meNickname) {
        let account;
        if (settingData && settingData.account) {
            account = settingData.account
        } else {
            account = settingData
        }
        let times = 3;
        while (times--) {
            if (type === 0) {
                let focus = Common.id(V.User.focusUserList[0]).findOnce();
                if (!focus) {
                    throw new Error('找不到关注');
                }

                Common.click(focus);
                Common.sleep(2000);
                focus = Common.id(V.User.focusUserList[0]).findOnce();
                if (focus) {
                    continue;
                }
                break;
            } else {
                let fans = Common.id(V.User.focusUserList[1]).findOnce();
                if (!fans) {
                    throw new Error('找不到粉丝');
                }

                Common.click(fans);
                Common.sleep(2000);
                fans = Common.id(V.User.focusUserList[1]).findOnce();
                if (fans) {
                    continue;
                }
                break;
            }
        }

        if (times <= 0) {
            FloatDialogs.show(type === 0 ? '关注列表都已操作' : '粉丝列表都已操作');
            return false;//设置了隐私，不能操作
        }

        let topTag = Common.id(V.User.focusUserList[2]).isVisibleToUser(true).findOnce();
        let errorCount = 0;
        let loop = 0;
        let arr = [];
        while (true) {
            let containers = Common.id(V.User.focusUserList[3]).isVisibleToUser(true).find();
            Log.log("containers长度：" + containers.length);

            if (containers.length === 0) {
                errorCount++;
                Log.log('containers为0');
            }

            arr.push(containers ? (containers[0] && containers[0]._addr) : null);
            if (arr.length >= 3) {
                arr.shift();
            }

            errorCount = 0;

            for (let i in containers) {
                Log.log("i:" + i + ":" + (isNaN(i) ? "yes" : "no"));
                if (isNaN(i)) {
                    continue;
                }

                let titleTag = containers[i].children().findOne(Common.id(V.User.focusUserList[4]));
                if (titleTag.bounds().top < topTag.bounds().top + topTag.bounds().height()) {
                    continue;
                }

                if (!titleTag || contents.includes(titleTag.text())) {
                    continue;
                }

                Log.log("title", titleTag.text());

                if (containers[i].children().findOne(Common.id(V.User.focusUserList[5]))) {
                    //rp++;//是自己（从自己的粉丝页面搜索进入之后，第一个用户很可能是自己）
                    continue;
                }

                Log.log(contents.length, contents.includes(titleTag.text()));
                let nickname = titleTag.text();

                if (titleTag.bounds().height() < 0) {
                    continue;
                }

                if (machine.get('task_dy_toker_focus_' + account + '_' + nickname, 'bool')) {
                    Log.log('重复');
                    continue;
                }

                //进入用户首页
                let intoUserCount = 3;
                while (intoUserCount--) {
                    Common.click(titleTag);
                    Common.sleep(1500 + 1000 * Math.random());
                    try {
                        this.getNickname();
                    } catch (e) {
                        Log.log('点击进入失败', e);
                        continue;
                    }
                    break;
                }

                statistics.viewUser();

                if (this.isPrivate()) {
                    Log.log('私密账号');
                    machine.set('task_dy_toker_focus_' + account + '_' + nickname, true);
                    Common.back();
                    Common.sleep(1000);
                    continue;
                }

                //查看粉丝和作品数是否合格
                let worksCount = this.getWorksCount() * 1;
                if (worksCount < settingData.worksMinCount * 1 || worksCount > settingData.worksMaxCount * 1) {
                    Log.log('作品数不符合', worksCount, settingData.worksMinCount, settingData.worksMaxCount);
                    machine.set('task_dy_toker_focus_' + account + '_' + nickname, true);
                    Common.back();
                    Common.sleep(1000);
                    continue;
                }

                //查看粉丝和作品数是否合格
                let fansCount = 0;

                try {
                    fansCount = this.getFansCount() * 1;
                } catch (e) {
                    Log.log(e);
                    continue;
                }

                if (fansCount < settingData.fansMinCount * 1 || fansCount > settingData.fansMaxCount * 1) {
                    Log.log('粉丝数不符合', fansCount, settingData.fansMinCount, settingData.fansMaxCount);
                    machine.set('task_dy_toker_focus_' + account + '_' + nickname, true);
                    Common.back();
                    Common.sleep(1000);
                    continue;
                }

                if (Math.random() * 100 <= settingData.focusRate * 1) {
                    this.focus();
                }

                if (Math.random() * 100 <= settingData.privateRate * 1) {
                    this.privateMsg(getMsg(1, nickname, this.getAge(), this.getGender()).msg);
                }

                let commentRate = Math.random() * 100;
                let zanRate = Math.random() * 100;

                if ((commentRate <= settingData.commentRate * 1 || zanRate <= settingData.zanRate * 1) && DyVideo.intoUserVideo()) {
                    if (zanRate <= settingData.zanRate * 1) {
                        !DyVideo.isZan() && DyVideo.clickZan();
                    }

                    if (commentRate <= settingData.commentRate * 1) {
                        let videoTitle = DyVideo.getContent();
                        DyVideo.openComment(!!DyVideo.getCommentCount());
                        DyComment.commentMsg(getMsg(0, videoTitle).msg);
                        Common.sleep(1000 + 1000 * Math.random());
                        DyComment.zanComment(Common, 5, meNickname);
                    }

                    Common.back(1, 800);
                }

                machine.set('task_dy_toker_focus_' + account + '_' + nickname, true);
                settingData.opCount--;
                if (settingData.opCount <= 0) {
                    return true;
                }

                Common.back(1, 800);
                contents.push(nickname);
                if (Common.id(V.User.focusUserList[6]).isVisibleToUser(true).findOnce()) {
                    Common.back(1, 800);//偶尔会出现没有返回回来的情况，这里加一个判断
                }
                Common.sleep(500 + 500 * Math.random());
            }

            if (errorCount >= 3) {
                throw new Error('遇到3次错误');
            }

            Log.log('滑动');
            type === 1 ? Common.swipeFansListOp() : Common.swipeFocusListOp();
            Common.sleep(1500);

            if (arr[0] == arr[1]) {
                loop++;
            } else {
                loop = 0;
            }
            Log.log('loop', loop);

            if (loop >= 5) {
                return true;
            }
        }
    },

    //进入关注列表 我的，不是其他的关注列表
    intoFocusList() {
        let fans = Common.id(V.User.intoFocusList[0]).isVisibleToUser(true).findOnce();
        if (!fans) {
            throw new Error('找不到关注列表');
        }

        if (fans.text() == 0) {
            return false;
        }

        Gesture.click(fans.bounds().centerX(), fans.bounds().centerY());
        Common.sleep(2000);

        let focusCountTag = Common.id(V.User.intoFocusList[1]).findOnce();
        if (!focusCountTag) {
            throw new Error('找不到focusCountTag');
        }

        let focusCount = Common.numDeal(focusCountTag.text());
        if (focusCount === 0) {
            return false;
        }
        return true;
    },

    focusListSearch(keyword) {
        let searchBox = Common.id(V.User.focusListSearch[0]).isVisibleToUser(true).findOnce();
        Common.click(searchBox);
        Common.sleep(1000 + 1000 * Math.random());

        searchBox = Common.id(V.User.focusListSearch[0]).isVisibleToUser(true).findOnce();
        searchBox.setText(keyword);

        let nickTag = Common.id(V.User.focusListSearch[1]).text(keyword).findOnce();//昵称查找
        Log.log('nickTag', keyword, nickTag);
        if (!nickTag) {
            nickTag = Common.id(V.User.focusListSearch[2]).textContains(keyword).findOnce();//账号查找
            if (!nickTag) {
                return false;
            }
        }

        Common.click(nickTag);
        Common.sleep(3000);
        return true;
    },

    //粉丝回访
    viewFansList(nicknames) {
        let fans = Common.id(V.User.viewFansList[0]).isVisibleToUser(true).findOnce();
        if (!fans) {
            throw new Error('找不到粉丝');
        }

        Gesture.click(fans.bounds().centerX(), fans.bounds().centerY());
        Common.sleep(2000);

        let fansCountTag = Common.id(V.User.viewFansList[1]).findOnce();
        if (!fansCountTag) {
            throw new Error('找不到fans');
        }

        let fansCount = Common.numDeal(fansCountTag.text());
        if (fansCount === 0) {
            return true;
        }

        let errorCount = 0;
        let contents = [];
        let loop = 0;
        while (true) {
            let containers = Common.id(V.User.viewFansList[2]).filter((v) => {
                return v && v.bounds() && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < Device.height() - 200;
            }).find();

            if (containers.length === 0) {
                errorCount++;
                Log.log('containers为0');
            }

            let rp = 0;
            for (let i in containers) {
                if (isNaN(i)) {
                    continue;
                }
                let titleTag = containers[i].children().findOne(Common.id(V.User.viewFansList[3]));
                if (!titleTag || contents.includes(titleTag.text())) {
                    rp++;
                    continue;
                }

                Log.log(contents.length, contents.includes(titleTag.text()));
                let nickname = titleTag.text();

                if (nicknames.includes(nickname)) {
                    continue;
                }

                let titleBarTag = Common.id(V.User.viewFansList[4]).findOnce();
                if (titleBarTag && titleTag.bounds().top <= titleBarTag.bounds().top + titleBarTag.bounds().height()) {
                    continue;
                }

                if (titleTag.bounds().height() < 0) {
                    continue;
                }

                let rp = 3;
                while (rp--) {
                    Common.click(titleTag);
                    Common.sleep(1000);
                    Common.sleep(4000 * Math.random() + 2500);
                    Common.back();
                    Common.sleep(500);
                    break;
                }
                nicknames.push(nickname);
                contents.push(nickname);
            }

            if (errorCount >= 3) {
                throw new Error('遇到3次错误');
            }

            Log.log('滑动');
            Common.swipeFansListOp();
            Common.sleep(500);
            Log.log(rp, containers.length);
            if (rp === containers.length) {
                loop++;
            } else {
                loop = 0;
            }
            if (loop >= 3) {
                return true;
            }
        }
    },

    hasAlertInput() {
        if (290701 <= App.getAppVersionCode('com.ss.android.ugc.aweme')) {
            return false;
        }

        return Common.id(V.User.hasAlertInput[0]).findOne();
    },

    zanHead() {
        Log.log("准备点击头像");
        let header = Common.id(V.User.head[0]).isVisibleToUser(true).findOne();
        Log.log(header);
        if (header) {
            Common.click(header);
            Common.sleep(1000 + 1000 * Math.random());
            let zanTag = Common.id(V.User.head[1]).textContains(V.User.head[2]).isVisibleToUser(true).findOne();
            Common.click(zanTag);
            Common.sleep(1000);
            Common.back(1);
            Common.sleep(1000);
        } else {
            Common.back();
            Common.sleep(1000);
        }
    },

    intoLive() {
        let header = Common.id(V.User.head[0]).isVisibleToUser(true).findOne();
        Log.log(header);
        if (header) {
            Common.click(header);
            return true;
        }
        return false;
    },

    privateMsgCard(index) {
        if (Common.id(V.User.privateMsg[0]).text(V.User.privateMsg[1]).findOnce()) {
            Log.log('私密账号');
            return false;
        }

        let settingTag;
        if (App.getAppVersionCode('com.ss.android.ugc.aweme') < 310701) {
            settingTag = Common.id(V.User.privateMsg[2]).desc(V.User.privateMsg[3]).isVisibleToUser(true).findOnce();
            if (!settingTag) {
                Log.log('找不到setting按钮');
                return false;
            }
        } else {
            settingTag = UiSelector().className(V.User.privateMsg[2]).desc(V.User.privateMsg[3]).isVisibleToUser(true).findOnce();
            if (!settingTag) {
                Log.log('找不到setting按钮');
                return false;
            }
        }

        Common.click(settingTag);
        Log.log("私信");
        Common.sleep(1000);

        let sendTag = Common.id(V.User.privateMsg[4]).text(V.User.privateMsg[5]).findOnce();
        if (!sendTag) {
            Log.log('找不到发私信按钮');
            return false;
        }

        Common.click(sendTag.parent());
        Common.sleep(4000 + 2000 * Math.random());

        let tag = Common.id(V.User.more[0]).descContains(V.User.more[1]).findOnce();
        if (!tag) {
            Log.log('找不到“更多”');//点击更多，弹出“经营工具”
            Common.back();
            return false;
        }

        Common.click(tag);
        Common.sleep(500);

        let jingyingTag = Common.id(V.User.more[2]).textContains(V.User.more[3]).findOne();
        Common.click(jingyingTag);
        Common.sleep(4000 + 1200 * Math.random());

        let highTag = UiSelector().textContains(V.User.more[4]).descContains(V.User.more[4]).isVisibleToUser(true).findOne();
        Log.log(highTag);
        if (!highTag) {
            Log.log('没有找到高级在线预约');
            return false;
        }

        Log.log('点击高级在线预约');
        Common.click(highTag);
        Common.sleep(3000 + 1200 * Math.random());

        let cardsTag = UiSelector().textContains(V.User.more[5]).descContains(V.User.more[5]).isVisibleToUser(true).findOne();
        if (!cardsTag) {
            Log.log('没有卡片');
            return false;
        }

        Gesture.click(cardsTag.bounds().left + Device.width() / 2 * Math.random(), cardsTag.bounds().top - 160 * Math.random());
        Common.sleep(500 + 500 * Math.random());

        let sendTags = UiSelector().textContains(V.User.more[6]).descContains(V.User.more[6]).clickable(true).isVisibleToUser(true).findOne();
        if (!sendTags) {
            Log.log('没有发送按钮');
            return false;
        }

        Log.log(sendTags.bounds());
        Common.click(sendTags);
        Common.sleep(1000 + 1000 * Math.random());
    }
}

module.exports = User;
