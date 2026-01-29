import React from 'react';

interface TestimonialCardProps {
    text: string;
    initials: string;
    name: string;
    role: string;
}

export default function TestimonialCard({ text, initials, name, role }: TestimonialCardProps) {
    return (
        <div className="p-8 bg-gradient-to-t dark:from-neutral-900 dark:to-neutral-800 from-green-50 to-blue-50 dark:border-neutral-700 border rounded-xl relative group hover:border-indigo-500/50 transition-all">
            <span className="absolute -top-4 left-6 text-6xl text-indigo-500 opacity-20 font-serif">"</span>
            <p className="relative z-10 italic mb-8 leading-relaxed">{text}</p>
            <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs mr-4">
                    {initials}
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white">{name}</h4>
                    <p className="text-xs text-muted-foreground">{role}</p>
                </div>
            </div>
        </div>
    );
}