declare global {
    var System: System;
}

interface System {
    /**
     * 休眠
     * @param milliSecond 毫秒
     */
    public sleep(milliSecond: number): void;

    /**
     * 精确休眠
     * @param milliSecond 毫秒
     * 
     * 与sleep()方法相比，preciseSleep()使用更精确的休眠机制，
     * 通过WakeLock保持CPU唤醒状态，并使用循环检查来确保休眠时间的准确性。
     * 
     * 注意：此方法会保持CPU唤醒状态，可能会增加电量消耗。
     * 如果不需要精确的休眠时间，建议使用sleep()方法。
     */
    public preciseSleep(milliSecond: number): void;

    /**
     * 释放内存
     */
    public gc(): void;

    /**
     * 获取当前时间  yyyy-MM-dd HH:mm:ss.SSS 格式
     */
    public time(): string;

    /**
     * 获取当前Activity
     */
    public currentActivity(): string;

    /**
     * 获取当前包名
     */
    public currentPackage(): string;

    /**
     * 将内容设置到剪切板中
     * @param text 剪切板内容
     */
    public setClip(text: string): void;

    /**
     * 获取剪切板内容
     */
    public getClip(): string;

    /**
     * 吐司
     * @param text 显示文本
     */
    public toast(text: string): void;

    /**
     * 吐司（显示时间较长）
     * @param text 显示文本
     */
    public toastLong(text: string): void;

    /**
     * 
     * @param activity 等待的Activity
     * @param period 每次时间间隔
     * @param timeout 等待的总时间
     */
    public waitForActivity(activity: string, period: number, timeout: number): boolean;

    /**
     * 
     * @param activity 等待的PackageName的App启动
     * @param period 每次时间间隔
     * @param timeout 等待的总时间
     */
    public waitForPackage(packageName: string, period: number, timeout: number): boolean;

    /**
     * 停止所有脚本
     */
    public exit(): void;

    /**
     * 缓存清理
     */
    public cleanUp(): void;

    /**
     * 获取智能话术token
     * @param key 智能话术key
     * @param secret 智能话术secret
     */
    public AiSpeechToken(key: string, secret: string): string;

    /**
     * 生成窗口元素，使用App的上传日志，可以拿到文件
     */
    public generateWindowElements(): void;

    /**
     * 获取接口返回的内容
     * @param key 
     * @param dataForm 
     * @param content 
     */
    public getDataFrom(key: string, dataForm: string, content: string): string | null;

    /**
     * 是否显示时间悬浮窗窗口
     * @param show 是否显示
     */
    public setTimeWindowShow(show: boolean): void;

    /**
     * 切换无障碍模式，快速模式下，将自动过滤非重要控件。注意通过id或者text方式获取控件不受此模式影响；
     * @param mode 快速模式mode为fast，非快速模式为!fast
     */
    public setAccessibilityMode(mode: string): void;

    /**
     * 设置屏幕是否保持常亮
     * @param keepOn 是否保持屏幕常亮
     */
    public setKeepScreenOn(keepOn: boolean): void;
}

export { };
