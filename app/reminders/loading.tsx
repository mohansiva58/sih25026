"use client"

export default function RemindersLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded-md w-36 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-md w-56 animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
      
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}