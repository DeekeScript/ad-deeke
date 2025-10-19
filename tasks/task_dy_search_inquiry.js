let tCommon = require('app/dy/Common.js');
let DyIndex = require('app/dy/Index.js');
let DySearch = require('app/dy/Search.js');
let DyUser = require('app/dy/User.js');
let DyVideo = require('app/dy/Video.js');
let storage = require('common/storage.js');
let machine = require('common/machine.js');
let DyComment = require('app/dy/Comment.js');
let baiduWenxin = require('service/baiduWenxin.js');

let task = {
    contents: [],
    kws: [],
    count: 10,
    run(keyword, kws) {
        this.kws = tCommon.splitKeyword(kws);
        Log.log('keyword', keyword, this.count, this.kws);
        return this.testTask(keyword);
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-search-inquiry-" + file + ".txt";
        Log.setFile(allFile);
    },

    //type 0 评论，1私信
    getMsg(type, title, age, gender) {
        gender = ['女', '男', '未知'][gender];
        if (storage.getMachineType() === 1) {
            if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
                return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
            }
            return machine.getMsg(type) || false;//永远不会结束
        }
    },

    contains(content) {
        for (let str of this.kws) {
            if (content.indexOf(str) !== -1) {
                return true;
            }
        }
        return false;
    },

    testTask(keyword) {
        //首先进入点赞页面
        DyIndex.intoHome();
        DyIndex.intoSearchPage();
        DySearch.homeIntoSearchVideo(keyword);
        tCommon.sleep(4000 + 2000 * Math.random());
        while (true) {
            tCommon.sleep(1000 + 1000 * Math.random());
            if (DyVideo.isLiving()) {
                Log.log('直播');
                tCommon.sleep(1000 + Math.random() * 1000);
                DyVideo.next(true);
                continue;
            }

            //判断是不是评论窗口卡主
            let closeTag = UiSelector().clickable(true).desc('关闭').isVisibleToUser(true).findOne();
            if (closeTag) {
                Log.log('评论窗口');
                tCommon.click(closeTag);
                continue;
            }

            let title = DyVideo.getContent();
            let nickname = DyVideo.getNickname();
            let commentCount = DyVideo.getCommentCount();

            let md5 = Encrypt.md5(nickname + "_" + title);
            if (machine.get('task_dy_search_inquiry_' + md5, 'bool') || commentCount <= 0) {
                Log.log('重复视频');
                DyVideo.next(true);
                continue;
            }

            if (this.count-- <= 0) {
                return true;
            }

            //刷视频
            if (DyVideo.getProcessBar()) {
                let sleepSec = 10 + 10 * Math.random() - 5;
                Log.log('休眠' + sleepSec + 's');
                tCommon.sleep(sleepSec * 1000);//最后减去视频加载时间  和查询元素的时间
            } else {
                let sleepSec = (5 + 10 * Math.random() - 5);
                Log.log('休眠' + sleepSec + 's');
                tCommon.sleep(sleepSec * 1000);//最后减去视频加载时间  和查询元素的时间
            }

            Log.log('看看是不是广告');
            if (DyVideo.viewDetail()) {
                DyVideo.next(true);
                continue;
            } else {
                Log.log('不是广告，准备进入主页');
            }

            DyVideo.openComment(!!commentCount);
            tCommon.sleep(2000 + 2000 * Math.random());
            let rpCount = 0;
            while (true) {
                Log.log('获取评论列表-开始');
                let comments = DyComment.getList();
                Log.log('获取到了评论列表：' + comments.length);
                if (comments.length === 0) {
                    break;
                }

                let contains = [];
                let rp = 0;
                for (let i in comments) {
                    Log.log('title', comments[i].nickname, comments[i].content);
                    if (!comments[i].content) {
                        Log.log('没有内容');
                        continue;
                    }

                    if (contains.indexOf(comments[i].nickname + '_' + comments[i].content) !== -1) {
                        rp++;
                        continue;
                    }
                    contains.push(comments[i].nickname + '_' + comments[i].content);
                    let ctn = this.contains(comments[i].content);
                    Log.log('ctn', ctn);
                    if (!ctn) {
                        continue;
                    }

                    if (comments[i].isZan || comments[i].isAuthor) {
                        rp++;
                        continue;
                    }

                    try {
                        DyComment.clickZan(comments[i]);
                    } catch (e) {
                        Log.log(e, '赞找不到了');
                    }
                    DyComment.intoUserPage(comments[i]);
                    Log.log('进入用户主页-2');
                    let userNickname;
                    try {
                        userNickname = DyUser.getNickname();////////操作   进入用户主页
                    } catch (e) {
                        Log.log(e, '继续');
                        if (e.toString().indexOf('找不到昵称') !== -1) {
                            continue;
                        }
                    }

                    let isPrivateAccount = DyUser.isPrivate();
                    if (isPrivateAccount) {
                        tCommon.back();
                        tCommon.sleep(500);
                        continue;
                    }

                    if (DyVideo.intoUserVideo()) {
                        //随机评论视频
                        tCommon.sleep(5000 + 5000 * Math.random());
                        try {
                            DyVideo.clickZan();
                            let msg = this.getMsg(0, DyVideo.getContent());
                            if (msg) {
                                DyVideo.openComment(!!DyVideo.getCommentCount());
                                Log.log('开启评论窗口');
                                DyComment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                                Log.log('评论了');
                                tCommon.back(2, 800);
                            } else {
                                tCommon.back();//从视频页面到用户页面
                            }
                        } catch (e) {
                            //异常了，回到主要
                            Log.log('操作异常了', e);
                            DyUser.backHome();
                        }
                    } else {
                        Log.log('未进入视频');
                    }

                    tCommon.back();
                    tCommon.sleep(500);
                }

                if (rp === comments.length) {
                    rpCount++;
                    if (rpCount >= 3) {
                        Log.log('rp', rp, rpCount);
                        break;
                    }
                } else {
                    rpCount = 0;
                }

                Log.log('滑动评论');
                if (!tCommon.swipeCommentListOp()) {
                    Log.log('到底了');
                    break;
                }
                tCommon.sleep(2000);
            }

            tCommon.back();
            machine.set('task_dy_search_inquiry_' + md5, true);
            DyVideo.next();
            tCommon.sleep(2000);
        }
    },
}

let keyword = machine.get("task_dy_search_inquiry");
if (!keyword) {
    FloatDialogs.show('请设置询盘关键词');
    System.exit();
}

let kws = machine.get('task_dy_search_inquiry_kws');
if (!kws) {
    FloatDialogs.show('请设置触发关键词');
    System.exit();
}

task.count = machine.get('task_dy_search_inquiry_count', 'int');
Log.log("count: " + task.count);

tCommon.openApp();
//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");
System.setAccessibilityMode('!fast');//快速模式

while (true) {
    task.log();
    try {
        let res = task.run(keyword, kws);
        if (res) {
            tCommon.sleep(3000);
            FloatDialogs.show('提示', '已完成');
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
