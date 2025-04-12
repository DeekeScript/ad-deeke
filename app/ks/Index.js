let Common = require('app/ks/Common.js');
let V = require('version/KsV.js');


let Index = {
    //isTrue为true则进入主页，否则进入精选
    intoHome(isTrue) {
        let tag = UiSelector().className(V.Index.home[4]).desc(isTrue ? V.Index.home[0] : V.Index.home[1]).isVisibleToUser(true).findOne();
        if (!tag) {
            throw new Error('未进入精选');
        }

        Common.click(tag);
        Common.sleep(3000 + 2000 * Math.random());
        return true;
    },

    intoLocal() {
        let tag = UiSelector().className(V.Index.home[4]).desc(V.Index.home[0]).isVisibleToUser(true).findOne();
        if (!tag) {
            throw new Error('未进入首页');
        }

        Common.click(tag);
        Common.sleep(2000 + 1000 * Math.random());

        //开始点击同城
        let localTag = Common.id(V.Index.local[0]).isVisibleToUser(true).desc(V.Index.local[1]).findOne();
        if (!localTag) {
            Log.log(Common.id(V.Index.local[0]).find());
            throw new Error('找不到同城');
        }

        if (!localTag.isSelected()) {
            Common.click(localTag);
            Common.sleep(3000 + 2000 * Math.random());
            Log.log('切换到同城');
        } else {
            Log.log('已经在同城');
            Common.sleep(2000 + 1000 * Math.random());
        }

        //开始找视频，并且进入
        let times = 5;
        while (times-- > 0) {
            let container = Common.id(V.Index.local[2]).isVisibleToUser(true).filter(v => {
                return v && !v.children().findOne(Common.id(V.Index.local[3]));//不是直播
            }).findOne();

            if (!container) {
                let scrollContainer = Common.id(V.Index.local[4]).isVisibleToUser(true).findOne();
                if (scrollContainer) {
                    scrollContainer.scrollForward();
                    Common.sleep(1000 + 1000 * Math.random());
                }
                continue;
            }

            //防止点到了左侧的红包
            Log.log(container, container.bounds());
            // container.click();
            Common.click(container);
            break;
        }
    },

    intoSearchPage() {
        
    }
}

module.exports = Index;
