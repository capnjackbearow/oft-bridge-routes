import { NextRequest, NextResponse } from "next/server";

// Direct token image URLs (to avoid rate limiting)
const TOKEN_IMAGES: Record<string, string> = {
  "USDC": "https://coin-images.coingecko.com/coins/images/6319/small/usdc.png",
  "USDT": "https://coin-images.coingecko.com/coins/images/325/small/Tether.png",
  "ETH": "https://coin-images.coingecko.com/coins/images/279/small/ethereum.png",
  "WETH": "https://coin-images.coingecko.com/coins/images/2518/small/weth.png",
  "WBTC": "https://coin-images.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png",
  "DAI": "https://coin-images.coingecko.com/coins/images/9956/small/Badge_Dai.png",
  "USDE": "https://coin-images.coingecko.com/coins/images/33613/small/usde.png",
  "SUSDE": "https://coin-images.coingecko.com/coins/images/35675/small/susde.png",
  "STG": "https://coin-images.coingecko.com/coins/images/24413/small/STG_LOGO.png",
  "METIS": "https://coin-images.coingecko.com/coins/images/15595/small/metis.png",
  "METH": "https://coin-images.coingecko.com/coins/images/33345/small/meth.png",
  "FRAX": "https://coin-images.coingecko.com/coins/images/13422/small/FRAX_icon.png",
  "LUSD": "https://coin-images.coingecko.com/coins/images/14666/small/Group_3.png",
  "MAI": "https://coin-images.coingecko.com/coins/images/15264/small/mimatic-red.png",
  "BUSD": "https://coin-images.coingecko.com/coins/images/9576/small/BUSD.png",
  "TUSD": "https://coin-images.coingecko.com/coins/images/3449/small/tusd.png",
  "USDP": "https://coin-images.coingecko.com/coins/images/6013/small/Pax_Dollar.png",
  "GUSD": "https://coin-images.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png",
  "SUSD": "https://coin-images.coingecko.com/coins/images/5013/small/sUSD.png",
  "CRVUSD": "https://coin-images.coingecko.com/coins/images/30118/small/crvusd.png",
  "MKUSD": "https://coin-images.coingecko.com/coins/images/31519/small/mkUSD.png",
  "GHO": "https://coin-images.coingecko.com/coins/images/30663/small/gho.png",
  "PYUSD": "https://coin-images.coingecko.com/coins/images/31212/small/PYUSD_Logo_%282%29.png",
  "FDUSD": "https://coin-images.coingecko.com/coins/images/31079/small/firstdigitalusd.png",
  "EURC": "https://coin-images.coingecko.com/coins/images/26045/small/euro-coin.png",
  "EURS": "https://coin-images.coingecko.com/coins/images/5164/small/EURS_300x300.png",
  "EURT": "https://coin-images.coingecko.com/coins/images/17385/small/Tether_full_logo_dm.png",
  "AGEUR": "https://coin-images.coingecko.com/coins/images/19479/small/agEUR.png",
  "LINK": "https://coin-images.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
  "UNI": "https://coin-images.coingecko.com/coins/images/12504/small/uni.png",
  "AAVE": "https://coin-images.coingecko.com/coins/images/12645/small/aave-token-round.png",
  "CRV": "https://coin-images.coingecko.com/coins/images/12124/small/Curve.png",
  "COMP": "https://coin-images.coingecko.com/coins/images/10775/small/COMP.png",
  "MKR": "https://coin-images.coingecko.com/coins/images/1364/small/Mark_Maker.png",
  "SNX": "https://coin-images.coingecko.com/coins/images/3406/small/SNX.png",
  "LDO": "https://coin-images.coingecko.com/coins/images/13573/small/Lido_DAO.png",
  "RPL": "https://coin-images.coingecko.com/coins/images/2090/small/rocket_pool_%28RPL%29.png",
  "SUSHI": "https://coin-images.coingecko.com/coins/images/12271/small/512x512_Logo_no_chop.png",
  "BAL": "https://coin-images.coingecko.com/coins/images/11683/small/Balancer.png",
  "JOE": "https://coin-images.coingecko.com/coins/images/17569/small/JoesLogo.png",
  "CAKE": "https://coin-images.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo.png",
  "GMX": "https://coin-images.coingecko.com/coins/images/18323/small/arbit.png",
  "RDNT": "https://coin-images.coingecko.com/coins/images/26536/small/Radiant-Logo-200x200.png",
  "PENDLE": "https://coin-images.coingecko.com/coins/images/15069/small/Pendle_Logo_Normal-03.png",
  "ARB": "https://coin-images.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg",
  "OP": "https://coin-images.coingecko.com/coins/images/25244/small/Optimism.png",
  "MATIC": "https://coin-images.coingecko.com/coins/images/4713/small/polygon.png",
  "POL": "https://coin-images.coingecko.com/coins/images/4713/small/polygon.png",
  "AVAX": "https://coin-images.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  "FTM": "https://coin-images.coingecko.com/coins/images/4001/small/Fantom_round.png",
  "BNB": "https://coin-images.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  "SOL": "https://coin-images.coingecko.com/coins/images/4128/small/solana.png",
  "NEAR": "https://coin-images.coingecko.com/coins/images/10365/small/near.png",
  "ATOM": "https://coin-images.coingecko.com/coins/images/1481/small/cosmos_hub.png",
  "APT": "https://coin-images.coingecko.com/coins/images/26455/small/aptos_round.png",
  "SUI": "https://coin-images.coingecko.com/coins/images/26375/small/sui_asset.png",
  "SEI": "https://coin-images.coingecko.com/coins/images/28205/small/Sei_Logo_-_Transparent.png",
  "INJ": "https://coin-images.coingecko.com/coins/images/12882/small/Secondary_Symbol.png",
  "TIA": "https://coin-images.coingecko.com/coins/images/31967/small/tia.png",
  "STETH": "https://coin-images.coingecko.com/coins/images/13442/small/steth_logo.png",
  "WSTETH": "https://coin-images.coingecko.com/coins/images/18834/small/wstETH.png",
  "RETH": "https://coin-images.coingecko.com/coins/images/20764/small/reth.png",
  "CBETH": "https://coin-images.coingecko.com/coins/images/27008/small/cbeth.png",
  "FRXETH": "https://coin-images.coingecko.com/coins/images/28284/small/frxETH_icon.png",
  "SFRXETH": "https://coin-images.coingecko.com/coins/images/28285/small/sfrxETH_icon.png",
  "EZETH": "https://coin-images.coingecko.com/coins/images/34753/small/ezeth.png",
  "WEETH": "https://coin-images.coingecko.com/coins/images/33033/small/weETH.png",
  "RSETH": "https://coin-images.coingecko.com/coins/images/34490/small/rsETH.png",
  "SWETH": "https://coin-images.coingecko.com/coins/images/30326/small/swETH.png",
  "PUFETH": "https://coin-images.coingecko.com/coins/images/34883/small/pufETH.png",
  "EETH": "https://coin-images.coingecko.com/coins/images/33049/small/ether.fi_eETH.png",
  "OSETH": "https://coin-images.coingecko.com/coins/images/31536/small/osETH.png",
};

// Direct chain image URLs by chainId
const CHAIN_IMAGES: Record<number, string> = {
  1: "https://coin-images.coingecko.com/asset_platforms/images/279/small/ethereum.png",
  10: "https://coin-images.coingecko.com/asset_platforms/images/41/small/optimism.png",
  56: "https://coin-images.coingecko.com/asset_platforms/images/48/small/bnb.png",
  100: "https://coin-images.coingecko.com/asset_platforms/images/11062/small/Gnosis.png",
  137: "https://coin-images.coingecko.com/asset_platforms/images/15/small/polygon.png",
  250: "https://coin-images.coingecko.com/asset_platforms/images/17/small/fantom.png",
  324: "https://coin-images.coingecko.com/asset_platforms/images/121/small/zksync.png",
  1101: "https://coin-images.coingecko.com/asset_platforms/images/122/small/polygon-zkevm.png",
  1284: "https://coin-images.coingecko.com/asset_platforms/images/53/small/moonbeam.png",
  1285: "https://coin-images.coingecko.com/asset_platforms/images/55/small/moonriver.png",
  2222: "https://coin-images.coingecko.com/asset_platforms/images/115/small/kava.png",
  5000: "https://coin-images.coingecko.com/asset_platforms/images/108/small/mantle.png",
  7777777: "https://coin-images.coingecko.com/asset_platforms/images/177/small/zora.png",
  8453: "https://coin-images.coingecko.com/asset_platforms/images/131/small/base.png",
  34443: "https://coin-images.coingecko.com/asset_platforms/images/198/small/mode.png",
  42161: "https://coin-images.coingecko.com/asset_platforms/images/33/small/arbitrum_one.png",
  42220: "https://coin-images.coingecko.com/asset_platforms/images/61/small/Celo.png",
  43114: "https://coin-images.coingecko.com/asset_platforms/images/12/small/avalanche.png",
  59144: "https://coin-images.coingecko.com/asset_platforms/images/135/small/linea.png",
  81457: "https://coin-images.coingecko.com/asset_platforms/images/178/small/blast.png",
  534352: "https://coin-images.coingecko.com/asset_platforms/images/169/small/scroll.png",
  7565164: "https://coin-images.coingecko.com/asset_platforms/images/5/small/solana.png",
  728126428: "https://coin-images.coingecko.com/asset_platforms/images/96/small/tron.png",
  // Additional chains
  169: "https://coin-images.coingecko.com/asset_platforms/images/163/small/manta.png",
  204: "https://coin-images.coingecko.com/asset_platforms/images/211/small/opBNB.png",
  288: "https://coin-images.coingecko.com/asset_platforms/images/77/small/boba.png",
  1088: "https://coin-images.coingecko.com/asset_platforms/images/81/small/metis.png",
  1329: "https://coin-images.coingecko.com/asset_platforms/images/236/small/sei.png",
  4200: "https://coin-images.coingecko.com/asset_platforms/images/170/small/merlin.png",
  13371: "https://coin-images.coingecko.com/asset_platforms/images/267/small/immutable.png",
  17000: "https://coin-images.coingecko.com/asset_platforms/images/279/small/ethereum.png", // Holesky
  80084: "https://coin-images.coingecko.com/asset_platforms/images/287/small/berachain.jpeg", // Berachain Bartio
  80094: "https://coin-images.coingecko.com/asset_platforms/images/287/small/berachain.jpeg", // Berachain
  167000: "https://coin-images.coingecko.com/asset_platforms/images/249/small/taiko.png",
  11155111: "https://coin-images.coingecko.com/asset_platforms/images/279/small/ethereum.png", // Sepolia
};

// Cache for dynamically fetched images
const tokenImageCache = new Map<string, string | null>();
const chainImageCache = new Map<number, string | null>();
let platformsCacheTime = 0;
let platformsCache: Array<{ chain_identifier: number | null; image?: { small?: string; thumb?: string } }> = [];

async function fetchTokenImage(symbol: string): Promise<string | null> {
  const upperSymbol = symbol.toUpperCase();

  // Check static map first
  if (TOKEN_IMAGES[upperSymbol]) {
    return TOKEN_IMAGES[upperSymbol];
  }

  // Check cache
  if (tokenImageCache.has(upperSymbol)) {
    return tokenImageCache.get(upperSymbol) || null;
  }

  try {
    // Fallback to search API
    const searchResponse = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(symbol)}`
    );

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      const coin = searchData.coins?.find(
        (c: { symbol: string }) => c.symbol.toUpperCase() === upperSymbol
      );
      if (coin?.thumb) {
        const imageUrl = coin.thumb.replace('/thumb/', '/small/');
        tokenImageCache.set(upperSymbol, imageUrl);
        return imageUrl;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch image for token ${symbol}:`, error);
  }

  tokenImageCache.set(upperSymbol, null);
  return null;
}

async function fetchChainImage(chainId: number): Promise<string | null> {
  // Check static map first
  if (CHAIN_IMAGES[chainId]) {
    return CHAIN_IMAGES[chainId];
  }

  // Check cache
  if (chainImageCache.has(chainId)) {
    return chainImageCache.get(chainId) || null;
  }

  try {
    // Use cached platforms list if available and fresh (5 min cache)
    const now = Date.now();
    if (now - platformsCacheTime > 5 * 60 * 1000 || platformsCache.length === 0) {
      const response = await fetch(`https://api.coingecko.com/api/v3/asset_platforms`);
      if (response.ok) {
        platformsCache = await response.json();
        platformsCacheTime = now;
      }
    }

    const platform = platformsCache.find((p) => p.chain_identifier === chainId);
    if (platform?.image?.small || platform?.image?.thumb) {
      const imageUrl = platform.image.small || platform.image.thumb;
      chainImageCache.set(chainId, imageUrl);
      return imageUrl;
    }
  } catch (error) {
    console.error(`Failed to fetch image for chain ${chainId}:`, error);
  }

  chainImageCache.set(chainId, null);
  return null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const symbol = searchParams.get("symbol");
  const chainId = searchParams.get("chainId");

  if (type === "token" && symbol) {
    const imageUrl = await fetchTokenImage(symbol);
    return NextResponse.json({ imageUrl });
  }

  if (type === "chain" && chainId) {
    const imageUrl = await fetchChainImage(parseInt(chainId, 10));
    return NextResponse.json({ imageUrl });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
