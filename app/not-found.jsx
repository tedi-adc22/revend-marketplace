import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-black text-gray-900">404</h1>
      <p className="text-gray-500 mt-2 mb-6">
        This page doesn't exist or may have been moved.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
