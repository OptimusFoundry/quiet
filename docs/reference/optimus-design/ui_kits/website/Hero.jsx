function Hero({ onCommission }) {
  const { Eyebrow, Headline, Button, Stat } = window.DS;
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '96px 32px 64px', maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 48, alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, position: 'relative', zIndex: 1 }}>
        <Eyebrow index="00">Independent software studio · Ottawa</Eyebrow>
        <Headline size="display" lead="Software," accent="crafted in" after="precision" />
        <p style={{ margin: 0, fontSize: 19, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 560, textWrap: 'pretty' }}>
          A small, independent software studio casting tools for the Mac, the iPhone, and the open browser. We treat software the way master craftsmen treat metal — with patience, precision, and the conviction that the object should outlive the trend.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Button arrow href="#work">See the work</Button>
          <Button variant="secondary" onClick={onCommission}>Commission a piece</Button>
        </div>
        <div style={{ display: 'flex', gap: 48, paddingTop: 32, borderTop: '1px solid var(--rule-soft)', flexWrap: 'wrap' }}>
          <Stat value="14" label="Pieces shipped" />
          <Stat value="3.2m" label="Daily users served" />
          <Stat value="100%" label="Independently held" />
        </div>
      </div>
      <div style={{ position: 'relative', aspectRatio: '1 / 1', display: 'grid', placeItems: 'center' }}>
        <div style={{ position: 'absolute', inset: '-10%', background: 'var(--glow-molten)' }} />
        <div style={{ position: 'relative', width: '56%', aspectRatio: '1 / 1', border: '1px dashed var(--muted-2)', borderRadius: 'var(--radius-pill)', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', padding: 16 }}>O·F mark · forge loop<br />supply FoundryMark.svg</span>
        </div>
        <div style={{ position: 'absolute', bottom: 0, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>Optimus · Foundry · Est · MMXXVI</div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [['Cast in', 'focus'], ['Forged for the', 'open browser'], ['Tempered by', 'real users'], ['Built to', 'outlive trends']];
  const row = items.concat(items).concat(items);
  return (
    <div style={{ borderTop: '1px solid var(--ink)', borderBottom: '1px solid var(--rule-soft)', overflow: 'hidden', padding: '24px 0' }}>
      <div style={{ display: 'flex', gap: 64, width: 'max-content', animation: 'of-marquee 60s linear infinite' }}>
        {row.map(([a, b], i) => (
          <span key={i} style={{ fontWeight: 700, fontSize: 30, letterSpacing: '-.035em', whiteSpace: 'nowrap', color: 'var(--ink)' }}>
            {a} <em>{b}</em><span style={{ color: 'var(--rule-soft)', marginLeft: 64 }}>/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
window.Hero = Hero; window.Marquee = Marquee;
