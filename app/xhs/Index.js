let Common = require("app/xhs/Common.js");

let Index = {
    intoCity() {
        let cityTag = new UiSelector().className('androidx.appcompat.app.ActionBar$Tab').descContains('附近').isVisibleToUser(true).findOne();
        Log.log('进入同城', cityTag);
        if (cityTag.isSelected()) {
            return true;
        }

        cityTag.click();
        return true;
    },

    refresh() {
        let indexTag = UiSelector().descContains('首页').className('android.view.ViewGroup').isVisibleToUser(true).findOne();
        if (indexTag) {
            Common.click(indexTag);
            return true;
        }
        return false;
    },

    swipe(isCity) {
        let tag = UiSelector().className('androidx.recyclerview.widget.RecyclerView').filter(v => {
            return v.bounds().top > 0 && v.bounds().width() >= Device.width() - 1;
        }).scrollable(true).isVisibleToUser(true).findOne();

        if (tag) {
            tag.scrollForward();
            return true;
        }
        Log.log('滑动失败');
        return false;
    },

    intoIndex() {
        let indexTag = UiSelector().descContains('首页').className('android.view.ViewGroup').isVisibleToUser(true).findOne();
        Log.log('indexTag', indexTag.bounds());
        if (!indexTag) {
            Log.log('进入首页失败');
            return false;
        }

        Common.click(indexTag);
        Common.sleep(3000 + 3000 * Math.random());

        let foundTag = UiSelector().descContains('发现').className('androidx.appcompat.app.ActionBar$Tab').isVisibleToUser(true).findOne();
        Log.log('foundTag', foundTag.bounds());
        if (!foundTag) {
            Log.log('进入发现失败');
            return false;
        }

        Common.click(foundTag);
        Common.sleep(3000 + 3000 * Math.random());
        return true;
    },

    getTitle(content) {
        //笔记  有人知道这是什么软件吗 来自我不是我不是我 5519赞
        //视频  有人知道这是什么软件吗 来自我不是我不是我 5519赞
        content = content.replace('笔记', '').replace('视频', '');
        let tmp = content.split(' ');
        let zanContent = tmp[tmp.length - 1];
        return content.substring(0, content.length - zanContent.length);
    },

    getType(content) {
        //笔记  有人知道这是什么软件吗 来自我不是我不是我 5519赞
        //视频  有人知道这是什么软件吗 来自我不是我不是我 5519赞
        if (content.indexOf("视频") !== -1) {
            return 1;//视频
        }

        if (content.indexOf("笔记") !== -1) {
            return 0;//笔记
        }

        return 2;
    },

    getZanCount(content) {
        //笔记  有人知道这是什么软件吗 来自我不是我不是我 5519赞
        //视频  有人知道这是什么软件吗 来自我不是我不是我 5519赞
        content = content.replace('笔记', '').replace('视频', '');
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
        Common.click(tag);
        return true;
    },

    //0笔记，1视频
    intoNote(tag, type) {
        Common.click(tag);
        Common.sleep(3000 + 3000 * Math.random());
        if (type == 0) {
            return Common.id('nickNameTV').isVisibleToUser(true).findOne();
        }
        return Common.id('matrixNickNameView').isVisibleToUser(true).findOne();
    },

    //从主页进入搜索页
    intoSearchPage() {
        Common.sleep(3000);
        let searchTag = UiSelector().className('android.widget.Button').desc('搜索').isVisibleToUser(true).findOneBy(5000);
        Log.log(searchTag);
        if (!searchTag) {
            throw new Error('找不到搜索框，无法进入搜索页');
        }
        //searchTag.click();
        Common.click(searchTag, 0.15);
        Common.sleep(2000 + 2000 * Math.random());
        return true;
    },

    intoUserVideoPage(account) {
        let iptTag = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).isVisibleToUser(true).findOne();

        if (!iptTag) {
            throw new Error('找不到搜索框，无法进入搜索页');
        }
        iptTag.setText(account);
        Log.log('输入内容', account);
        Common.sleep(2000 + 2000 * Math.random());

        let btnTag = UiSelector().className('android.widget.Button').text('搜索').isVisibleToUser(true).findOne();
        if (!btnTag) {
            throw new Error('找不到搜索按钮，无法进入搜索页');
        }
        Common.click(btnTag, 0.15);

        Common.sleep(4000 + 3000 * Math.random());
        Log.log('点击搜索');

        let userTag = UiSelector().className('android.widget.TextView').textContains(keyword).isVisibleToUser(true).findOne();
        if (!userTag) {
            throw new Error('没有找到用户');
        }
        Common.click(userTag.parent(), 0.15);
        Log.log('点击用户入口');
        Common.sleep(3000 + 3000 * Math.random());
    }
}

module.exports = Index;
