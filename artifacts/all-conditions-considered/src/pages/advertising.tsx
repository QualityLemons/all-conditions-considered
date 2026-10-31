import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Download, Copy, Check, Send } from 'lucide-react';
import { Reveal, Wave, useMeta } from '@/components/site';
import { Honeypot, SubmitFeedback } from '@/components/submit-feedback';
import { LIMITS, useSubmission } from '@/lib/submissions';

const placements = [
  ['Break one', 'Between the two features, roughly a third of the way in.'],
  ['Break two', 'After the second feature, before the call to action.'],
  ['Spot length and mix', 'Shared across the seven advertising minutes. Final lengths agreed individually.'],
  ['Production', 'Supply finished audio, or discuss production support. Agreed case by case.'],
];

const rules = [
  'Advertising is clearly separated from editorial content.',
  'Advertisers have no say over guests, topics, questions or edits.',
  'Being on air is not an endorsement by the programme.',
  'Health claims in advertising must meet applicable UK broadcast advertising rules.',
  'The programme may decline advertising that conflicts with its editorial independence.',
];

type Brief = { org: string; name: string; email: string; sector: string; months: string; aims: string; audio: string; notes: string };
const empty: Brief = { org: '', name: '', email: '', sector: '', months: '1', aims: '', audio: 'Undecided', notes: '' };

export default function Advertising() {
  useMeta(
    'Advertising | All Conditions Considered on 101.8 WCR-FM',
    'Advertise on All Conditions Considered, a patient-led programme on 101.8 WCR-FM Wolverhampton. From £1,000 per month exclusive of VAT, placement and frequency agreed individually.',
  );
  const [b, setB] = useState<Brief>(empty);
  const [copied, setCopied] = useState(false);
  const [website, setWebsite] = useState('');
  const { state, submit, touch, available } = useSubmission('advertising');
  const pending = state.status === 'pending';
  const up = (k: keyof Brief) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setB({ ...b, [k]: e.target.value });
    touch();
  };
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await submit(
      { name: b.name, email: b.email, website },
      { organisation: b.org, sector: b.sector, months: b.months, audio: b.audio, aims: b.aims, notes: b.notes },
    );
    if (ok) {
      setB(empty);
      setWebsite('');
    }
  };

  const months = Math.max(1, Number(b.months) || 1);
  const text = `ADVERTISING ENQUIRY BRIEF
All Conditions Considered / 101.8 WCR-FM Wolverhampton
Prepared: ${new Date().toLocaleDateString('en-GB')}

Organisation: ${b.org || '-'}
Contact name: ${b.name || '-'}
Email: ${b.email || '-'}
Sector: ${b.sector || '-'}
Months of interest: ${months}
Indicative starting rate: from £${(1000 * months).toLocaleString('en-GB')} exclusive of VAT (from £1,000 per month)
Audio: ${b.audio}

What we hope to achieve:
${b.aims || '-'}

Other notes:
${b.notes || '-'}

Note: rates are a starting point only. Placement, frequency and production are agreed individually. Advertising does not buy editorial influence or medical endorsement.`;

  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `acc-advertising-brief-${(b.org || 'draft').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const field = 'mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring';

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-10 md:px-8 md:pt-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-back-home">
          <ArrowLeft size={14} /> Back to the programme
        </Link>
        <div className="mt-10 grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <p className="eyebrow rise text-primary">Advertising</p>
            <h1 className="display rise mt-5 text-5xl leading-[0.95] md:text-8xl" style={{ animationDelay: '100ms' }}>
              Be heard <em className="text-primary">in the breaks,</em> not in the script.
            </h1>
          </div>
          <div className="rise rounded-3xl bg-secondary p-8 text-secondary-foreground" style={{ animationDelay: '220ms' }}>
            <p className="eyebrow opacity-70">Starting from</p>
            <p className="display mt-2 text-7xl leading-none">£1,000</p>
            <p className="mt-2 opacity-80">per month, exclusive of VAT</p>
            <Wave bars={30} className="mt-6 h-6" />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/60">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[1fr_1.5fr] md:px-8">
          <Reveal>
            <p className="eyebrow text-primary">Placements</p>
            <h2 className="display mt-4 text-4xl md:text-5xl">Seven minutes in a fifty-seven minute hour.</h2>
            <p className="mt-5 text-muted-foreground">
              The proposed running order holds two 20-minute features, a 5-minute call to action and 7 minutes of advertising. The final placement, frequency and production of your advertising are agreed with you individually.
            </p>
          </Reveal>
          <div>
            <Reveal>
              <div className="flex h-12 overflow-hidden rounded-xl" aria-hidden="true">
                {[[2, 'bg-muted-foreground/30'], [20, 'bg-primary/30'], [3.5, 'bg-primary'], [1, 'bg-muted-foreground/30'], [20, 'bg-accent/30'], [3.5, 'bg-primary'], [5, 'bg-secondary/30'], [2, 'bg-muted-foreground/30']].map(([m, c], i) => (
                  <span key={i} className={c as string} style={{ width: `${((m as number) / 57) * 100}%` }} />
                ))}
              </div>
              <p className="mono mt-2 text-xs text-muted-foreground">Proposed. Highlighted blocks show indicative break positions.</p>
            </Reveal>
            <dl className="mt-8 divide-y divide-border">
              {placements.map(([t, d], i) => (
                <Reveal key={t} delay={i * 60}>
                  <div className="grid gap-2 py-5 sm:grid-cols-[12rem_1fr]">
                    <dt className="display text-xl">{t}</dt>
                    <dd className="text-muted-foreground">{d}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-primary">What we will not promise</p>
            <h2 className="display mt-4 text-4xl md:text-5xl">No invented audience figures. <em>No bundled extras.</em></h2>
            <p className="mt-5 text-lg text-muted-foreground">
              This is a new programme. We will not quote listener numbers we do not have, or list package entitlements before they are agreed. What you get is set out plainly when we talk.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow text-primary">Independence comes first</p>
            <ul className="mt-6 space-y-4">
              {rules.map((r) => (
                <li key={r} className="flex gap-4 border-b border-border pb-4">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="brief" className="bg-secondary text-secondary-foreground">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[1fr_1.3fr] md:px-8 md:py-28">
          <div>
            <p className="eyebrow text-primary">Prepare a brief</p>
            <h2 className="display mt-4 text-4xl md:text-5xl">Send an enquiry. <em className="text-primary">Keep a copy if you like.</em></h2>
            <p className="mt-5 opacity-80">
              Only your name and email are needed. Your enquiry goes to the programme's private inbox, stored on GitHub and accessible only to the programme team and authorised collaborators, who use it to review and reply. You can also download or copy a plain-text brief for your own records.
            </p>
            <div className="mt-8 rounded-2xl border border-white/15 p-6">
              <p className="eyebrow opacity-60">Indicative starting point</p>
              <p className="display mt-2 text-5xl" data-testid="text-estimate">from £{(1000 * months).toLocaleString('en-GB')}</p>
              <p className="mt-1 text-sm opacity-70">for {months} month{months > 1 ? 's' : ''}, exclusive of VAT. Not a quote.</p>
            </div>
          </div>
          <form noValidate className="relative rounded-3xl bg-background p-6 text-foreground md:p-10" onSubmit={onSubmit} aria-busy={pending} data-testid="form-advertising">
            <Honeypot value={website} onChange={setWebsite} />
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium">Your name <span className="text-primary">(required)</span><input required maxLength={LIMITS.name} autoComplete="name" className={field} value={b.name} onChange={up('name')} data-testid="input-name" /></label>
              <label className="text-sm font-medium">Email <span className="text-primary">(required)</span><input required type="email" maxLength={LIMITS.email} autoComplete="email" className={field} value={b.email} onChange={up('email')} data-testid="input-email" /></label>
              <label className="text-sm font-medium">Organisation<input maxLength={LIMITS.field} className={field} value={b.org} onChange={up('org')} data-testid="input-org" /></label>
              <label className="text-sm font-medium">Sector<input maxLength={LIMITS.field} className={field} value={b.sector} onChange={up('sector')} placeholder="e.g. local care provider" data-testid="input-sector" /></label>
              <label className="text-sm font-medium">Months of interest<input type="number" min={1} max={24} className={field} value={b.months} onChange={up('months')} data-testid="input-months" /></label>
              <label className="text-sm font-medium sm:col-span-2">Audio
                <select className={field} value={b.audio} onChange={up('audio')} data-testid="select-audio">
                  <option>Undecided</option>
                  <option>We will supply finished audio</option>
                  <option>We would like to discuss production</option>
                </select>
              </label>
              <label className="text-sm font-medium sm:col-span-2">What you hope to achieve<textarea rows={3} maxLength={LIMITS.field} className={field} value={b.aims} onChange={up('aims')} data-testid="input-aims" /></label>
              <label className="text-sm font-medium sm:col-span-2">Other notes<textarea rows={2} maxLength={LIMITS.field} className={field} value={b.notes} onChange={up('notes')} data-testid="input-notes" /></label>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="submit" disabled={pending || !available} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-secondary transition-colors disabled:cursor-not-allowed disabled:opacity-60" data-testid="button-submit-advertising">
                <Send size={16} /> {pending ? 'Sending...' : 'Send enquiry'}
              </button>
              <button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold hover:border-primary" data-testid="button-download-brief">
                <Download size={16} /> Download brief (.txt)
              </button>
              <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold hover:border-primary" data-testid="button-copy-brief">
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy to clipboard'}
              </button>
              <button type="button" onClick={() => { setB(empty); touch(); }} className="px-3 py-3 text-sm text-muted-foreground underline-offset-4 hover:underline" data-testid="button-reset-brief">
                Clear
              </button>
            </div>
            <SubmitFeedback state={state} available={available} successText="Thank you. Your enquiry is in the programme inbox and we will be in touch." />
            <p className="mt-4 text-xs text-muted-foreground">Downloading or copying stays on your device. Only "Send enquiry" sends anything. Sending does not commit either side to a booking.</p>
          </form>
        </div>
      </section>
    </>
  );
}
