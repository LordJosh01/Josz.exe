import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact';

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
    }
  };

  return (
    <div className="min-h-screen bg-dark text-purple-100 overflow-x-hidden">
      <CustomCursor />
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main>{renderPage()}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;
