// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EventTicketModule = buildModule("EventTicketModule", (m) => {
  const eventTicket = m.contract("EventTicket");

  return { eventTicket };
});

export default EventTicketModule;
