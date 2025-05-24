import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import CircuitBackground from './components/CircuitBackground';
import ParticleSystem from './components/ParticleSystem';
import ScrollReveal from './components/ScrollReveal';
import TypewriterText from './components/TypewriterText';
import BlockchainQuiz from './components/BlockchainQuiz';
import AIConnectionGame from './components/AIConnectionGame';
import './App.css';
import akakiosLogo from './assets/images/akakios-logo.png';

const App: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorDot, setCursorDot] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeGame, setActiveGame] = useState<'none' | 'blockchain' | 'ai'>('none');
  const [gameScore, setGameScore] = useState(0);
  const [showParticles, setShowParticles] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      // Add slight delay to dot for smooth effect
      setTimeout(() => {
        setCursorDot({ x: e.clientX, y: e.clientY });
      }, 50);
    };

    const handleMouseOver = () => {
      setIsHovering(true);
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    // Add event listeners for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .interactive-element');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseover', handleMouseOver);
      element.addEventListener('mouseout', handleMouseOut);
    });

    window.addEventListener('mousemove', handleMouseMove);

    // Scroll event for particles
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      
      // Show particles only in certain sections
      if (scrollPosition < windowHeight * 0.8 || 
          (scrollPosition > windowHeight * 1.8 && scrollPosition < windowHeight * 2.8) ||
          scrollPosition > documentHeight - windowHeight * 1.2) {
        setShowParticles(true);
      } else {
        setShowParticles(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseover', handleMouseOver);
        element.removeEventListener('mouseout', handleMouseOut);
      });
    };
  }, []);

  const handleGameComplete = (score: number) => {
    setGameScore(score);
    setTimeout(() => {
      setActiveGame('none');
    }, 5000);
  };

  // Only show custom cursor on desktop
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="App">
      <CircuitBackground />
      {showParticles && <ParticleSystem />}
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="logo-container inline-block mb-8">
            <div className="logo-glow"></div>
            <img src={akakiosLogo} alt="Akakios" className="h-24 md:h-32 mx-auto" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-700">
            <TypewriterText 
              text="Connecting Ideas Through Technology" 
              speed={70} 
              delay={500}
            />
          </h1>
          <ScrollReveal delay={1000}>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Akakios integrates AI and blockchain to create secure, innovative solutions that connect people and ideas.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={1500} direction="up" distance="30px">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="#services" className="glow-button text-center">Our Services</a>
              <a href="#interactive" className="glow-button text-center">Try Interactive Demo</a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-transition py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">About Akakios</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ScrollReveal direction="left">
              <div className="tech-card">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Our Vision</h3>
                <p className="mb-4">
                  At Akakios, we envision a world where technology bridges gaps between ideas, people, and possibilities. 
                  Our mission is to harness the power of AI and blockchain to create secure, innovative solutions that 
                  transform how we connect and collaborate.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="tech-card">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Our Approach</h3>
                <p className="mb-4">
                  We combine cutting-edge AI algorithms with secure blockchain infrastructure to develop solutions that 
                  are not just technologically advanced but also intuitive and accessible. Our team of experts is dedicated 
                  to pushing the boundaries of what's possible.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-transition py-20 px-6 md:px-12 bg-gradient-to-b from-background to-background/80">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Services</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal direction="up" delay={200}>
              <div className="tech-card">
                <h3 className="text-2xl font-bold mb-4 text-secondary">AI Integration</h3>
                <p>
                  Leverage our advanced AI solutions to automate processes, gain insights from data, and enhance 
                  decision-making capabilities.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={400}>
              <div className="tech-card">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Blockchain Solutions</h3>
                <p>
                  Implement secure, transparent, and decentralized systems using our blockchain technology to 
                  revolutionize your operations.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={600}>
              <div className="tech-card">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Security Services</h3>
                <p>
                  Protect your digital assets with our comprehensive security solutions designed to safeguard 
                  against evolving cyber threats.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Interactive Section */}
      <section id="interactive" className="section-transition py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Interactive Experience</h2>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-center mb-8">
              Explore our interactive demos and games to experience the power of Akakios technology firsthand.
            </p>
          </ScrollReveal>
          
          {activeGame === 'none' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ScrollReveal direction="left">
                <div className="tech-card p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4 text-secondary">Blockchain Knowledge Quiz</h3>
                  <p className="mb-6">Test your knowledge about blockchain technology with our interactive quiz.</p>
                  <button 
                    className="glow-button" 
                    onClick={() => setActiveGame('blockchain')}
                  >
                    Start Quiz
                  </button>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right">
                <div className="tech-card p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4 text-secondary">AI Connection Challenge</h3>
                  <p className="mb-6">Connect data sources to AI nodes and outputs to create functioning AI systems.</p>
                  <button 
                    className="glow-button" 
                    onClick={() => setActiveGame('ai')}
                  >
                    Start Challenge
                  </button>
                </div>
              </ScrollReveal>
            </div>
          )}
          
          {activeGame === 'blockchain' && (
            <BlockchainQuiz onComplete={handleGameComplete} />
          )}
          
          {activeGame === 'ai' && (
            <AIConnectionGame onComplete={handleGameComplete} />
          )}
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="section-transition py-20 px-6 md:px-12 bg-gradient-to-b from-background/80 to-background">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Technology</h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <ScrollReveal direction="left">
              <div id="ai" className="tech-card">
                <h3 className="text-2xl font-bold mb-4 text-secondary">AI Integration</h3>
                <p className="mb-4">
                  Our AI solutions leverage cutting-edge machine learning algorithms and neural networks to process and analyze 
                  vast amounts of data, extracting valuable insights and enabling intelligent decision-making.
                </p>
                <p>
                  From natural language processing to computer vision and predictive analytics, our AI technologies 
                  can be tailored to meet your specific business needs and challenges.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div id="blockchain" className="tech-card">
                <h3 className="text-2xl font-bold mb-4 text-secondary">Blockchain Solutions</h3>
                <p className="mb-4">
                  Our blockchain infrastructure provides a secure, transparent, and immutable foundation for 
                  decentralized applications and transactions.
                </p>
                <p>
                  We implement smart contracts, distributed ledgers, and consensus mechanisms to ensure data integrity, 
                  reduce intermediaries, and enable trustless interactions between parties.
                </p>
              </div>
            </ScrollReveal>
          </div>
          
          <ScrollReveal direction="up">
            <div id="security" className="tech-card max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-secondary">Security Framework</h3>
              <p className="mb-4">
                Security is at the core of everything we do at Akakios. Our comprehensive security framework 
                combines advanced encryption, multi-factor authentication, and continuous monitoring to protect 
                your data and systems from threats.
              </p>
              <p>
                We implement zero-trust architecture principles and follow industry best practices to ensure 
                that your digital assets remain secure in an ever-evolving threat landscape.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-transition py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Contact Us</h2>
          </ScrollReveal>
          <ScrollReveal direction="up">
            <div className="tech-card max-w-2xl mx-auto">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full p-3 bg-background border border-circuit-color rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full p-3 bg-background border border-circuit-color rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full p-3 bg-background border border-circuit-color rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button type="submit" className="glow-button w-full">Send Message</button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-circuit-color">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <img src={akakiosLogo} alt="Akakios" className="h-8" />
          </div>
          <div className="text-sm text-foreground/70">
            &copy; {new Date().getFullYear()} Akakios. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="#" className="text-foreground/70 hover:text-secondary">Privacy Policy</a>
            <a href="#" className="text-foreground/70 hover:text-secondary">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Custom Cursor (Desktop Only) */}
      {!isMobile && (
        <>
          <div 
            className="cursor-dot" 
            style={{ 
              left: `${cursorDot.x}px`, 
              top: `${cursorDot.y}px` 
            }}
          ></div>
          <div 
            className="cursor-outline" 
            style={{ 
              left: `${cursorPosition.x}px`, 
              top: `${cursorPosition.y}px`,
              width: isHovering ? '60px' : '40px',
              height: isHovering ? '60px' : '40px',
              borderColor: isHovering ? 'var(--accent)' : 'var(--secondary)'
            }}
          ></div>
        </>
      )}
    </div>
  );
};

export default App;
