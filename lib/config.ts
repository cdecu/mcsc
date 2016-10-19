//To Test  import {TraceClass} from "typescript-debug";
//To Test  @TraceClass({ tracePrefix: "mcsc" })
export class Config {
    public showHelp : boolean = false;
    public hostname : string;
    public port     : number;
    public worldsDir: string;
    public mcsjars  : string[];
    
    constructor(public applog : any , public appRoot : string) {
        let fs                  = require('fs');
        let nconf      : any    = Config.nconf();
        let path                = require('path');
        let configFile : string = nconf.get('configFile');
        if (configFile === 'appRoot/config.json')
            configFile = path.join(appRoot,"/config.json");
    
        let os = require("os");
        this.hostname = os.hostname();
        this.port     = nconf.get('port');
        this.worldsDir= nconf.get('worldsDir');
        this.showHelp = nconf.get('help');
    
        this.mcsjars = ['dddd'];
    
        applog('Load ' + configFile);
        try {
            if (fs.existsSync(configFile)) {
                let obj = JSON.parse(fs.readFileSync(configFile, 'utf8'));
                if (typeof obj.port      === "number" ) this.port     = obj.port;
                if (typeof obj.worldsDir === "string" ) this.worldsDir= obj.worldsDir;
                if (Array.isArray(obj.mcsjars)        ) this.mcsjars  = obj.mcsjars;
                applog('.. ' + configFile + ' loaded !');
            } else {
                applog('** ' + configFile + ' NOT Found !');
            }   }
        catch (ex) {
            applog(ex.message);
            }
        
        applog('Save ' + configFile);
        try {
            let fd = fs.openSync(configFile, 'w');
            fs.writeSync(fd, JSON.stringify(this, ["port","worldsDir","mcsjars"], 2), 'utf-8');
            fs.close(fd);
            applog('.. ' + configFile + ' saved !');
            }
        catch (ex) {
            applog(ex.message);
        }   }


    public static showUsage(){
        let nconf : any = Config.nconf();
        console.log(nconf.stores.argv.help());
        }

    public static nconf():any {
        let nconf   = require('nconf');
        nconf
            .argv({
                    "p": {
                        alias: 'port',
                        describe: 'Http Listening Port',
                        type:'number',
                        default: 8080
                    },
                    "w": {
                        alias: 'welcome',
                        describe: 'Welcome phrase',
                        default: 'Hello geek'
                    },
                    "h": {
                        alias: 'help',
                        describe: 'Show this screen',
                        default: false
                    },
                    "d": {
                        alias: 'worldsDir',
                        describe: 'Worlds directory',
                        default: '~/worlds'
                    },
                    "c": {
                        alias: 'configFile',
                        describe: 'Configuration file',
                        default: 'appRoot/config.json'
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

}

