let Common = require('app/wx/Common.js');
let V = require('version/WxV.js');


let Index = {
    intoHome() {
        let tag = Common.id(V.Index.home[4]).text(V.Index.home[0]).findOne();
        if (!tag || !tag.parent() || !tag.parent().isVisibleToUser()) {
            throw new Error('未进入主页');
        }

        Common.click(tag);
        Common.sleep(3000 + 2000 * Math.random());
        return true;
    },

    intoVideo() {
        let tag = Common.id(V.Index.home[4]).text(V.Index.home[2]).findOne();
        if (!tag || !tag.parent() || !tag.parent().isVisibleToUser()) {
            throw new Error('未进入主页');
        }

        Common.click(tag);
        Log.log('点击 朋友');
        Common.sleep(2000 + 1000 * Math.random());

        //开始点击同城
        let videoTag = Common.aId(V.Index.intoVideo[0]).isVisibleToUser(true).text(V.Index.intoVideo[1]).findOne();
        if (!videoTag) {
            Log.log(Common.id(V.Index.intoVideo[0]).find());
            throw new Error('找不到视频号入口');
        }

        Common.click(videoTag);
        Log.log('进入 视频号');
        Common.sleep(4000 + 2000 * Math.random());
        let iKonw = Common.id(V.Video.close[0]).textContains(V.Video.close[1]).isVisibleToUser(true).findOne();
        if (iKonw) {
            Common.click(iKonw);
            Common.sleep(2000 + 1000 * Math.random());
        }

        iKonw = UiSelector().className('android.widget.Button').text(V.Video.close[1]).isVisibleToUser(true).findOne();
        if (iKonw) {
            Common.click(iKonw);
            Common.sleep(2000 + 1000 * Math.random());
        }
    },

    intoLocal() {
        let tag = Common.id(V.Index.home[4]).text(V.Index.home[2]).findOne();
        if (!tag || !tag.parent() || !tag.parent().isVisibleToUser()) {
            throw new Error('未进入主页');
        }

        Common.click(tag);
        Common.sleep(2000 + 1000 * Math.random());

        //开始点击同城
        let localTag = Common.aId(V.Index.local[0]).isVisibleToUser(true).text(V.Index.local[1]).findOne();
        if (!localTag) {
            Log.log(Common.id(V.Index.local[0]).find());
            throw new Error('找不到同城');
        }

        Common.click(localTag);
        Common.sleep(4000 + 2000 * Math.random());

        //开始找视频，并且进入
        let container = Common.id(V.Index.local[2]).findOne();
        if (!container) {
            throw new Error('找不到同城视频');
        }
        Common.click(container);
        Common.sleep(4000 + 2000 * Math.random());
        let iKonw = Common.id(V.Video.close[0]).textContains(V.Video.close[1]).isVisibleToUser(true).findOne();
        if (iKonw) {
            Common.click(iKonw);
            Common.sleep(2000 + 1000 * Math.random());
        }
    },

    intoSearchPage() {
        this.intoVideo();
        Log.log('进入了视频号');
        let searchTag = UiSelector().className('android.widget.ImageView').desc('搜索').isVisibleToUser(true).findOne();
        if (!searchTag) {
            throw new Error('找不到搜索入口，无法进入搜索页');
        }

        Common.click(searchTag, 0.14);
        Common.sleep(2000 + 2000 * Math.random());
    },

    intoFund() {
        let tag = Common.id(V.Index.home[4]).text(V.Index.home[2]).findOne();
        if (!tag || !tag.parent() || !tag.parent().isVisibleToUser()) {
            throw new Error('未进入主页');
        }

        Common.click(tag);
        Common.sleep(2000 + 1000 * Math.random());
    }
}

module.exports = Index;
