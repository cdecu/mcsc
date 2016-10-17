import {TraceClass} from "typescript-debug";

@TraceClass({ tracePrefix: "mcsc" })
export class Config {
    constructor(public abc: string) { }

    public getAbc() {
        return this.abc;
    }

    public combineWithAbc(xyz: string) {
        return this.getAbc() + " and " + xyz;
    }

}

