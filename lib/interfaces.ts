//----------------------------------------------------------------------------------------------------------------------
export namespace MinecraftControler {
    //..................................................................................................................
    /**
     * Command to be executed
     */
    export class Command {
        public args: string[] = [];
        
        constructor(public cmd: string) {
            }
        }
    //..................................................................................................................
    /**
     * Minecraft Servers Controller
     */
    export interface IController {
        applog     : any;
        config     : MinecraftControler.IConfig;
        mcservers  : IMinecraftServer[];
        worlds     : IMinecraftWorld[];
        }
    //..................................................................................................................
    /**
     * Minecraft Server
     */
    export interface IMinecraftServer {
        folder     : string;
        fullPath   : string;
        }
    //..................................................................................................................
    /**
     * Minecraft World
     */
    export interface IMinecraftWorld {
        folder: string;
        fullPath: string;
        }
    //..................................................................................................................
    /**
     * Minecraft Server Controller config
     */
    export interface IConfig {
        applog: any;
        port: number;
        welcomeMsg: string;
        mcserversDir: string;
        worldsDir: string;
        version: string;
        hostname: string;
        commands: Command[];
        }
//----------------------------------------------------------------------------------------------------------------------
//region Utility Function
    //..................................................................................................................
    /**
     * Convert ~/Dir into $HOME/Dir
     * @param filepath
     * @returns {string}
     */
    export function expandTilde(filepath: string): string {
        let home = require('os').homedir();
        let path = require('path');
        if (filepath.charCodeAt(0) === 126 /* ~ */) {
            return home ? path.join(home, filepath.slice(1)) : filepath;
        } else
            return filepath;
        }
    //..................................................................................................................
    /**
     * JSON.stringify filter
     * @param key
     * @returns value|undefined
     */
    export function stringifyFilter(key,value:any): any {
        if (key.match(/^(controller|config|applog)$/))
            return undefined;
        return value;
        }
//endregion
}// MinecraftControler namespace