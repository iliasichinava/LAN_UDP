export interface ISocket {
  send(ip: string, port: number, msg: string | Buffer): void;

  //   Accessors
  get port(): number;
  get address(): string;
}
