import { CheckCircle2, Loader2, X, AlertTriangle, Clock } from 'lucide-react';

type Phase = 'searching' | 'scanning' | 'done' | 'timeout' | 'error';

const CONFIG: Record<Phase, { ring: string; text: string; icon: typeof Loader2; spin: boolean }> = {
  searching: { ring: 'border-brand-blue/25 bg-brand-blue/5', text: 'text-brand-blue', icon: Loader2, spin: true },
  scanning: { ring: 'border-brand-blue/25 bg-brand-blue/5', text: 'text-brand-blue', icon: Loader2, spin: true },
  done: { ring: 'border-emerald-200 bg-emerald-50', text: 'text-emerald-800', icon: CheckCircle2, spin: false },
  timeout: { ring: 'border-ink-border bg-navy-50', text: 'text-navy-500', icon: Clock, spin: false },
  error: { ring: 'border-red-200 bg-red-50', text: 'text-red-800', icon: AlertTriangle, spin: false },
};

export function ScanNotice({
  phase,
  message,
  onDismiss,
}: {
  phase: Phase;
  message: string;
  onDismiss?: () => void;
}) {
  const cfg = CONFIG[phase];
  const Icon = cfg.icon;
  return (
    <div className={`flex items-start gap-3 rounded-[12px] border px-4 py-3 text-sm ${cfg.ring} ${cfg.text}`}>
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${cfg.spin ? 'animate-spin' : ''}`} />
      <p className="flex-1 break-words font-medium">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="rounded p-0.5 opacity-60 transition hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
