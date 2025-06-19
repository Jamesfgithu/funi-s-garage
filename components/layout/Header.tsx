'use client'; // This component now uses a hook, so it must be a client component

import React from 'react';
import { useHeader } from '@/app/context/HeaderContext'; // Import the hook

const Header = () => {
  const { title, subtitle } = useHeader(); // Get the dynamic title and subtitle

  return (
    <header className="bg-background flex h-16 items-center border-b px-4 md:px-6">
      <div>
        <h1 className="text-foreground text-xl font-bold tracking-tight md:text-2xl">
          {title} {/* Use the dynamic title */}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground text-sm">
            {subtitle} {/* Conditionally render the subtitle */}
          </p>
        )}
      </div>
    </header>
  );
};

export default Header;
