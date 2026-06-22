import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, Eye } from 'lucide-react';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact';
type Filter = 'All' | 'Wedding' | 'Birthday' | 'Private' | 'Corporate';

interface PortfolioProps {
  onNavigate: (page: Page) => void;
}

const items = [
  // --- WEDDINGS ---
  {
    title: 'Royal Garden Wedding',
    category: 'Wedding',
    location: 'Ilorin, Kwara',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A lush garden ceremony with cascading florals, candlelit reception and a bespoke floral arch that framed the couple as they said their vows.',
    tags: ['Outdoor', 'Floral Design', 'Candlelit'],
  },
  {
    title: 'Traditional Engagement Ceremony',
    category: 'Wedding',
    location: 'Kwara State',
    image: 'https://images.pexels.com/photos/29083282/pexels-photo-29083282.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A vibrant traditional engagement ceremony rich with cultural elements, colour and community — every detail honouring Kwara heritage.',
    tags: ['Traditional', 'Cultural', 'Vibrant'],
  },
  {
    title: 'White Wedding Luncheon',
    category: 'Wedding',
    location: 'Ilorin, Kwara',
    image: 'https://images.pexels.com/photos/1128782/pexels-photo-1128782.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'An all-white midday reception with bespoke florals, a curated 4-course menu and floating floral ceiling installations.',
    tags: ['White Decor', 'Luncheon', 'Floral'],
  },
  {
    title: 'Court Wedding Celebration',
    category: 'Wedding',
    location: 'Kwara State',
    image: 'https://images.pexels.com/photos/1114425/pexels-photo-1114425.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'An intimate court wedding followed by a beautifully decorated reception dinner for 80 guests — elegant, heartfelt and timeless.',
    tags: ['Intimate', 'Elegant', 'Dinner'],
  },
  {
    title: 'Sunset Terrace Wedding',
    category: 'Wedding',
    location: 'Kwara State',
    image: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A golden-hour terrace wedding with warm ambient lighting, romantic tablescapes and a live string quartet setting the tone all evening.',
    tags: ['Sunset', 'Romantic', 'Live Music'],
  },

  // --- BIRTHDAYS ---
  {
    title: 'Sweet 16 Soiree',
    category: 'Birthday',
    location: 'Ilorin, Kwara',
    image: 'https://images.pexels.com/photos/3171770/pexels-photo-3171770.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A pastel fairytale celebration with personalised stations, a custom balloon canopy and a 6-tier custom dessert wall.',
    tags: ['Sweet 16', 'Pastel', 'Dessert Wall'],
  },
  {
    title: 'Milestone 50th Birthday Gala',
    category: 'Birthday',
    location: 'Ilorin, Kwara',
    image: 'https://images.pexels.com/photos/2072181/pexels-photo-2072181.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A regal gold-and-black birthday gala for 120 guests with live music, a custom throne setup and a 5-course dinner.',
    tags: ['Gala', 'Gold & Black', 'Live Band'],
  },
  {
    title: '1st Birthday Carnival',
    category: 'Birthday',
    location: 'Kwara State',
    image: 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A colourful and joyful first birthday carnival complete with themed zones, a custom smash cake station and coordinated family portraits.',
    tags: ['1st Birthday', 'Carnival', 'Colourful'],
  },
  {
    title: '21st Birthday Elegance Night',
    category: 'Birthday',
    location: 'Ilorin, Kwara',
    image: 'https://images.pexels.com/photos/33748012/pexels-photo-33748012.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A sophisticated all-black-and-rose-gold 21st birthday night with a live DJ, neon signage and a custom cake tower.',
    tags: ['21st', 'Black & Gold', 'DJ Night'],
  },
  {
    title: '60th Birthday Royal Celebration',
    category: 'Birthday',
    location: 'Ilorin, Kwara',
    image: 'https://images.pexels.com/photos/33675890/pexels-photo-33675890.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A majestic 60th birthday celebration with traditional and modern elements, an Agbada photo booth and a live highlife band.',
    tags: ['60th Birthday', 'Traditional', 'Highlife'],
  },

  // --- PRIVATE ---
  {
    title: 'Candlelit Private Dinner',
    category: 'Private',
    location: 'Kwara State',
    image: 'https://images.pexels.com/photos/7505355/pexels-photo-7505355.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A soft, romantic dinner styled around candlelight and warm neutral florals — intimate without losing polish.',
    tags: ['Romantic', 'Candlelit', 'Intimate'],
  },
  {
    title: 'Golden Anniversary Dinner',
    category: 'Private',
    location: 'Ilorin, Kwara',
    image: 'https://images.pexels.com/photos/169193/pexels-photo-169193.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'An intimate gold-accented dinner celebrating 50 years of marriage — surrounded by family, love and impeccable styling.',
    tags: ['Anniversary', 'Gold Theme', 'Family'],
  },
  {
    title: 'Bridal Shower Garden Brunch',
    category: 'Private',
    location: 'Kwara State',
    image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A whimsical garden bridal shower brunch with flower crown stations, a mimosa bar and personalised gift bags for every guest.',
    tags: ['Bridal Shower', 'Garden', 'Brunch'],
  },
  {
    title: 'Baby Shower Garden Party',
    category: 'Private',
    location: 'Ilorin, Kwara',
    image: 'https://images.pexels.com/photos/31461721/pexels-photo-31461721.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A dreamy outdoor baby shower in soft sage and ivory, with a custom balloon installation and a grazing board station.',
    tags: ['Baby Shower', 'Outdoor', 'Soft Tones'],
  },
  {
    title: 'Intimate Dinner for Two',
    category: 'Private',
    location: 'Kwara State',
    image: 'https://images.pexels.com/photos/265920/pexels-photo-265920.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A bespoke private dinner setup for a marriage proposal — rose petals, champagne, and a personalised menu the couple kept as a keepsake.',
    tags: ['Proposal', 'Romantic', 'Custom Menu'],
  },

  // --- CORPORATE ---
  {
    title: 'Corporate Awards Gala Night',
    category: 'Corporate',
    location: 'Ilorin, Kwara',
    image: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A polished corporate awards night for 200 attendees — branded decor, a live host, custom trophies and a gourmet 3-course dinner.',
    tags: ['Awards Night', 'Corporate', 'Branded'],
  },
  {
    title: 'Executive Networking Dinner',
    category: 'Corporate',
    location: 'Kwara State',
    image: 'https://images.pexels.com/photos/3153192/pexels-photo-3153192.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'An exclusive executive networking dinner for 40 senior leaders — intimate round tables, conversation curated and ambiance deliberately refined.',
    tags: ['Executive', 'Networking', 'Dinner'],
  },
  {
    title: 'Product Launch Event',
    category: 'Corporate',
    location: 'Ilorin, Kwara',
    image: 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=900',
    desc: 'A high-impact product launch with custom branded installations, a media wall, live demonstrations and a cocktail reception.',
    tags: ['Product Launch', 'Branded', 'Cocktail'],
  },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const els = el.querySelectorAll('.scroll-reveal, .scroll-reveal-scale, .scroll-reveal-left, .scroll-reveal-right');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
        });
      },
      { threshold: 0.06 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Portfolio({ onNavigate }: PortfolioProps) {
  const [active, setActive] = useState<Filter>('All');
  const [filtered, setFiltered] = useState(items);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const filters: Filter[] = ['All', 'Wedding', 'Birthday', 'Private', 'Corporate'];
  const galleryRef = useReveal();
  const ctaRef = useReveal();

  const handleFilterChange = useCallback((filter: Filter) => {
    setActive(filter);
    setFiltered(filter === 'All' ? items : items.filter((i) => i.category === filter));
  }, []);

  const navigate = useCallback((page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onNavigate]);

  return (
    <div>
      {/* Hero */}
      <section className="page-hero text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,33,160,0.4)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in-up">Our Work</p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-purple-100 mb-4 opacity-0 animate-fade-in-up-2 leading-tight">
            Our <span className="italic gold-text">Portfolio</span>
          </h1>
          <div className="section-divider" />
          <p className="text-purple-300/80 text-base sm:text-lg max-w-xl mx-auto mt-4 opacity-0 animate-fade-in-up-3">
            A curated showcase of celebrations we have had the privilege of bringing to life — weddings, birthdays, private gatherings and more.
          </p>
          {/* Stats strip */}
          <div className="flex flex-wrap justify-center gap-8 mt-10 opacity-0 animate-fade-in-up-4">
            {[['18+', 'Events Shown'], ['5', 'Event Types'], ['100%', 'In Kwara']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="font-serif text-2xl gold-text">{val}</p>
                <p className="text-purple-400 text-xs uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 md:py-24" ref={galleryRef}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 scroll-reveal">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`px-4 sm:px-6 py-2.5 text-xs sm:text-sm uppercase tracking-widest rounded-full transition-all duration-300 ${
                  active === f
                    ? 'bg-gradient-to-r from-gold-600 to-gold-400 text-dark font-semibold shadow-lg shadow-gold-900/40 scale-105'
                    : 'glass-card gold-border text-purple-300 hover:text-gold-300 hover:scale-102'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Count */}
          <p className="text-center text-purple-400 text-xs uppercase tracking-widest mb-8 scroll-reveal">
            Showing {filtered.length} {active === 'All' ? 'events' : `${active.toLowerCase()} events`}
          </p>

          {/* Masonry-style grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {filtered.map((item, i) => (
              <div
                key={`${item.title}-${i}`}
                onMouseEnter={() => setHoveredItem(item.title)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`group relative glass-card gold-border rounded-2xl overflow-hidden event-card scroll-reveal-scale delay-${Math.min((i % 6) + 1, 6)}`}
              >
                {/* Image */}
                <div className="aspect-[4/3] sm:aspect-[3/2] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-65 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700"
                    loading="lazy"
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/50 to-transparent" />

                {/* Eye icon on hover */}
                <div className={`absolute top-4 right-4 w-9 h-9 rounded-full glass-dark border border-gold-500/30 flex items-center justify-center transition-all duration-300 ${hoveredItem === item.title ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                  <Eye size={14} className="text-gold-400" />
                </div>

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="tag-pill text-[10px]">{item.category}</span>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <div className="transition-transform duration-400 translate-y-2 group-hover:translate-y-0">
                    <p className="text-gold-400 text-[10px] uppercase tracking-widest mb-1">{item.location}</p>
                    <h3 className="font-serif text-lg sm:text-xl text-purple-100 mb-2 leading-snug">{item.title}</h3>
                    <p className="text-purple-300/80 text-xs sm:text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-400 line-clamp-2">
                      {item.desc}
                    </p>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full border border-gold-500/20 text-gold-300/80 bg-gold-900/20 uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process note */}
      <section className="py-16 bg-purple-800/40 border-y border-dark-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4">Behind Every Event</p>
          <h2 className="font-serif text-2xl md:text-3xl text-purple-100 mb-4">Every photo tells a story of intentional design.</h2>
          <p className="text-purple-300/70 text-sm max-w-2xl mx-auto leading-relaxed">
            Each event in our portfolio began with a single conversation. A couple, a family, a company — sharing a vision with us. What you see here is the result of hundreds of hours of planning, styling, vendor coordination and on-the-day precision. We are proud of every single one.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 text-center" ref={ctaRef}>
        <div className="max-w-2xl mx-auto px-6 scroll-reveal">
          <h2 className="font-serif text-3xl md:text-4xl text-purple-100 mb-4">Imagine your event here.</h2>
          <p className="text-purple-300/80 mb-10">Every great celebration starts with a conversation. Reach out and let us build your vision.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('contact')} className="btn-gold">
              Start Planning
              <ChevronRight size={16} />
            </button>
            <button onClick={() => navigate('services')} className="btn-outline-gold">
              View Our Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
