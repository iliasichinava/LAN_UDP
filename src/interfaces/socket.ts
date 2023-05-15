import { Socket } from "dgram";
export interface ISocket {
  send(ip: string, port: number, msg: string | Buffer): void;
  create(): Socket;

  //   Accessors
  get port(): number;
  get address(): string;
}
