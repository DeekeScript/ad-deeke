let tCommon = require('../app/dy/Common.js');
let DyIndex = require('../app/dy/Index.js');
let DySearch = require('../app/dy/Search.js');
let DyUser = require('../app/dy/User.js');
let DyVideo = require('../app/dy/Video.js');
let storage = require('../common/storage.js');
let machine = require('../common/machine.js');
let DyComment = require('../app/dy/Comment.js');
let baiduWenxin = require('../service/baiduWenxin.js');
let statistics = require('../common/statistics');

/**
 * 抖音 61289909097   93710978603
 * 指定账号喜欢列表刷视频；操作：点赞，评论、评论点赞、访问主页（视频作者）；
 * 规则：喜欢列表逐个刷视频，点赞、评论、访问主页、评论点赞按设置频率执行。观看视频约5-15秒；
 * 不介意遇到异常回来花一定时间找到视频，只要能够找到。
 */

let videoCount = 500;
let zanRate = 100;
let commentRate = 50;
let commentZanRate = 50;
let visitRate = 70;
let commentZanMax = 30;

/**
 * 读取频率，未设置时使用默认值
 * @param {string} key
 * @param {number} defaultValue
 * @returns {number}
 */
function getRate(key, defaultValue) {
    if (!storage.exist(key)) {
        return defaultValue;
    }
    let value = storage.get(key, 'int');
    if (isNaN(value)) {
        return defaultValue;
    }
    return value;
}

let task = {
    contents: [],
    /**
     * 
     * @param {any} account 
     * @returns 
     */
    run(account) {
        return this.testTask(account);
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-dy-consum-user-" + file + ".txt";
        Log.setFile(allFile);
        require('../common/runEnv.js').write('com.ss.android.ugc.aweme');
    },

    //type 0 评论，1私信
    /**
     * 
     * @param {number} type 
     * @param {string} [title] 
     * @param {number} [age] 
     * @param {number} [gender] 
     * @returns {any}
     */
    getMsg(type, title, age, gender = 2) {
        let genderStr = ['女', '男', '未知'][gender];
        if ((!storage.exist('setting_baidu_wenxin_switch') || storage.get('setting_baidu_wenxin_switch', 'bool'))) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, genderStr) : baiduWenxin.getComment(title) };
        }
        return machine.getMsg(type) || false;//永远不会结束
    },

    /**
     * 
     * @param {any} account 
     * @returns 
     */
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

        let currentNickname = DyUser.getNickname();
        Log.log('操作抖音昵称：', currentNickname);

        //进入喜欢视频列表
        if (!DyIndex.intoLikeVideo()) {
            Log.log('没有喜欢的视频，无法操作');
            return -1;
        }

        /**
         * 指定账号喜欢列表刷视频；操作：点赞，评论、评论点赞、访问主页（视频作者）；
         * 规则：喜欢列表逐个刷视频，点赞、评论、访问主页、评论点赞按设置频率执行。观看视频约5-15秒；
         * 不介意遇到异常回来花一定时间找到视频，只要能够找到。
         */
        let errorCount = 0;
        while (true) {
            try {
                while (true) {
                    let videoNickname = DyVideo.getAtNickname();
                    if (DyVideo.isZan()) {
                        System.toast('已经点赞了');
                        Log.log('已经点赞了');
                    } else if (videoNickname == currentNickname) {
                        System.toast('当前账号的视频，不操作');
                        Log.log('当前账号的视频，不操作');
                    } else {
                        break;
                    }
                    if (!DyVideo.next()) {
                        return true;
                    }
                    Log.log('滑动视频');
                    tCommon.sleep(1000 * (Math.random() * 1 + 3));
                }

                System.toast('开始模拟观看视频');
                tCommon.sleep(1000 * (Math.random() * 10 + 5));
                System.toast('开始操作视频');
                if (Math.random() * 100 < zanRate) {
                    DyVideo.clickZan();
                }
                errorCount = 0;
                statistics.viewVideo();
                statistics.viewTargetVideo();
                videoCount--;
                if (videoCount <= 0) {
                    return true;
                }

                tCommon.sleep(2000 + 2000 * Math.random())
                let doComment = Math.random() * 100 < commentRate;
                let doCommentZan = Math.random() * 100 < commentZanRate;
                if (doComment || doCommentZan) {
                    let count = DyVideo.getCommentCount();
                    let videoTitle = DyVideo.getContent();
                    DyVideo.openComment(!!count);
                    try {
                        Log.log('评论数：', count, '评论', doComment, '评论区点赞', doCommentZan);
                        System.setAccessibilityMode('!fast');//非快速模式
                        if (doCommentZan) {
                            DyComment.zanComment(count, undefined, commentZanMax);
                        }
                        if (doComment) {
                            let msg = this.getMsg(0, videoTitle);
                            if (msg) {
                                DyComment.commentMsg(msg.msg);
                            }
                        }
                        //点关闭按钮收起评论区。系统返回会退出视频，回到喜欢列表
                        DyComment.closeCommentWindow();
                    } catch (e) {
                        Log.log(e)
                    }
                    System.setAccessibilityMode('fast');//快速模式
                    tCommon.sleep(1500);
                }

                if (Math.random() * 100 < visitRate) {
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
                        Log.log('找不到标题内容')
                    }

                    tCommon.sleep(1000);
                }

                if (!DyVideo.next()) {
                    return true;
                }
                tCommon.sleep(1000 * (Math.random() * 1 + 3));
            } catch (e) {
                Log.log('异常', e);
                errorCount++;
                if (errorCount > 3) {
                    return true;
                }
            }
        }
    },
}

let account = storage.get('task_dy_consum_account');

if (!account) {
    tCommon.showToast('你取消了执行');
    System.exit();
}


videoCount = storage.get('task_dy_consum_account_videoCount', 'int');
zanRate = getRate('task_dy_consum_zan_rate', 100);
commentRate = getRate('task_dy_consum_comment_rate', 50);
commentZanRate = getRate('task_dy_consum_comment_zan_rate', 50);
visitRate = getRate('task_dy_consum_visit_rate', 70);
commentZanMax = getRate('task_dy_consum_comment_zan_max', 30);
Log.log('频率设置', zanRate, commentRate, commentZanRate, visitRate, commentZanMax);

if (isNaN(videoCount) || videoCount <= 0) {
    tCommon.showToast('你取消了执行');
    System.exit();
}

System.setAccessibilityMode('fast');//快速模式
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

        /** @ts-ignore */
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
