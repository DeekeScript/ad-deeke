declare global {
    var Encrypt: Encrypt;
}

interface Encrypt {
    /**
     * md5加密
     * @param input
     */
    public md5(input: string): string;

    /**
     * sha1加密
     * @param input 
     */
    public sha1(input: string): string;

    /**
     * sha256加密
     * @param input 
     */
    public sha256(input: string): string;

    /**
     * base64 encode
     * @param input 
     */
    public base64Encode(input: string|byte[]): string;

    /**
     * base64 decode
     * @param input 
     */
    public base64Decode(input: string): string;

    /**
     * 生成iv
     */
    public generateIv(): string;

    /**
     * aescbc加密
     * @param key 
     * @param iv 
     * @param input 
     */
    public aesCbcEncode(key: string, iv: string, input: string): string;

    /**
     * aescbc解密
     * @param key 
     * @param iv 
     * @param input 
     */
    public aesCbcDecode(key: string, iv: string, input: string): string;
}

export { };
