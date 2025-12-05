import { Pump } from "basehub/react-pump";
import { fragmentOn } from "basehub";
import colors from "tailwindcss/colors";
import { parse, oklch, rgb } from "culori";

export const themeFragment = fragmentOn("Theme", { accent: true, grayScale: true });

export type BaseHubTheme = fragmentOn.infer<typeof themeFragment>;

const CONTRAST_WARNING_COLORS: (keyof typeof colors)[] = [
  "amber",
  "cyan",
  "green",
  "lime",
  "yellow",
];

// Base accent color in OKLCH format
const BASE_ACCENT_COLOR = "oklch(37.8% 0.077 168.94)";

function anyColorToRgb(color: string) {
  const parsed = parse(color);
  if (!parsed) throw new Error(`Invalid color format: ${color}`);
  const converted = rgb(parsed);
  if (!converted) throw new Error(`Invalid color format: ${color}`);
  return {
    r: Math.round(converted.r * 255),
    g: Math.round(converted.g * 255),
    b: Math.round(converted.b * 255),
  };
}

function generateAccentColorScale(baseColor: string): Record<string, string> {
  const parsed = parse(baseColor);
  if (!parsed) throw new Error(`Invalid base color: ${baseColor}`);
  
  // Convert to OKLCH if not already
  const oklchColor = oklch(parsed);
  if (!oklchColor || typeof oklchColor.l !== "number" || typeof oklchColor.c !== "number" || typeof oklchColor.h !== "number") {
    throw new Error(`Invalid base color: ${baseColor}`);
  }

  const baseL = oklchColor.l; // Already in 0-1 range
  const baseC = oklchColor.c;
  const baseH = oklchColor.h;

  // Generate color scale similar to Tailwind's approach
  // Lightness values for each shade (0-1 scale)
  const lightnessMap: Record<string, number> = {
    "50": 0.97,
    "100": 0.94,
    "200": 0.88,
    "300": 0.78,
    "400": 0.65,
    "500": baseL, // Base color lightness (already 0-1)
    "600": baseL - 0.08,
    "700": baseL - 0.15,
    "800": baseL - 0.22,
    "900": baseL - 0.28,
    "950": baseL - 0.35,
  };

  const colorScale: Record<string, string> = {};

  Object.entries(lightnessMap).forEach(([key, lightness]) => {
    // Clamp lightness between 0 and 1
    const clampedL = Math.max(0, Math.min(1, lightness));
    
    // Adjust chroma for very light or very dark shades
    let adjustedC = baseC;
    if (clampedL > 0.9) {
      // Very light shades: reduce chroma
      adjustedC = baseC * 0.3;
    } else if (clampedL < 0.2) {
      // Very dark shades: reduce chroma slightly
      adjustedC = baseC * 0.7;
    }

    // Format as OKLCH string
    const color = `oklch(${(clampedL * 100).toFixed(1)}% ${adjustedC.toFixed(3)} ${baseH.toFixed(2)})`;

    colorScale[key] = color;
  });

  return colorScale;
}

export function BaseHubThemeProvider() {
  return (
    <Pump queries={[{ site: { settings: { theme: themeFragment } } }]}>
      {async ([data]) => {
        "use server";
        // Generate accent color scale from the base OKLCH color
        const accent = generateAccentColorScale(BASE_ACCENT_COLOR);
        const grayScale = colors[data.site.settings.theme.grayScale];

        const css = Object.entries(accent).map(([key, value]) => {
          const rgb = anyColorToRgb(value);

          return `--accent-${key}: ${value}; --accent-rgb-${key}: ${rgb.r}, ${rgb.g}, ${rgb.b};`;
        });

        Object.entries(grayScale).forEach(([key, value]) => {
          const rgb = anyColorToRgb(value);

          css.push(
            `--grayscale-${key}: ${value}; --grayscale-rgb-${key}: ${rgb.r}, ${rgb.g}, ${rgb.b};`,
          );
        });
        // Use white text for better contrast with the dark green accent color
        css.push(`--text-on-accent: ${colors.gray[50]};`);

        return (
          <style>{`
      :root {
        ${css.join("\n")}
      }
      `}</style>
        );
      }}
    </Pump>
  );
}
