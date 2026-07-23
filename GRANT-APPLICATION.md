# Agentic Engineering Grant Application

**Project:** AgentBazaar  
**Grant:** $200 USDG | Superteam

---

## What This Is

AgentBazaar — trustless marketplace where AI agents buy and sell research services (contract analysis, token research, market comparisons) from each other, settled instantly via Solana's x402 protocol. No escrow, no counterparty risk — reputation replaces refunds.

### The Problem

AI agents need external services they can't produce themselves:
- Smart contract analysis
- Token research
- Market data

Current solutions are manual, slow, or rely on unaccountable free APIs. This project is an automated, on-chain-settled system for agents to buy and sell these services from each other.

---

## Project Scope (SHIP)

### Deliverables

| # | What | Description | Status |
|---|------|-------------|--------|
| 1 | Buyer Agent | Posts "WANT research" with a SOL budget | Built |
| 2 | Seller Agent | Bids, delivers research, gets paid | Built |
| 3 | x402 Payment | Automatic SOL payment on delivery | Built |
| 4 | Devnet Demo | Live run: WANT → BID → AWARD → PAY → DELIVERED → SETTLED | Built, needs a fresh recorded run |
| 5 | Documentation | README + architecture docs | Done |
| 6 | Demo Video | 3-minute walkthrough | To record for tranche 2 |

### What "Research" Means

| Service | Input | Output |
|---------|-------|--------|
| Token Analysis | Token address | Price, market cap, holders |
| Contract Audit | Program ID | Security summary |
| Price Compare | 2 tokens | Comparison report |

---

## Solana Integration

- **x402 protocol** — buyer pays seller directly in SOL, no escrow, final settlement
- **On-chain settlement** — transaction confirmed on Solana (devnet; mainnet is opt-in via `ALLOW_MAINNET=1`)
- **Escrow & arbiter programs** — deployed Anchor programs available as an alternate rail alongside x402 and Solana Pay
- **Devnet testing** — full flow covered by unit tests and a live devnet e2e script

---

## Tranches

**Tranche 1 — Scope & foundation**
The system above is already built end-to-end: buyer/seller/verifier agents, all three payment rails (x402, Solana Pay, escrow), and a full unit test suite. This application covers that existing build plus the plan to finish public proof-of-work below.

**Tranche 2 — Live MVP proof**
By the second tranche application, this will be a live, working MVP, demonstrated with:
- a fresh devnet transaction (buyer → seller, x402), linked on Solana Explorer
- a short demo video showing WANT → BID → AWARD → PAYMENT → DELIVERED → SETTLED end to end

---

## Success Metrics

- [x] Buyer agent sends WANT with SOL budget
- [x] Seller agent responds with BID
- [x] x402 payment completes automatically
- [x] Research delivered and verified
- [ ] Fresh settlement confirmed on Solana Explorer (tranche 2)
- [ ] Demo video recorded (tranche 2)

---

## Repository

<link to repo>

If kept private, review access will be shared with abhwshek@gmail.com as required.

Stack: TypeScript, CoralOS, Solana x402, Solana Devnet

---

## Why This Project

- Clear, shippable scope
- Full Solana integration (x402, on-chain settlement, escrow as an alternate rail)
- Working product already built, not just planned
- Straightforward path to a public, verifiable tranche-2 proof (devnet tx + demo video)
