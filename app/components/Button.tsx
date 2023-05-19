import { Link } from '@remix-run/react';

type BaseProps = {
  /**
   * The variant (color scheme) of the button.
   */
  variant?: 'normal' | 'primary' | 'success';

  /**
   * The size of the button.
   */
  size?: 'small' | 'normal';

  /**
   * The type of the button.
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * The children of the button.
   */
  children: React.ReactNode;

  /**
   * The class name of the button.
   */
  className?: string;
};

type ClickHandlerProps = BaseProps & {
  /**
   * The click handler of the button.
   */
  onClick?: () => void;

  /**
   * An anchor element to link to.
   */
  href?: never;
};

type AnchorProps = BaseProps & {
  /**
   * The click handler of the button.
   */
  onClick?: never;

  /**
   * An anchor element to link to.
   */
  href?: string;
};

type Props = ClickHandlerProps | AnchorProps;

export default function Button({
  className = '',
  children,
  onClick,
  href,
  type = 'button',
  variant = 'normal',
  size = 'normal',
}: Props) {
  const classes = `${className} transition focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 ${
    variant === 'normal'
      ? 'bg-zinc-200 text-slate-800 hover:bg-zinc-300'
      : variant === 'primary'
      ? 'bg-cyan-200 text-cyan-900 hover:bg-cyan-400'
      : 'bg-zinc-200 text-slate-800 hover:bg-emerald-300 hover:text-emerald-900'
  }
  ${size === 'small' ? 'px-4 py-2' : 'px-8 py-4'}
  ${href ? 'block text-center' : ''}`;

  if (href) {
    return (
      <Link className={classes} to={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
