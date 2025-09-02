import { expect } from "chai";
import { ethers } from "hardhat";
import type { Signer } from "ethers";
import { EventTicket, EventTicket__factory } from "../typechain-types";

describe("EventTicket", function () {
  let eventTicket: EventTicket;
  let organiser: Signer;
  let fan: Signer;
  let friend: Signer;

  beforeEach(async () => {
    [organiser, fan, friend] = await ethers.getSigners();

    const factory: EventTicket__factory = await ethers.getContractFactory("EventTicket") as EventTicket__factory;

    eventTicket = await factory.deploy();
    await eventTicket.waitForDeployment();
  });

  it("Should deploy the contract", async () => {
    expect(eventTicket.target).to.properAddress;
  });

  it("Should allow organiser to mint a ticket for a fan", async () => {
    const fanAddress = await fan.getAddress();
    await eventTicket.connect(organiser).mintTicket(fanAddress, "Oasis 2025 SP", "2025-09-15", "A1");

    const ticket = await eventTicket.getTicket(1);
    expect(ticket.id).to.equal(1);
    expect(ticket.eventName).to.equal("Oasis 2025 SP");
    expect(ticket.eventDate).to.equal("2025-09-15");
    expect(ticket.seatNumber).to.equal("A1");
    expect(ticket.owner).to.equal(fanAddress);
  });

  it("Should not allow non-organiser to mint tickets", async () => {
    const fanAddress = await fan.getAddress();

    await expect(
      eventTicket.connect(fan).mintTicket(fanAddress, "Calcinha Preta 30 Anos", "2025-09-15", "A1")
    ).to.be.revertedWithCustomError(eventTicket, "OwnableUnauthorizedAccount");
  });

  it("Should allow fan to use their ticket (burns the ticket)", async () => {
    const fanAddress = await fan.getAddress();
    await eventTicket.connect(organiser).mintTicket(fanAddress, "Calcinha Preta 30 Anos", "2025-09-15", "A1");

    await eventTicket.connect(fan).useTicket(1);

    await expect(eventTicket.getTicket(1)).to.be.revertedWithCustomError(eventTicket, "TicketNotFound");
    await expect(eventTicket.ownerOf(1)).to.be.reverted;
  });

  it("Should not allow fan to use a ticket twice", async () => {
    const fanAddress = await fan.getAddress();
    await eventTicket.connect(organiser).mintTicket(fanAddress, "Woodstock 2029", "2025-09-15", "A1");

    await eventTicket.connect(fan).useTicket(1);

    await expect(eventTicket.connect(fan).useTicket(1))
      .to.be.revertedWithCustomError(eventTicket, "TicketNotFound");
  });

  it("Should not allow non-owner (friend) to use fan's ticket", async () => {
    const fanAddress = await fan.getAddress();
    await eventTicket.connect(organiser).mintTicket(fanAddress, "Woodstock 2029", "2025-09-15", "A1");

    await expect(eventTicket.connect(friend).useTicket(1))
      .to.be.revertedWithCustomError(eventTicket, "Unauthorized");
  });

  it("Should allow fan to transfer their ticket to a friend", async () => {
    const fanAddress = await fan.getAddress();
    const friendAddress = await friend.getAddress();
    await eventTicket.connect(organiser).mintTicket(fanAddress, "Woodstock 2029", "2025-09-15", "A1");

    await eventTicket.connect(fan).transferTicket(fanAddress, friendAddress, 1);

    const ticket = await eventTicket.getTicket(1);
    expect(ticket.owner).to.equal(friendAddress);
    expect(await eventTicket.ownerOf(1)).to.equal(friendAddress);
  });

  it("Should not allow non-ticket owner (friend) to transfer ticket", async () => {
    const fanAddress = await fan.getAddress();
    const friendAddress = await friend.getAddress();
    await eventTicket.connect(organiser).mintTicket(fanAddress, "Oasis 2025 SP", "2025-09-15", "A1");

    await expect(
      eventTicket.connect(friend).transferTicket(fanAddress, friendAddress, 1)
    ).to.be.revertedWithCustomError(eventTicket, "Unauthorized");
  });

  it("Should not allow transfer of non-existent ticket", async () => {
    const friendAddress = await friend.getAddress();

    await expect(
      eventTicket.connect(friend).transferTicket(friendAddress, friendAddress, 999)
    ).to.be.revertedWithCustomError(eventTicket, "TicketNotFound");
  });

  it("Should allow transfer of unused ticket even if fan used another ticket", async () => {
    const fanAddress = await fan.getAddress();
    const friendAddress = await friend.getAddress();

    await eventTicket.connect(organiser).mintTicket(fanAddress, "Oasis 2025 SP", "2025-09-15", "A1");
    await eventTicket.connect(organiser).mintTicket(fanAddress, "Oasis 2025 SP", "2025-09-15", "A2");

    await eventTicket.connect(fan).useTicket(1);

    await eventTicket.connect(fan).transferTicket(fanAddress, friendAddress, 2);

    const ticket = await eventTicket.getTicket(2);
    expect(ticket.owner).to.equal(friendAddress);
  });
});
