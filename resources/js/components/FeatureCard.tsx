import { motion } from 'framer-motion';
import React from 'react';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
    accent: string;
}

export default function FeatureCard({ icon, title, desc, accent }: FeatureCardProps) {
    return (
        <motion.div
            variants={fadeIn}
            className={`p-8 bg-gradient-to-t dark:from-neutral-900 dark:to-neutral-800 from-green-50 to-blue-50 dark:border-neutral-700 border rounded-xl ${accent} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
        >
            <div className="text-indigo-600 mb-4 bg-indigo-50 w-fit p-3 rounded-xl">
                {React.isValidElement(icon) 
                    ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 28 })
                    : icon
                }
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
        </motion.div>
    );
}