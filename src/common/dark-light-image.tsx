import { type DarkLightImageFragment } from "@/lib/basehub/fragments";
import clsx from "clsx";
import { BaseHubImage } from "basehub/next-image";
import type { ImageProps } from "next/image";

type DarkLightImageProps = DarkLightImageFragment &
  Omit<ImageProps, "src" | "alt"> & {
    alt?: string;
    withPlaceholder?: boolean;
  };

function isSvg(url: string) {
  return url.toLowerCase().endsWith('.svg');
}

export function DarkLightImage({
  alt,
  dark,
  light,
  className,
  width,
  height,
  withPlaceholder,
  ...props
}: DarkLightImageProps) {
  const lightIsSvg = isSvg(light.url);
  const darkIsSvg = dark ? isSvg(dark.url) : false;

  return (
    <>
      {dark ? (
        darkIsSvg ? (
          // Use regular img for SVG to keep it crisp - let CSS control size
          <img
            alt={dark.alt ?? alt ?? ""}
            className={clsx("hidden dark:block", className)}
            src={dark.url}
          />
        ) : (
          <BaseHubImage
            alt={dark.alt ?? alt ?? ""}
            className={clsx("hidden dark:block", className)}
            height={height ?? dark.height}
            src={dark.url}
            width={width ?? dark.width}
            {...props}
            {...(withPlaceholder && dark.blurDataURL
              ? {
                  placeholder: "blur",
                  blurDataURL: dark.blurDataURL,
                }
              : {})}
          />
        )
      ) : null}
      {lightIsSvg ? (
        // Use regular img for SVG to keep it crisp - let CSS control size
        <img
          alt={light.alt ?? alt ?? ""}
          className={clsx(dark && "dark:hidden", className)}
          src={light.url}
        />
      ) : (
        <BaseHubImage
          alt={light.alt ?? alt ?? ""}
          className={clsx(dark && "dark:hidden", className)}
          height={height ?? light.height}
          src={light.url}
          width={width ?? light.width}
          {...props}
          {...(withPlaceholder && light.blurDataURL
            ? {
                placeholder: "blur",
                blurDataURL: light.blurDataURL,
              }
            : {})}
        />
      )}
    </>
  );
}

export function DarkLightImageAutoscale(props: DarkLightImageProps) {
  const [aspectRatioWidth, aspectRatioHeight] = props.light.aspectRatio.split("/").map(Number);
  const aspectRatio = (aspectRatioWidth ?? 0) / (aspectRatioHeight ?? 0);
  let logoStyle;

  switch (true) {
    case aspectRatio <= 1.2:
      logoStyle = "square";
      break;
    case aspectRatio < 1.4:
      logoStyle = "4/3";
      break;
    case aspectRatio < 4:
      logoStyle = "portrait";
      break;
    default:
      logoStyle = "landscape";
      break;
  }

  return (
    <DarkLightImage
      priority
      alt="logo"
      quality={100}
      className="w-auto h-4 max-w-[70px] object-contain"
      style={{
        aspectRatio: props.light.aspectRatio,
      }}
      {...props}
    />
  );
}
