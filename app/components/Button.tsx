type Props = JSX.IntrinsicElements['button'] & {
  /**
   * The variant (color scheme) of the button.
   */
  variant?: 'normal' | 'primary' | 'success';

  /**
   * The size of the button.
   */
  size?: 'small' | 'normal';
};

export default function Button({
  className = '',
  children,
  onClick,
  type = 'button',
  variant = 'normal',
  size = 'normal',
}: Props) {
  return (
    <button
      className={` ${className} transition focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 ${
        variant === 'normal'
          ? 'bg-zinc-200 text-slate-800 hover:bg-zinc-300'
          : variant === 'primary'
          ? 'bg-cyan-200 text-cyan-900 hover:bg-cyan-400'
          : 'bg-zinc-200 text-slate-800 hover:bg-emerald-300 hover:text-emerald-900'
      }
        ${size === 'small' ? 'px-4 py-2' : 'px-8 py-4'}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
