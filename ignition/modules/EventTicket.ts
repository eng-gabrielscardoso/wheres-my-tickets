// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EventTicketModule = buildModule("EventTicketModule", (m) => {
  const eventTicket = m.contract("EventTicket");

  const fan = "0xe2f51206EF4AD8d50FbFe8C0C3Cd450221935367";

  m.call(
    eventTicket,
    "mintTicket",
    [fan, "Calcinha Preta 30 Anos", "2025-09-15", "A1"],
    { id: "mintTicket1" }
  );
  m.call(
    eventTicket,
    "mintTicket",
    [fan, "Woodstock 2029", "2025-09-15", "A1"],
    { id: "mintTicket2" }
  );
  m.call(
    eventTicket,
    "mintTicket",
    [fan, "Oasis 2025 SP", "2025-09-15", "A1"],
    { id: "mintTicket3" }
  );

  return { eventTicket };
});

export default EventTicketModule;
