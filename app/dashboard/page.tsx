"use client";

import { useEffect } from 'react';
import { useHeader } from '@/app/context/HeaderContext';
import StatCard from '@/app/components/dashboard/StatCard';

export default function DashboardPage() {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader('Mission Control', 'Your complete operational overview.');
  }, [setHeader]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Links" value={1234} />
      <StatCard title="Ready Now" value={5} highlight />
      <StatCard title="Ready Soon" value={12} />
      <StatCard title="Waiting" value={3} />
    </div>
  );
}
