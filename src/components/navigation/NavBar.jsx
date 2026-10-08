import React from 'react';
import { Wordmark } from '../core/Wordmark.jsx';
import { Button } from '../core/Button.jsx';

function NavLink({ href, current, children }) {
  const [h, setH] = React.useState(false);
  return <a href={href} aria-current={current ? 'page' : undefined} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    onFocus={e => e.currentTarget.matches(':focus-visible') && setH(true)} onBlur={() => setH(false)}
    style={{ fontSize: 15, fontWeight: 500, color: h ? 'var(--molten)' : 'var(--ink)', textDecoration: 'none', transition: 'color var(--dur-hover) var(--ease-soft)' }}>{children}</a>;
}

export function NavBar({ links = [], cta = 'Start a project', ctaHref = '#contact', onCta, mark, label = 'Main', homeLabel, style }) {
  return (
    <nav aria-label={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px 32px', padding: '16px 32px', background: 'var(--paper)',
      borderBottom: '1px solid var(--rule-soft)', ...style }}>
      <a href="#" aria-label={homeLabel} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>{mark}<Wordmark size="nav" /></a>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {links.map(l => <NavLink key={l.label} href={l.href} current={l.current}>{l.label}</NavLink>)}
      </div>
      <Button size="sm" arrow href={onCta ? undefined : ctaHref} onClick={onCta}>{cta}</Button>
    </nav>
  );
}
