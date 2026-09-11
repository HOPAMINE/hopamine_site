import Image from "next/image";
import Link from "next/link";

type ZimaLogoProps = {
  className?: string;
  priority?: boolean;
  linked?: boolean;
  size?: "default" | "large";
  onClick?: () => void;
};

const sizeClasses = {
  default: "h-auto w-[68px]",
  large: "h-auto w-[102px]",
} as const;

const sizeDimensions = {
  default: { width: 68, height: 26 },
  large: { width: 102, height: 39 },
} as const;

export function ZimaLogo({
  className = "",
  priority = false,
  linked = true,
  size = "default",
  onClick,
}: ZimaLogoProps) {
  const logo = (
    <Image
      src="/zima/logo.png"
      alt="zima"
      width={sizeDimensions[size].width}
      height={sizeDimensions[size].height}
      priority={priority}
      className={sizeClasses[size]}
    />
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Return to home"
        className={`inline-block cursor-pointer border-0 bg-transparent p-0 transition-opacity hover:opacity-80 ${className}`}
      >
        {logo}
      </button>
    );
  }

  if (!linked) {
    return <span className={`inline-block ${className}`}>{logo}</span>;
  }

  return (
    <Link
      href="/"
      aria-label="Return to home"
      className={`inline-block transition-opacity hover:opacity-80 ${className}`}
    >
      {logo}
    </Link>
  );
}
