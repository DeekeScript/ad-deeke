let WxCommon = require('app/wx/Common.js');
let WxVideo = require('app/wx/Video.js');
let WxUser = require('app/wx/User.js');
let WxIndex = require('app/wx/Index.js');
let WxComment = require('app/wx/Comment.js');
let storage = require('common/storage.js');
let machine = require('common/machine.js');
let baiduWenxin = require('service/baiduWenxin.js');
let statistics = require('common/statistics.js');
let V = require('version/WxV.js');

let iWx = {
    me: {},//当前账号的信息
    taskConfig: {},
    titles: [],//今日刷视频的所有标题  标题+'@@@'+昵称   保证唯一，从而减少请求后台接口
    targetVideoCount: 0,//刷到目标视频数量
    videoCount: 0,//刷到视频数量
    provices: [],
    isCity: false,//是否是同城
    nicknames: [],//所有的昵称，重复的忽略
    runTimes: undefined,  //如果是数字0 则完成

    //type 0 评论，1私信
    getMsg(type, title, age, gender) {
        if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
        }
        return machine.getMsg(type) || false;//永远不会结束
    },

    douyinExist(douyin) {
        if (storage.getMachineType() === 1) {
            return machine.douyinExist(douyin);//永远不会结束
        }
    },

    videoExist(nickname, title) {
        if (storage.getMachineType() === 1) {
            return machine.videoExist(nickname, title);//永远不会结束
        }
    },

    accountFreGt(nickname) {
        let res;
        if (storage.getMachineType() === 1) {
            res = machine.accountFreGt(nickname);
        }

        if (res.code === 0) {
            return true;
        }
        return false;
    },

    taskCheck() {
        //查看是否到了时间，没有的话，直接返回flase
        let hour = this.configData.toker_run_hour;
        if (!hour.includes("" + (new Date()).getHours())) {
            return 101;//不在任务时间
        }

        if (this.runTimes !== undefined) {
            this.runTimes--;
            Log.log("运行次数：" + this.runTimes);
            if (this.runTimes <= 0) {
                this.runTimes = 0;
                return 1001;
            }
        }

        return 0;
    },

    //检测标题是否正常
    videoRulesCheckTitle(rule, title) {
        if (rule.toker_view_video_keywords) {
            let containWord = WxCommon.containsWord(rule.toker_view_video_keywords, title);
            Log.log(containWord);
            if (containWord) {
                return true;
            }
            return false;
        }
        return true;
    },

    //视频规则是否符合条件
    videoRulesCheck(rule, videoData) {
        if (rule.toker_view_video_keywords) {
            let containWord = WxCommon.containsWord(rule.toker_view_video_keywords, videoData.title);
            Log.log(containWord);
            if (containWord) {
                return true;
            }
            return false;
        }

        console.log('同城数据判断：', rule.toker_distance, videoData.distance);
        if (rule.toker_distance < videoData.distance) {
            return false;
        }

        return true;
    },

    refreshVideo(videoRules, isCity) {
        WxCommon.toast('现在是刷视频');
        let videoData;
        let errorCount = 0;
        let noTitleCount = 5;
        let rpVideoCount = 0;//5重复就报错

        while (true) {
            WxCommon.toast('---滑动视频---');
            WxVideo.next()
            Log.log('-标题获取');
            let vContent = WxVideo.getContent();
            let vNickname = WxVideo.getNickname();
            Log.log("vContent", vContent, vNickname);
            if (!vNickname) {
                if (noTitleCount-- <= 0) {
                    throw new Error('可能异常！');
                }
                WxVideo.videoSlow();
                WxCommon.sleep(1000 + 1000 * Math.random());
                continue;
            }
            statistics.viewVideo();//刷视频数量加1
            noTitleCount = 5;
            Log.log('-标题检查');
            if (!this.videoRulesCheckTitle(videoRules, vContent)) {
                Log.log('不包含关键词', '随机休眠1-2秒');
                WxVideo.videoSlow();
                continue;
            }

            Log.log('-是否直播');
            if (WxVideo.isLiving()) {
                WxCommon.toast('直播中，切换下一个视频');
                WxVideo.videoSlow();
                continue;
            }

            //同类型的
            let nicknames = storage.getExcNicknames();
            if (nicknames) {
                nicknames = nicknames.split(/[,|，]/);
                if (nicknames.includes(vNickname)) {
                    WxCommon.toast('排除的昵称');
                    WxVideo.videoSlow();
                    continue;
                }
            }

            let unique = vNickname + '_' + vContent;
            if (this.titles.includes(unique)) {
                WxCommon.toast('重复视频');
                rpVideoCount++;
                if (rpVideoCount >= 5) {
                    throw new Error('5次重复，报错');
                }
                continue;
            }

            rpVideoCount = 0;

            if (this.titles.length >= 100) {
                this.titles.shift();
            }

            this.titles.push(unique);

            if (this.nicknames.includes(vNickname) || this.accountFreGt(vNickname)) {
                WxCommon.toast(vNickname + '：重复或频率超出');
                continue;
            }

            videoData = WxVideo.getInfo(isCity, { nickname: vNickname, title: vContent, commentCount: true });

            errorCount = 0;
            //接下来是视频的参数和config比对， 不合适则刷下一个
            let tmp = this.videoRulesCheck(videoRules, videoData, isCity);
            if (!tmp) {
                Log.log('不符合条件');
                this.videoCount++;//视频数量增加
                continue;
            }

            break;
        }

        statistics.viewTargetVideo();//目标视频数量加1
        Log.log('休眠' + videoRules.toker_view_video_second + 's');
        WxCommon.sleep(videoRules.toker_view_video_second * 1000);

        if (!this.nicknames.includes(videoData.nickname)) {
            this.nicknames.push(videoData.nickname);
            if (this.nicknames.length > 3000) {
                this.nicknames.shift();
            }
        }

        return videoData;
    },

    commentDeal(videoData) {
        let windowOpen = false;
        Log.log("评论频率", this.configData.toker_comment_rate);
        if (this.configData.toker_comment_rate > Math.random() * 100) {
            Log.log('评论频率检测通过');
            //随机评论视频
            let msg = this.getMsg(0, videoData.title);
            Log.log('commentDeal', msg, videoData.commentCount);
            if (msg) {
                WxVideo.openComment(!!videoData.commentCount);
                Log.log('开启评论窗口-1');
                windowOpen = true;
                WxComment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                Log.log('评论了');
            }
        }

        Log.log('评论数量：', videoData.commentCount, this.configData.toker_comment_area_zan_rate, this.configData.toker_comment_area_zan_rate < Math.random() * 100);

        //如果一开始没有评论 这里直接返回到视频
        if (videoData.commentCount === 0 || this.configData.toker_comment_area_zan_rate < Math.random() * 100) {
            if (windowOpen) {
                WxCommon.sleep(300);
                WxCommon.back();
                WxCommon.sleep(1000);
            }

            return true;
        }

        if (!windowOpen) {
            Log.log('打开评论窗口-');
            WxVideo.openComment(!!videoData.commentCount);
        }

        //随机点赞 评论回复
        let contains = [];//防止重复的
        let rps = 5;//大于2 则退出
        let opCount = 5;

        while (rps-- > 0) {
            Log.log('获取评论列表-开始');
            let comments = WxComment.getList();
            Log.log('获取到了评论列表：' + comments.length);
            if (comments.length === 0) {
                break;
            }

            for (let comment of comments) {
                //移除了comment.content
                if (contains.includes(comment.nickname)) {
                    continue;
                }

                Log.log('是否作者？', comment.isAuthor, comment.nickname, videoData.nickname);
                if (comment.nickname === this.me.nickname || comment.isAuthor || videoData.nickname === comment.nickname) {
                    Log.log('作者或者自己忽略');
                    continue;
                }

                contains.push(comment.nickname);
                try {
                    Log.log("点赞");
                    if (this.configData.toker_view_video_ip && !WxCommon.containsWord(this.configData.toker_view_video_ip, comment.ip)) {
                        Log.log('IP不符合规范', comment.ip);
                        continue;
                    }
                    WxComment.clickZan(comment);//////////////////////操作
                    Log.log("点赞2");
                    opCount--;
                } catch (e) {
                    Log.log(e);
                    opCount--;
                }

                if (opCount <= 0) {
                    break;
                }
            }

            if (opCount <= 0) {
                break;
            }

            Log.log('滑动评论');
            WxComment.swipeTop();
            WxCommon.sleep(1000 + 1000 * Math.random());
        }

        Log.log('返回了哦');
        WxCommon.sleep(300);
        WxCommon.back();
        //漏洞修复  如果此时还在评论页面，则再一次返回
        WxCommon.sleep(1000);
        WxComment.closeCommentWindow();
        WxCommon.sleep(500 + 500 * Math.random());
    },

    run(type) {
        this.isCity = type == 1 ? true : false;
        this.configData = machine.getWxTokerData(type);
        Log.log(this.configData);
        return this.runTask();//返回指定编码
    },

    runTask() {
        //进入主页，获取个人的账号信息 然后进入视频界面
        WxCommon.toast('进入了主页', 1000);
        Log.log(JSON.stringify({
            '账号：': this.me.douyin,
            '昵称：': this.me.nickname,
        }));

        Log.log('是同城：', this.isCity);
        if (this.isCity) {
            WxIndex.intoLocal();
        } else {
            //WxIndex.intoHome();
            WxIndex.intoVideo();
        }

        WxCommon.sleep(3000 + 2000 * Math.random());
        //开始刷视频
        while (true) {
            let code = this.taskCheck();
            Log.log('获取的code：' + code);
            if (0 !== code) {
                return code;
            }

            Log.log('开始获取视频数据');
            let videoData = this.refreshVideo(this.configData, this.isCity);
            Log.log('看看是不是广告');
            //看看是不是广告，是的话，不操作作者
            if (WxVideo.viewDetail()) {
                continue;
            } else {
                Log.log('不是广告，准备进入主页');
            }

            this.targetVideoCount++;
            //看看是否可以点赞了
            if (this.configData.toker_zan_rate / 100 >= Math.random() && !WxVideo.isZan()) {
                Log.log('点赞了');
                WxVideo.clickZan();///////////////////////////////////操作  视频点赞
            }

            //现在决定是否对视频作者作者进行操作
            //查看频率是否允许操作作者
            //Log.log('关注和点赞检查', this.focusFreCheck(this.taskConfig.focus_author_fre), this.privateMsgFreCheck(this.taskConfig.private_author_fre))
            let private_rate = Math.random() * 100;
            let focus_rate = Math.random() * 100;
            if (this.configData.toker_private_msg_rate > private_rate || this.configData.toker_focus_rate > focus_rate) {
                WxCommon.sleep(1000);
                WxVideo.intoUserPage();
                let userData;
                try {
                    Log.log("查看用户数据");
                    userData = WxUser.getUserInfo();///////////操作  进入用户主页
                    Log.log("查看用户数据-2");
                } catch (e) {
                    //看看是不是进入了广告
                    Log.log('用户数据异常', e);
                    WxCommon.sleep(2000);
                    if (UiSelector().text(V.Video.ad[0]).isVisibleToUser(true).exists()) {
                        Log.log('存在“反馈”字眼');
                        WxCommon.back();
                        WxCommon.sleep(500 + 500 * Math.random());
                        //有些用户页面，会弹出广告对话框，返回后还是在用户页面，这个时候需要返回
                        try {
                            if (WxUser.getNickname()) {
                                WxCommon.back();
                                WxCommon.sleep(500 + 500 * Math.random());
                            }
                        } catch (e) {
                            Log.log('找不到用户，不用管');
                        }

                        continue;
                    }
                }


                if (userData) {
                    Log.log('看到了用户数据了哦');
                } else {
                    WxCommon.back();
                    Log.log('异常，返回回去');
                    WxCommon.sleep(1000);
                    continue;
                }

                //判断IP
                if (this.configData.toker_view_video_ip && !WxCommon.containsWord(this.configData.toker_view_video_ip, userData.ip)) {
                    WxCommon.back();
                    WxCommon.sleep(1000);
                    Log.log('IP不符合', userData.ip, this.configData.toker_view_video_ip);
                    continue;
                }

                let isPrivateAccount = userData.isPrivate;
                if (!isPrivateAccount && this.configData.toker_focus_rate > focus_rate) {
                    Log.log('用户规则：', userData.gender, userData.age, this.configData.toker_run_min_age, this.configData.toker_run_max_age, this.configData.toker_run_sex);
                    if (this.configData.toker_run_sex && this.configData.toker_run_sex.includes(userData.gender) && this.configData.toker_run_min_age <= userData.age && this.configData.toker_run_max_age >= userData.age) {
                        Log.log('关注了哦');
                        WxUser.focus();///////////////////////////////////操作  关注视频作者
                        WxCommon.sleep(3000);
                    }
                }

                if (!this.douyinExist(userData.douyin)) {
                    Log.log('用户规则：', userData.gender, userData.age, this.configData.toker_run_min_age, this.configData.toker_run_max_age, this.configData.toker_run_sex);
                    if (this.configData.toker_run_sex && this.configData.toker_run_sex.includes(userData.gender) && this.configData.toker_run_min_age <= userData.age && this.configData.toker_run_max_age >= userData.age) {
                        if (!isPrivateAccount && this.configData.toker_private_msg_rate > private_rate) {
                            let msg = this.getMsg(1, userData.nickname);
                            Log.log('要私信了哦');
                            if (msg) {
                                WxUser.privateMsg(msg.msg);///////////////////////////////////操作  私信视频作者
                            }
                        }
                    }
                }

                WxCommon.back();
                Log.log('返回首页了哦');
                WxCommon.sleep(2000 * Math.random());
            }

            //看看是否可以操作评论区了
            WxCommon.sleep(1000);
            Log.log('开始处理评论区了');
            this.commentDeal(videoData);
            Log.log('开始下个视频');
        }
    },
}

module.exports = iWx;
