import { ShieldCheck, Tag, Phone } from 'lucide-react'; import { biz } from '../config'; import Reveal from '../components/Reveal';

// ===== EDIT: the "Who we are" text. Each line is one paragraph. =====
const ABOUT = [
  'At LapNest, we provide reliable and flexible IT solutions to help businesses operate efficiently and grow with confidence. We specialize in laptop rentals, IT hardware procurement, software solutions, and genuine software licensing to meet the diverse technology needs of businesses, startups, and enterprises.',
  'Our services go beyond laptop rentals. We help organizations access essential business software, cybersecurity solutions, productivity tools, and network infrastructure licenses from trusted technology providers.',
  'Our offerings include laptop and IT equipment rentals, Microsoft Office 365, GoTo solutions, CrowdStrike cybersecurity solutions, Aruba networking licenses, and other enterprise software and licensing services.',
  'At LapNest, we focus on delivering cost-effective solutions, flexible rental options, dependable service, and technology that supports your business goals. Whether you need laptops for a growing team, software licenses for daily operations, or networking and security solutions for your IT infrastructure, we aim to make technology procurement simple and hassle-free.',
];
const ABOUT_CLOSING = 'LapNest – Your Trusted Partner for IT Hardware, Software and Licensing Solutions.';

// ===== EDIT: team members. Separate paragraphs in a bio with a blank line (\n\n). =====
const TEAM = [
  {
    name: 'Teja K H', role: 'Managing Director',
    bio: 'Teja K H is a Managing Director of LapNest and sets the direction of the business. The idea behind LapNest is simple: students, startups and teams should be able to get a good laptop without paying full price.\n\nThat idea guides every decision, from which laptops are offered to how rent and prices are explained, so a customer always knows what they are getting.',
  },
  {
    name: 'Jeevan NL', role: 'Managing Director',
    bio: 'Jeevan NL is a Managing Director of LapNest and focuses on laptop quality. Every laptop is checked before it goes out, so what reaches the customer is ready to use from day one.\n\nWhether it is rented for a week or a month, or bought outright, the standard stays the same: a laptop that works the way it should.',
  },
  {
    name: 'Vasanth Reddy', role: 'Shareholder',
    bio: 'Vasanth Reddy is a Shareholder of LapNest and has backed the business from the start. He believes that companies of every size should be able to get dependable IT hardware and genuine software without a heavy upfront cost.\n\nHis focus is on growth that lasts: building partnerships with trusted technology providers and making sure LapNest keeps its prices clear and its promises kept as it grows.',
  },
  {
    name: 'Kalpana G', role: 'Shareholder',
    bio: 'Kalpana G is a Shareholder of LapNest and cares most about the long-term trust the company builds with its customers. For her, a good IT partner is one that is still reliable years after the first order.\n\nShe encourages the team to put service first: honest advice, quick answers and support that continues well after delivery.',
  },
  {
    name: 'Gangothri V', role: 'Accounts',
    bio: 'Gangothri V looks after accounts at LapNest, keeping the numbers behind every order accurate and easy to follow.\n\nThat includes the invoices with GST details that customers download from their account, and the refundable security deposits collected when a laptop is rented and returned after it is checked.',
  },
];

const POINTS = [
  [ShieldCheck, 'Checked before it goes out', 'Every laptop is checked before it goes out.'],
  [Tag, 'Clear pricing', 'Rent, deposit and GST are shown before you order.'],
  [Phone, 'We are a call away', 'Call or message us if anything goes wrong.'],
];

const initials = n => n.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();

export default function About() {
  return <>
    {/* Banner */}
    <section className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(120deg,var(--color-brand) 0%,#B93C0A 100%)' }}>
      <div aria-hidden="true" className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-white/10" />
      <div aria-hidden="true" className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-white/10" />
      <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-28 md:pt-24 md:pb-36">
        <p className="inline-block rounded-full border border-white/40 bg-white/10 px-4 py-1 text-sm font-medium">About us</p>
        <h1 className="mt-4 text-4xl md:text-6xl font-bold leading-[1.1] !text-white">About {biz.name}</h1>
        {biz.tagline && <p className="mt-4 text-lg md:text-xl opacity-90 max-w-xl">{biz.tagline}</p>}
      </div>
      <svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-12 md:h-20 block"><path d="M0 80V40C240 0 480 0 720 30S1200 70 1440 30V80Z" fill="#FAFAF9" /></svg>
    </section>

    {/* Intro */}
    <section className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-10 items-start">
      <Reveal>
        <h2 className="text-3xl font-bold text-ink">Who we are</h2>
        <div className="band mt-2 w-14 h-3.5" style={{ backgroundPosition: 'left center' }} aria-hidden="true" />
        <div className="mt-5 space-y-4 text-lg leading-8">
          {ABOUT.map((t, i) => <p key={i}>{t}</p>)}
          <p className="font-semibold text-ink">{ABOUT_CLOSING}</p>
        </div>
      </Reveal>
      <div className="grid gap-4">
        {POINTS.map(([I, t, d], i) => <Reveal key={t} delay={i * 0.1}>
          <div className="lift flex items-start gap-4 bg-white border border-sand rounded-2xl p-5 shadow-sm">
            <span className="shrink-0 w-12 h-12 rounded-xl bg-soft text-brand grid place-items-center"><I size={24} /></span>
            <div><p className="font-semibold text-ink">{t}</p><p className="text-sm mt-1">{d}</p></div></div></Reveal>)}
      </div>
    </section>

    {/* Team */}
    <section className="bg-soft">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <Reveal className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-ink">Our Team</h2>
          <div className="band mx-auto mt-2 w-24 h-3.5" aria-hidden="true" />
        </Reveal>
        <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-14">
          {TEAM.map((m, i) => <Reveal key={m.name} delay={i * 0.08} className="w-full sm:w-[calc(50%_-_0.75rem)] lg:w-[calc(33.333%_-_1rem)]">
            <article className="lift relative h-full bg-white border border-sand shadow-sm rounded-t-[3.5rem] rounded-b-2xl px-8 pb-8 pt-14 text-center">
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 w-[4.5rem] h-[4.5rem] rounded-full grid place-items-center text-white text-2xl font-bold border-4 border-white shadow-md" style={{ background: 'linear-gradient(135deg,var(--color-brand),var(--color-gold))' }} aria-hidden="true">{initials(m.name)}</span>
              <h3 className="text-2xl font-semibold text-ink">{m.name}</h3>
              <p className="inline-block mt-3 rounded-full bg-soft px-4 py-1 text-sm font-semibold text-brand">{m.role}</p>
              {m.bio && <div className="mt-5 space-y-4 leading-8 text-left">{m.bio.split('\n\n').map((t, j) => <p key={j}>{t}</p>)}</div>}
            </article></Reveal>)}
        </div>
      </div>
    </section>
  </>;
}