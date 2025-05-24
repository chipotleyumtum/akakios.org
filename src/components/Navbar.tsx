import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import akakiosLogo from '../assets/images/akakios-logo.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`tech-nav ${scrolled ? 'scrolled' : ''} w-full py-4 px-6 md:px-12`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="logo-container flex items-center">
          <div className="logo-glow"></div>
          <img src={akakiosLogo} alt="Akakios" className="h-10 md:h-12" />
          <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-700">AKAKIOS</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#home" className="interactive-element text-foreground hover:text-secondary transition-colors">Home</a>
          <a href="#about" className="interactive-element text-foreground hover:text-secondary transition-colors">About</a>
          <a href="#services" className="interactive-element text-foreground hover:text-secondary transition-colors">Services</a>
          <div className="relative group">
            <button className="interactive-element text-foreground hover:text-secondary transition-colors flex items-center">
              Technology <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-circuit-color hidden group-hover:block">
              <div className="py-1">
                <a href="#ai" className="block px-4 py-2 text-sm text-foreground hover:bg-circuit-color hover:text-secondary">AI Integration</a>
                <a href="#blockchain" className="block px-4 py-2 text-sm text-foreground hover:bg-circuit-color hover:text-secondary">Blockchain Solutions</a>
                <a href="#security" className="block px-4 py-2 text-sm text-foreground hover:bg-circuit-color hover:text-secondary">Security</a>
              </div>
            </div>
          </div>
          <a href="#interactive" className="interactive-element text-foreground hover:text-secondary transition-colors">Interactive</a>
          <a href="#contact" className="glow-button">Contact Us</a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-foreground">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 py-4 px-4 bg-background border-t border-circuit-color">
          <div className="flex flex-col space-y-4">
            <a href="#home" className="text-foreground hover:text-secondary" onClick={toggleMenu}>Home</a>
            <a href="#about" className="text-foreground hover:text-secondary" onClick={toggleMenu}>About</a>
            <a href="#services" className="text-foreground hover:text-secondary" onClick={toggleMenu}>Services</a>
            <div className="relative">
              <button className="text-foreground hover:text-secondary flex items-center justify-between w-full" onClick={() => document.getElementById('mobile-tech-dropdown')?.classList.toggle('hidden')}>
                Technology <ChevronDown className="h-4 w-4" />
              </button>
              <div id="mobile-tech-dropdown" className="hidden mt-2 pl-4 border-l border-circuit-color">
                <div className="py-1 flex flex-col space-y-2">
                  <a href="#ai" className="text-sm text-foreground hover:text-secondary" onClick={toggleMenu}>AI Integration</a>
                  <a href="#blockchain" className="text-sm text-foreground hover:text-secondary" onClick={toggleMenu}>Blockchain Solutions</a>
                  <a href="#security" className="text-sm text-foreground hover:text-secondary" onClick={toggleMenu}>Security</a>
                </div>
              </div>
            </div>
            <a href="#interactive" className="text-foreground hover:text-secondary" onClick={toggleMenu}>Interactive</a>
            <a href="#contact" className="glow-button text-center" onClick={toggleMenu}>Contact Us</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
