export let storage = {
    getToken() {
        return Storage.get("token");
    },

    setToken(token) {
        return Storage.put("token", token);
    },

    getMobile() {
        return Storage.get("mobile");
    },

    setMobile(mobile) {
        return Storage.put("mobile", mobile);
    },

    getMachineId() {
        return Storage.get("machine_id");
    },

    setMachineId(machineId) {
        return Storage.put("machine_id", machineId);
    },

    getInit() {
        return Storage.get("init");
    },

    setInit(type) {
        return Storage.put("init", type);
    },

    removeToken() {

        Storage.remove('token');
        return true;
    },

    setPackage(name) {
        return Storage.put("package", name);
    },

    getPackage() {
        return Storage.get("package");
    },

    setTag(name) {
        return Storage.put("tag", name);
    },

    getTag() {
        return Storage.get("tag");
    },

    //1无后台，2有后台
    setMachineType(type) {
        return Storage.put("machineType", type);
    },

    getMachineType() {
        return 1;
    },

    setOpenWx(type) {
        return Storage.put("openWx", type);
    },

    getOpenWx() {
        return Storage.get("openWx");
    },

    setIsAgent(type) {
        return Storage.put("isAgent", type);
    },

    getIsAgent() {
        return Storage.get("isAgent");
    },

    getMakeMoney() {

        return Storage.get("makeMoney");
    },

    setMakeMoney(type) {
        return Storage.put("makeMoney", type);
    },

    setCity(city) {
        return Storage.put("city", city);
    },

    getCity() {
        return Storage.get("city");
    },

    setExcNicknames(nicknames) {
        return Storage.put("excNicknames", nicknames);
    },

    getExcNicknames() {
        return Storage.get("excNicknames");
    },

    setEndTime(time) {
        return Storage.put("endTime", time);
    },

    getEndTime() {
        return Storage.get("endTime");
    },

    removeSpeech(index) {
        let data = this.getSpeech();
        if (data.length === 0) {
            return true;
        }

        for (let i in data) {
            if (data[i].index === index) {
                data.splice(i, 1);
            }
        }
        Storage.put('deekeScript:speech:default', JSON.stringify(data));
    },

    addSpeech(item) {
        let data = this.getSpeech();
        data.push(item);
        Storage.put('deekeScript:speech:default', JSON.stringify(data));
        return data;
    },

    addSpeechAll(items) {
        let data = this.getSpeech();

        for (let item of items) {
            data.push(item);
        }
        Storage.put('deekeScript:speech:default', JSON.stringify(data));

        return data;
    },

    getSpeech() {
        let data = Storage.get('deekeScript:speech:default');
        console.log("speech内容");
        console.log(data);
        if (!data) {
            return [];
        }

        data = JSON.parse(data);
        return data?.speechLists;
    },

    clearSpeech() {
        let data = [];
        Storage.put('deekeScript:speech:default', JSON.stringify(data));
        return data;
    },

    removeTask(index) {
        let data = this.getTask();
        if (data.length === 0) {
            return true;
        }

        for (let i in data) {
            if (data[i].index === index) {
                data.splice(i, 1);
            }
        }

        Storage.put('task', JSON.stringify(data));
    },

    addTask(item) {
        let data = this.getTask();
        data.push(item);
        Storage.put('task', JSON.stringify(data));
        return data;
    },

    getTask() {
        let data = Storage.get('task');
        if (!data) {
            return [];
        }

        data = JSON.parse(data);
        return data;
    },

    updateTask(index, title) {
        let data = this.getTask();
        if (data.length === 0) {
            return [];
        }

        for (let i in data) {
            if (data[i].index === index) {
                data[i].title = title;
            }
        }

        Storage.put('task', JSON.stringify(data));
        return data;
    },

    updateTaskState(index, state) {
        let data = this.getTask();
        if (data.length === 0) {
            return false;
        }

        for (let i in data) {
            if (data[i].index === index) {
                data[i].state = state;
            }
        }

        Storage.put('task', JSON.stringify(data));
        return true;
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

    updateTaskDetail(data, taskTrue) {
        let items = this.getTaskDetail();
        let update = false;
        if (items && items.length) {
            for (let i in items) {
                if (items[i].taskIndex === data.taskIndex) {
                    items[i] = data;
                    update = true;
                    break;
                }
            }
        }

        if (!update) {
            items.push(data);
        }
        Storage.put('taskDetail', JSON.stringify(items));

        Log.log('taskTrue', taskTrue, data.taskIndex);
        if (taskTrue) {
            this.updateTaskState(data.taskIndex, true);
        }
        return data;
    },

    setMobileStopType(type) {
        Storage.put('mobileStopType', type);
        return true;
    },

    getMobileStopType() {
        return Storage.get('mobileStopType');
    },

    //尽量 文件名 + key的模式
    get(key, type = "string") {
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

    getArray(key){
        return Storage.getArray(key);
    },

    //尽量 文件名 + key的模式
    set(key, value) {
        Storage.put(key, value);
        return true;
    },
}
