import { Common as DyCommon } from 'app/dy/Common.js';
import { Video as DyVideo } from 'app/dy/Video.js';
import { User as DyUser } from 'app/dy/User.js';
import { Index as DyIndex } from 'app/dy/Index.js';
import { Comment as DyComment } from 'app/dy/Comment.js';
import { storage } from 'common/storage.js';
import { machine } from 'common/machine.js';
import { baiduWenxin } from 'service/baiduWenxin.js';
import { statistics } from 'common/statistics.js';

export let iDy = {
    me: {},//当前账号的信息
    taskConfig: {},
    titles: [],//今日刷视频的所有标题  标题+'@@@'+昵称   保证唯一，从而减少请求后台接口
    targetVideoCount: 0,//刷到目标视频数量
    videoCount: 0,//刷到视频数量
    provices: [],
    isCity: false,//是否是同城
    nicknames: [],//所有的昵称，重复的忽略

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

        if (!hour.includes((new Date()).getHours().toString())) {
            return 101;//不在任务时间
        }
        return 0;
    },

    //检测标题是否正常
    videoRulesCheckTitle(rule, title) {
        if (rule.toker_view_video_keywords) {
            let containWord = DyCommon.containsWord(rule.toker_view_video_keywords, title);
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
            let containWord = DyCommon.containsWord(rule.toker_view_video_keywords, videoData.title);
            Log.log(containWord);
            if (containWord) {
                return true;
            }
            return false;
        }
        return true;
    },

    refreshVideo(videoRules, isCity) {
        DyCommon.toast('现在是刷视频');
        let videoData;
        let errorCount = 0;
        let noTitleCount = 5;
        let rpVideoCount = 0;//5重复就报错

        while (true) {
            //判断是否在同城
            if (isCity) {
                // let tjTag = DyCommon.id('yic').text('推荐').filter((v) => {
                //     return v && v.bounds() && v.bounds().top > 0 && v.bounds().height() > 0 && v.bounds().left > 0 && v.bounds().top + v.bounds().height() < Device.height();
                // }).findOne();
                // console.log('同城', tjTag);
                // if (tjTag) {
                //     tjTag = tjTag.parent();
                //     console.log('同城', tjTag);
                //     if (tjTag && tjTag.desc() && tjTag.desc().indexOf("已选中") != -1) {
                //         //在推荐页，直接抛异常
                //         throw new Error('在推荐页，异常');
                //     }
                // }
                if(new UiSelector().desc('已选中，推荐，按钮').exists()){
                    throw new Error('在推荐页，异常');
                }
            }
            DyVideo.next();
            DyCommon.toast('-------------------滑动视频----------------');
            try {
                Log.log('-标题获取');
                let vContent = DyVideo.getContent();
                if (!vContent) {
                    if (noTitleCount-- <= 0) {
                        throw new Error('可能异常！');
                    }
                    DyVideo.videoSlow();
                    DyCommon.sleep(1000 + 1000 * Math.random());
                    continue;
                }
                noTitleCount = 5;
                Log.log('-标题检查');
                if (!this.videoRulesCheckTitle(videoRules, vContent)) {
                    Log.log('不包含关键词', '随机休眠1-2秒');
                    DyVideo.videoSlow();
                    continue;
                }

                Log.log('-是否直播');
                if (DyVideo.isLiving()) {
                    DyCommon.toast('直播中，切换下一个视频');
                    DyVideo.videoSlow();
                    continue;
                }

                Log.log('-昵称获取');
                let vNickname = DyVideo.getNickname();
                //同类型的
                let nicknames = storage.getExcNicknames();
                if (nicknames) {
                    nicknames = nicknames.split(/[,|，]/);
                    if (nicknames.includes(vNickname)) {
                        DyCommon.toast('排除的昵称');
                        DyVideo.videoSlow();
                        continue;
                    }
                }

                statistics.viewVideo();//刷视频数量加1

                let unique = vNickname + '_' + vContent;
                if (this.titles.includes(unique)) {
                    DyCommon.toast('重复视频');
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
                    DyCommon.toast(vNickname + '：重复或频率超出');
                    continue;
                }

                videoData = DyVideo.getInfo(isCity, { nickname: vNickname, title: vContent, commentCount: true });
            } catch (e) {
                errorCount++;
                Log.log(e.stack);
                if (errorCount > 3) {
                    throw new Error('三次都没有解决错误');
                }
                continue;
            }

            errorCount = 0;
            // if (!videoData.title) {
            //     DyCommon.toast('当前视频没有标题，切换到下一个');
            //     DyVideo.videoSlow();
            //     continue;
            // }

            //接下来是视频的参数和config比对， 不合适则刷下一个
            let tmp = this.videoRulesCheck(videoRules, videoData, isCity);
            if (!tmp) {
                Log.log('不符合条件');
                this.videoCount++;//视频数量增加
                continue;
            }
            //videoData = tmp;
            break;
        }

        statistics.viewTargetVideo();//目标视频数量加1
        Log.log('休眠' + videoRules.toker_view_video_second + 's');
        DyCommon.sleep(videoRules.toker_view_video_second * 1000);

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
                DyVideo.openComment(!!videoData.commentCount);
                Log.log('开启评论窗口-1');
                windowOpen = true;
                DyComment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                Log.log('评论了');
                statistics.comment();//评论+1
            }
        }

        Log.log('评论数量：', videoData.commentCount);

        //如果一开始没有评论 这里直接返回到视频
        if (videoData.commentCount === 0 || this.configData.toker_comment_area_zan_rate < Math.random() * 100) {
            if (windowOpen) {
                DyCommon.sleep(300);
                DyCommon.back();
                DyCommon.sleep(1000);
            }

            return true;
        }

        if (!windowOpen) {
            Log.log('打开评论窗口-');
            DyVideo.openComment(!!videoData.commentCount);
        }

        //随机点赞 评论回复
        let contains = [];//防止重复的
        let rps = 5;//大于2 则退出
        let opCount = 5;

        while (rps-- > 0) {
            Log.log('获取评论列表-开始');
            let comments = DyComment.getList();
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
                    DyComment.clickZan(comment);//////////////////////操作
                    Log.log("点赞2");
                    statistics.zanComment();//赞评论数量加1
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
            DyComment.swipeTop();
            DyCommon.sleep(1000 + 1000 * Math.random());
        }

        Log.log('返回了哦');
        DyCommon.sleep(300);
        DyCommon.back();
        //漏洞修复  如果此时还在评论页面，则再一次返回
        DyCommon.sleep(1000);
        DyComment.closeCommentWindow();
        DyCommon.sleep(500 + 500 * Math.random());
    },

    run(type) {
        this.isCity = type;
        this.configData = machine.getTokerData(type);
        Log.log(this.configData);
        return this.runTask();//返回指定编码
    },

    runTask() {
        //进入主页，获取个人的账号信息 然后进入视频界面
        DyCommon.toast('进入了主页', 1000);
        DyCommon.toast(JSON.stringify({
            '账号：': this.me.douyin,
            '昵称：': this.me.nickname,
        }));

        DyIndex.intoHome();
        if (this.isCity) {
            DyIndex.intoLocal();
        }

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
            if (DyVideo.viewDetail()) {
                let clickRePlayTag = DyCommon.id('fw2').filter((v) => {
                    return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0 && v.bounds().left > 0;
                }).findOnce();
                if (clickRePlayTag) {
                    Log.log('点击重播');
                    clickRePlayTag.click();
                    DyCommon.sleep(1000);
                }
                Gesture.click(500 + Math.random() * 200, 500 + Math.random() * 300);
                DyCommon.sleep(500);
                Log.log('广告，开始处理评论区了');
                this.commentDeal(videoData);
                Log.log('开始下个视频');
                continue;
            } else {
                Log.log('不是广告，准备进入主页');
            }

            this.targetVideoCount++;
            //看看是否可以点赞了
            if (this.configData.toker_zan_rate / 100 >= Math.random() && !DyVideo.isZan()) {
                Log.log('点赞了');
                DyVideo.clickZan();///////////////////////////////////操作  视频点赞
                statistics.zan();//点赞视频数量加1
            }

            //现在决定是否对视频作者作者进行操作
            //查看频率是否允许操作作者
            //Log.log('关注和点赞检查', this.focusFreCheck(this.taskConfig.focus_author_fre), this.privateMsgFreCheck(this.taskConfig.private_author_fre))
            let private_rate = Math.random() * 100;
            let focus_rate = Math.random() * 100;
            if (this.configData.toker_private_msg_rate > private_rate || this.configData.toker_focus_rate > focus_rate) {
                DyCommon.sleep(1000);
                DyVideo.intoUserPage();
                let userData;
                try {
                    Log.log("查看用户数据");
                    userData = DyUser.getUserInfo();///////////操作  进入用户主页
                    Log.log("查看用户数据-2");
                } catch (e) {
                    //看看是不是进入了广告
                    Log.log('用户数据异常', e);
                    DyCommon.sleep(2000);
                    if (new UiSelector().text('反馈').desc('反馈').clickable(true).filter((v) => {
                        return v && v.bounds() && v.bounds().top < Device.height() / 5 && v.bounds().left > Device.width() * 2 / 3;
                    }).exists()) {
                        Log.log('存在“反馈”字眼');
                        DyCommon.back();
                        if (text('确定').filter((v) => {
                            return v && v.bounds() && v.bounds().top < Device.height() / 5 && v.bounds().left > Device.width() * 2 / 3;
                        }).exists()) {
                            let a = new UiSelector().text('确定').filter((v) => {
                                return v && v.bounds() && v.bounds().top < Device.height() / 5 && v.bounds().left > Device.width() * 2 / 3;
                            });
                            a.click();
                            DyCommon.sleep(2000);
                        }
                        continue;
                    }
                }

                statistics.viewUser();//目标视频数量加1
                if (userData) {
                    Log.log('看到了用户数据了哦');
                } else {
                    DyCommon.back();
                    Log.log('异常，返回回去');
                    DyCommon.sleep(1000);
                    continue;
                }

                let isPrivateAccount = userData.isPrivate;
                if (!isPrivateAccount && this.configData.toker_focus_rate > focus_rate) {
                    Log.log('关注了哦');
                    DyUser.focus();///////////////////////////////////操作  关注视频作者
                    DyCommon.sleep(3000);
                    statistics.focus();//关注数量加1
                }

                if (!this.douyinExist(userData.douyin)) {
                    if (!isPrivateAccount && this.configData.toker_private_msg_rate > private_rate) {
                        let msg = this.getMsg(1, userData.nickname);
                        Log.log('要私信了哦');
                        if (msg) {
                            let privateRes = DyUser.privateMsg(msg.msg);///////////////////////////////////操作  私信视频作者
                            statistics.privateMsg();//私信数量加1
                        }
                    }
                }

                DyCommon.back();
                Log.log('返回首页了哦');
                DyCommon.sleep(2000 * Math.random());
            }

            //看看是否可以操作评论区了
            DyCommon.sleep(1000);
            Log.log('开始处理评论区了');
            this.commentDeal(videoData);
            Log.log('开始下个视频');
        }
    },
}
