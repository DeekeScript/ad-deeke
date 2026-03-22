declare global {
    var DeekeScriptJson: DeekeScriptJson;
}

interface DeekeScriptJson {
    public setDeekeScriptJsonGroup(str:string): void;

    public setSettingLists(str:string): void;

    public toJson(): object;
}

export { }
