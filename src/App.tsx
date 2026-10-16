import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import BackgroundAnimation from './components/BackgroundAnimation';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import PremiumFeatures from './pages/PremiumFeatures';
import EventAI from './pages/EventAI';
import CountdownBanner from './components/CountdownBanner';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact' | 'premium' | 'eventai';

// Custom cursor with throttling for performance
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      const now = Date.now();
      // Throttle to ~60fps max
      if (now - lastTimeRef.current < 16) return;
      lastTimeRef.current = now;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
        if (!visible) setVisible(true);
      });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.closest('[role="button"]')) {
        setHovering(true);
      }
    };

    const handleMouseLeave = () => setHovering(false);

    window.addEventListener('mousemove', updatePosition, { passive: true });
    document.addEventListener('mouseover', handleMouseEnter, { passive: true });
    document.addEventListener('mouseout', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div
        className={`cursor-dot ${hovering ? 'hover' : ''}`}
        style={{ left: position.x - 4, top: position.y - 4 }}
      />
      <div
        className={`cursor-outline ${hovering ? 'hover' : ''}`}
        style={{ left: position.x - 15, top: position.y - 15 }}
      />
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  const renderPage = useMemo(() => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={navigate} />;
      case 'services': return <Services onNavigate={navigate} />;
      case 'portfolio': return <Portfolio onNavigate={navigate} />;
      case 'about': return <About onNavigate={navigate} />;
      case 'faq': return <FAQ onNavigate={navigate} />;
      case 'contact': return <Contact />;
      case 'premium': return <PremiumFeatures onNavigate={navigate} />;
      case 'eventai': return <EventAI onNavigate={navigate} />;
      default: return <Home onNavigate={navigate} />;
    }
  }, [currentPage, navigate]);

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <BackgroundAnimation />
      <CustomCursor />
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <CountdownBanner />
      <main className="relative z-10" key={currentPage}>{renderPage}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;
