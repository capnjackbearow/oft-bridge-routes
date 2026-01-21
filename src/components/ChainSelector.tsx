"use client";

import { useState, useRef, useEffect } from "react";
import { Chain } from "@/lib/types";
import { ChainIcon } from "@/hooks/useImages";

interface ChainSelectorProps {
  chains: Chain[];
  availableChainKeys: string[];
  selectedChain: Chain | null;
  onSelect: (chain: Chain) => void;
  disabled?: boolean;
  loading?: boolean;
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ChainSelector({
  chains,
  availableChainKeys,
  selectedChain,
  onSelect,
  disabled,
  loading,
}: ChainSelectorProps) {
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

  const availableChains = chains.filter((c) =>
    availableChainKeys.includes(c.chainKey)
  );

  const filteredChains = availableChains.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.chainKey.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <span className="label">Source Chain</span>
        <div className="skeleton h-[66px] w-full rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="selector">
      <span className="label">Source Chain</span>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`selector-trigger ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""}`}
      >
        {selectedChain ? (
          <div className="token-display">
            <ChainIcon
              chainId={selectedChain.chainId}
              shortName={selectedChain.shortName}
              chainKey={selectedChain.chainKey}
              size={40}
            />
            <div className="token-info">
              <div className="token-name">{selectedChain.name}</div>
            </div>
          </div>
        ) : (
          <span className="placeholder">
            {disabled ? "Select a token first" : "Select source chain"}
          </span>
        )}
        <ChevronIcon className="chevron" />
      </button>

      {isOpen && !disabled && (
        <div className="selector-menu fade-in">
          <div className="selector-search">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chains..."
            />
          </div>
          <div className="selector-list">
            {filteredChains.length === 0 ? (
              <div className="selector-empty">No chains available</div>
            ) : (
              <div className="stagger">
                {filteredChains.map((chain) => (
                  <button
                    key={chain.chainKey}
                    type="button"
                    onClick={() => {
                      onSelect(chain);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`selector-option ${
                      selectedChain?.chainKey === chain.chainKey ? "selected" : ""
                    }`}
                  >
                    <ChainIcon
                      chainId={chain.chainId}
                      shortName={chain.shortName}
                      chainKey={chain.chainKey}
                      size={36}
                    />
                    <div className="details">
                      <div className="name">{chain.name}</div>
                    </div>
                    <span className="badge mono">{chain.chainId}</span>
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
