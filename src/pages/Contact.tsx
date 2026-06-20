import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Instagram } from 'lucide-react';

const emptyForm = { name: '', email: '', phone: '', eventType: '', date: '', message: '' };

const GMAIL_URL = 'https://mail.google.com/mail/?view=cm&fs=1&to=aolagbaye@gmail.com&su=Event%20Enquiry%20-%20Events%20By%20BELSH';
const WHATSAPP_URL = 'https://wa.me/2348035672491?text=Hi%20BELSH!%20I%27d%20like%20to%20inquire%20about%20planning%20my%20event.';
const INSTAGRAM_URL = 'https://www.instagram.com/events_by_belsh';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const bodyRef = useReveal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div>
      <section className="page-hero text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(85,33,160,0.4)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in-up">Let us Connect</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-purple-50 mb-4 opacity-0 animate-fade-in-up-2">Contact Us</h1>
          <div className="section-divider" />
          <p className="text-purple-300/80 text-lg max-w-xl mx-auto mt-4 opacity-0 animate-fade-in-up-3">
            Tell us about your celebration — we will reply within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28" ref={bodyRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-5 gap-12 lg:gap-16">

          {/* Info column */}
          <div className="lg:col-span-2 space-y-8 scroll-reveal-left">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-purple-50 mb-2">Ready to celebrate?</h2>
              <p className="text-purple-300/80 text-sm leading-relaxed">
                Whether you have a full vision or just a feeling you want to create, we would love to hear from you.
              </p>
            </div>

            <div className="space-y-4">
              {/* Gmail */}
              <a
                href={GMAIL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 glass-card gold-border rounded-xl p-5 group hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center shrink-0 group-hover:border-gold-400/60 transition-colors">
                  <Mail size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-purple-400 text-xs uppercase tracking-widest mb-1">Email (Gmail)</p>
                  <p className="text-purple-100 text-sm">aolagbaye@gmail.com</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 glass-card gold-border rounded-xl p-5 group hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center shrink-0 group-hover:border-gold-400/60 transition-colors">
                  <Phone size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-purple-400 text-xs uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="text-purple-100 text-sm">+234 803 567 2491</p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 glass-card gold-border rounded-xl p-5 group hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center shrink-0 group-hover:border-gold-400/60 transition-colors">
                  <Instagram size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-purple-400 text-xs uppercase tracking-widest mb-1">Instagram</p>
                  <p className="text-purple-100 text-sm">@events_by_belsh</p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-start gap-4 glass-card gold-border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-gold-900/40 border border-gold-600/30 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-purple-400 text-xs uppercase tracking-widest mb-1">Based In</p>
                  <p className="text-purple-100 text-sm">Ilorin, Kwara State, Nigeria</p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3.5 rounded-sm bg-green-700 hover:bg-green-600 text-white text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-full justify-center"
            >
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 scroll-reveal-right">
            <div className="glass-card gold-border rounded-2xl p-8 md:p-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-12 gap-6">
                  <div className="w-16 h-16 rounded-full bg-gold-900/30 border border-gold-500/40 flex items-center justify-center">
                    <CheckCircle size={32} className="text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-purple-50 mb-2">Message Received!</h3>
                    <p className="text-purple-300/80 max-w-sm">
                      Thank you for reaching out. We will be in touch within 24 hours to discuss your celebration.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSubmitted(false); setForm(emptyForm); }}
                    className="btn-outline-gold text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="font-serif text-2xl text-purple-50 mb-2">Send Us a Message</h3>
                  <p className="text-purple-400 text-sm mb-6">Fill in the details below and we will get back to you shortly.</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Full Name *</label>
                      <input
                        type="text" name="name" required value={form.name} onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Email *</label>
                      <input
                        type="email" name="email" required value={form.email} onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Phone / WhatsApp</label>
                      <input
                        type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+234 000 000 0000"
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Event Type</label>
                      <select
                        name="eventType" value={form.eventType} onChange={handleChange}
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                      >
                        <option value="" className="bg-dark-card">Select type...</option>
                        <option value="Wedding" className="bg-dark-card">Wedding</option>
                        <option value="Birthday" className="bg-dark-card">Birthday</option>
                        <option value="Private Dinner" className="bg-dark-card">Private Dinner</option>
                        <option value="Corporate" className="bg-dark-card">Corporate Event</option>
                        <option value="Other" className="bg-dark-card">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Event Date (if known)</label>
                    <input
                      type="date" name="date" value={form.date} onChange={handleChange}
                      className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-purple-400 uppercase tracking-widest mb-2">Tell Us About Your Vision *</label>
                    <textarea
                      name="message" required value={form.message} onChange={handleChange} rows={5}
                      placeholder="Describe your event, guest count, style preferences, and anything else you would like us to know..."
                      className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-purple-100 placeholder-purple-500 text-sm focus:outline-none focus:border-gold-500/50 transition-colors duration-300 resize-none"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-gold w-full justify-center">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-dark/40 border-t-dark rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <>Send Message <Send size={16} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
