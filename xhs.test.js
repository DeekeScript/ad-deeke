

let xhs = {
    scroll() {
        let tag = UiSelector().id('com.xingin.xhs:id/fyd').scrollable(true).isVisibleToUser(true).findOne();
        tag.scrollForward();
    },

    msgListTag() {
        let tags = UiSelector().className('android.widget.RelativeLayout').isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left <= 1 && v.bounds().width() >= Device.width() - 1;
        }).descMatches('[\\s\\S]+').find();

        console.log(tags.length);
        for (let i in tags) {
            console.log('tag', tags[i].desc());
        }
    },

    noUserTag() {
        let tags = UiSelector().id('com.xingin.xhs:id/a1j').isVisibleToUser(true).filter(v => {
            return v && v.text() > 0;
        }).find();

        for (let i in tags) {
            console.log(tags[i].parent().parent());
        }
    },

    noUserMessageBackScroll() {
        let tag = UiSelector().id('com.xingin.xhs:id/ijr').scrollable(true).isVisibleToUser(true).findOne();
        tag.scrollForward();
    },

    setText() {
        let tag = UiSelector().id('com.xingin.xhs:id/f9d').isVisibleToUser(true).findOne();
        console.log(tag);
        if (tag) {
            tag.setText('测试');
        }
    },

    getLastMessageContent(id) {
        if (!id) {
            id = 'com.xingin.xhs:id/aw7';
        }
        let tags = UiSelector().id(id).isVisibleToUser(true).find();
        console.log(tags);

        if (tags.length === 0) {
            console.log('没有内容');
            return false;
        }
        console.log('消息：', tags[tags.length - 1].text());
        // return tags[tags.length - 1].text();
        return tags[0];//居然第一条是距离输入框最近的那条，而不是最后一条
    },

    commentScroll() {
        let scrollTag = UiSelector().id('com.xingin.xhs:id/g0s').isVisibleToUser(true).scrollable(true).findOne();
        console.log(scrollTag);
        if (scrollTag) {
            scrollTag.scrollForward();
            Common.sleep(3000 + 2000 * Math.random());
        }

        console.log(UiSelector().scrollable(true).findOne());
    }
}


// xhs.getLastMessageContent('com.ss.android.ugc.aweme:id/content_layout');
