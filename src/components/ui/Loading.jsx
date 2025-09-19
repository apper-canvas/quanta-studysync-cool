import React from "react";

const Loading = () => {
  return (
    <div className="animate-pulse">
      {/* Dashboard Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-slate-300 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Loading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <div className="space-y-3">
              <div className="h-6 bg-slate-300 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              <div className="flex gap-2 mt-4">
                <div className="h-8 bg-slate-200 rounded w-20"></div>
                <div className="h-8 bg-slate-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;