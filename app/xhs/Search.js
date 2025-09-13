let Common = require("app/xhs/Common.js");
let V = require("version/XhsV.js");

let Search = {
    intoSearchList(keyword) {
        //开始搜索
        let iptTag = UiSelector().className('android.widget.EditText').filter(v => {
            return v && v.isEditable();
        }).isVisibleToUser(true).findOneBy(5000);
        if (!iptTag) {
            throw new Error('没有找到输入框');
        }
        iptTag.setText(keyword);
        Common.sleep(1500 + 1500 * Math.random());

        //找到搜索按钮
        let searchBtnTag = UiSelector().className('android.widget.Button').filter(v => {
            return v && (v.text() == '搜索' || v.desc() == '搜索');
        }).isVisibleToUser(true).findOnce();
        if (!searchBtnTag) {
            throw new Error('没有找到搜索点击按钮');
        }

        Log.log('searchBtnTag', searchBtnTag);
        Common.click(searchBtnTag, 0.15);
        Common.sleep(4000 + 2000 * Math.random());
    },

    intoUserVideoPage(keyword) {
        this.intoSearchList(keyword);
        let userTag = UiSelector().className('android.widget.TextView').text('用户').isVisibleToUser(true).filter(v => {
            return v.parent().className() == 'androidx.appcompat.app.ActionBar$Tab';
        }).findOne() || UiSelector().className('android.widget.TextView').text('账号').isVisibleToUser(true).filter(v => {
            return v.parent().className() == 'androidx.appcompat.app.ActionBar$Tab';
        }).findOne();

        if (!userTag) {
            throw new Error('没有找到用户tab');
        }
        Common.click(userTag, 0.15);
        Common.sleep(4000 + 2000 * Math.random());

        userTag = UiSelector().className('android.widget.TextView').textContains(keyword).isVisibleToUser(true).filter(v => {
            return v.text() != keyword;
        }).findOne();

        if (!userTag) {
            return false;
        }
        Common.click(userTag, 0.15);
        Common.sleep(4000 + 2000 * Math.random());
        return true;
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

    getList() {
        let tags = UiSelector().className('android.widget.FrameLayout').isVisibleToUser(true).filter(v => {
            return v && v.parent() != null && v.parent().className() == 'androidx.recyclerview.widget.RecyclerView' && v.getChildCount() == 1;
        }).find();

        let childs = [];
        for (let i in tags) {
            let children = tags[i].children();
            let imageTag = children.findOne(UiSelector().className('android.widget.ImageView'));
            let top = 0;
            if (imageTag) {
                Log.log('imageTag', imageTag.bounds());
                top = imageTag.bounds().top + imageTag.bounds().height();
            }
            //对imageTag进行判断，如果很小，可能就不是图文，直接过滤
            if (!imageTag || imageTag.bounds().width() < Device.width() / 3) {
                Log.log('imageTag', '过滤');
                continue;
            }
            let child = children.findOne(UiSelector().className('android.widget.TextView').filter(v => {
                return v.text() != '赞助' && v.bounds().width() > 200 && v.bounds().top > top;
            }));
            if (!child || !child.isVisibleToUser()) {
                Log.log('child为null', child);
                continue;
            }

            childs.push({
                content: child.text(),
                tag: child,
                isLiving: tags[i].findOne(UiSelector().className('android.widget.TextView').text('直播中')) ? true : false,
            });
        }
        return childs;
    }
}

module.exports = Search;
