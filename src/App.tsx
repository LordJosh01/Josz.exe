import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';

type Page = 'home' | 'services' | 'portfolio' | 'about' | 'faq' | 'contact';

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
    <div className="min-h-screen bg-purple-950 text-purple-100 overflow-x-hidden">
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main>{renderPage()}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;
