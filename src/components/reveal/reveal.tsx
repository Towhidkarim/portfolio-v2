import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

export type RevealVariant = 'rise' | 'curtain' | 'draw';

type RevealProps<T extends ElementType> = {
  as?: T;
  variant?: RevealVariant;
  /** seconds */
  delay?: number;
  /** stagger position inside a group (60 ms each, capped at 0.36 s) */
  index?: number;
  /** above the fold: play on first paint without waiting for the observer */
  immediate?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

const STAGGER = 0.06;
const STAGGER_CAP = 0.36;

/**
 * Scroll/Load reveal driven entirely by CSS (src/styles/reveal.css) and one page
 * observer (reveal-init.ts). Content is visible without JavaScript. Do not use
 * on an element that has its own hover transform/transition: wrap it.
 */
export function Reveal<T extends ElementType = 'div'>({
  as,
  variant = 'rise',
  delay = 0,
  index = 0,
  immediate = false,
  className,
  children,
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? 'div') as ElementType;
  const d = delay + Math.min(index * STAGGER, STAGGER_CAP);
  const attrs = {
    'data-reveal': variant,
    // server-set so the first paint animates with no script
    ...(immediate ? { 'data-in': '', 'data-immediate': '' } : {}),
    style: { '--d': `${d}s` } as CSSProperties,
    className: cn(className),
    // the observer adds data-in before hydration
    suppressHydrationWarning: true,
    ...rest,
  };
  return variant === 'curtain' ? (
    <Tag {...attrs}>
      <span className='rv-c'>{children}</span>
    </Tag>
  ) : (
    <Tag {...attrs}>{children}</Tag>
  );
}
