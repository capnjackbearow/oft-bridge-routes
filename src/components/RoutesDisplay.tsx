"use client";

import { Token, Chain } from "@/lib/types";
import { ChainIcon } from "@/hooks/useImages";

interface RoutesDisplayProps {
  routes: Token[];
  chains: Chain[];
  sourceChain: Chain | null;
  tokenSymbol: string;
  loading?: boolean;
}

function getChainInfo(chainKey: string, chains: Chain[]): Chain | undefined {
  return chains.find((c) => c.chainKey === chainKey);
}

function truncateAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function RoutesDisplay({
  routes,
  chains,
  sourceChain,
  tokenSymbol,
  loading,
}: RoutesDisplayProps) {
  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="skeleton h-6 w-32 rounded-lg"></div>
          <div className="skeleton h-6 w-20 rounded-lg"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-[72px] w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!sourceChain) {
    return (
      <div className="empty-state">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p>Select a token and source chain to discover available bridging destinations.</p>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="empty-state">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <p>No bridging routes available for this token and chain combination.</p>
      </div>
    );
  }

  // Group routes by token symbol
  const groupedBySymbol: Record<string, Token[]> = {};
  for (const route of routes) {
    const key = route.symbol;
    if (!groupedBySymbol[key]) {
      groupedBySymbol[key] = [];
    }
    groupedBySymbol[key].push(route);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-medium text-white">Destinations</h2>
        <span className="tag tag-stargate">{routes.length} routes</span>
      </div>

      {/* Routes List */}
      <div className="space-y-6">
        {Object.entries(groupedBySymbol).map(([symbol, tokens]) => (
          <div key={symbol}>
            {/* Group header for different output tokens */}
            {symbol !== tokenSymbol && (
              <div className="flex items-center gap-3 mb-3 px-1">
                <span className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider">
                  Receives
                </span>
                <span className="tag tag-default">{symbol}</span>
              </div>
            )}

            {/* Route items */}
            <div className="space-y-2 stagger">
              {tokens.map((route) => {
                const chainInfo = getChainInfo(route.chainKey, chains);
                return (
                  <div key={`${route.chainKey}-${route.address}`} className="route-item">
                    <div className="flex items-center gap-4">
                      <ChainIcon
                        chainId={chainInfo?.chainId}
                        shortName={chainInfo?.shortName}
                        chainKey={route.chainKey}
                        size={40}
                      />
                      <div>
                        <div className="chain-name">
                          {chainInfo?.name || route.chainKey}
                        </div>
                        <div className="chain-address">
                          {truncateAddress(route.address)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="chain-id">
                        Chain {chainInfo?.chainId || "—"}
                      </div>
                      {route.price?.usd && (
                        <div className="text-[11px] text-[var(--text-tertiary)] mt-1 mono">
                          ${route.price.usd.toFixed(4)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
