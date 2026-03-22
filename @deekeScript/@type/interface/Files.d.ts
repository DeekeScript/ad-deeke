declare global {
    var Files: files;
}

interface files {
    /**
     * 读取文件内容
     * @param path 文件路径
     * @return 文件内容，如果失败返回null
     */
    public read(path: string): string | null;

    /**
     * 写入内容到文件
     * @param path 文件路径
     * @param content 要写入的内容
     * @return 成功返回true，失败返回false
     */
    public write(path: string, content: string): boolean;

    /**
     * 追加内容到文件
     * @param path 文件路径
     * @param content 要追加的内容
     * @return 成功返回true，失败返回false
     */
    public append(path: string, content: string): boolean;

    /**
     * 删除文件或目录
     * @param path 文件或目录路径
     * @return 成功返回true，失败返回false
     */
    public delete(path: string): boolean;

    /**
     * 检查文件或目录是否存在
     * @param path 文件或目录路径
     * @return 存在返回true，不存在返回false
     */
    public exists(path: string): boolean;

    /**
     * 创建目录（包括父目录）
     * @param path 目录路径
     * @return 成功返回true，失败返回false
     */
    public mkdirs(path: string): boolean;

    /**
     * 列出目录中的文件
     * @param path 目录路径
     * @return 文件名数组
     */
    public list(path: string): string[];

    /**
     * 列出目录中的文件（包含完整路径）
     * @param path 目录路径
     * @return 文件完整路径数组
     */
    public listFiles(path: string): string[];

    /**
     * 复制文件
     * @param source 源文件路径
     * @param destination 目标文件路径
     * @return 成功返回true，失败返回false
     */
    public copy(source: string, destination: string): boolean;

    /**
     * 移动文件
     * @param source 源文件路径
     * @param destination 目标文件路径
     * @return 成功返回true，失败返回false
     */
    public move(source: string, destination: string): boolean;

    /**
     * 获取文件大小（字节）
     * @param path 文件路径
     * @return 文件大小（字节），如果文件不存在或为目录返回-1
     */
    public size(path: string): number;

    /**
     * 检查路径是否为目录
     * @param path 路径
     * @return 是目录返回true，否则返回false
     */
    public isDirectory(path: string): boolean;

    /**
     * 检查路径是否为文件
     * @param path 路径
     * @return 是文件返回true，否则返回false
     */
    public isFile(path: string): boolean;

    /**
     * 获取文件名
     * @param path 文件路径
     * @return 文件名
     */
    public getName(path: string): string;

    /**
     * 获取父目录路径
     * @param path 文件路径
     * @return 父目录路径
     */
    public getParent(path: string): string;

    /**
     * 获取绝对路径
     * @param path 文件路径
     * @return 绝对路径
     */
    public getAbsolutePath(path: string): string;

    /**
     * 重命名文件或目录
     * @param oldPath 旧路径
     * @param newPath 新路径
     * @return 成功返回true，失败返回false
     */
    public rename(oldPath: string, newPath: string): boolean;

    /**
     * 获取最后修改时间
     * @param path 文件路径
     * @return 最后修改时间（毫秒），如果文件不存在返回-1
     */
    public lastModified(path: string): number;

    /**
     * 从URI读取内容（支持content://和file://等URI）
     * @param uriString URI字符串
     * @return 内容，如果失败返回null
     */
    public readUri(uriString: string): string | null;

    /**
     * 从URI读取字节数组（支持content://和file://等URI，用于读取图片等二进制文件）
     * @param uriString URI字符串
     * @return 字节数组，如果失败返回null
     */
    public readBytesFromUri(uriString: string): number[] | null;

    /**
     * 从content URI获取真实文件路径
     * @param uriString content URI字符串
     * @return 真实文件路径，如果失败返回null
     */
    public getPathFromUri(uriString: string): string | null;

    /**
     * 从文件读取字节数组
     * @param path 文件路径
     * @return 字节数组，如果失败返回null
     */
    public readBytes(path: string): number[] | null;

    /**
     * 写入字节数组到文件
     * @param path 文件路径
     * @param bytes 要写入的字节数组
     * @return 成功返回true，失败返回false
     */
    public writeBytes(path: string, bytes: number[]): boolean;

    /**
     * 从URI复制文件到目标路径
     * @param uriString 源URI字符串
     * @param destination 目标文件路径
     * @return 成功返回true，失败返回false
     */
    public copyFromUri(uriString: string, destination: string): boolean;

    /**
     * 获取外部存储根目录路径
     * @return 外部存储路径
     */
    public getExternalStoragePath(): string;

    /**
     * 获取应用私有文件目录路径
     * @return 文件目录路径
     */
    public getFilesPath(): string;

    /**
     * 获取应用缓存目录路径
     * @return 缓存目录路径
     */
    public getCachePath(): string;

    /**
     * 获取应用外部私有文件目录路径
     * @param type 文件目录类型（如"Pictures"、"Documents"），null表示根目录
     * @return 外部文件目录路径
     */
    public getExternalFilesPath(type: string | null): string;

    /**
     * 获取应用外部私有文件根目录路径
     * @return 外部文件目录路径
     */
    public getExternalFilesPath(): string;

    /**
     * 获取Download目录路径
     * @return Download目录路径
     */
    public getDownloadPath(): string;

    /**
     * 获取Pictures目录路径
     * @return Pictures目录路径
     */
    public getPicturesPath(): string;

    /**
     * 获取DCIM目录路径
     * @return DCIM目录路径
     */
    public getDCIMPath(): string;

    /**
     * 获取Movies目录路径
     * @return Movies目录路径
     */
    public getMoviesPath(): string;

    /**
     * 获取Music目录路径
     * @return Music目录路径
     */
    public getMusicPath(): string;

    /**
     * 获取Documents目录路径
     * @return Documents目录路径
     */
    public getDocumentsPath(): string;

    /**
     * 从assets读取文件
     * @param fileName assets目录中的文件名
     * @return 文件内容，如果失败返回null
     */
    public readAsset(fileName: string): string | null;

    /**
     * 检查外部存储是否可用且可写
     * @return 可用且可写返回true，否则返回false
     */
    public isExternalStorageWritable(): boolean;

    /**
     * 检查外部存储是否可读
     * @return 可读返回true，否则返回false
     */
    public isExternalStorageReadable(): boolean;

    /**
     * 获取文件扩展名
     * @param path 文件路径
     * @return 文件扩展名（不含点），如果没有扩展名返回空字符串
     */
    public getExtension(path: string): string;

    /**
     * 获取不带扩展名的文件名
     * @param path 文件路径
     * @return 不带扩展名的文件名
     */
    public getNameWithoutExtension(path: string): string;
}

export { };

