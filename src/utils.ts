import { config } from 'dotenv';
import { Client } from 'pg';

config();

interface RpcDto {
  url: string;
  chainId: string;
  weight: number;
  requiresProxy: boolean;
  isArchiveNode: boolean;
}

export enum CHAINID {
  ETHEREUM = '1',
  MATIC = '137',
  BSC = '56',
  FANTOM = '250',
  CELO = '42220',
  AVAX = '43114',
  XDAI = '100',
  ARBITRUM = '42161',
  HARMONY = '1666600000',
  OPTIMISM = '10',
  MUMBAI = '80001',
  AURORA = '1313161554',
  SOLANA = '-8768', // following defi price convention
  EVMOS = '9001',
  EVMOS_COSMOS = 'evmos_9001-2',
  OSMOSIS = 'osmosis-1',
  COSMOSHUB = '-1061702', // following defi price convention
  RONIN = '2020',
  BEACON = 'eth2',
  BASE = '84532',
}

export async function getRpcUrlsForChain(chainId: string, requireArchiveNode = true): Promise<string[]> {
  const client = new Client({
    host: process.env.ARCHIVE_WEB_API_HOST,
    port: process.env.ARCHIVE_WEB_API_PORT,
    user: process.env.ARCHIVE_WEB_API_USER,
    password: process.env.ARCHIVE_WEB_API_PASSWORD,
    database: process.env.ARCHIVE_WEB_API_DATABASE,
    connectionTimeoutMillis: 5000,
    idle_in_transaction_session_timeout: 5000
  });

  try {
    const payload = {
      text: 'SELECT * FROM public.rpc WHERE "chainId" = $1 AND "isArchiveNode" = $2',
      values: [chainId, requireArchiveNode],
    };
    await client.connect();
    const result = await client.query(payload);
    const rpcs: RpcDto[] = result.rows;

    if (!rpcs.length) {
      throw new Error(`Chain with ID ${chainId} not found, or no RPCs configured for chain.`);
    }
    
    rpcs.sort((a, b) => {
      if (b.weight === a.weight) { // When weights are equal, sort randomly
        return 0.5 - Math.random();
      }
      return b.weight - a.weight; // Otherwise, sort by weight descending
    });

    return rpcs.map((rpc) => rpc.url);
  } catch (err) {
    console.error('Error executing query', err);
  } finally {
    await client.end();
  }
}

export async function getRpcUrlsByBlock(chainId: string, blockNumber: number): Promise<string[]> {
  if (blockNumber == 0) return await getRpcUrlsForChain(chainId, false);

  return await getRpcUrlsForChain(chainId, true);
}
