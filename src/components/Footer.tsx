import { Mail, Phone, Instagram } from 'lucide-react';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const quickLinks: Page[] = ['services', 'portfolio', 'about', 'faq', 'contact'];

const GMAIL_URL = 'https://mail.google.com/mail/?view=cm&fs=1&to=aolagbaye@gmail.com&su=Event%20Enquiry%20-%20Events%20By%20BELSH';
const WHATSAPP_URL = 'https://wa.me/2348035672491?text=Hi%20BELSH!%20I%27d%20like%20to%20inquire%20about%20your%20event%20services.';
const INSTAGRAM_URL = 'https://www.instagram.com/events_by_belsh';

export default function Footer({ onNavigate }: FooterProps) {
  const navigate = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-purple-900 border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/EVENT_BY_BELSH.jpg"
                alt="Events By BELSH"
                className="h-14 w-14 object-contain rounded-full ring-2 ring-gold-500/30"
              />
              <div>
                <p className="font-serif text-2xl text-gold-400 tracking-widest">BELSH</p>
                <p className="text-purple-300 text-xs tracking-widest uppercase">Events</p>
              </div>
            </div>
            <p className="text-purple-300/80 text-sm leading-relaxed mb-5">
              Boutique event planning and design — weddings, birthdays and private celebrations
              crafted with care in Kwara and beyond.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full glass-card gold-border flex items-center justify-center hover:border-gold-400/70 hover:-translate-y-0.5 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={16} className="text-gold-400" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full glass-card gold-border flex items-center justify-center hover:border-gold-400/70 hover:-translate-y-0.5 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 text-gold-400 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href={GMAIL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full glass-card gold-border flex items-center justify-center hover:border-gold-400/70 hover:-translate-y-0.5 transition-all duration-300"
                aria-label="Gmail"
              >
                <Mail size={16} className="text-gold-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold-400 text-xs uppercase tracking-widest mb-5">Quick Links</h4>
            <div className="space-y-3">
              {quickLinks.map((page) => (
                <button
                  key={page}
                  onClick={() => navigate(page)}
                  className="block text-purple-300 hover:text-gold-300 transition-colors text-sm capitalize"
                >
                  {page}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold-400 text-xs uppercase tracking-widest mb-5">Get In Touch</h4>
            <div className="space-y-4">
              <a
                href={GMAIL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-purple-300 hover:text-gold-300 transition-colors text-sm"
              >
                <Mail size={16} className="text-gold-500 shrink-0" />
                aolagbaye@gmail.com
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-purple-300 hover:text-gold-300 transition-colors text-sm"
              >
                <Phone size={16} className="text-gold-500 shrink-0" />
                +234 803 567 2491
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-purple-300 hover:text-gold-300 transition-colors text-sm"
              >
                <Instagram size={16} className="text-gold-500 shrink-0" />
                @events_by_belsh
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-purple-400">
          <p>&copy; {new Date().getFullYear()} Events By BELSH. All rights reserved.</p>
          <p>Kwara State, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
