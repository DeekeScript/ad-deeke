declare global {
    var DeviceKiosk: DeviceKiosk;
}

interface DeviceKiosk {
    /**
     * 设置锁定任务模式的应用包名列表
     * 需要Device Owner权限
     * 设置后，这些应用可以进入锁定任务模式（Kiosk模式）
     * @param packages 应用包名数组
     * @returns 是否成功，true表示成功，false表示失败
     */
    setLockTaskPackages(packages: string[]): boolean;

    /**
     * 获取锁定任务模式的应用包名列表
     * 需要Device Owner权限
     * @returns 应用包名数组，如果失败返回null
     */
    getLockTaskPackages(): string[] | null;

    /**
     * 检查锁定任务模式是否启用
     * 注意：此方法检查的是是否配置了锁定任务应用，而不是当前是否处于锁定任务模式
     * @returns true表示已配置锁定任务应用，false表示未配置
     */
    isLockTaskModeEnabled(): boolean;
}

export {};
