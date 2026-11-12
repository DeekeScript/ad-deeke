let Common = require('app/wx/Common');

let Search = {
    _search(keyword, ignore = false) {
        let iptTag = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).isVisibleToUser(true).findOne();

        if (!iptTag) {
            throw new Error('搜索页面未找到输入框')
        }

        iptTag.setText(keyword);
        Common.sleep(2200 + 1000 * Math.random());
        Log.log('输入了内容', keyword);

        let searchTag = Common.id('mdx').textContains('搜索').findOne();
        if (!searchTag) {
            throw new Error('搜索页面未找到搜索按钮');
        }
        Log.log(searchTag.text(), searchTag.text() == '搜索');
        Common.click(searchTag, 0.13);
        Common.sleep(5000 + 3000 * Math.random());

        if (!ignore) {
            return;
        }

        //直接进入视频
        let videoTabTag = UiSelector().textContains('视频').filter(v => {
            return v.text() && v.text().indexOf('视频') == 0;
        }).isVisibleToUser(true).findOne() || UiSelector().descContains('视频').filter(v => {
            return v.desc() && v.desc().indexOf('视频') == 0;
        }).isVisibleToUser(true).findOne();
        if (videoTabTag) {
            Common.click(videoTabTag, 0.15);
            Common.sleep(5000 + 3000 * Math.random());
            return true;
        }

        while (true) {
            let tag = UiSelector().className('android.widget.TextView').filter(v => {
                return v.text() && (v.text().indexOf('视频') !== -1 || v.text().indexOf('直播') !== -1);
            }).isVisibleToUser(true).findOne();
            if (!tag) {
                break;
            }

            let x = 200 + 300 * Math.random();
            Gesture.swipe(x, Device.height() * 0.8, x + 20, Device.height() * 0.3, 200);
            Common.sleep(2000 + 500 * Math.random());
        }
    },

    intoSearchList(keyword) {
        this._search(keyword, true);
        let tag = UiSelector().className('android.view.View').filter(v => {
            return v.getChildCount() > 0 && !!v.text() && v.bounds().width() < Device.width() / 2 && !v.parent().text();
        }).isVisibleToUser(true).findOne();

        //适配新版本，后续把上面的查找方式去掉
        if (!tag) {
            tag = UiSelector().className('android.widget.ImageView').filter(v => {
                return !!v.desc() && v.bounds().width() > Device.width() / 3;
            }).isVisibleToUser(true).findOne();
        }

        if (!tag) {
            throw new Error('搜索页面未找到搜索结果');
        }
        Log.log('点击进入视频', tag);
        tag.click();
        Common.sleep(5000 + 3000 * Math.random());
        Log.log('进入了视频');
    },

    intoUserVideoPage(keyword) {
        this._search(keyword);
        let accountTag = UiSelector().filter(v => {
            return (v.text() && (v.text().indexOf('账号') !== -1 && v.text().indexOf('按钮') !== -1)) || (v.desc() && (v.desc().indexOf('账号') == 0))
        }).isVisibleToUser(true).findOne();
        if (!accountTag) {
            throw new Error('搜索页面未找到账号');
        }

        Common.click(accountTag, 0.15);
        Common.sleep(5000 + 3000 * Math.random());
        let tag = UiSelector().className('android.view.View').filter(v => {
            return (v.text() && (v.text().indexOf(keyword) !== -1)) || (v.desc() && Helper.stripInvisible(v.desc()).indexOf(keyword) == 0);
        }).findOne();
        if (!tag) {
            return false;//弹窗提示找不到账号
        }
        Common.click(tag, 0.15);
        Common.sleep(6000 + 2000 * Math.random());
        return true;
    },
}

module.exports = Search;
