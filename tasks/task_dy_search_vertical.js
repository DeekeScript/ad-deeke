let tCommon = require("app/dy/Common");
let DyIndex = require('app/dy/Index.js');
let DySearch = require('app/dy/Search.js');
let DyVideo = require('app/dy/Video.js');
let storage = require("common/storage");
let machine = require("common/machine");
let DyComment = require('app/dy/Comment.js');
let baiduWenxin = require("service/baiduWenxin");
let statistics = require("common/statistics");
let DyUser = require('app/dy/User.js');

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    contents: [],
    lib_id: undefined,
    count: 100,
    zanRate: storage.get('task_dy_search_zan_rate', 'int'),
    commentRate: storage.get('task_dy_search_comment_rate', 'int'),
    focusRate: storage.get('task_dy_search_focus_rate', 'int'),
    run(keyword) {
        return this.testTask(keyword);
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-search-vertical-" + file + ".txt";
        Log.setFile(allFile);
    },

    //type 0 评论，1私信
    getMsg(type, title, age, gender) {
        if (storage.getMachineType() === 1) {
            if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
                return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
            }
            return machine.getMsg(type) || false;//永远不会结束
        }
    },

    testTask(keyword) {
        //首先进入点赞页面
        DyIndex.intoHome();
        DyIndex.intoSearchPage();
        DySearch.homeIntoSearchVideo(keyword);
        tCommon.sleep(5000);

        let rpCount = 0;
        let noNicknameCount = 0;
        while (true) {
            try {
                if (DyVideo.isLiving()) {
                    Log.log('直播');
                    tCommon.sleep(2000 + Math.random() * 2000);
                    DyVideo.next();
                    tCommon.sleep(2000);
                    continue;
                }

                let title = DyVideo.getContent();
                let nickname = DyVideo.getNickname();

                if (machine.get('task_dy_search_vertical_' + nickname + "_" + title, 'bool')) {
                    Log.log('重复视频');
                    tCommon.sleep(2000 + Math.random() * 2000);
                    DyVideo.next();
                    tCommon.sleep(2000);
                    continue;
                }

                statistics.viewVideo();
                statistics.viewTargetVideo();

                if (this.contents.includes(nickname + '_' + title)) {
                    rpCount++;
                    if (rpCount > 3) {
                        return true;
                    }
                }

                rpCount = 0;

                if (this.count-- <= 0) {
                    return true;
                }

                //刷视频
                let sleepSec = (10 + 10 * Math.random());
                Log.log('休眠' + sleepSec + 's');
                tCommon.sleep(sleepSec * 1000);//最后减去视频加载时间  和查询元素的时间

                Log.log('看看是不是广告');
                //看看是不是广告，是的话，不操作作者
                if (DyVideo.viewDetail()) {
                    let clickRePlayTag = UiSelector().textContains('点击重播').filter((v) => {
                        return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0 && v.bounds().left > 0;
                    }).findOnce();
                    if (clickRePlayTag) {
                        Log.log('点击重播');
                        clickRePlayTag.click();
                        tCommon.sleep(1000);
                    }
                    Gesture.click(500 + Math.random() * 200, 500 + Math.random() * 300);
                    tCommon.sleep(1500);
                } else {
                    //Log.log('不是广告，准备进入主页');
                }

                let commentCount = DyVideo.getCommentCount();

                if (Math.random() * 100 <= task.commentRate) {
                    Log.log('评论')
                    let videoTitle = DyVideo.getContent();
                    DyVideo.openComment(!!commentCount);
                    tCommon.sleep(500 + 500 * Math.random());
                    let msg = this.getMsg(0, videoTitle);
                    DyComment.commentMsg(msg.msg);
                    tCommon.sleep(2000 + 2000 * Math.random());
                    tCommon.back();
                    tCommon.sleep(500);
                }

                if (Math.random() * 100 <= task.zanRate) {
                    Log.log('点赞');
                    DyVideo.clickZan();
                    tCommon.sleep(1000 + 1000 * Math.random());
                }

                if (Math.random() * 100 <= task.focusRate) {
                    DyVideo.intoUserPage();
                    tCommon.sleep(3000 + 1000 * Math.random());
                    Log.log('关注开始');
                    DyUser.focus();
                    tCommon.sleep(1000 + 1000 * Math.random());
                    tCommon.back();
                    Log.log('关注完成');
                }

                machine.set('task_dy_search_vertical_' + nickname + "_" + title, true);
                this.contents.push(nickname + "_" + title);
                DyVideo.next();
                tCommon.sleep(2000);
                noNicknameCount = 0;
            } catch (e) {
                Log.log(e);
                if (noNicknameCount++ >= 3) {
                    if (noNicknameCount > 6) {
                        Log.log('多次退出未解决问题');
                        break;
                    }
                    tCommon.back();
                    tCommon.sleep(500);
                    DyVideo.next();
                    tCommon.sleep(2000);
                }
                continue;
            }
        }
    },
}

let keyword = storage.get('task_dy_search_vertical');
if (!keyword) {
    tCommon.showToast('请设置关键词');
    //console.hide();();
    System.exit();
}

task.count = storage.get('task_dy_search_count', 'int');
if (!task.count) {
    tCommon.showToast('请设置刷视频数量');
    //console.hide();();
    System.exit();
}

tCommon.openApp();
//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {
        let res = task.run(keyword);
        if (res) {
            tCommon.sleep(3000);
            FloatDialogs.show('提示', '已完成');
            break;
        }

        if (res === false) {
            tCommon.sleep(3000);
            FloatDialogs.show('提示', '已完成');
            break;
        }

        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        tCommon.closeAlert(1);
        tCommon.backHome();
    }
}
