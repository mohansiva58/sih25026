export default function MedicationsLoading() {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
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
                  <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medications List Skeleton */}
          <div className="border rounded-lg p-6">
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
                  <div className="flex gap-4">
                    <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medication Details Skeleton */}
          <div className="border rounded-lg p-6">
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="space-y-4">
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 w-full bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}