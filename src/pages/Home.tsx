import { useEffect, useRef } from 'react';
import { ChevronRight, Heart, Star, Award } from 'lucide-react';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const stats = [
  { value: '200+', label: 'Events Delivered' },
  { value: '5+', label: 'Years Experience' },
  { value: '100%', label: 'Client Satisfaction' },
];

const serviceCards = [
  { icon: Heart, title: 'Wedding Planning', desc: 'Full-service wedding coordination from engagement through send-off. Every detail thoughtfully managed.' },
  { icon: Star, title: 'Birthday Celebrations', desc: 'Milestone birthdays, surprise parties and intimate dinners elevated beyond the ordinary.' },
  { icon: Award, title: 'Private Events', desc: 'Corporate dinners, anniversaries and exclusive gatherings styled with discernment and precision.' },
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
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
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
  const ctaRef = useReveal();

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-purple-glow" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-900/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
          <div className="flex justify-center mb-10 opacity-0 animate-scale-in">
            <img
              src="/EVENT_BY_BELSH.jpg"
              alt="Events By BELSH"
              className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-full ring-4 ring-gold-500/50 shadow-2xl shadow-gold-900/50 animate-glow-pulse"
            />
          </div>

          <div className="opacity-0 animate-fade-in-up mb-4">
            <span className="inline-block text-xs tracking-[0.3em] uppercase text-gold-400 font-medium px-4 py-1.5 border border-gold-500/30 rounded-full">
              Boutique Event Planning &amp; Design
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-purple-50 mb-6 opacity-0 animate-fade-in-up-2 leading-tight">
            The Art of Celebration{' '}
            <span className="italic gold-text">Redefined.</span>
          </h1>

          <p className="text-lg md:text-xl text-purple-300/90 max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in-up-3 font-light leading-relaxed">
            Weddings, birthdays and private celebrations crafted with intention — in Kwara and beyond.
          </p>

          <div className="opacity-0 animate-fade-in-up-4 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('contact')} className="btn-gold">
              Start Planning
              <ChevronRight size={18} />
            </button>
            <button onClick={() => navigate('portfolio')} className="btn-outline-gold">
              View Our Work
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-px h-10 bg-gradient-to-b from-gold-500 to-transparent" />
          <span className="text-xs text-gold-400 tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-purple-900/60 border-y border-dark-border" ref={statsRef}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={s.label} className={`scroll-reveal delay-${i + 1}`}>
              <p className="font-serif text-3xl md:text-4xl gold-text mb-1">{s.value}</p>
              <p className="text-purple-300 text-xs md:text-sm uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 md:py-32" ref={introRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="scroll-reveal-left">
            <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-5">Who We Are</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-purple-50 mb-6">
              Quiet luxury,{' '}
              <span className="italic text-gold-300">warmly hosted.</span>
            </h2>
            <p className="text-purple-300/80 leading-relaxed mb-5">
              Events By BELSH is a boutique planning and design studio dedicated to creating celebrations
              that feel deeply personal and visually extraordinary.
            </p>
            <p className="text-purple-300/80 leading-relaxed mb-8">
              Based in Kwara State, we work with families and individuals who want their special
              occasions to be remembered — not just attended.
            </p>
            <button onClick={() => navigate('about')} className="btn-outline-gold">
              Our Story
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="relative scroll-reveal-right">
            <div className="absolute -inset-6 bg-gradient-to-br from-gold-700/10 to-purple-700/20 rounded-3xl blur-2xl" />
            <div className="relative glass-card rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.pexels.com/photos/169193/pexels-photo-169193.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Elegant event setup"
                className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 glass-card px-4 py-2 rounded-lg">
                <p className="text-gold-300 text-xs tracking-widest uppercase">Private Dinner · Kwara</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Teaser */}
      <section className="py-24 bg-purple-900/40 border-y border-dark-border" ref={servicesRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 scroll-reveal">
            <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">What We Offer</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-purple-50">Our Services</h2>
            <div className="section-divider" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {serviceCards.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`glass-card gold-border rounded-xl p-8 group hover:-translate-y-2 transition-all duration-500 scroll-reveal delay-${i + 1}`}>
                <div className="w-12 h-12 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center mb-6 group-hover:border-gold-400/60 group-hover:bg-gold-800/40 transition-all duration-300">
                  <Icon size={22} className="text-gold-400" />
                </div>
                <h3 className="font-serif text-xl text-purple-50 mb-3">{title}</h3>
                <p className="text-purple-300/80 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={() => navigate('services')} className="btn-gold scroll-reveal">
              View All Services
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-purple-800 to-purple-900 border-y border-dark-border relative overflow-hidden" ref={ctaRef}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,160,23,0.08)_0%,transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center scroll-reveal">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-purple-50 mb-4">
            Ready to create something{' '}
            <span className="italic text-gold-300">unforgettable?</span>
          </h2>
          <p className="text-purple-300/80 mb-10 max-w-xl mx-auto">
            We would love to hear about your vision. Reach out for a free consultation.
          </p>
          <button onClick={() => navigate('contact')} className="btn-gold">
            Book a Free Consultation
            <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
