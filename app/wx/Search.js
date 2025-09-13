let Common = require('app/wx/Common');

let Search = {
    _search(keyword) {
        let iptTag = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).isVisibleToUser(true).findOne();

        if (!iptTag) {
            throw new Error('搜索页面未找到输入框')
        }

        iptTag.setText(keyword);
        Common.sleep(2200 + 1000 * Math.random());
        Log.log('输入了内容', keyword);

        let searchTag = UiSelector().className('android.widget.TextView').textContains('搜索').isVisibleToUser(true).findOne();
        if (!searchTag) {
            throw new Error('搜索页面未找到搜索按钮');
        }
        Log.log(searchTag.text(), searchTag.text() == '搜索');
        Common.click(searchTag, 0.13);
        Common.sleep(5000 + 3000 * Math.random());
    },

    intoSearchList(keyword) {
        this._search(keyword);
        let tag = UiSelector().className('android.view.View').filter(v => {
            return v.getChildCount() >= 1 && !!v.text() && v.bounds().width() < Device.width() / 2 && !v.parent().text();
        }).isVisibleToUser(true).findOne();

        if (!tag) {
            throw new Error('搜索页面未找到搜索结果');
        }
        Log.log('点击进入视频', tag);
        Common.click(tag, 0.15);
        Common.sleep(5000 + 3000 * Math.random());
        Log.log('进入了视频');
    },

    intoUserVideoPage(keyword) {
        this._search(keyword);
        let accountTag = UiSelector().textContains('账号').textContains('按钮').isVisibleToUser(true).findOne();
        if (!accountTag) {
            throw new Error('搜索页面未找到账号');
        }

        Common.click(accountTag, 0.15);
        Common.sleep(5000 + 3000 * Math.random());
        let tag = UiSelector().className('android.view.View').textContains('帐号').textContains(keyword).isVisibleToUser(true).findOne();
        if (!tag) {
            return false;//弹窗提示找不到账号
        }
        Common.click(tag, 0.15);
        Common.sleep(5000 + 3000 * Math.random());
        return true;
    },
}

module.exports = Search;
