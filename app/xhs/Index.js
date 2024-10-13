let V = require("version/XhsV.js");
let Common = require("app/xhs/Common.js");

let Index = {
    intoCity() {
        let tag = new UiSelector().descContains(V.Index.intoIndex[0]).isVisibleToUser(true).findOne();
        Log.log('进入同城', tag);
        Log.log(tag.parent());

        let cityTag = tag.parent().children().getChildren(2);
        if (cityTag.isSelected()) {
            return true;
        }

        cityTag.click();
        return true;
    },

    refresh() {
        let tag = Common.id(V.Common.backHome[0]).textContains(V.Common.backHome[1]).findOne();
        if (tag) {
            Common.click(tag);
            return true;
        }
        return false;
    },

    swipe(isCity) {
        let tag;
        if (isCity) {
            tag = Common.id(V.Index.swipe[1]).findOne();
        } else {
            tag = Common.id(V.Index.swipe[0]).findOne();
        }

        if (tag) {
            tag.scrollForward();
            return true;
        }
        Log.log('滑动失败');
        return false;
    },

    intoIndex() {
        let tag = new UiSelector().descContains(V.Index.intoIndex[0]).isVisibleToUser(true).findOne();
        Log.log('intoIndex', tag);
        if (tag.isSelected()) {
            return true;
        }

        tag.click();
        return true;
    },

    getTitle(content) {
        //笔记  有人知道这是什么软件吗 来自我不是我不是我 5519赞
        //视频  有人知道这是什么软件吗 来自我不是我不是我 5519赞
        content = content.replace(V.Index.container[1], '').replace(V.Index.container[2], '');
        let tmp = content.split(' ');
        let zanContent = tmp[tmp.length - 1];
        return content.substring(0, content.length - zanContent.length);
    },

    getType(content) {
        //笔记  有人知道这是什么软件吗 来自我不是我不是我 5519赞
        //视频  有人知道这是什么软件吗 来自我不是我不是我 5519赞
        if (content.indexOf(V.Index.container[1]) !== -1) {
            return 1;//视频
        }

        if (content.indexOf(V.Index.container[2]) !== -1) {
            return 0;//笔记
        }

        return 2;
    },

    getZanCount(content) {
        //笔记  有人知道这是什么软件吗 来自我不是我不是我 5519赞
        //视频  有人知道这是什么软件吗 来自我不是我不是我 5519赞
        content = content.replace(V.Index.container[1], '').replace(V.Index.container[2], '');
        let tmp = content.split(' ');
        let zanContent = tmp[tmp.length - 1];
        let zanCount = zanContent.replace('赞', '');
        if (zanCount.indexOf('w') != -1 || zanCount.indexOf('W') != -1 || zanCount.indexOf('万') != -1) {
            return zanCount.replace('w', '').replace('W', '').replace('万', '') * 10000;
        }
        return zanCount;
    },

    zan(tag) {
        if (tag.isSelected()) {
            return true;
        }
        tag.click();
        return true;
    },

    intoNote(tag, type) {
        Common.click(tag);
        Common.sleep(3000 + 1000 * Math.random());
        if (type == 0) {
            return Common.id(V.Work.head[0]).isVisibleToUser(true).findOne();
        }
        return Common.id(V.Work.videoNickname[0]).isVisibleToUser(true).findOne();
    },

    //从主页进入搜索页
    intoSearchPage() {
        Common.sleep(3000);
        let searchTag = Common.id(V.Index.intoSearchPage[0]).descContains(V.Index.intoSearchPage[1]).isVisibleToUser(true).findOneBy(5000);
        Log.log(searchTag);
        if (!searchTag) {
            throw new Error('找不到搜索框，无法进入搜索页');
        }
        //searchTag.click();
        Common.click(searchTag);
        Common.sleep(2000);
        return true;
    },
}

module.exports = Index;
