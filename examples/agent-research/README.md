# Agent Research Service

An autonomous AI agent research service that sells on-demand analysis on the Solana blockchain.

## What It Does

This service enables AI agents to **sell research and analysis** to other agents, with payment settled trustlessly via Solana x402.

### Services Offered

| Command | Description | Price Range |
|---------|-------------|-------------|
| `analyze <address>` | Analyze a Solana smart contract | 0.001 - 0.1 SOL |
| `trend <topic>` | Generate research on trending topics | 0.002 - 0.05 SOL |
| `compare <a> <b>` | Compare two contracts/projects | 0.005 - 0.1 SOL |

## Architecture

```
┌─────────────┐     WANT      ┌─────────────┐
│   Buyer     │ ────────────► │   Seller    │
│   Agent     │ ◄──────────── │   Agent     │
└─────────────┘     BID       └─────────────┘
       │                           │
       │      x402 Payment         │
       │ ═══════════════════════► │
       │                           │
       │                    deliverService()
       │                           │
       │◄──────────────────────────┘
       │        DELIVERED
       │
       ▼
   SETTLED (on-chain)
```

## How It Works

1. **Buyer Agent** posts a `WANT` message with research query and budget
2. **Seller Agent** prices the request and posts a `BID`
3. **Buyer** awards the job to the best bid
4. **x402 Payment** is processed - SOL transferred to seller escrow
5. **Research Delivered** - AI analysis generated and returned
6. **Verification** - Buyer verifies delivery quality

## Running the Demo

### Prerequisites

- Node.js 18+
- Solana CLI configured for devnet
- Docker (for CoralOS runtime)

### Setup

```bash
cd examples/agent-research
npm install
```

### Run Single Agent Demo

```bash
# Start the service
npm run dev

# Test the service directly
curl -X POST http://localhost:3000/research \
  -H "Content-Type: application/json" \
  -d '{"query": "analyze TokenkegQgz...", "budget": 0.01}'
```

### Run Multi-Agent CoralOS Round

```bash
# Start CoralOS
docker compose up -d coral

# Build agents
bash build-agents.sh

# Run the round
npm run coral
```

## The Agent Economy

This service demonstrates **the agent economy** concept:

- **Sellers**: AI agents that have specialized knowledge (code analysis, research, data processing)
- **Buyers**: AI agents that need resources they don't have internally
- **Market**: Solana blockchain acts as the trustless marketplace
- **Payment**: x402 protocol enables machine-to-machine payments
- **Settlement**: Instant, final, no counterparty risk

## Example Flow

```
Buyer: "I need analysis of Jupiter Aggregator contract"
Seller: "I'll analyze it for 0.01 SOL"
Buyer: "Awarded to you"
[Buyer pays 0.01 SOL via x402]
Seller: "Here's the analysis: TVL $50M, Risk: LOW, Security: Audited by Ottosec"
[Seller receives payment]
```

## Files

- `service.ts` - The main deliverService() implementation
- `README.md` - This file

## Integration with CoralOS

To integrate with the CoralOS market protocol:

1. Add service name to `SellerConfig.supportedServices`
2. Configure pricing in seller's `bid()` function
3. Add to buyer's `policy.allowedServices`
4. Deploy and run the round

## License

MIT
