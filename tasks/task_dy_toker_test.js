const tDyCommon = require('app/dy/Common.js');
let DyIndex = require('app/dy/Index.js');
const DyUser = require('app/dy/User.js');
let DyVideo = require('app/dy/Video.js');
let DyComment = require('app/dy/Comment.js');
let storage = require("common/storage");
let baiduWenxin = require("service/baiduWenxin");

let task = {
    me: {},//我的抖音号和昵称
    run(i) {
        this.testTask();
    },

    log(){
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-test-" + file + ".txt";
        Log.setFile(allFile);
    },

    testTask() {
        tDyCommon.closeAlert();
        tDyCommon.toast('进入了主页', 1000);
        DyIndex.intoMyPage();
        tDyCommon.toast('进入个人主页，记录自己的账号和抖音号');
        this.me = {
            nickname: DyUser.isCompany() ? DyUser.getDouyin() : DyUser.getNickname(),
            douyin: DyUser.getDouyin(),
        }
        tDyCommon.toast(JSON.stringify({
            '账号：': this.me.douyin,
            '昵称：': this.me.nickname,
        }));
        tDyCommon.back(1, 1000);

        tDyCommon.toast('现在是模拟刷视频', 1000);
        let titles = [];
        let videoData;
        let swipeCount = 3;
        while (true) {
            DyVideo.next();
            tDyCommon.toast('滑动视频', 2000, 1000);

            if (DyVideo.isLiving()) {
                tDyCommon.toast('直播中，切换下一个视频', 2000);
                continue;
            }

            let unique = DyVideo.getNickname() + '_' + DyVideo.getContent();
            if (titles.includes(unique)) {
                tDyCommon.toast('重复视频');
                continue;
            }

            titles.push(unique);
            swipeCount--;
            if (swipeCount <= 0) {
                Log.log('开始获取视频数据');
                videoData = DyVideo.getInfo(0, { commentCount: true, zanCount: true, collectCount: true, shareCount: true });
                Log.log('获取视频数据结束，数据如下：')
                Log.log(videoData);
                if (!videoData.title || videoData.commentCount < 30) {
                    if (!videoData.title) {
                        System.toast('当前视频没有标题，切换到下一个');
                    }

                    if (videoData.commentCount < 30) {
                        System.toast('当前视频评论太少不方便演示，切换到下一个');
                    }
                    continue;
                }
                break;
            }
        }

        tDyCommon.toast('找到了你设置的关键词')

        //假设找到了你要的关键词
        let rd;
        if (videoData.title.length > 5) {
            rd = videoData.title.substr(Math.floor(videoData.title.length / 2), 2);
        } else {
            rd = videoData.title;
        }

        tDyCommon.toast('找到了关键词:[' + rd + ']', 2000);
        tDyCommon.toast(JSON.stringify({
            '用户昵称：': videoData.nickname,
            '标题：': videoData.title,
            '点赞数：': videoData.zanCount,
            '评论数：': videoData.commentCount,
            '收藏数：': videoData.collectCount,
            '分享数：': videoData.shareCount,
        }));

        tDyCommon.toast('目标视频已找到，即将寻找目标评论和用户', 1200);
        tDyCommon.toast('先给本视频点个赞吧', 1200);
        //点赞重试两次
        DyVideo.clickZan();
        if (!DyVideo.isZan()) {
            DyVideo.clickZan();
        }

        if (!DyVideo.isZan()) {
            DyVideo.clickZan();
        }

        tDyCommon.sleep(2000);
        tDyCommon.toast('收藏一下');
        DyVideo.collect();
        tDyCommon.sleep(3000);
        tDyCommon.toast('即将打开评论列表', 1000);

        DyVideo.openComment(true);
        tDyCommon.sleep(2000 + 1000 * Math.random());
        tDyCommon.toast('好多信息啊，不过不要急，我们慢慢来', 1000);

        let comments = DyComment.getList();
        tDyCommon.toast('我们一次拿到了' + comments.length + '条评论了', 1000);
        tDyCommon.toast('给你看看第一条', 1000);

        let d = new Date(comments[0].time * 1000);
        tDyCommon.toast(JSON.stringify({
            '评论昵称：': comments[0].nickname,
            '评论内容：': comments[0].content,
            // '时间：': d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes(),
            // '位置：': comments[0].ip,
            '点赞数量：': comments[0].zanCount,
            '是否已点赞：': comments[0].isZan,
            '是否是作者：': comments[0].isAuthor ? '是' : '否',
        }), 3000);

        tDyCommon.toast('我们给他点个赞吧');
        DyComment.clickZan(comments[0]);

        tDyCommon.toast('我们还可以对这个视频进行评论', 1500);
        let tt = ['学习了🤔', '六六六', '👍厉害了', '是的', '评论区都是人才', '😄', '这是谁的部将？']
        tt = tt[Math.ceil(Math.random() * tt.length) - 1] || tt[0];
        if (storage.get('setting_baidu_wenxin_switch',  'bool')) {
            tt = baiduWenxin.getComment(videoData.title);
        }
        DyComment.commentMsg(tt);

        tDyCommon.toast('现在，我门下滑一下找找我们需要的评论', 1500);
        DyComment.swipeTop();
        tDyCommon.sleep(1000);
        DyComment.swipeTop();
        tDyCommon.sleep(1000);

        // comments = DyComment.getList();
        // tDyCommon.toast('假设现在我们找到了关键词，此时需要回复这个评论');
        // let index = Math.floor(comments.length * Math.random());
        // tt = ['学习了🤔', '六六六', '👍厉害了', '你说的对！😊', '人才', '😄', '😌']
        // tt = tt[Math.ceil(Math.random() * tt.length) - 1] || tt[0];
        // DyComment.backMsg(comments[index], '你说的对！😊');
        // tDyCommon.sleep(2000);
        // DyComment.swipeTop();
        // tDyCommon.sleep(2000);

        comments = DyComment.getList();
        tDyCommon.toast('接下来，随机进入一个评论人的首页');
        let k = comments.length;
        let m = 1;
        let _true = false;
        while (k--) {
            //找到了自己，忽略
            if (comments[m].nickname === this.me.nickname) {
                m++;
                continue;
            }

            DyComment.intoUserPage(comments[m]);
            tDyCommon.sleep(2000);
            if (DyUser.isPrivate()) {
                m++;
                tDyCommon.back();
                tDyCommon.sleep(300);
                continue;
            }
            _true = true;
            break;
        }

        if (true !== _true) {
            tDyCommon.toast('本条视频评论的用户都不满足条件，程序即将从头开始');
            tDyCommon.back();
            tDyCommon.sleep(2000);
            return false;
        }

        console.setPosition(0, 100);//把控制台放下面
        tDyCommon.toast('开始获取用户主页数据');
        let userData = DyUser.getUserInfo();
        tDyCommon.toast(JSON.stringify({
            '昵称：': userData.nickname,
            '抖音号：': userData.douyin,
            '年龄：': userData.age,
            // '介绍：': userData.introduce,
            // '获赞：': userData.zanCount,
            // '关注数：': userData.focusCount,
            // '粉丝数：': userData.fansCount,
            // '作品数：': userData.worksCount,
            // '是否带货：': userData.openWindow ? '是' : '否',//开启橱窗
            // '团购达人：': userData.tuangouTalent ? '是' : '否',
            // '地点：': userData.ip,
            // '是否是机构/媒体等': userData.isCompany ? '是' : '否',//是否是机构 公司
            '性别：': ['未知', '男', '女', '未知'][userData.gender],
        }), 3000);

        tDyCommon.toast('关注一下他');
        DyUser.focus();
        tDyCommon.sleep(1000);
        tDyCommon.toast('取消关注他吧');
        DyUser.cancelFocus();
        tDyCommon.sleep(1500);
        tDyCommon.toast('开始私信了哦');
        DyUser.privateMsg(baiduWenxin.getChat() || '你好啊，😁你的评论很精彩呀！');

        tDyCommon.toast('现在，我们回去继续刷视频了哦');
        tDyCommon.back(2, 1500, 1000);
        console.setPosition(0, 0);//把控制台放下面
        return true;
    }
}

// console.show();
// console.setTitle("演示细节展示", "#FFFFFF", 40);
// console.setCanInput(false);
// console.setBackgroud("#2E78FC");
// tDyCommon.sleep(40);
// console.setSize(Device.width(), Device.height() / 6);
tDyCommon.toast("拓客演示开始，实际过程中会匹配关键词执行！", 1600);

let i = false;
Dialogs.confirm('说明', '即将执行【点赞视频/评论视频/私信用户/点赞评论/访问用户主页/点赞评论区用户视频/关注用户】', (_true) => {
    i = _true
});

if (!i) {
    tDyCommon.toast('你取消了演示任务');
    System.exit();
}

tDyCommon.toast('首次启动需要几秒时间，请耐心等待···');
tDyCommon.openApp();
tDyCommon.sleep(7000);
while (true) {
    task.log();
    try {
        task.run(i);
        Log.log('即将关闭抖音！！！');
        tDyCommon.sleep(1000);
         //console.hide();();
        System.toast('演示完成，关闭抖音');
        tDyCommon.closeApp();
        break;
        //开启线程  自动关闭弹窗
    } catch (e) {
        Log.log(e);
        tDyCommon.toast("遇到错误，即将自动重启");
        tDyCommon.closeApp();
        tDyCommon.sleep(3000);
        tDyCommon.openApp();
        tDyCommon.sleep(7000);
    }
}

try {
    Engines.closeAll(true);
} catch (e) {
    Log.log('停止脚本');
}
