import { ISocket } from "@/interfaces/socket";
import { createSocket, Socket } from "dgram";
import os from "os";

export class UdpSocket implements ISocket {
    private readonly socket: Socket;
    private readonly ip: string;
    
    public constructor(private readonly PORT: number, ip: string) {
        this.socket = this.create();
        // this.ip = this.getAddress();
        this.ip = ip;
        this.listen();

        this.socket.bind(PORT);
    }

    private listen() {
        this.socket.on("message", this.onMessage);
        this.socket.on("error", this.onErrorHandler);
        this.socket.on("listening", this.onListen);
    }

    private onListen() {
        console.log("Listening");
    }

    private onErrorHandler(err: Error) {
        console.log(err)
    }
    
    private onMessage(msg: string|Buffer) {
        console.log(msg.toString());
    }

    private getAddress(): string {
        return this.ip;
    }

    public create() {
        return createSocket("udp4", () => {
            console.log("Socket established at port " + this.PORT);
        });
    }

    public send(ip: string, port: number, msg: string | Buffer): void { 
        this.socket.send(msg, port, ip, (err: Error | null) => {
            if(err) throw err;

            console.log("Message sent: " + msg);
        })        
    }
    
    public get address() {
        return this.ip;
    }
    
    public get port() {
        return this.PORT;
    }
}
