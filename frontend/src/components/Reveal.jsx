import { useEffect, useRef } from 'react';
// Fades and slides an element up the first time it scrolls into view. One shared observer keeps it light.
let io;
const watch = () => io ||= new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; const el = e.target, d = parseFloat(el.style.transitionDelay) || 0;
  el.classList.add('in'); io.unobserve(el);
  setTimeout(() => { el.classList.remove('rv', 'in'); el.style.transitionDelay = ''; }, (d + 0.9) * 1000); // hand control back so hover effects stay instant
}), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => { const el = ref.current; watch().observe(el); return () => io && io.unobserve(el); }, []);
  return <Tag ref={ref} className={`rv ${className}`} style={{ transitionDelay: `${delay}s` }} {...rest}>{children}</Tag>;
}