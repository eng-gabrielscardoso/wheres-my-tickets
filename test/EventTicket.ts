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

    const factory: EventTicket__factory = (await ethers.getContractFactory(
      "EventTicket"
    )) as EventTicket__factory;

    eventTicket = await factory.deploy(
      "Gabriel Eventos & Shows",
      "GES",
      await organiser.getAddress()
    );
    await eventTicket.waitForDeployment();

    await eventTicket
      .connect(organiser)
      .createEvent("Oasis 2025 SP", "2025-09-15", "A1", ethers.parseEther("1"));
  });

  it("Should deploy the contract", async () => {
    expect(eventTicket.target).to.properAddress;
  });

  it("Should allow fan to buy a ticket for an event", async () => {
    const fanAddress = await fan.getAddress();

    await eventTicket
      .connect(fan)
      .buyTicket(1, { value: ethers.parseEther("1") });

    const ticket = await eventTicket.getTicket(1);
    expect(ticket.id).to.equal(1);
    expect(ticket.owner).to.equal(fanAddress);
  });

  it("Should not allow underpayment when buying ticket", async () => {
    await expect(
      eventTicket.connect(fan).buyTicket(1, { value: ethers.parseEther("0.5") })
    ).to.be.revertedWithCustomError(eventTicket, "InvalidPayment");
  });

  it("Should allow fan to use their ticket (burns the ticket)", async () => {
    const fanAddress = await fan.getAddress();

    await eventTicket
      .connect(fan)
      .buyTicket(1, { value: ethers.parseEther("1") });

    await eventTicket.connect(fan).useTicket(1);

    await expect(eventTicket.getTicket(1)).to.be.revertedWithCustomError(
      eventTicket,
      "TicketNotFound"
    );
    await expect(eventTicket.ownerOf(1)).to.be.reverted;
  });

  it("Should not allow non-owner (friend) to use fan's ticket", async () => {
    await eventTicket
      .connect(fan)
      .buyTicket(1, { value: ethers.parseEther("1") });

    await expect(
      eventTicket.connect(friend).useTicket(1)
    ).to.be.revertedWithCustomError(eventTicket, "Unauthorized");
  });

  it("Should allow fan to transfer their ticket to a friend", async () => {
    const fanAddress = await fan.getAddress();
    const friendAddress = await friend.getAddress();

    await eventTicket
      .connect(fan)
      .buyTicket(1, { value: ethers.parseEther("1") });

    await eventTicket.connect(fan).transferTicket(fanAddress, friendAddress, 1);

    const ticket = await eventTicket.getTicket(1);
    expect(ticket.owner).to.equal(friendAddress);
    expect(await eventTicket.ownerOf(1)).to.equal(friendAddress);
  });
});
