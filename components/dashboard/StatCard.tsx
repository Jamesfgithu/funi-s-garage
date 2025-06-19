import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  highlight = false,
}) => {
  return (
    <div
      className={`card ${highlight ? 'card-pulsing-glow' : ''} flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow-md`}
    >
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;
