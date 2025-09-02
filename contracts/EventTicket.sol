// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./EventTicketLibrary.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EventTicket is ERC721, Ownable {
    uint256 private _nextTicketId = 1;

    mapping(uint256 => EventTicketLibrary.EventTicket) private _tickets;

    constructor() ERC721("EventTicket", "ETX") Ownable(msg.sender) {}

    modifier ticketExists(uint256 ticketId) {
        if (!_exists(ticketId))
            revert EventTicketLibrary.TicketNotFound(ticketId);
        _;
    }

    modifier ticketNotUsed(uint256 ticketId) {
        if (_tickets[ticketId].isUsed)
            revert EventTicketLibrary.TicketAlreadyUsed(ticketId);
        _;
    }

    modifier onlyTicketOwner(uint256 ticketId) {
        if (ownerOf(ticketId) != msg.sender)
            revert EventTicketLibrary.Unauthorized(msg.sender);
        _;
    }

    function mintTicket(
        address to,
        string memory eventName,
        string memory eventDate,
        string memory seatNumber
    ) external onlyOwner {
        uint256 ticketId = _nextTicketId++;

        _safeMint(to, ticketId);

        _tickets[ticketId] = EventTicketLibrary.EventTicket({
            id: ticketId,
            eventName: eventName,
            eventDate: eventDate,
            seatNumber: seatNumber,
            owner: to,
            isUsed: false
        });

        emit EventTicketLibrary.TicketMinted(ticketId, to);
    }

    function getTicket(
        uint256 ticketId
    ) external view returns (EventTicketLibrary.EventTicket memory) {
        return _tickets[ticketId];
    }

    function useTicket(
        uint256 ticketId
    )
        external
        ticketExists(ticketId)
        ticketNotUsed(ticketId)
        onlyTicketOwner(ticketId)
    {
        _tickets[ticketId].isUsed = true;

        emit EventTicketLibrary.TicketUsed(ticketId, msg.sender);
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
