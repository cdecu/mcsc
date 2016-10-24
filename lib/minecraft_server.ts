import {IConfig,IMinecraftServer} from "../lib/interfaces";

//----------------------------------------------------------------------------------------------------------------------
/**
 * minecraft server param
 */
export class MinecraftServer implements  IMinecraftServer {
    private applog      : any;
    public  fullPath    : string;
    private IsValid     : boolean  = false;
    private Version     : string   = '';
    public  properties  : string[] = [];
    
    constructor(public config : IConfig , public folder: string) {
        let path = require('path');
        this.applog     = config.applog;
        this.fullPath   = path.join(MinecraftServer.expandTilde(this.config.mcserversDir),this.folder);
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
    /**
     * Convert ~/Dir into $HOME/Dir
     * @param filepath
     * @returns {string}
     */
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
     * Load server version, server.properties, check eula.txt
     * @returns {boolean}
     */
    public load() : boolean {
        let fs = require('fs');
        let path = require('path');
        this.Debug('Load Server '+this.fullPath);
        this.IsValid   = false;
        this.Version   ='';
        this.properties=[];
        try {
            fs.readdirSync(this.fullPath).forEach((f) =>{
                if (fs.statSync(path.join(this.fullPath,f)).isFile()) {
this.Debug(f);
                }});
            return this.IsValid;
            }
        catch (ex) {
            this.Error(ex.message);
            return false;
        }   }
            
}

