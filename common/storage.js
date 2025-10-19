let storage = {
    getToken() {
        return Storage.get("token");
    },

    getPackage() {
        return Storage.get("package");
    },

    getMachineType() {
        return 1;
    },

    getSpeech() {
        let data = Storage.get('deekeScript:speech:default');
        console.log("speech内容");
        console.log(data);
        if (!data) {
            return [];
        }

        data = JSON.parse(data);
        return data && data.speechLists;
    },

    getTask() {
        let data = Storage.get('task');
        if (!data) {
            return [];
        }

        data = JSON.parse(data);
        return data;
    },


    removeTaskDetail(i) {
        let data = this.getTaskDetail();
        if (data.length === 0) {
            return true;
        }

        data.splice(i, 1);
        Storage.put('taskDetail', JSON.stringify(data));
    },

    addTaskDetail(item) {
        let data = this.getTaskDetail();
        data.push(item);
        Storage.put('taskDetail', JSON.stringify(data));
        return data;
    },

    getTaskDetail(taskIndex) {
        let data = Storage.get('taskDetail');
        if (!data || data.length === 0) {
            return [];
        }

        data = JSON.parse(data);
        //Log.log(taskIndex, data);
        if (taskIndex) {
            for (let i in data) {
                if (data[i].taskIndex === taskIndex) {
                    //Log.log(data[i]);
                    return data[i];
                }
            }
            return {};
        }
        return data;
    },

    getMobileStopType() {
        return Storage.get('mobileStopType');
    },

    //尽量 文件名 + key的模式
    get(key, type) {
        if (type == undefined) {
            type = "string"
        }
        Log.log("key:" + key + ":type:" + type);
        if (type == "string") {
            return Storage.get(key);
        } else if (type == 'int') {
            return Storage.getInteger(key);
        } else if (type == 'float') {
            return Storage.getDouble(key);
        } else if (type == 'object') {
            return Storage.getObject(key);
        } else if (type == 'bool') {
            return Storage.getBoolean(key);
        }

        return undefined;
    },

    getArray(key) {
        return Storage.getArray(key);
    },

    //尽量 文件名 + key的模式
    set(key, value) {
        if (typeof value == 'string') {
            Storage.put(key, value);
        } else if (typeof value == 'boolean') {
            Storage.putBool(key, value);
        } else if (typeof value == 'object') {
            Storage.putDouble(key, value);
        } else if (typeof value == 'undefined' || typeof value == 'null') {
            Storage.putObj(key, value);
        } else if (Number.isInteger(value)) {
            Storage.putInteger(key, value);
        } else if (Number.isFloat(value)) {
            Storage.putDouble(key, value);
        } else {
            Storage.putObj(key, value);
        }
        return true;
    },
}

module.exports = storage;
