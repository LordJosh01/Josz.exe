import { useEffect, useRef, useState } from 'react';
import { Heart, Star, Award, Camera, Music, Utensils, ChevronRight, Users, Gift, Cake, PartyPopper, Sparkles, MapPin, Clock, Palette, Flower2, Wine, Calendar, Baby, Briefcase } from 'lucide-react';
import Confetti from '../components/Confetti';
import FloatingDots from '../components/FloatingDots';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact' | 'premium';

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

const mainServices = [
  {
    icon: Heart,
    title: 'Wedding Planning',
    tagline: 'Your love story, beautifully told.',
    description:
      'From intimate ceremonies to grand receptions, we handle every detail with grace and precision. We understand that your wedding is one of the most important days of your life, and we treat it with the reverence it deserves. Our team works tirelessly to ensure every moment flows seamlessly, leaving you free to be fully present with your loved ones.',
    detailedDescription:
      'We specialize in creating weddings that reflect your unique love story. Whether you envision a romantic garden ceremony, a grand ballroom reception, or an intimate destination celebration, we bring your vision to life with meticulous attention to detail. Our comprehensive approach covers everything from initial concept development to the final sparkler send-off.',
    includes: [
      'Venue sourcing & site visits',
      'Vendor selection & management',
      'Custom decor & styling design',
      'Full day-of coordination',
      'Rehearsal dinner planning',
      'Guest experience curation',
      'Timeline creation & management',
      'Budget tracking & optimization',
      'Seating chart design',
      'Ceremony & reception logistics',
    ],
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    icon: Cake,
    title: 'Birthday Celebrations',
    tagline: 'Milestone moments deserve milestone settings.',
    description:
      'A surprise party, a milestone birthday gala or an intimate dinner with close friends — we craft experiences that feel elevated, personal and truly celebratory. Every birthday marks another chapter in life, and we believe it deserves to be commemorated in style.',
    detailedDescription:
      'From sweet sixteen celebrations to golden jubilee galas, we create birthday experiences that match the significance of the milestone. Our team excels at designing unique themes, coordinating surprise elements, and ensuring the guest of honor feels truly special. We handle all logistics so you can focus on making memories.',
    includes: [
      'Theme development & mood boards',
      'Venue transformation & styling',
      'Entertainment sourcing & booking',
      'Custom cake & dessert coordination',
      'Photography & videography',
      'Surprise element planning',
      'Guest list management',
      'Catering & menu design',
      'Party favors & gift coordination',
      'Music & DJ arrangements',
    ],
    image: 'https://images.pexels.com/photos/2072181/pexels-photo-2072181.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    icon: Award,
    title: 'Corporate Events',
    tagline: 'Professional excellence, seamlessly executed.',
    description:
      'Award ceremonies, conferences, product launches, end-of-year parties, and executive retreats — executed with the professionalism and attention to detail your organization demands. We understand that corporate events reflect your brand and values.',
    detailedDescription:
      'Corporate events require a different level of precision and professionalism. Our team has extensive experience working with organizations of all sizes, from startups to established corporations. We ensure your event reinforces your brand identity while creating meaningful experiences for attendees.',
    includes: [
      'Concept & brand integration',
      'Venue selection & negotiation',
      'AV & technical production',
      'Guest registration systems',
      'Catering & refreshment planning',
      'Speaker & entertainment coordination',
      'Branded materials & signage',
      'Photography & documentation',
      'On-site staff coordination',
      'Post-event reporting',
    ],
    image: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

const additionalServices = [
  {
    icon: Flower2,
    title: 'Traditional Ceremonies',
    desc: 'Engagement ceremonies, traditional weddings, naming ceremonies, and cultural celebrations that honor heritage and tradition.',
  },
  {
    icon: Baby,
    title: 'Baby Showers & Naming',
    desc: 'Celebrate new beginnings with beautifully curated baby showers and traditional naming ceremonies for your little one.',
  },
  {
    icon: Gift,
    title: 'Bridal Showers',
    desc: 'Intimate gatherings to celebrate the bride-to-be with elegant styling, games, and memorable moments with friends.',
  },
  {
    icon: Wine,
    title: 'Private Dinners',
    desc: 'Intimate dining experiences for anniversaries, proposals, family celebrations, and exclusive gatherings.',
  },
  {
    icon: Calendar,
    title: 'Anniversaries',
    desc: 'Celebrate years of love and commitment with thoughtful anniversary events that honor your journey together.',
  },
  {
    icon: PartyPopper,
    title: 'Graduation Parties',
    desc: 'Honor academic achievements with celebrations that recognize hard work and new beginnings.',
  },
  {
    icon: Heart,
    title: 'Burial & Memorial Services',
    desc: 'Dignified funeral planning, memorial services, and celebration of life ceremonies handled with respect and care.',
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Discovery Call',
    desc: 'We begin with a complimentary consultation to understand your vision, preferences, budget, and event goals. This is where dreams meet strategy.',
    icon: Sparkles,
  },
  {
    step: '02',
    title: 'Concept Development',
    desc: 'Our team creates a comprehensive proposal with mood boards, venue options, vendor recommendations, and a detailed budget breakdown.',
    icon: Palette,
  },
  {
    step: '03',
    title: 'Planning & Coordination',
    desc: 'We handle every detail — vendor contracts, timeline creation, logistics management, and regular check-ins to keep you informed.',
    icon: Clock,
  },
  {
    step: '04',
    title: 'Flawless Execution',
    desc: 'On your event day, our team works behind the scenes to ensure everything flows perfectly. You enjoy; we execute.',
    icon: MapPin,
  },
];

const addons = [
  { icon: Camera, label: 'Photography & Videography', desc: 'Professional visual documentation of your event' },
  { icon: Music, label: 'Live Entertainment & DJ', desc: 'Curated music and performance experiences' },
  { icon: Utensils, label: 'Bespoke Catering', desc: 'Custom menu design and culinary experiences' },
  { icon: Flower2, label: 'Floral Design', desc: 'Stunning arrangements and botanical installations' },
  { icon: Users, label: 'Guest Management', desc: 'RSVP tracking and guest coordination services' },
  { icon: Gift, label: 'Party Favors & Gifts', desc: 'Custom favors and thoughtful guest gifts' },
];

const whyChooseUs = [
  'Personalized approach tailored to your unique vision and preferences',
  'Strong relationships with trusted vendors across Kwara and beyond',
  'Transparent pricing with no hidden fees or surprises',
  'Experienced team with 200+ successfully executed events',
  'Attention to the smallest details that others overlook',
  'Flexible packages to suit different budgets and needs',
];

export default function Services({ onNavigate }: ServicesProps) {
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

  const servicesRef = useReveal();
  const additionalRef = useReveal();
  const processRef = useReveal();
  const addonsRef = useReveal();
  const whyRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div>
      <Confetti style="wedding" active={showConfetti} />
      <section className="page-hero text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,33,160,0.4)_0%,transparent_70%)]" />
        <FloatingDots color="mixed" count={35} size="md" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="flex justify-center mb-5 opacity-0 animate-fade-in-up">
            <div className="w-14 h-14 rounded-full bg-purple-600/40 border border-gold-500/30 flex items-center justify-center animate-icon-pulse">
              <Heart size={24} className="text-gold-400" />
            </div>
          </div>
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in-up">What We Offer</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4 opacity-0 animate-fade-in-up-2">Our Services</h1>
          <div className="section-divider" />
          <p className="text-white/80 text-lg max-w-xl mx-auto mt-4">
            Every celebration is unique. We offer bespoke planning packages tailored to your occasion, budget and vision — from intimate gatherings to grand celebrations.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-24 md:py-28" ref={servicesRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-32">
          {mainServices.map(({ icon: Icon, title, tagline, description, detailedDescription, includes, image }, i) => (
            <div key={title} className="space-y-12">
              {/* Service Header */}
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className={`relative group scroll-reveal-${i % 2 === 0 ? 'left' : 'right'} ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="absolute -inset-4 bg-gradient-to-br from-gold-700/10 to-purple-700/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative glass-card rounded-2xl overflow-hidden aspect-[4/3]">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent" />
                  </div>
                </div>

                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="w-12 h-12 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center mb-6">
                    <Icon size={22} className="text-gold-400" />
                  </div>
                  <p className="text-gold-400 text-xs tracking-widest uppercase mb-2">{tagline}</p>
                  <h2 className="font-serif text-3xl md:text-4xl text-white mb-5">{title}</h2>
                  <p className="text-white/80 leading-relaxed mb-4">{description}</p>
                  <p className="text-white/60 leading-relaxed text-sm">{detailedDescription}</p>
                </div>
              </div>

              {/* What's Included */}
              <div className="scroll-reveal delay-2">
                <h3 className="font-serif text-xl text-gold-300 mb-6 text-center">What's Included</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {includes.map((item) => (
                    <div key={item} className="glass-card rounded-lg px-4 py-3 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0 mt-1.5" />
                      <span className="text-sm text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-24 bg-purple-900/50 border-y border-dark-border" ref={additionalRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 scroll-reveal">
            <p className="text-xs tracking-[0.3em] uppercase mb-4">
              <span className="text-white">More Ways </span>
              <span className="text-gold-400">We</span>
              <span className="text-white"> Celebrate</span>
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-white">Additional Services</h2>
            <p className="text-white/70 mt-4 max-w-xl mx-auto">Beyond our core offerings, we also specialize in these beautiful celebrations.</p>
            <div className="section-divider" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`glass-card gold-border rounded-xl p-6 hover:-translate-y-2 transition-all duration-500 scroll-reveal delay-${i + 1}`}>
                <div className="w-10 h-10 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-gold-400" />
                </div>
                <h3 className="font-serif text-lg text-white mb-2">{title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-24 md:py-28" ref={processRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 scroll-reveal">
            <p className="text-xs tracking-[0.3em] uppercase mb-4">
              <span className="text-white">How </span>
              <span className="text-gold-400">We</span>
              <span className="text-white"> Work</span>
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-white">Our Process</h2>
            <p className="text-white/70 mt-4 max-w-xl mx-auto">A transparent, collaborative approach that keeps you informed every step of the way.</p>
            <div className="section-divider" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map(({ step, title, desc, icon: Icon }, i) => (
              <div key={step} className={`scroll-reveal delay-${i + 1}`}>
                <div className="glass-card rounded-xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-serif text-gold-400/30">{step}</span>
                    <div className="w-10 h-10 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center">
                      <Icon size={18} className="text-gold-400" />
                    </div>
                  </div>
                  <h3 className="font-serif text-lg text-white mb-2">{title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 bg-purple-900/50 border-y border-dark-border" ref={addonsRef}>
        <div className="max-w-5xl mx-auto px-6 text-center scroll-reveal">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">Enhance Your Event</p>
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-10">Optional Add-ons</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className={`glass-card gold-border rounded-xl px-6 py-5 flex items-start gap-4 scroll-reveal delay-${i + 1}`}>
                <div className="w-8 h-8 rounded-lg bg-gold-900/30 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-gold-400" />
                </div>
                <div className="text-left">
                  <span className="text-white text-sm font-medium block">{label}</span>
                  <span className="text-white/70 text-xs">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24" ref={whyRef}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 scroll-reveal">
            <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">The BELSH Difference</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white">Why Choose Us</h2>
            <div className="section-divider" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {whyChooseUs.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 glass-card rounded-lg px-5 py-4 scroll-reveal delay-${i + 1}`}>
                <span className="w-2 h-2 rounded-full bg-gold-400 shrink-0" />
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-purple-900/30 border-t border-dark-border" ref={ctaRef}>
        <div className="max-w-2xl mx-auto px-6 scroll-reveal">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Not sure which package is right?</h2>
          <p className="text-white/80 mb-10">A free consultation call is the best place to start. We will help you find the perfect fit for your celebration.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('contact')} className="btn-gold">
              Book a Free Consultation
              <ChevronRight size={16} />
            </button>
            <button onClick={() => navigate('portfolio')} className="btn-outline-gold">
              View Our Portfolio
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
