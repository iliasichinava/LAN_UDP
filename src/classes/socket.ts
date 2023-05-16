import { ISocket } from "@/interfaces/socket";
import { createSocket, Socket } from "dgram";
import readline from "readline";
import fs from "fs";

export class UdpSocket implements ISocket {
  private readonly socket: Socket;
  private rl: readline.Interface;
  private buf: fs.WriteStream;

  public constructor(private readonly PORT: number, private readonly receiver_ip: string) {
    this.socket = createSocket("udp4");
    this.listen();
    this.rl = this.read();
    this.socket.bind(PORT);
    this.buf = fs.createWriteStream(__dirname + "/image.jpg");
  }

  private listen() {
    this.socket.on("message", this.onMessage.bind(this));
    this.socket.on("error", this.onErrorHandler.bind(this));
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


  private onMessage(msg: Buffer | string) {
    console.log("\n" + this.receiver_ip + ": ", msg);
    
    this.buf.write(msg);    
  }

  public sendFile() {
    // const rr = Buffer.from("rogorxar");
    // console.log(rr);
    const data = fs.createReadStream(__dirname + "/../pictures/desert.jpg");
    data.on("data", (chunk) => {
      console.log(chunk);
      this.socket.send(
        chunk,
        this.port,
        this.address,
        (err: Error | null, bytes: number) => {}
      );
    });
  }

  public askMessage() {
    this.rl.question("", (message: string) => {
      this.send(this.receiver_ip, 3000, message);
      setTimeout(() => {
        this.askMessage();
      }, 0);
    });
  }

  public send(ip: string, port: number, msg: string | Buffer): void {
    this.socket.send(`${msg}\n`, port, ip, (err: Error | null) => {
      if (err) throw err;
    });
  }

  public get address() {
    return this.receiver_ip;
  }

  public get port() {
    return this.PORT;
  }
}
