"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

interface ShareBarProps {
  title?: string;
  verdict?: string;
}

export function ShareBar({
  title = "Share this comparison",
  verdict,
}: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "https://takehomenorth.com";
  };

  const shareText = verdict
    ? `${verdict} via TakeHome North:`
    : "Compare US vs Canada take-home salary and cost of living on TakeHome North:";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "share_clicked", {
          method: "copy_link",
        });
      }
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "TakeHome North Comparison",
          text: shareText,
          url: getShareUrl(),
        });
        if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
          (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "share_clicked", {
            method: "native",
          });
        }
      } catch {
        // User cancelled or share aborted
      }
    } else {
      await handleCopy();
    }
  };

  const getTwitterShareUrl = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(shareText);
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  };

  const getLinkedInShareUrl = () => {
    const url = encodeURIComponent(getShareUrl());
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  };

  const getRedditShareUrl = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(shareText);
    return `https://reddit.com/submit?url=${url}&title=${text}`;
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-center gap-2">
        <Share2 className="w-4 h-4 text-[var(--accent)]" />
        <span className="text-sm font-semibold text-[var(--text)]">{title}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--win)]" />
              <span className="text-[var(--win)]">Copied to clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy link</span>
            </>
          )}
        </button>

        {/* Native Web Share (shown on mobile or when supported) */}
        {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[var(--accent)] text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        )}

        {/* Twitter / X */}
        <a
          href={getTwitterShareUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
              (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "share_clicked", {
                method: "twitter",
              });
            }
          }}
          className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors"
        >
          X (Twitter)
        </a>

        {/* LinkedIn */}
        <a
          href={getLinkedInShareUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
              (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "share_clicked", {
                method: "linkedin",
              });
            }
          }}
          className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors"
        >
          LinkedIn
        </a>

        {/* Reddit */}
        <a
          href={getRedditShareUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
              (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "share_clicked", {
                method: "reddit",
              });
            }
          }}
          className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--text)] transition-colors"
        >
          Reddit
        </a>
      </div>
    </div>
  );
}
