"use client";
import { motion, AnimatePresence, useMotionValue, useAnimationFrame, useScroll, useTransform, Variants } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Instagram, Facebook, ChevronDown, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MerchPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- MERCH DATA ---
  const showcaseImages = [
    { src: "/shoot1.jpg", alt: "Showcase 1" },
    { src: "/shoot2.jpg", alt: "Showcase 2" },
    { src: "/shoot5.jpg", alt: "Showcase 5" },
    { src: "/shoot6.jpg", alt: "Showcase 6" },
    { src: "/shoot3.jpg", alt: "Showcase 3" },
    { src: "/shoot4.jpg", alt: "Showcase 4" },
    { src: "/shoot7.jpg", alt: "Showcase 7" },
    { src: "/shoot8.jpg", alt: "Showcase 8" },
    { src: "/shoot9.jpg", alt: "Showcase 9" },
    { src: "/shoot10.jpg", alt: "Showcase 10" },
    { src: "/shoot11.jpg", alt: "Showcase 11" },
    { src: "/shoot12.jpg", alt: "Showcase 12" },
    { src: "/shoot13.jpg", alt: "Showcase 13" },
  ];

  const merchItems = [
    { id: 1, src: "/sblack.png", name: "CROSSCON SHIRT BLACK ", price: "₱399", specs: "100% Cotton / Oversized Fit" },
    { id: 2, src: "/swhite.png", name: "CROSSCON SHIRT WHITE", price: "₱399", specs: "100% Cotton / Oversized Fit" },
    { id: 3, src: "/scream.png", name: "CROSSCON SHIRT CREAM", price: "₱399", specs: "100% Cotton / Oversized Fit" },
    { id: 4, src: "/hblack.png", name: "CROSSCON HOODIE BLACK", price: "₱899", specs: "Heavyweight Fleece" },
    { id: 5, src: "/hwhite.png", name: "CROSSCON HOODIE WHITE", price: "₱899", specs: "Heavyweight Fleece" },
  ];

  // --- FOOTER SCROLL LOGIC ---
  const { scrollYProgress } = useScroll();
  const footerHeight = useTransform(scrollYProgress, [0.9, 0.99], ["60px", "400px"]);
  const footerColor = useTransform(scrollYProgress, [0.9, 0.99], ["rgba(255,255,255,0.8)", "rgba(0,0,0,1)"]);
  const footerTextColor = useTransform(scrollYProgress, [0.9, 0.99], ["#A1A1AA", "#FFFFFF"]);
  const footerContentOpacity = useTransform(scrollYProgress, [0.95, 1], [0, 1]);

  // --- GALLERY LOGIC ---
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [refWidth, setRefWidth] = useState(0);
  const duplicatedShowcase = [...showcaseImages, ...showcaseImages, ...showcaseImages];

  useEffect(() => {
    if (containerRef.current) {
      setRefWidth(containerRef.current.scrollWidth / 3);
    }
  }, []);

  useAnimationFrame((t, delta) => {
    if (isLoading) return;
    const moveBy = -0.5 * (delta / 10); 
    let newX = x.get() + moveBy;
    if (newX <= -refWidth && refWidth > 0) {
      newX = 0;
    }
    x.set(newX);
  });

  // --- SYNCED LIFECYCLE ---
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
  }, [isMenuOpen, isLoading]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setIsLoading(true);
    setTimeout(() => router.push('/'), 1000);
  };

  const menuContainerVars: Variants = {
    initial: { scaleY: 0 },
    animate: { scaleY: 1, transition: { duration: 0.5, ease: [0.12, 0, 0.39, 0] } },
    exit: { scaleY: 0, transition: { delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };
  const containerVars: Variants = {
    initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
    open: { transition: { delayChildren: 0.3, staggerChildren: 0.09, staggerDirection: 1 } }
  };
  const menuLinkVars: Variants = {
    initial: { y: "30vh", transition: { duration: 0.5, ease: [0.37, 0, 0.63, 1] } },
    open: { y: 0, transition: { duration: 0.7, ease: [0, 0.55, 0.45, 1] } },
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#E2B007]/30 overflow-x-hidden pb-[400px]">
      
      {/* --- PRELOADER --- */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.8 }}} className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: [1, 1.05, 1], opacity: 1 }} transition={{ scale: { repeat: Infinity, duration: 2 }}} className="flex flex-col items-center gap-6">
              <img src="/logo.png" alt="Loading" className="h-20 md:h-28 w-auto invert drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              <div className="flex flex-col items-center gap-2">
                 <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }} className="h-[2px] bg-[#E2B007] w-32 rounded-full" />
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
          <button onClick={() => router.push('/#about')} className="text-xs font-bold uppercase tracking-widest hover:text-[#E2B007]">About</button>
          <button onClick={() => router.push('/')} className="text-xs font-bold uppercase tracking-widest hover:text-[#E2B007]">Crosscon</button>
          <button onClick={() => router.push('/merch')} className="text-xs font-bold uppercase tracking-widest text-[#E2B007]">Merch</button>
          <button onClick={() => router.push('/register')} className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#E2B007] transition-all">Register</button>
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
                      <button onClick={() => { setIsMenuOpen(false); router.push(item === 'About' ? '/#about' : item === 'Crosscon' ? '/' : item === 'Merch' ? '/merch' : '/register') }} className="block text-5xl font-black uppercase tracking-tighter text-left text-black hover:text-white transition-colors">{item}</button>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 md:pt-32 pb-12 overflow-hidden flex flex-col justify-start">
        <div className="px-5 md:px-20 mb-4 z-10">
            <span className="text-[#E2B007] font-mono text-[10px] md:text-sm tracking-[0.3em] uppercase font-bold block mb-2">Showcase / CROSSCON MERCH</span>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
              YOUR LIGHT <br/> <span className="italic outline-text">HAS COME</span>
            </h1>
        </div>

        {/* --- VIDEO SECTION (ADDED) --- */}
        <div className="w-full px-5 md:px-20 mb-12">
            <div className="w-full aspect-video md:h-[600px] overflow-hidden bg-black border border-zinc-100 shadow-2xl">
                <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="w-full h-full object-cover"
                >
                    <source src="/merchvideo.mp4" type="video/mp4" />
                </video>
            </div>
        </div>

        {/* --- MOVING IMAGE GALLERY --- */}
        <div className="relative flex whitespace-nowrap">
          <motion.div ref={containerRef} style={{ x }} className="flex gap-4 md:gap-8 px-4">
            {duplicatedShowcase.map((item, i) => (
              <div key={i} className="w-[75vw] md:w-[500px] aspect-[3/4] bg-transparent shrink-0 overflow-hidden">
                <img src={item.src} alt={item.alt} className="w-full h-full object-contain transition-transform duration-700 hover:scale-105" />
              </div>
            ))}
          </motion.div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-2 pointer-events-none">
           <ChevronDown className="text-[#E2B007] animate-bounce" size={24} />
        </div>
      </section>

      {/* --- PRODUCT LIST --- */}
      <section className="px-5 md:px-20 py-20 border-t border-zinc-100 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-24">
          {merchItems.map((item) => (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} key={item.id}>
              <div className="aspect-[4/5] bg-transparent overflow-hidden relative mb-6 border border-zinc-100">
                <img src={item.src} alt={item.name} className="w-full h-full object-contain transition-transform duration-1000 hover:scale-105" />
                <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 font-mono text-sm">{item.price}</div>
              </div>
              <h3 className="text-4xl font-black uppercase tracking-tighter leading-none border-l-4 border-[#E2B007] pl-4">{item.name}</h3>
              <p className="text-sm font-bold text-zinc-500 uppercase mt-4 max-w-sm">{item.specs}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- EXPANDING FOOTER --- */}
      <motion.footer 
        style={{ height: footerHeight, backgroundColor: footerColor, color: footerTextColor }}
        className="fixed bottom-0 left-0 w-full z-[90] flex flex-col justify-between overflow-hidden border-t border-zinc-100/50 backdrop-blur-md"
      >
        <div className="flex justify-end items-start px-5 md:px-12 pt-4 w-full h-[60px] shrink-0">
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-80 pt-1">© 2023 CROSSWAY</div>
        </div>

        <motion.div style={{ opacity: footerContentOpacity }} className="flex-1 px-5 md:px-12 pb-12 flex flex-col justify-center gap-8">
           <div className="flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="flex flex-col gap-2">
                 <h3 className="text-[#E2B007] text-xs font-bold uppercase tracking-[0.2em] mb-2">Available at Crosscon</h3>
                 <p className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">The Movement Wear</p>
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
              </div>
           </div>
        </motion.div>
      </motion.footer>

      <style jsx>{`
        .outline-text { -webkit-text-stroke: 1.2px black; color: transparent; }
        @media (min-width: 768px) { .outline-text { -webkit-text-stroke: 2.5px black; } }
      `}</style>
    </div>
  );
}