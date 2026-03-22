declare global {
    var Gesture: Gesture;
}

interface Gesture {
    /**
     * 点击屏幕位置
     * @param x x坐标
     * @param y y坐标
     */
    public click(x: number, y: number): boolean;

    /**
     * 长按屏幕位置
     * @param x x坐标
     * @param y y坐标
     */
    public longClick(x: number, y: number): boolean;

    /**
     * 长按屏幕位置（可设置时长）
     * @param x x坐标
     * @param y y坐标
     * @param duration 长按时长，毫秒
     */
    public press(x: number, y: number, duration: number): boolean;

    /**
     * 从(x1,y1)滑动到(x2,y2)，并且耗时duration毫秒
     * @param x1 起始位置，x坐标
     * @param y1 起始位置，y坐标
     * @param x2 结束位置，x坐标
     * @param y2 结束位置，y坐标
     * @param duration 滑动时长，毫秒
     */
    public swipe(x1: number, y1: number, x2: number, y2: number, duration: number): boolean;

    /**
     * 返回键
     */
    public back(): boolean;

    /**
     * 主页键（Home键）
     */
    public home(): boolean;

    /**
     * 任务切换键
     */
    public recents(): boolean;
}

export { };
