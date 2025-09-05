// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./EventTicketLibrary.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EventTicket is ERC721, Ownable {
    uint256 private _nextEventId = 1;
    uint256 private _nextTicketId = 1;

    mapping(uint256 => EventTicketLibrary.Event) private _events;
    mapping(uint256 => EventTicketLibrary.EventTicket) private _tickets;

    constructor(
        string memory organiser,
        string memory symbol,
        address initialOwner
    ) ERC721(symbol, symbol) Ownable(initialOwner) {}

    modifier ticketExists(uint256 ticketId) {
        if (!_exists(ticketId))
            revert EventTicketLibrary.TicketNotFound(ticketId);
        _;
    }

    modifier eventExists(uint256 eventId) {
        if (_events[eventId].id == 0)
            revert EventTicketLibrary.EventNotFound(eventId);
        _;
    }

    modifier onlyTicketOwner(uint256 ticketId) {
        if (ownerOf(ticketId) != msg.sender)
            revert EventTicketLibrary.Unauthorized(msg.sender);
        _;
    }

    function createEvent(
        string memory name,
        string memory date,
        string memory seat,
        uint256 price
    ) external onlyOwner {
        uint256 eventId = _nextEventId++;

        _events[eventId] = EventTicketLibrary.Event({
            id: eventId,
            name: name,
            date: date,
            seat: seat,
            price: price
        });

        emit EventTicketLibrary.EventCreated(eventId, name, date, price);
    }

    function buyTicket(uint256 eventId) external payable eventExists(eventId) {
        EventTicketLibrary.Event memory ev = _events[eventId];

        if (msg.value < ev.price) {
            revert EventTicketLibrary.InvalidPayment(ev.price, msg.value);
        }

        uint256 ticketId = _nextTicketId++;

        _safeMint(msg.sender, ticketId);

        _tickets[ticketId] = EventTicketLibrary.EventTicket({
            id: ticketId,
            eventId: eventId,
            owner: msg.sender
        });

        emit EventTicketLibrary.TicketMinted(ticketId, eventId, msg.sender);
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function getEvent(
        uint256 eventId
    )
        external
        view
        eventExists(eventId)
        returns (EventTicketLibrary.Event memory)
    {
        return _events[eventId];
    }

    function getTicket(
        uint256 ticketId
    )
        external
        view
        ticketExists(ticketId)
        returns (EventTicketLibrary.EventTicket memory)
    {
        return _tickets[ticketId];
    }

    function useTicket(
        uint256 ticketId
    ) external ticketExists(ticketId) onlyTicketOwner(ticketId) {
        _burn(ticketId);

        delete _tickets[ticketId];

        emit EventTicketLibrary.TicketUsed(
            ticketId,
            _tickets[ticketId].eventId,
            msg.sender
        );
    }

    function transferTicket(
        address from,
        address to,
        uint256 ticketId
    ) external ticketExists(ticketId) onlyTicketOwner(ticketId) {
        _safeTransfer(from, to, ticketId);

        _tickets[ticketId].owner = to;

        emit EventTicketLibrary.TicketTransferred(ticketId, from, to);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _tickets[tokenId].id != 0;
    }
}
