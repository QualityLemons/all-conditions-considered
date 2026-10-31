import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import type { SubmitState } from '@/lib/submissions';

export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export function SubmitFeedback({ state, available, successText }: { state: SubmitState; available: boolean; successText: string }) {
  return (
    <div className="mt-5" data-testid="status-submission">
      <div role="status" aria-live="polite">
        {state.status === 'pending' && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={16} className="animate-spin" /> Sending to the programme inbox...</p>
        )}
        {state.status === 'success' && (
          <div className="flex gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" />
            <p>
              {successText} Your reference is <span className="mono font-semibold" data-testid="text-reference">{state.reference}</span>.
            </p>
          </div>
        )}
        {!available && state.status === 'idle' && (
          <p className="text-sm text-muted-foreground">Online submissions are not available on this version of the site yet.</p>
        )}
      </div>
      <div role="alert">
        {state.status === 'error' && (
          <p className="flex gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle size={18} className="mt-0.5 shrink-0" /> {state.message}
          </p>
        )}
      </div>
    </div>
  );
}
