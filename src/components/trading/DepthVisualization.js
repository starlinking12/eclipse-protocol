import React from 'react';

export const DepthVisualization = () => {
  return (
    <div className="h-24 flex items-end gap-[2px]">
      {[...Array(30)].map((_, i) => (
        <div 
          key={i}
          className="flex-1 bg-green-500/30 rounded-t-sm"
          style={{ height: `${20 + Math.random() * 80}%` }}
        />
      ))}
      {[...Array(30)].map((_, i) => (
        <div 
          key={`ask-${i}`}
          className="flex-1 bg-red-500/30 rounded-t-sm"
          style={{ height: `${20 + Math.random() * 80}%` }}
        />
      ))}
    </div>
  );
};