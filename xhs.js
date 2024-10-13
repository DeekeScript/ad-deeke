
//console.log(textContains('小红薯').findOne().parent().parent());


//console.log(scrollable(true).find());

//id('com.xingin.xhs:id/k9v').findOne().scrollForward();

//id('com.xingin.xhs:id/g5d').findOne().scrollForward();//关注滑动
//id('com.xingin.xhs:id/k11').findOne().scrollForward();//粉丝滑动
//id('com.xingin.xhs:id/hf5').findOne().scrollForward();//推荐滑动

// let contains = id('com.xingin.xhs:id/cms').find();

// console.log(contains[0].children().findOne(id('com.xingin.xhs:id/jqy')));

// console.log(contains[0].children().findOne(id('com.xingin.xhs:id/jnz')));

// let a = textContains('小达人').findOne();

// console.log(a);
// log(a.parent());
// log(a.parent().parent());

// let containers = id('com.xingin.xhs:id/ks').findOne().children().find(className('android.view.ViewGroup'));

// for (let i in containers) {
//     log(containers[i].children());
//     console.log(containers[i].children().findOne(id('com.xingin.xhs:id/nickNameTV')));
//     break;
// }


// let a = scrollable(true).find();
// console.log(a);

// id('com.xingin.xhs:id/jq').findOne().scrollForward();

// let tag = descContains('发现').findOne();
// console.log(tag.parent().children());

// console.log(textContains('39').findOne());
// console.log(textContains('39').findOne().parent().parent());
// console.log(textContains('39').findOne().parent().parent().children());

// let tag = id('com.xingin.xhs:id/f05').filter(v => {
//     return v && v.bounds() && v.bounds().left > 0 && v.bounds().top > 0;
// }).findOne();

// log(tag.children());
// log(tag.parent().parent().parent().parent());

// let tag = id('fcc').findOne();
// log(tag);
// log(tag.children());


// let a = scrollable(true).find();
// console.log(a);

// id('com.xingin.xhs:id/gdo').findOne().scrollForward();

// id('com.xingin.xhs:id/b98').findOne().scrollForward();

// console.log(textContains('小红书').find());

// log(scrollable(true).find());
// let tag = id('com.xingin.xhs:id/jq').findOne();
// tag.scrollForward();



// log(id('com.xingin.xhs:id/jq').findOne().children().find(id('com.xingin.xhs:id/nickNameTV')));


// console.log(scrollable(true).find());
// id('com.xingin.xhs:id/gdo').findOne().scrollForward();

let Common = {
    id(idName) {
        return id('com.xingin.xhs:id/' + idName);
    },

    click(tag) {
        click(tag.bounds().centerX(), tag.bounds().centerY());
    },

    sleep(second) {
        sleep(second);
    }
}

// function privateMsg() {
//     let msg = '你好啊';
//     let sendIptTag = Common.id('awc').findOne();
//     console.log('开始设置私信', msg);
//     sendIptTag.setText(msg);
//     Common.sleep(500 + 500 * Math.random());

//     //发送
//     let sendBtnTag = Common.id('f7c').findOne();
//     Common.click(sendBtnTag);
//     console.log('点击发送');
// }

// privateMsg();

// function swipeFocusListOp() {
//     let swipeFocusListOpTarge = this.id('g5d').scrollable(true).filter((v) => {
//         return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().top >= 0;
//     }).findOnce();
//     swipeFocusListOpTarge.scrollForward();
// }

// swipeFocusListOp();


// console.log(scrollable(true).find());
// id('com.xingin.xhs:id/fcc').findOne().scrollForward();
// id('com.xingin.xhs:id/f09').findOne().scrollForward();

// let sendTag = Common.id('fif').textContains('发送').find();
// log(sendTag.click());

// log(textContains('游泳').find());

// log(textContains('感觉').findOne().parent().parent());

let tag = Common.id('f09').findOne();
log(tag);
if (tag) {
    tag.scrollForward();
}
