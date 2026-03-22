declare global {
    var DeviceHardware: DeviceHardware;
}

interface DeviceHardware {
    /**
     * 禁用/启用截屏功能
     * 禁用后，用户无法通过系统快捷键截屏
     * 需要Device Owner权限
     * API级别要求：API 28 (Android 9.0) 及以上
     * @param disabled true表示禁用截屏，false表示启用截屏
     * @returns 是否成功，true表示成功，false表示失败
     */
    setScreenCaptureDisabled(disabled: boolean): boolean;

    /**
     * 禁用/启用锁屏界面
     * 禁用后，设备将不会显示锁屏界面（但可能仍需要解锁）
     * 需要Device Owner或Profile Owner权限
     * @param disabled true表示禁用锁屏界面，false表示启用锁屏界面
     * @returns 是否成功，true表示成功，false表示失败
     */
    setKeyguardDisabled(disabled: boolean): boolean;

    /**
     * 禁用/启用状态栏
     * 禁用后，状态栏将被隐藏
     * 需要Device Owner权限
     * API级别要求：API 26 (Android 8.0) 及以上
     * @param disabled true表示禁用状态栏，false表示启用状态栏
     * @returns 是否成功，true表示成功，false表示失败
     */
    setStatusBarDisabled(disabled: boolean): boolean;
}

export {};
