import React from 'react';

interface PageHeroProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">{description}</p>
      </div>

      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
};
