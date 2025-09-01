import { expect } from "chai";
import { ethers } from "hardhat";
import { EventTicket, EventTicket__factory } from "../typechain-types";

describe("EventTicket", function () {
  let eventTicket: EventTicket;
  let owner: any;
  let user: any;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    const factory: EventTicket__factory = await ethers.getContractFactory("EventTicket") as EventTicket__factory;
    eventTicket = await factory.deploy();
    await eventTicket.waitForDeployment();
  });

  it("Should deploy the contract", async () => {
    expect(eventTicket.target).to.properAddress;
  });

  it("Should allow owner to mint a ticket", async () => {
    await eventTicket.mintTicket(user.address, "Oasis 2025 SP", "2025-09-15", "A1");
    const ticket = await eventTicket.getTicket(1);

    expect(ticket.id).to.equal(1);
    expect(ticket.eventName).to.equal("Oasis 2025 SP");
    expect(ticket.eventDate).to.equal("2025-09-15");
    expect(ticket.seatNumber).to.equal("A1");
    expect(ticket.owner).to.equal(user.address);
    expect(ticket.isUsed).to.equal(false);
  });

  it("Should not allow non-owner to mint", async () => {
    await expect(
      eventTicket.connect(user).mintTicket(user.address, "Calcinha Preta 30 Anos", "2025-09-15", "A1")
    ).to.be.revertedWithCustomError(eventTicket, "OwnableUnauthorizedAccount");
  });

  it("Should allow ticket owner to use ticket", async () => {
    await eventTicket.mintTicket(user.address, "Calcinha Preta 30 Anos", "2025-09-15", "A1");
    await eventTicket.connect(user).useTicket(1);

    const ticket = await eventTicket.getTicket(1);
    expect(ticket.isUsed).to.equal(true);
  });

  it("Should not allow using ticket twice", async () => {
    await eventTicket.mintTicket(user.address, "Woodstock 2029 ", "2025-09-15", "A1");
    await eventTicket.connect(user).useTicket(1);

    await expect(eventTicket.connect(user).useTicket(1))
      .to.be.revertedWithCustomError(eventTicket, "TicketAlreadyUsed");
  });

  it("Should not allow non-ticket owner to use ticket", async () => {
    await eventTicket.mintTicket(user.address, "Woodstock 2029 ", "2025-09-15", "A1");

    await expect(eventTicket.useTicket(1))
      .to.be.revertedWithCustomError(eventTicket, "Unauthorized");
  });
});
