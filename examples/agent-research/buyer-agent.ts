/**
 * Buyer Agent - Purchases research services from seller agents
 * Part of the Agent Research Service for Imperial AI Agent Hackathon
 */

import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export interface BuyerConfig {
  wallet: PublicKey;
  maxBudget: number; // in SOL
  allowedServices: string[];
}

export class BuyerAgent {
  private config: BuyerConfig;
  private connection: any;

  constructor(config: BuyerConfig) {
    this.config = config;
  }

  /**
   * Post a WANT message to the market
   */
  async postWant(service: string, arg: string, budget: number): Promise<string> {
    if (!this.config.allowedServices.includes(service)) {
      throw new Error(`Service ${service} not allowed`);
    }
    if (budget > this.config.maxBudget) {
      throw new Error(`Budget ${budget} exceeds max ${this.config.maxBudget}`);
    }

    const message = `WANT round=${Date.now()} service=${service} arg=${arg} budget=${budget} SOL`;
    console.log('[BUYER] Posting WANT:', message);
    
    return message;
  }

  /**
   * Select the best bid from collected bids
   */
  selectBestBid(bids: Bid[]): Bid | null {
    if (bids.length === 0) return null;
    
    // Select lowest price that meets requirements
    const validBids = bids.filter(bid => 
      bid.price <= this.config.maxBudget
    );
    
    if (validBids.length === 0) return null;
    
    // Sort by price (ascending)
    validBids.sort((a, b) => a.price - b.price);
    return validBids[0];
  }

  /**
   * Award the job to selected seller
   */
  award(seller: string, round: number): string {
    return `AWARD round=${round} to=${seller} reason="Best price"`;
  }

  /**
   * Pay via x402 protocol
   */
  async pay(sellerAddress: PublicKey, amount: number, reference: string): Promise<PaymentProof> {
    console.log(`[BUYER] Initiating x402 payment: ${amount} SOL to ${sellerAddress.toBase58()}`);
    
    // In production: create x402 payment transaction
    const tx = new Transaction();
    tx.add(
      SystemProgram.transfer({
        fromPubkey: this.config.wallet,
        toPubkey: sellerAddress,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    // Return payment proof (would be signed in production)
    return {
      reference,
      amount,
      buyer: this.config.wallet.toBase58(),
      seller: sellerAddress.toBase58(),
      txSignature: `mock_tx_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Verify delivery
   */
  async verifyDelivery(payload: string, expectedHash?: string): Promise<boolean> {
    // Simple verification - check if payload is valid JSON without error
    try {
      const parsed = JSON.parse(payload);
      if (parsed.error) {
        console.log('[BUYER] Delivery contains error:', parsed.error);
        return false;
      }
      console.log('[BUYER] Delivery verified successfully');
      return true;
    } catch {
      console.log('[BUYER] Delivery verification failed - invalid format');
      return false;
    }
  }

  /**
   * Post SETTLED confirmation
   */
  settled(round: number, reference: string): string {
    return `SETTLED round=${round} rail=x402 reference=${reference}`;
  }
}

interface Bid {
  seller: string;
  price: number;
  round: number;
}

interface PaymentProof {
  reference: string;
  amount: number;
  buyer: string;
  seller: string;
  txSignature: string;
  timestamp: string;
}
