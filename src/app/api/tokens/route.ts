import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://stargate.finance/api/v1/tokens", {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tokens");
    }

    const data = await response.json();
    const tokens = data.tokens || [];

    // Filter to only bridgeable tokens and group by symbol
    const bridgeableTokens = tokens.filter((t: { isBridgeable: boolean }) => t.isBridgeable);

    // Group tokens by symbol to create a list of unique OFTs
    const groupedTokens: Record<string, {
      symbol: string;
      name: string;
      chains: { chainKey: string; address: string; decimals: number }[];
    }> = {};

    for (const token of bridgeableTokens) {
      const key = token.symbol;
      if (!groupedTokens[key]) {
        groupedTokens[key] = {
          symbol: token.symbol,
          name: token.name,
          chains: [],
        };
      }
      groupedTokens[key].chains.push({
        chainKey: token.chainKey,
        address: token.address,
        decimals: token.decimals,
      });
    }

    // Convert to array and sort by number of chains (most popular first)
    const sortedTokens = Object.values(groupedTokens)
      .filter((t) => t.chains.length > 1) // Only include tokens available on multiple chains
      .sort((a, b) => b.chains.length - a.chains.length);

    return NextResponse.json({ tokens: sortedTokens });
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return NextResponse.json(
      { error: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}
