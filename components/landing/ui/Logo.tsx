import Image from "next/image";
import Link from "next/link";

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <Image
      src="/logo-mark.png"
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-[8px]"
    />
  );
}

/** Two-tone wordmark, mirroring DevKit Market's "Dev<em>Kit</em> Market". */
export function Logo({
  byline = false,
  href = "/",
  onClick,
}: {
  byline?: boolean;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className="group flex items-center gap-2.5 text-fg">
      <LogoMark />
      <span className="text-[15px] font-medium tracking-tight">
        AI <em className="text-brand-soft not-italic">Swarm</em>
      </span>
      {byline && (
        <span className="hidden font-code text-[10px] text-dim sm:inline">by DevKit Market</span>
      )}
    </Link>
  );
}
