//----------------------------------------------------------------------------------------------------------------------
/**
 * minecraft server param
 */
export class MinecraftServer{
    private IsValid   : boolean  = false;
    private Version   : string   = '';
    public properties : string[] = [];
    
    constructor(public applog : any , public rootFolder:string , public folder: string) {
        this.load();
        }
    
    //..................................................................................................................
    //region getter/setter
    public get version(): string  { return this.Version; };
    public get isValid(): boolean { return this.IsValid; };
    //endregion
    //..................................................................................................................
    //region Utility Function Debug/Error
    /**
     * show debug message
     * @param msg
     */
    private Debug(msg:string) : void {
        if (this.applog)
            this.applog(msg);
    }
    /**
     * show error message
     * @param msg
     */
    private Error(msg:string) : void {
        if (this.applog)
            this.applog(msg);
        else
            console.log(msg);
    }
    //endregion
    //..................................................................................................................
    /**
     * Load server version, server.properties, check eula.txt
     * @returns {boolean}
     */
    public load() : boolean {
        this.Debug('Load Server '+this.folder);
        this.properties=[];
        this.Version   ='';
        this.IsValid   = false;
        
        return this.IsValid;
        }
    
}

