import { useEffect, useState } from 'react'; import { biz } from '../config';
// Finds out whether an ad video is set up: a YouTube ID, or an MP4 file that really exists.
export function useAdVideo() {
  const [kind, setKind] = useState(null);
  useEffect(() => {
    if (biz.adYoutubeId) return setKind('youtube');
    if (!biz.adVideo) return;
    fetch(biz.adVideo, { method: 'HEAD' }).then(r => { if (r.ok && (r.headers.get('content-type') || '').startsWith('video')) setKind('file'); }).catch(() => {});
  }, []);
  return kind;
}
export default function AdPlayer({ kind, loop, onEnded }) {
  if (kind === 'youtube') return <iframe title={`${biz.name} video`} className="aspect-video w-full rounded-2xl border-0" allowFullScreen allow="autoplay; encrypted-media; picture-in-picture"
    src={`https://www.youtube-nocookie.com/embed/${biz.adYoutubeId}?autoplay=1&mute=1&rel=0&playsinline=1`} />;
  return <video src={biz.adVideo} autoPlay muted playsInline controls loop={loop} onEnded={onEnded} className="aspect-video w-full rounded-2xl bg-black" />;
}