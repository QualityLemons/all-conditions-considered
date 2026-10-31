import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';

export const asset = (p: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + p.replace(/^\//, '');

export function useMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const set = (sel: string, attr: string, key: string, val: string) => {
      let el = document.head.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = val;
    };
    set('meta[name="description"]', 'name', 'description', description);
    set('meta[property="og:title"]', 'property', 'og:title', title);
    set('meta[property="og:description"]', 'property', 'og:description', description);
    set('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    set('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    set('meta[property="og:url"]', 'property', 'og:url', window.location.href);
  }, [title, description]);
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in');
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Wave({ bars = 28, className = '', color = 'bg-primary' }: { bars?: number; className?: string; color?: string }) {
  return (
    <div className={`wave flex items-center gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full ${color}`}
          style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i * 97) % 1200}ms`, animationDuration: `${1100 + ((i * 53) % 900)}ms` }}
        />
      ))}
    </div>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
        ACC
      </span>
      <span className="leading-none">
        <span className="display block text-[1.05rem] font-semibold">All Conditions Considered</span>
        <span className="mono block max-w-[15rem] text-[0.62rem] leading-relaxed tracking-[0.2em] text-muted-foreground mt-1 lg:max-w-none">INDEPENDENTLY PRODUCED AT 101.8 WCR-FM WOLVERHAMPTON</span>
      </span>
    </span>
  );
}

const homeLinks = [
  ['#premise', 'The premise'],
  ['#format', 'Running order'],
  ['#voices', 'Voices'],
  ['#listen', 'Listen'],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [loc] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => setOpen(false), [loc]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  const isAds = loc.startsWith('/advertising');
  const isSuggest = loc.startsWith('/suggest-a-show');
  const base = import.meta.env.BASE_URL;
  const anchor = (h: string) => (isAds || isSuggest ? `${base}${h}` : h);

  return (
    <header className={`sticky top-0 z-50 transition-colors ${scrolled || open ? 'bg-background/92 backdrop-blur border-b border-border' : 'bg-transparent'}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 bg-secondary text-secondary-foreground px-3 py-2 rounded">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" data-testid="link-home" aria-label="All Conditions Considered home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {homeLinks.map(([h, l]) => (
            <a key={h} href={anchor(h)} className="text-sm font-medium hover:text-primary transition-colors" data-testid={`link-nav-${h.slice(1)}`}>
              {l}
            </a>
          ))}
          <Link
            href="/suggest-a-show/"
            aria-current={isSuggest ? 'page' : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${isSuggest ? 'border-primary bg-primary text-primary-foreground' : 'border-secondary hover:border-primary hover:text-primary'}`}
            data-testid="link-nav-suggest"
          >
            Suggest a show
          </Link>
          <Link
            href="/advertising/"
            aria-current={isAds ? 'page' : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isAds ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-primary'}`}
            data-testid="link-nav-advertising"
          >
            Advertise with us
          </Link>
        </nav>
        <button
          className="lg:hidden grid h-10 w-10 place-items-center rounded-full border border-border"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
          data-testid="button-menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" className="lg:hidden max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border px-5 pb-8 pt-4" aria-label="Mobile">
          <ul className="space-y-1">
            {homeLinks.map(([h, l]) => (
              <li key={h}>
                <a href={anchor(h)} onClick={() => setOpen(false)} className="display block py-2 text-3xl">
                  {l}
                </a>
              </li>
            ))}
            <li>
              <Link href="/suggest-a-show/" className="display block py-2 text-3xl text-primary" data-testid="link-mobile-suggest">
                Suggest a show
              </Link>
            </li>
            <li>
              <Link href="/advertising/" className="display block py-2 text-3xl text-primary" data-testid="link-mobile-advertising">
                Advertise with us
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="display text-4xl md:text-5xl leading-[1.02]">
              Every condition<br />
              <em className="text-primary">deserves a hearing.</em>
            </p>
            <Wave bars={40} className="mt-8 h-8 opacity-80" />
          </div>
          <div className="space-y-2 text-sm">
            <p className="eyebrow opacity-60 mb-4">The programme</p>
            <Link href="/" className="block hover:text-primary">Homepage</Link>
            <a href={`${import.meta.env.BASE_URL}#format`} className="block hover:text-primary">Proposed running order</a>
            <a href={`${import.meta.env.BASE_URL}#independence`} className="block hover:text-primary">Editorial independence</a>
            <Link href="/suggest-a-show/" className="block hover:text-primary" data-testid="link-footer-suggest">Suggest a show</Link>
            <Link href="/advertising/" className="block hover:text-primary">Advertising from £1,000/month</Link>
          </div>
          <div className="text-sm opacity-80 space-y-3">
            <p className="eyebrow opacity-60 mb-4">Please note</p>
            <p>This programme is informative. It is not personalised medical advice. Speak to a qualified professional about your own health.</p>
            <p>Broadcast times are to be announced.</p>
            <Link href="/suggest-a-show/" className="mt-2 inline-flex rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:bg-background hover:text-foreground transition-colors" data-testid="button-footer-suggest">Got a story? Suggest a show</Link>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs opacity-60 md:flex-row md:justify-between">
          <span>All Conditions Considered on 101.8 WCR-FM, Wolverhampton</span>
          <span className="mono">Copyright 2026 EP Producers</span>
        </div>
      </div>
    </footer>
  );
}
