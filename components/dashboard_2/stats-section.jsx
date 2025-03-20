import React from 'react';
import StatsCard from '@/components/cards/stats-card';

const StatsSection = () => {
  // Data for the financial dashboard stats
  const statsData = [
    {
      title: 'Net Worth',
      value: 500000,
      type: 'money',
      change: 8
    },
    {
      title: 'Total Assets',
      value: 200000,
      type: 'money',
      change: 12
    },
    {
      title: 'Total Liabilities',
      value: 300000,
      type: 'money',
      change: -5
    },
    {
      title: 'Nominees',
      value: 4,
      type: 'count',
      change: 1
    },
    {
      title: 'Policies',
      value: 4,
      type: 'count',
      change: 2
    }
  ];

  return (
    <section className="py-6">
      <div className="">
        {/* <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold ">Financial Overview</h2>
          <div className="text-sm text-gray-500">Last updated: March 13, 2025</div>
        </div> */}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              type={stat.type}
              change={stat.change}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;