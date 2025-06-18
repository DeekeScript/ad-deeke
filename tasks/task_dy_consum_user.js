let tCommon = require('app/dy/Common.js');
let DyIndex = require('app/dy/Index.js');
let DySearch = require('app/dy/Search.js');
let DyUser = require('app/dy/User.js');
let DyVideo = require('app/dy/Video.js');
let storage = require('common/storage.js');
let machine = require('common/machine.js');
let DyComment = require('app/dy/Comment.js');
let baiduWenxin = require('service/baiduWenxin.js');
let statistics = require('common/statistics');
let V = require("version/V.js");

// let dy = require('app/iDy');
// let config = require('config/config');

/**
 * 指定账号喜欢列表刷视频；操作：点赞，评论、评论点赞、访问主页（视频作者）；
 * 规则：喜欢列表刷视频每隔3-10（随机）个刷一个，点赞随机，评论随机，访问主页随机（只访问视频作者），评论点赞随机。观看视频3-10秒（随机）；
 * 不介意遇到异常回来花一定时间找到视频，只要能够找到。
 */

let videoCount = 500;

let task = {
    contents: [],
    run(account) {
        return this.testTask(account);
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-dy-consum-user-" + file + ".txt";
        Log.setFile(allFile);
    },

    //type 0 评论，1私信
    getMsg(type, title, age, gender) {
        if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
        }
        return machine.getMsg(type) || false;//永远不会结束
    },

    suc(arr) {
        let nicknameTitle = DyVideo.getAtNickname() + '_' + DyVideo.getTime();
        arr.push(nicknameTitle);
        if (arr.length >= 5) {
            arr.shift();
        }

        let j = 0;
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] == arr[i + 1]) {
                j++;
            }
        }

        Log.log(arr);
        if (j >= 3) {
            return true;
        }
    },

    testTask(account) {
        //首先进入点赞页面
        DyIndex.intoHome();
        if (account.indexOf('+') === 0) {
            DyIndex.intoMyPage();
        } else {
            DyIndex.intoSearchPage();
        }

        DySearch.homeIntoSearchUser(account);
        tCommon.sleep(2000 + 2000 * Math.random());
        //进入喜欢视频列表
        let likeTag = tCommon.aId(V.C.text1a).textContains(V.Index.intoMyLikeVideo[1]).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left > 0 && v.bounds().height() > 0 && v.bounds().width() > 0;
        }).findOnce();

        if (!likeTag) {
            Log.log('没有“喜欢”tab');
            return -1;
        }

        let currentNickname = DyUser.getNickname();
        Log.log('操作抖音昵称：', currentNickname);

        tCommon.click(likeTag);
        tCommon.sleep(3000 + Math.random() * 3000);
        let contain = tCommon.id(V.Index.intoMyLikeVideo[2]).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().height() > 0 && v.bounds().width() > 0;
        }).findOnce();

        tCommon.click(contain);
        Log.log('点击“喜欢”')
        tCommon.sleep(3000);

        /**
         * 指定账号喜欢列表刷视频；操作：点赞，评论、评论点赞、访问主页（视频作者）；
         * 规则：喜欢列表刷视频每隔3-10（随机）个刷一个，点赞随机，评论随机，访问主页随机（只访问视频作者），评论点赞随机。观看视频3-10秒（随机）；
         * 不介意遇到异常回来花一定时间找到视频，只要能够找到。
         */
        let arr = [];
        let errorCount = 0;
        while (true) {
            try {
                if (this.suc(arr)) {
                    return true;
                }

                Log.log('当前视频昵称：', DyVideo.getAtNickname());
                if (DyVideo.getAtNickname() == currentNickname) {
                    Log.log('本人的视频');
                    DyVideo.next();
                    Log.log('滑动视频');
                    tCommon.sleep(1000 * (Math.random() * 1 + 3));
                    if (this.suc(arr)) {
                        return true;
                    }
                    continue;
                }

                let rd = Math.round(Math.random() * 7) + 3;
                let lpErrorCount = 0;
                while (rd--) {
                    DyVideo.next();
                    tCommon.sleep(1000 * (Math.random() * 1 + 3));
                    try {
                        if (this.suc(arr)) {
                            return true;
                        }
                        errorCount = 0;
                    } catch (e) {
                        lpErrorCount++;
                        if (lpErrorCount >= 3) {
                            return true;
                        }
                    }
                }

                while (DyVideo.isZan()) {
                    DyVideo.next();
                    Log.log('滑动视频');
                    tCommon.sleep(1000 * (Math.random() * 1 + 3));

                    if (DyVideo.getAtNickname() == currentNickname) {
                        Log.log('本人的视频');
                        DyVideo.next();
                        Log.log('滑动视频');
                        tCommon.sleep(1000 * (Math.random() * 1 + 3));
                        if (this.suc(arr)) {
                            return true;
                        }
                        continue;
                    }
                }

                System.toast('开始模拟观看视频');
                tCommon.sleep(1000 * (Math.random() * 10 + 5));
                System.toast('开始操作视频');
                DyVideo.clickZan();
                statistics.viewVideo();
                statistics.viewTargetVideo();
                videoCount--;
                if (videoCount <= 0) {
                    return true;
                }

                tCommon.sleep(2000 + 2000 * Math.random())
                if (Math.random() >= 0.5) {
                    let count = DyVideo.getCommentCount();
                    let videoTitle = DyVideo.getContent();
                    DyVideo.openComment(count);
                    //点赞评论区
                    try {
                        Log.log('评论数：', count);
                        DyComment.zanComment(tCommon, count, 30);//高于30的不点赞
                        let msg = this.getMsg(0, videoTitle);
                        DyComment.commentMsg(msg.msg);
                    } catch (e) {
                        Log.log(e)
                    }
                    //tCommon.back();///返回到视频  这个页面的视频评论之后，自动关闭了，不用返回
                    tCommon.sleep(1500);
                }

                if (Math.random() >= 0.3) {
                    try {
                        DyVideo.intoUserPage();
                        tCommon.sleep(1000 * (Math.random() * 2));
                        tCommon.back();//防止头像找不到异常
                        Log.log("用户页面返回");
                    } catch (e) {
                        Log.log('进入用户主页出错');
                    }

                    try {
                        if (!DyVideo.getAtNickname()) {
                            Log.log('用户页面返回')
                            tCommon.back();//防止头像找不到异常
                        }
                    } catch (e) {
                        //tCommon.back();//这里不能操作
                        Log.log('找不到标题内容')
                    }

                    tCommon.sleep(1000);
                }
            } catch (e) {
                //print(e, errorCount);
                errorCount++;
                if (errorCount > 3) {
                    return true;
                }
                DyVideo.next();
            }
        }
    },
}

let account = storage.get('task_dy_consum_account');

if (!account) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
    System.exit();
}


videoCount = storage.get('task_dy_consum_account_videoCount', 'int');

if (isNaN(videoCount) || videoCount <= 0) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
    System.exit();
}

tCommon.openApp();
//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {
        let res = task.run(account);
        if (res) {
            tCommon.sleep(3000);
            if (res == -1) {
                FloatDialogs.show('提示', '当前用户没有“喜欢”的视频');
            } else {
                FloatDialogs.show('提示', '已完成');
            }

            break;
        }

        if (res === false) {
            break;
        }

        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        tCommon.closeAlert(1);
        tCommon.backHome();
    }
}
