let tCommon = require('app/xhs/Common.js');
let XhsIndex = require('app/xhs/Index.js');
let XhsSearch = require('app/xhs/Search.js');
let XhsUser = require('app/xhs/User.js');
let storage = require('common/storage.js');
let machine = require('common/machine.js');
let XhsComment = require('app/xhs/Comment.js');
let baiduWenxin = require('service/baiduWenxin.js');
let statistics = require('common/statistics.js');
let XhsWork = require('app/xhs/Work.js');

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
        let allFile = "log/log-xhs-search-inquiry-" + file + ".txt";
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
        XhsIndex.intoIndex();
        XhsIndex.intoSearchPage();
        XhsSearch.intoSearchList(keyword);
        let minTopTag = UiSelector().className('androidx.appcompat.app.ActionBar$Tab').isVisibleToUser(true).findOne();
        let minTop = 0;
        if (minTopTag) {
            minTop = minTopTag.bounds().top + minTopTag.bounds().height();
        }
        Log.log('minTop: ' + minTop);
        while (true) {
            let isFresh = false;
            let videos = XhsSearch.getList();//返回视频或者图文列表 [{content: 'content', tag: tag, isLiving: true}]
            for (let i in videos) {
                Log.log(videos[i]);
                if (videos[i].isLiving) {
                    Log.log('直播中');
                    continue;
                }

                let content = videos[i].content;
                if (content.length > 40) {
                    content = content.substring(0, 40);
                }
                if (this.contents.indexOf(content) !== -1) {
                    Log.log('已经操作了，或者关键词不匹配');
                    continue;
                }

                this.contents.push(content);
                //确保没有刷新，查找对应标题是否存在
                Log.log('content', content);
                let titleTag = UiSelector().className('android.widget.TextView').textContains(content).isVisibleToUser(true).findOne();
                if (!titleTag) {
                    Log.log('页面已经刷新了');
                    isFresh = true;
                    break;
                }

                if (titleTag.bounds().top < minTop) {
                    Log.log('超出上边界');
                    continue;
                }

                Log.log(titleTag);
                tCommon.click(titleTag, 0.15);
                tCommon.sleep(4000 + 3000 * Math.random());
                statistics.viewVideo();
                statistics.viewTargetVideo();
                Log.log('进入图文或者视频');
                let commentCount = XhsWork.getCommentCount();
                if (commentCount === 0) {
                    Log.log('评论为0 ，下一个视频', i);
                    if (UiSelector().className('android.widget.TextView').text('搜索').exists()) {
                        Log.log('未进入 图文或者视频');
                        continue;
                    }
                    tCommon.back();
                    tCommon.sleep(2000 + 2000 * Math.random());
                    continue;
                }

                let title = XhsWork.getContent();
                let nickname = XhsWork.getNickname();
                if (machine.get('task_xhs_search_inquiry_' + Encrypt.md5(nickname + "_" + title), 'bool')) {
                    Log.log('重复视频，返回');
                    tCommon.back();
                    tCommon.sleep(2000 + Math.random() * 2000);
                    continue;
                }

                if (this.count-- <= 0) {
                    return true;
                }

                try {
                    task.comments(nickname, commentCount);
                } catch (e) {
                    Log.log('出错了，尝试修复问题');
                }
                tCommon.sleep(3000);
                tCommon.back();
                while (true) {
                    //判断是不是在搜索页面
                    let isSearchTag = UiSelector().className('android.widget.TextView').text(keyword).isVisibleToUser(true).findOne();
                    if (!isSearchTag) {
                        tCommon.back();
                        Log.log('不在搜索页面，返回');
                        tCommon.sleep(1000 + 1000 * Math.random());
                        continue;
                    }
                    break;
                }
                machine.set('task_xhs_search_inquiry_' + Encrypt.md5(nickname + "_" + title), true);
                tCommon.sleep(2000 + 2000 * Math.random());
            }

            if (isFresh) {
                tCommon.sleep(2000 + 2000 * Math.random());
                Log.log('已刷新');
                continue;
            }
            Log.log('滑动');
            tCommon.swipe(0, 0.85);
            tCommon.sleep(3000 + 3000 * Math.random());
        }
    },

    comments(douyin, commentCount) {
        let isVideo = XhsWork.isVideo();
        XhsWork.openComment();
        Log.log('打开或者滑动到评论区域');

        tCommon.sleep(2000 + 1000 * Math.random());
        let maxSwipe = commentCount;//最多滑动次数
        while (maxSwipe-- > 0) {
            let comments = XhsWork.getCommenList();//nicknameTag列表
            for (let k in comments) {
                try {
                    let nickname = comments[k].nicknameTag.text();
                    if (comments[k]['content'] == "" || !this.contains(comments[k]['content']) || this.nicknames.includes(nickname)) {
                        Log.log('数据：', comments[k]['content'], !this.contains(comments[k]['content']), this.nicknames.includes(nickname));
                        continue;
                    }

                    let md5User = Encrypt.md5(douyin + nickname);
                    if (machine.get('task_xhs_search_inquiry_' + md5User, 'bool')) {
                        Log.log('重复');
                        continue;
                    }
                    Log.log('找到了关键词', comments[k]['content']);

                    XhsComment.clickZan(comments[k].zanTag);
                    this.nicknames.push(nickname);
                    machine.set('task_xhs_search_inquiry_' + md5User, true);
                    XhsComment.intoUserPage(comments[k].nicknameTag);
                    //私密账号
                    if (XhsUser.isPrivate()) {
                        tCommon.back();
                        tCommon.sleep(1000 + 500 * Math.random());
                        Log.log('私密账号');
                        continue;
                    }

                    //开始操作评论
                    if (XhsUser.intoVideo()) {
                        Log.log('有视频，直接操作视频引流');
                        XhsWork.zan();
                        let msg = this.getMsg(0, XhsWork.getContent());
                        if (msg) {
                            XhsWork.msg(0, msg.msg);///////////////////////////////////操作  评论视频
                            Log.log('评论了');
                            // if (XhsWork.isVideo()) {
                            //     tCommon.back();
                            //     tCommon.sleep(1000 + 1000 * Math.random());
                            // }
                        }
                        tCommon.back();//从视频页面到用户页面
                    } else {
                        Log.log('无视频，直接操作关注和私信引流');
                        XhsUser.focus();
                        let msg = this.getMsg(1, comments[k].nickname);
                        if (msg) {
                            XhsUser.privateMsg(msg.msg);
                        }
                    }
                    tCommon.back();
                    tCommon.sleep(1000 + 1000 * Math.random());
                } catch (e) {
                    Log.log(e);
                    //如果在用户页面，则返回
                    if (UiSelector().className('android.view.View').descContains('头像').isVisibleToUser().findOne()) {
                        tCommon.back();
                        tCommon.sleep(1000 + 1000 * Math.random());
                        continue;
                    }
                }
            }

            if (UiSelector().className('android.widget.TextView').text('- 到底了 -').isVisibleToUser(true).findOne()) {
                tCommon.sleep(1000);
                Log.log('评论扫描完了，已到底');
                if (isVideo) {
                    tCommon.back();
                    tCommon.sleep(500 + 500 * Math.random());
                }

                break;
            }

            Log.log('下一页评论');
            XhsWork.commentListSwipe();
            tCommon.sleep(1500 + 500 * Math.random());
        }
    },
}


let keyword = machine.get("task_xhs_search_inquiry");
if (!keyword) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
    System.exit();
}

let kws = machine.get('task_xhs_search_inquiry_kws');

if (!kws) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
    System.exit();
}

task.count = machine.get('task_xhs_search_inquiry_count', 'int');

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
