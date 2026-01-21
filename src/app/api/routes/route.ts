import { NextRequest, NextResponse } from "next/server";

interface Token {
  isBridgeable: boolean;
  chainKey: string;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  price?: { usd: number };
}

// Dummy address for quote validation
const DUMMY_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

interface QuoteResult {
  route: string | null;
  error: { message: string } | null;
}

async function isRouteWired(
  srcChainKey: string,
  srcToken: string,
  dstChainKey: string,
  dstToken: string
): Promise<boolean> {
  try {
    const quoteUrl = new URL("https://stargate.finance/api/v1/quotes");
    quoteUrl.searchParams.set("srcChainKey", srcChainKey);
    quoteUrl.searchParams.set("srcToken", srcToken);
    quoteUrl.searchParams.set("dstChainKey", dstChainKey);
    quoteUrl.searchParams.set("dstToken", dstToken);
    quoteUrl.searchParams.set("srcAmount", "1000000000000000000"); // 1 token (18 decimals)
    quoteUrl.searchParams.set("dstAmountMin", "0");
    quoteUrl.searchParams.set("srcAddress", DUMMY_ADDRESS);
    quoteUrl.searchParams.set("dstAddress", DUMMY_ADDRESS);

    const response = await fetch(quoteUrl.toString());
    const data = await response.json();

    // Route is wired if we get at least one quote with a valid route and no error
    if (!data.quotes || data.quotes.length === 0) {
      return false;
    }

    // Check if any quote has a valid route (non-null route and null error)
    return data.quotes.some(
      (quote: QuoteResult) => quote.route !== null && quote.error === null
    );
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const srcChainKey = searchParams.get("srcChainKey");
  const srcToken = searchParams.get("srcToken");

  if (!srcChainKey || !srcToken) {
    return NextResponse.json(
      { error: "srcChainKey and srcToken are required" },
      { status: 400 }
    );
  }

  try {
    // Fetch available destination tokens from Stargate
    const response = await fetch(
      `https://stargate.finance/api/v1/tokens?srcChainKey=${srcChainKey}&srcToken=${srcToken}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch routes");
    }

    const data = await response.json();
    const potentialRoutes = (data.tokens || []).filter(
      (t: Token) => t.isBridgeable && t.chainKey !== srcChainKey
    );

    // Validate each route by checking if quotes are available
    const validationResults = await Promise.all(
      potentialRoutes.map(async (token: Token) => {
        const isWired = await isRouteWired(
          srcChainKey,
          srcToken,
          token.chainKey,
          token.address
        );
        return { token, isWired };
      })
    );

    // Only return routes that are actually wired
    const wiredRoutes = validationResults
      .filter((result) => result.isWired)
      .map((result) => result.token);

    return NextResponse.json({ routes: wiredRoutes });
  } catch (error) {
    console.error("Error fetching routes:", error);
    return NextResponse.json(
      { error: "Failed to fetch routes" },
      { status: 500 }
    );
  }
}
