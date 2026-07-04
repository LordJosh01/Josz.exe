import { useState, useEffect, useRef } from 'react';
import { Plus, Minus, ChevronRight, MessageCircle, HelpCircle } from 'lucide-react';
import Confetti from '../components/Confetti';
import FloatingDots from '../components/FloatingDots';

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

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact' | 'premium';

interface FAQProps {
  onNavigate: (page: Page) => void;
}

const faqs = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'How do I start planning my event with BELSH?',
        a: 'Simply reach out via our Contact page, email, or WhatsApp. We will schedule a free 30-minute discovery call to understand your vision, timeline, and budget. From there, we propose a planning package that fits your needs. There is no obligation — just a conversation to see if we are the right fit.',
      },
      {
        q: 'How far in advance should I book?',
        a: 'For weddings, we recommend booking 6-12 months in advance to ensure venue and vendor availability. For large events (100+ guests), 3-6 months is ideal. For smaller gatherings, 4-8 weeks often works well. That said, we occasionally accommodate shorter timelines — reach out and let us know your date.',
      },
      {
        q: 'Do you offer a free consultation?',
        a: 'Yes! Your first consultation is completely free. It is a no-obligation conversation where we listen to your ideas, understand your preferences, and share how we can bring them to life. We believe in building relationships before contracts.',
      },
      {
        q: 'What information should I have ready before our first call?',
        a: 'Ideally, have your event date (if known), approximate guest count, general budget range, and any vision ideas or Pinterest boards ready. But do not worry if you are still figuring things out — part of our job is helping you clarify your vision.',
      },
      {
        q: 'Can I meet with you in person before booking?',
        a: 'Absolutely. We are based in Ilorin and would be happy to meet at a convenient location for both parties. For clients outside Kwara, we can arrange video calls. We believe in building trust before we begin working together.',
      },
    ],
  },
  {
    category: 'Pricing & Packages',
    items: [
      {
        q: 'How do you charge for your services?',
        a: 'Our pricing depends on the type, size, and complexity of the event. We offer tiered packages (Essential, Standard, Premium) as well as custom quotes for unique requirements. All pricing is shared transparently in a written proposal — no hidden fees, no surprises.',
      },
      {
        q: 'Can I choose only certain parts of your service?',
        a: 'Absolutely. While we excel at full-service planning, we also offer partial planning for clients who have done some groundwork already, and day-of coordination for those who just need someone to execute their plans flawlessly on the day.',
      },
      {
        q: 'What is your payment structure?',
        a: 'We typically require a booking retainer (30-50%) to secure your date and begin work, followed by milestone payments leading up to the event. The exact structure will be outlined in your contract. We accept bank transfers and are flexible with payment schedules.',
      },
      {
        q: 'Do you work with different budget levels?',
        a: 'Yes, we work with a range of budgets. We believe beautiful events do not require unlimited funds — they require creativity and smart decisions. Tell us your budget and we will maximize its impact. We are honest about what is achievable within your range.',
      },
      {
        q: 'What is not included in your planning fees?',
        a: 'Our fees cover planning and coordination services. Vendor costs (venue, catering, decor, photography, etc.) are separate and paid directly to vendors. We help you select vendors within budget and manage those relationships, but vendor payments go directly to them.',
      },
    ],
  },
  {
    category: 'Wedding Planning',
    items: [
      {
        q: 'Do you plan both traditional and white weddings?',
        a: 'Yes! We have extensive experience with traditional engagement ceremonies, traditional weddings, church weddings, court weddings, and white weddings. We understand the cultural significance of each and can help you navigate both seamlessly.',
      },
      {
        q: 'Can you help with venue selection?',
        a: 'Absolutely. We have relationships with venues across Kwara and beyond, from intimate gardens to grand ballrooms. We will recommend options based on your guest count, style preferences, and budget, then arrange site visits and help negotiate contracts.',
      },
      {
        q: 'How involved will I be in the planning process?',
        a: 'As involved as you want to be. Some couples want to approve every decision; others want us to handle everything and just show them the final result. We adapt to your communication style and keep you informed at whatever level feels right.',
      },
      {
        q: 'Do you help with vendor selection?',
        a: 'Yes. We have a curated network of photographers, caterers, florists, DJs/bands, makeup artists, and other vendors we have worked with and trust. We will recommend options based on your style and budget, handle contracts, and coordinate everything.',
      },
      {
        q: 'What happens if a vendor cancels last minute?',
        a: 'We maintain backup vendor relationships for this exact scenario. In the rare event of a cancellation, we immediately activate our backup network. We also include contingency planning in our process to handle unexpected situations seamlessly.',
      },
    ],
  },
  {
    category: 'On The Day',
    items: [
      {
        q: 'Will you be on-site during my event?',
        a: 'Yes. For full-service packages, a lead planner and at least one coordinator will be present for the entire event — from setup through teardown. We are there to handle every detail so you can be fully present with your guests.',
      },
      {
        q: 'How do you handle unexpected issues on the day?',
        a: 'We always have contingency plans. From rain backup plans for outdoor events to last-minute vendor substitutions, our team is trained to resolve problems quietly and quickly — so you never have to stress. Most issues get resolved without guests ever noticing.',
      },
      {
        q: 'Do you coordinate with vendors directly?',
        a: 'Yes. We act as the primary point of contact for all vendors from the moment you book us. This includes contracts, delivery schedules, setup times, and final payments. Vendors coordinate with us, not you — so you can focus on enjoying your day.',
      },
      {
        q: 'How early do you arrive on the event day?',
        a: 'We arrive hours before the event begins to oversee setup, direct vendors, and ensure everything is perfect before guests arrive. The exact timing depends on the complexity of setup and will be communicated in advance.',
      },
      {
        q: 'Do you stay until the end of the event?',
        a: 'Yes, for full-service packages we stay through the event and oversee teardown/cleanup. We ensure all vendors pack up correctly, personal items are collected, and the venue is left as agreed. We do not leave until everything is handled.',
      },
    ],
  },
  {
    category: 'Location & Coverage',
    items: [
      {
        q: 'Where are you based and do you travel?',
        a: 'We are based in Ilorin, Kwara State. We regularly work across Kwara and are open to destination events across Nigeria and beyond. Travel and accommodation for out-of-town events may incur an additional fee, which we discuss upfront.',
      },
      {
        q: 'Can you recommend venues in Kwara?',
        a: 'Yes! We have established relationships with a curated list of venues in Kwara — from intimate garden spaces and rooftop terraces to grand ballrooms and event centers. We match venues to your vision, guest count, and budget.',
      },
      {
        q: 'Do you work with vendors outside Kwara?',
        a: 'Absolutely. We have a growing network of vendors across Nigeria and can coordinate with trusted partners in other cities. For destination events, we can also work with local vendors recommended by your venue or source new ones.',
      },
    ],
  },
  {
    category: 'Event Types & Services',
    items: [
      {
        q: 'Do you plan events other than weddings?',
        a: 'Yes! We plan birthday celebrations, corporate events, anniversaries, bridal showers, baby showers, naming ceremonies, private dinners, graduation parties, and more. Each event receives the same level of care and attention to detail.',
      },
      {
        q: 'Can you help with just decor and styling?',
        a: 'While we specialize in full planning and coordination, we do offer standalone styling and decor services for clients who have handled logistics but want professional design expertise. Reach out to discuss your specific needs.',
      },
      {
        q: 'Do you provide rentals (chairs, tables, linens)?',
        a: 'We do not own rentals ourselves, but we work with trusted rental companies and can coordinate all rental needs on your behalf. This includes sourcing options, managing delivery schedules, and ensuring setup is correct.',
      },
      {
        q: 'Can you help with just day-of coordination?',
        a: 'Yes. If you have planned your event but need someone to execute flawlessly on the day, we offer day-of coordination services. We will take over logistics 2-4 weeks before your event to ensure a smooth handoff.',
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
        <span className={`font-medium text-sm md:text-base transition-colors duration-300 ${open ? 'text-gold-300' : 'text-white'}`}>
          {q}
        </span>
        <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${open ? 'border-gold-400/60 bg-gold-900/30' : 'border-dark-muted'}`}>
          {open
            ? <Minus size={14} className="text-gold-400" />
            : <Plus size={14} className="text-white/70" />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6">
          <p className="text-white/80 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ({ onNavigate }: FAQProps) {
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

  const faqRef = useReveal();
  const ctaRef = useReveal();

  const totalFaqs = faqs.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div>
      <Confetti style="corporate" active={showConfetti} />
      <section className="page-hero text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,33,160,0.4)_0%,transparent_70%)]" />
        <FloatingDots color="purple" count={25} size="sm" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="flex justify-center mb-5 opacity-0 animate-fade-in-up">
            <div className="w-14 h-14 rounded-full bg-purple-600/40 border border-gold-500/30 flex items-center justify-center animate-icon-bounce">
              <HelpCircle size={24} className="text-gold-400" />
            </div>
          </div>
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in-up">Got Questions?</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4 opacity-0 animate-fade-in-up-2">
            Frequently Asked Questions
          </h1>
          <div className="section-divider" />
          <p className="text-white/80 text-lg max-w-xl mx-auto mt-4">
            Everything you need to know before we start planning your celebration.
          </p>
          <p className="text-white0 text-sm mt-2">{totalFaqs} questions answered</p>
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

      {/* Help Section */}
      <section className="py-16 bg-purple-900/50 border-y border-dark-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card gold-border rounded-xl p-8 text-center">
              <MessageCircle size={32} className="text-gold-400 mx-auto mb-4" />
              <h3 className="font-serif text-xl text-white mb-2">Prefer to Chat?</h3>
              <p className="text-white/70 text-sm mb-4">We respond to WhatsApp messages within hours.</p>
              <a
                href="https://wa.me/2348035672491?text=Hi%20BELSH!%20I%20have%20a%20question."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-xs"
              >
                WhatsApp Us
              </a>
            </div>
            <div className="glass-card gold-border rounded-xl p-8 text-center">
              <svg className="w-8 h-8 mx-auto mb-4 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <h3 className="font-serif text-xl text-white mb-2">Quick Response</h3>
              <p className="text-white/70 text-sm mb-4">We reply to emails within 24 hours.</p>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=aolagbaye@gmail.com&su=FAQ%20Inquiry%20-%20BELSH%20Events"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold text-xs"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-dark-border text-center" ref={ctaRef}>
        <div className="max-w-2xl mx-auto px-6 scroll-reveal">
          <h2 className="font-serif text-3xl text-white mb-4">Still have questions?</h2>
          <p className="text-white/80 mb-10">
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
