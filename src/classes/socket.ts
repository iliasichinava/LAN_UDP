import { ISocket } from "@/interfaces/socket";
import { createSocket, Socket } from "dgram";
import os from "os";
export class UdpSocket implements ISocket {
  private readonly socket: Socket;
  private readonly ip: string;

  public constructor(private readonly PORT: number) {
    this.socket = this.create();
    this.ip = this.getAddress();
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
    console.log(err);
  }

  private onMessage(msg: string | Buffer) {
    console.log(msg.toString());
  }

  private getAddress() {
    const networkInterfaces = os.networkInterfaces();

    // Iterate over network interfaces
    for (const interfaceName of Object.keys(networkInterfaces)) {
      const interfaces = networkInterfaces[interfaceName];
      if (!interfaces) return "";
      // Iterate over addresses for each network interface
      for (const iface of interfaces) {
        // Skip over non-IPv4 and internal (loopback) addresses
        if (iface.family === "IPv4" && !iface.internal) {
          return iface.address;
        }
      }
    }

    return "";
  }
  public create() {
    return createSocket("udp4", () => {
      console.log("Socket established at port " + this.PORT);
    });
  }

  public send(ip: string, port: number, msg: string | Buffer): void {
    this.socket.send(msg, port, ip, (err: Error | null) => {
      if (err) throw err;

      console.log("Message sent: " + msg);
    });
  }

  public get address() {
    return this.ip;
  }

  public get port() {
    return this.PORT;
  }
}
