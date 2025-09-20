"use client"

export default function ProfileLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded-md w-32 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-md w-48 animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}