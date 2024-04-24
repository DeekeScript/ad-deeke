import { Common } from 'app/dy/Common.js';
import { Comment } from 'app/dy/Comment.js';
import { User } from 'app/dy/User.js';
import { Video } from 'app/dy/Video.js';

export let Message = {
    showAll() {
        let showTag = Common.id('text').text('查看全部').clickable(true).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().left > 0 && v.bounds().width() > 0;
        }).findOnce();

        if (showTag) {
            showTag.click();
            Common.sleep(1000 * Math.random() + 2000);
        }
    },

    getNumForDetail(str) {
        hour = /(\d+)小时前/.exec(str);
        if (hour && hour[1]) {
            return hour * 60;
        }

        minute = /(\d+)分钟前/.exec(str);
        return minute && minute[1];
    },

    //监听回复用户消息
    backMsg() {
        let rp = 3;
        while (rp--) {
            //读取消息数量
            let commentCountTags = Common.id('red_tips_count_view').descContains('未读消息').filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().left > 0 && v.bounds().width() > 0;
            }).find();

            if (!commentCountTags || commentCountTags.length === 0) {
                Common.sleep(10 * 1000);//休眠10秒
                Log.log('没消息，休息10秒')
                return false;
            }

            for (let i in commentCountTags) {
                if (isNaN(i)) {
                    continue;
                }

                let msgTag = commentCountTags[i].parent().children().findOne(Common.id('tv_title').descContains('互动消息'));
                if (!msgTag) {
                    continue;
                }

                Log.log('点击评论数量');
                Common.click(msgTag);
                Common.sleep(3000 + 2000 * Math.random());
            }

            let hudongTag = Common.id('tv_title').descContains('互动消息').filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().left > 0 && v.bounds().width() > 0;
            }).findOnce();

            if (hudongTag) {
                Common.click(hudongTag);
                Common.sleep(3000 + 2000 * Math.random());
            }
            Log.log('点击成功');
            break;
        }

        //进入了消息详情
        //this.showAll();
        let contents = [];
        let rpCount = 0;
        let stopCount = 0;

        while (true) {
            let containers = Common.id('jf').descMatches(/[\s\S]+[小时|分钟]前，[\s\S]+/).clickable(true).className('android.view.ViewGroup').find();
            if (containers.length === 0) {
                stopCount++;
            }

            for (let i in containers) {
                if (isNaN(i)) {
                    continue;
                }

                rpCount++;
                if (contents.includes(containers[i].desc())) {
                    continue;
                }

                let minutes = this.getNumForDetail(containers[i].desc());
                if (!minutes && minutes < 60) {
                    continue;
                }

                contents.push(containers[i].desc());

                let zanTag = containers[i].children().findOne(Common.id('c2s').descContains('赞'));
                if (zanTag) {
                    zanTag.click();
                    Common.sleep(500);
                }

                let commentTag = containers[i].children().findOne(Common.id('c5f').descContains('回复评论'));
                if (!commentTag) {
                    continue;
                }

                if (commentTag.click()) {
                    Common.sleep(2000 + 1000 * Math.random());
                }

                let iptTag = Common.id('dg0').filter((v) => {
                    return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0 && v.bounds().left > 0;
                }).findOnce();

                if (iptTag) {
                    Comment.iptEmoj(1 + Math.round(Math.random() * 3));
                    let rp = 3;
                    while (rp--) {
                        let submitTag = Common.id('ti6').findOnce();
                        if (!submitTag) {
                            break;
                        }

                        Common.click(submitTag);
                        Common.sleep(1000 + 1000 * Math.random());
                    }
                }
            }

            if (containers.length === rpCount) {
                stopCount++;
            } else {
                stopCount = 0;
            }

            if (stopCount >= 4) {
                Common.back();
                return true;
            }

            Log.log('stopCount', containers.length, rpCount);
            Common.swipe(0, 0.7);
            Common.sleep(3000 + 2000 * Math.random());
        }
    },

    search(account) {
        let searchTag = Common.id('k0t').clickable(true).desc('搜索').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().left > 0 && v.bounds().width() > 0;
        }).findOnce();
        if (!searchTag) {
            throw new Error('遇到错误，找不到输入框');
        }
        Common.click(searchTag);
        Common.sleep(2000);

        let iptTag = Common.id('et_search_kw').clickable(true).text('搜索').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().left > 0 && v.bounds().width() > 0;
        }).findOnce();

        if (!iptTag) {
            Log.log(Common.id('et_search_kw').clickable(true).text('搜索').findOne());
            throw new Error('遇到错误，找不到输入框-2');
        }

        iptTag.setText(account);
        Common.sleep(1000);
    },

    intoFansGroup(account, index) {
        this.search(account);
        let contents = [];

        let rpCount = 0;
        while (true) {
            let rp = 0;
            let allRp = 0;
            let groupTag = Common.id('c6k').text('群聊').filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().left > 0 && v.bounds().width() > 0;
            }).findOnce();
            if (!groupTag) {
                throw new Error('找不到群聊');
            }

            let contains = Common.id('content_container').filter((v) => {
                return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().left >= 0 && v.bounds().width() > 0;
            }).find();

            if (contains.length === 0) {
                throw new Error('找不到群聊-2');
            }

            for (let i in contains) {
                if (isNaN(i)) {
                    continue;
                }

                if (contains[i].bounds().top < groupTag.bounds().top) {
                    Log.log('非群聊');
                    continue;
                }

                let titleTag = contains[i].children().findOne(Common.id('ojv'));
                if (!titleTag || !titleTag.text()) {
                    continue;
                }

                allRp++;
                if (contents.includes(titleTag.text())) {
                    rp++;
                    continue;
                }

                contents.push(titleTag.text());
                if (contents.length === index) {
                    contains[i].click();
                    Common.sleep(3000 + 2000 * Math.random());
                    return true;
                }
            }
            if (allRp === rp) {
                rpCount++;
            } else {
                rpCount = 0;
            }

            if (rpCount >= 3) {
                return false;
            }
            Common.swipe(0, 0.5);
        }
    },

    intoGroupUserList(contents, getMsg, machineInclude, machineSet) {
        let tag = Common.id('r=7').desc('更多').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0 && v.bounds().left > 0;
        }).findOnce();

        if (!tag) {
            throw new Error('找不到“更多“');
        }
        tag.click();
        Common.sleep(2000 + 2000 * Math.random());

        // let intoGroupUserTag = Common.id('f+a').filter((v) => {
        //     return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0 && v.bounds().left >= 0;
        // }).findOnce();

        // if (!intoGroupUserTag) {
        //     throw new Error('找不到“查看群成员“');
        // }

        // intoGroupUserTag.click();
        // Common.sleep(2000 + 2000 * Math.random());

        let groupTag = new UiSelector().descContains('群成员按钮').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0 && v.bounds().left >= 0;
        }).findOnce();

        if (!groupTag) {
            throw new Error('找不到“groupTag“');
        }

        groupTag.click();
        Common.sleep(2300);
        Log.log(groupTag);

        let groupTag2 = new UiSelector().textContains('查看群成员').filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0 && v.bounds().left >= 0;
        }).findOnce();

        if (groupTag2) {
            Common.click(groupTag2);
            Common.sleep(3000);
        }

        // let searchTag = new UiSelector().textContains('搜索群成员').filter((v) => {
        //     return v && v.bounds() && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < Device.height() && v.bounds().width() > 0 && v.bounds().left > 0;
        // }).findOnce();

        // if (!searchTag) {
        //     throw new Error('找不到“searchTag“');
        // }

        let rpCount = 0;
        while (true) {
            let rp = 0;
            let count = 0
            let contains = Common.id('content').find();
            for (let i in contains) {
                if (isNaN(i)) {
                    continue;
                }

                count++;
                //Log.log(contains[i].bounds().top, groupTag.bounds().top);
                if (contains[i].bounds().top < groupTag.bounds().top) {
                    rp++;
                    continue;
                }

                // if (contains[i].bounds().top <= searchTag.bounds().top + searchTag.bounds().height()) {
                //     rp++;
                //     continue;
                // }

                if (contains[i].bounds().top > Device.height()) {
                    rp++;
                    continue;
                }

                let titleTag = contains[i].children().findOne(Common.id('tv_name')) || contains[i].children().findOne(Common.id('ojv'));
                if (!titleTag || !titleTag.text()) {
                    rp++;
                    continue;
                }

                if (contents.includes(titleTag.text()) || machineInclude(titleTag.text())) {
                    rp++;
                    continue;
                }

                contains[i].click();
                Common.sleep(2000 + 2000 * Math.random());
                let isPrivateAccount = User.isPrivate();
                if (isPrivateAccount) {
                    Common.back();
                    machineSet(titleTag.text());
                    contents.push(titleTag.text());
                    continue;
                }
                Log.log('是否是私密账号：' + isPrivateAccount);

                Log.log('即将进入视频');
                if (Video.intoUserVideo()) {
                    //点赞
                    if (Math.random() < 0.7) {
                        Video.clickZan();
                    }
                    Common.sleep(5000 + 5000 * Math.random());

                    //随机评论视频
                    let msg = getMsg(0, Video.getContent());
                    if (msg) {
                        Video.openComment(!!Video.getCommentCount());
                        Log.log('开启评论窗口');
                        Comment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                        Log.log('评论了');
                        Common.back(2, 800);
                        //this.commentData.push(tmp.commentMsgTime);//将评论的数据写上  这里的评论不计算频率
                    } else {
                        Common.back();//从视频页面到用户页面
                    }
                } else {
                    Log.log('未进入视频');
                }

                machineSet(titleTag.text());
                contents.push(titleTag.text());
                Common.back();
            }

            if (rp === count) {
                rpCount++;
            } else {
                rpCount = 0;
            }

            if (rpCount >= 3) {
                return true;
            }
            Common.swipe(0, 0.6);
            Log.log('滑动');
            Common.sleep(1000 + 1000 * Math.random());
        }
    }
}
