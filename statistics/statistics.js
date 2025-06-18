let statistics = require('common/statistics.js');

var deekeStatistics = {
    dataList() {
        let data = statistics.getData();
        console.log(data);
        let weekData = statistics.getWeekData();
        console.log(weekData);

        //weight最大24
        return [
            {
                'title': '今日累计视频',
                'weight': 12,
                'checked': true,
                'value': data['s_viewVideo'],
                'data': weekData['s_viewVideo'],
            },
            {
                'title': '今日目标视频',
                'weight': 12,
                'value': data['s_viewTargetVideo'],
                'data': weekData['s_viewTargetVideo'],
            },
            {
                'title': '今日点赞',
                'weight': 8,
                'value': data['s_zan'],
                'data': weekData['s_zan'],
            },
            {
                'title': '今日评论',
                'count': 1,
                'weight': 8,
                'value': data['s_comment'],
                'data': weekData['s_comment'],
            },
            {
                'title': '今日赞评论',
                'weight': 8,
                'value': data['s_zanComment'],
                'data': weekData['s_zanComment'],
            },
            {
                'title': '今日私信',
                'weight': 8,
                'value': data['s_privateMsg'],
                'data': weekData['s_privateMsg'],
            },
            {
                'title': '今日关注',
                'count': 1,
                'weight': 8,
                'value': data['s_focus'],
                'data': weekData['s_focus'],
            },
            {
                'title': '今日访问',
                'weight': 8,
                'value': data['s_viewUser'],
                'data': weekData['s_viewUser'],
            },
        ];
    }
}
