//----------------------------------------------------------------------------------------------------------------------
/**
 * Command to be executed
 */
export class Command {
    public args : string[] = [];
    constructor(public cmd : string) {
    }
}

//----------------------------------------------------------------------------------------------------------------------
/**
 * configuration class. Config is loaded from argv and/or configFile
 */
export class Config {
    
    private static readonly _savedKeys_ : string[] = ["port",'welcomeMsg',"mcsjarsDir","worldsDir"];
    private static readonly _commands_  : string[] = ["start","list","backup"];
    public static verboseLevel : number = 0;

    public hostname  : string   = "localhost";
    public port      : number   = 8080;
    public welcomeMsg: string   = "Hello geek";
    public mcsjarsDir: string   = "~/servers";
    public mcsjars   : string[] = [];
    public worldsDir : string   = "~/worlds";
    public worlds    : string[] = [];
    public version   : string   = '0.0.0';
    public commands  : Command[] = [];
    
    constructor(public applog : any , public appRoot : string) {

        let fs                  = require('fs');
        let path                = require('path');
        let argv       : any    = Config.yargs();
        let showHelp   : boolean= argv.help;
        let configFile : string = argv.configFile || path.join(appRoot,"/config.json");
        Config.verboseLevel=argv.logLevel;
    
        // load version
        let pjson = require('../package.json');
        this.version =  pjson.version || this.version;
        this.Debug('Version '+this.version);
        
        // first load default from file
        this.Debug('Load configFile '+configFile);
        try {
            if (fs.existsSync(configFile)) {
                let obj = JSON.parse(fs.readFileSync(configFile, 'utf8'));
                this.assign(obj,Config._savedKeys_);
                this.Debug('.. loaded !');
            } else {
                this.Debug('** ' + configFile + ' NOT Found !');
            }   }
        catch (ex) {
            this.Error(ex.message);
            }

        // overide with argv
        let os = require("os");
        this.hostname  = os.hostname();
        this.port      = argv.port       || this.port;
        this.welcomeMsg= argv.welcomeMsg || this.welcomeMsg;
        this.mcsjarsDir= argv.mcsjarsDir || this.mcsjarsDir;
        this.worldsDir = argv.worldsDir  || this.worldsDir;
        
        // save new default to file
        if (argv.saveConfig) {
            this.Debug('Save configFile '+configFile);
            try {
                let fd = fs.openSync(configFile, 'w');
                fs.writeSync(fd, JSON.stringify(this,Config._savedKeys_,2), 'utf-8');
                fs.close(fd);
                this.Debug('.. saved !');
                }
            catch (ex) {
                this.Error(ex.message);
            }   }
    
        // build commands list, default to Config._commands_[0]
        let cmd : Command;
        argv._.forEach((key) => {
            if (!cmd || Config._commands_.includes(key)) {
                cmd=new Command(key);
                this.commands.push(cmd);
            } else
                cmd.args.push(key);
            });
        if (!this.commands || this.commands.length==0)
            this.commands.push(new Command(Config._commands_[0]));
            
        // load Worlds and Server Jars directories
        this.loadMcsJars();
        this.loadWorlds();
        
        // Dump config iff
        if (argv.showConfig){
            console.log('\nConfig\n------');
            console.log(JSON.stringify(this,Config._savedKeys_,2));
            console.log('configFile: %s',configFile);
            console.log('worlds: %s',JSON.stringify(this.worlds));
            console.log('jars: %s',JSON.stringify(this.mcsjars));
            console.log('');
            }
        
        // Terminate iff
        if (showHelp) {
            this.Debug('Exit after show Help');
            console.log('\nByeBye\n');
            process.exit(0)
            }
        
        }
    //..................................................................................................................
    /**
     * Parse argv params using yargs module
     * @returns {"argv"}
     */
    public static yargs() : any {
        let yargv = require('yargs');
        let argv = yargv
            .usage('Minecraft server controller \nUsage: $0 [options] <command>')
            .example('$0 [options] list worlds')
            .example('$0 [options] start')
            //.command('list <objects...>','show objects')
            //.command('start', 'start servers')
            .option("p",{
                        "alias"    : 'port',
                        "describe" : 'Http Listening Port',
                        "type"     : 'number',
                        "global"   : true
                    })
            .option("w",{
                        "alias"    : 'welcomeMsg',
                        "describe" : 'Welcome phrase',
                        "global"   : true
                    })
            .option("j",{
                        "alias"    : 'mcsjarsDir',
                        "describe" : 'Minecraft server jar directory',
                        "global"   : true
                    })
            .option("d",{
                        "alias"    : 'worldsDir',
                        "describe" : 'Worlds directory',
                        "global"   : true
            })
            .option("c",{
                        "alias"    : 'configFile',
                        "describe" : 'Configuration file',
                        "global"   : true
                    })
            .option("s",{
                        "alias"    : 'saveConfig',
                        "describe" : 'Save Configuration file',
                        "type"     : 'boolean',
                        "global"   : true
                    })
            .option("o",{
                        "alias"    : 'showConfig',
                        "describe" : 'show Configuration',
                        "type"     : 'boolean',
                        "global"   : true
                    })
            .option("h",{
                        "alias"    : 'help',
                        "describe" : 'Show this screen',
                        "type"     : 'boolean',
                        "global"   : true
                    })
            .count('logLevel').alias('l', 'logLevel')
            .version().alias("v","version")
            .env({
                "separator" : '__',
                "whitelist" :['JAVA_HOME', 'JAVA_ROOT','configFile']
                })
            .exitProcess(false)
            .epilog('copyright 2016')
            .argv;
    
        // exit after version
        if (argv.version) {
            process.exit(0)
            }
    
        // always show help !
        yargv.showHelp("log");
            
        return argv;
    }
    
    
    //..................................................................................................................
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
    //..................................................................................................................
    /**
     * show debug message
     * @param msg
     */
    public Debug(msg:string) : void {
        if (this.applog)
            this.applog(msg);
        else
        if (Config.verboseLevel > 0)
            console.log(msg)
    }
    /**
     * show error message
     * @param msg
     */
    public Error(msg:string) : void {
        if (this.applog)
            this.applog(msg);
        else
            console.log(msg);
    }
    //..................................................................................................................
    /**
     * Convert ~/Dir into $HOME/Dir
     * @param filepath
     * @returns {string}
     */
    public static expandTilde(filepath:string) : string {
        let home = require('os').homedir();
        let path = require('path');
        if (filepath.charCodeAt(0) === 126 /* ~ */) {
            return home ? path.join(home, filepath.slice(1)) : filepath;
        } else
            return filepath;
        }
    //..................................................................................................................
    /**
     * Load Worlds from worldsDir into worlds
     * @returns {boolean}
     */
    public loadWorlds() : boolean {
        this.Debug('load Worlds');
        let dir : string = Config.expandTilde(this.worldsDir);
        let fs = require('fs');
        this.worlds = [];
        try {
            this.Debug('read dir '+dir);
            fs.readdirSync(dir).forEach((f) =>{
                this.worlds.push(f);
                });
            this.Debug('.. loaded !');
            return true;
            }
        catch (ex) {
            this.Error(ex.message);
            return false;
        }   }
    //..................................................................................................................
    /**
     * Load server jars from mcsjarsDir into mcsjars
     * @returns {boolean}
     */
    public loadMcsJars() : boolean {
        this.Debug('load Jars');
        let dir : string = Config.expandTilde(this.mcsjarsDir);
        let fs = require('fs');
        this.mcsjars = [];
        try {
            this.Debug('read dir '+dir);
            fs.readdirSync(dir).forEach((f) =>{
                this.mcsjars.push(f);
            });
            this.Debug('.. loaded !');
            return true;
        }
        catch (ex) {
            this.Error(ex.message);
            return false;
        }   }
    
}

