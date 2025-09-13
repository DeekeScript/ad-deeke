let tCommon = require('app/ks/Common.js');
let KsIndex = require('app/ks/Index.js');
let KsSearch = require('app/ks/Search.js');
let KsUser = require('app/ks/User.js');
let KsVideo = require('app/ks/Video.js');
let storage = require('common/storage.js');
let machine = require('common/machine.js');
let KsComment = require('app/ks/Comment.js');
let baiduWenxin = require('service/baiduWenxin.js');

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
        let allFile = "log/log-search-inquiry-ks-" + file + ".txt";
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
        KsIndex.intoHome();
        KsIndex.intoSearchPage();
        KsSearch.homeIntoSearchVideo(keyword);
        tCommon.sleep(5000);
        while (true) {
            if (KsVideo.isLiving()) {
                Log.log('直播');
                tCommon.sleep(2000 + Math.random() * 2000);
                KsVideo.next();
                tCommon.sleep(2000);
                continue;
            }

            let title = KsVideo.getContent();
            let nickname = KsVideo.getNickname();
            let commentCount = KsVideo.getCommentCount();

            if (machine.get('task_ks_search_inquiry_' + nickname + "_" + title, 'bool') || commentCount <= 0) {
                Log.log('重复视频');
                tCommon.sleep(2000 + Math.random() * 2000);
                KsVideo.next();
                tCommon.sleep(2000);
                continue;
            }

            if (this.count-- <= 0) {
                return true;
            }

            //刷视频
            let sleepSec = (20 - 10 * Math.random());
            Log.log('休眠' + sleepSec + 's');
            tCommon.sleep(sleepSec * 1000);//最后减去视频加载时间  和查询元素的时间

            let tag = UiSelector().isVisibleToUser(true).filter(v => {
                return v.id() != null && v.id().indexOf('close') !== -1;
            }).findOne();

            if (tag) {
                Log.log('弹窗', tag);
                tCommon.click(tag);
                tCommon.sleep(1500 + Math.random() * 1500);
            }

            KsVideo.openComment(!!commentCount);
            tCommon.sleep(3000);
            let rpCount = 0;
            while (true) {
                Log.log('获取评论列表-开始');
                let comments = KsComment.getList();
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

                    KsComment.clickZan(comments[i]);
                    tCommon.sleep(1000 + 1000 * Math.random());
                    try {
                        KsComment.intoUserPage(comments[i]);
                    } catch (e) {
                        Log.log('跳转用户页失败');
                        continue;
                    }
                    //Log.log(comment);
                    Log.log('进入用户主页-2');
                    let userNickname;
                    try {
                        userNickname = KsUser.getNickname();////////操作   进入用户主页
                    } catch (e) {
                        Log.log(e, '继续');
                        if (e.toString().indexOf('找不到昵称') !== -1) {
                            continue;
                        }
                    }

                    let md5User = Encrypt.md5(nickname + userNickname);
                    if (!machine.get('task_ks_toker_comment_user_' + md5User, 'bool')) {
                        tCommon.back();
                        Log.log('重复用户');
                        continue;
                    }
                    machine.set('task_ks_toker_comment_user_' + md5User, true);

                    let isPrivateAccount = KsUser.isPrivate();
                    if (isPrivateAccount) {
                        tCommon.back();
                        tCommon.sleep(500);
                        continue;
                    }

                    if (KsVideo.intoUserVideo()) {
                        //随机评论视频
                        tCommon.sleep(5000 + 5000 * Math.random());
                        KsVideo.clickZan();
                        let msg = this.getMsg(0, KsVideo.getContent());
                        if (msg) {
                            KsVideo.openComment(!!KsVideo.getCommentCount());
                            Log.log('开启评论窗口');
                            KsComment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
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
            machine.set('task_ks_search_inquiry_' + nickname + "_" + title, true);
            KsVideo.next();
            tCommon.sleep(2000);
        }
    },
}

let keyword = machine.get("task_ks_search_inquiry");
if (!keyword) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
    System.exit();
}

let kws = machine.get('task_ks_search_inquiry_kws');

if (!kws) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
    System.exit();
}

task.count = machine.get('task_ks_search_inquiry_count', 'int');

Log.log("count: " + task.count);
if (!Access.isMediaProjectionEnable()) {
    FloatDialogs.show('温馨提示', '请打开主界面侧边栏，开启“图色查找”权限');
    System.exit();
}

tCommon.openApp();
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
