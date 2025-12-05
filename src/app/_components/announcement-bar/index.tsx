"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cross2Icon } from "@radix-ui/react-icons";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem("announcement-bar-dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("announcement-bar-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div 
      className="relative"
      style={{ 
        backgroundColor: "#DBE9E0"
      }}
    >
      <div className="container mx-auto px-6">
        <div 
          className="flex items-center justify-center py-3 text-sm"
          style={{
            borderBottom: "1px dashed",
            borderBottomColor: "rgba(0, 0, 0, 0.25)"
          }}
        >
          <p className="text-center flex-1" style={{ color: "#49505B" }}>
            LIVE NOW: Retail's First AI Search Commerce Engine. Claim Your Free Access{" "}
            <Link
              href="#faq"
              className="font-medium hover:opacity-80 transition-opacity inline-flex items-center gap-1"
              style={{ color: "#0D3B25" }}
            >
              Learn more
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block"
              >
                <path
                  d="M1 11L11 1M11 1H1M11 1V11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </p>
          <button
            onClick={handleClose}
            className="ml-auto flex-shrink-0 rounded p-1 hover:opacity-70 transition-opacity"
            style={{ color: "#49505B" }}
            aria-label="Close announcement"
          >
            <Cross2Icon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

