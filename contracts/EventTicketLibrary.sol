// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library EventTicketLibrary {
    struct Event {
        uint256 id;
        string name;
        string date;
        string seat;
        uint256 price;
    }

    struct EventTicket {
        uint256 id;
        uint256 eventId;
        address owner;
    }

    event EventCreated(uint256 indexed eventId, string indexed name, string date, uint256 price);
    event TicketMinted(uint256 indexed ticketId, uint256 indexed eventId, address indexed owner);
    event TicketUsed(uint256 indexed ticketId, uint256 indexed eventId, address indexed owner);
    event TicketTransferred(uint256 indexed ticketId, address indexed from, address indexed to);

    error Unauthorized(address caller);
    error TicketNotFound(uint256 ticketId);
    error EventNotFound(uint256 eventId);
    error InvalidPayment(uint256 expected, uint256 received);
}
