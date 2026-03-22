declare global {
    var DeviceApp: DeviceApp;
}

interface DeviceApp {
    /**
     * 权限策略常量 - 提示用户
     */
    PERMISSION_POLICY_PROMPT: number;

    /**
     * 权限策略常量 - 自动授予
     */
    PERMISSION_POLICY_AUTO_GRANT: number;

    /**
     * 权限策略常量 - 自动拒绝
     */
    PERMISSION_POLICY_AUTO_DENY: number;

    /**
     * 权限授予状态常量 - 默认状态
     */
    PERMISSION_GRANT_STATE_DEFAULT: number;

    /**
     * 权限授予状态常量 - 已拒绝
     */
    PERMISSION_GRANT_STATE_DENIED: number;

    /**
     * 权限授予状态常量 - 已授予
     */
    PERMISSION_GRANT_STATE_GRANTED: number;

    /**
     * 静默安装应用
     * 需要Device Owner权限
     * @param packageUri 应用安装包URI（文件路径），例如 "file:///sdcard/app.apk" 或 "/sdcard/app.apk"
     * @returns 是否成功，true表示成功，false表示失败
     */
    installPackage(packageUri: string): boolean;

    /**
     * 静默卸载应用
     * 需要Device Owner权限
     * @param packageName 应用包名，例如 "com.example.app"
     * @returns 是否成功，true表示成功，false表示失败
     */
    uninstallPackage(packageName: string): boolean;

    /**
     * 隐藏/显示应用
     * 隐藏的应用将从启动器中移除，但不会卸载
     * 需要Device Owner权限
     * @param packageName 应用包名，例如 "com.example.app"
     * @param hidden true表示隐藏，false表示显示
     * @returns 是否成功，true表示成功，false表示失败
     */
    setApplicationHidden(packageName: string, hidden: boolean): boolean;

    /**
     * 检查应用是否隐藏
     * 需要Device Owner权限
     * @param packageName 应用包名，例如 "com.example.app"
     * @returns true表示应用已隐藏，false表示应用未隐藏或查询失败
     */
    isApplicationHidden(packageName: string): boolean;

    /**
     * 设置应用权限策略
     * 需要Device Owner权限
     * @param policy 权限策略，使用常量：PERMISSION_POLICY_PROMPT (0) - 提示用户，PERMISSION_POLICY_AUTO_GRANT (1) - 自动授予，PERMISSION_POLICY_AUTO_DENY (2) - 自动拒绝
     * @returns 是否成功，true表示成功，false表示失败
     */
    setPermissionPolicy(policy: number): boolean;

    /**
     * 授予运行时权限
     * 需要Device Owner权限
     * @param packageName 应用包名，例如 "com.example.app"
     * @param permission 权限名称，例如 "android.permission.CAMERA"
     * @returns 是否成功，true表示成功，false表示失败
     */
    grantRuntimePermission(packageName: string, permission: string): boolean;

    /**
     * 检查权限是否已授予
     * 需要Device Owner权限
     * @param packageName 应用包名，例如 "com.example.app"
     * @param permission 权限名称，例如 "android.permission.CAMERA"
     * @returns true表示权限已授予，false表示权限未授予或查询失败
     */
    isPermissionGranted(packageName: string, permission: string): boolean;
}

export {};
