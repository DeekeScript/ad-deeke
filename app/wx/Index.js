let Common = require('app/wx/Common.js');

let Index = {
    intoHome() {
        let tag = Common.id('icon_tv').text('微信').findOne();
        if (!tag || !tag.parent() || !tag.parent().isVisibleToUser()) {
            throw new Error('未进入主页');
        }

        Common.click(tag, 0.2);
        Common.sleep(3000 + 2000 * Math.random());
        return true;
    },

    intoVideo() {
        this.intoFund();
        //开始点击同城
        let videoTag = Common.aId('title').isVisibleToUser(true).text('视频号').findOne();
        if (!videoTag) {
            throw new Error('找不到视频号入口');
        }

        Common.click(videoTag, 0.2);
        Log.log('进入 视频号');
        Common.sleep(4000 + 2000 * Math.random());
        let iKonw = Common.id('b1k').textContains('我知道了').isVisibleToUser(true).findOne();
        if (iKonw) {
            Common.click(iKonw, 0.2);
            Common.sleep(2000 + 1000 * Math.random());
        }

        iKonw = UiSelector().className('android.widget.Button').text('我知道了').isVisibleToUser(true).findOne();
        if (iKonw) {
            Common.click(iKonw, 0.2);
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
        let tag = Common.id('icon_tv').text('发现').findOne();
        if (!tag || !tag.parent() || !tag.parent().isVisibleToUser()) {
            throw new Error('未进入主页');
        }

        Common.click(tag, 0.2);
        Common.sleep(2000 + 1000 * Math.random());
    }
}

module.exports = Index;
