import { useEffect, useRef, useState } from 'react';
import { CheckCircle, ChevronRight, Heart, Sparkles, Users, Calendar, MapPin, Award, Star, Clock, Eye, Gift, Shield } from 'lucide-react';
import Confetti from '../components/Confetti';
import FloatingDots from '../components/FloatingDots';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact' | 'premium';

interface AboutProps {
  onNavigate: (page: Page) => void;
}

const values = [
  {
    title: 'Intentionality',
    desc: 'Every element we choose serves a purpose. Nothing is accidental — from the scent in the room to the order of the evening, each detail is thoughtfully considered.',
    icon: Sparkles,
  },
  {
    title: 'Discretion',
    desc: 'Your celebration is personal. We handle your plans, your vendors and your guests with the utmost care and confidentiality. Your privacy is paramount to us.',
    icon: Shield,
  },
  {
    title: 'Excellence',
    desc: 'We hold ourselves to a standard of excellence that shows up in every vendor call, site visit and timeline review. Good enough is never our destination.',
    icon: Award,
  },
  {
    title: 'Warmth',
    desc: 'Behind every beautiful event is a team that genuinely cares. We invest in your joy because your memories matter to us. Relationships come first.',
    icon: Heart,
  },
];


const stats = [
  { number: '200+', label: 'Events Executed', desc: 'Weddings, birthdays, and celebrations' },
  { number: '3+', label: 'Years Experience', desc: 'In the event planning industry' },
  { number: '50+', label: 'Trusted Vendors', desc: 'In our curated network' },
  { number: '100%', label: 'Client Satisfaction', desc: 'Is our unwavering commitment' },
];

const highlights = [
  'Trusted by 200+ clients across Nigeria',
  'Based in Kwara State, serving beyond',
  'Full-service planning & design studio',
  'Award-winning event experiences',
  'Personalized approach to every event',
];

const differentiators = [
  {
    icon: Users,
    title: 'Client-First Philosophy',
    desc: 'Your vision drives everything we do. We listen deeply, understand fully, and execute faithfully to your dreams, not a template.',
  },
  {
    icon: Eye,
    title: 'Design Excellence',
    desc: 'Our aesthetic sensibility sets us apart. We create visually stunning environments that photograph beautifully and feel magical.',
  },
  {
    icon: MapPin,
    title: 'Local Expertise',
    desc: 'Deep knowledge of Kwara venues, vendors, and logistics means smoother execution and better outcomes for your event.',
  },
  {
    icon: Gift,
    title: 'Thoughtful Details',
    desc: 'It is the little things that make events memorable. We obsess over details others miss, creating moments of surprise and delight.',
  },
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

export default function About({ onNavigate }: AboutProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const navigate = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const storyRef = useReveal();
  const statsRef = useReveal();
  const valuesRef = useReveal();
  const differentiatorsRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div>
      <Confetti style="gold" active={showConfetti} />
      <section className="page-hero text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,33,160,0.4)_0%,transparent_70%)]" />
        <FloatingDots color="gold" count={30} size="md" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in-up">Our Story</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4 opacity-0 animate-fade-in-up-2">About BELSH</h1>
          <div className="section-divider" />
          <p className="text-white/80 text-lg max-w-xl mx-auto mt-4 opacity-0 animate-fade-in-up-3">
            Born from a love of people, celebration, and the beauty of well-curated spaces.
          </p>
        </div>
      </section>

      {/* Story Section */}
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
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent" />
            </div>
          </div>

          <div className="scroll-reveal-right">
            <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">How It Began</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
              Celebrations that feel{' '}
              <span className="italic text-gold-300">like coming home.</span>
            </h2>
            <div className="space-y-5 text-white/80 leading-relaxed">
              <p>
                Events By BELSH began with a simple belief: that every celebration, no matter its size,
                deserves to be extraordinary. Founded in Kwara State by a team passionate about bringing
                joy through beautifully crafted experiences, we started by planning intimate
                family gatherings — and quickly grew through word of mouth.
              </p>
              <p>
                Our founder noticed that many event companies focused on volume over quality, delivering
                cookie-cutter solutions that left hosts feeling like their special day was just another
                booking. We set out to change that narrative — to create an event planning studio where
                each client feels heard, each event feels unique, and every detail matters.
              </p>
              <p>
                We do not do cookie-cutter events. Every client engagement starts with a conversation
                about you — your guests, your preferences, your story, and what you want people to feel
                when they walk into the room. From there, we craft experiences that are authentically yours.
              </p>
              <p>
                Today, we serve clients across Kwara State and beyond, managing everything from
                intimate 20-person dinners to 500-guest wedding receptions. But regardless of scale,
                our commitment remains the same: exceptional service, thoughtful design, and celebrations
                that create lasting memories.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-dark-border/50">
              <div className="space-y-3">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-gold-400 shrink-0" />
                    <span className="text-white/90 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-purple-900/50 border-y border-dark-border" ref={statsRef}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ number, label, desc }, i) => (
              <div key={label} className={`text-center scroll-reveal delay-${i + 1}`}>
                <p className="font-serif text-4xl md:text-5xl text-gold-400 mb-2">{number}</p>
                <p className="text-white font-medium mb-1">{label}</p>
                <p className="text-white/70 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32" ref={valuesRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 scroll-reveal">
            <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">What Drives Us</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white">Our Values</h2>
            <p className="text-white/70 mt-4 max-w-xl mx-auto">
              These principles guide every decision we make, every event we plan, and every relationship we build.
            </p>
            <div className="section-divider" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ title, desc, icon: Icon }, i) => (
              <div key={title} className={`glass-card gold-border rounded-xl p-7 hover:-translate-y-2 transition-all duration-500 scroll-reveal delay-${i + 1}`}>
                <div className="w-10 h-10 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-gold-400" />
                </div>
                <h3 className="font-serif text-xl text-gold-300 mb-3">{title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Differentiators */}
      <section className="py-24 md:py-32" ref={differentiatorsRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 scroll-reveal">
            <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">The BELSH Difference</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white">What Sets Us Apart</h2>
            <p className="text-white/70 mt-4 max-w-xl mx-auto">
              In a world of event planners, we stand out by putting you first.
            </p>
            <div className="section-divider" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {differentiators.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`scroll-reveal delay-${i + 1}`}>
                <div className="glass-card gold-border rounded-xl p-8 flex gap-5 hover:-translate-y-1 transition-all duration-500">
                  <div className="w-12 h-12 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center shrink-0">
                    <Icon size={22} className="text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-white mb-2">{title}</h3>
                    <p className="text-white/80 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Quote */}
      <section className="py-24 bg-purple-900/50 border-y border-dark-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <blockquote className="relative">
            <span className="absolute -top-8 -left-4 text-8xl text-gold-400/10 font-serif">"</span>
            <p className="font-serif text-2xl md:text-3xl text-white leading-relaxed italic">
              Every celebration tells a story. Our job is to make sure yours is unforgettable.
            </p>
            <footer className="mt-8">
              <p className="text-gold-400 text-sm tracking-widest uppercase">The BELSH Philosophy</p>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center" ref={ctaRef}>
        <div className="max-w-2xl mx-auto px-6 scroll-reveal">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
            Let us create something beautiful together.
          </h2>
          <p className="text-white/80 mb-10">
            We would love to be part of your next celebration. Reach out today and let's start planning something extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('contact')} className="btn-gold">
              Get in Touch
              <ChevronRight size={16} />
            </button>
            <button onClick={() => navigate('portfolio')} className="btn-outline-gold">
              See Our Work
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
