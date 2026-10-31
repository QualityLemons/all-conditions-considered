import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Send } from 'lucide-react';
import { Reveal, Wave, useMeta } from '@/components/site';
import { Honeypot, SubmitFeedback } from '@/components/submit-feedback';
import { LIMITS, countWords, useSubmission } from '@/lib/submissions';

type F = { name: string; email: string; topic: string; connection: string; story: string; questions: string; guests: string; lighter: string; participation: string };
const empty: F = { name: '', email: '', topic: '', connection: '', story: '', questions: '', guests: '', lighter: '', participation: '' };

const optional: { k: Exclude<keyof F, 'name' | 'email'>; label: string; hint: string; rows: number }[] = [
  { k: 'topic', label: 'The condition or topic', hint: 'Common, rare, newly named or still being argued about. All welcome.', rows: 2 },
  { k: 'connection', label: 'Your connection or lived experience', hint: 'Living with it, caring, working in the field, or simply curious.', rows: 3 },
  { k: 'story', label: 'The story you would like told', hint: 'What do people get wrong? What should a listener understand by the end of the hour?', rows: 5 },
  { k: 'questions', label: 'Questions you want answered', hint: 'The ones you have always wanted to put to a specialist.', rows: 3 },
  { k: 'guests', label: 'Possible guests', hint: 'Yourself, a clinician, a researcher, a support group. Please only suggest people who are happy to be contacted.', rows: 3 },
  { k: 'lighter', label: 'Lighter moments', hint: 'The absurd waiting room, the running joke, the small win. Health is not only hard.', rows: 3 },
  { k: 'participation', label: 'Taking part and access needs', hint: 'Would you like to speak on air, stay behind the scenes, or not take part? Anything that would make it easier for you.', rows: 3 },
];

const steps = [
  ['01', 'You suggest', 'As much or as little as you like. A name, an email and one sentence is plenty.'],
  ['02', 'We read it', 'Every suggestion is read by the programme team. Properly, with tea.'],
  ['03', 'We may write back', 'If we want to know more, we will email you. No obligation either way.'],
];

export default function SuggestAShow() {
  useMeta(
    'Suggest a show | All Conditions Considered on 101.8 WCR-FM',
    'Suggest a condition, a story, a question or a guest for All Conditions Considered, the patient-led health programme on 101.8 WCR-FM Wolverhampton.',
  );
  const [f, setF] = useState<F>(empty);
  const [website, setWebsite] = useState('');
  const { state, submit, touch, available } = useSubmission('show');
  const pending = state.status === 'pending';

  const up = (k: keyof F) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setF({ ...f, [k]: e.target.value });
    touch();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { name, email, ...rest } = f;
    const ok = await submit({ name, email, website }, rest);
    if (ok) {
      setF(empty);
      setWebsite('');
    }
  };

  const field = 'mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 font-normal focus:outline-none focus:ring-2 focus:ring-ring';

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-10 md:px-8 md:pt-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary" data-testid="link-back-home">
          <ArrowLeft size={14} /> Back to the programme
        </Link>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow rise text-primary">Suggest a show</p>
            <h1 className="display rise mt-5 text-5xl leading-[0.95] md:text-8xl" style={{ animationDelay: '100ms' }}>
              You know something <em className="text-primary">we should be talking about.</em>
            </h1>
            <p className="rise mt-8 max-w-2xl text-lg text-muted-foreground" style={{ animationDelay: '200ms' }}>
              The best hours of radio start with someone saying "nobody ever explains this properly." A condition you live with, one you care about, a question that keeps you up, a guest who would be brilliant. Tell us.
            </p>
          </div>
          <div className="rise rounded-3xl bg-secondary p-8 text-secondary-foreground" style={{ animationDelay: '260ms' }}>
            <p className="eyebrow opacity-70">What we actually need</p>
            <p className="display mt-3 text-4xl leading-tight">Your name and an email.</p>
            <p className="mt-3 opacity-80">Everything else is optional. Half a thought is welcome; we are good at follow-up questions.</p>
            <Wave bars={30} className="mt-6 h-6" />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/60">
        <ol className="mx-auto grid max-w-7xl gap-px px-5 py-14 md:grid-cols-[1fr_1.2fr_1fr] md:px-8">
          {steps.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 80}>
              <li className="list-none py-4 md:px-6">
                <span className="mono text-xs text-primary">{n}</span>
                <p className="display mt-2 text-2xl">{t}</p>
                <p className="mt-2 text-muted-foreground">{d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section id="form" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[1fr_1.6fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-primary">Before you write</p>
          <h2 className="display mt-4 text-4xl md:text-5xl">A word on <em>privacy.</em></h2>
          <div className="mt-6 space-y-4 text-muted-foreground" data-testid="text-privacy">
            <p>What you send is stored in a private GitHub inbox that only the programme team and authorised collaborators can access. We use it to review your suggestion and to reply to you.</p>
            <p>Please keep private medical details to what you are comfortable sharing, and do not include information that identifies other people without their permission.</p>
            <p>Suggesting a show does not guarantee it will be broadcast, or that you will be contacted to take part.</p>
          </div>
        </div>

        <form noValidate onSubmit={onSubmit} className="relative rounded-3xl border border-border bg-card p-6 md:p-10" aria-busy={pending} data-testid="form-suggest-show">
          <Honeypot value={website} onChange={setWebsite} />
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium">Your name <span className="text-primary">(required)</span>
              <input required maxLength={LIMITS.name} autoComplete="name" className={field} value={f.name} onChange={up('name')} data-testid="input-name" />
            </label>
            <label className="text-sm font-medium">Email <span className="text-primary">(required)</span>
              <input required type="email" maxLength={LIMITS.email} autoComplete="email" className={field} value={f.email} onChange={up('email')} data-testid="input-email" />
            </label>
          </div>
          <p className="eyebrow mt-10 border-t border-border pt-6 text-muted-foreground">Optional, all of it</p>
          <p className="mt-2 text-sm text-muted-foreground">Up to 300 words per answer, with a maximum of 3,000 characters. If you paste a longer answer, shorten it before sending; we will not cut it down for you.</p>
          <div className="mt-2 space-y-6">
            {optional.map(({ k, label, hint, rows }) => (
              <label key={k} className="block text-sm font-medium">
                {label}
                <span className="mt-1 block font-normal text-muted-foreground">{hint}</span>
                <textarea rows={rows} className={field} value={f[k]} onChange={up(k)} aria-describedby={`${k}-count`} aria-invalid={countWords(f[k]) > LIMITS.showWords || f[k].length > LIMITS.field} data-testid={`input-${k}`} />
                <span id={`${k}-count`} className="mt-1 block text-xs font-normal" aria-live="polite" aria-atomic="true">
                  {countWords(f[k])} / 300 words
                  {countWords(f[k]) > LIMITS.showWords && ` — remove ${countWords(f[k]) - LIMITS.showWords} word${countWords(f[k]) - LIMITS.showWords === 1 ? '' : 's'} before sending.`}
                  {f[k].length > LIMITS.field && ' — please also shorten this answer to 3,000 characters or fewer.'}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="submit" disabled={pending || !available} className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60" data-testid="button-submit-show">
              <Send size={16} /> {pending ? 'Sending...' : 'Send suggestion'}
            </button>
            <span className="text-xs text-muted-foreground">Only name and email are required.</span>
          </div>
          <SubmitFeedback state={state} available={available} successText="Thank you. Your suggestion is safely in the programme inbox." />
        </form>
      </section>
    </>
  );
}
