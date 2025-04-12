// console.log(App.getAppVersionCode('com.smile.gifmaker'));


// console.log(parseFloat('2.2'));

// console.log('公里'.indexOf('2公里'));

// let tag = UiSelector().id('com.smile.gifmaker:id/player_cover_container').findOne();

// console.log(tag);

// let zd = tag.children().findOne(UiSelector().id('com.smile.gifmaker:id/profilegrid_showTop'));
// console.log(zd);


// console.log(String(232));

// console.log(UiSelector().id('com.smile.gifmaker:id/header_follow_button').text('i 关注').findOne());

// let tag = UiSelector().id('com.smile.gifmaker:id/comment_frame').isVisibleToUser(true).findOne();
// console.log(tag, tag.children().findOne(UiSelector().id('com.smile.gifmaker:id/name')));
// console.log(tag.children().findOne(UiSelector().id('com.smile.gifmaker.comment_detail:id/iv_comment_like')));

// let t = UiSelector().id('com.smile.gifmaker:id/name').findOne();
// console.log(t, t.parent());


// console.log(UiSelector().id('com.smile.gifmaker:id/editor').find());

// let livingTag = UiSelector().id('com.smile.gifmaker:id/live_mark').findOne();
// console.log(livingTag, livingTag.parent());

// console.log(UiSelector().id('com.smile.gifmaker:id/container').find());

// let a = UiSelector().desc('下小雨🌧️的作品').clickable(true).findOne();
// a.click();

// let scroll = UiSelector().id('com.smile.gifmaker:id/recycler_view').scrollable(true).isVisibleToUser(true).find();

// let scroll = UiSelector().scrollable(true).isVisibleToUser(true).find();//nasa_groot_view_pager
// console.log(scroll.length);

// for (let i in scroll) {
//     console.log(scroll[i]);
// }

// scroll[1].scrollForward();


// let tag = UiSelector().id('android:id/text1').text('精选').findOne();
// console.log(tag);

// let tag = UiSelector().id('com.smile.gifmaker:id/nasa_groot_view_pager').isVisibleToUser(true).scrollable(true).findOne();
// console.log(tag);

// let settingTag = UiSelector().id('com.smile.gifmaker:id/more_btn').descContains('更多').isVisibleToUser(true).findOnce();
// let settingTag2 = UiSelector().id('com.smile.gifmaker:id/more_btn').descContains('更多').findOnce();
// console.log(settingTag, settingTag2);

// console.log(UiSelector().textContains('有爱').find());

// let ui = UiSelector().scrollable(true).isVisibleToUser(true).find();
// console.log(ui[1]);

// ui[1].scrollForward();

// let homeTag = UiSelector().id('com.smile.gifmaker:id/kwai_image_view').isVisibleToUser(true).findOnce();
// console.log(homeTag);

//local: ['follow_tab_text', '同城', 'container', 'live_mark', 'recycler_view'],

// let tag = UiSelector().className('androidx.appcompat.app.ActionBar$c').desc('首页').isVisibleToUser(true).findOne();
// if (!tag) {
//     throw new Error('未进入首页');
// }

// Gesture.click(tag.bounds().left + 10, tag.bounds().top + 10);
// System.sleep(2000 + 1000 * Math.random());
// tag = UiSelector().id('com.smile.gifmaker:id/container').isVisibleToUser(true).filter(v => {
//     return v && v.children() && !v.children().findOne(UiSelector().id('com.smile.gifmaker:id/live_mark'));//不是直播
// }).findOne();

// console.log(tag);
// tag.click();

// let tag = UiSelector().id('com.smile.gifmaker:id/nasa_groot_view_pager').isVisibleToUser(true).scrollable(true).findOne();
// console.log(tag);


// let searchTag = UiSelector().id('com.smile.gifmaker:id/search_btn').isVisibleToUser(true).findOne();
// searchTag.click();
// System.sleep(1500 + 1500 * Math.random());


// let iptTag = UiSelector().id('com.smile.gifmaker:id/editor').isVisibleToUser(true).findOne();
// iptTag.setText('对对对');
// System.sleep(1500 + 1500 * Math.random());

// let searchBtn = UiSelector().id('com.smile.gifmaker:id/right_tv').isVisibleToUser(true).findOne();
// searchBtn.click();
// System.sleep(4000 + 2000 * Math.random());

// console.log(UiSelector().descContains('综合').findOne());

function swipeUserList() {
    let i = 3;
    while (i-- > 0) {
        let tags = UiSelector().id('com.smile.gifmaker:id/user_root_layout').isVisibleToUser(true).find();
        for (let m in tags) {
            let avatar = tags[m].children().findOne(UiSelector().isVisibleToUser(true).id('com.smile.gifmaker:id/avatar'));
            let nickname = tags[m].children().findOne(UiSelector().isVisibleToUser(true).id('com.smile.gifmaker:id/name'));
            if (!avatar || !nickname) {
                continue;
            }
            console.log(tags[m].id(), avatar.bounds(), nickname.text());
            avatar.click();//进入用户页面
        }

        let swipeTag = UiSelector().id('com.smile.gifmaker:id/recycler_view').scrollable(true).isVisibleToUser(true).findOne();
        swipeTag.scrollForward();
        System.sleep(2000 + 2000 * Math.random());
    }
}

// swipeUserList();

// let tags = UiSelector().id('com.smile.gifmaker:id/user_root_layout').isVisibleToUser(true).find();
// console.log(tags[0]._addr);

// console.log(UiSelector().scrollable(true).find()[4]);
// console.log(UiSelector().scrollable(true).find()[4].scrollForward());


// let tags = UiSelector().id('com.ss.android.ugc.aweme:id/rkz').findOnce().children().find(UiSelector().textMatches("[\\s\\S]+"));
// for (let i in tags) {
//     if (tags[i].text().indexOf('IP：') === 0) {
//         console.log(tags[i].text().replace('IP：', ''));
//     }
// }


// let tags = UiSelector().id('com.xingin.xhs:id/gf8').find();
// for (let i in tags) {
//     console.log(tags[i].desc());
// }
function getIpTag() {
    let tag = UiSelector().id('com.smile.gifmaker:id/comment_frame').isVisibleToUser(true).findOne();
    return UiSelector().id('com.smile.gifmaker.comment_detail:id/comment_created_time_and_loc').filter(v => {
        return v && v.bounds() && v.bounds().left >= tag.bounds().left && v.bounds().top > tag.bounds().top && v.bounds().top + v.bounds().height() < tag.bounds().top + tag.bounds().height();
    }).findOne();
}

console.log(getIpTag());
