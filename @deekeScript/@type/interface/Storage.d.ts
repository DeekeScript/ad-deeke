
declare global {
    var Storage: storage;
}

interface storage {
    /**
     * 创建存储实例  全局使用一个即可
     * @param db 数据库名称
     * @return 返回当前实例，如果已存在则直接返回
     */
    public create(db: string): storage;

    /**
     * 设置字符串
     * @param key 键
     * @param value 值
     */
    public put(key: string, value: string): boolean;

    /**
     * 设置整型值
     * @param key 键
     * @param value 值
     */
    public putInteger(key: string, value: number): boolean;

    /**
     * 设置bool
     * @param key 键
     * @param value 值
     */
    public putBoolean(key: string, value: boolean): boolean;

    /**
     * 设置双精度值
     * @param key 键
     * @param value 值
     */
    public putDouble(key: string, value: number): boolean;

    /**
     * 设置对象
     * @param key 键
     * @param obj 值
     */
    public putObj(key: string, obj: object): boolean;

    /**
     * 设置集合（字符串）
     * @param key 键
     * @param set 值
     */
    public putArray(key: string, arr: Array): boolean;

    /**
     * 获取集合（字符串）
     * @param key 键
     */
    public getArray(key: string): Array;

    /**
     * 获取字符串
     * @param key 键
     */
    public get(key: string): string;

    /**
     * 获取字符串
     * @param key 键
     */
    public getString(key: string): string;

    /**
     * 获取bool类型的值
     * @param key 键
     */
    public getBoolean(key: string): boolean;

    /**
     * 获取Double类型的值
     * @param key 键
     */
    public getDouble(key: string): number;

    /**
     * 获取整型类型的值
     * @param key 键
     */
    public getInteger(key: string): number;

    /**
     * 获取对象类型的值
     * @param key 键
     */
    public getObj(key: string): object;

    /**
     * 移除某个键
     * @param key 键
     * @return 返回Promise，实际使用时通过blockingSubscribe()或toCompletionStage()来获取结果
     */
    public remove(key: string): any; // 实际返回Single<Preferences>，在JavaScript中可以通过异步方式处理

    /**
     * 清空所有值
     * @return 返回Promise，实际使用时通过blockingSubscribe()或toCompletionStage()来获取结果
     */
    public clear(): any; // 实际返回Single<Preferences>，在JavaScript中可以通过异步方式处理

    /**
     * 判断是否包含键为key的数据
     * @param key 键
     * @return 返回boolean，表示是否存在该键
     */
    public contains(key: string): boolean;
}

export { };
