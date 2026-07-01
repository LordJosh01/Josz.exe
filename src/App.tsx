import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import PremiumFeatures from './pages/PremiumFeatures';
import EventAI from './pages/EventAI';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact' | 'premium' | 'eventai';

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.closest('[role="button"]')) {
        setHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setHovering(false);
    };

    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
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

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={navigate} />;
      case 'services': return <Services onNavigate={navigate} />;
      case 'portfolio': return <Portfolio onNavigate={navigate} />;
      case 'about': return <About onNavigate={navigate} />;
      case 'faq': return <FAQ onNavigate={navigate} />;
      case 'contact': return <Contact />;
      case 'premium': return <PremiumFeatures onNavigate={navigate} />;
      case 'eventai': return <EventAI onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-purple-100 overflow-x-hidden">
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <CustomCursor />
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main>{renderPage()}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;
