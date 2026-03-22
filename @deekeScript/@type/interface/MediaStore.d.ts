declare global {
    var MediaStore: MediaStore;
}

/**
 * MediaStore 媒体库操作类
 * 用于操作 Android 系统相册、下载、文档等媒体文件
 */
interface MediaStore {
    // ==================== 图片操作 ====================

    /**
     * 获取相册中的所有图片
     * @return JavaScript 数组，包含图片信息对象 {id, name, path, uri, size, date}
     */
    public getImages(): any[];

    /**
     * 保存图片到相册
     * @param sourcePath 源图片路径
     * @param displayName 显示名称（可选）
     * @param relativePath 相对路径（可选，如 "Pictures/MyApp"）
     * @return 保存后的 content:// Uri 字符串，失败返回 null
     */
    public saveImage(sourcePath: string, displayName?: string, relativePath?: string): string | null;

    /**
     * 保存图片到相册（使用默认配置）
     * @param sourcePath 源图片路径
     * @return 保存后的 content:// Uri 字符串
     */
    public saveImage(sourcePath: string): string | null;

    /**
     * 删除图片
     * @param uriString content:// Uri 字符串
     * @return 删除成功返回 true
     */
    public deleteImage(uriString: string): boolean;

    // ==================== 视频操作 ====================

    /**
     * 获取相册中的所有视频
     * @return JavaScript 数组，包含视频信息对象 {id, name, path, uri, size, duration, date}
     */
    public getVideos(): any[];

    /**
     * 保存视频到相册
     * @param sourcePath 源视频路径
     * @param displayName 显示名称（可选）
     * @param relativePath 相对路径（可选）
     * @return 保存后的 content:// Uri 字符串，失败返回 null
     */
    public saveVideo(sourcePath: string, displayName?: string, relativePath?: string): string | null;

    /**
     * 保存视频到相册（使用默认配置）
     * @param sourcePath 源视频路径
     * @return 保存后的 content:// Uri 字符串
     */
    public saveVideo(sourcePath: string): string | null;

    /**
     * 删除视频
     * @param uriString content:// Uri 字符串
     * @return 删除成功返回 true
     */
    public deleteVideo(uriString: string): boolean;

    // ==================== 音频操作 ====================

    /**
     * 获取所有音频文件
     * @return JavaScript 数组，包含音频信息对象 {id, name, path, uri, size, duration, artist, album}
     */
    public getAudios(): any[];

    /**
     * 保存音频文件
     * @param sourcePath 源文件路径
     * @param displayName 显示名称（可选）
     * @return 保存后的 content:// Uri 字符串，失败返回 null
     */
    public saveAudio(sourcePath: string, displayName?: string): string | null;

    // ==================== 下载文件操作 ====================

    /**
     * 保存文件到下载目录
     * @param sourcePath 源文件路径
     * @param displayName 显示名称（可选）
     * @return 保存后的 content:// Uri 字符串（Android 10+）或文件路径（Android 9-），失败返回 null
     */
    public saveToDownloads(sourcePath: string, displayName?: string): string | null;

    /**
     * 获取下载目录的所有文件
     * API 29+ 使用 MediaStore，API 26-28 使用文件系统
     * @return JavaScript 数组，包含文件信息对象 {id, name, uri, size, date} 或 {name, path, uri, size, date}
     */
    public getDownloads(): any[];

    // ==================== 文档操作 ====================

    /**
     * 保存文档文件到文档目录
     * @param sourcePath 源文件路径
     * @param displayName 显示名称（可选）
     * @return 保存后的 content:// Uri 字符串（Android 10+）或文件路径（Android 9-），失败返回 null
     */
    public saveToDocuments(sourcePath: string, displayName?: string): string | null;

    /**
     * 保存文档文件到文档目录（使用默认名称）
     * @param sourcePath 源文件路径
     * @return 保存后的 content:// Uri 字符串或文件路径
     */
    public saveToDocuments(sourcePath: string): string | null;

    /**
     * 获取文档目录的所有文件
     * @return JavaScript 数组，包含文件信息对象 {id, name, uri, size, date, mimeType} 或 {name, path, uri, size, date}
     */
    public getDocuments(): any[];

    // ==================== 通用操作 ====================

    /**
     * 从 URI 读取文件内容
     * @param uriString content:// Uri 字符串
     * @return 文件内容字节数组，失败返回 null
     */
    public readFromUri(uriString: string): number[] | null;

    /**
     * 查询媒体文件信息
     * @param uriString content:// Uri 字符串
     * @return JavaScript 对象，包含文件信息 {name, size, mimeType}
     */
    public queryMediaInfo(uriString: string): any;
}

export { };

