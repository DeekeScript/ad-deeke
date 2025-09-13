let tCommon = require("app/wx/Common");
let WxIndex = require("app/wx/Index");
let WxSearch = require("app/wx/Search");
let WxUser = require("app/wx/User");
let WxVideo = require("app/wx/Video");
let WxComment = require("app/wx/Comment");
let storage = require("common/storage");
let machine = require("common/machine");
let baiduWenxin = require("service/baiduWenxin");
let statistics = require("common/statistics");

let task = {
    index: -1,
    nicknames: [],
    run(input, kw, sleepSecond) {
        return this.testTask(input, kw, sleepSecond);
    },

    getMsg(type, title, age, gender) {
        if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
        }
        return machine.getMsg(type) || false;//永远不会结束
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-wx-toker-comment-" + file + ".txt";
        Log.setFile(allFile);
    },

    includesKw(str, kw) {
        for (let i in kw) {
            if (str.includes(kw[i])) {
                return true;
            }
        }
        return false;
    },

    testTask(input, kw, sleepSecond) {
        //首先进入页面
        this.index++;
        WxIndex.intoHome();
        WxIndex.intoSearchPage();
        input = tCommon.splitKeyword(input);
        let douyin = input[this.index];

        kw = tCommon.splitKeyword(kw);
        Log.log('账号：', input);
        Log.log('关键词：', kw);

        if (this.index >= input.length) {
            this.index = 0;
        }

        tCommon.sleep(2000 + 2000 * Math.random());
        let res = WxSearch.intoUserVideoPage(input[this.index]);
        if (!res) {
            System.toast('找不到用户账号：' + input);
            return 'exit';
        }

        //获取最新的前三视频
        let i = 3;
        while (i-- > 0) {
            Log.log('进入一个视频', 3 - i);
            if (!WxUser.intoVideo()) {
                return 'videoExit';
            }
            //let title = WxVideo.getContent();
            let commentCount = WxVideo.getCommentCount();
            if (commentCount === 0) {
                Log.log('评论为0 ，下一个视频', i);
                WxVideo.next();
                continue;
            }

            statistics.viewVideo();
            statistics.viewTargetVideo();
            WxVideo.openComment(true);
            Log.log('打开或者滑动到评论区域');

            tCommon.sleep(2000 + 1000 * Math.random());
            let maxSwipe = commentCount;//最多滑动次数
            let sw = 0;
            while (maxSwipe-- > 0) {
                let comments = WxComment.getList();//列表
                Log.log('评论长度:' + WxComment.getCommentCount());
                if (comments.length === 0) {
                    Log.log('到底了，完成了');
                    if (sw++ >= 3) {
                        Log.log('下一个视频');
                        break;
                    }
                } else {
                    sw = 0;
                }

                for (let k in comments) {
                    Log.log('k', k);
                    let nickname = comments[k].nickname;
                    if (comments[k]['content'] == "" || !this.includesKw(comments[k]['content'], kw) || this.nicknames.includes(nickname)) {
                        Log.log('数据：', comments[k]['content'], !this.includesKw(comments[k]['content'], kw), this.nicknames.includes(nickname));
                        continue;
                    }

                    if (machine.get('task_wx_search_inquiry_' + douyin + '_' + nickname, 'bool')) {
                        Log.log('重复');
                        continue;
                    }
                    Log.log('找到了关键词', comments[k]['content']);

                    WxComment.clickZan(comments[k]);
                    if (!comments[k].isChannel) {
                        Log.log('不是视频号，没有主页，跳过');
                        continue;
                    }

                    this.nicknames.push(nickname);
                    machine.set('task_wx_search_inquiry_' + douyin + '_' + nickname, true);
                    WxComment.intoUserPage(comments[k].headTag);
                    //私密账号
                    if (WxUser.isPrivate()) {
                        tCommon.back();
                        tCommon.sleep(1000 + 1000 * Math.random());
                        Log.log('私密账号');
                        continue;
                    }

                    //开始操作评论
                    if (WxUser.intoVideo()) {
                        Log.log('有视频，直接操作视频引流');
                        try {
                            WxVideo.clickZan();
                        } catch (e) {
                            Log.log('点赞异常', e);
                            tCommon.back();
                            continue;
                        }
                        //作者关闭评论的情况
                        let msg = this.getMsg(0, WxVideo.getContent());
                        if (msg) {
                            WxVideo.openComment();
                            tCommon.sleep(2000 + 1000 * Math.random());
                            if (!UiSelector().className('android.widget.TextView').text('作者已关闭评论').isVisibleToUser(true).findOne()) {
                                WxComment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                                tCommon.back();
                                tCommon.sleep(1000 + 1000 * Math.random());
                                Log.log('评论了');
                            } else {
                                tCommon.back();
                                tCommon.sleep(1000 + 1000 * Math.random());
                                Log.log('不能评论');
                            }
                        }

                        tCommon.back();//从视频页面到用户页面
                        tCommon.sleep(1000 + 1000 * Math.random());
                    } else {
                        Log.log('无视频，直接操作关注和私信引流');
                        WxUser.focus();
                        let msg = this.getMsg(1, comments[k].nickname, WxUser.getAge(), WxUser.getGender());
                        if (msg) {
                            WxUser.privateMsg(msg.msg);
                        }
                    }
                    tCommon.back();
                    tCommon.sleep(1000 + 1000 * Math.random());
                }

                Log.log('下一页评论');
                WxComment.swipeTop();
                tCommon.sleep(1500 + 500 * Math.random());
            }

            tCommon.back();
            tCommon.sleep(1000 + 500 * Math.random());
            WxVideo.next();
            Log.log('下一个视频');
            tCommon.sleep(4000 + Math.random() * 2000);
        }

        tCommon.back(5, 1500);
        tCommon.backApp();
        if (this.index === input.length - 1) {
            System.toast('一轮完成，休息' + sleepSecond + '秒');
            Log.log('一轮完成，休息' + sleepSecond + '秒');
            tCommon.sleep(sleepSecond * 1000);//休眠十分钟
        } else {
            System.toast('一个账号完成，休息一段时间');
            Log.log('一轮完成，休息' + sleepSecond + '秒');
            tCommon.sleep(sleepSecond * 1000);//休眠十分钟
        }
        return true;//重启
    },
}

if (!Access.isMediaProjectionEnable()) {
    FloatDialogs.show('温馨提示', '请打开主界面侧边栏，开启“图色查找”权限');
    System.exit();
}

let input = machine.get('task_wx_toker_comment_account');
Log.log("input内容：" + machine.get('task_wx_toker_comment_account', 'string'));
if (!input) {
    System.toast('请输入昵称');
    System.exit();
}

let kw = machine.get('task_wx_toker_comment_kw');

Log.log("keyword：" + machine.get('task_wx_toker_comment_kw'));
if (!kw) {
    System.toast('请输入关键词');
    System.exit();
}

let sleepSecond = machine.get('task_wx_toker_comment_sleep_second', "int");

if (sleepSecond <= 0) {
    System.toast('休眠时间不能为空');
    System.exit();
}

tCommon.openApp();

while (true) {
    task.log();
    try {
        let r = task.run(input, kw, sleepSecond);
        if (r === 'exit') {
            tCommon.sleep(3000);
            FloatDialogs.show('找不到用户，停止执行');
            break;
        }

        if (r === 'videoExit') {
            tCommon.sleep(3000);
            FloatDialogs.show('找不到视频，停止执行');
            break;
        }

        if (r) {
            throw new Error('一个任务完成，重启，进入新的账号');
        }

        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        tCommon.backHome();
    }
}