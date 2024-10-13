let baiduImageSimilar = {
    apiKey: '',
    secretKey: '',
    addImageUrl: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/realtime_search/similar/add',
    searchImageUrl: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/realtime_search/similar/search',
    getAccessTokenUrl: 'https://aip.baidubce.com/oauth/2.0/token',

    setApiKeyScretKey: function (apiKey, secretKey) {
        baiduImageSimilar.apiKey = apiKey;
        baiduImageSimilar.secretKey = secretKey;
    },

    //brief 可以填写名称 或者 本地数据库的图片id，tags填写图片分类id，最多两个 ，如：“123，13”
    add: function (image, brief, tags) {
        let res = http.post(this.addImageUrl, {
            image: image,
            brief: brief,
            tags: tags,
            access_token: this.getAccessToken(),
        });
        let re = res.body.json();
        // Log.log(re);
        if (re['log_id'] && re['cont_sign']) {
            return re;
        }
        return {};
    },

    //搜索图片  返回结果  pn为其实位置， rn为条数
    search: function (image, pn, rn) {
        if (pn == undefined) {
            pn = 0;
        }

        if (rn == undefined) {
            rn = 3;
        }

        Log.log('图像 搜索开始');
        let res = http.post(this.searchImageUrl, {
            image: image,
            access_token: this.getAccessToken(),
            pn: pn,
            rn: rn,
        });
        let re = res.body.json();
        Log.log('图像 搜索结束', re['result'][0]);
        // Log.log(re);
        if (re['result_num'] && re['result_num'] > 0) {
            return re['result'];
        }
        return [];
    },

    getAccessToken: function () {
        let res = http.httpGet(this.getAccessTokenUrl + '?grant_type=client_credentials&client_id=' + this.apiKey + '&client_secret=' + this.secretKey);
        let re = res.body.json();
        // Log.log(re);
        return re['access_token'];
    }
}

module.exports = baiduImageSimilar;
