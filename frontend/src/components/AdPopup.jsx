import { useEffect, useState } from 'react'; import { X } from 'lucide-react'; import AdPlayer, { useAdVideo } from './VideoAd';
// Plays the ad video once per browser session, shortly after the visitor arrives. Starts muted (browsers require it); the viewer can unmute.
export default function AdPopup() {
  const kind = useAdVideo(), [open, setOpen] = useState(false);
  const close = () => { setOpen(false); try { sessionStorage.setItem('adSeen', '1'); } catch {} };
  useEffect(() => { if (!kind) return; try { if (sessionStorage.getItem('adSeen')) return; } catch {} const t = setTimeout(() => setOpen(true), 800); return () => clearTimeout(t); }, [kind]);
  useEffect(() => { if (!open) return; const k = e => e.key === 'Escape' && close(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [open]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4" onClick={close}>
    <div className="relative w-full max-w-3xl" role="dialog" aria-label="Advertisement" onClick={e => e.stopPropagation()}>
      <AdPlayer kind={kind} onEnded={close} />
      <button aria-label="Close advertisement" className="absolute top-2 right-2 z-10 w-11 h-11 rounded-full bg-white/90 grid place-items-center" onClick={close}><X size={18} /></button>
      <button onClick={close} className="mt-3 mx-auto block text-white text-sm underline min-h-11">Skip</button></div></div>;
}