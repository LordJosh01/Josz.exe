import { useEffect, useRef } from 'react';
import { ChevronRight, Heart, Star, Award, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const stats = [
  { value: '200+', label: 'Events Delivered' },
  { value: '3+', label: 'Years Experience' },
  { value: '100%', label: 'Client Satisfaction' },
];

const serviceCards = [
  {
    icon: Heart,
    title: 'Wedding Planning',
    desc: 'Full-service wedding coordination from engagement through send-off. Every detail thoughtfully managed so you stay present.',
    page: 'services' as Page,
  },
  {
    icon: Star,
    title: 'Birthday Celebrations',
    desc: 'Milestone birthdays, surprise parties and intimate dinners elevated far beyond the ordinary.',
    page: 'services' as Page,
  },
  {
    icon: Award,
    title: 'Private & Corporate',
    desc: 'Corporate dinners, anniversaries, bridal showers and exclusive gatherings styled with discernment.',
    page: 'services' as Page,
  },
];

const process = [
  {
    number: '01',
    icon: Sparkles,
    title: 'Discover',
    desc: 'A free consultation to understand your celebration, your guests, and what emotion you want the room to hold.',
  },
  {
    number: '02',
    icon: Heart,
    title: 'Design',
    desc: 'Mood boards, floor plans, vendor shortlists and a clear written proposal — no surprises, just vision.',
  },
  {
    number: '03',
    icon: CheckCircle,
    title: 'Deliver',
    desc: 'Our team runs the day end-to-end so you and your loved ones stay fully present. Calm, on-time, on-brand.',
  },
];

const whyUs = [
  'Personalised to your culture and style',
  'Trusted vendor network across Kwara',
  'Transparent pricing — no hidden fees',
  'Dedicated coordinator from day one',
  'On-site team for every event',
  'Full contingency planning included',
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
        });
      },
      { threshold: 0.08 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Home({ onNavigate }: HomeProps) {
  const navigate = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const statsRef = useReveal();
  const introRef = useReveal();
  const servicesRef = useReveal();
  const processRef = useReveal();
  const whyRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div>
      {/* ---- HERO ---- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-purple-glow" />
        <div className="absolute top-1/4 -left-48 w-[500px] h-[500px] bg-purple-700/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold-900/8 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 text-center pt-28 pb-16">
          {/* Logo */}
          <div className="flex justify-center mb-8 opacity-0 animate-scale-in">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold-500/15 blur-2xl scale-150 animate-glow-pulse" />
              <img
                src="/EVENT_BY_BELSH.jpg"
                alt="Events By BELSH"
                className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain rounded-full ring-4 ring-gold-500/50 shadow-2xl shadow-gold-900/60 animate-float"
              />
            </div>
          </div>

          {/* Eyebrow */}
          <div className="opacity-0 animate-fade-in-up mb-5">
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-gold-400 font-medium px-5 py-2 border border-gold-500/30 rounded-full glass-dark">
              <Sparkles size={12} className="text-gold-500" />
              Boutique Event Planning &amp; Design · Kwara
              <Sparkles size={12} className="text-gold-500" />
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-purple-50 mb-6 opacity-0 animate-fade-in-up-2 leading-[1.1]">
            The Art of Celebration{' '}
            <br className="hidden sm:block" />
            <span className="italic gold-text">Redefined.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-purple-300/90 max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in-up-3 font-light leading-relaxed">
            Weddings, birthdays and private celebrations crafted with intention — for families and individuals who believe their moments deserve to be extraordinary.
          </p>

          {/* CTAs */}
          <div className="opacity-0 animate-fade-in-up-4 flex flex-col xs:flex-row gap-4 justify-center">
            <button onClick={() => navigate('contact')} className="btn-gold text-xs sm:text-sm">
              Start Planning
              <ChevronRight size={18} />
            </button>
            <button onClick={() => navigate('portfolio')} className="btn-outline-gold text-xs sm:text-sm">
              View Our Work
            </button>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-gradient-to-b from-gold-500 to-transparent" />
          <span className="text-[10px] text-gold-400 tracking-[0.25em] uppercase">Scroll</span>
        </div>
      </section>

      {/* ---- STATS ---- */}
      <section className="py-14 bg-purple-900/70 border-y border-dark-border" ref={statsRef}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 sm:gap-12 text-center">
          {stats.map((s, i) => (
            <div key={s.label} className={`scroll-reveal delay-${i + 1}`}>
              <p className="font-serif text-2xl sm:text-3xl md:text-4xl gold-text mb-1">{s.value}</p>
              <p className="text-purple-300 text-[10px] sm:text-xs uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- INTRO ---- */}
      <section className="py-20 md:py-32" ref={introRef}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="scroll-reveal-left">
            <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">Who We Are</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-purple-50 mb-6">
              Quiet luxury,{' '}
              <span className="italic text-gold-300">warmly hosted.</span>
            </h2>
            <p className="text-purple-300/80 leading-relaxed mb-4">
              Events By BELSH is a boutique planning and design studio based in Kwara State. We create celebrations that feel deeply personal and visually extraordinary — for families and individuals who believe that every moment deserves to be remembered.
            </p>
            <p className="text-purple-300/80 leading-relaxed mb-8">
              From intimate dinners for 10 to grand wedding receptions for 500, we bring the same level of care, attention and artistry to every celebration we touch.
            </p>
            <div className="flex flex-col xs:flex-row gap-4">
              <button onClick={() => navigate('about')} className="btn-outline-gold text-xs">
                Our Story
                <ArrowRight size={14} />
              </button>
              <button onClick={() => navigate('services')} className="btn-gold text-xs">
                Our Services
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="relative scroll-reveal-right">
            <div className="absolute -inset-6 bg-gradient-to-br from-gold-700/10 to-purple-700/20 rounded-3xl blur-2xl opacity-70" />
            <div className="relative grid grid-cols-2 gap-3">
              <div className="glass-card rounded-xl overflow-hidden aspect-[3/4] col-span-1 row-span-2">
                <img
                  src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Wedding celebration"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700"
                  loading="lazy"
                />
              </div>
              <div className="glass-card rounded-xl overflow-hidden aspect-square">
                <img
                  src="https://images.pexels.com/photos/7505355/pexels-photo-7505355.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Candlelit dinner"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700"
                  loading="lazy"
                />
              </div>
              <div className="glass-card rounded-xl overflow-hidden aspect-square">
                <img
                  src="https://images.pexels.com/photos/169193/pexels-photo-169193.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Elegant table setting"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700"
                  loading="lazy"
                />
              </div>
            </div>
            {/* Badge */}
            <div className="absolute -bottom-4 -right-4 glass-dark border border-gold-500/30 rounded-xl px-4 py-3 shadow-xl">
              <p className="text-gold-300 text-xs tracking-widest uppercase">Est. in Kwara</p>
              <p className="font-serif text-xl text-purple-50">3+ Years</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- SERVICES ---- */}
      <section className="py-20 bg-purple-900/40 border-y border-dark-border" ref={servicesRef}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="text-center mb-14 scroll-reveal">
            <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">What We Offer</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-purple-50">Our Services</h2>
            <div className="section-divider" />
            <p className="text-purple-300/70 text-sm max-w-xl mx-auto mt-2">
              From intimate gatherings to grand productions — we tailor every service to your occasion.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {serviceCards.map(({ icon: Icon, title, desc, page }, i) => (
              <button
                key={title}
                onClick={() => navigate(page)}
                className={`glass-card gold-border rounded-xl p-7 sm:p-8 text-left group event-card scroll-reveal delay-${i + 1}`}
              >
                <div className="w-11 h-11 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center mb-5 group-hover:border-gold-400/70 group-hover:bg-gold-800/40 group-hover:scale-110 transition-all duration-300">
                  <Icon size={20} className="text-gold-400" />
                </div>
                <h3 className="font-serif text-xl text-purple-50 mb-3">{title}</h3>
                <p className="text-purple-300/80 text-sm leading-relaxed mb-4">{desc}</p>
                <span className="text-gold-400 text-xs uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                  Learn more <ArrowRight size={12} />
                </span>
              </button>
            ))}
          </div>
          <div className="text-center mt-10 scroll-reveal">
            <button onClick={() => navigate('services')} className="btn-gold text-xs">
              View All Services
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ---- PROCESS ---- */}
      <section className="py-20 md:py-28" ref={processRef}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="text-center mb-14 scroll-reveal">
            <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">How We Work</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-purple-50">A Simple Three-Phase Process</h2>
            <div className="section-divider" />
            <p className="text-purple-300/70 text-sm max-w-xl mx-auto mt-2">
              Clear from the first call through to the last guest leaving.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {process.map(({ number, icon: Icon, title, desc }, i) => (
              <div key={title} className={`relative glass-card gold-border rounded-2xl p-7 sm:p-8 scroll-reveal delay-${i + 1}`}>
                <div className="absolute top-6 right-6 font-serif text-4xl text-purple-800/50 leading-none">{number}</div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-700/30 to-gold-500/10 border border-gold-600/30 flex items-center justify-center mb-5">
                  <Icon size={22} className="text-gold-400" />
                </div>
                <h3 className="font-serif text-2xl text-purple-50 mb-3">{title}</h3>
                <p className="text-purple-300/80 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- WHY US ---- */}
      <section className="py-16 bg-purple-900/50 border-y border-dark-border" ref={whyRef}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 grid lg:grid-cols-2 gap-10 items-center">
          <div className="scroll-reveal-left">
            <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">Why Choose Us</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-purple-50 mb-4">
              We show up, so you{' '}
              <span className="italic text-gold-300">don't have to worry.</span>
            </h2>
            <p className="text-purple-300/80 leading-relaxed">
              Our clients choose BELSH Events because they know they are in safe, experienced hands. From the first consultation to the final clean-up, we carry the weight of every logistical detail — so you can be fully present for the people and moments that matter.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 scroll-reveal-right">
            {whyUs.map((item, i) => (
              <div key={item} className={`flex items-start gap-3 glass-card gold-border rounded-lg p-4 scroll-reveal delay-${Math.min(i + 1, 6)}`}>
                <CheckCircle size={16} className="text-gold-400 mt-0.5 shrink-0" />
                <span className="text-purple-200 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA BANNER ---- */}
      <section className="py-20 md:py-28 relative overflow-hidden" ref={ctaRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-900 to-purple-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,160,23,0.1)_0%,transparent_65%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-6 text-center scroll-reveal">
          <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto mb-8">
            <Sparkles size={26} className="text-gold-400" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-purple-50 mb-4 leading-tight">
            Ready to create something{' '}
            <span className="italic text-gold-300">unforgettable?</span>
          </h2>
          <p className="text-purple-300/80 mb-10 max-w-xl mx-auto text-sm sm:text-base">
            We would love to hear about your vision. Reach out for a free 30-minute consultation — no pressure, just a conversation.
          </p>
          <div className="flex flex-col xs:flex-row gap-4 justify-center">
            <button onClick={() => navigate('contact')} className="btn-gold text-xs sm:text-sm">
              Book a Free Consultation
              <ChevronRight size={18} />
            </button>
            <button onClick={() => navigate('portfolio')} className="btn-outline-gold text-xs sm:text-sm">
              See Our Work
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
