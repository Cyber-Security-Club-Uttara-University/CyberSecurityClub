import Link from "next/link";

export default function NewsNotFound() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4 text-black">News Not Found</h1>
      <p className="text-[#525252] mb-8">
        The news article you are looking for does not exist or has been removed.
      </p>
      <Link
        href="/news"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0000ff] text-white text-sm font-medium hover:bg-[#0000cc] transition-colors"
      >
        &larr; Back to News
      </Link>
    </div>
  );
}
