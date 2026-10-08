const wrap = { maxWidth: 1280, margin: '0 auto', padding: '0 32px' };

function SectionHead({ index, label, lead, accent, after, children }) {
  const { Eyebrow, Headline } = window.DS;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 48, alignItems: 'end', marginBottom: 64 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Eyebrow index={index}>{label}</Eyebrow>
        <Headline size="h2" lead={lead} accent={accent} after={after} />
      </div>
      {children && <div style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--ink-2)', textWrap: 'pretty' }}>{children}</div>}
    </div>
  );
}

function Studio() {
  const { Card } = window.DS;
  const principles = [
    ['Make it', 'hold up in the hand', 'Software has weight, even when invisible. Latency, error states, the defaults we choose — these are tactile decisions. We never ship a tool that feels weightless.'],
    ['The', 'simplest path is rarely shorter', 'A single hot key that does what three menus did is not less work — it is more. We spend the engineering hours upstream so users spend zero downstream.'],
    ['Outlive the', 'trend cycle', 'We bet on rhythms longer than the launch calendar. Two years from now the work still reads as deliberate, not nostalgic.'],
  ];
  return (
    <section id="philosophy" style={{ ...wrap, padding: '128px 32px' }}>
      <SectionHead index="01" label="The studio" lead="Heavy software," accent="quietly made">
        Most software today is liquid — endlessly poured, infinitely reshaped, optimized for the next quarter. We work the other way around. Every product leaves the foundry as a finished thing.
      </SectionHead>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 0 }}>
        {principles.map(([a, b, body], i) => (
          <Card key={i} eyebrow={'Principle 0' + (i + 1)} title={a} accent={b} style={{ marginLeft: i ? -1 : 0 }}>{body}</Card>
        ))}
      </div>
    </section>
  );
}

function Capabilities() {
  const { Tag } = window.DS;
  const [open, setOpen] = React.useState(0);
  const metals = [
    ['Full-stack apps', 'Apps that ship,', 'not apps that demo', 'Web applications end-to-end — frontend, backend, database, deploy. The kind that hold up after the launch post fades.', ['TypeScript', 'React', 'Postgres', 'Edge']],
    ['iOS apps', 'Native to the device,', 'not the trend', 'Swift, SwiftUI, the platform conventions taken seriously. Keyboard-first, Dynamic Type ready.', ['Swift', 'SwiftUI', 'iPadOS', 'App Store']],
    ['Backends', 'Systems that', 'carry the load', 'APIs, queues, jobs, observability. Boring where it counts, instrumented from day one.', ['Go', 'Postgres', 'Redis', 'AWS']],
    ['Agentic workflows', 'Agents that', 'finish the task', 'Multi-step tool use, evals, fallbacks, human checkpoints. Most of the work is the scaffolding around the model.', ['Claude', 'Tools', 'Evals', 'MCP']],
    ['Design systems', 'Components built to', 'last past v1', 'Tokens, primitives, documentation, motion language. Built once with care, like a casting mold.', ['Tokens', 'React', 'Figma', 'Docs']],
  ];
  return (
    <section id="capabilities" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule-soft)', borderBottom: '1px solid var(--rule-soft)' }}>
      <div style={{ ...wrap, padding: '128px 32px' }}>
        <SectionHead index="02" label="Capabilities" lead="Five metals." accent="One forge">
          We work across five practices — each with its own grain. We never staff up beyond what fits in one room.
        </SectionHead>
        <div style={{ borderTop: '1px solid var(--ink)' }}>
          {metals.map(([name, a, b, body, tags], i) => {
            const on = open === i;
            return (
              <div key={name} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                <button onClick={() => setOpen(on ? -1 : i)} style={{ width: '100%', background: 'none', border: 0, cursor: 'pointer', padding: '24px 0', display: 'grid', gridTemplateColumns: '200px 1fr 24px', gap: 24, alignItems: 'baseline', textAlign: 'left', fontFamily: 'var(--font-sans)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{'0' + (i + 1)} / {name}</span>
                  <span style={{ fontWeight: 600, fontSize: 30, letterSpacing: '-.025em', color: 'var(--ink)', lineHeight: 1.1 }}>{a} <em>{b}.</em></span>
                  <span style={{ fontSize: 20, color: on ? 'var(--molten)' : 'var(--ink)', transform: on ? 'rotate(90deg)' : 'none', transition: 'transform .25s linear, color .25s linear' }}>{'\u2198'}</span>
                </button>
                {on && (
                  <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 24px', gap: 24, paddingBottom: 32 }}>
                    <span />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 640 }}>{body}</p>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const WORK = [
  ['Anvil', 'iOS', 'Personal CRM for people who hate CRMs. Voice notes in, structured contacts out.', 'Product · AI · iOS', '2026 · Ongoing', 'Product'],
  ['Bellows', 'for Linear', 'Inline assistant that turns shipped pull requests into release notes engineers want to read.', 'AI · Web', '2025', 'Product'],
  ['Cinder', 'type system', 'In-house display family. Three weights, two opticals, a set of contextual ligatures.', 'Type · Brand', '2025 · 2026', 'Identity'],
  ['Plinth', 'browser', 'A reading-first browser for a private research lab. Vertical tabs, pinned scratchpad.', 'Product · Mac', '2025', 'Product'],
  ['Quench', 'identity', 'Brand identity and editorial system for a Tokyo-based hardware studio.', 'Identity · Print', '2025', 'Identity'],
  ['Forge', 'handbook', '200-page studio operating manual, printed and published as a static site.', 'Editorial · Web', '2024 · 2026', 'Editorial'],
];

function Work() {
  const { Card, Tabs } = window.DS;
  const [f, setF] = React.useState('All');
  const list = WORK.map((w, i) => [w, i]).filter(([w]) => f === 'All' || w[5] === f);
  return (
    <section id="work" style={{ ...wrap, padding: '128px 32px' }}>
      <SectionHead index="03" label="Studio archive · 2024–2026" lead="Selected" accent="casts" />
      <Tabs tabs={['All', 'Product', 'Identity', 'Editorial']} value={f} onChange={setF} style={{ marginBottom: 32 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {list.map(([[t, a, body, cat, yr], i]) => (
          <Card key={t} href="#work" eyebrow={String(i + 1).padStart(2, '0') + ' / 14'} title={t} accent={a} meta={cat + ' — ' + yr} footer={<span style={{ color: 'var(--ink)' }}>{'\u2192'}</span>}>{body}</Card>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const { ProcessStep } = window.DS;
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStep(3); return; }
    const t = setInterval(() => setStep(s => (s + 1) % 5), 2000);
    return () => clearInterval(t);
  }, []);
  const steps = [
    ['i', 'Brief', 'A short, written contract. The problem, the scope, and what is explicitly out of scope.'],
    ['ii', 'Cast', 'The first working artifact, rough but real. Always interactive, never a deck.'],
    ['iii', 'Temper', 'Iteration in tight loops with a small group of real users. We track decisions, not features.'],
    ['iv', 'Stamp', 'The piece ships with a versioned, signed manual. One round of refinement, then we stay out of the way.'],
  ];
  return (
    <section id="process" style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--rule-soft)', borderBottom: '1px solid var(--rule-soft)' }}>
      <div style={{ ...wrap, padding: '128px 32px' }}>
        <SectionHead index="04" label="How we work" lead="Four" accent="passes" after="through the forge" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
          {steps.map(([n, t, b], i) => <ProcessStep key={n} numeral={n} title={t} hot={i < step}>{b}</ProcessStep>)}
        </div>
      </div>
    </section>
  );
}

function Contact({ onCommission }) {
  const { Eyebrow, Headline, Button, ArrowLink } = window.DS;
  return (
    <section id="contact" style={{ ...wrap, padding: '128px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Eyebrow index="05">Get in touch</Eyebrow>
      <Headline size="h2" lead="One piece" accent="at a time" style={{ maxWidth: 800 }} />
      <p style={{ margin: 0, fontSize: 19, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 620 }}>
        If you have a piece of software that needs to exist — particular, built once and built right — we'd like to hear about it.
      </p>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button arrow size="lg" onClick={onCommission}>Start a project</Button>
        <ArrowLink href="#">Read the studio journal</ArrowLink>
      </div>
    </section>
  );
}

function Footer() {
  const { Wordmark, Tooltip } = window.DS;
  const cols = [['Studio', ['Philosophy', 'Process', 'Journal']], ['Practice', ['Full-stack apps', 'iOS apps', 'Backends', 'Agentic workflows', 'Design systems']], ['Contact', ['Email the studio', 'shubhanshu.dev']]];
  const mono = { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' };
  return (
    <footer style={{ borderTop: '1px solid var(--ink)' }}>
      <div style={{ ...wrap, padding: '64px 32px 32px', display: 'grid', gridTemplateColumns: 'minmax(0,2fr) repeat(3, minmax(0,1fr))', gap: 48 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Wordmark size="footer" />
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 380 }}>A small, independent software studio. We treat software the way master craftsmen treat metal — slowly, deliberately, and one piece at a time.</p>
          <div style={mono}>Ottawa, ON · Established <Tooltip content="2026"><span style={{ borderBottom: '1px dashed var(--muted)' }}>MMXXVI</span></Tooltip></div>
        </div>
        {cols.map(([h, items]) => (
          <div key={h} style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
            <div style={{ ...mono, color: 'var(--ink)' }}>{h}</div>
            {items.map(it => <a key={it} href="#" style={{ fontSize: 15, overflowWrap: 'anywhere' }}>{it}</a>)}
          </div>
        ))}
      </div>
      <div style={{ ...wrap, padding: '24px 32px', borderTop: '1px solid var(--rule-soft)', display: 'flex', justifyContent: 'space-between', ...mono }}>
        <span>© MMXXVI Optimus Foundry · All work independently held</span><span>Proudly Canadian</span>
      </div>
    </footer>
  );
}
Object.assign(window, { Studio, Capabilities, Work, Process, Contact, Footer });
