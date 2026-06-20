import { useEffect, useRef } from 'react';
import { Heart, Star, Award, Camera, Music, Utensils, ChevronRight } from 'lucide-react';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact';

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

interface ServicesProps {
  onNavigate: (page: Page) => void;
}

const services = [
  {
    icon: Heart,
    title: 'Wedding Planning',
    tagline: 'Your love story, beautifully told.',
    description:
      'From intimate ceremonies to grand receptions, we handle every detail with grace and precision. Venue selection, vendor management, timeline coordination, decor design — all tailored to your vision.',
    includes: [
      'Venue sourcing & booking',
      'Vendor coordination',
      'Custom decor design',
      'Full day-of management',
      'Rehearsal coordination',
      'Guest experience planning',
    ],
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    icon: Star,
    title: 'Birthday Celebrations',
    tagline: 'Milestone moments deserve milestone settings.',
    description:
      'A surprise party, a milestone birthday gala or an intimate dinner with close friends — we craft experiences that feel elevated, personal and truly celebratory.',
    includes: [
      'Theme development',
      'Entertainment booking',
      'Custom styling & decor',
      'Catering coordination',
      'Photography & videography',
      'Surprise element planning',
    ],
    image: 'https://images.pexels.com/photos/2072181/pexels-photo-2072181.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    icon: Award,
    title: 'Private & Corporate Events',
    tagline: 'Exclusivity crafted with intention.',
    description:
      'Executive dinners, product launches, anniversaries and other private gatherings — executed with the discretion, sophistication and attention to detail your guest list demands.',
    includes: [
      'Concept & mood board creation',
      'Venue arrangement',
      'Guest management',
      'Branded decor & signage',
      'AV & technical setup',
      'Post-event wrap-up',
    ],
    image: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

const addons = [
  { icon: Camera, label: 'Photography & Videography' },
  { icon: Music, label: 'Live Entertainment' },
  { icon: Utensils, label: 'Bespoke Catering' },
];

export default function Services({ onNavigate }: ServicesProps) {
  const navigate = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const servicesRef = useReveal();
  const addonsRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div>
      <section className="page-hero text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,33,160,0.4)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in-up">What We Offer</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-purple-50 mb-4 opacity-0 animate-fade-in-up-2">Our Services</h1>
          <div className="section-divider" />
          <p className="text-purple-300/80 text-lg max-w-xl mx-auto mt-4">
            Every celebration is unique. We offer bespoke planning packages tailored to your occasion, budget and vision.
          </p>
        </div>
      </section>

      <section className="py-24 md:py-28" ref={servicesRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-24">
          {services.map(({ icon: Icon, title, tagline, description, includes, image }, i) => (
            <div key={title} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className={`relative group scroll-reveal-${i % 2 === 0 ? 'left' : 'right'} ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="absolute -inset-4 bg-gradient-to-br from-gold-700/10 to-purple-700/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative glass-card rounded-2xl overflow-hidden aspect-[4/3]">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="w-12 h-12 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center mb-6">
                  <Icon size={22} className="text-gold-400" />
                </div>
                <p className="text-gold-400 text-xs tracking-widest uppercase mb-2">{tagline}</p>
                <h2 className="font-serif text-3xl md:text-4xl text-purple-50 mb-5">{title}</h2>
                <p className="text-purple-300/80 leading-relaxed mb-7">{description}</p>
                <ul className="grid grid-cols-2 gap-2 mb-8">
                  {includes.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-purple-200/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('contact')} className="btn-gold">
                  Enquire Now
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-purple-900/50 border-y border-dark-border" ref={addonsRef}>
        <div className="max-w-4xl mx-auto px-6 text-center scroll-reveal">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">Enhance Your Event</p>
          <h3 className="font-serif text-2xl md:text-3xl text-purple-50 mb-10">Optional Add-ons</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {addons.map(({ icon: Icon, label }, i) => (
              <div key={label} className={`glass-card gold-border rounded-xl px-6 py-4 flex items-center gap-3 scroll-reveal delay-${i + 1}`}>
                <Icon size={18} className="text-gold-400" />
                <span className="text-purple-200 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 text-center" ref={ctaRef}>
        <div className="max-w-2xl mx-auto px-6 scroll-reveal">
          <h2 className="font-serif text-3xl md:text-4xl text-purple-50 mb-4">Not sure which package is right?</h2>
          <p className="text-purple-300/80 mb-10">A free consultation call is the best place to start.</p>
          <button onClick={() => navigate('contact')} className="btn-gold">
            Book a Free Consultation
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
