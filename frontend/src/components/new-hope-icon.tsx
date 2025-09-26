interface NewHopeIconProps {
  size?: number;
  className?: string;
}

export function NewHopeIcon({ size = 40, className = "" }: NewHopeIconProps) {
  return (
    <img
      src="/icon.png"
      alt="New Hope Community Services"
      width={size}
      height={size}
      className={className}
    />
  );
}
