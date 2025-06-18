let tCommon = require('app/dy/Common.js');
let DyIndex = require('app/dy/Index.js');
let DySearch = require('app/dy/Search.js');
let DyUser = require('app/dy/User.js');
let DyVideo = require('app/dy/Video.js');
let storage = require('common/storage.js');
let machine = require('common/machine.js');
let DyComment = require('app/dy/Comment.js');
let baiduWenxin = require('service/baiduWenxin.js');

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    contents: [],
    lib_id: undefined,
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
        if (storage.getMachineType() === 1) {
            if (storage.get('setting_baidu_wenxin_switch',  'bool')) {
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
        tCommon.sleep(5000);
        while (true) {
            if (DyVideo.isLiving()) {
                Log.log('直播');
                tCommon.sleep(2000 + Math.random() * 2000);
                DyVideo.next();
                tCommon.sleep(2000);
                continue;
            }

            let title = DyVideo.getContent();
            let nickname = DyVideo.getNickname();
            let commentCount = DyVideo.getCommentCount();

            if (machine.get('task_dy_search_inquiry_' + nickname + "_" + title, 'bool') || commentCount <= 0) {
                Log.log('重复视频');
                tCommon.sleep(2000 + Math.random() * 2000);
                DyVideo.next();
                tCommon.sleep(2000);
                continue;
            }

            if (this.count-- <= 0) {
                return true;
            }

            //刷视频
            let processBar = DyVideo.getProcessBar();
            //Log.log('processBar', processBar, processBar && processBar.bounds().height(), processBar && processBar.bounds().top);
            if (storage.getPackage() !== 'org.autojs.autoxjs.v6') {
                if (processBar) {
                    let sleepSec = 10 + 10 * Math.random() - 5;
                    Log.log('休眠' + sleepSec + 's');
                    tCommon.sleep(sleepSec * 1000);//最后减去视频加载时间  和查询元素的时间
                } else {
                    let sleepSec = (5 + 10 * Math.random() - 5);
                    Log.log('休眠' + sleepSec + 's');
                    tCommon.sleep(sleepSec * 1000);//最后减去视频加载时间  和查询元素的时间
                }
            } else {
                let sleepSec = (5 + 10 * Math.random() - 5);
                Log.log('休眠' + sleepSec + 's');
                tCommon.sleep(sleepSec * 1000);//最后减去视频加载时间  和查询元素的时间
            }

            Log.log('看看是不是广告');
            //看看是不是广告，是的话，不操作作者
            if (DyVideo.viewDetail()) {
                let clickRePlayTag = tCommon.id('fw2').filter((v) => {
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
                Log.log('不是广告，准备进入主页');
            }

            DyVideo.openComment(!!commentCount);
            tCommon.sleep(3000);
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

                    if (comments[i].isZan) {
                        rp++;
                        continue;
                    }

                    if (comments[i].isAuthor) {
                        rp++;
                        continue;
                    }

                    DyComment.clickZan(comments[i]);
                    DyComment.intoUserPage(comments[i]);
                    //Log.log(comment);
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
                tCommon.swipeCommentListOp();
                tCommon.sleep(2000);
            }

            tCommon.back();
            machine.set('task_dy_search_inquiry_' + nickname + "_" + title, true);
            DyVideo.next();
            tCommon.sleep(2000);
        }
    },
}


// if (storage.getMachineType() !== 1) {
//     let libs = Http.post('dke', 'speechLibList', { type: 0 });
//     if (libs.code !== 0 || libs.data.total === 0) {
//         tCommon.showToast('请先在线上添加话术');
//          //console.hide();();
//         System.exit();
//     }

//     let opts = [];
//     for (let i in libs.data.data) {
//         opts.push(libs.data.data[i]['name'] + "[ID=" + libs.data.data[i]['id'] + "]");
//     }
//     let id = dialogs.select('请选择话术库', opts);
//     if (id <= 0) {
//         tCommon.showToast('取消了话术库选择');
//          //console.hide();();
//         System.exit();
//     }
//     task.lib_id = JSON.stringify([libs.data.data[id]['id']]);
//     tCommon.showToast('你选择了话术库：' + libs.data.data[id]['name'] + "[ID=" + libs.data.data[id]['id'] + "]");
// }

let keyword = machine.get("task_dy_search_inquiry");
if (!keyword) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
    System.exit();
}

let kws = machine.get('task_dy_search_inquiry_kws');

if (!kws) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
    System.exit();
}

task.count = machine.get('task_dy_search_inquiry_count', 'int');

Log.log("count: " + task.count);
if (!task.count) {
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
