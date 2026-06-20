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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigate = (page: Page) => {
    onNavigate(page);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || isOpen
          ? 'bg-purple-900/95 backdrop-blur-md shadow-lg shadow-black/40'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        <button onClick={() => navigate('home')} className="flex items-center gap-3 group">
          <img
            src="/EVENT_BY_BELSH.jpg"
            alt="Events By BELSH"
            className="h-12 w-12 object-contain rounded-full ring-2 ring-gold-500/40 group-hover:ring-gold-500/80 transition-all duration-300"
          />
          <span className="font-serif text-xl tracking-widest text-purple-100 group-hover:text-gold-300 transition-colors duration-300">
            BELSH
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {links.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => navigate(page)}
              className={`nav-link relative pb-0.5 ${currentPage === page ? 'active' : ''}`}
            >
              {label}
              <span
                className={`absolute bottom-0 left-0 h-px bg-gold-400 transition-all duration-300 ${
                  currentPage === page ? 'w-full' : 'w-0'
                }`}
              />
            </button>
          ))}
          <button onClick={() => navigate('contact')} className="btn-gold ml-2">
            Book Now
          </button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-purple-200 hover:text-gold-300 transition-colors p-1"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-purple-900/98 border-t border-dark-border px-6 py-6 space-y-5 animate-fade-in">
          {links.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => navigate(page)}
              className={`block text-left text-base w-full ${
                currentPage === page ? 'text-gold-400' : 'text-purple-200'
              } hover:text-gold-300 transition-colors font-medium`}
            >
              {label}
            </button>
          ))}
          <button onClick={() => navigate('contact')} className="btn-gold w-full justify-center mt-2">
            Book Now
          </button>
        </div>
      )}
    </nav>
  );
}
