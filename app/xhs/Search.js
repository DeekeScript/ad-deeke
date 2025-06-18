let Common = require("app/xhs/Common.js");
let V = require("version/XhsV.js");

let Search = {
    intoSearchList(keyword) {
        //开始搜索
        let iptTag = Common.id(V.Search.intoSearchList[0]).isVisibleToUser(true).findOneBy(5000);
        if (!iptTag) {
            throw new Error('没有找到输入框');
        }
        iptTag.setText(keyword);

        Common.sleep(1500);
        //找到搜索按钮
        let searchBtnTag = Common.id(V.Search.intoSearchList[1]).desc(V.Search.intoSearchList[2]).isVisibleToUser(true).findOnce();
        if (!searchBtnTag) {
            Log.log('新按钮');
            searchBtnTag = UiSelector().className('android.widget.Button').text(V.Search.intoSearchList[2]).isVisibleToUser(true).findOne() || UiSelector().className('android.widget.Button').text(V.Search.intoSearchList[2]).findOne();
            if (!searchBtnTag) {
                throw new Error('没有找到搜索点击按钮');
            }
        }

        Log.log('searchBtnTag', searchBtnTag);
        //Common.click(searchBtnTag);
        searchBtnTag.click();
        Common.sleep(3000 + 2000 * Math.random());
    },

    //从列表进入详情
    intoSearchVideo() {
        let descTag = Common.id(V.Search.intoSearchVideo[0]).isVisibleToUser(true).findOnce();
        if (descTag) {
            Common.click(descTag);
            return true;
        }

        let container = Common.id(V.Search.intoSearchVideo[1]).isVisibleToUser(true).findOnce();
        if (container) {
            Common.click(container);
            return true;
        }

        let titleTag = Common.id(V.Search.intoSearchVideo[2]).isVisibleToUser(true).findOnce();
        if (titleTag) {
            Common.click(titleTag);
            return true;
        }
        throw new Error('找不到视频输入');
    },

    getList(){
        let tags = Common.id(V.Search.intoSearchVideo[0]).isVisibleToUser(true).find();
        return tags;
    }
}

module.exports = Search;
