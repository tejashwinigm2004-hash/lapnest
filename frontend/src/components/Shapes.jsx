// A few thin gold frames that tumble slowly in 3D behind the content of a section.
const S = [[60, '8%', '12%', 14], [34, '22%', '78%', 18], [90, '62%', '6%', 22], [44, '70%', '88%', 16], [26, '40%', '52%', 12]];
export default function Shapes({ className = '' }) {
  return <div aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ perspective: 700 }}>
    {S.map(([s, t, l, d], i) => <span key={i} className="shape" style={{ width: s, height: s, top: t, left: l, animationDuration: `${d}s`, animationDelay: `-${i * 2}s` }} />)}</div>;
}