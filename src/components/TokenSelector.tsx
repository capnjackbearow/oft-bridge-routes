"use client";

import { useState, useRef, useEffect } from "react";
import { GroupedToken } from "@/lib/types";
import { TokenIcon } from "@/hooks/useImages";

interface TokenSelectorProps {
  tokens: GroupedToken[];
  selectedToken: GroupedToken | null;
  onSelect: (token: GroupedToken) => void;
  loading?: boolean;
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function TokenSelector({
  tokens,
  selectedToken,
  onSelect,
  loading,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredTokens = tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <span className="label">Token</span>
        <div className="skeleton h-[66px] w-full rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="selector">
      <span className="label">Token</span>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`selector-trigger ${isOpen ? "open" : ""}`}
      >
        {selectedToken ? (
          <div className="token-display">
            <TokenIcon symbol={selectedToken.symbol} size={40} />
            <div className="token-info">
              <div className="token-name">{selectedToken.symbol}</div>
            </div>
          </div>
        ) : (
          <span className="placeholder">Select a token</span>
        )}
        <ChevronIcon className="chevron" />
      </button>

      {isOpen && (
        <div className="selector-menu fade-in">
          <div className="selector-search">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tokens..."
            />
          </div>
          <div className="selector-list">
            {filteredTokens.length === 0 ? (
              <div className="selector-empty">No tokens found</div>
            ) : (
              <div className="stagger">
                {filteredTokens.slice(0, 50).map((token) => (
                  <button
                    key={token.symbol}
                    type="button"
                    onClick={() => {
                      onSelect(token);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`selector-option ${
                      selectedToken?.symbol === token.symbol ? "selected" : ""
                    }`}
                  >
                    <TokenIcon symbol={token.symbol} size={36} />
                    <div className="details">
                      <div className="name">{token.symbol}</div>
                      <div className="meta">{token.name}</div>
                    </div>
                    <span className="badge">{token.chains.length} chains</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
