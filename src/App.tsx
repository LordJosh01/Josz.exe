import { useState, useEffect, useCallback, useMemo } from 'react';
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
    <div className="min-h-screen bg-dark text-purple-100 overflow-x-hidden">
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main>{renderPage}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;
