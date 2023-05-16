import { ISocket } from "@/interfaces/socket";
import { createSocket, Socket } from "dgram";
import os from "os";
import readline from "readline";

export class UdpSocket implements ISocket {
  private readonly socket: Socket;
  private readonly ip: string;
  private rl: readline.Interface;

  public constructor(private readonly PORT: number) {
    this.socket = createSocket("udp4");
    this.ip = this.getAddress();
    this.listen();
    this.rl = this.read();

    this.socket.bind(PORT);
  }

  private listen() {
    this.socket.on("message", this.onMessage);
    this.socket.on("error", this.onErrorHandler);
  }

  public read() {
    return readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }


  private onErrorHandler(err: Error) {
    console.log(err);
  }

  private onMessage(msg: string | Buffer) {
    console.log("\nGiga: " + msg.toString());
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

  public askMessage(ip: string) {
    this.rl.question("", (message: string) => {
      this.send(ip, 3000, message);
      setTimeout(() => {
        this.askMessage(ip);
      }, 0);
    });
  }

  public send(ip: string, port: number, msg: string | Buffer): void {
    this.socket.send(`${msg}\n`, port, ip, (err: Error | null) => {
      if (err) throw err;
    });
  }

  public get address() {
    return this.ip;
  }

  public get port() {
    return this.PORT;
  }
}
