let db = {
    _table: undefined,
    _limit: limit,
    _offset: offset,

    db() {
        let storage = Storage.create("com.dke.qiao");
        return storage;
    },

    table(name) {
        this._table = 'table_' + name;
        return this;
    },

    limit(limit) {
        this.limit = limit;
        return this;
    },

    offset(offset) {
        this.offset = offset;
        return this;
    },

    select() {
        //将数据分为3级，每级最大为1000
        
    }
}

module.exports = db;
