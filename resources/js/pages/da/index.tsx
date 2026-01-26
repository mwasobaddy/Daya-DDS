import { Link } from '@inertiajs/react';
import { 
  TrendingUp, 
  Percent, 
  Wallet, 
  PlayCircle, 
  Users, 
  BadgeCheck, 
  ArrowRight 
} from 'lucide-react';
import React from 'react';

interface Props {
  title: string;
  description: string;
}

export default function Index({ title, description }: Props) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-neutral-900 text-slate-900 selection:bg-indigo-100">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-blue-50/50 blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto py-20 px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="text-center mb-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 lg:leading-[1.1]">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </section>

        {/* Video Section */}
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
                  Discover how the Daya ecosystem empowers you to earn through distribution and network growth.
                </p>
              </div>
              <div className="w-full md:w-2/3 aspect-video rounded-xl overflow-hidden bg-slate-800 ring-1 ring-white/20">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/KBSQg6WPxtU"
                  title="DA Explainer Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section>
          <div className='w-full flex justify-center'>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Now Open for Pilots</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-18">
            {[
              {
                title: "Commission",
                desc: "Earn 5% of all earnings from every DCD you recruit into the network.",
                icon: Percent,
                color: "text-indigo-600",
                bg: "bg-indigo-50"
              },
              {
                title: "Venture Shares",
                desc: "Build long-term ownership as you scale your ambassador footprint.",
                icon: TrendingUp,
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              },
              {
                title: "Residual Income",
                desc: "Enjoy ongoing rewards from your network's automated scan activity.",
                icon: Wallet,
                color: "text-blue-600",
                bg: "bg-blue-50"
              }
            ].map((benefit, i) => (
              <article 
                key={i}
                className="group relative bg-linear-to-t dark:from-neutral-900 dark:to-neutral-800 from-green-50 to-blue-50 dark:border-neutral-700 border rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 ${benefit.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{benefit.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{benefit.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative bg-linear-to-t dark:from-neutral-900 dark:to-neutral-800 from-green-50 to-blue-50 dark:border-neutral-700 border rounded-3xl p-8 mb-18 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <BadgeCheck className="w-32 h-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {[
              { label: "Active Ambassadors", value: "500+", icon: Users },
              { label: "Commissions Paid", value: "$50K+", icon: Wallet },
              { label: "Success Rate", value: "98%", icon: BadgeCheck }
            ].map((stat, i) => (
              <div key={i} className="py-6 md:py-0 md:px-8 text-center md:first:pl-0 md:last:pr-0">
                <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center relative">
          <Link
            href="/da/register"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-10 py-5 text-lg font-bold text-white shadow-xl hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 transition-all duration-200"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-slate-400 text-sm font-medium">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-500" /> No credit card required
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-500" /> Join in minutes
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}