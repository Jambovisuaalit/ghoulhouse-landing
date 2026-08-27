import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'btn',
        `btn-${variant}`,
        {
          'px-4 py-2': size === 'sm',
          'px-6 py-3': size === 'md',
          'px-8 py-4': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}
