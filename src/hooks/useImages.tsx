"use client";

import { getTokenImage, getChainImage } from "@/lib/images";

// Component to render token icon with fallback
interface TokenIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

export function TokenIcon({ symbol, size = 40, className = "" }: TokenIconProps) {
  const imageUrl = getTokenImage(symbol);

  if (!imageUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--surface-3)] border-2 border-[var(--gray-600)] rounded-full text-xs font-semibold text-[var(--text-secondary)] ${className}`}
        style={{ width: size, height: size }}
      >
        {symbol.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={symbol}
      className={`rounded-full bg-[var(--surface-3)] object-cover ${className}`}
      style={{ width: size, height: size }}
      onError={(e) => {
        // Hide image and show fallback
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  );
}

// Component to render chain icon with fallback
interface ChainIconProps {
  chainId?: number;
  shortName?: string;
  chainKey: string;
  size?: number;
  className?: string;
}

export function ChainIcon({ chainId, shortName, chainKey, size = 40, className = "" }: ChainIconProps) {
  const imageUrl = chainId ? getChainImage(chainId) : undefined;
  const fallbackText = shortName?.slice(0, 2) || chainKey.slice(0, 2);

  if (!imageUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--surface-3)] border-2 border-[var(--gray-600)] rounded-full text-xs font-semibold text-[var(--text-secondary)] uppercase ${className}`}
        style={{ width: size, height: size }}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={chainKey}
      className={`rounded-full bg-[var(--surface-3)] object-cover ${className}`}
      style={{ width: size, height: size }}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  );
}
