import { UdpSocket } from "./classes/socket";

const ilia = new UdpSocket(3000);

ilia.create();

ilia.send("172.16.15.217", 3000, "zd brat");
