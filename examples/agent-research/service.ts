/**
 * Agent Research Service - A paid service that sells AI-powered research and analysis.
 * 
 * This service demonstrates the CoralOS x402 payment flow:
 * - Buyer sends a research request with payment
 * - Seller delivers the research result
 * - Payment is settled via Solana x402 before delivery
 * 
 * Services offered:
 *   "analyze <address>"  - Analyze a Solana smart contract/address
 *   "trend <topic>"      - Generate research on a trending topic
 *   "compare <a> <b>"   - Compare two addresses/projects
 */

export interface ResearchResult {
  service: 'agent-research';
  query: string;
  result: string;
  confidence: number;
  sources: string[];
  timestamp: string;
  computationUnits: number;
}

export async function deliverService(request: string): Promise<string> {
  const tokens = request.trim().split(/\s+/).filter(Boolean);
  let verb = (tokens[0] ?? '').toLowerCase();
  const args = tokens.slice(1);

  try {
    switch (verb) {
      case 'analyze': {
        const address = args[0];
        if (!address) {
          return JSON.stringify({ error: 'usage: analyze <solana-address>' });
        }
        // Simulate AI analysis of a Solana contract
        const analysis = await analyzeContract(address);
        return JSON.stringify(analysis);
      }

      case 'trend': {
        const topic = args.join(' ') || 'solana-ecosystem';
        const trend = await generateTrendAnalysis(topic);
        return JSON.stringify(trend);
      }

      case 'compare': {
        const a = args[0];
        const b = args[1];
        if (!a || !b) {
          return JSON.stringify({ error: 'usage: compare <address-a> <address-b>' });
        }
        const comparison = await compareContracts(a, b);
        return JSON.stringify(comparison);
      }

      default:
        return JSON.stringify({
          error: `unknown verb: ${verb}`,
          hint: 'Available: analyze <address>, trend <topic>, compare <a> <b>'
        });
    }
  } catch (e) {
    return JSON.stringify({ error: `research delivery failed: ${(e as Error).message}` });
  }
}

async function analyzeContract(address: string): Promise<ResearchResult> {
  // Simulate on-chain analysis
  await sleep(100);
  
  const hash = simpleHash(address);
  const riskScore = (hash % 100) / 100;
  
  return {
    service: 'agent-research',
    query: `analyze ${address}`,
    result: `Contract ${address.slice(0, 8)}... analyzed successfully. Risk score: ${(riskScore * 100).toFixed(1)}%. TVL estimate: ${(hash % 1000000).toLocaleString()} SOL. Security flags: ${riskScore > 0.7 ? 'HIGH - verify manually' : 'LOW'}.`,
    confidence: 0.85 - (riskScore * 0.3),
    sources: [
      `https://solscan.io/account/${address}`,
      `https://explorer.solana.com/account/${address}`
    ],
    timestamp: new Date().toISOString(),
    computationUnits: 1000 + (hash % 500)
  };
}

async function generateTrendAnalysis(topic: string): Promise<ResearchResult> {
  await sleep(150);
  
  const hash = simpleHash(topic);
  const popularity = ((hash % 100) / 100) * 100;
  
  return {
    service: 'agent-research',
    query: `trend ${topic}`,
    result: `Topic "${topic}" has ${popularity.toFixed(1)}% market attention. Key signals: ${popularity > 70 ? 'HIGH activity - act now' : 'Moderate activity - building phase'}. Sentiment: ${hash % 2 === 0 ? 'Bullish' : 'Neutral'}. Key players: ${topic.slice(0, 4)}-protocol, ${topic.slice(0, 3)}-labs.`,
    confidence: 0.75 + ((hash % 20) / 100),
    sources: [
      `https://twitter.com/search?q=${encodeURIComponent(topic)}`,
      `https://coinmarketcap.com/search/?q=${encodeURIComponent(topic)}`
    ],
    timestamp: new Date().toISOString(),
    computationUnits: 800 + (hash % 300)
  };
}

async function compareContracts(a: string, b: string): Promise<ResearchResult> {
  await sleep(200);
  
  const hashA = simpleHash(a);
  const hashB = simpleHash(b);
  
  const scoreA = hashA % 100;
  const scoreB = hashB % 100;
  
  return {
    service: 'agent-research',
    query: `compare ${a} vs ${b}`,
    result: `Contract A (${a.slice(0, 6)}...): Score ${scoreA}/100. Contract B (${b.slice(0, 6)}...): Score ${scoreB}/100. Winner: ${scoreA > scoreB ? 'A' : 'B'} by ${Math.abs(scoreA - scoreB)} points. Key differentiators: ${scoreA > scoreB ? 'Security audit, TVL' : 'Innovation, community'}.`,
    confidence: 0.80,
    sources: [
      `https://solscan.io/account/${a}`,
      `https://solscan.io/account/${b}`
    ],
    timestamp: new Date().toISOString(),
    computationUnits: 1200
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
