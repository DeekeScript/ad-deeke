declare global {
    var Images: Images;
}

interface Mat {
}

interface Point {
    x: number;
    y: number;
}

interface TextAndRegion {
    text: string;
    rect: Rect;
}

interface Images {
    public getMat(imageFile: string): Mat;

    public findOne(source: Mat, template: Mat, threshold: number): Point;

    public find(source: Mat, template: Mat, threshold: number): Point[];

    public capture(): string;

    public getColor(imageFile: string, pixelX: number, pixelY: number): string;

    public findColor(imageFile: string, color: string): Point[];

    public findColor(imageFile: string, startColor: string, endColor: string): Point[];

    public crop(imageFile: string, left: number, top: number, width: number, height: number): string;

    /**
     * 
     * @param imageFile 图片文件路径
     * @param multiple 缩放倍数
     * @throws Error 当参数非法时或者图片文件不存在时抛出异常
     */
    public scale(imageFile: string, multiple: number): string;

    /**
     * 返回图片的文本和区域
     * @param imageFile 图片文件路径
     * @throws Error 当图像识别失败或参数非法时
     */
    public getTextAndRegion(imageFile: string): TextAndRegion[];

    /**
     * 查找文本位置
     * @param imageFile 图片文件路径
     * @param keyword 查找的文本
     * @throws Error 当图像识别失败或参数非法时
     */
    public findTextPosition(imageFile: string, keyword: string): Rect[];

    /**
     * 在指定区域内查找文本。
     * @param imageFile 图片文件路径
     * @param left 区域左边界
     * @param top 区域上边界
     * @param width 区域宽度
     * @param height 区域高度
     * @returns 识别出的文本数组
     * @throws Error 当图像识别失败或参数非法时
     */
    public findTextInRegion(imageFile: string, left: number, top: number, width: number, height: number): string[];
}

export { };
