export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative overflow-hidden rounded-full bg-[var(--dn-surface-muted)] ${className || ''}`}
      {...props}
    />
  );
}

export function ItemCardSkeleton() {
  return (
    <div className="dn-card p-0 overflow-hidden">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}

export function ItemsPageSkeleton() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-10 w-[380px]" />
          </div>
          <div className="dn-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <ItemCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export function DetailPageSkeleton() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Skeleton className="aspect-square" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-3 pt-4">
                <Skeleton className="h-12 w-36" />
                <Skeleton className="h-12 w-36" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
