const Common = {
    //封装的方法
    logs: [],
    id(name) {
        return id('com.ss.android.ugc.aweme:id/' + name);
    },
    aId(name) {
        //android:id/text1
        return id('android:id/' + name);
    },
}

// let tjTag = DyCommon.id('yic').text('推荐').findOne().parent();
// if (tjTag && tjTag.desc().indexOf("已选中") != -1) {
//     console.log('32423423432');
// }


// let tag = descMatches(/自定义表情[\\s\\S]+/).findOne().parent();
// console.log(tag);

// let tagParent = desc('表情').clickable(true).findOne();

// if (tagParent) {
//     let imgTag = tagParent.parent();
//     console.log(imgTag);
// }

// let tag = Common.id('o-8').findOne();
// console.log(tag);
// let img = tag.children().findOne(desc('表情'));

// img.click();

// let submitTag = Common.id('dj2').findOne();

// console.log(submitTag);
// console.log(submitTag.click());



// let header = Common.id('pgn').findOne();

// console.log(header.parent());

// console.log(desc('取消').find());
// console.log(desc('关闭').find());

//console.log(Common.id('pgx').findOne().children());
// console.log(Common.id('title_bar').findOne());

// console.log(Common.id('vq7').findOne());

// console.log(Common.id('u+m').findOne());


// let a = scrollable(true).find();
// console.log(a);
// console.log(a.scrollForward());


// console.log(Common.id('wl0').find());



// console.log(textContains('59').findOne());
// console.log(descContains('59').findOne());


// console.log(Common.id('content').find());
// console.log(Common.id('tv_name').find());

// console.log(textContains("作品").findOne());

// console.log(Common.id('wk5').findOne());

// console.log(descContains('表情').findOne().parent());

// let a = Common.id('i7r').findOne().children().findOne(descContains('表情'));
// console.log(a);


// console.log(descContains('自定义表情').find());

// let tag = textContains("中国").filter((v) => {
//     return v && v._id == null;
// }).findOnce().parent().children().findOne(textContains("直播"));

// console.log(tag);

// let tags = Common.id("_a").findOnce().children().find(textMatches(/[\s\S]+/)).filter((v) => {
//     return v && !v.text().includes('我的信息') && v.bounds().top > 0 && v.bounds().top + v.bounds().height() < device.height - 300 && v.bounds().left < 10 && v.bounds().width() >= device.width - 10;
// });

// console.log(tags);


// let swipeSearchUserOpTarge = Common.id("syq").scrollable(true).filter((v) => {
//     return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() == device.width && v.bounds().top >= 0;
// }).findOnce();

// if (swipeSearchUserOpTarge) {
//     swipeSearchUserOpTarge.scrollForward();
// } else {
//     console.log('滑动失败');
// }

// console.log(Common.id('syq').scrollable(true).find());

// console.log(Common.id('desc').find());

// console.log(textContains('大品牌').find());

// console.log(Common.id('ero').findOne());

// let a = scrollable(true).find();

// console.log(a);

// Common.id('rw3').findOne().scrollForward();

// console.log(descContains('点击进入直播间').find());

// let container = descContains('美女').findOne();
// console.log(container);

// console.log(text("取消关注").findOne());

// let tags = Common.id('p=u').findOnce().children().find(textMatches("[\\s\\S]+"));

// log(tags);


// console.log(textContains('直播按钮').findOne().parent().children());


// let tag = textContains('zhang').textContains('抖音号').filter((v) => {
//     return v && v._id == null && v.bounds().left > 0;;
// }).findOnce().parent().children().findOne(textContains('直播').filter((v) => {
//     return v && v.bounds() && v.bounds().width() < device.width();//过滤其他，应该能获取当前的头像
// }));

// log(tag);

// let tags = Common.aId("text1").textContains("作品").findOne();//rj5 或者 ptm
// console.log(tags);


// let containers = className('android.widget.FrameLayout').focusable(true).filter((v) => {
//     return v && v.bounds() && v.bounds().left === 0 && v.bounds().top > 400 && v.bounds().top + v.bounds().height() < device.height && !!v.children() && !!v.children().findOne(textContains('粉丝'));
// }).find();

// for (let i in containers) {
//     if (isNaN(i)) {
//         continue;
//     }
//     let titleTag = containers[i].children().findOne(textContains('粉丝'));
//     console.log(titleTag);
// }

// sleep(5000);
// let douyin = textContains("抖音").findOnce();
// if (douyin && douyin.text()) {
//     console.log(douyin.text());
// }



// console.log(Common.id('rw3').scrollable(true).find());

// console.log(Common.id('rw3').scrollable(true).find()[0].scrollForward());
// console.log(Common.id('rw3').scrollable(true).find()[1].scrollForward());

// console.log(textContains('有限公司').findOne().parent());

// console.log(clickable(false).find());

// console.log(Common.id('v9f').findOne(1000));//Rect(0, 0 - 1080, 120); boundsInScreen: Rect(0, 1401 - 1080, 1521)

// console.log(Common.id('dsc').findOne(1000));


// console.log(Common.id('d6s').filter(v=>{
//     return v && v.bounds() && v.bounds() && v.bounds().width()>0;
// }).findOne(1000));

// console.log(Common.id('bj').findOne(1000));

// let contains = Common.id('root_layout').find();
// for (let i in contains) {
//     if (isNaN(i)) {
//         continue;
//     }

//     let nicknameTag = contains[i].children().findOne(Common.id('0bq'));
//     console.log(contains[i]);
//     console.log(nicknameTag);
// }


// let scrolls = Common.id("1").scrollable(true).find();
// console.log(scrolls);


// for (let i in scrolls) {
//     if(isNaN(i)){
//         continue;
//     }


//     scrolls[i].scrollForward();
// }

//console.log(textContains('置顶').find());

// let contains = Common.id('container').find();
// for(let i in contains){
//     if(isNaN(i)){
//         continue;
//     }

//     log(contains[i].children().find(Common.id('z5t')));
// }

// let containers = scrollable(true).find();
// log(textContains('取消关注').findOne().parent().click());

// Common.id('explorer_item_list').findOne().scrollForward();

// console.log(id('u-o').findOne().scrollForward());


// console.log(id('wk5').findOne().scrollForward());


// console.log(textMatches(/[\s\S]+/).clickable(true).filter(v => {
//     return v && v.bounds() && v.bounds().width() == device.width;
// }).find());


// log(scrollable(true).find()[0].scrollForward());


// swipe(200, device.height * 0.3, 200, device.height * 0.7, 100);

let ass = '漾YOUNG男士发型22';
// let a = textContains('漾YOUNG男士发型2').findOne();

// log(ass.substring(0, ass.length/2));
// a = textContains(ass.substring(0, ass.length/2)).findOne();
// log(a);


// log(textContains('查看详情').findOne());

// log(textContains('点击重播').findOne());


// log(id('container').filter(v=>{
//     log(v.bounds().width(), device.width);
//     return v && v.bounds() && v.bounds().width() <= device.width/3;
// }).find());

// console.log(scrollable(true).findOne().scrollForward());

// // id('oc8').findOne().scrollForward();
// id('nrj').findOne().scrollForward();

// let a = textMatches(/.+/).find();

// console.log(a);

// let a = className('android.widget.FrameLayout').filter((v) => {
//     return v && v.bounds() && v.bounds().width() >= device.width - 10 && v.bounds().left >= 0 && v.bounds().top + v.bounds().height() < device.height;
// }).find();
// log(a);

// log(descContains('蒙').find());

// log(descMatches(/[\s\S]*/).find());


// console.log(scrollable(true).find());

// id('fhj').findOne().scrollForward();

log(id('s4y').findOne().parent());

