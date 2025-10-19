let Common = require('app/dy/Common.js');
let Video = require('app/dy/Video.js');
let Comment = require('app/dy/Comment.js');
let statistics = require('common/statistics.js');

const User = {
    /**
     * 返回到用户主页
     * @returns {boolean}
     */
    backHome() {
        let i = 5;
        let settingTag;
        do {
            settingTag = UiSelector().descContains('复制名字').clickable(true).findOne();
            if (!settingTag) {
                Common.back();
                System.sleep(1000);
                continue;
            }
            Log.log('返回到了用户主页');
            return true;
        } while (i-- > 0 && !settingTag);
        Log.log('返回用户主页失败');
        return false;
    },

    /**
     * 用户页面进入私信页面
     * @returns {boolean}
     */
    intoPrivatePage() {
        //私密账号，目前可以私信（不确定是否可以禁用私信）
        // if (UiSelector().text('私密账号').isVisibleToUser(true).findOnce()) {
        //     Log.log('私密账号');
        //     return false;
        // }
        if (this.isBlackUser()) {
            return false;
        }

        let settingTag = UiSelector().desc('更多').clickable(true).isVisibleToUser(true).findOne() || UiSelector().text('更多').clickable(true).isVisibleToUser(true).findOne();
        if (!settingTag) {
            Log.log('找不到setting按钮');
            return false;
        }

        settingTag.click();
        Log.log("私信");
        Common.sleep(700 + 500 * Math.random());

        let sendTag = UiSelector().text('发私信').isVisibleToUser(true).findOne();
        if (!sendTag) {
            throw new Error('找不到发私信按钮');
        }

        let res = sendTag.parent().click();
        Common.sleep(2000 + 1000 * Math.random());
        return res;
    },

    /**
     * 蓝V发送卡片
     * @returns {boolean}
     */
    privateMsgCard(index) {
        try {
            if (!this.intoPrivatePage()) {
                return false;
            }

            let moreTag = UiSelector().desc('更多面板').isVisibleToUser(true).findOne();
            if (!moreTag) {
                throw new Error('找不到发私信输入框');//可能是企业号，输入框被隐藏了
            }
            Common.click(moreTag);
            Common.sleep(1200 + 300 * Math.random());

            let toolTag = UiSelector().text('经营工具').clickable(false).isVisibleToUser(true).findOne();
            if (!toolTag) {
                Log.log('找不到发私信toolTag');//可能是企业号，输入框被隐藏了
                this.backHome();
                return false;
            }
            toolTag.parent().click();
            Common.sleep(4000 + 2000 * Math.random());

            let higherTag = UiSelector().desc('高级在线预约').isVisibleToUser(true).findOne();
            if (!higherTag) {
                throw new Error('找不到发私信higherTag');
            }

            Common.click(higherTag);
            Common.sleep(2000 + 2000 * Math.random());

            let previewTag = UiSelector().desc('预览').isVisibleToUser(true).find();
            if (!previewTag) {
                throw new Error('找不到发私信higherTag');
            }
            let count = Math.floor(Math.random() * previewTag.length);
            if (index != undefined) {
                count = index;
            }
            Log.log('点击第几个：', count, previewTag[count]);
            Gesture.click(previewTag[count].bounds().left - 200 * Math.random(), previewTag[count].bounds().top + 50 * Math.random());
            Common.sleep(2000 + 2000 * Math.random());

            let sendsTag = UiSelector().desc('发送').clickable(true).isVisibleToUser(true).findOne()
            if (!sendsTag) {
                throw new Error("返回两次");
            }

            statistics.privateMsg();
            Common.click(sendsTag);
            Common.sleep(1000 + Math.random() * 1000);
            this.backHome();
            return true;
        } catch (e) {
            Log.log(e);
            this.backHome();
        }

        return false;
    },

    /**
     * 发送私信
     * @param {string} msg 
     * @param {boolean} inMsgPage 是否已经在私信页面
     * @param {boolean} noBackHome 不返回主界面
     * @returns {boolean}
     */
    privateMsg(msg, inMsgPage, noBackHome) {
        try {
            if (!inMsgPage && !this.intoPrivatePage()) {
                return false;
            }

            let textTag = UiSelector().className('android.widget.EditText').filter(v => {
                return v.isEditable();
            }).isVisibleToUser(true).findOne();
            if (!textTag) {
                throw new Error('找不到发私信输入框');//可能是企业号，输入框被隐藏了
            }
            textTag.setText(msg);
            Common.sleep(100 + 100 * Math.random());

            let sendTextTag = UiSelector().desc('发送').isVisibleToUser(true).clickable(true).findOne();
            if (!sendTextTag || !sendTextTag.click()) {
                throw new Error('发送消息失败');
            }

            Common.sleep(500 + 500 * Math.random());
            Log.log("私信发送完成");
            statistics.privateMsg();
            if (!noBackHome) {
                this.backHome();
            }
            return true;
        } catch (e) {
            Log.log(e);
            if (!noBackHome) {
                this.backHome();
            }
        }
        return false;
    },

    /**
     * 返回用户昵称
     * @returns {string}
     */
    getNickname() {
        let nicknameTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).descContains('复制名字').findOne() || UiSelector().className('android.widget.TextView').isVisibleToUser(true).findOne();
        if (nicknameTag) {
            return nicknameTag.text();
        }

        throw new Error('找不到昵称');
    },

    /**
     * 机构 媒体等账号 公司
     * @returns {boolean}
     */
    isCompany() {
        return !UiSelector().className('android.widget.TextView').isVisibleToUser(true).textContains('抖音号：').findOne();
    },

    /**
     * 获取抖音号
     * @returns {string}
     */
    getDouyin() {
        let douyinTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).textContains('抖音号：').findOne();
        if (douyinTag) {
            return douyinTag.text().replace('抖音号：', '');
        }

        let settingTag = UiSelector().desc('更多').clickable(true).isVisibleToUser(true).findOne() || UiSelector().text('更多').clickable(true).isVisibleToUser(true).findOne();
        if (!settingTag) {
            Log.log('找不到setting按钮');
            return false;
        }

        settingTag.click();
        Common.sleep(1000 + 500 * Math.random());

        douyinTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).textContains('抖音号: ').findOne();
        if (douyinTag) {
            Common.back();
            return douyinTag.text().replace('抖音号: ', '');
        }

        throw new Error('获取抖音号失败');
    },

    /**
     * 获取”获赞“数量
     * @returns {number}
     */
    getZanCount() {
        let textTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).text('获赞').findOne();
        let zanTag = textTag.parent().children().findOne(UiSelector().className('android.widget.TextView').isVisibleToUser(true));
        return Common.numDeal(zanTag.text());
    },

    /**
     * 返回关注控件
     * @returns {object}
     */
    getFocusTag() {
        let textTag = UiSelector().className('android.widget.TextView').text('关注').findOne();
        return textTag.parent().children().findOne(UiSelector().className('android.widget.TextView').isVisibleToUser(true));
    },

    /**
     * 获取”关注“数量
     * @returns {number}
     */
    getFocusCount() {
        return Common.numDeal(this.getFocusTag().text());
    },

    getFansTag() {
        let textTag = UiSelector().className('android.widget.TextView').text('粉丝').findOne();
        return textTag.parent().children().findOne(UiSelector().className('android.widget.TextView').isVisibleToUser(true));
    },

    /**
     * 获取”粉丝“数量
     * @returns {number}
     */
    getFansCount() {
        return Common.numDeal(this.getFansTag().text());
    },

    /**
     * 获取介绍
     * @returns {string}
     */
    getIntroduce() {
        let introduceTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).filter(v => {
            return v.bounds().top > textTag.bounds().bottom;
        }).findOne()
        return introduceTag.text();
    },

    /**
     * 获取Ip
     * @returns {string}
     */
    getIp() {
        let ipTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).textContains('IP：').findOne();
        if (!ipTag) {
            return '未知';
        }
        return ipTag.text().replace('IP：', '');
    },

    /**
     * 获取年龄
     * @returns {number}
     */
    getAge() {
        let ageTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).textContains('岁').findOne();
        if (!ageTag) {
            return 0;
        }
        return Common.numDeal(ageTag.text());;
    },

    /**
     * 获取作品数控件
     * @returns {object}
     */
    getWorksTag() {
        let worksTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).descContains('作品').findOne();
        console.log("worksTag", worksTag);
        if (!worksTag) {
            return {
                text: function () {
                    return 0;
                }
            }
        }
        return worksTag;
    },

    /**
     * 获取作品数量
     * @returns {number}
     */
    getWorksCount() {
        let tag = this.getWorksTag();
        return Common.numDeal(tag.text());
    },

    /**
     * 是否开通了橱窗
     * @returns {boolean}
     */
    openWindow() {
        return !!UiSelector().className('android.widget.TextView').isVisibleToUser(true).text('商品橱窗').findOne();
    },

    /**
     * 获取性别  0女，1男，2未知
     * @returns {string}
     */
    getGender() {
        if (UiSelector().className('android.widget.TextView').isVisibleToUser(true).textContains('男').findOne()) {
            return '1';
        }

        if (UiSelector().className('android.widget.TextView').isVisibleToUser(true).textContains('女').findOne()) {
            return '0';
        }

        return '2';
    },

    /**
     * 黑名单账号（封禁和注销账号）
     * @returns {boolean}
     */
    isBlackUser() {
        //帐号已被封禁
        if (UiSelector().textContains('封禁').isVisibleToUser(true).findOnce()) {
            return true;
        }

        //注销了
        if (UiSelector().textContains('账号已经注销').isVisibleToUser(true).findOnce()) {
            return true;
        }
        return false;
    },

    /**
     * 是否是私密账号、注销账号、封禁账号
     * @returns {boolean}
     */
    isPrivate() {
        Log.log("是否是私密账号、注销账号、封禁账号？");
        if (UiSelector().text('私密账号').isVisibleToUser(true).findOnce()) {
            return true;
        }

        if (this.isBlackUser()) {
            return true;
        }
        Log.log("不是私密账号、注销账号、封禁账号");
        return false;
    },

    /**
     * 返回是否已关注控件
     * @returns {object}
     */
    isFocusTag() {
        return UiSelector().className('android.widget.TextView').isVisibleToUser(true).filter(v => {
            return v.hintText == '按钮';
        }).textContains('已关注').findOne() || UiSelector().className('android.widget.TextView').isVisibleToUser(true).filter(v => {
            return v.hintText == '按钮';
        }).textContains('互相关注').findOne();
    },

    /**
     * 是否已关注
     * @returns {boolean}
     */
    isFocus() {
        return !!this.isFocusTag();
    },

    /**
     * 关注
     * @returns {boolean}
     */
    focus() {
        let focusTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).filter(v => {
            return v.hintText == '按钮';
        }).text('关注').findOne() || UiSelector().className('android.widget.TextView').isVisibleToUser(true).filter(v => {
            return v.hintText == '按钮';
        }).text('回关').findOne();

        if (this.isFocus()) {
            Log.log('已关注');
            return true;
        }

        if (focusTag) {
            let res = focusTag.click();
            Common.sleep(500 + 500 * Math.random());
            return res;
        }

        throw new Error('找不到关注和已关注');
    },

    /**
     * 取消关注
     * @returns {boolean}
     */
    cancelFocus() {
        let focusTag = this.isFocusTag();
        if (!focusTag) {
            return false;
        }
        focusTag.click();
        Common.sleep(1500 + 500 * Math.random());

        let cancelBtn = UiSelector().className('android.widget.TextView').text('取消关注').findOne();
        if (cancelBtn) {
            cancelBtn.parent().click();
            Common.sleep(1000 + 500 * Math.random());
        }

        let cancelTag = UiSelector().className('android.widget.TextView').descContains('取消关注').clickable(true).findOne();
        if (!cancelTag) {
            this.backHome();
            Log.log('该机型可能只需要1次即可取消');
            return true;
        }

        let res = cancelTag.click();
        Common.sleep(1000 + 1000 * Math.random());
        return res;
    },

    /**
     * 返回用户数据
     * @returns {object}
     */
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
            ip: this.getIp(),
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
    /**
     * 取消关注列表
     * @param {object} machine 
     * @returns {boolean}
     */
    cancelFocusList(machine) {
        let focus = this.getFocusTag();
        if (!focus) {
            FloatDialogs.toast('找不到关注');
            throw new Error('找不到关注');
        }

        Common.click(focus);
        Common.sleep(4000 + 1000 * Math.random());
        while (true) {
            let containers = Common.id('root_layout').isVisibleToUser(true).find();
            if (containers.length === 0) {
                Log.log('containers为0');
                FloatDialogs.toast('找不到关注列表');
                throw new Error('找不到关注列表');
            }

            for (let i in containers) {
                Log.log("昵称：" + containers[i].desc());
                if (!containers[i] || this.contents.includes(containers[i].text())) {
                    continue;
                }

                Log.log(this.contents.length, this.contents.includes(containers[i].desc()));
                let nickname = containers[i].desc();

                let hasFocusTag = containers[i].children().findOne(UiSelector().isVisibleToUser(true).descContains('关注')) || containers[i].children().findOne(UiSelector().isVisibleToUser(true).textContains('关注'));;
                if (!hasFocusTag) {
                    continue;
                }

                let title = hasFocusTag.desc() || hasFocusTag.text();
                Log.log(machine.get('task_dy_cancel_focus_mutual_switch', 'bool'), title);
                if (title.indexOf('已关注') != -1 || (machine.get('task_dy_cancel_focus_mutual_switch', 'bool') && title.indexOf('互相关注') != -1)) {
                    containers[i].click();
                    Common.sleep(2000 + 1000 * Math.random());
                    this.cancelFocus();
                }
                this.contents.push(nickname);
                while (!UiSelector().id('android:id/text1').text('关注').selected(true).isVisibleToUser(true).findOne()) {
                    Common.back(1, 500, 500);
                }
                Common.sleep(500);
            }

            Log.log('滑动');
            if (!Common.swipeFocusListOp()) {
                return true;
            }
            Common.sleep(1500 + 1000 * Math.random());
        }
    },

    /**
     * 设置用户昵称
     * @param {array} contents 
     * @param {string} account 
     * @param {string} nickname 
     * @param {object} machine 
     */
    fansIncListOp(contents, account, nickname, machine) {
        nickname = Encrypt.md5(nickname);
        machine.set('task_dy_toker_fans_inc_main_' + account + '_' + nickname, true);
        contents.push(nickname);
        Common.sleep(500 + 500 * Math.random());
    },

    /**
     * 快速涨粉
     * @param {function} getMsg 
     * @param {object} machine 
     * @param {object} settingData 
     * @param {array} contents 
     * @param {string} meNickname 
     * @returns {boolean}
     */
    fansIncList(getMsg, machine, settingData, contents, meNickname) {
        let account = settingData.account;
        let fansTag = this.getFansTag();
        Common.click(fansTag);
        Common.sleep(2000 + 1000 * Math.random());

        let arr = [];
        while (true) {
            let containers = Common.id('root_layout').isVisibleToUser(true).find();
            Log.log("containers长度：" + containers.length);
            if (containers.length === 0) {
                Log.log('containers为0');
                FloatDialogs.toast('找不到粉丝列表');
                throw new Error('找不到粉丝列表');
            }

            for (let i in containers) {
                Log.log("title", containers[i].desc());
                if (containers[i].children().findOne(UiSelector().desc('进入他的主页'))) {
                    Log.log('自己，不操作');
                    continue;
                }

                let nickname = containers[i].desc();
                if (machine.get('task_dy_toker_inc_main_' + account + '_' + nickname, 'bool')) {
                    Log.log('重复');
                    FloatDialogs.toast('重复');
                    continue;
                }

                //进入用户首页
                containers = Common.id('root_layout').isVisibleToUser(true).find();
                containers[i].click();
                Common.sleep(3000 + 1000 * Math.random());

                if (this.isPrivate()) {
                    Log.log('私密账号');
                    this.fansIncListOp(contents, account, nickname, machine);
                    Common.back();
                    Common.sleep(500 + 500 * Math.random());
                    continue;
                }

                //查看是否休眠
                if (settingData.task_dy_fans_inc_user_page_wait > 0) {
                    Common.sleep(1000 * settingData.task_dy_fans_inc_user_page_wait);
                }

                let rateCurrent = Math.random() * 100;
                this.fansIncListOp(contents, account, nickname, machine);
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
                    Common.sleep(500 + 500 * Math.random());
                    continue;
                }

                rateCurrent -= settingData.task_dy_fans_inc_head_zan_rate * 1;
                if (Video.intoUserVideo()) {
                    Common.sleep(1000 * settingData.task_dy_fans_inc_user_video_wait * 1);//视频休眠
                    Log.log("视频休眠：" + settingData.task_dy_fans_inc_user_video_wait);//视频休眠
                    if (rateCurrent <= settingData.task_dy_fans_inc_video_zan_rate * 1) {
                        !Video.isZan() && Video.clickZan();
                        Common.sleep(500 + 500 * Math.random());
                        this.backHome();
                        Common.back(1, 500, 500);
                        continue;
                    }

                    rateCurrent -= settingData.task_dy_fans_inc_video_zan_rate * 1;

                    if (rateCurrent <= settingData.task_dy_fans_inc_comment_rate * 1) {
                        let videoTitle = Video.getContent();
                        Video.openComment(!!Video.getCommentCount());
                        Comment.commentMsg(getMsg(0, videoTitle).msg);
                        Common.sleep(1000 + 1000 * Math.random());
                        System.setAccessibilityMode('!fast');//非快速模式
                        Comment.zanComment(settingData.task_dy_fans_inc_comment_zan_count * 1, meNickname);
                        System.setAccessibilityMode('fast');//快速模式
                        Common.sleep(500 + 500 * Math.random());
                        this.backHome();
                        Common.back(1, 500, 500);
                        continue;
                    }

                    rateCurrent -= settingData.task_dy_fans_inc_comment_rate * 1;
                    if (rateCurrent <= settingData.task_dy_fans_inc_collection_rate * 1) {
                        Video.collect();
                        this.backHome();
                        Common.back(1, 500, 500);
                        continue;
                    }

                    Common.sleep(500 + 500 * Math.random());
                    this.backHome();
                    Common.back(1, 500, 500);
                    continue;
                }
            }

            Log.log('滑动');
            if (!Common.swipeFansListOp()) {
                return true;
            }
            Common.sleep(1500);
        }
    },

    /**
     * type=0关注截流，type=1粉丝截流
     * @param {number} type 
     * @param {function} getMsg 
     * @param {object} machine 
     * @param {object} settingData 
     * @param {array} contents 
     * @param {string} meNickname 
     * @returns 
     */
    focusUserList(type, getMsg, machine, settingData, contents, meNickname) {
        let account = settingData
        let tag = type == 0 ? this.getFocusTag() : this.getFansTag();
        Common.click(tag);
        Common.sleep(2000 + 1000 * Math.random());

        while (true) {
            let containers = Common.id('root_layout').isVisibleToUser(true).find();
            Log.log("containers长度：" + containers.length);

            if (containers.length === 0) {
                Log.log('containers为0');
                throw new Error('操作列表为0');
            }

            for (let i in containers) {
                Log.log("title", containers[i].desc());
                if (containers[i].children().findOne(UiSelector().desc('进入他的主页'))) {
                    Log.log('自己，不操作');
                    continue;
                }

                let nickname = containers[i].desc();
                if (machine.get('task_dy_toker_focus_' + account + '_' + nickname, 'bool')) {
                    Log.log('重复');
                    continue;
                }

                //进入用户首页
                containers[i].click();
                statistics.viewUser();
                Common.sleep(3000 + 2000 * Math.random());

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

                if ((commentRate <= settingData.commentRate * 1 || zanRate <= settingData.zanRate * 1) && Video.intoUserVideo()) {
                    if (zanRate <= settingData.zanRate * 1) {
                        !Video.isZan() && Video.clickZan();
                    }

                    if (commentRate <= settingData.commentRate * 1) {
                        let videoTitle = Video.getContent();
                        Video.openComment(!!Video.getCommentCount());
                        Comment.commentMsg(getMsg(0, videoTitle).msg);
                        Common.sleep(1000 + 1000 * Math.random());
                        Comment.zanComment(5, meNickname);
                    }

                    Common.back(1, 800);
                }

                machine.set('task_dy_toker_focus_' + account + '_' + nickname, true);
                settingData.opCount--;
                if (settingData.opCount <= 0) {
                    return true;
                }

                Common.back(1, 1500);
                contents.push(nickname);
                if (UiSelector().descContains('更多').clickable(true).filter((v) => {
                    return v && v.bounds().top < Device.height() / 5 && v.bounds().left > Device.width() / 3;
                }).isVisibleToUser(true).findOnce()) {
                    Log.log('识别到更多，返回');
                    Common.back(1, 800);//偶尔会出现没有返回回来的情况，这里加一个判断
                }
                Common.sleep(500 + 500 * Math.random());
            }

            Log.log('滑动');
            let res = type === 1 ? Common.swipeFansListOp() : Common.swipeFocusListOp();
            Common.sleep(1500);
            if (!res) {
                Log.log('滑动到底了');
                return true;
            }
        }
    },

    /**
     * 进入关注列表 我的，不是其他的关注列表
     * @returns {boolean}
     */
    intoFocusList() {
        let focusTag = this.getFocusTag();
        return Common.click(focusTag);
    },

    /**
     * 通过关注列表搜索指定用户
     * @param {string} keyword 
     * @returns {boolean}
     */
    focusListSearch(keyword) {
        let searchBox = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).isVisibleToUser(true).findOne();
        searchBox.setText(keyword);
        Common.sleep(1000 + 1000 * Math.random());

        let nickTag = Common.id('root_layout').filter(v => {
            return v.children().findOne(UiSelector().text('DeekeScript').isVisibleToUser(true));
        }).isVisibleToUser(true).findOne();

        Log.log('nickTag', keyword, nickTag);
        if (!nickTag) {
            return false;
        }

        nickTag.click();
        Common.sleep(3000 + 2000 * Math.random());
        return true;
    },

    /**
     * 粉丝回访
     * @param {array} nicknames 
     * @returns {boolean}
     */
    viewFansList(nicknames) {
        let fans = this.getFansTag();
        if (!fans) {
            throw new Error('找不到粉丝');
        }

        Common.click(fans);
        Common.sleep(2000 + 1000 * Math.random());
        let contents = [];
        while (true) {
            let containers = containers = Common.id('root_layout').isVisibleToUser(true).find();
            if (containers.length === 0) {
                errorCount++;
                Log.log('containers为0');
            }

            for (let i in containers) {
                Log.log(contents.length, contents.includes(containers[i].desc()));
                let nickname = containers[i].desc();
                if (nicknames.includes(nickname)) {
                    continue;
                }

                containers[i].click();
                Common.sleep(2000 + 3000 * Math.random());
                nicknames.push(nickname);
                contents.push(nickname);
                Common.back(1, 500, 500);
            }

            Log.log('滑动');
            if (!Common.swipeFansListOp()) {
                return true;
            }
            Common.sleep(500);
        }
    },

    /**
     * 从用户页面点击头像，进入直播间
     * @returns {boolean}
     */
    intoLive() {
        let header = UiSelector().descContains('用户头像').descContains('直播中').isVisibleToUser(true).findOne();
        Log.log(header);
        return header.click();
    },
}

module.exports = User;
