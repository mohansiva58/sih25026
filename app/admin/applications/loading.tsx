export default function AdminApplicationsLoading() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-80 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-28 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Applications Table Skeleton */}
        <div className="border rounded-lg">
          {/* Table Header */}
          <div className="border-b p-4">
            <div className="grid grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
          
          {/* Table Rows */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border-b p-4">
              <div className="grid grid-cols-6 gap-4 items-center">
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}