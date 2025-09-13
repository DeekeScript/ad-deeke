

// console.log(App.getAppVersionCode('com.tencent.mm'));

// let tag = UiSelector().id('com.tencent.mm:id/kbf').findOne();
// console.log(tag, tag.parent(), tag.parent().parent());

// let tags = UiSelector().id('com.tencent.mm:id/dz_').findOne();
// console.log(tags.children().findOne(UiSelector().id('com.tencent.mm:id/c1_')));

// console.log(tags.children().findOne(UiSelector().id('com.tencent.mm:id/aa0')));


// let tag = UiSelector().scrollable(true).isVisibleToUser(true).findOne();
// console.log(tag, tag.scrollForward());
// console.log(tag);


// console.log(UiSelector().descContains('直播').find());

// console.log(UiSelector().id('com.tencent.mm:id/o45').isVisibleToUser(true).findOne());

// let tag = UiSelector().id('com.tencent.mm:id/bkk').filter(v => {
//     return v && v.children().length() === 0;
// }).findOne();
// console.log(tag);

// tag.setText('电话都觉得');

// let tag = UiSelector().id('com.tencent.mm:id/c6v').isVisibleToUser(true).find();
// console.log(tag);

// let tags = UiSelector().scrollable(true).find();
// console.log(tags[5]);

// tags[5].scrollForward();


// let tags = UiSelector().scrollable(true).find();
// console.log(tags);

// tags[0].scrollForward();



function hasMessage() {
    let shipinhaoTag = UiSelector().id('android:id/title').text('视频号').isVisibleToUser(true).findOne();
    console.log(shipinhaoTag);
    let msgTag = shipinhaoTag.parent().children().findOne(UiSelector().id('com.tencent.mm:id/o58'));
    console.log(msgTag);
    if (!msgTag || msgTag.text() * 1 <= 0) {
        return false;
    }
    return true;
}

function intoMessage() {
    let shipinhaoTag = UiSelector().id('android:id/title').text('视频号').isVisibleToUser(true).findOne();
    if (!shipinhaoTag) {
        throw new Error('没有视频号');
    }
    Gesture.click(shipinhaoTag.bounds().left + 10 * Math.random(), shipinhaoTag.bounds().top + 20 * Math.random());
    System.sleep(3000 + 3000 * Math.random());
    let closeTag = UiSelector().id('com.tencent.mm:id/pnq').isVisibleToUser(true).findOne();
    if (closeTag) {
        Gesture.click(closeTag.bounds().left + 10 * Math.random(), closeTag.bounds().top + 20 * Math.random());
        System.sleep(1000);
    }

    let accountTag = UiSelector().id('com.tencent.mm:id/kts').isVisibleToUser(true).findOne();
    if (!accountTag) {
        throw new Error('找不到消息入口');
    }
    Gesture.click(accountTag.bounds().left + 10 * Math.random(), accountTag.bounds().top + 20 * Math.random());
    System.sleep(3000);
}

function getMsg(msg) {
    Log.log('对方内容：' + msg);
    return "😄";
}

function dealHudong() {
    let tag = UiSelector().id('com.tencent.mm:id/qck').text('视频号消息').isVisibleToUser(true).findOne();
    if (!tag) {
        throw new Error('找不到视频号消息入口');
    }
    let tipCountTag = tag.parent().children().findOne(UiSelector().id('com.tencent.mm:id/qci').isVisibleToUser(true));
    if (!tipCountTag || tipCountTag.text() * 1 <= 0) {
        return true;
    }
    let count = tipCountTag.text() * 1;
    Gesture.click(tipCountTag.bounds().left + 10 * Math.random(), tipCountTag.bounds().top + 20 * Math.random());
    System.sleep(3000);

    let tags = UiSelector().id('com.tencent.mm:id/hhj').isVisibleToUser(true).find();
    let contains = [];
    while (true) {
        let dl = 0;
        for (let i in tags) {
            let filter = (v) => {
                return v.bounds().top >= tags[i].bounds().top && v.bounds().top + v.bounds().height() <= tags[i].bounds().top + tags[i].bounds().height();
            }
            let nicknameTag = UiSelector().id('com.tencent.mm:id/kbq').isVisibleToUser(true).filter(filter(v)).findOne();
            let msgTag = UiSelector().id('com.tencent.mm:id/jt2').isVisibleToUser(true).filter(filter(v)).findOne();
            if (contains.includes(nicknameTag.text() + '@@@' + msgTag.text())) {
                continue;//重复
            }
            contains.push(nicknameTag.text() + '@@@' + msgTag.text());
            let backTag = UiSelector().id('com.tencent.mm:id/lz3').isVisibleToUser(true).filter(filter(v)).findOne();
            if (!backTag) {
                Log.log('没有回复按钮');
                continue;
            }

            if (count-- <= 0) {
                break;
            }
            dl++;
            Gesture.click(backTag.bounds().left + 10 * Math.random(), backTag.bounds().top + 20 * Math.random());
            System.sleep(2000);

            let inputTag = UiSelector().id('com.tencent.mm:id/c6v').isVisibleToUser(true).findOne();
            if (!inputTag) {
                Log.log('没有输入框');
                continue;
            }
            Gesture.click(inputTag.bounds().left + 10 * Math.random(), inputTag.bounds().top + 20 * Math.random());
            System.sleep(2000);

            inputTag = UiSelector().id('com.tencent.mm:id/c6v').isVisibleToUser(true).findOne();
            if (!inputTag) {
                Log.log('没有输入框2');
                continue;
            }
            inputTag.setText(getMsg(msgTag.text()));
            System.sleep(1000);

            let sendTag = UiSelector().id('com.tencent.mm:id/lz3').text('回复').isVisibleToUser(true).findOne();
            if (!sendTag) {
                Log.log('没有发送回复按钮');
                continue;
            }

            Gesture.click(sendTag.bounds().left + 10 * Math.random(), sendTag.bounds().top + 20 * Math.random());
            System.sleep(5000);//这里有回复弹窗，所以等待久一点
        }

        if (count-- <= 0 || dl == 0) {
            Log.log('评论执行完了');
            break;
        }

        let scrollTag = UiSelector().scrollable(true).isVisibleToUser(true).findOne();
        if (scrollTag) {
            scrollTag.scrollForward();
            Log.log('滑动');
            System.sleep(2000);
        }
    }
    Gestrue.back();
    Log.log('返回到视频号消息、视频号私信主界面');
}

function dealPrivateMsg() {
    let tag = UiSelector().id('com.tencent.mm:id/qck').text('视频号私信').isVisibleToUser(true).findOne();
    if (!tag) {
        throw new Error('找不到视频号消息入口');
    }
    let dotCountTag = tag.parent().children().findOne(UiSelector().id('com.tencent.mm:id/qch').isVisibleToUser(true));
    if (!dotCountTag) {
        return true;
    }
    Gesture.click(dotCountTag.bounds().left + 10 * Math.random(), dotCountTag.bounds().top + 20 * Math.random());
    System.sleep(3000);

    let dazhaohuTag = UiSelector().id('com.tencent.mm:id/civ').text('打招呼消息').isVisibleToUser(true).findOne();
    if (dazhaohuTag) {
        //处理打招呼消息
        Gesture.click(dazhaohuTag.bounds().left + 10 * Math.random(), dazhaohuTag.bounds().top + 20 * Math.random());
        Log.log('进入了打招呼用户列表页面');
        System.sleep(3000);

        let dealCount = 10;
        while (dealCount-- > 0) {
            let tags = UiSelector().id('com.tencent.mm:id/eb8').isVisibleToUser(true).find();
            let nicknames = [];
            if (tags.length > 0) {
                let dl = 0;
                for (let i in tags) {
                    let tipTag = UiSelector().id('com.tencent.mm:id/o_4').isVisibleToUser(true).filter(v => {
                        return v.bounds().left > tags[i].bounds().left && v.bounds().top > tags[i].bounds().top && v.bounds().left + v.bounds().width() < tags[i].bounds().left + tags[i].bounds().width();
                    }).findOne();

                    if (!tipTag || tipTag.text() * 1 <= 0) {
                        continue;
                    }

                    let nicknameTag = tipTag = UiSelector().id('com.tencent.mm:id/civ').isVisibleToUser(true).filter(v => {
                        return v.bounds().left >= tags[i].bounds().left && v.bounds().top >= tags[i].bounds().top && v.bounds().left + v.bounds().width() <= tags[i].bounds().left + tags[i].bounds().width();
                    }).findOne();
                    if (!nicknameTag || nicknameTag.text() == '视频号团队') {
                        continue;
                    }

                    if (nicknames.includes(nicknameTag.text())) {
                        Log.log('重复');
                        continue;
                    }

                    nicknames.push(nicknameTag.text());

                    Gesture.click(tipTag.bounds().left + 10 * Math.random(), tipTag.bounds().top + 20 * Math.random());
                    System.sleep(3000);
                    Log.log('进入了对话页面');

                    dl++;
                    let latestMsgTag = UiSelector().id('com.tencent.mm:id/bkl').isVisibleToUser(true).filter(v => {
                        return v.bounds().left < Device.width() - v.bounds().left - v.bounds().width();
                    }).findOne();
                    let msg = latestMsgTag.text();
                    let inputTag = UiSelector().id('com.tencent.mm:id/bkk').isVisibleToUser(true).findOne();
                    if (!inputTag) {
                        throw new Error('找不到输入框');
                    }

                    Gesture.click(inputTag.bounds().left + 10 * Math.random(), inputTag.bounds().top + 20 * Math.random());
                    inputTag = UiSelector().id('com.tencent.mm:id/bkk').isVisibleToUser(true).findOne();
                    if (!inputTag) {
                        throw new Error('找不到输入框');
                    }
                    inputTag.setText(getMsg(msg).msg);
                    System.sleep(2000);
                    let sendTag = UiSelector().id('com.tencent.mm:id/bql').text('发送').findOne();
                    if (!sendTag) {
                        throw new Error('找不到发送按钮');
                    }
                    Gesture.click(sendTag.bounds().left + 10 * Math.random(), sendTag.bounds().top + 20 * Math.random());
                    System.sleep(2000);
                    Gestrue.back();
                    Gestrue.back();
                    System.sleep(1000);
                }
                if (dl == 0) {
                    break;
                }
            }
        }
        Gestrue.back();
        System.sleep(3000);
        Log.log('返回到私信和消息处理界面');
    }
}

if (hasMessage()) {
    intoMessage();
}

