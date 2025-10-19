let tCommon = require('app/wx/Common.js');
let WxIndex = require('app/wx/Index.js');
let WxSearch = require('app/wx/Search.js');
let WxUser = require('app/wx/User.js');
let storage = require('common/storage.js');
let machine = require('common/machine.js');
let WxComment = require('app/wx/Comment.js');
let baiduWenxin = require('service/baiduWenxin.js');
let statistics = require('common/statistics.js');
let WxVideo = require('app/wx/Video.js');

let task = {
    contents: [],
    nicknames: [],
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
        let allFile = "log/log-wx-search-inquiry-" + file + ".txt";
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
                Log.log('匹配关键词', str, content.indexOf(str));
                return true;
            }
        }
        return false;
    },

    testTask(keyword) {
        //首先进入点赞页面
        WxIndex.intoHome();
        WxIndex.intoSearchPage();
        WxSearch.intoSearchList(keyword);
        tCommon.sleep(5000);
        while (true) {
            Log.log('新的视频');
            if (WxVideo.isLiving()) {
                Log.log('直播中');
                WxVideo.next();
                continue;
            }

            let content = WxVideo.getContent();
            if (this.contents.indexOf(content) !== -1) {
                Log.log('已经操作了，或者关键词不匹配');
                WxVideo.next();
                continue;
            }

            statistics.viewVideo();
            statistics.viewTargetVideo();
            Log.log('进入图文或者视频');
            let commentCount = WxVideo.getCommentCount();
            if (commentCount === 0) {
                Log.log('评论为0 ，下一个视频', i);
                WxVideo.next();
                continue;
            }

            if (this.count-- <= 0) {
                return true;
            }

            let nickname = WxVideo.getNickname();
            task.comments(nickname, commentCount);
            tCommon.sleep(3000);
            tCommon.back();
            machine.set('task_wx_search_inquiry_' + Encrypt.md5(nickname + "_" + content), true);
            this.contents.push(content);
            tCommon.sleep(1000 + 1000 * Math.random());
            WxVideo.next();
        }
    },

    comments(douyin, commentCount) {
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
                    return true;
                }
            } else {
                sw = 0;
            }

            for (let k in comments) {
                let nickname = comments[k].nickname;
                if (comments[k]['content'] == "" || !this.contains(comments[k]['content']) || this.nicknames.includes(nickname)) {
                    Log.log('数据：', comments[k]['content'], !this.contains(comments[k]['content']), this.nicknames.includes(nickname));
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
                    WxVideo.clickZan();
                    tCommon.sleep(1000 + 1000 * Math.random());
                    let msg = this.getMsg(0, WxVideo.getContent());
                    Log.log('msg', msg);
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
                    let msg = this.getMsg(1, comments[k].nickname);
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
    },
}

if (!Access.isMediaProjectionEnable()) {
    FloatDialogs.show('温馨提示', '请打开主界面侧边栏，开启“图色查找”权限');
    System.exit();
}

let keyword = machine.get("task_wx_search_inquiry");
if (!keyword) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
    System.exit();
}

let kws = machine.get('task_wx_search_inquiry_kws');

if (!kws) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
    System.exit();
}

task.count = machine.get('task_wx_search_inquiry_count', 'int');

Log.log("count: " + task.count);
if (!task.count) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
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
        tCommon.backHome();
    }
}
