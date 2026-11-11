import { createElement, Fragment, useEffect, useRef, useState } from 'react';

// Animates text word by word: each word rises, un-blurs and fades in.
// - immediate: play on load (use for the page banner). Otherwise it plays once when scrolled into view.
// - delay: extra wait in ms before the first word.
// Respects "reduce motion": the text just shows normally.
export default function WordReveal({ text, as = 'p', className = '', delay = 0, immediate = false }) {
  const ref = useRef(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [on, setOn] = useState(reduce);

  useEffect(() => {
    if (reduce) return;
    if (immediate) { const t = setTimeout(() => setOn(true), 60); return () => clearTimeout(t); }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [immediate, reduce]);

  const words = text.split(' ');
  const step = Math.min(45, 1400 / words.length); // long paragraphs speed up so the whole reveal stays under ~1.5s

  return createElement(as, { ref, className },
    <span className="sr-only">{text}</span>,
    <span aria-hidden="true">
      {words.map((w, i) => <Fragment key={i}>
        <span style={{
          display: 'inline-block',
          opacity: on ? 1 : 0,
          transform: on ? 'none' : 'translateY(0.6em)',
          filter: on ? 'none' : 'blur(6px)',
          transition: 'opacity .6s ease, transform .6s cubic-bezier(.2,.7,.2,1), filter .6s ease',
          transitionDelay: `${delay + i * step}ms`,
        }}>{w}</span>{i < words.length - 1 ? ' ' : ''}
      </Fragment>)}
    </span>
  );
}