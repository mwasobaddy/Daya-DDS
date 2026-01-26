
import { Link } from '@inertiajs/react';
import React from 'react';

export default function Index({ title, description }: { title: string; description: string }) {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="mb-6 text-gray-700">{description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-xl font-bold text-blue-600 mb-2">5% Commission</span>
          <span className="text-gray-600 text-center">Earn 5% of all earnings from every DCD you recruit</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-xl font-bold text-blue-600 mb-2">Venture Shares</span>
          <span className="text-gray-600 text-center">Build ownership in the platform as you grow the network</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-xl font-bold text-blue-600 mb-2">Residual Income</span>
          <span className="text-gray-600 text-center">Ongoing commissions from your recruited DCDs' scans</span>
        </div>
      </div>

      <div className="mb-8 text-center text-lg font-medium text-blue-700">
        Watch this 2-minute explainer to learn how you can earn 5% commissions + venture shares
      </div>

      <div className="mb-6 aspect-video">
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/KBSQg6WPxtU"
          title="DA Explainer Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-700 mb-1">500+</span>
          <span className="text-gray-600">Active Ambassadors</span>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-700 mb-1">$50K+</span>
          <span className="text-gray-600">Commissions Paid</span>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-700 mb-1">98%</span>
          <span className="text-gray-600">Success Rate</span>
        </div>
      </div>

      <Link href="/da/register" className="btn btn-primary">Get Started</Link>
    </div>
  );
}
