/**
 * Market Round Demo - Complete CoralOS x402 Flow
 * Demonstrates the full agent economy cycle
 */

import { Keypair } from '@solana/web3.js';
import { BuyerAgent, BuyerConfig } from './buyer-agent.js';
import { SellerAgent, SellerConfig } from './seller-agent.js';

async function runMarketRound() {
  console.log('='.repeat(50));
  console.log('Agent Research Service - Market Round Demo');
  console.log('Imperial AI Agent Hackathon');
  console.log('='.repeat(50));
  console.log('');

  // Setup buyer
  const buyerKeypair = Keypair.generate();
  const buyerConfig: BuyerConfig = {
    wallet: buyerKeypair.publicKey,
    maxBudget: 0.1, // 0.1 SOL max
    allowedServices: ['analyze', 'trend', 'compare'],
  };
  const buyer = new BuyerAgent(buyerConfig);
  console.log('[SETUP] Buyer wallet:', buyerKeypair.publicKey.toBase58().slice(0, 16) + '...');

  // Setup seller
  const sellerKeypair = Keypair.generate();
  const sellerConfig: SellerConfig = {
    wallet: sellerKeypair.publicKey,
    services: ['analyze', 'trend', 'compare'],
    floorPrice: 0.001,
    maxPrice: 0.1,
  };
  const seller = new SellerAgent(sellerConfig);
  console.log('[SETUP] Seller wallet:', sellerKeypair.publicKey.toBase58().slice(0, 16) + '...');
  console.log('');

  // Round parameters
  const round = Date.now();
  const request = 'analyze TokenkegQgzFGpxr5dvrfWkFevm6VK8RcXUZzPB7MmXw';
  const budget = 0.02; // SOL

  // Step 1: Buyer posts WANT
  console.log('[STEP 1] BUYER posts WANT');
  const wantMessage = await buyer.postWant('analyze', 'TokenkegQgzFGpxr5dvrfWkFevm6VK8RcXUZzPB7MmXw', budget);
  console.log('       ', wantMessage);
  console.log('');

  // Step 2: Seller receives and prices WANT
  console.log('[STEP 2] SELLER receives WANT');
  const parsedWant = seller.parseWant(wantMessage);
  if (parsedWant) {
    const price = seller.calculatePrice(parsedWant.service, parsedWant.arg);
    console.log('       ', `Calculated price: ${price} SOL`);
    console.log('');

    // Step 3: Seller posts BID
    console.log('[STEP 3] SELLER posts BID');
    const bidMessage = await seller.postBid(round, price);
    console.log('       ', bidMessage);
    console.log('');
  }

  // Step 4: Buyer awards
  console.log('[STEP 4] BUYER awards job');
  const awardMessage = buyer.award(sellerKeypair.publicKey.toBase58(), round);
  console.log('       ', awardMessage);
  console.log('');

  // Step 5: x402 Payment flow
  console.log('[STEP 5] x402 PAYMENT FLOW');
  const reference = seller.generateReference();
  console.log('       ', seller.requestPayment(round, reference, 0.005));
  console.log('');

  // Step 6: Buyer pays
  console.log('[STEP 6] BUYER submits payment');
  const paymentProof = await buyer.pay(sellerKeypair.publicKey, 0.005, reference);
  console.log('       ', `Payment proof: ${paymentProof.txSignature.slice(0, 20)}...`);
  console.log('');

  // Step 7: Seller verifies and delivers
  console.log('[STEP 7] SELLER verifies payment');
  const verified = await seller.verifyPayment(paymentProof);
  if (verified) {
    console.log('       Payment verified!');
    console.log('');
    console.log('[STEP 8] SELLER delivers service');
    const delivery = await seller.deliver(round, request);
    console.log('       ', delivery.slice(0, 100) + '...');
    console.log('');
  }

  // Step 9: Buyer verifies delivery
  console.log('[STEP 9] BUYER verifies delivery');
  const buyerResult = delivery.replace('DELIVERED round=' + round + ' ', '');
  const deliveryVerified = await buyer.verifyDelivery(buyerResult);
  console.log('       ', `Delivery ${deliveryVerified ? 'VERIFIED ✓' : 'FAILED ✗'}`);
  console.log('');

  // Step 10: Settlement
  console.log('[STEP 10] SETTLED on Solana');
  const settledMessage = buyer.settled(round, reference);
  console.log('         ', settledMessage);
  console.log('');

  console.log('='.repeat(50));
  console.log('MARKET ROUND COMPLETE');
  console.log('='.repeat(50));
  console.log('');
  console.log('Summary:');
  console.log('- Service: Contract Analysis');
  console.log('- Price: 0.005 SOL');
  console.log('- Payment: Settled via x402 on Solana');
  console.log('- Buyer paid before delivery (trustless)');
  console.log('- Seller delivered after payment confirmed');
}

// Export for use as module
export { runMarketRound };

// Run if executed directly
runMarketRound().catch(console.error);
