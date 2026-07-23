/**
 * Seller Agent - Sells research services to buyer agents
 * Part of the Agent Research Service for Imperial AI Agent Hackathon
 */

import { PublicKey } from '@solana/web3.js';
import { deliverService } from './service.js';

export interface SellerConfig {
  wallet: PublicKey;
  services: string[];
  floorPrice: number; // minimum price in SOL
  maxPrice: number;   // maximum price in SOL
}

export class SellerAgent {
  private config: SellerConfig;

  constructor(config: SellerConfig) {
    this.config = config;
  }

  /**
   * Parse WANT message from buyer
   */
  parseWant(message: string): { service: string; arg: string; budget: number } | null {
    const match = message.match(/WANT.*service=(\w+).*arg=(\S+).*budget=(\d+\.?\d*)/);
    if (!match) return null;
    
    return {
      service: match[1],
      arg: match[2],
      budget: parseFloat(match[3]),
    };
  }

  /**
   * Calculate price for service
   */
  calculatePrice(service: string, arg: string): number {
    let price = this.config.floorPrice;
    
    // Price adjustments based on service complexity
    switch (service) {
      case 'analyze':
        price = Math.max(price, 0.005);
        // Higher price for longer addresses
        price += Math.min(arg.length / 100, 0.01);
        break;
      case 'trend':
        price = Math.max(price, 0.003);
        price += Math.min(arg.split(' ').length * 0.001, 0.005);
        break;
      case 'compare':
        price = Math.max(price, 0.008);
        break;
      default:
        price = this.config.floorPrice;
    }
    
    return Math.min(price, this.config.maxPrice);
  }

  /**
   * Post BID to market
   */
  async postBid(round: number, price: number): Promise<string> {
    if (!this.config.services.length) {
      throw new Error('No services configured');
    }
    
    const message = `BID round=${round} price=${price} SOL by=${this.config.wallet.toBase58().slice(0, 8)}`;
    console.log('[SELLER] Posting BID:', message);
    
    return message;
  }

  /**
   * Generate payment reference
   */
  generateReference(): string {
    return `ref_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  /**
   * Request payment from buyer
   */
  requestPayment(round: number, reference: string, amount: number): string {
    return `PAYMENT_REQUIRED round=${round} rail=x402 amount=${amount} SOL reference=${reference} seller=${this.config.wallet.toBase58()}`;
  }

  /**
   * Submit and verify buyer's payment
   */
  async verifyPayment(paymentProof: any): Promise<boolean> {
    console.log('[SELLER] Verifying payment:', paymentProof);
    
    // In production: verify transaction on-chain
    if (paymentProof.reference && paymentProof.amount > 0) {
      console.log('[SELLER] Payment verified!');
      return true;
    }
    
    return false;
  }

  /**
   * Deliver the service
   */
  async deliver(round: number, request: string): Promise<string> {
    console.log('[SELLER] Delivering service for request:', request);
    
    try {
      const result = await deliverService(request);
      console.log('[SELLER] Delivery complete');
      return `DELIVERED round=${round} ${result}`;
    } catch (error) {
      console.error('[SELLER] Delivery failed:', error);
      return `DELIVERED round=${round} {"error": "Delivery failed"}`;
    }
  }

  /**
   * Check if we should bid on this request
   */
  shouldBid(service: string, budget: number): boolean {
    if (!this.config.services.includes(service)) {
      return false;
    }
    
    const price = this.calculatePrice(service, '');
    return price <= budget && price >= this.config.floorPrice;
  }
}
