import { Common } from 'app/dy/Common.js';
export const User = {
    //保证执行的时候在哪个页面，执行完成也是哪个界面
    //返回false是失败，true是成功，-1是被封禁
    privateMsg(msg) {
        if (Common.id('title').text('私密账号').findOnce()) {
            Log.log('私密账号');
            return false;
        }

        let settingTag = Common.id('v0f').desc('更多').filter((v) => {
            return v && v.bounds() && v.bounds().top && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0 && v.bounds().left > 0;
        }).findOnce();

        if (!settingTag) {
            Log.log('找不到setting按钮');
            return false;
        }

        let clickCount = 3;
        let sendTag;
        while (clickCount--) {
            if (clickCount === 2 || !Common.id('cancel_btn').findOnce()) {
                Common.click(settingTag);
                Common.sleep(1000);
                if (clickCount !== 2) {
                    Log.log('找不到发私信按钮，重试 -_-');
                }
                settingTag = Common.id('v0f').desc('更多').findOnce();
                continue;
            }

            sendTag = Common.id('desc').text('发私信').findOnce();
            if (!sendTag) {
                sendTag = Common.id('desc').text('发私信').findOnce();
                Log.log('找不到发私信按钮，重试');
                Common.sleep(500);
                continue;
            }
        }

        if (!sendTag) {
            Log.log('找不到发私信按钮');
            return false;
        }

        Common.click(sendTag.parent());
        Common.sleep(2000);

        let textTag = Common.id('n-v').findOnce();
        if (!textTag) {
            Log.log('找不到发私信输入框');//可能是企业号，输入框被隐藏了
            Common.back();
            return false;
        }
        Common.click(textTag);

        textTag = Common.id('n-v').findOnce();
        msg = msg.split('');
        let input = '';
        for (let i in msg) {
            input += msg[i];
            textTag.setText(input);
            Common.sleep(100 + Math.random() * 200);
        }

        Common.sleep(1000);
        let sendTextTag = Common.id('j2').findOnce();
        if (!sendTextTag) {
            Log.log('发送消息失败');
            return false;
        }

        Common.click(sendTextTag);
        Common.sleep(1000);
        let closePrivateMsg = new UiSelector().textContains('私信功能已被封禁').findOne(1000);
        if (closePrivateMsg) {
            Common.sleep(Math.random() * 1000);
            Common.back(2);
            return -1;
        }
        Common.sleep(Math.random() * 1000);
        Common.back(2);
        return true;
    },

    getNickname() {
        //一般用户
        let i = 3;
        while (i--) {
            let nickname = Common.id('oth').filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0;
            }).findOnce();
            if (nickname && nickname.text()) {
                return nickname.text().replace("，复制名字", '');
            }
            Common.sleep(200);
        }

        throw new Error('找不到昵称');
    },

    //机构 媒体等账号 公司
    isCompany() {
        // if (Common.id('vrv').findOnce()) {
        //     return true;
        // }

        // if (Common.id('vjf').findOnce()) {
        //     return false;
        // }

        return false;
        //throw new Error('找不到是不是公司标签');
    },

    getDouyin() {
        let douyin = Common.id('y1j').findOnce();
        if (douyin && douyin.text()) {
            return douyin.text().replace("抖音号：", '');
        }

        //官方账号等等
        douyin = Common.id('y_7').findOnce();
        if (douyin && douyin.text()) {
            return douyin.text();
        }

        // douyin = Common.id('a2h').findOnce();//优质电商作者
        // if (douyin && douyin.text()) {
        //     return douyin.text();
        // }

        throw new Error('找不到抖音号');//
    },

    getZanCount() {
        let zan = Common.id('y=0').findOnce();
        if (!zan || !zan.text()) {
            throw new Error('找不到赞');
        }

        return Common.numDeal(zan.text());
    },

    getFocusCount() {
        let focus = Common.id('y=3').findOnce();
        if (!focus || !focus.text()) {
            throw new Error('找不到关注');
        }

        return Common.numDeal(focus.text());
    },

    getFansCount() {
        let fans = Common.id('y=7').findOnce();
        if (!fans || !fans.text()) {
            throw new Error('找不到粉丝');
        }

        return Common.numDeal(fans.text());
    },

    getIntroduce() {
        let tags = Common.getTags(Common.id('pgx').findOnce().children().find(new UiSelector().textMatches("[\\s\\S]+")));
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
        let tags = Common.getTags(Common.id('pgx').findOnce().children().find(new UiSelector().textMatches("[\\s\\S]+")));
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
        return 0;
        let tags = Common.getTags(Common.id('pgx').findOnce().children().find(new UiSelector().textMatches("[\\s\\S]+")));
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
        let tags = new UiSelector().textMatches("作品 [\\d]+").findOnce();//rj5 或者 ptm
        if (!tags || tags.length === 0) {
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
        //let file = new UiSelector().textMatches([\\d]+件好物).findOnce();
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
        return 3;
        let genderTag = new UiSelector().clickable(false).descContains('男').findOnce();
        if (genderTag && genderTag.bounds().height() > 0 && genderTag.bounds().left > 0 && genderTag.bounds().top > 0) {
            return 1;
        }

        genderTag = new UiSelector().clickable(false).descContains('女').findOnce();
        if (genderTag && genderTag.bounds().height() > 0 && genderTag.bounds().left > 0 && genderTag.bounds().top > 0) {
            return 2;
        }

        return 3;
    },

    //是否是私密账号
    isPrivate() {
        Log.log("是否是私密账号？");
        if (new UiSelector().text('私密账号').findOnce() ? true : false) {
            return true;
        }

        //帐号已被封禁
        if (new UiSelector().textContains('封禁').findOnce()) {
            return true;
        }

        //注销了
        if (new UiSelector().textContains('账号已经注销').findOnce()) {
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
        let hasFocusTag = Common.id('q1z').text('已关注').findOnce() || Common.id('q1z').text('互相关注').findOnce();
        if (hasFocusTag) {
            return true;
        }
        return false;
    },

    focus() {
        let focusTag = Common.id('q1y').findOnce();//.text('关注')  .text('回关')
        if (focusTag) {
            Common.click(focusTag);
            return true;
        }

        let hasFocusTag = Common.id('q1z').text('已关注').findOnce() || Common.id('q1z').text('互相关注').findOnce();
        if (hasFocusTag) {
            return true;
        }

        throw new Error('找不到关注和已关注');
    },

    cancelFocus() {
        let hasFocusTag = Common.id('q1z').findOnce();//text(已关注) || text(相互关注)
        if (hasFocusTag) {
            hasFocusTag.click();
            Common.sleep(500);

            //真正地点击取消
            let cancelTag = Common.id('l2+').text('取消关注').findOnce();
            if (!cancelTag || cancelTag.bounds().top > Device.height() - 200) {
                let x = Math.random() * 500 + 100;
                Gesture.swipe(x, Device.height() / 2, x, 200, 200);
                Common.sleep(1000);
                cancelTag = Common.id('l2+').text('取消关注').findOnce();
                if (!cancelTag) {
                    throw new Error('取消关注的核心按钮找不到');
                }
                Common.click(cancelTag);
                Common.sleep(1000 + Math.random() * 500);
                let cancelTag = Common.id('l2+').text('取消关注').findOne(1000);
                if (cancelTag) {
                    Common.click(cancelTag);
                }
            } else {
                Common.click(cancelTag);
            }
        }

        //私密账号的问题修复
        // let privateMsgTag = Common.id('bfr').filter((v) => {
        //     return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() + v.bounds().top < Device.height();
        // }).findOnce();
        // if (privateMsgTag) {
        //     Common.click(privateMsgTag);
        //     Common.sleep(500);
        // }

        let focusTag = Common.id('q1y').findOnce();//.text('关注') 或者回关
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
    cancelFocusList() {
        let focus = Common.id('y=7').findOnce();
        if (!focus) {
            throw new Error('找不到关注');
        }

        Gesture.click(focus.bounds().centerX(), focus.bounds().centerY());
        Common.sleep(2000);

        let focusCountTag = Common.id('yp-').findOnce();
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
            let containers = Common.id('root_layout').filter((v) => {
                return v && v.bounds() && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < Device.height() - 300;
            }).find();

            if (containers.length === 0) {
                errorCount++;
                Log.log('containers为0');
            }

            arr.push(containers ? (containers[0]?._addr) : null);
            if (arr.length > 2) {
                arr.shift();
            }

            for (let i in containers) {
                if (isNaN(i)) {
                    continue;
                }
                let titleTag = containers[i].children().findOne(Common.id('yq3'));
                if (!titleTag || this.contents.includes(titleTag.text())) {
                    continue;
                }

                Log.log(this.contents.length, this.contents.includes(titleTag.text()));
                let nickname = titleTag.text();

                let titleBarTag = Common.id('title_bar').findOnce();
                if (titleBarTag && titleTag.bounds().top <= titleBarTag.bounds().top + titleBarTag.bounds().height()) {
                    continue;
                }

                if (titleTag.bounds().height() < 0) {
                    continue;
                }

                let hasFocusTag = containers[i].children().findOne(Common.id('br+'));
                if (!hasFocusTag) {
                    continue;
                }

                //第一种机型
                if (hasFocusTag.text() === '已关注') {
                    let setting = containers[i].children().findOne(Common.id('n=y'));
                    if (!setting) {
                        Log.log('找不到focus setting-1');
                        errorCount++;
                        continue;
                    }

                    setting.click();
                    Common.sleep(1000);

                    let cancelTag = Common.id('title').text('取消关注').filter((v) => {
                        return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height();
                    }).findOnce();
                    Common.click(cancelTag);
                } else if (hasFocusTag.text() !== '相互关注' && hasFocusTag.text() !== '关注') {
                    //既不是“已关注”也不是“相互关注” 还不是“关注”  适配老机型
                    let setting = containers[i].children().findOne(Common.id('n=y'));
                    if (!setting) {
                        errorCount++;
                        Log.log('找不到focus setting');
                        continue;
                    }

                    Common.click(titleTag);
                    Common.sleep(1000);

                    let focusTag = new UiSelector().text('已关注').findOnce();
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
            let fans = Common.id('y=7').findOnce();
            if (!fans) {
                throw new Error('找不到粉丝');
            }

            Common.click(fans);
            Common.sleep(2000);
            fans = Common.id('y=7').findOnce();
            if (fans) {
                continue;
            }
            break;
        }

        if (times <= 0) {
            return true;
        }

        let topTag = Common.id('u-o').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0 && v.bounds().height() > 0;
        }).findOnce();

        let top = (topTag && (topTag.bounds().top + topTag.bounds().height())) || 400;
        let errorCount = 0;
        let loop = 0;
        let arr = [];
        while (true) {
            let containers = Common.id('root_layout').filter((v) => {
                return v && v.bounds() && v.bounds().top > top && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < Device.height();
            }).find();
            Log.log("containers长度：" + containers.length);

            if (containers.length === 0) {
                errorCount++;
                Log.log('containers为0');
            }

            arr.push(containers ? (containers[0]?._addr) : null);
            if (arr.length >= 3) {
                arr.shift();
            }

            for (let i in containers) {
                Log.log("i:" + i + ":" + (isNaN(i) ? "yes" : "no"));
                if (isNaN(i)) {
                    continue;
                }

                let titleTag = containers[i].children().findOne(Common.id('yq3'));
                if (!titleTag || contents.includes(titleTag.text())) {
                    continue;
                }

                Log.log("title", titleTag.text());

                if (containers[i].children().findOne(Common.id('r94'))) {
                    //rp++;//是自己（从自己的粉丝页面搜索进入之后，第一个用户很可能是自己）
                    continue;
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

                Log.log("点击头像概率：" + settingData.task_dy_fans_inc_head_zan_rate);
                if (rateCurrent <= settingData.task_dy_fans_inc_head_zan_rate * 1) {
                    Log.log("准备点击头像");
                    let header = Common.id('pgn').filter((v) => {
                        return v && v.bounds() && v.bounds().top > top && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < Device.height();
                    }).findOne();
                    if (header) {
                        Common.click(header);
                        Common.sleep(1000);
                        let zanTag = Common.id("l_f").textContains('点赞').filter((v) => {
                            return v && v.bounds() && v.bounds().top > top && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < Device.height();
                        }).findOne();
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
                let focus = Common.id('y=3').findOnce();
                if (!focus) {
                    throw new Error('找不到关注');
                }

                Common.click(focus);
                Common.sleep(2000);
                focus = Common.id('y=3').findOnce();
                if (focus) {
                    continue;
                }
                break;
            } else {
                let fans = Common.id('y=7').findOnce();
                if (!fans) {
                    throw new Error('找不到粉丝');
                }

                Common.click(fans);
                Common.sleep(2000);
                fans = Common.id('y=7').findOnce();
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

        let topTag = Common.id('u-o').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0 && v.bounds().height() > 0;
        }).findOnce();

        let top = (topTag && (topTag.bounds().top + topTag.bounds().height())) || 400;
        let errorCount = 0;
        let loop = 0;
        let arr = [];
        while (true) {
            let containers = Common.id('root_layout').filter((v) => {
                return v && v.bounds() && v.bounds().top > top && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < Device.height();
            }).find();
            Log.log("containers长度：" + containers.length);

            if (containers.length === 0) {
                errorCount++;
                Log.log('containers为0');
            }

            arr.push(containers ? (containers[0]?._addr) : null);
            if (arr.length >= 3) {
                arr.shift();
            }

            errorCount = 0;

            for (let i in containers) {
                Log.log("i:" + i + ":" + (isNaN(i) ? "yes" : "no"));
                if (isNaN(i)) {
                    continue;
                }

                let titleTag = containers[i].children().findOne(Common.id('yq3'));
                if (!titleTag || contents.includes(titleTag.text())) {
                    continue;
                }

                Log.log("title", titleTag.text());

                if (containers[i].children().findOne(Common.id('r94'))) {
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
                if (Common.id('v0f').filter((v) => {
                    return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0;
                }).findOnce()) {
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
        let fans = Common.id('vq7').filter((v) => {
            return v && v.bounds() && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().top > 0 && v.bounds().left > 0;
        }).findOnce();
        if (!fans) {
            throw new Error('找不到关注列表');
        }

        if (fans.text() == 0) {
            return false;
        }

        Gesture.click(fans.bounds().centerX(), fans.bounds().centerY());
        Common.sleep(2000);

        let focusCountTag = Common.id('u+m').findOnce();
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
        let searchBox = Common.id('gly').filter((v) => {
            return v && v.bounds() && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().top > 0 && v.bounds().left > 0;
        }).findOnce();
        Common.click(searchBox);
        Common.sleep(1000 + 1000 * Math.random());

        searchBox = Common.id('gly').filter((v) => {
            return v && v.bounds() && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().top > 0 && v.bounds().left > 0;
        }).findOnce();
        searchBox.setText(keyword);

        let nickTag = Common.id('yq3').text(keyword).findOnce();//昵称查找
        Log.log('nickTag', nickTag);
        if (!nickTag) {
            nickTag = Common.id('txt_desc').textContains(keyword).findOnce();//账号查找
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
        let fans = Common.id('y=w').filter((v) => {
            return v && v.bounds() && v.bounds().width() > 0 && v.bounds().height() > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().top > 0 && v.bounds().left > 0;
        }).findOnce();
        if (!fans) {
            throw new Error('找不到粉丝');
        }

        Gesture.click(fans.bounds().centerX(), fans.bounds().centerY());
        Common.sleep(2000);

        let fansCountTag = Common.id('xcr').findOnce();
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
            let containers = Common.id('root_layout').filter((v) => {
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
                let titleTag = containers[i].children().findOne(Common.id('yq3'));
                if (!titleTag || contents.includes(titleTag.text())) {
                    rp++;
                    continue;
                }

                Log.log(contents.length, contents.includes(titleTag.text()));
                let nickname = titleTag.text();

                if (nicknames.includes(nickname)) {
                    continue;
                }

                let titleBarTag = Common.id('title_bar').findOnce();
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
                    //                    titleTag = containers[i].children().findOne(Common.id('yq3'));
                    //                    if (titleTag) {
                    //                        continue;
                    //                    }
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

    getStep(oldArr, newArr) {
        // Log.log(oldArr, newArr);
        if (newArr.length === 0) {
            return oldArr.length;
        }

        let some = [];
        for (let i in newArr) {
            for (let j in oldArr) {
                if (oldArr[j] === newArr[i]) {
                    let kk = [];
                    for (let k = i; k < newArr.length; k++) {
                        if (oldArr[k * 1 - i * 1 + j * 1] === newArr[k]) {
                            kk.push(newArr[k]);
                            continue;
                        }
                        break;
                    }

                    if (kk.length) {
                        some.push(kk);
                    }
                }
            }
        }

        let max = [];
        for (let i in some) {
            if (some[i].length > max.length) {
                max = some[i];
            }
        }

        return oldArr.length - max.length;
    },

    //暂未处理
    gotoIndex(index, idName) {
        if (!idName) {
            idName = 'yq3';//走到关注的第几位
        }

        let newArr = [];
        let oldArr = [];
        let currentIndex = 0;
        let rp = 0;

        while (true) {
            let tags = Common.id(idName).filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().top + v.bounds().height() < Device.height();
            }).find();

            for (let i in tags) {
                if (isNaN(i)) {
                    continue;
                }

                oldArr.push(tags[i].text());
            }

            let step = this.getStep(oldArr, newArr);
            Log.log('step', step, rp);
            if (step === 0) {
                rp++;
            } else {
                rp = 0;
            }

            if (rp >= 3) {
                return false;
            }

            currentIndex += step;
            Log.log(currentIndex, step, index);
            if (currentIndex >= index) {
                return true;
            }
            newArr = JSON.parse(JSON.stringify(oldArr));
            oldArr = [];
            Gesture.swipe(300, 2000, 300, 1200, 500);
            Common.sleep(2000 + 1000 * Math.random());
        }
    },
}
