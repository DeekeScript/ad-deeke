global {
    var Hid: hid;
}

interface hid {
    /**
     * 模拟从一个点滑动到另一个点。
     * @param x1 起始点X坐标
     * @param y1 起始点Y坐标
     * @param x2 终点X坐标
     * @param y2 终点Y坐标
     * @param step 每步移动距离（5-60，默认随机20-51）
     * @param downTimeout 按下后等待时间（默认随机100-180ms）
     * @param upTimeout 滑动结束后等待抬起时间（默认随机100-180ms）
     * @param timeout 每步之间的延迟时间（默认随机8-15ms）
     * @param upDownTimes 抬起次数（默认1）
     * @returns 是否滑动成功
     */
    swipe(x1: number, y1: number, x2: number, y2: number, step?: number, downTimeout?: number, upTimeout?: number, timeout?: number, upDownTimes?: number): boolean;

    /**
     * 使用仿真曲线滑动。
     * @param x1 起始点X坐标
     * @param y1 起始点Y坐标
     * @param x2 终点X坐标
     * @param y2 终点Y坐标
     * @param radian 弧度大小（默认10-100）
     * @param step 每步移动距离（5-60，默认随机20-51）
     * @param downTimeout 按下后等待时间（默认随机100-180ms）
     * @param upTimeout 滑动结束后等待抬起时间（默认随机100-180ms）
     * @param timeout 每步之间的延迟时间（默认随机8-15ms）
     * @param upDownTimes 抬起次数（默认1）
     * @returns 是否滑动成功
     */
    swipex(x1: number, y1: number, x2: number, y2: number, radian?: number, step?: number, downTimeout?: number, upTimeout?: number, timeout?: number, upDownTimes?: number): boolean;

    /**
     * 获取服务器HID激活码。
     * @returns 激活码字符串
     * @throws Error 当蓝牙未初始化时
     */
    getHidZcm(): string;

    /**
     * 获取插件版本号。
     * @returns 插件版本号
     */
    ver(): number;

    /**
     * 模拟按下Home键。
     * @returns 是否成功
     */
    home(): boolean;

    /**
     * 模拟按下任务键。
     * @returns 是否成功
     */
    recents(): boolean;

    /**
     * 模拟按下返回键。
     * @returns 是否成功
     */
    back(): boolean;

    /**
     * 使用另一种方式模拟按下返回键。
     * @returns 是否成功
     */
    back1(): boolean;

    /**
     * 模拟手指按下事件。
     * @param x X坐标
     * @param y Y坐标
     * @returns 是否成功
     */
    touchDown(x: number, y: number): boolean;

    /**
     * 模拟手指移动事件。
     * @param x X坐标
     * @param y Y坐标
     * @returns 是否成功
     */
    touchMove(x: number, y: number): boolean;

    /**
     * 模拟手指抬起事件。
     * @param x X坐标
     * @param y Y坐标
     * @returns 是否成功
     */
    touchUp(x?: number, y?: number): boolean;

    /**
     * 模拟手指多次抬起事件。
     * @returns 是否成功
     */
    touchUp2(): boolean;

    /**
     * 模拟点击事件。
     * @param x X坐标
     * @param y Y坐标
     * @returns 是否成功
     */
    tap(x: number, y: number): boolean;

    /**
     * 初始化蓝牙模块。
     * @param ctx 上下文对象
     * @returns 是否成功
     */
    initBluetooth(ctx: any): boolean;

    /**
     * 获取已连接蓝牙设备名称。
     * @returns 设备名称
     */
    getName(): string;

    /**
     * 模拟按键按下事件。
     * @param code 键码
     * @returns 是否成功
     */
    keyDown(code: number): boolean;

    /**
     * 模拟按键抬起事件。
     * @param code 键码
     * @returns 是否成功
     */
    keyUp(code: number): boolean;

    /**
     * 模拟按键按下和抬起事件。
     * @param code 键码
     * @returns 是否成功
     */
    keyPress(code: number): boolean;

    /**
     * 模拟指定键码的按键事件。
     * @param code 键码
     * @returns 是否成功
     */
    keyPress_code(code: number): boolean;

    /**
     * 模拟指定键码的按键按下。
     * @param code 键码
     * @returns 是否成功
     */
    keyDown_code(code: number): boolean;

    /**
     * 模拟指定键码的按键抬起。
     * @param code 键码
     * @returns 是否成功
     */
    keyUp_code(code: number): boolean;

    /**
     * 模拟松开所有按键。
     * @returns 是否成功
     */
    keyUpAll(): boolean;

    /**
     * 模拟全选操作。
     * @returns 是否成功
     */
    key_select(): boolean;

    /**
     * 模拟粘贴操作。
     * @returns 是否成功
     */
    key_paste(): boolean;

    /**
     * 模拟复制操作。
     * @returns 是否成功
     */
    key_copy(): boolean;

    /**
     * 模拟剪切操作。
     * @returns 是否成功
     */
    key_cat(): boolean;

    /**
     * 模拟退格操作。
     * @returns 是否成功
     */
    key_del(): boolean;

    /**
     * 模拟删除操作。
     * @returns 是否成功
     */
    key_delete(): boolean;

    /**
     * 模拟回车操作。
     * @returns 是否成功
     */
    key_enter(): boolean;

    /**
     * 模拟数字键输入。
     * @param n 数字（0-9）
     * @returns 是否成功
     */
    key_num(n: number): boolean;

    /**
     * 模拟字母键输入。
     * @param n 字母
     * @returns 是否成功
     */
    key_abc(n: string): boolean;

    /**
     * 模拟音量加操作。
     * @returns 是否成功
     */
    volUp(): boolean;

    /**
     * 模拟音量减操作。
     * @returns 是否成功
     */
    volDown(): boolean;

    /**
     * 模拟按下电源键。
     * @param time 持续时间（可选）
     * @returns 是否成功
     */
    power(time?: number): boolean;

    /**
     * 模拟重启设备。
     * @returns 是否成功
     */
    reboot(): boolean;

    /**
     * 设置屏幕分辨率。
     * @param x 宽度
     * @param y 高度
     * @returns 是否成功
     */
    setXY(x: number, y: number): boolean;

    /**
     * 注册设备。
     * @param key 注册码
     * @returns 是否成功
     */
    reg(key: string): boolean;

    /**
     * 设置点击延时随机数。
     * @param x X随机数
     * @param y Y随机数
     * @returns 是否成功
     */
    setRnd(x: number, y: number): boolean;

    /**
     * 设置设备电量。
     * @param lv 电量百分比
     * @returns 是否成功
     */
    setBattery(lv: number): boolean;

    /**
     * 连接蓝牙设备。
     * @param autoconnect 是否自动连接
     * @param index 设备索引
     * @returns 是否成功
     */
    connect(autoconnect: boolean, index: number): boolean;

    /**
     * 获取已连接的蓝牙设备。
     * @returns 蓝牙设备对象或null
     */
    getConnectedDevices(): any;

    /**
     * 获取蓝牙连接状态。
     * @returns 是否已连接
     */
    getConnectState(): boolean;

    /**
     * 发送数据到蓝牙设备。
     * @param str 数据内容
     * @returns 是否成功
     */
    sendData(str: string): boolean;

    /**
     * 发送数据并等待响应。
     * @param str 数据内容
     * @param time 等待时间（毫秒）
     * @returns 是否成功
     */
    sendDataAwait(str: string, time: number): boolean;

    /**
     * 获取接收到的数据。
     * @param time 等待时间（可选）
     * @returns 返回数据
     */
    getData(time?: number): string;

    /**
     * 等待数据响应。
     * @param time 最大等待时间（毫秒，可选）
     * @param sleep 检查间隔（毫秒，可选）
     * @returns 返回数据或超时信息
     */
    waitFor(time?: number, sleep?: number): string;

    /**
     * 断开蓝牙连接。
     * @returns 是否成功
     */
    disconnect(): boolean;

}

export { };
