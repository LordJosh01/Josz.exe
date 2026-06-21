import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const links: { label: string; page: Page }[] = [
  { label: 'Services', page: 'services' },
  { label: 'Portfolio', page: 'portfolio' },
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

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 nav-gradient-border transition-all duration-500 ${
          scrolled || isOpen ? 'scrolled bg-purple-900/97 backdrop-blur-xl shadow-2xl shadow-black/50' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 flex items-center justify-between h-18 md:h-20">

          {/* Logo + Brand */}
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

          {/* Desktop nav */}
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

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-purple-200 hover:text-gold-300 transition-colors"
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

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-purple-950/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Slide-in panel */}
        <div
          className={`absolute top-0 right-0 h-full w-4/5 max-w-xs bg-purple-900 border-l border-dark-border flex flex-col transition-transform duration-400 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-dark-border">
            <div className="flex items-center gap-2">
              <img src="/EVENT_BY_BELSH.jpg" alt="BELSH" className="h-9 w-9 rounded-full ring-1 ring-gold-500/40" />
              <span className="font-serif text-gold-400 text-sm tracking-widest">BELSH EVENTS</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-purple-300 hover:text-gold-300 transition-colors">
              <X size={22} />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
            {links.map(({ label, page }, i) => (
              <button
                key={page}
                onClick={() => navigate(page)}
                style={{ transitionDelay: isOpen ? `${i * 60}ms` : '0ms' }}
                className={`mobile-nav-item text-left px-4 py-3.5 rounded-lg transition-all duration-300 ${
                  currentPage === page
                    ? 'active bg-purple-800/50 pl-5'
                    : 'hover:bg-purple-800/30'
                } ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Book CTA */}
          <div className="px-6 py-6 border-t border-dark-border">
            <button onClick={() => navigate('contact')} className="btn-gold w-full text-xs">
              Book a Free Consultation
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
