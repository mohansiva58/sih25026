export default function DocumentsLoading() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-56 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-80 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="h-10 w-36 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Filter/Search Bar Skeleton */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Document Categories Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                <div>
                  <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-1"></div>
                  <div className="h-3 w-20 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-4 w-full bg-gray-100 animate-pulse rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Documents List Skeleton */}
        <div className="border rounded-lg p-6">
          <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-200 animate-pulse rounded"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}