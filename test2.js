let user = textContains('用户').id('android:id/text1').findOne();

log(user);

click(user.bounds().centerX(), user.bounds().centerY());


log(Math.random(22.33));
