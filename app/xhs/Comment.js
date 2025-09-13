let Common = require('app/xhs/Common');
let statistics = require('common/statistics');
let Comment = {
    clickZan(tag){
        if(tag.isSelected()){
            return true;
        }
        Common.click(tag, 0.25);
        statistics.zan();
    },

    intoUserPage(tag){
        Common.click(tag, 0.25);
        Common.sleep(3000 + 2000 * Math.random());
        statistics.viewUser();
    }
}

module.exports = Comment;
