import { UdpSocket } from "./classes/socket";

const ilia = new UdpSocket(3000, "172.16.15.217");

ilia.create();

ilia.send("172.16.14.18", 3000, "zd");