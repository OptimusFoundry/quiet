import React from 'react';
import { Wordmark } from '../core/Wordmark.jsx';
import { Button } from '../core/Button.jsx';
import './NavBar.scss';

function NavLink({ href, current, children }) {
  return <a href={href} aria-current={current ? 'page' : undefined} className="q-nav-bar__link">{children}</a>;
}

export function NavBar({ links = [], cta = 'Start a project', ctaHref = '#contact', onCta, mark, label = 'Main', homeLabel, className, style }) {
  return (
    <nav aria-label={label} className={className ? 'q-nav-bar ' + className : 'q-nav-bar'} style={style}>
      <a href="#" aria-label={homeLabel} className="q-nav-bar__home">{mark}<Wordmark size="nav" /></a>
      <div className="q-nav-bar__links">
        {links.map(l => <NavLink key={l.label} href={l.href} current={l.current}>{l.label}</NavLink>)}
      </div>
      <Button size="sm" arrow href={onCta ? undefined : ctaHref} onClick={onCta}>{cta}</Button>
    </nav>
  );
}
