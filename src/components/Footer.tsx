import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, Instagram, MapPin, ChevronRight, Sparkles } from 'lucide-react';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact' | 'premium' | 'eventai';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const quickLinks: { label: string; page: Page; icon?: React.ComponentType<{ size?: number }> }[] = [
  { label: 'Our Services', page: 'services' },
  { label: 'Portfolio', page: 'portfolio' },
  { label: 'Premium', page: 'premium' },
  { label: 'Event AI', page: 'eventai', icon: Sparkles },
  { label: 'About Us', page: 'about' },
  { label: 'FAQ', page: 'faq' },
  { label: 'Contact', page: 'contact' },
];

const GMAIL_URL = 'https://mail.google.com/mail/?view=cm&fs=1&to=aolagbaye@gmail.com&su=Event%20Enquiry%20-%20Events%20By%20BELSH';
const WHATSAPP_URL = 'https://wa.me/2348035672491?text=Hi%20BELSH%20Events!%20I%27d%20like%20to%20inquire%20about%20my%20event.';
const INSTAGRAM_URL = 'https://www.instagram.com/rtw_by_belsh';
const TIKTOK_URL = 'https://www.tiktok.com/@rtw_by_blesh';

const marqueeItems = [
  'Weddings', 'Birthdays', 'Private Dinners', 'Corporate Events',
  'Anniversaries', 'Bridal Showers', 'Baby Showers', 'Galas',
];

export default function Footer({ onNavigate }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const cols = el.querySelectorAll('.footer-col-anim');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cols.forEach((col, i) => {
              setTimeout(() => col.classList.add('in-view'), i * 120);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navigate = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef} className="bg-purple-900 border-t border-dark-border overflow-hidden relative">

      {/* Cursor-following shine effect */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, rgba(212, 160, 23, 0.08) 0%, transparent 70%)`,
        }}
      />

      {/* Marquee strip */}
      <div className="border-b border-dark-border py-3 bg-purple-950/60">
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="flex items-center gap-4 mx-6 text-xs uppercase tracking-[0.2em] text-white/70/60 whitespace-nowrap">
                <span className="w-1 h-1 rounded-full bg-gold-500/50 inline-block" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="footer-col-anim scroll-reveal sm:col-span-2 lg:col-span-1">
            <button onClick={() => navigate('home')} className="flex items-center gap-3 mb-5 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src="/EVENT_BY_BELSH.jpg"
                  alt="Events By BELSH"
                  className="relative h-14 w-14 object-contain rounded-full ring-2 ring-gold-500/30 group-hover:ring-gold-400/70 group-hover:scale-105 transition-all duration-400"
                />
              </div>
              <div>
                <p className="font-serif text-xl text-gold-400 tracking-widest leading-none">BELSH EVENTS</p>
                <p className="text-white/70 text-[10px] tracking-[0.25em] uppercase mt-1">Planning &amp; Design</p>
              </div>
            </button>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Boutique event planning and design — weddings, birthdays and private celebrations crafted
              with care in Kwara and beyond.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                {
                  href: INSTAGRAM_URL,
                  label: 'Instagram',
                  icon: (
                    <Instagram size={16} className="text-gold-400 group-hover:text-gold-300 transition-colors" />
                  ),
                },
                {
                  href: TIKTOK_URL,
                  label: 'TikTok',
                  icon: (
                    <svg className="w-4 h-4 group-hover:text-gold-300 transition-colors" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#25F4EE" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.98 3 3 0 0 1 .85.14V9.27a6.33 6.33 0 0 0-1-.09A6.34 6.34 0 0 0 5 15.69a6.33 6.33 0 0 0 10.86 4.49 6.34 6.34 0 0 0 1.87-4.49V8.88a8.14 8.14 0 0 0 4.73 1.52V6.69z" transform="translate(-1 0)" />
                      <path fill="#FE2C55" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.98 3 3 0 0 1 .85.14V9.27a6.33 6.33 0 0 0-1-.09A6.34 6.34 0 0 0 5 15.69a6.33 6.33 0 0 0 10.86 4.49 6.34 6.34 0 0 0 1.87-4.49V8.88a8.14 8.14 0 0 0 4.73 1.52V6.69z" transform="translate(1 0)" />
                      <path fill="white" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.98 3 3 0 0 1 .85.14V9.27a6.33 6.33 0 0 0-1-.09A6.34 6.34 0 0 0 5 15.69a6.33 6.33 0 0 0 10.86 4.49 6.34 6.34 0 0 0 1.87-4.49V8.88a8.14 8.14 0 0 0 4.73 1.52V6.69z" />
                    </svg>
                  ),
                },
                {
                  href: WHATSAPP_URL,
                  label: 'WhatsApp',
                  icon: (
                    <svg className="w-4 h-4 text-[#25D366] group-hover:text-[#6ee7a0] transition-colors fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  ),
                },
                {
                  href: GMAIL_URL,
                  label: 'Email',
                  icon: <Mail size={16} className="text-gold-400 group-hover:text-gold-300 transition-colors" />,
                },
              ].map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group w-9 h-9 rounded-full glass-card gold-border flex items-center justify-center hover:border-gold-400/80 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold-900/30 transition-all duration-300"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col-anim scroll-reveal">
            <h4 className="text-gold-400 text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-gold-500 inline-block" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map(({ label, page }) => (
                <li key={page}>
                  <button
                    onClick={() => navigate(page)}
                    className="footer-link flex items-center gap-1 group"
                  >
                    <ChevronRight size={12} className="text-gold-600/40 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all duration-300" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Events We Plan */}
          <div className="footer-col-anim scroll-reveal">
            <h4 className="text-gold-400 text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-gold-500 inline-block" />
              Events We Plan
            </h4>
            <ul className="space-y-2">
              {['Weddings', 'Traditional Ceremonies', 'Birthday Celebrations', 'Private Dinners', 'Corporate Events', 'Burials & Memorials', 'Anniversaries', 'Bridal Showers'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => navigate('services')}
                    className="footer-link flex items-center gap-1 group"
                  >
                    <ChevronRight size={12} className="text-gold-600/40 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all duration-300" />
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col-anim scroll-reveal">
            <h4 className="text-gold-400 text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-gold-500 inline-block" />
              Get In Touch
            </h4>
            <ul className="space-y-4">
              <li>
                <a href={GMAIL_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 text-white/80 hover:text-gold-300 transition-colors text-sm group">
                  <Mail size={15} className="text-gold-500 mt-0.5 shrink-0 group-hover:text-gold-300 transition-colors" />
                  <span>aolagbaye@gmail.com</span>
                </a>
              </li>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 text-white/80 hover:text-gold-300 transition-colors text-sm group">
                  <Phone size={15} className="text-gold-500 mt-0.5 shrink-0 group-hover:text-gold-300 transition-colors" />
                  <span>+234 803 567 2491</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <MapPin size={15} className="text-gold-500/60 mt-0.5 shrink-0" />
                  <span>Ilorin, Kwara State, Nigeria</span>
                </div>
              </li>
            </ul>
            {/* Social handle */}
            <div className="mt-4 pt-4 border-t border-dark-border/50">
              <p className="text-white/70 text-[10px] uppercase tracking-widest mb-2">Ready to Wear</p>
              <p className="text-white/70 text-xs mb-2">Follow us or contact us on Instagram & TikTok:</p>
              <div className="flex gap-4">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 text-sm transition-colors flex items-center gap-1">
                  <Instagram size={12} />
                  @rtw_by_belsh
                </a>
                <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 text-sm transition-colors flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#25F4EE" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.98 3 3 0 0 1 .85.14V9.27a6.33 6.33 0 0 0-1-.09A6.34 6.34 0 0 0 5 15.69a6.33 6.33 0 0 0 10.86 4.49 6.34 6.34 0 0 0 1.87-4.49V8.88a8.14 8.14 0 0 0 4.73 1.52V6.69z" transform="translate(-0.7 0)" />
                    <path fill="#FE2C55" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.98 3 3 0 0 1 .85.14V9.27a6.33 6.33 0 0 0-1-.09A6.34 6.34 0 0 0 5 15.69a6.33 6.33 0 0 0 10.86 4.49 6.34 6.34 0 0 0 1.87-4.49V8.88a8.14 8.14 0 0 0 4.73 1.52V6.69z" transform="translate(0.7 0)" />
                  </svg>
                  @rtw_by_blesh
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-border" />
          </div>
          <div className="relative flex justify-center">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>&copy; {new Date().getFullYear()} Events By BELSH. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-gold-500/40 inline-block" />
            <span>Kwara State, Nigeria</span>
            <span className="w-1 h-1 rounded-full bg-gold-500/40 inline-block" />
            <span>Crafted with care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
