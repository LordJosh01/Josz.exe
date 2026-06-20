import { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact';
type Filter = 'All' | 'Wedding' | 'Birthday' | 'Private';

interface PortfolioProps {
  onNavigate: (page: Page) => void;
}

const items = [
  {
    title: 'Golden Anniversary Gala',
    category: 'Private',
    location: 'Ilorin, Kwara',
    image: 'https://images.pexels.com/photos/169193/pexels-photo-169193.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'An intimate gold-accented dinner for 50 guests celebrating 50 years of marriage.',
  },
  {
    title: 'Garden Wedding Ceremony',
    category: 'Wedding',
    location: 'Ilorin, Kwara',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'Lush garden ceremony with soft florals and a romantic candlelit reception.',
  },
  {
    title: 'Candlelit Private Dinner',
    category: 'Private',
    location: 'Kwara',
    image: 'https://images.pexels.com/photos/7505355/pexels-photo-7505355.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A soft, romantic dinner styled around candlelight and warm neutral florals.',
  },
  {
    title: 'Sweet 16 Soiree',
    category: 'Birthday',
    location: 'Ilorin, Kwara',
    image: 'https://images.pexels.com/photos/3171770/pexels-photo-3171770.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A pastel fairytale celebration with personalised stations and a custom dessert wall.',
  },
  {
    title: 'Intimate Wedding Luncheon',
    category: 'Wedding',
    location: 'Kwara',
    image: 'https://images.pexels.com/photos/1128782/pexels-photo-1128782.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'An elegant midday reception with bespoke florals and a warm, curated menu.',
  },
  {
    title: 'Milestone Birthday Dinner',
    category: 'Birthday',
    location: 'Ilorin, Kwara',
    image: 'https://images.pexels.com/photos/2072181/pexels-photo-2072181.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A regal 50th birthday celebration with live music and a 5-course dinner.',
  },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll('.scroll-reveal, .scroll-reveal-scale');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Portfolio({ onNavigate }: PortfolioProps) {
  const [active, setActive] = useState<Filter>('All');
  const filters: Filter[] = ['All', 'Wedding', 'Birthday', 'Private'];
  const galleryRef = useReveal();
  const ctaRef = useReveal();

  const filtered = active === 'All' ? items : items.filter((i) => i.category === active);

  const navigate = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <section className="page-hero text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,33,160,0.4)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in-up">Our Work</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-purple-50 mb-4 opacity-0 animate-fade-in-up-2">Portfolio</h1>
          <div className="section-divider" />
          <p className="text-purple-300/80 text-lg max-w-xl mx-auto mt-4 opacity-0 animate-fade-in-up-3">
            A curated selection of the celebrations we have had the privilege of creating.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28" ref={galleryRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-14 scroll-reveal">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-6 py-2 text-sm uppercase tracking-widest rounded-full transition-all duration-300 ${
                  active === f
                    ? 'bg-gold-500 text-dark font-medium shadow-lg shadow-gold-900/30'
                    : 'glass-card gold-border text-purple-300 hover:text-gold-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <div
                key={item.title}
                className={`group relative glass-card gold-border rounded-2xl overflow-hidden scroll-reveal-scale delay-${Math.min(i + 1, 5)}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-95 group-hover:scale-108 transition-all duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                    <span className="text-gold-400 text-xs uppercase tracking-widest">{item.category} · {item.location}</span>
                    <h3 className="font-serif text-xl text-purple-50 mt-1 mb-2">{item.title}</h3>
                    <p className="text-purple-300/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-purple-900/50 border-t border-dark-border text-center" ref={ctaRef}>
        <div className="max-w-2xl mx-auto px-6 scroll-reveal">
          <h2 className="font-serif text-3xl md:text-4xl text-purple-50 mb-4">Imagine your event here.</h2>
          <p className="text-purple-300/80 mb-10">Let us build your dream celebration together.</p>
          <button onClick={() => navigate('contact')} className="btn-gold">
            Start Planning
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
