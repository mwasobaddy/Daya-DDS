import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    Users,
    CheckSquare,
    TrendingUp,
    Rocket,
    Play,
    Menu,
    X,
    ArrowRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';
import { preserveRef } from '../utils/url';

// URL utility mock (Preserving logic as requested)
// const preserveRef = (path: string) => path; 

// Animation Variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function DDSHome() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Dynamic Greeting Logic
    const getRefLink = (basePath: string): string => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const ref = urlParams.get('ref');
            if (ref) return `${basePath}?started=true&ref=${encodeURIComponent(ref)}`;
            if (basePath === '/welcome') return `${basePath}?started=true`;
        }
        return basePath;
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-neutral-900 text-slate-900 selection:bg-indigo-100 font-sans">
            {/* Header */}
            <header 
                className={`fixed top-0 z-50 w-full transition-all duration-300 ${
                    isScrolled 
                    ? 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-slate-200 dark:border-neutral-700 py-3' 
                    : 'bg-transparent py-5'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center">
                        <img
                            src="https://daya.africa/wp-content/uploads/2024/10/cropped-Daya-Main-Logo.png"
                            alt="Daya Logo"
                            className="h-10 w-auto"
                        />
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#who-its-for" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Who it's for</a>
                        <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Testimonials</a>
                        <a 
                            href={getRefLink('/welcome')} 
                            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
                    >
                        <nav className="flex flex-col space-y-6 text-center">
                            <a href="#who-its-for" onClick={() => setMenuOpen(false)} className="text-xl font-semibold">Who it's for</a>
                            <a href="#testimonials" onClick={() => setMenuOpen(false)} className="text-xl font-semibold">Testimonials</a>
                            <a href={getRefLink('/welcome')} className="bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-xl">
                                Get Started
                            </a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-indigo-50 opacity-50 blur-3xl" />
                <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-blue-50 opacity-50 blur-3xl" />
                
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1] text-slate-900 dark:text-white">
                            Find your first users, <span className="text-indigo-600 underline decoration-indigo-200">fans</span>, and responses
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                            Community-led distribution across Kenya — from hyperlocal to national. Connect with real people where they are.
                        </p>
                        <div className="flex justify-center">
                            <a href={getRefLink('/welcome')} className="group inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-105 transition-all">
                                Get Started <Rocket className="ml-3 group-hover:animate-bounce h-5 w-5" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Video Section */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative max-w-4xl mx-auto aspect-video bg-gradient-to-t dark:from-neutral-900 dark:to-neutral-800 from-green-50 to-blue-50 dark:border-neutral-700 border rounded-xl overflow-hidden shadow-2xl ring-1 ring-slate-200 group"
                    >
                        <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center text-white z-0 group-hover:scale-105 transition-transform duration-700">
                            <Play className="h-16 w-16 text-indigo-400 mb-4 animate-pulse" />
                            <p className="text-sm font-medium uppercase tracking-widest">Loading Presentation</p>
                        </div>
                        <iframe
                            className="relative z-10 w-full h-full"
                            src="https://www.youtube.com/embed/V_oDGl1hm5o?rel=0"
                            title="Daya Distribution"
                            allowFullScreen
                        />
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-indigo-500 dark:bg-transparent dark:bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:20px_20px]">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
                    >
                        {[
                            { val: "10,000+", label: "Activations" },
                            { val: "85%", label: "Verified Rate" },
                            { val: "50+", label: "Towns Covered" },
                            { val: "200+", label: "Distributors" }
                        ].map((stat, i) => (
                            <motion.div key={i} variants={fadeIn} className="p-4 bg-gradient-to-t dark:from-neutral-900 dark:to-neutral-800 from-green-50 to-blue-50 dark:border-neutral-700 border rounded-xl">
                                <div className="text-3xl md:text-4xl font-black text-indigo-600 mb-1">{stat.val}</div>
                                <div className="text-sm font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Traction Section */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 dark:text-white">Built for early traction</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">Daya Distribution helps startups, creators, and organisations find real adoption — not just impressions.</p>
                </motion.div>

                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <FeatureCard 
                        icon={<BarChart3 />} 
                        title="First app downloads" 
                        desc="Get genuine users for your app from offline communities across Kenya." 
                        accent="border-indigo-400"
                    />
                    <FeatureCard 
                        icon={<Users />} 
                        title="First fans & listeners" 
                        desc="Build an authentic audience for your music, podcast, or content." 
                        accent="border-emerald-400"
                    />
                    <FeatureCard 
                        icon={<CheckSquare />} 
                        title="Community surveys" 
                        desc="Collect reliable data and insights directly from target communities." 
                        accent="border-blue-400"
                    />
                    <FeatureCard 
                        icon={<TrendingUp />} 
                        title="Demand validation" 
                        desc="Test your product or service with real people before scaling." 
                        accent="border-amber-400"
                    />
                </motion.div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 bg-neutral-900 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Kenyan Innovators</h2>
                        <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full" />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <TestimonialCard 
                            name="James Kariuki" 
                            role="Co-founder, AgriTech" 
                            initials="JK"
                            text="Daya helped us validate our farming app with real smallholder farmers. We got 500+ genuine downloads in two weeks."
                        />
                        <TestimonialCard 
                            name="Naomi Mwangi" 
                            role="Independent Artist" 
                            initials="NM"
                            text="As an independent musician, building a fanbase was challenging. Daya helped me reach listeners in 15 towns."
                        />
                        <TestimonialCard 
                            name="Research Div" 
                            role="Public Health Org" 
                            initials="PH"
                            text="We needed reliable survey data from rural communities. Daya provided verified responses from 8 counties."
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 relative overflow-hidden bg-indigo-500 dark:bg-transparent dark:bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:20px_20px] text-center px-6">
                <div className="absolute inset-0 opacity-10" />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative z-10 max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Ready to find your first users?</h2>
                    <p className="text-indigo-100 text-lg mb-10">Join hundreds of innovators who have found authentic adoption through community-led distribution.</p>
                    <a href={preserveRef('/campaign/submit')} className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg shadow-2xl hover:bg-slate-50 transition-all active:scale-95">
                        Start Your Campaign <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-neutral-950 text-slate-400 py-16 px-6 border-t border-neutral-900">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <img
                            src="https://daya.africa/wp-content/uploads/2024/10/cropped-Daya-Main-Logo.png"
                            alt="Daya Logo"
                            className="h-8 mb-6 brightness-0 invert"
                        />
                        <p className="max-w-sm">Community-led distribution across Kenya — from hyperlocal to national.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Product</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#who-its-for" className="hover:text-white transition-colors">Who it's for</a></li>
                            <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Campaigns</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 text-center text-xs">
                    <p>© 2026 Daya Distribution. Built for innovators in Kenya.</p>
                </div>
            </footer>
        </div>
    );
}

// Reusable Sub-components
// Components moved to separate files: FeatureCard.tsx and TestimonialCard.tsx