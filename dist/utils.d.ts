export declare enum CHAINID {
    ETHEREUM = "1",
    MATIC = "137",
    BSC = "56",
    FANTOM = "250",
    CELO = "42220",
    AVAX = "43114",
    XDAI = "100",
    ARBITRUM = "42161",
    HARMONY = "1666600000",
    OPTIMISM = "10",
    MUMBAI = "80001",
    AURORA = "1313161554",
    SOLANA = "-8768",
    EVMOS = "9001",
    EVMOS_COSMOS = "evmos_9001-2",
    OSMOSIS = "osmosis-1",
    COSMOSHUB = "-1061702",
    RONIN = "2020",
    BEACON = "eth2",
    BASE = "84532"
}
export declare function getRpcUrlsForChain(chainId: string, requireArchiveNode?: boolean): Promise<string[]>;
export declare function getRpcUrlsByBlock(chainId: string, blockNumber: number): Promise<string[]>;
