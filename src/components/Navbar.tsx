import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact' | 'premium';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const links: { label: string; page: Page }[] = [
  { label: 'Services', page: 'services' },
  { label: 'Portfolio', page: 'portfolio' },
  { label: 'Premium', page: 'premium' },
  { label: 'About', page: 'about' },
  { label: 'FAQ', page: 'faq' },
  { label: 'Contact', page: 'contact' },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigate = (page: Page) => {
    onNavigate(page);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 nav-gradient-border transition-all duration-500 ${
          scrolled || isOpen ? 'scrolled bg-dark/97 backdrop-blur-xl shadow-2xl shadow-black/50' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 flex items-center justify-between h-18 md:h-20">

          <button
            onClick={() => navigate('home')}
            className={`flex items-center gap-3 group transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-md scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="/EVENT_BY_BELSH.jpg"
                alt="Events By BELSH"
                className="relative h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full ring-2 ring-gold-500/40 group-hover:ring-gold-400/90 group-hover:scale-105 transition-all duration-400"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-base sm:text-lg tracking-[0.12em] text-purple-100 group-hover:text-gold-300 transition-colors duration-300">
                BELSH EVENTS
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-gold-500/70 hidden sm:block">
                Planning &amp; Design
              </span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-7 lg:gap-9">
            {links.map(({ label, page }, i) => (
              <button
                key={page}
                onClick={() => navigate(page)}
                style={{ animationDelay: `${i * 80}ms` }}
                className={`nav-link pb-0.5 ${currentPage === page ? 'active' : ''} ${mounted ? 'opacity-100' : 'opacity-0'}`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => navigate('contact')}
              className={`btn-gold text-xs px-5 py-2.5 ml-2 ${mounted ? 'opacity-100' : 'opacity-0'}`}
              style={{ animationDelay: '450ms' }}
            >
              Book Now
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden relative w-12 h-12 flex items-center justify-center rounded-lg glass-card gold-border text-purple-200 hover:text-gold-300 hover:border-gold-400/60 transition-all duration-300"
          >
            <span className={`absolute transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}>
              <X size={24} />
            </span>
            <span className={`absolute transition-all duration-300 ${isOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`}>
              <Menu size={24} />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-dark/90 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-gradient-to-b from-purple-900/95 to-dark/98 border-l-2 border-gold-500/30 flex flex-col transition-transform duration-400 ease-out shadow-[-20px_0_60px_rgba(0,0,0,0.5)] ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gold-500/20 bg-purple-900/50">
            <div className="flex items-center gap-3">
              <img src="/EVENT_BY_BELSH.jpg" alt="BELSH" className="h-10 w-10 rounded-full ring-2 ring-gold-500/50" />
              <div>
                <span className="font-serif text-gold-400 text-sm tracking-widest block">BELSH EVENTS</span>
                <span className="text-purple-400 text-[9px] tracking-widest uppercase">Planning & Design</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-lg glass-card gold-border flex items-center justify-center text-purple-300 hover:text-gold-300 hover:border-gold-400/60 transition-all duration-300"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex flex-col gap-2 px-4 py-8 flex-1 overflow-y-auto">
            {links.map(({ label, page }, i) => (
              <button
                key={page}
                onClick={() => navigate(page)}
                style={{ transitionDelay: isOpen ? `${i * 60}ms` : '0ms' }}
                className={`mobile-nav-item text-left px-5 py-4 rounded-xl transition-all duration-300 ${
                  currentPage === page
                    ? 'active bg-gold-900/20 border-l-4 border-gold-500 pl-6'
                    : 'hover:bg-purple-800/30 border-l-4 border-transparent hover:border-gold-500/30'
                } ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
              >
                <span className="text-lg font-medium">{label}</span>
              </button>
            ))}
          </nav>

          <div className="px-6 py-6 border-t border-gold-500/20 bg-purple-900/30">
            <button onClick={() => navigate('contact')} className="btn-gold w-full text-sm py-4">
              Book a Free Consultation
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
