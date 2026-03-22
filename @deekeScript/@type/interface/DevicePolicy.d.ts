declare global {
    var DevicePolicy: DevicePolicy;
}

interface DevicePolicy {
    /**
     * 检查当前应用是否为Device Owner
     * @returns true表示是Device Owner，false表示不是
     */
    isDeviceOwner(): boolean;

    /**
     * 立即锁屏/息屏
     * 需要Device Owner权限
     * @returns 是否成功，true表示成功，false表示失败
     */
    lockNow(): boolean;

    /**
     * 亮屏/唤醒屏幕
     * 需要WAKE_LOCK权限（在AndroidManifest.xml中声明）
     * @returns 是否成功，true表示成功，false表示失败
     */
    wakeScreen(): boolean;
}

export {};
