import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

const EventTicketModule = buildModule("EventTicketModule", (m) => {
  const fan = "0xe2f51206EF4AD8d50FbFe8C0C3Cd450221935367";

  const eventTicket = m.contract("EventTicket", [
    "Gabriel Eventos & Shows",
    "GES",
    fan,
  ]);

  m.call(
    eventTicket,
    "createEvent",
    ["Calcinha Preta 30 Anos", "2025-09-15", ethers.parseEther("0.0008")],
    { id: "event1" }
  );

  m.call(
    eventTicket,
    "createEvent",
    ["Woodstock 2029", "2029-08-10", ethers.parseEther("0.1")],
    { id: "event2" }
  );

  m.call(
    eventTicket,
    "createEvent",
    ["Oasis 2025 SP", "2025-11-20", ethers.parseEther("0.043")],
    { id: "event3" }
  );

  return { eventTicket };
});

export default EventTicketModule;
