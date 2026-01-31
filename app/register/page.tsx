"use client";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion"; // Added Variants
import { createClient } from '@supabase/supabase-js';
import { Upload, AlertCircle, CheckCircle, Loader2, ArrowLeft, CreditCard, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

// --- SUPABASE CLIENT SETUP ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RegisterPage() {
  const router = useRouter();
  
  // --- STATE ---
  const [isMenuOpen, setIsMenuOpen] = useState(false); // FOR THE NAV BAR
  const [regStep, setRegStep] = useState(1); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    contact: "",
    email: "",
    church: "",
    agreedToPolicy: false,
    agreedToStatement: false,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // --- NAV ANIMATION VARIANTS (Fixed types for Deployment) ---
  const menuContainerVars: Variants = {
    initial: { scaleY: 0 },
    animate: { scaleY: 1, transition: { duration: 0.5, ease: [0.12, 0, 0.39, 0] as any } },
    exit: { scaleY: 0, transition: { delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } },
  };
  const menuLinkVars: Variants = {
    initial: { y: "30vh", transition: { duration: 0.5, ease: [0.37, 0, 0.63, 1] as any } },
    open: { y: 0, transition: { duration: 0.7, ease: [0, 0.55, 0.45, 1] as any } },
  };
  const containerVars: Variants = {
    initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
    open: { transition: { delayChildren: 0.3, staggerChildren: 0.09, staggerDirection: 1 } },
  };

  // --- LOGIC ---
  const validateStep1 = () => {
    const newErrors: any = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.age.trim()) newErrors.age = "Age is required";
    else if (!/^\d+$/.test(formData.age)) newErrors.age = "Age must be a valid number";
    if (!formData.contact.trim()) newErrors.contact = "Contact number is required";
    else if (!/^\d+$/.test(formData.contact)) newErrors.contact = "Contact must be digits only";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please use a valid email address.";
    if (!formData.church.trim()) newErrors.church = "Church name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFinalStep = () => {
    const newErrors: any = {};
    if (!photoFile) newErrors.photo = "Please upload your GCash receipt/proof.";
    if (!formData.agreedToStatement) newErrors.statement = "You must verify the statement.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextToPolicy = () => { if (validateStep1()) setRegStep(2); };
  const handleConfirmPolicy = () => { setRegStep(3); };

  const handleFinalSubmit = async () => {
    if (!validateFinalStep()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
        if (!photoFile) throw new Error("No photo selected");
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}_${formData.fullName.replace(/\s+/g, '')}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('payment_proofs').upload(fileName, photoFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('payment_proofs').getPublicUrl(fileName);
        const { error: insertError } = await supabase.from('registrations').insert([{
            full_name: formData.fullName, age: formData.age, contact_number: formData.contact,
            email: formData.email, church_name: formData.church, photo_url: publicUrl
        }]);
        if (insertError) throw insertError;
        setSubmitSuccess(true);
    } catch (err: any) { setSubmitError(err.message || "An error occurred."); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#E2B007]/30 flex flex-col">
        
        {/* --- NAV BAR (REPLACED THE STATIC HEADER) --- */}
        <nav className="fixed top-0 w-full z-[100] flex justify-between items-center px-5 md:px-12 py-4 border-b border-zinc-100 bg-white/95 backdrop-blur-md">
            <button onClick={() => router.push('/')} className="relative z-[110]">
                <img src="/logo.png" alt="LOGO" className="h-8 md:h-10 w-auto" />
            </button>

            <div className="hidden md:flex items-center gap-8">
                <button onClick={() => router.push('/#about')} className="text-xs font-bold uppercase tracking-widest hover:text-[#E2B007] transition-colors">About</button>
                <button onClick={() => router.push('/')} className="text-xs font-bold uppercase tracking-widest hover:text-[#E2B007] transition-colors">Crosscon</button>
                <button onClick={() => {setRegStep(1); setSubmitSuccess(false);}} className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#E2B007] hover:text-black transition-all">Register</button>
            </div>

            <button className="md:hidden p-2 relative z-[110] text-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div variants={menuContainerVars} initial="initial" animate="animate" exit="exit" className="fixed inset-0 bg-[#E2B007] z-[100] origin-top flex flex-col justify-center px-5 md:hidden">
                        <motion.div variants={containerVars} initial="initial" animate="open" exit="initial" className="flex flex-col gap-6">
                            {['About', 'Crosscon', 'Register'].map((item) => (
                                <div key={item} className="overflow-hidden">
                                    <motion.div variants={menuLinkVars}>
                                        <button 
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                if(item === 'Register') { setRegStep(1); setSubmitSuccess(false); }
                                                else router.push(item === 'About' ? '/#about' : '/');
                                            }} 
                                            className="block text-5xl font-black uppercase text-black hover:text-white transition-colors"
                                        >
                                            {item}
                                        </button>
                                    </motion.div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-start pt-32 pb-20 px-5">
            <div className="w-full max-w-lg">
                {submitSuccess ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center gap-6 py-20">
                        <CheckCircle size={80} className="text-[#E2B007]" />
                        <h2 className="text-3xl font-black uppercase">Registration Complete!</h2>
                        <p className="text-zinc-500">Thank you for registering. The Crossway team will email or contact you within six (6) working days to confirm your registration.</p>
                        <button onClick={() => router.push('/')} className="mt-8 px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-[#E2B007] hover:text-black transition-all">Back to Home</button>
                    </motion.div>
                ) : (
                <>
                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Register Now</h1>
                        <p className="text-zinc-500 text-sm">Join the movement. Secure your spot.</p>
                    </div>

                    <div className="flex gap-2 mb-10">
                        <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${regStep >= 1 ? 'bg-[#E2B007]' : 'bg-zinc-200'}`} />
                        <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${regStep >= 2 ? 'bg-[#E2B007]' : 'bg-zinc-200'}`} />
                        <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${regStep >= 3 ? 'bg-[#E2B007]' : 'bg-zinc-200'}`} />
                    </div>

                    <AnimatePresence mode="wait">
                    {regStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Full Name</label>
                                <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className={`w-full p-4 bg-zinc-50 border ${errors.fullName ? 'border-red-500' : 'border-zinc-200'} focus:outline-none focus:border-[#E2B007] transition-colors`} placeholder="Juan Dela Cruz" />
                                {errors.fullName && <span className="text-red-500 text-[10px] uppercase font-bold">{errors.fullName}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Age</label>
                                <input type="text" inputMode="numeric" value={formData.age} onChange={(e) => { const val = e.target.value; if (val === '' || /^\d+$/.test(val)) setFormData({...formData, age: val}); }} className={`w-full p-4 bg-zinc-50 border ${errors.age ? 'border-red-500' : 'border-zinc-200'} focus:outline-none focus:border-[#E2B007] transition-colors`} placeholder="20" />
                                {errors.age && <span className="text-red-500 text-[10px] uppercase font-bold">{errors.age}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Contact Number</label>
                                <input type="text" inputMode="numeric" value={formData.contact} onChange={(e) => { const val = e.target.value; if (val === '' || /^\d+$/.test(val)) setFormData({...formData, contact: val}); }} className={`w-full p-4 bg-zinc-50 border ${errors.contact ? 'border-red-500' : 'border-zinc-200'} focus:outline-none focus:border-[#E2B007] transition-colors`} placeholder="09123456789" />
                                {errors.contact && <span className="text-red-500 text-[10px] uppercase font-bold">{errors.contact}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
                                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`w-full p-4 bg-zinc-50 border ${errors.email ? 'border-red-500' : 'border-zinc-200'} focus:outline-none focus:border-[#E2B007] transition-colors`} placeholder="you@example.com" />
                                {errors.email && <span className="text-red-500 text-[10px] uppercase font-bold">{errors.email}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Church Name</label>
                                <input type="text" value={formData.church} onChange={(e) => setFormData({...formData, church: e.target.value})} className={`w-full p-4 bg-zinc-50 border ${errors.church ? 'border-red-500' : 'border-zinc-200'} focus:outline-none focus:border-[#E2B007] transition-colors`} placeholder="Your Local Church" />
                                {errors.church && <span className="text-red-500 text-[10px] uppercase font-bold">{errors.church}</span>}
                            </div>
                            <button onClick={handleNextToPolicy} className="mt-4 w-full bg-black text-white p-4 font-bold uppercase tracking-widest hover:bg-[#E2B007] hover:text-black transition-all">Next Step</button>
                        </motion.div>
                    )}

                    {regStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 text-center items-center">
                            <AlertCircle size={48} className="text-[#E2B007] mb-2" />
                            <h2 className="text-xl font-black uppercase tracking-tight">Data Privacy Policy</h2>
                            <div className="h-48 overflow-y-auto bg-zinc-50 p-6 border border-zinc-200 text-left text-sm text-zinc-600 leading-relaxed shadow-inner">
                                <p>By registering for Crossway Conference 2026, you agree that the information collected will be used solely for event coordination, security, and communication purposes.</p>
                                <br/><p>We value your privacy and will not share your data with third parties without your consent.</p>
                            </div>
                            <button onClick={handleConfirmPolicy} className="mt-4 w-full bg-black text-white p-4 font-bold uppercase tracking-widest hover:bg-[#E2B007] hover:text-black transition-all">I Understand & Confirm</button>
                            <button onClick={() => setRegStep(1)} className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black">Back</button>
                        </motion.div>
                    )}

                    {regStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                           
                            <div className="bg-zinc-100 p-6 rounded-lg border border-zinc-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <CreditCard size={18} className="text-[#007DFE]" />
                                    <h3 className="font-bold uppercase tracking-widest text-black text-xs">Payment Information</h3>
                                </div>
                                <p className="text-sm font-bold text-zinc-800 mb-1">PLEASE SEND VIA GCASH</p>
                                <div className="text-lg font-mono font-black text-black tracking-tight">0933-333-3333</div>
                                <div className="text-xs uppercase text-zinc-500 mb-4 font-bold tracking-widest">Name: AKO SI IKAW</div>
                                <div className="text-xs uppercase text-zinc-500 mb-4 font-bold tracking-widest">Please ensure that you securely download and save your GCash receipt. This file will be required for registration verification and future reference.</div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Upload GCash Receipt</label>
                                <div className={`relative w-full h-48 border-2 border-dashed ${errors.photo ? 'border-red-500 bg-red-50' : 'border-zinc-300 bg-zinc-50'} flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 transition-colors`} onClick={() => document.getElementById('file-upload')?.click()}>
                                    {photoFile ? (
                                        <div className="relative w-full h-full p-2">
                                            <img src={URL.createObjectURL(photoFile)} className="w-full h-full object-contain" alt="Preview" />
                                        </div>
                                    ) : (
                                        <><Upload className="text-zinc-400 mb-2" /><span className="text-xs font-bold uppercase text-zinc-400">Click to Upload</span></>
                                    )}
                                </div>
                                <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files && e.target.files[0]) setPhotoFile(e.target.files[0]); }} />
                                {errors.photo && <span className="text-red-500 text-[10px] uppercase font-bold">{errors.photo}</span>}
                            </div>

                            <div className="flex items-start gap-3 mt-2 p-4 bg-zinc-50 border border-zinc-100">
                                <input type="checkbox" id="statement-check" checked={formData.agreedToStatement} onChange={(e) => setFormData({...formData, agreedToStatement: e.target.checked})} className="mt-1 w-5 h-5 accent-[#E2B007]" />
                                <label htmlFor="statement-check" className="text-sm text-zinc-600 leading-tight cursor-pointer">I have uploaded my payment receipt and I agree to the statement above.</label>
                            </div>
                            {errors.statement && <span className="text-red-500 text-[10px] uppercase font-bold block">{errors.statement}</span>}

                            <div className="flex flex-col gap-2 mt-4">
                                {submitError && <span className="text-red-500 text-sm text-center font-bold bg-red-50 p-2">{submitError}</span>}
                                <button onClick={handleFinalSubmit} disabled={isSubmitting} className="w-full bg-black text-white p-4 font-bold uppercase tracking-widest hover:bg-[#E2B007] hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                    {isSubmitting ? <><Loader2 className="animate-spin" /> Registering...</> : "Register Me"}
                                </button>
                                <button onClick={() => setRegStep(2)} className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black mt-2">Back</button>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </>
                )}
            </div>
        </div>
    </div>
  );
}