import { useState } from 'react'; import { Laptop } from 'lucide-react';
export default function ProductImage({ p, className = '' }) {
  const [bad, setBad] = useState(!p.images?.[0]);
  return bad ? <div className={`bg-soft flex flex-col items-center justify-center text-slate-400 ${className}`}><Laptop size={40} /><span className="text-xs mt-1">{p.brand}</span></div>
    : <img src={p.images[0]} alt={p.name} loading="lazy" onError={() => setBad(true)} className={`object-cover ${className}`} />;
}