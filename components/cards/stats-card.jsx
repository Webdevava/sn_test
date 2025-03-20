import React from 'react';
import { 
  Wallet, 
  Bank, 
  FilePlus, 
  Users, 
  ChartPie,
  Coins,
  ArrowUp,
  ArrowDown,
  CurrencyInr
} from '@phosphor-icons/react';

// Helper function to format Indian Rupee values
const formatIndianRupees = (amount) => {
  const [wholePart, decimalPart] = amount.toString().split('.');
  const formattedWholePart = wholePart.replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',');
  return decimalPart ? `${formattedWholePart}.${decimalPart}` : formattedWholePart;
};

// Function to determine which icon to use based on title
const getIconByTitle = (title) => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('net worth')) return Wallet;
  if (titleLower.includes('asset')) return ChartPie;
  if (titleLower.includes('liabilities')) return Bank;
  if (titleLower.includes('nominees')) return Users;
  if (titleLower.includes('financial')) return Coins;
  if (titleLower.includes('policies')) return FilePlus;
  
  return Wallet;
};

// Get theme colors based on title
const getThemeColors = (title) => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('net worth')) return { from: 'from-violet-600', to: 'to-indigo-600', hover: 'text-violet-200' };
  if (titleLower.includes('asset')) return { from: 'from-emerald-600', to: 'to-green-600', hover: 'text-emerald-200' };
  if (titleLower.includes('liabilities')) return { from: 'from-rose-600', to: 'to-red-600', hover: 'text-rose-200' };
  if (titleLower.includes('nominees')) return { from: 'from-amber-600', to: 'to-yellow-600', hover: 'text-amber-200' };
  if (titleLower.includes('financial')) return { from: 'from-blue-600', to: 'to-sky-600', hover: 'text-blue-200' };
  if (titleLower.includes('policies')) return { from: 'from-cyan-600', to: 'to-blue-600', hover: 'text-cyan-200' };
  
  return { from: 'from-slate-600', to: 'to-gray-600', hover: 'text-slate-200' };
};

const StatsCard = ({ title, value, type = 'money', change = 0 }) => {
  const isPositive = change >= 0;
  const Icon = getIconByTitle(title);
  const colors = getThemeColors(title);
  
  return (
    <div className="w-full h-[120px] p-4 rounded-lg border relative overflow-hidden group bg-card">
      {/* Background gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-r ${colors.from} ${colors.to} translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300`} />
      
      {/* Large background icon */}
      <Icon 
        weight="duotone" 
        size={96} 
        className="absolute z-10 -top-6 -right-6  text-muted-foreground/15 group-hover:rotate-12 transition-all duration-300" 
      />
      
      {/* Card content */}
      <div className="relative z-20 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm group-hover:text-white relative z-10 duration-300">
            {title}
          </h3>
          <Icon 
            weight="duotone" 
            size={20} 
            className={`text-${colors.from.split('-')[1]}-600 group-hover:text-white transition-colors duration-300`} 
          />
        </div>
        
        <div>
          <div className="flex items-baseline gap-1 mt-2">
            {type === 'money' && 
              <span className="text-lg font-semibold  group-hover:text-white/80 duration-300"><CurrencyInr weight='duotone'/></span>
            }
            <span className="text-2xl font-bold  group-hover:text-white duration-300 ">
              {type === 'money' ? formatIndianRupees(value) : value}
            </span>
          </div>
          
          {change !== 0 && (
            <div className={`flex items-center text-xs font-medium mt-1 ${isPositive ? 'text-emerald-600' : 'text-rose-600'} group-hover:${colors.hover} duration-300`}>
              {isPositive ? 
                <ArrowUp size={12} weight="bold" className="mr-1" /> : 
                <ArrowDown size={12} weight="bold" className="mr-1" />
              }
              <span>{Math.abs(change)}% vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;