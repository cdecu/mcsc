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
 * Minecraft Server
 */
export interface IMinecraftServer {
    folder      : string;
    fullPath     : string;
}
//----------------------------------------------------------------------------------------------------------------------
/**
 * Minecraft World
 */
export interface IMinecraftWorld {
    folder      : string;
    fullPath     : string;
}
//----------------------------------------------------------------------------------------------------------------------
/**
 * Minecraft Server Controller config
 */
export interface IConfig {
    applog      : any;
    port        : number;
    welcomeMsg  : string;
    mcserversDir: string;
    mcservers   : IMinecraftServer[];
    worldsDir   : string;
    worlds      : IMinecraftWorld[];
    version     : string;
    hostname    : string;
    commands    : Command[];
}

