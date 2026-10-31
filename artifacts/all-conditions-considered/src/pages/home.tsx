import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, ArrowUpRight, Radio } from 'lucide-react';
import { Reveal, Wave, useMeta } from '@/components/site';

const segments = [
  { id: 'open', label: 'Introductions', mins: 2, tone: 'bg-muted-foreground/40', proposed: true, body: 'Station ident, the presenter sets out the condition under consideration and who we will hear from. Provisional.' },
  { id: 'f1', label: 'Feature one', mins: 20, tone: 'bg-primary', body: 'Narrative and interview. A patient, carer or survivor tells it in their own words, with time to go off script.' },
  { id: 'ad1', label: 'Advertising', mins: 3.5, tone: 'bg-chart-3', body: 'First advertising break. Clearly separated from editorial content. Placement agreed with each advertiser.' },
  { id: 'link', label: 'Links', mins: 1, tone: 'bg-muted-foreground/40', proposed: true, body: 'A short bridge between features. Provisional.' },
  { id: 'f2', label: 'Feature two', mins: 20, tone: 'bg-accent', body: 'Dialogue and contrast. Practitioners, researchers and people harmed by the condition or its treatment, in the same conversation.' },
  { id: 'ad2', label: 'Advertising', mins: 3.5, tone: 'bg-chart-3', body: 'Second advertising break. Total advertising across the hour is seven minutes.' },
  { id: 'cta', label: 'Call to action', mins: 5, tone: 'bg-secondary', body: 'What a listener can actually do next: questions to ask, rights to know, where people are organising. Not a sales pitch.' },
  { id: 'close', label: 'Closing', mins: 2, tone: 'bg-muted-foreground/40', proposed: true, body: 'Thanks, signposting and what comes next. Provisional.' },
];

const spectrum = [
  'Chronic pain', 'Long Covid', 'Grief in the body', 'Menopause', 'Sickle cell', 'Endometriosis', 'Stroke recovery', 'Insomnia', 'ME/CFS',
  'Diabetes', 'Psychosis', 'Fertility', 'Ageing', 'Hearing loss', 'Addiction', 'Pregnancy', 'Eating disorders', 'Dementia care', 'Burnout', 'Rare disease',
];

const voices = [
  ['Patients', 'The person living it. First word, not last.'],
  ['Carers', 'The unpaid workforce who rarely get the microphone.'],
  ['Practitioners', 'GPs, nurses, therapists, the people at the desk and the bedside.'],
  ['Researchers', 'What is known, what is guessed, and what is still unfunded.'],
  ['Survivors', 'People who came through, and what it cost them.'],
  ['People harmed', 'By the condition, by the treatment, or by being disbelieved.'],
];

const economy = [
  ['Medical', 'Diagnosis, drugs, devices, waiting lists, the evidence and its gaps.'],
  ['Health and social care', 'Who pays, who provides, who falls between services.'],
  ['Wellness', 'Supplements, apps, retreats, the hopeful and the opportunistic.'],
  ['The household', 'Lost work, benefits, travel to appointments, the cost of being unwell.'],
];

export default function Home() {
  useMeta(
    'All Conditions Considered | Patient-led radio on 101.8 WCR-FM',
    'A patient-led radio programme from Wolverhampton. Lived experience, contrasting perspectives, and the medical, care and wellness economy around every condition.',
  );
  const [active, setActive] = useState('f1');
  const seg = segments.find((s) => s.id === active)!;
  let clock = 0;
  const starts = segments.map((s) => {
    const t = clock;
    clock += s.mins;
    return t;
  });
  const fmt = (m: number) => `${String(Math.floor(m)).padStart(2, '0')}:${m % 1 ? '30' : '00'}`;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-10 md:grid-cols-[1.35fr_1fr] md:px-8 md:pb-28 md:pt-16">
          <div>
            <p className="eyebrow rise flex items-center gap-2 text-primary">
              <span className="onair inline-block h-2 w-2 rounded-full bg-primary" /> New on 101.8 WCR-FM
            </p>
            <h1 className="display rise mt-6 text-[3.2rem] leading-[0.92] sm:text-7xl lg:text-[7.2rem]" style={{ animationDelay: '120ms' }}>
              All<br />Conditions<br />
              <em className="font-light text-primary">Considered.</em>
            </h1>
            <p className="rise mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl" style={{ animationDelay: '260ms' }}>
              A patient-led radio programme from Wolverhampton, for people whose lived experience deserves to be heard. One condition at a time, from every side of the waiting room.
            </p>
            <div className="rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: '380ms' }}>
              <a href="#format" className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3.5 font-semibold text-secondary-foreground hover:bg-primary transition-colors" data-testid="link-hero-format">
                See the proposed running order <ArrowRight size={16} />
              </a>
              <Link href="/advertising/" className="inline-flex items-center gap-2 rounded-full border border-secondary/30 px-6 py-3.5 font-semibold hover:border-primary hover:text-primary transition-colors" data-testid="link-hero-advertising">
                Advertising from £1,000 a month
              </Link>
            </div>
          </div>

          {/* Dial */}
          <div className="rise relative mx-auto aspect-square w-full max-w-[440px] self-center" style={{ animationDelay: '200ms' }} aria-hidden="true">
            <div className="absolute inset-0 rounded-full bg-secondary" />
            <svg viewBox="0 0 200 200" className="dial absolute inset-0 h-full w-full">
              <defs>
                <path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text fill="var(--maximum-yellow-red)" fontSize="9.5" letterSpacing="3.2" fontFamily="JetBrains Mono, monospace">
                <textPath href="#circ" textLength="480" lengthAdjust="spacingAndGlyphs">PATIENT VOICE · PATIENT CHOICE · CARERS · PRACTITIONERS ·</textPath>
              </text>
            </svg>
            <div className="absolute inset-[22%] grid place-items-center rounded-full bg-primary text-primary-foreground">
              <div className="text-center">
                <p className="display text-[clamp(1.25rem,4vw,2rem)] leading-tight">All<br />Conditions<br /><em>Considered</em></p>
                <p className="mono mt-4 text-[clamp(0.625rem,2vw,0.75rem)] tracking-wider">101.8 WCR-FM</p>
              </div>
            </div>
          </div>
        </div>

        {/* marquee */}
        <div className="border-y border-border bg-card/60 py-4 overflow-hidden" aria-hidden="true">
          <div className="marquee flex w-max gap-10 whitespace-nowrap">
            {[...spectrum, ...spectrum].map((c, i) => (
              <span key={i} className="display text-2xl italic text-muted-foreground">
                {c} <span className="not-italic text-primary">/</span>
              </span>
            ))}
          </div>
        </div>
        <p className="sr-only">Conditions the programme may consider include chronic pain, long Covid, menopause, dementia care and many more.</p>
      </section>

      {/* PREMISE */}
      <section id="premise" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.6fr]">
          <Reveal>
            <p className="eyebrow text-primary">01 / The premise</p>
            <p className="mono mt-4 text-sm text-muted-foreground">Voice and choice</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="display text-4xl leading-[1.05] md:text-6xl">
              Health is usually explained <em className="text-muted-foreground">to</em> patients. Here, patients do the explaining.
            </h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <div className="border-t-2 border-primary pt-5">
                <h3 className="display text-2xl">Patient voice</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  The people living with a condition set the agenda. Their account is the spine of the programme, not a colourful opener before the experts arrive.
                </p>
              </div>
              <div className="border-t-2 border-accent pt-5">
                <h3 className="display text-2xl">Patient choice</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Real decisions have trade-offs. We lay out the options people actually face, and what each one asks of them, so listeners can weigh things for themselves.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SCOPE: conditions & states */}
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <Reveal>
            <p className="eyebrow text-primary">02 / The territory</p>
            <h2 className="display mt-4 max-w-4xl text-4xl leading-[1.05] md:text-6xl">
              Not just diagnoses. <em className="text-primary">States of being in the body.</em>
            </h2>
            <p className="mt-6 max-w-2xl text-lg opacity-75">
              Broad medical conditions sit alongside the things the body goes through that have no tidy name on a referral letter: exhaustion, ageing, pregnancy, grief that settles in the chest. If it is lived in a body, it is in scope.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <ul className="mt-14 flex flex-wrap gap-2.5" aria-label="Example subjects">
              {spectrum.map((c, i) => (
                <li
                  key={c}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors hover:bg-primary hover:border-primary ${i % 5 === 0 ? 'border-primary text-primary hover:text-primary-foreground' : 'border-white/20'}`}
                >
                  {c}
                </li>
              ))}
              <li className="rounded-full px-4 py-2 text-sm italic opacity-60">and more, to be chosen with listeners</li>
            </ul>
            <p className="mono mt-6 text-xs opacity-50">Illustrative subjects only. No episodes have been scheduled.</p>
          </Reveal>
        </div>
      </section>

      {/* FORMAT */}
      <section id="format" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-primary">03 / Proposed running order</p>
              <h2 className="display mt-4 text-4xl md:text-6xl">Fifty-seven minutes, <em>on the clock.</em></h2>
            </div>
            <p className="mono text-sm text-muted-foreground">Select a segment to hear what it holds</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 flex h-20 w-full overflow-hidden rounded-2xl border border-border" role="tablist" aria-label="Running order segments">
            {segments.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={active === s.id}
                aria-controls="segment-panel"
                onClick={() => setActive(s.id)}
                className={`${s.tone} relative transition-opacity focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-background ${active === s.id ? 'opacity-100' : 'opacity-45 hover:opacity-80'}`}
                style={{ width: `${(s.mins / 57) * 100}%` }}
                data-testid={`button-segment-${s.id}`}
              >
                <span className="sr-only">{s.label}, {s.mins} minutes</span>
                {s.mins >= 5 && <span className="mono absolute bottom-2 left-2 hidden rounded bg-background px-1 text-[0.65rem] text-foreground sm:block">{s.mins}′</span>}
              </button>
            ))}
          </div>
          <div className="mono mt-2 flex justify-between text-xs text-muted-foreground"><span>00:00</span><span>28:30</span><span>57:00</span></div>

          <div id="segment-panel" role="tabpanel" className="mt-10 grid gap-8 rounded-3xl bg-card p-8 md:grid-cols-[auto_1fr] md:p-12" aria-live="polite">
            <div>
              <p className="mono text-sm text-muted-foreground">{fmt(starts[segments.indexOf(seg)])}</p>
              <p className="display text-7xl leading-none md:text-8xl">{seg.mins}<span className="text-3xl">min</span></p>
            </div>
            <div>
              <h3 className="display flex flex-wrap items-center gap-3 text-3xl">
                {seg.label}
                {seg.proposed && <span className="mono rounded-full bg-muted px-3 py-1 text-xs tracking-wider text-muted-foreground">PROVISIONAL</span>}
              </h3>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">{seg.body}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-8 md:grid-cols-4">
            {[['2 × 20', 'minutes of features'], ['5', 'minutes call to action'], ['7', 'minutes advertising'], ['5', 'minutes intros, links, close (provisional)']].map(([n, l]) => (
              <div key={l}>
                <dt className="display text-4xl">{n}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-muted-foreground">The order of segments and placement of breaks shown here is a proposal and may change before broadcast.</p>
        </Reveal>
      </section>

      {/* VOICES */}
      <section id="voices" className="scroll-mt-24 border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <div className="grid gap-14 md:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <p className="eyebrow text-primary">04 / Who speaks</p>
              <h2 className="display mt-4 text-4xl leading-[1.05] md:text-6xl">Six chairs <em>around one microphone.</em></h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Narrative and interview carry the first feature. Dialogue carries the second, deliberately putting contrasting perspectives in the same room. Disagreement is welcome. Sensationalism is not.
              </p>
            </Reveal>
            <ol className="divide-y divide-border border-y border-border">
              {voices.map(([t, d], i) => (
                <Reveal key={t} delay={i * 60}>
                  <li className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 py-6 md:grid-cols-[3rem_14rem_1fr]">
                    <span className="mono text-sm text-muted-foreground">0{i + 1}</span>
                    <span className="display text-3xl transition-transform group-hover:translate-x-2 group-hover:text-primary">{t}</span>
                    <span className="col-start-2 text-muted-foreground md:col-start-3">{d}</span>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="mx-auto max-w-5xl px-5 py-24 text-center md:py-36">
        <Reveal>
          <Wave bars={48} className="mx-auto h-12 justify-center" />
          <p className="display mt-10 text-3xl leading-tight md:text-5xl">
            “Curious enough to ask the awkward question. <em className="text-primary">Humane enough to wait for the answer.</em>”
          </p>
          <p className="eyebrow mt-8 text-muted-foreground">The editorial line</p>
        </Reveal>
      </section>

      {/* ECONOMY */}
      <section className="bg-accent text-accent-foreground">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <Reveal>
            <p className="eyebrow opacity-80">05 / Follow the money</p>
            <h2 className="display mt-4 max-w-4xl text-4xl leading-[1.05] md:text-6xl">Every condition has an economy around it.</h2>
            <p className="mt-6 max-w-2xl text-lg opacity-85">We look at who earns, who pays and who goes without. Not to accuse, but because people deserve to know the forces shaping the options in front of them.</p>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-white/15 sm:grid-cols-2">
            {economy.map(([t, d], i) => (
              <Reveal key={t} delay={i * 80} className="bg-accent p-8 md:p-10">
                <p className="mono text-xs opacity-70">0{i + 1}</p>
                <h3 className="display mt-3 text-3xl">{t}</h3>
                <p className="mt-3 opacity-85">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INDEPENDENCE */}
      <section id="independence" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-primary">06 / Ground rules</p>
            <h2 className="display mt-4 text-4xl leading-[1.05] md:text-6xl">Independent. <em>Informative.</em> Never your doctor.</h2>
          </Reveal>
          <Reveal delay={100}>
            <ul className="space-y-6">
              {[
                ['No paid influence', 'Advertisers buy airtime in the breaks. They do not buy editorial, guests, questions or outcomes.'],
                ['No medical endorsement', 'Featuring a treatment, service or product is not a recommendation of it, on air or off.'],
                ['Not personalised advice', 'The programme informs. Decisions about your own care belong with you and a qualified professional who knows your situation.'],
                ['Provocative, not sensational', 'We will ask hard questions. We will not exploit anyone’s story to do it.'],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-4">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{t}</h3>
                    <p className="mt-1 text-muted-foreground">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* LISTEN */}
      <section id="listen" className="scroll-mt-24 px-5 pb-24 md:px-8 md:pb-32">
        <Reveal className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-secondary p-8 text-secondary-foreground md:p-16">
            <div className="flex flex-wrap items-center gap-3">
              <Radio size={18} className="text-primary" />
              <p className="eyebrow">Listening area</p>
              <span className="mono rounded-full border border-white/25 px-3 py-1 text-xs">DETAILS TO BE ANNOUNCED</span>
            </div>
            <h2 className="display mt-6 max-w-3xl text-4xl leading-[1.05] md:text-6xl">The first broadcast is being prepared.</h2>
            <p className="mt-6 max-w-xl text-lg opacity-75">
              Day, time and how to listen online will be confirmed by 101.8 WCR-FM. There is no player here yet, and we would rather tell you that than pretend.
            </p>
            <div className="mt-10 flex items-center gap-5 rounded-2xl border border-white/15 p-5 opacity-70" aria-label="Player not yet available">
              <span className="grid h-14 w-14 place-items-center rounded-full border border-white/30 mono text-xs">TBA</span>
              <Wave bars={60} className="h-10 flex-1 overflow-hidden" color="bg-white/40" />
              <span className="mono hidden text-sm sm:block">--:-- / 57:00</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ADVERTISE TEASER */}
      <section className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-20 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="eyebrow text-primary">For organisations</p>
            <p className="display mt-3 text-3xl md:text-5xl">Seven minutes an hour. <em>Clearly marked.</em></p>
          </div>
          <Link href="/advertising/" className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground hover:bg-secondary transition-colors" data-testid="link-teaser-advertising">
            Read how advertising works <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
