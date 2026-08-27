import Image from 'next/image';
import clsx from 'clsx';

interface LogoProps {
  compact?: boolean;
  className?: string;
}

export default function Logo({ compact = false, className }: LogoProps) {
  const src = compact
    ? '/brand/ghoulhouse-micro-primary.svg'
    : '/brand/ghoulhouse-lockup-horizontal-primary.svg';

  return (
    <Image
      src={src}
      alt="GhoulHouse"
      width={compact ? 300 : 394}
      height={compact ? 300 : 112}
      priority={!compact}
      className={clsx('block h-auto', compact ? 'w-9' : 'w-[158px] lg:w-[180px]', className)}
    />
  );
}
