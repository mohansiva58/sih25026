export default function AppointmentsLoading() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-52 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-80 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="h-10 w-40 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                  <div className="h-3 w-32 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar/List View Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Skeleton */}
          <div className="lg:col-span-2 border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 animate-pulse rounded"></div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments Skeleton */}
          <div className="border rounded-lg p-6">
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-3 w-20 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                    <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}