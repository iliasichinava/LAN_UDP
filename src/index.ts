import { UdpSocket } from "./classes/socket";

const ilia = new UdpSocket(3000, "172.16.14.244");

ilia.askMessage();