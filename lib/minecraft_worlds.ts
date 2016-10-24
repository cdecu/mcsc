import {IConfig,IMinecraftWorld} from "../lib/interfaces";

//----------------------------------------------------------------------------------------------------------------------
/**
 * minecraft world param
 */
export class MinecraftWorld implements IMinecraftWorld{
    private applog      : any;
    public  fullPath    : string;
    
    constructor(public config : IConfig , public folder: string) {
        let path = require('path');
        this.applog     = config.applog;
        this.fullPath   = path.join(MinecraftWorld.expandTilde(this.config.worldsDir),this.folder);
        this.load();
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
    private static expandTilde(filepath:string) : string {
        let home = require('os').homedir();
        let path = require('path');
        if (filepath.charCodeAt(0) === 126 /* ~ */) {
            return home ? path.join(home, filepath.slice(1)) : filepath;
        } else
            return filepath;
        }
    //endregion
    //..................................................................................................................
    /**
     * Load world
     * @returns {boolean}
     */
    public load() : boolean {
        let fs = require('fs');
        let path = require('path');
        this.Debug('Load World '+this.fullPath);
        try {
            fs.readdirSync(this.fullPath).forEach((f) =>{
                if (fs.statSync(path.join(this.fullPath,f)).isFile()) {
this.Debug(f);
                }});
            return true;
        }
        catch (ex) {
            this.Error(ex.message);
            return false;
        }   }
    
}

