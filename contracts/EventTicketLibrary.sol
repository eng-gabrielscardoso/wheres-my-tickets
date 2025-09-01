// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library EventTicketLibrary {
    struct EventTicket {
        uint256 id;
        string eventName;
        string eventDate;
        string seatNumber;
        address owner;
        bool isUsed;
    }

    event TicketMinted(uint256 indexed ticketId, address indexed owner);
    event TicketUsed(uint256 indexed ticketId, address indexed owner);

    error Unauthorized(address caller);
    error TicketNotFound(uint256 ticketId);
    error TicketAlreadyUsed(uint256 ticketId);
}
