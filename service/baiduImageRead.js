let baiduImageRead = {
    apiKey: '',
    secretKey: '',
    url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/numbers',
    urlText: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic',
    getAccessTokenUrl: 'https://aip.baidubce.com/oauth/2.0/token',

    read: function (image) {
        let res = http.post(this.url, {
            image: image,
            access_token: this.getAccessToken(),
        });
        var re = res.body.json();
        Log.log(re);
        if (re['words_result'] && re['words_result'][0]) {
            return re['words_result'][0]['words'];
        }
        return 0;
    },

    readText: function (image) {
        let res = http.post(this.urlText, {
            image: image,
            access_token: this.getAccessToken(),
        });
        var re = res.body.json();
        Log.log(re['words_result']);
        if (re['words_result'] && re['words_result'][0]) {
            return re['words_result'][0]['words'];
        }
        return 0;
    },

    getAccessToken: function () {
        let res = http.get(this.getAccessTokenUrl + '?grant_type=client_credentials&client_id=' + this.apiKey + '&client_secret=' + this.secretKey);
        var re = res.body.json();
        // Log.log(re);
        return re['access_token'];
    }
}

module.exports = baiduImageRead;
