"use client";
import { motion, AnimatePresence, useMotionValue, useAnimationFrame, useScroll, useTransform, Variants } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Facebook, Instagram, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [heroKey, setHeroKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // --- GALLERY STATE ---
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);

  // --- FOOTER SCROLL LOGIC ---
  const { scrollYProgress } = useScroll();
  const footerHeight = useTransform(scrollYProgress, [0.9, 0.99], ["60px", "400px"]);
  const footerColor = useTransform(scrollYProgress, [0.9, 0.99], ["rgba(255,255,255,0.8)", "rgba(0,0,0,1)"]);
  const footerTextColor = useTransform(scrollYProgress, [0.9, 0.99], ["#A1A1AA", "#FFFFFF"]);
  const footerContentOpacity = useTransform(scrollYProgress, [0.95, 1], [0, 1]); 

  // --- DYNAMIC INFINITE LOOP CONFIG ---
  const galleryRef = useRef<HTMLDivElement>(null);
  const [refWidth, setRefWidth] = useState(0);

  useEffect(() => {
    if (galleryRef.current) {
        setRefWidth(galleryRef.current.scrollWidth / 3);
    }
  }, []);

  // --- ANIMATION FRAME ---
  useAnimationFrame((t, delta) => {
    if (!isDragging) {
      const moveBy = -0.5 * (delta / 10); 
      let newX = x.get() + moveBy;
      const threshold = refWidth > 0 ? -refWidth : -5000;
      if (newX <= threshold) {
        newX = 0;
      }
      x.set(newX);
    }
  });

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false); 
    setIsLoading(true);   
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- INITIAL LOAD & SCROLL RESTORATION ---
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMenuOpen || isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    const interval = setInterval(() => setHeroKey((prev) => prev + 1), 5000);
    return () => clearInterval(interval);
  }, [isMenuOpen, isLoading]);

  const images = ["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg", "/5.jpg", "/6.jpg", "/7.jpg", "/8.jpg", "/9.jpg", "/10.jpg"];
  const duplicatedImages = [...images, ...images, ...images];

  const handleDragStart = () => {
    setIsDragging(true);
    isDraggingRef.current = true;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 200);
  };

  // --- ANIMATION VARIANTS (FIXED TYPES FOR VERCEL) ---
  const sentence: Variants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const letter: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const menuContainerVars: Variants = {
    initial: { scaleY: 0 },
    animate: { scaleY: 1, transition: { duration: 0.5, ease: [0.12, 0, 0.39, 0] } },
    exit: { scaleY: 0, transition: { delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };
  const menuLinkVars: Variants = {
    initial: { y: "30vh", transition: { duration: 0.5, ease: [0.37, 0, 0.63, 1] } },
    open: { y: 0, transition: { duration: 0.7, ease: [0, 0.55, 0.45, 1] } },
  };
  const containerVars: Variants = {
    initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
    open: { transition: { delayChildren: 0.3, staggerChildren: 0.09, staggerDirection: 1 } }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#E2B007]/30 selection:text-black overflow-x-hidden pb-[400px]"> 
      
      {/* --- PRELOADER --- */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }} className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: [1, 1.05, 1], opacity: 1 }} transition={{ scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }, opacity: { duration: 0.5 }}} className="flex flex-col items-center gap-6">
              <img src="/logo.png" alt="Loading" className="h-20 md:h-28 w-auto invert drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              <div className="flex flex-col items-center gap-2">
                 <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2, ease: "easeInOut" }} className="h-[2px] bg-[#E2B007] w-32 rounded-full" />
                 <span className="text-zinc-500 font-mono text-[10px] tracking-[0.4em] uppercase">Loading</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-[100] flex justify-between items-center px-5 md:px-12 py-4 border-b border-transparent md:border-zinc-100 bg-white/0 md:bg-white/95 md:backdrop-blur-md">
        <button onClick={handleLogoClick} className="relative z-[110] block focus:outline-none">
          <img src="/logo.png" alt="CROSSWAY LOGO" className="h-8 md:h-10 w-auto object-contain hover:opacity-80 transition-opacity" />
        </button>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => router.push('/#about')} className="text-xs font-bold uppercase tracking-widest hover:text-[#E2B007] transition-colors">About</button>
          <button onClick={() => router.push('/')} className="text-xs font-bold uppercase tracking-widest hover:text-[#E2B007] transition-colors">Crosscon</button>
          <button onClick={() => router.push('/merch')} className="text-xs font-bold uppercase tracking-widest hover:text-[#E2B007] transition-colors">Merch</button>
          
          <button 
            type="button"
            onClick={() => router.push('/register')} 
            className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#E2B007] hover:text-black transition-all"
          >
            Register
          </button>
        </div>
        <button className="md:hidden p-2 relative z-[110] text-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div variants={menuContainerVars} initial="initial" animate="animate" exit="exit" className="fixed inset-0 bg-[#E2B007] z-[100] origin-top flex flex-col justify-center px-5 md:hidden">
              <motion.div variants={containerVars} initial="initial" animate="open" exit="initial" className="flex flex-col gap-6">
                {['About', 'Crosscon', 'Merch', 'Register'].map((item) => (
                  <div key={item} className="overflow-hidden">
                    <motion.div variants={menuLinkVars}>
                      <a 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            if (item === 'Register') {
                                router.push('/register');
                            } else if (item === 'About') {
                                handleScroll(e as any, 'about');
                            } else if (item === 'Merch') {
                                router.push('/merch');
                            } else if (item === 'Crosscon') {
                                router.push('/');
                            }
                            setIsMenuOpen(false);
                        }}
                        className={`block text-5xl font-black uppercase tracking-tighter transition-colors ${item === 'Register' ? 'text-white hover:text-black' : 'text-black hover:text-white'}`}
                      >
                        {item}
                      </a>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- */}
      <div id="hero" className="relative flex flex-col justify-start px-5 md:px-20 min-h-screen pt-48 md:pt-36 pb-16">
        <div className="absolute top-1/4 left-0 w-[250px] md:w-[600px] h-[300px] md:h-[500px] bg-[#E2B007]/10 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.span className="z-10 text-zinc-400 font-mono text-[10px] md:text-sm tracking-[0.3em] uppercase mb-6 md:mb-12">EST. 2023 / YOUTH MOVEMENT</motion.span>
        
        <motion.h1 key={heroKey} variants={sentence} initial="hidden" animate="visible" className="z-10 font-black tracking-tighter uppercase text-black leading-tight w-full max-w-full" style={{ fontSize: "clamp(2rem, 11vw, 10rem)" }}>
          <div className="flex whitespace-nowrap overflow-visible">{"CROSSWAY".split("").map((char, index) => (<motion.span key={index} variants={letter}>{char}</motion.span>))}</div>
          <div className="flex flex-wrap gap-x-4 md:gap-x-6 mt-2">
            <span className="text-transparent italic outline-text whitespace-nowrap">{"CONFERENCE".split("").map((char, index) => (<motion.span key={index} variants={letter}>{char}</motion.span>))}</span> 
            <span className="text-transparent italic outline-text whitespace-nowrap">{"2026".split("").map((char, index) => (<motion.span key={index} variants={letter}>{char}</motion.span>))}</span>
          </div>
        </motion.h1>
        <div className="z-10 mt-8 md:mt-10 flex flex-col items-start gap-1 max-w-full">
          <p className="font-black tracking-tight uppercase text-[#E2B007] break-words max-w-full leading-none" style={{ fontSize: "clamp(1.3rem, 6.5vw, 2.5rem)" }}>YOUR LIGHT HAS COME.</p>
          <p className="text-zinc-600 font-bold uppercase tracking-tight break-words max-w-full leading-tight" style={{ fontSize: "clamp(0.85rem, 4.2vw, 1.8rem)" }}>JOIN US FOR THE 2026 CONFERENCE.</p>
        </div>
        <div className="z-10 mt-12 md:mt-24">
          <button 
            onClick={() => router.push('/register')}
            className="px-10 py-5 md:px-16 md:py-6 bg-black text-white text-[13px] md:text-lg font-bold uppercase w-full md:w-auto tracking-[0.2em] shadow-2xl hover:bg-[#E2B007] hover:text-black transition-all active:scale-95"
          >
            Register Now
          </button>
        </div>
        <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: 10 }} transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }} className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[95] pointer-events-none">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-black">Scroll for more</span>
          <ChevronDown className="text-[#E2B007]" size={24} />
        </motion.div>
      </div>

      {/* --- MISSION & VISION & GALLERY --- */}
      <section id="about" className="py-16 md:py-32 bg-white border-t border-zinc-100 scroll-mt-24">
        <div className="px-5 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <div className="flex flex-col items-start gap-3">
            <h2 className="text-[#E2B007] font-mono text-[10px] md:text-sm uppercase tracking-[0.3em] font-bold">// Mission</h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sentence} className="font-black tracking-tighter text-black uppercase leading-[0.9] flex flex-wrap" style={{ fontSize: "clamp(2rem, 9vw, 3.5rem)" }}>{"Empower the youth to get real with Jesus, grow their faith through discipleship, and equip them to share it.".split(" ").map((word, i) => (<motion.span key={i} variants={letter} className="mr-2 md:mr-3">{word}</motion.span>))}</motion.p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <h2 className="text-[#E2B007] font-mono text-[10px] md:text-sm uppercase tracking-[0.3em] font-bold">// Vision</h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sentence} className="font-black tracking-tighter text-black uppercase leading-[0.9] flex flex-wrap" style={{ fontSize: "clamp(2rem, 9vw, 3.5rem)" }}>{"A growing squad of young hearts on a journey with Jesus, shining His light to a world in need.".split(" ").map((word, i) => (<motion.span key={i} variants={letter} className="mr-2 md:mr-3">{word}</motion.span>))}</motion.p>
          </div>
        </div>

        {/* --- INFINITE DRAGGABLE GALLERY --- */}
        <div className="mt-16 md:mt-24 relative">
          <span className="absolute -top-8 left-5 md:left-20 text-[10px] uppercase tracking-widest text-zinc-400 font-bold z-10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E2B007] animate-pulse"/> 
            Drag to Explore
          </span>
          
          <div className="relative flex overflow-hidden cursor-grab active:cursor-grabbing">
            <motion.div 
              ref={galleryRef}
              className="flex gap-4 flex-nowrap" 
              style={{ x }}
              drag="x"
              dragElastic={0.05}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              {duplicatedImages.map((src, index) => (
                <div 
                  key={index} 
                  onClick={() => {
                    if (!isDraggingRef.current) setSelectedImage(src);
                  }} 
                  className="relative min-w-[80vw] md:min-w-[550px] h-[380px] md:h-[650px] bg-zinc-100 overflow-hidden shrink-0 select-none group"
                >
                  <img src={src} alt="Gallery" className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- EXPANDING FOOTER / CONTACT SECTION --- */}
      <motion.footer 
        style={{ 
          height: footerHeight,
          backgroundColor: footerColor,
          color: footerTextColor
        }}
        className="fixed bottom-0 left-0 w-full z-[90] flex flex-col justify-between overflow-hidden border-t border-zinc-100/50 backdrop-blur-md"
      >
        <div className="flex justify-end items-start px-5 md:px-12 pt-4 w-full h-[60px] shrink-0">
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-80 pt-1">© 2026 CROSSWAY</div>
        </div>

        <motion.div 
          style={{ opacity: footerContentOpacity }}
          className="flex-1 px-5 md:px-12 pb-12 flex flex-col justify-center gap-8"
        >
           <div className="flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="flex flex-col gap-2">
                 <h3 className="text-[#E2B007] text-xs font-bold uppercase tracking-[0.2em] mb-2">Contact Us</h3>
                 <p className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Get in Touch</p>
                 <a href="mailto:crossway2024@gmail.com" className="text-xl md:text-2xl font-light opacity-80 hover:text-[#E2B007] transition-colors mt-2 flex items-center gap-2 group">
                    crossway2024@gmail.com 
                    <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                 </a>
                 <div className="flex gap-6 items-center mt-6">
                    <a href="https://www.instagram.com/crossway_yth/" className="hover:text-[#E2B007] transition-colors"><Instagram size={28} /></a>
                    <a href="https://www.facebook.com/crossway2023" className="hover:text-[#E2B007] transition-colors"><Facebook size={28} /></a>
                 </div>
              </div>
              
              <div className="flex flex-col gap-4 text-sm md:text-base opacity-70 font-mono uppercase tracking-widest text-right">
                 <p>77 Artiaga Street, Davao City, Philippines</p>
                 <p></p>
              </div>
           </div>
        </motion.div>
      </motion.footer>

      {/* --- LIGHTBOX --- */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImage(null)} className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center p-4 cursor-zoom-out">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full h-full flex items-center justify-center">
              <img src={selectedImage} alt="Preview" className="max-w-full max-h-[85vh] object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .outline-text { -webkit-text-stroke: 1.2px black; color: transparent; }
        @media (min-width: 768px) { .outline-text { -webkit-text-stroke: 2.5px black; } }
      `}</style>
    </div>
  );
}