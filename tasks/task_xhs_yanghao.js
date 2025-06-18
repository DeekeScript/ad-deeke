let tCommon = require("app/xhs/Common");
let DyIndex = require('app/xhs/Index.js');
let DySearch = require('app/xhs/Search.js');
let Work = require('app/xhs/Work.js');
let storage = require("common/storage");
let machine = require("common/machine");
let baiduWenxin = require("service/baiduWenxin");
let statistics = require("common/statistics");
let V = require("version/XhsV.js");

let task = {
    contents: [],
    count: storage.get('task_xhs_yanghao_count', 'int'),
    zanRate: storage.get('task_xhs_yanghao_zan_rate', 'int'),
    commentRate: storage.get('task_xhs_yanghao_comment_rate', 'int'),
    collectRate: storage.get('task_xhs_yanghao_collect_rate', 'int'),
    run(keyword) {
        return this.testTask(keyword);
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-task-xhs-yanghao-" + file + ".txt";
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
        DyIndex.intoIndex();
        tCommon.sleep(3000 + Math.random() * 2000);
        DyIndex.intoSearchPage();
        DySearch.intoSearchList(keyword);
        tCommon.sleep(4000 + 2000 * Math.random());

        let topTag = tCommon.id(V.Search.searchTop).isVisibleToUser(true).findOne();
        let top = topTag ? topTag.bounds().top + topTag.bounds().height() : 342;
        Log.log('top', top, topTag ? topTag.bounds() : null);
        let interval = storage.get('task_xhs_yanghao_interval', 'int');
        while (true) {
            let tags = DySearch.getList();
            if (tags.length === 0) {
                throw new Error('没有内容，报错');
            } else {
                Log.log('长度是：' + tags.length);
            }

            for (let i in tags) {
                try {
                    let text = tags[i].text();
                    if (this.contents.includes(text)) {
                        continue;
                    }

                    if (machine.get('task_xhs_yanghao_' + text, 'bool')) {
                        Log.log('重复视频');
                        continue;
                    }

                    Log.log(tags[i].bounds(), tags[i].text());
                    if (!tCommon.clickRange(tags[i], top, Device.height())) {
                        Log.log('点击位置不对，执行下一个');
                        continue;
                    }
                    tCommon.sleep(3000 + 2000 * Math.random());

                    let title = Work.getContent();
                    if (!title) {
                        Log.log('界面更新了，需要滑动');
                        break;//很可能是更新了
                    }
                    Log.log('title:' + title);
                    //let nickname = Work.getNickname();
                    statistics.viewVideo();
                    statistics.viewTargetVideo();

                    let sleepSec = (interval / 2 + interval / 2 * Math.random()) * 1000;
                    Log.log('休眠' + sleepSec + 'ms');
                    tCommon.sleep(sleepSec);//最后减去视频加载时间  和查询元素的时间

                    if (this.count-- <= 0) {
                        return true;
                    }
                    Log.log('剩余多少个：' + this.count);

                    if (Math.random() * 100 <= task.commentRate) {
                        Work.msg(Work.getType(), this.getMsg(0, title).msg);
                        tCommon.sleep(2000 + 1000 * Math.random());
                    }

                    if (Math.random() * 100 <= task.zanRate) {
                        Log.log('点赞');
                        Work.zan();
                        tCommon.sleep(2000 + 1000 * Math.random());
                    }

                    if (Math.random() * 100 <= task.collectRate) {
                        Log.log('收藏');
                        Work.collect();
                        tCommon.sleep(2000 + 1000 * Math.random());
                    }

                    machine.set('task_xhs_yanghao_' + text, true);
                    this.contents.push(text);
                    if (!tCommon.id(V.Search.searchTop).isVisibleToUser(true).findOne()) {
                        tCommon.back();
                    }
                    tCommon.sleep(1000 + 500 * Math.random());
                } catch (e) {
                    //判断是否在日记页面
                    if (Work.getType() != -1) {
                        tCommon.back();
                        tCommon.sleep(1000);
                    }
                    Log.log('错误：' + e);
                }
            }

            Log.log('开始滑动');
            tCommon.swipeWorkOp();
            tCommon.sleep(3000 + 2000 * Math.random());
        }
    },
}

let keyword = storage.get('task_xhs_yanghao_keyword');
if (!keyword) {
    tCommon.showToast('请设置关键词');
    //console.hide();();
    System.exit();
}

task.count = storage.get('task_xhs_yanghao_count', 'int');
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
