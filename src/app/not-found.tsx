import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--background)]">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold tracking-tight-display text-[var(--primary)] mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold mb-3">
          Không tìm thấy trang
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-8 mx-auto">
          Trang bạn đang tìm kiếm có thể đã bị di chuyển, xóa hoặc không tồn tại.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-primary"
          >
            <ArrowLeft size={16} />
            Về trang chủ
          </Link>
          <Link
            href="/items"
            className="btn-outline"
          >
            <Search size={16} />
            Khám phá món đồ
          </Link>
        </div>
      </div>
    </main>
  );
}
