export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-700">Kerala Health System</p>
          <p className="text-sm text-gray-500">Loading your health dashboard...</p>
        </div>
      </div>
    </div>
  )
}