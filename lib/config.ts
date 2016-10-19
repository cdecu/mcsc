// TO TEST import {TraceClass} from "typescript-debug";
// TO TEST @TraceClass({ tracePrefix: "mcsc" })


/**
 * configuration class. Config is loaded from argv and/or configFile
 */
export class Config {
    
    private static readonly _savedKeys_ : string[] = ["port","worldsDir","mcsjars"];
    
    public showHelp  : boolean  = false;
    public hostname  : string   = "localhost";
    public welcomeMsg: string   = "Hello geek";
    public port      : number   = 8080;
    public worldsDir : string   = "~/worlds";
    public worlds    : string[] = [];
    public mcsjars   : string[] = [];
    
    constructor(public applog : any , public appRoot : string) {

        let fs                  = require('fs');
        let nconf      : any    = Config.nconf();
        let path                = require('path');
        let configFile : string = nconf.get('configFile') || path.join(appRoot,"/config.json");
    

        // first load default from file
        applog('Load ' + configFile);
        try {
            if (fs.existsSync(configFile)) {
                let obj = JSON.parse(fs.readFileSync(configFile, 'utf8'));
                this.assign(obj,Config._savedKeys_);
                applog('.. ' + configFile + ' loaded !');
            } else {
                applog('** ' + configFile + ' NOT Found !');
            }   }
        catch (ex) {
            applog(ex.message);
            }

        // overide with argv
        let os = require("os");
        this.hostname = os.hostname();
        this.port     = nconf.get('port')      || this.port;
        this.worldsDir= nconf.get('worldsDir') || this.worldsDir;
        this.showHelp = nconf.get('help')      || this.showHelp;
        
        // save new default to file
        if (nconf.get('saveConfig')) {
            applog('Save ' + configFile);
            try {
                let fd = fs.openSync(configFile, 'w');
                fs.writeSync(fd, JSON.stringify(this,Config._savedKeys_,2), 'utf-8');
                fs.close(fd);
                applog('.. ' + configFile + ' saved !');
                }
            catch (ex) {
                applog(ex.message);
            }   }
    
        if (nconf.get('showConfig')){
            applog('showConfig');
            console.log('\nConfig\n------');
            console.log(JSON.stringify(this, null, 6));
            }
            
        if (this.showHelp) {
            applog('showHelp');
            console.log('\nByeBye\n');
            process.exit(0)
            }
        }
    
    /**
     * Parse argv params
     * @returns {"nconf"}
     */
    public static nconf():any {
        let nconf   = require('nconf');
        nconf
            .argv({
                    "p": {
                        "alias"    : 'port',
                        "describe" : 'Http Listening Port',
                        "type"     : 'number',
                        "default"  :  8080
                    },
                    "w": {
                        "alias"    : 'welcome',
                        "describe" : 'Welcome phrase',
                        "default"  : 'Hello geek'
                    },
                    "h": {
                        "alias"    : 'help',
                        "describe" : 'Show this screen',
                        "default"  :  false
                    },
                    "d": {
                        "alias"    : 'worldsDir',
                        "describe" : 'Worlds directory',
                        "default"  : '~/worlds'
                    },
                    "c": {
                        "alias"    : 'configFile',
                        "describe" : 'Configuration file',
                    },
                    "s": {
                        "alias"    : 'saveConfig',
                        "describe" : 'Save Configuration file',
                        "default"  :  false
                    },
                    "o": {
                        "alias"    : 'showConfig',
                        "describe" : 'show Configuration',
                        "default"  : false
                    }   },
                "Minecraft server Controler"
            )
            .env({
                "separator" : '__',
                "whitelist" :['JAVA_HOME', 'JAVA_ROOT','configFile']
            })
            .defaults({
                "blabla":"blabla"
            });
        return nconf;
    }
        
        
    /**
     * simple copy only one level
     * @param src source object to be copied into this
     * @param whitelist of attribute to be copoed. If not set will copy all
     * @returns {Config}
     */
    private assign(src : any, whitelist? : string[]) : Config {
        // check if source is a object
        if (typeof (src) != 'object')
            return null;
    
        // assign only key in whitelist
        if (whitelist) {
            whitelist.forEach((key) => {
                let po = Object.getOwnPropertyDescriptor(src, key);
                let pt = Object.getOwnPropertyDescriptor(this, key);
                if ((pt) && (pt.writable)) {
                    if ((po) && (typeof (po.value) === typeof (pt.value)))
                        this[key]=po.value;
                }   });
            return this;
            }
            
        // assign all
        Object.keys(src).forEach((key)=>{
                let po  = Object.getOwnPropertyDescriptor(src , key);
                let pt  = Object.getOwnPropertyDescriptor(this, key);
                if ((po)&&(po.writable)){
                    if ((po)&&(typeof (po.value)===typeof (pt.value)))
                        this[key]=po.value;
            }   });
        return this;
    }
    
    /**
     * show command argvs usage on console
     */
    public static showUsage(): void {
        let nconf : any = Config.nconf();
        console.log(nconf.stores.argv.help());
        }
    
}

