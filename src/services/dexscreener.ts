import { Pool } from '../types/pool';

const DEXSCREENER_API_URL = 'https://api.dexscreener.com/latest/dex/pairs/pulsechain';
const BATCH_SIZE = 10; // Reduced batch size for better reliability
const CACHE_DURATION = 60000; // 1 minute cache
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface DexScreenerPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: {
    symbol: string;
    price: string;
  };
  quoteToken: {
    symbol: string;
    price: string;
  };
  priceUsd: string;
  volume: {
    h24: number;
    d30: number;
  };
  liquidity: {
    usd: number;
  };
}

interface CacheEntry {
  data: Record<string, DexScreenerPair>;
  timestamp: number;
}

const cache: CacheEntry = {
  data: {},
  timestamp: 0,
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, retries = MAX_RETRIES): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': '9mm-interface'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(RETRY_DELAY * (i + 1));
    }
  }
  throw new Error('Max retries reached');
};

export const fetchDexScreenerPairs = async (pairAddresses: string[]): Promise<Record<string, DexScreenerPair>> => {
  try {
    // Check cache first
    if (Date.now() - cache.timestamp < CACHE_DURATION) {
      const cachedPairs = Object.fromEntries(
        pairAddresses.map(addr => [
          addr.toLowerCase(),
          cache.data[addr.toLowerCase()]
        ]).filter(([_, pair]) => pair)
      );

      if (Object.keys(cachedPairs).length === pairAddresses.length) {
        return cachedPairs;
      }
    }

    // Split addresses into smaller batches
    const batches = pairAddresses.reduce((acc: string[][], addr, i) => {
      const batchIndex = Math.floor(i / BATCH_SIZE);
      if (!acc[batchIndex]) acc[batchIndex] = [];
      acc[batchIndex].push(addr);
      return acc;
    }, []);

    // Fetch data in sequence with retries
    const results = [];
    for (const batch of batches) {
      try {
        const addresses = batch.join(',');
        const response = await fetchWithRetry(`${DEXSCREENER_API_URL}/${addresses}`);
        const data = await response.json();
        results.push(...(data.pairs || []));
        
        // Add small delay between batches to avoid rate limiting
        if (batch !== batches[batches.length - 1]) {
          await sleep(500);
        }
      } catch (error) {
        console.error('Failed to fetch batch:', error);
        // Continue with next batch on error
        continue;
      }
    }

    // Process and cache results
    const pairs = results.reduce((acc, pair) => {
      if (pair) {
        const address = pair.pairAddress.toLowerCase();
        acc[address] = pair;
        cache.data[address] = pair;
      }
      return acc;
    }, {} as Record<string, DexScreenerPair>);

    cache.timestamp = Date.now();
    return pairs;
  } catch (error) {
    console.error('Failed to fetch DexScreener data:', error);
    
    // Return cached data if available
    if (Object.keys(cache.data).length > 0) {
      return Object.fromEntries(
        pairAddresses.map(addr => [
          addr.toLowerCase(),
          cache.data[addr.toLowerCase()]
        ]).filter(([_, pair]) => pair)
      );
    }
    
    // Return empty object as last resort
    return {};
  }
};