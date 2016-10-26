import {Config}  from "./config";
import {MinecraftWorld}  from "./minecraft_worlds";
import {MinecraftServer} from "./minecraft_server";
import { MinecraftControler } from './interfaces';
import Command = MinecraftControler.Command;

//----------------------------------------------------------------------------------------------------------------------
/**
 * Minecraft Servers Controller
 * singleton class
 */
export class Controller implements MinecraftControler.IController{

    private static instance: Controller;
    
    public config      : Config;
    public mcservers   : MinecraftServer[] = [];
    public worlds      : MinecraftWorld[] = [];
    
    constructor(public applog : any , public appRoot : string) {
        if (Controller.instance) {
            return Controller.instance;
            }
    
        // load Config
        this.config = new Config(applog,appRoot);

        // load Server directories
        this.loadServers();
    
        // load Worlds directories
        this.loadWorlds();
    
        if (this.config.showConfig){
            console.log('\nSettings\n--------');
            console.log('worlds: %s' ,JSON.stringify(this.worlds   ,MinecraftControler.stringifyFilter,2));
            console.log('servers: %s',JSON.stringify(this.mcservers,MinecraftControler.stringifyFilter,2));
            console.log('');
            }
        
        Controller.instance = this;
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
    //..................................................................................................................
    //region load Settings
    /**
     * Load Worlds from worldsDir into worlds
     * @returns {boolean}
     */
    public loadWorlds() : boolean {
        this.Debug('load Worlds');
        let dir : string = MinecraftControler.expandTilde(this.config.worldsDir);
        let path = require('path');
        let fs = require('fs');
        this.worlds = [];
        try {
            this.Debug('read dir '+dir);
            fs.readdirSync(dir).forEach((f) =>{
                if (fs.statSync(path.join(dir,f)).isDirectory()) {
                    let w = new MinecraftWorld(this,f);
                    this.worlds.push(w);
                }});
            this.Debug('.. loaded !');
            return true;
        }
        catch (ex) {
            this.Error(ex.message);
            return false;
        }   }
    //..................................................................................................................
    /**
     * Load server from mcserversDir into mcservers
     * @returns {boolean}
     */
    public loadServers() : boolean {
        this.Debug('load Servers');
        let dir : string = MinecraftControler.expandTilde(this.config.mcserversDir);
        let path = require('path');
        let fs = require('fs');
        this.mcservers = [];
        try {
            this.Debug('from dir '+dir);
            fs.readdirSync(dir).forEach((f) =>{
                if (fs.statSync(path.join(dir,f)).isDirectory()) {
                    let s = new MinecraftServer(this, f);
                    this.mcservers.push(s);
                }});
            this.Debug('.. loaded !');
            return true;
        }
        catch (ex) {
            this.Error(ex.message);
            return false;
        }   }
    //endregion
    //..................................................................................................................
    /**
     * Execute command
     * @returns {boolean}
     */
    public executeCommand(cmd:MinecraftControler.Command) : boolean {
        switch (cmd.cmd) {
            case 'test':
                return this.test(cmd.args);
            case 'list':
                return this.list(cmd.args);
            default:
                console.log('Invalid cmd : '+cmd.cmd+' '+cmd.args);
                return false;
        }       }
    //..................................................................................................................
    /**
     * list args
     * @returns {args}
     */
    public list(args:string[]) : boolean {
        this.Debug('list '+args);
        return false;
        }
    //..................................................................................................................
    /**
     * test args
     * @returns {args}
     */
    public test(args:string[]) : boolean {
        let areValid : boolean = true;
        if (!args || args.length==0){
            if (!this.mcservers || this.mcservers.length==0) {
                console.log('** no servers to test\n');
            } else {
                console.log('test all servers\n----------------');
                this.mcservers.forEach((server) => {
                    if (!server.test())
                        areValid = false;
                    });
                }
            if (!this.worlds|| this.worlds.length==0) {
                console.log('** no worlds to test\n');
            } else {
                console.log('test all worlds\n---------------');
                }
        } else {
            console.log('\ntest\n----');
            this.Debug('test '+args);
            }
        return areValid;
        }
    //..................................................................................................................
    /**
     * start args
     * @returns {args}
     */
    public start(args:string[]) : boolean {
        let areStarted : boolean = true;
        if (!args || args.length==0){
            console.log('\nstart\n-----');
            this.mcservers.forEach((server) => {
                if (!server.start())
                    areStarted=false;
            });
            this.Debug('test worlds');
        } else {
            console.log('\nstart\n-----');
            this.Debug('test '+args);
            }
        return areStarted;
        }
    
}
