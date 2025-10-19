let Common = require('app/xhs/Common');
let statistics = require('common/statistics');
let Comment = {
    clickZan(tag, type) {
        if (tag.isSelected()) {
            return true;
        }

        if (type == 1) {
            tag.click();
        } else {
            Common.click(tag, 0.25);
        }

        statistics.zan();
    },

    intoUserPage(tag, type) {
        if (type == 1) {
            tag.click();
        } else {
            Common.click(tag, 0.25);
        }

        Common.sleep(3000 + 2000 * Math.random());
        statistics.viewUser();
    }
}

module.exports = Comment;
