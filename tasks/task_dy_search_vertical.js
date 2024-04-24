import { Common as tCommon } from "app/dy/Common";
import { Index as DyIndex } from 'app/dy/Index.js';
import { Search as DySearch } from 'app/dy/Search.js';
import { Video as DyVideo } from 'app/dy/Video.js';
import { storage } from "common/storage";
import { machine } from "common/machine";
import { Comment as DyComment } from 'app/dy/Comment.js';
import { baiduWenxin } from "service/baiduWenxin";

// let dy = require('app/iDy');
// let config = require('config/config');

let task = {
    contents: [],
    lib_id: undefined,
    count: 100,
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
            if (storage.get('setting_baidu_wenxin_switch',  'bool')) {
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
            if (machine.get('task_dy_search_vertical_' + nickname + "_" + title, 'bool')) {
                Log.log('重复视频');
                tCommon.sleep(2000 + Math.random() * 2000);
                DyVideo.next();
                tCommon.sleep(2000);
                continue;
            }

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
            let processBar = DyVideo.getProcessBar();
            //Log.log('processBar', processBar, processBar && processBar.bounds().height(), processBar && processBar.bounds().top);
            if (storage.getPackage() !== 'org.autojs.autoxjs.v6') {
                if (processBar) {
                    let sleepSec = 20 + 20 * Math.random() - 5;
                    Log.log('休眠' + sleepSec + 's');
                    tCommon.sleep(sleepSec * 1000);//最后减去视频加载时间  和查询元素的时间
                } else {
                    let sleepSec = (15 + 10 * Math.random() - 5);
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

            let commentCount = DyVideo.getCommentCount();

            if (Math.random() <= 0.333) {
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

            if (Math.random() <= 0.333) {
                Log.log('点赞');
                DyVideo.clickZan();
            }

            machine.set('task_dy_search_vertical_' + nickname + "_" + title, true);
            this.contents.push(nickname + "_" + title);
            DyVideo.next();
            tCommon.sleep(2000);
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

while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        Engines.executeScript("unit/dialogClose.js");
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
        Log.log(e.stack);
        tCommon.backHome();
    }
}
