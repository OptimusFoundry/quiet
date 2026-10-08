import React from 'react';
import { Wordmark } from '../core/Wordmark.jsx';
import { Button } from '../core/Button.jsx';

function NavLink({ href, children }) {
  const [h, setH] = React.useState(false);
  return <a href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ fontSize: 15, fontWeight: 500, color: h ? 'var(--molten)' : 'var(--ink)', textDecoration: 'none', transition: 'color var(--dur-hover) var(--ease-soft)' }}>{children}</a>;
}

export function NavBar({ links = [], cta = 'Start a project', ctaHref = '#contact', onCta, mark, style }) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px 32px', padding: '16px 32px', background: 'var(--paper)',
      borderBottom: '1px solid var(--rule-soft)', ...style }}>
      <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>{mark}<Wordmark size="nav" /></a>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {links.map(l => <NavLink key={l.label} href={l.href}>{l.label}</NavLink>)}
      </div>
      <Button size="sm" arrow href={onCta ? undefined : ctaHref} onClick={onCta}>{cta}</Button>
    </nav>
  );
}
