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
        zanRate: storage.get('toker_xhs_zan_rate', 'int') / 100,
        commentRate: storage.get('toker_xhs_comment_rate', 'int') / 100,
        focusRate: storage.get('toker_focus_rate', 'int') / 100,
        privatMsgRate: storage.get('toker_xhs_private_msg_rate', 'int') / 100,
        zanCommentRate: storage.get('toker_comment_area_zan_rate', 'int') / 100,
        sex: storage.getArray('toker_xhs_run_sex'),
        minAge: storage.get('toker_xhs_run_min_age', 'int'),
        maxAge: storage.get('toker_xhs_run_max_age', 'int'),
        op: storage.getArray('toker_xhs_run_hour'),//运行时间
    },
    run(getMsg) {
        if (this.config.isCity) {
            Index.intoCity();
        } else {
            Index.intoIndex();
        }
        Common.sleep(1000);
        Index.refresh();
        Common.sleep(3000);

        let titles = [];

        while (true) {
            try {
                let container;
                if (this.config.isCity) {
                    container = Common.id(V.Index.containerCity[0]).isVisibleToUser(true).findOne();
                } else {
                    container = Common.id(V.Index.container[0]).isVisibleToUser(true).findOne();
                }
                let containers = container.children();
                let len = containers.length();
                for (let i = 0; i < len; i++) {
                    let tag = containers.getChildren(i);
                    if (!tag.isVisibleToUser()) {
                        Log.log('视线外');
                        continue;
                    }

                    let title = Index.getTitle(tag.desc());
                    if (titles.indexOf(title) != -1) {
                        Log.log('重复');
                        continue;
                    }

                    titles.push(title);
                    if (titles.length >= 20) {
                        titles.shift();
                    }

                    Common.sleep(this.config.opWait);
                    //let zanCount = Index.getZanCount(tag.desc());
                    Log.log('tag', tag, tag.desc());
                    let type = Index.getType(tag.desc());//0笔记，1视频
                    Log.log('类型是：', type == 0 ? '笔记' : '视频');

                    if (this.config.keywords && !Common.containsWord(this.config.keywords, title)) {
                        Log.log('关键词不符合');
                        continue;
                    }

                    let currentZanRate = Math.random();
                    let currentCommentRate = Math.random();

                    if (currentZanRate < this.config.zanRate) {
                        if (!this.config.isCity && Math.random() < 0.2) {
                            //20%直接点赞不进入视频或者图文   80%需要进入浏览再操作
                            let zanTag = Common.id(V.Index.zan[0]).isVisibleToUser(true).find();
                            Log.log('赞控件', zanTag && zanTag[i]);
                            if (zanTag[i]) {
                                Index.zan(zanTag[i]);
                            }
                            continue;
                        }
                    }

                    //进入 笔记或者视频 操作  这里不直接点击tag，因为这样会点击到“赞”或者“用户头像“
                    if (!Index.intoNote(tag, type)) {
                        //没有进入成功，继续
                        Log.log('没有进入成功');
                        continue;
                    }

                    let swipeNodeCount = Math.round(Math.random() * 3);
                    let wait = this.config.workWait / (swipeNodeCount + 1);

                    if (type === 0) {
                        Common.sleep(wait);
                        if (swipeNodeCount) {
                            while (swipeNodeCount-- > 0) {
                                Common.swipe(0, 1 / (swipeNodeCount + 1));
                                Common.sleep(wait);
                            }
                        }
                    } else {
                        Common.sleep(wait * (swipeNodeCount + 1));//视频不需要滑动
                    }

                    //是否点赞
                    if (currentZanRate < this.config.zanRate) {
                        Log.log('点赞');
                        Work.zan();
                        Common.sleep(500 + 1000 * Math.random());
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
                        Log.log('关注了');
                        Work.focus(type);
                        Common.sleep(1000 + 1000 * Math.random());
                    }

                    Common.back();
                    Common.sleep(500);
                }

                Log.log('滑动');
                Index.swipe(this.config.isCity);
            } catch (e) {
                Log.log('异常了', e);
                if (!Common.id(V.Common.backHome[0]).textContains(V.Common.backHome[1]).findOne()) {
                    Common.back();
                    Common.sleep(1000);
                }
            }
        }
    }
}

module.exports = xhs;
