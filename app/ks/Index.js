let Common = require('app/ks/Common.js');

let Index = {
    /**
     * isTrue为true则进入主页，否则进入精选
     * @param {boolean} isTrue 
     * @returns {boolean}
     */
    intoHome(isTrue) {
        let tag = UiSelector().className('androidx.appcompat.app.ActionBar$c').desc(isTrue ? '主页' : '精选').isVisibleToUser(true).findOne();
        if (!tag) {
            throw new Error('未进入Home');
        }

        tag.click();
        Common.sleep(3000 + 2000 * Math.random());
        return true;
    },

    /**
     * 进入同城
     * @returns {boolean}
     */
    intoLocal() {
        let tag = UiSelector().className('androidx.appcompat.app.ActionBar$c').desc('首页').isVisibleToUser(true).findOne();
        if (!tag) {
            throw new Error('未进入首页');
        }

        tag.click();
        Common.sleep(2000 + 1000 * Math.random());

        //开始点击同城
        let localTag = UiSelector().desc('同城').isVisibleToUser(true).findOne();
        if (!localTag) {
            throw new Error('找不到同城');
        }

        if (!localTag.isSelected()) {
            localTag.parent().click();
            Common.sleep(4000 + 2000 * Math.random());
            Log.log('切换到同城');
        } else {
            Log.log('已经在同城');
            Common.sleep(2000 + 1000 * Math.random());
        }

        //开始找视频，并且进入
        let videoTag = Common.id('container').descContains('作品').filter(v => {
            return !v.children().findOne(UiSelector().text('直播中'));
        }).isVisibleToUser(true).findOne();
        let res = videoTag.click();
        Common.sleep(4000 + 2000 * Math.random());
        return res;
    },

    //全版本支持
    intoSearchPage() {
        let tag = UiSelector().className('android.widget.ImageView').desc('查找').isVisibleToUser(true).findOne();
        Common.click(tag);
        Common.sleep(3000 + Math.random() * 3000);
    },
}

module.exports = Index;
