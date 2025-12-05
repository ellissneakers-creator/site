"use client";

import { BaseHubImage } from "basehub/next-image";

type Company = {
  _title: string;
  url: string | null;
  image: {
    url: string;
  } | null;
};

function CompanyLogo({ company }: { company: Company }) {
  return (
    <figure className="flex h-16 shrink-0 items-center px-4 py-3 lg:px-6 lg:py-4">
      <BaseHubImage
        alt={company._title}
        className="w-24 lg:w-32"
        height={20}
        src={company.image!.url}
        width={32}
      />
    </figure>
  );
}

export function CompaniesMarquee({ companies }: { companies: Company[] }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .marquee-track-inner {
          animation: marquee-scroll 30s linear infinite;
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          /* Force consistent rendering across browsers */
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
        .marquee-wrapper:hover .marquee-track-inner {
          animation-play-state: paused;
        }
        /* Safari-specific fixes */
        @supports (-webkit-appearance: none) {
          .marquee-track-inner {
            -webkit-transform: translateZ(0);
            transform: translate3d(0, 0, 0);
          }
        }
      `}} />
      <div className="marquee-wrapper relative w-full self-stretch overflow-hidden">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-[100px] bg-gradient-to-r from-surface-primary to-transparent dark:from-dark-surface-primary" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-[100px] bg-gradient-to-l from-surface-primary to-transparent dark:from-dark-surface-primary" />
        
        <div className="marquee-track-inner flex flex-row">
          {/* First set of logos */}
          <div className="flex flex-row items-center gap-4 px-2 lg:gap-6 lg:px-3 shrink-0">
            {companies.map((company) => (
              <CompanyLogo key={company._title} company={company} />
            ))}
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="flex flex-row items-center gap-4 px-2 lg:gap-6 lg:px-3 shrink-0" aria-hidden="true">
            {companies.map((company) => (
              <CompanyLogo key={`dup-${company._title}`} company={company} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

