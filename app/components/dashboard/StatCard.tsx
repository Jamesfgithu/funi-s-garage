import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, highlight = false }) => {
  return (
    <div className={`card ${highlight ? 'card-pulsing-glow' : ''} p-4 rounded-lg bg-white shadow-md flex flex-col items-center justify-center`}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;
