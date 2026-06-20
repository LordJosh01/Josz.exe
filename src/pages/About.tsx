import { useEffect, useRef } from 'react';
import { CheckCircle, ChevronRight } from 'lucide-react';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact';

interface AboutProps {
  onNavigate: (page: Page) => void;
}

const values = [
  {
    title: 'Intentionality',
    desc: 'Every element we choose serves a purpose. Nothing is accidental — from the scent in the room to the order of the evening.',
  },
  {
    title: 'Discretion',
    desc: 'Your celebration is personal. We handle your plans, your vendors and your guests with the utmost care and confidentiality.',
  },
  {
    title: 'Excellence',
    desc: 'We hold ourselves to a standard of excellence that shows up in every vendor call, site visit and timeline review.',
  },
  {
    title: 'Warmth',
    desc: 'Behind every beautiful event is a team that genuinely cares. We invest in your joy because your memories matter to us.',
  },
];

const highlights = ['Trusted by 200+ clients', 'Based in Kwara State', 'Full-service planning & design'];

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

export default function About({ onNavigate }: AboutProps) {
  const navigate = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const storyRef = useReveal();
  const valuesRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div>
      <section className="page-hero text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,33,160,0.4)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in-up">Our Story</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-purple-50 mb-4 opacity-0 animate-fade-in-up-2">About BELSH</h1>
          <div className="section-divider" />
          <p className="text-purple-300/80 text-lg max-w-xl mx-auto mt-4 opacity-0 animate-fade-in-up-3">
            Born from a love of people, celebration, and the beauty of well-curated spaces.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 md:py-32" ref={storyRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative group scroll-reveal-left">
            <div className="absolute -inset-4 bg-gradient-to-br from-gold-700/10 to-purple-700/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative glass-card rounded-2xl overflow-hidden aspect-[3/4]">
              <img
                src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Elegant event by BELSH"
                className="w-full h-full object-cover opacity-70 hover:opacity-90 hover:scale-105 transition-all duration-700"
                loading="lazy"
              />
            </div>
          </div>

          <div className="scroll-reveal-right">
            <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">How It Began</p>
            <h2 className="font-serif text-3xl md:text-4xl text-purple-50 mb-6">
              Celebrations that feel{' '}
              <span className="italic text-gold-300">like coming home.</span>
            </h2>
            <p className="text-purple-300/80 leading-relaxed mb-5">
              Events By BELSH began with a simple belief: that every celebration, no matter its size,
              deserves to be extraordinary. Founded in Kwara State, we started by planning intimate
              family gatherings — and quickly grew through word of mouth.
            </p>
            <p className="text-purple-300/80 leading-relaxed mb-5">
              We do not do cookie-cutter events. Every client engagement starts with a conversation
              about you, your guests, and what you want them to feel when they walk into the room.
            </p>
            <p className="text-purple-300/80 leading-relaxed mb-8">
              Today, we serve clients across Kwara State and beyond, managing everything from
              intimate 20-person dinners to 500-guest wedding receptions.
            </p>
            <div className="space-y-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-gold-400 shrink-0" />
                  <span className="text-purple-200 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-purple-900/50 border-y border-dark-border" ref={valuesRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 scroll-reveal">
            <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">What Drives Us</p>
            <h2 className="font-serif text-3xl md:text-4xl text-purple-50">Our Values</h2>
            <div className="section-divider" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ title, desc }, i) => (
              <div key={title} className={`glass-card gold-border rounded-xl p-7 hover:-translate-y-2 transition-all duration-500 scroll-reveal delay-${i + 1}`}>
                <h3 className="font-serif text-xl text-gold-300 mb-3">{title}</h3>
                <p className="text-purple-300/80 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center" ref={ctaRef}>
        <div className="max-w-2xl mx-auto px-6 scroll-reveal">
          <h2 className="font-serif text-3xl md:text-4xl text-purple-50 mb-4">
            Let us create something beautiful together.
          </h2>
          <p className="text-purple-300/80 mb-10">We would love to be part of your next celebration.</p>
          <button onClick={() => navigate('contact')} className="btn-gold">
            Get in Touch
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
