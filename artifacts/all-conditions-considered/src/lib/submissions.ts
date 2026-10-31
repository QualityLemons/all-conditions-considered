import { useRef, useState } from 'react';
import type { SubmissionInput } from '@workspace/api-client-react';

export const LIMITS = { name: 150, email: 254, field: 3000, maxDetails: 20, showWords: 300 } as const;
export const countWords = (text: string): number => text.match(/\S+/gu)?.length ?? 0;

/** Full endpoint URL. External builds set VITE_SUBMISSIONS_API_URL; dev uses the shared /api/submissions service. */
export function submissionsEndpoint(): string | null {
  const configured = (import.meta.env.VITE_SUBMISSIONS_API_URL as string | undefined)?.trim();
  if (configured) return configured;
  if (import.meta.env.DEV) return '/api/submissions';
  return null;
}

export type SubmitState =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'error'; message: string }
  | { status: 'success'; reference: string };

const uuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateBasics(name: string, email: string): string | null {
  if (!name.trim()) return 'Please tell us your name.';
  if (name.trim().length > LIMITS.name) return `Your name needs to be ${LIMITS.name} characters or fewer.`;
  if (!email.trim()) return 'Please add an email address so we can reply.';
  if (email.trim().length > LIMITS.email || !EMAIL.test(email.trim())) return 'That email address does not look quite right.';
  return null;
}

export function useSubmission(kind: SubmissionInput['kind']) {
  const [state, setState] = useState<SubmitState>({ status: 'idle' });
  const pending = useRef(false);
  const last = useRef<{ sig: string; id: string } | null>(null);
  const endpoint = submissionsEndpoint();

  /** Call whenever input changes so a fresh requestId is used for the new payload. */
  const touch = () => {
    if (state.status === 'error' || state.status === 'success') setState({ status: 'idle' });
  };

  const submit = async (
    fields: { name: string; email: string; website: string },
    rawDetails: Record<string, string>,
  ): Promise<boolean> => {
    if (pending.current) return false;
    if (!endpoint) {
      setState({ status: 'error', message: 'Online submissions are not available on this version of the site yet. Please try again later.' });
      return false;
    }
    const invalid = validateBasics(fields.name, fields.email);
    if (invalid) {
      setState({ status: 'error', message: invalid });
      return false;
    }
    const details: Record<string, string> = {};
    if (kind === 'show' && Object.values(rawDetails).some(value => countWords(value) > LIMITS.showWords)) {
      setState({ status: 'error', message: 'Please shorten each answer to 300 words or fewer. Your answers have not been sent.' });
      return false;
    }
    for (const [k, v] of Object.entries(rawDetails)) {
      const t = v.trim();
      if (kind === 'show' && t.length > LIMITS.field) {
        setState({ status: 'error', message: 'Please shorten each answer to 3,000 characters or fewer. Your answers have not been sent.' });
        return false;
      }
      if (t) details[k] = t.slice(0, LIMITS.field);
      if (Object.keys(details).length >= LIMITS.maxDetails) break;
    }
    const base = { kind, name: fields.name.trim(), email: fields.email.trim(), website: fields.website, details };
    const sig = JSON.stringify(base);
    if (!last.current || last.current.sig !== sig) last.current = { sig, id: uuid() };
    const body: SubmissionInput = {
      ...base,
      requestId: last.current.id,
      ...(Object.keys(details).length ? {} : { details: undefined }),
    };

    pending.current = true;
    setState({ status: 'pending' });
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      const d = data as { reference?: unknown; error?: unknown } | null;
      if (res.ok && d && typeof d.reference === 'string') {
        setState({ status: 'success', reference: d.reference });
        last.current = null;
        return true;
      }
      const msg = d && typeof d.error === 'string' ? d.error : `We could not save that just now (status ${res.status}).`;
      setState({ status: 'error', message: `${msg} Your answers are still here, so you can try again.` });
      return false;
    } catch {
      setState({ status: 'error', message: 'We could not reach the inbox. Check your connection and try again; your answers are still here.' });
      return false;
    } finally {
      pending.current = false;
    }
  };

  return { state, submit, touch, available: !!endpoint };
}
