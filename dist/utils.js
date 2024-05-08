"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRpcUrlsByBlock = exports.getRpcUrlsForChain = exports.CHAINID = void 0;
const dotenv_1 = require("dotenv");
const pg_1 = require("pg");
(0, dotenv_1.config)();
var CHAINID;
(function (CHAINID) {
    CHAINID["ETHEREUM"] = "1";
    CHAINID["MATIC"] = "137";
    CHAINID["BSC"] = "56";
    CHAINID["FANTOM"] = "250";
    CHAINID["CELO"] = "42220";
    CHAINID["AVAX"] = "43114";
    CHAINID["XDAI"] = "100";
    CHAINID["ARBITRUM"] = "42161";
    CHAINID["HARMONY"] = "1666600000";
    CHAINID["OPTIMISM"] = "10";
    CHAINID["MUMBAI"] = "80001";
    CHAINID["AURORA"] = "1313161554";
    CHAINID["SOLANA"] = "-8768";
    CHAINID["EVMOS"] = "9001";
    CHAINID["EVMOS_COSMOS"] = "evmos_9001-2";
    CHAINID["OSMOSIS"] = "osmosis-1";
    CHAINID["COSMOSHUB"] = "-1061702";
    CHAINID["RONIN"] = "2020";
    CHAINID["BEACON"] = "eth2";
    CHAINID["BASE"] = "84532";
})(CHAINID || (exports.CHAINID = CHAINID = {}));
async function getRpcUrlsForChain(chainId, requireArchiveNode = true) {
    const client = new pg_1.Client({
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
        const rpcs = result.rows;
        if (!rpcs.length) {
            throw new Error(`Chain with ID ${chainId} not found, or no RPCs configured for chain.`);
        }
        for (let i = rpcs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rpcs[i], rpcs[j]] = [rpcs[j], rpcs[i]];
        }
        return rpcs.map((rpc) => rpc.url);
    }
    catch (err) {
        console.error('Error executing query', err);
    }
    finally {
        await client.end();
    }
}
exports.getRpcUrlsForChain = getRpcUrlsForChain;
async function getRpcUrlsByBlock(chainId, blockNumber) {
    if (blockNumber == 0)
        return await getRpcUrlsForChain(chainId, false);
    return await getRpcUrlsForChain(chainId, true);
}
exports.getRpcUrlsByBlock = getRpcUrlsByBlock;
//# sourceMappingURL=utils.js.map