import { UdpSocket } from "./classes/socket";

const ilia = new UdpSocket(3000);

ilia.askMessage("172.16.14.18");