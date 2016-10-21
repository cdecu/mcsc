//----------------------------------------------------------------------------------------------------------------------
/**
 * minecraft world param
 */
export class MinecraftWorld {
    constructor(public applog : any , public rootFolder:string , public folder: string) {
        
    }
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
    
}

