import { Link } from '@inertiajs/react';
import { PlayCircle } from 'lucide-react';
import React from 'react';

interface Props {
  title: string;
  description: string;
}

export default function Index({ title, description }: Props) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-neutral-900 text-slate-900 selection:bg-indigo-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-blue-50/50 blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto py-20 px-6 lg:px-8">
        <section className="text-center mb-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 lg:leading-[1.1]">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </section>

        <section className="mb-18">
          <div className="bg-linear-to-t dark:from-neutral-900 dark:to-neutral-800 from-green-50 to-blue-50 dark:border-neutral-700 border rounded-4xl p-4 md:p-8 overflow-hidden shadow-2xl ring-1 ring-white/10">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 p-6">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400 mb-4">
                  <PlayCircle className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-widest">Explainer</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
                <p className="text-muted-foreground text-lg mb-0 leading-relaxed">
                  Create campaigns and target physical locations through our DCD network.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link href="/client/register" className="inline-block rounded-md bg-indigo-600 px-6 py-3 text-white font-semibold">Create a Campaign</Link>
        </div>
      </div>
    </div>
  );
}
