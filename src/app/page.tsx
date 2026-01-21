"use client";

import { useEffect, useState, useCallback } from "react";
import { TokenSelector } from "@/components/TokenSelector";
import { ChainSelector } from "@/components/ChainSelector";
import { RoutesDisplay } from "@/components/RoutesDisplay";
import { GroupedToken, Chain, Token } from "@/lib/types";

export default function Home() {
  const [tokens, setTokens] = useState<GroupedToken[]>([]);
  const [chains, setChains] = useState<Chain[]>([]);
  const [routes, setRoutes] = useState<Token[]>([]);

  const [selectedToken, setSelectedToken] = useState<GroupedToken | null>(null);
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);

  const [loadingTokens, setLoadingTokens] = useState(true);
  const [loadingChains, setLoadingChains] = useState(true);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  useEffect(() => {
    async function fetchTokens() {
      try {
        const response = await fetch("/api/tokens");
        const data = await response.json();
        setTokens(data.tokens || []);
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
      } finally {
        setLoadingTokens(false);
      }
    }
    fetchTokens();
  }, []);

  useEffect(() => {
    async function fetchChains() {
      try {
        const response = await fetch("/api/chains");
        const data = await response.json();
        setChains(data.chains || []);
      } catch (error) {
        console.error("Failed to fetch chains:", error);
      } finally {
        setLoadingChains(false);
      }
    }
    fetchChains();
  }, []);

  const fetchRoutes = useCallback(async () => {
    if (!selectedToken || !selectedChain) {
      setRoutes([]);
      return;
    }

    const tokenOnChain = selectedToken.chains.find(
      (c) => c.chainKey === selectedChain.chainKey
    );

    if (!tokenOnChain) {
      setRoutes([]);
      return;
    }

    setLoadingRoutes(true);
    try {
      const response = await fetch(
        `/api/routes?srcChainKey=${selectedChain.chainKey}&srcToken=${tokenOnChain.address}`
      );
      const data = await response.json();
      // Filter to only include routes where output token matches input token
      const filteredRoutes = (data.routes || []).filter(
        (route: Token) => route.symbol === selectedToken.symbol
      );
      setRoutes(filteredRoutes);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
      setRoutes([]);
    } finally {
      setLoadingRoutes(false);
    }
  }, [selectedToken, selectedChain]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const handleTokenSelect = (token: GroupedToken) => {
    setSelectedToken(token);
    setSelectedChain(null);
    setRoutes([]);
  };

  const handleChainSelect = (chain: Chain) => {
    setSelectedChain(chain);
  };

  const availableChainKeys = selectedToken?.chains.map((c) => c.chainKey) || [];

  return (
    <main className="min-h-screen py-16 lg:py-24">
      <div className="container-narrow">
        {/* Header */}
        <header className="mb-16 fade-in">
          <div className="flex items-center gap-3 mb-6">
            <img
              src="https://stargate.finance/static/logo-wide-dark.svg"
              alt="Stargate"
              className="h-6 opacity-80"
            />
          </div>
          <h1 className="text-3xl lg:text-4xl text-white mb-4">
            OFT Bridge Routes
          </h1>
          <p className="text-[#d4d4d4] max-w-md leading-relaxed">
            Discover available cross-chain bridging destinations for OFTs.
          </p>
        </header>

        {/* Selection Panel */}
        <section className="panel panel-padded mb-8 fade-in relative z-20" style={{ animationDelay: "0.1s" }}>
          <div className="grid grid-cols-1 gap-8">
            <TokenSelector
              tokens={tokens}
              selectedToken={selectedToken}
              onSelect={handleTokenSelect}
              loading={loadingTokens}
            />
            <ChainSelector
              chains={chains}
              availableChainKeys={availableChainKeys}
              selectedChain={selectedChain}
              onSelect={handleChainSelect}
              disabled={!selectedToken}
              loading={loadingChains}
            />
          </div>

          {/* Current Selection Summary - inside panel to avoid overlap */}
          {selectedToken && selectedChain && (
            <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-[#d4d4d4]">Bridging</span>
                  <span className="text-stargate font-medium">{selectedToken.symbol}</span>
                  <span className="text-[#a3a3a3]">from</span>
                  <span className="text-white">{selectedChain.name}</span>
                </div>
                <span className="text-[11px] text-[#a3a3a3] mono">
                  {selectedToken.chains.find((c) => c.chainKey === selectedChain.chainKey)?.address.slice(0, 10)}...
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Zen Line */}
        <div className="zen-line relative z-10" />

        {/* Routes Display */}
        <section className="fade-in relative z-10" style={{ animationDelay: "0.2s" }}>
          <RoutesDisplay
            routes={routes}
            chains={chains}
            sourceChain={selectedChain}
            tokenSymbol={selectedToken?.symbol || ""}
            loading={loadingRoutes}
          />
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[11px] text-[#a3a3a3]">Powered by</span>
            <img
              src="https://stargate.finance/static/logo-mobile-dark.svg"
              alt="Stargate"
              className="h-4 opacity-60"
            />
          </div>
        </footer>
      </div>
    </main>
  );
}
