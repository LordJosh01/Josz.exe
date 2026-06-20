import { useState, useEffect, useRef } from 'react';
import { Plus, Minus, ChevronRight } from 'lucide-react';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll('.scroll-reveal');
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

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact';

interface FAQProps {
  onNavigate: (page: Page) => void;
}

const faqs = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'How do I start planning my event with BELSH?',
        a: 'Simply reach out via our Contact page, email or WhatsApp. We will schedule a free 30-minute discovery call to understand your vision, timeline and budget. From there, we propose a planning package that fits your needs.',
      },
      {
        q: 'How far in advance should I book?',
        a: 'We recommend booking at least 3-6 months in advance for weddings and large events, and 4-8 weeks for smaller gatherings. That said, we occasionally accommodate shorter timelines — reach out and let us know your date.',
      },
      {
        q: 'Do you offer a free consultation?',
        a: 'Yes! Your first consultation is completely free. It is a no-obligation conversation where we listen to your ideas and share how we can bring them to life.',
      },
    ],
  },
  {
    category: 'Pricing & Packages',
    items: [
      {
        q: 'How do you charge for your services?',
        a: 'Our pricing depends on the type, size and complexity of the event. We offer tiered packages as well as custom quotes. All pricing is shared transparently in a written proposal — no hidden fees.',
      },
      {
        q: 'Can I choose only certain parts of your service?',
        a: 'Absolutely. While we excel at full-service planning, we also offer partial planning (where you have done some groundwork already) and day-of coordination only packages.',
      },
      {
        q: 'What is your payment structure?',
        a: 'We typically require a booking retainer to secure your date, followed by milestone payments leading up to the event. The exact structure will be outlined in your contract.',
      },
    ],
  },
  {
    category: 'On The Day',
    items: [
      {
        q: 'Will you be on-site during my event?',
        a: 'Yes. For full-service packages, a lead planner and at least one coordinator will be present for the entire event from setup through to final teardown.',
      },
      {
        q: 'How do you handle unexpected issues on the day?',
        a: 'We always have a contingency plan. From rain backup plans for outdoor events to last-minute vendor substitutions, our team is trained to resolve problems quietly and quickly — so you never have to.',
      },
      {
        q: 'Do you coordinate with vendors directly?',
        a: 'Yes. We act as the primary point of contact for all vendors from the moment you book us. This includes contracts, delivery schedules, setup times and final payments.',
      },
    ],
  },
  {
    category: 'Location & Reach',
    items: [
      {
        q: 'Where are you based and do you travel?',
        a: 'We are based in Ilorin, Kwara State. We regularly work in Lagos and Abuja, and are open to destination events across Nigeria. Travel and accommodation for out-of-state events may incur an additional fee.',
      },
      {
        q: 'Can you recommend venues in Kwara?',
        a: 'Yes! We have established relationships with a curated list of venues in Kwara ranging from intimate garden spaces to grand ballrooms. We match venue to your vision and guest list.',
      },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`glass-card rounded-xl border transition-all duration-300 ${open ? 'border-gold-500/40' : 'border-dark-border'}`}>
      <button
        className="w-full flex items-start justify-between gap-4 p-6 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className={`font-medium text-sm md:text-base transition-colors duration-300 ${open ? 'text-gold-300' : 'text-purple-100'}`}>
          {q}
        </span>
        <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${open ? 'border-gold-400/60 bg-gold-900/30' : 'border-dark-muted'}`}>
          {open
            ? <Minus size={14} className="text-gold-400" />
            : <Plus size={14} className="text-purple-400" />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6">
          <p className="text-purple-300/80 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ({ onNavigate }: FAQProps) {
  const navigate = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const faqRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div>
      <section className="page-hero text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,33,160,0.4)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in-up">Got Questions?</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-purple-50 mb-4 opacity-0 animate-fade-in-up-2">
            Frequently Asked Questions
          </h1>
          <div className="section-divider" />
          <p className="text-purple-300/80 text-lg max-w-xl mx-auto mt-4">
            Everything you need to know before we start planning your celebration.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28" ref={faqRef}>
        <div className="max-w-3xl mx-auto px-6 space-y-14">
          {faqs.map(({ category, items }) => (
            <div key={category} className="scroll-reveal">
              <h2 className="font-serif text-xl text-gold-400 mb-6 pb-3 border-b border-dark-border">
                {category}
              </h2>
              <div className="space-y-3">
                {items.map(({ q, a }) => (
                  <AccordionItem key={q} q={q} a={a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-purple-900/50 border-t border-dark-border text-center" ref={ctaRef}>
        <div className="max-w-2xl mx-auto px-6 scroll-reveal">
          <h2 className="font-serif text-3xl text-purple-50 mb-4">Still have questions?</h2>
          <p className="text-purple-300/80 mb-10">
            We are happy to chat. Reach out via WhatsApp or email — we respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('contact')} className="btn-gold">
              Contact Us
              <ChevronRight size={16} />
            </button>
            <a
              href="https://wa.me/2348035672491?text=Hi%20BELSH!%20I%20have%20a%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
