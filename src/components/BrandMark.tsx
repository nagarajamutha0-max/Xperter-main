import { Link } from "@tanstack/react-router";
import { APP_NAME } from "@/lib/config";

export function BrandIcon({ size = 56 }: { size?: number }) {
  const iconSize = Math.round(size * 0.68);
  return (
    <div
      className="glass relative flex items-center justify-center overflow-hidden rounded-full border border-glass-edge shadow-[inset_0_1px_1px_rgba(255,255,255,0.28)]"
      style={{ width: size, height: size }}
    >
      <img
        src="/xperter-logo.svg"
        alt="Xperter logo"
        referrerPolicy="no-referrer"
        width={iconSize}
        height={iconSize}
        className="select-none object-contain transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

export function BrandMark() {
  return (
    <Link to="/" className="group flex items-center gap-2.5 text-foreground">
      <BrandIcon size={36} />
      <span className="text-sm font-medium tracking-tight">{APP_NAME}</span>
    </Link>
  );
}
