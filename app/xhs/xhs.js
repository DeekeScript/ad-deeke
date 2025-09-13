let storage = require("common/storage.js");
let V = require("version/XhsV.js");
let Common = require("app/xhs/Common.js");
let Index = require("app/xhs/Index.js");
let User = require("app/xhs/User.js");
let Work = require("app/xhs/Work.js");

let xhs = {
    config: {
        isCity: storage.get('toker_xhs_is_city', 'bool'),
        opWait: storage.get('toker_xhs_op_second', 'int') * 1000,//操作间隔
        workWait: storage.get('toker_xhs_view_video_second', 'int') * 1000,
        keywords: storage.get('toker_xhs_view_video_keywords', 'string'),
        toker_view_video_ip: storage.get('toker_xhs_view_video_ip', 'string'),
        zanRate: storage.get('toker_xhs_zan_rate', 'int') / 100,
        commentRate: storage.get('toker_xhs_comment_rate', 'int') / 100,
        focusRate: storage.get('toker_focus_rate', 'int') / 100,
        privatMsgRate: storage.get('toker_xhs_private_msg_rate', 'int') / 100,
        zanCommentRate: storage.get('toker_comment_area_zan_rate', 'int') / 100,
        sex: storage.getArray('toker_xhs_run_sex'),
        minAge: storage.get('toker_xhs_run_min_age', 'int'),
        maxAge: storage.get('toker_xhs_run_max_age', 'int'),
        toker_run_hour: storage.getArray('toker_xhs_run_hour'),//运行时间
    },

    taskCheck() {
        //查看是否到了时间，没有的话，直接返回flase
        let hour = this.config.toker_run_hour;
        if (!hour.includes("" + (new Date()).getHours())) {
            return 101;//不在任务时间
        }

        return 0;
    },
    run(getMsg) {
        Log.log(this.config);
        if (this.config.isCity) {
            Index.intoCity();
        } else {
            Index.intoIndex();
        }

        Common.sleep(3000 + 3000 * Math.random());

        let titles = [];
        //let spCount = 0;//滑动3次没内容，就判断是不是没有回到主页
        while (true) {
            try {
                let rs = this.taskCheck();
                if (rs != 0) {
                    return rs;
                }
                let containers = UiSelector().filter(v => {
                    return v.desc() && (v.desc().indexOf('笔记') === 0 || v.desc().indexOf('视频') === 0) && ['android.widget.LinearLayout', 'android.widget.FrameLayout'].includes(v.className());
                }).isVisibleToUser(true).find();

                if (!UiSelector().className('android.widget.ImageView').desc('菜单').isVisibleToUser(true).findOne()) {
                    Log.log('没有返回到主界面， 返回');
                    Common.back();
                    Common.sleep(1000);
                    continue;
                }

                for (let i = 0; i < containers.length; i++) {
                    if (!UiSelector().className('android.widget.ImageView').desc('菜单').isVisibleToUser(true).findOne()) {
                        Log.log('没有返回到主界面， 返回');
                        Common.back();
                        Common.sleep(1000);
                        continue;
                    }

                    let tag = containers[i];
                    let title = Index.getTitle(tag.desc());
                    if (titles.indexOf(title) != -1) {
                        Log.log('重复');
                        continue;
                    }

                    titles.push(title);
                    if (titles.length >= 20) {
                        titles.shift();
                    }

                    Common.sleep(this.config.opWait / 2 + this.config.opWait * Math.random());
                    Log.log('tag', tag, tag.desc());
                    let type = Index.getType(tag.desc());//0笔记，1视频
                    Log.log('类型是：', type == 0 ? '笔记' : '视频', type);

                    if (this.config.keywords && !Common.containsWord(this.config.keywords, title)) {
                        Log.log('关键词不符合');
                        continue;
                    }

                    let currentZanRate = Math.random();
                    let currentCommentRate = Math.random();

                    //进入 笔记或者视频 操作  这里不直接点击tag，因为这样会点击到“赞”或者“用户头像“
                    if (!Index.intoNote(tag, type)) {
                        //没有进入成功，继续
                        Log.log('没有进入成功');
                        continue;
                    }

                    let swipeNodeCount = Math.round(Math.random() * 3);
                    let wait = this.config.workWait / (swipeNodeCount + 1);

                    if (type === 0) {
                        Common.sleep(wait + 2000 * Math.random());
                        if (swipeNodeCount) {
                            while (swipeNodeCount-- > 0) {
                                Common.swipe(0, 1 / (swipeNodeCount + 1));
                                Common.sleep(wait + 2000 * Math.random());
                            }
                        }

                        //笔记需要筛选IP
                        if (this.config.toker_view_video_ip) {
                            let ipTag = UiSelector().className('android.view.View').descMatches('\\d+[\\u4e00-\\u9fa5]+$').findOne();
                            let match = ipTag.desc().match(/\d+([\u4e00-\u9fa5]+)/);
                            Log.log('ipTag', ipTag, match);
                            if (!ipTag || match.length != 2 || !Common.containsWord(this.config.toker_view_video_ip, match[1])) {
                                Common.back();
                                Common.sleep(1000);
                                Log.log('IP不符合', this.config.toker_view_video_ip, ipTag ? ipTag.desc() : '无');
                                continue;
                            }
                        }
                    } else {
                        Common.sleep(wait * (swipeNodeCount + 1));//视频不需要滑动
                    }

                    //是否点赞
                    if (currentZanRate < this.config.zanRate) {
                        Log.log('点赞');
                        Work.zan();
                        Common.sleep(1500 + 1000 * Math.random());
                    }

                    if (currentCommentRate < this.config.commentRate) {
                        let ttt = getMsg(0, title);
                        let msg = ttt ? ttt.msg : '';
                        Log.log('评论内容：', msg);
                        if (msg) {
                            Work.msg(type, msg);
                            Common.sleep(500 + 1000 * Math.random());
                        }
                    }

                    //点赞数量
                    if (Work.getCommentCount(type)) {
                        Log.log('点赞评论');
                        Work.zanComment(type, 5);//随机赞5个
                    }

                    if (this.config.focusRate > Math.random()) {
                        Common.sleep(1000 + 1000 * Math.random());
                        Log.log('关注了');
                        Work.focus(type);
                        Common.sleep(2000 + 2000 * Math.random());
                    }

                    Common.back();
                    Common.sleep(1000 + 1000 * Math.random());
                }

                Log.log('滑动');
                Index.swipe(this.config.isCity);
                Common.sleep(2000 + 2000 * Math.random());
            } catch (e) {
                Log.log('异常了', e);
                if (!UiSelector().className('android.widget.ImageView').desc('菜单').isVisibleToUser(true).findOne()) {
                    Common.back();
                    Common.sleep(1000);
                }
            }
        }
    }
}

module.exports = xhs;
