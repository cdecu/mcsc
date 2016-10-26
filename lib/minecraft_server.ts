import { MinecraftControler } from './interfaces';

//----------------------------------------------------------------------------------------------------------------------
/**
 * minecraft server param
 */
export class MinecraftServer implements  MinecraftControler.IMinecraftServer {

    private applog      : any;
    private config      : MinecraftControler.IConfig;
    public  fullPath    : string;
    private isValid     : boolean  = false;
    private version     : string   = '';
    private jarFile     : string   = '';
    public  properties  : string[] = [];
    public  whitelist   : {};
    
    constructor(public controller : MinecraftControler.IController, public folder: string) {
        let path = require('path');
        this.applog     = controller.applog;
        this.config     = controller.config;
        this.fullPath   = path.join(MinecraftControler.expandTilde(this.config.mcserversDir),this.folder);
        this.load();
        }
    
    //..................................................................................................................
    //region getter/setter
    public get Version(): string  { return this.version; };
    public get IsValid(): boolean { return this.isValid; };
    public get JarFile(): string  { return this.jarFile; };
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
        this.Debug('Load Server ' + this.fullPath);
        this.isValid    = false;
        this.version    = '';
        this.jarFile    = "";
        this.properties = [];
        try {
            let fs = require('fs');
            let path = require('path');
            fs.readdirSync(this.fullPath).forEach((f) =>{
                if (fs.statSync(path.join(this.fullPath,f)).isFile()) {
                    let ext : string = path.extname(f);
                    if (ext.toLowerCase()==='.jar') {
                        this.jarFile = f;
                        this.isValid = true;
                    } else
                    if (f.toLowerCase()==='server.properties') {
                        this.properties.push(f);
                    } else
                    if (f.toLowerCase()==='whitelist.json') {
                        let pjson = require(path.join(this.fullPath,f));
                        this.whitelist=pjson;
                    } else {
                        this.Debug('.. '+f);
                }   }   });
            return this.isValid;
            }
        catch (ex) {
            this.Error(ex.message);
            return false;
        }   }
    //..................................................................................................................
    /**
     * test args
     * @returns {args}
     */
    public test() : boolean {
        this.Debug('test server:'+this.folder);
        let fs   = require('fs');
        let path = require('path');
        this.isValid = true;
        try {
            // test server jar
            let f = path.join(this.fullPath,this.jarFile);
            if (fs.existsSync(f)) {
                this.Debug('ok:jar:'+f);
            }else{
                this.Debug('err:missing jar');
                this.isValid = false;
                }
            // test whitelistd.json
            f = path.join(this.fullPath,'whitelist.json');
            if (fs.existsSync(f)) {
                this.Debug('ok:whitelist:'+f);
            }else{
                this.Debug('err:missing whitelist');
                this.isValid = false;
                }
            // test whitelistd.json
            f = path.join(this.fullPath,'eula.txt');
            if (fs.existsSync(f)) {
                this.Debug('ok:eula:'+f);
            }else{
                this.Debug('err:missing eula');
                this.isValid = false;
                }
            if (this.isValid) {
                console.log(this.folder + ' Valid\n');
            } else {
                console.log(this.folder + ' Invalid !');
                console.log(JSON.stringify(this,MinecraftControler.stringifyFilter,2));
                console.log('');
                }
            return this.isValid;
            }
        catch (ex) {
            this.Error(ex.message);
            return false;
        }   }
    //..................................................................................................................
    /**
     * test args
     * @returns {args}
     */
    public start() : boolean {
        this.Debug('start server:'+this.folder);
        let fs   = require('fs');
        let path = require('path');
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

