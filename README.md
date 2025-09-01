<div align="center">

# 🎟️ Where's My Tickets

</div>

Where's My Tickets is a smart contract system for managing event tickets as NFTs (ERC721), built with Hardhat and TypeScript. It enables event organisers to mint tickets, and users to own and use them securely on-chain.

## Features
- Mint event tickets as ERC721 NFTs
- Each ticket stores event name, date, seat, owner, and usage status
- Only the contract owner can mint tickets
- Only ticket owners can use (validate) their tickets
- Prevents double usage and unauthorised access

## Project Structure
- `contracts/` — Solidity contracts (`EventTicket.sol`, `EventTicketLibrary.sol`)
- `test/` — TypeScript tests for contract logic
- `ignition/` — Hardhat Ignition deployment modules
- `artifacts/`, `typechain-types/` — Build outputs
- `hardhat.config.ts` — Hardhat configuration

## Getting Started

### Prerequisites
- Node.js >= 18
- npm
- [Hardhat](https://hardhat.org/)

### Install Dependencies
```bash
npm install
```

### Compile Contracts
```bash
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
```

### Deploy to Local Besu Node
Set your Besu private key:
```bash
npx hardhat vars set BESU_PRIVATE_KEY
```
Then deploy:
```bash
npm run deploy
```

## Usage

### Minting a Ticket
Only the contract owner can mint:
```solidity
eventTicket.mintTicket(userAddress, "Event Name", "YYYY-MM-DD", "SeatNumber");
```

### Using a Ticket
Only the ticket owner can use their ticket:
```solidity
eventTicket.connect(user).useTicket(ticketId);
```

### Query Ticket Info
```solidity
eventTicket.getTicket(ticketId);
```

## Testing
See `test/EventTicket.ts` for full test coverage:
- Minting tickets
- Using tickets
- Preventing double use
- Access control

## Contract Overview

### EventTicket.sol
- Inherits ERC721 and Ownable
- Stores ticket info in a struct
- Emits events for minting and usage
- Custom errors for unauthorised actions

### EventTicketLibrary.sol
- Defines the ticket struct, events, and errors

## Scripts
Common tasks:
```bash
npx hardhat compile      # Compile contracts
npx hardhat test         # Run tests
npx hardhat node         # Start local node
npm run deploy           # Clean, compile, and deploy to Besu
```

## Licence

This project is licenced under the [MIT Licence](LICENSE).

