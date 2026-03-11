import { Suspense } from "react";
import Link from "next/link";

// This is a Server Component shell.
// The OutfitGrid is a Client Component that fetches data.
export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">My Outfits</h1>
          <p className="text-gray-500 text-sm mt-1">All your saved outfit combinations</p>
        </div>
        <Link
          href="https://chrome.google.com/webstore"
          target="_blank"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          + Build Outfit (Extension)
        </Link>
      </div>

      <Suspense fallback={<OutfitGridSkeleton />}>
        <OutfitGridClient />
      </Suspense>
    </div>
  );
}

function OutfitGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-xl h-60 animate-pulse" />
      ))}
    </div>
  );
}

// Separate Client Component for data fetching
function OutfitGridClient() {
  // In production this would use useOutfits() hook with react-query
  // For MVP scaffold it renders an empty state placeholder
  return (
    <div className="text-center py-24 text-gray-400">
      <div className="text-5xl mb-4">👗</div>
      <p className="font-medium text-gray-600">No outfits yet</p>
      <p className="text-sm mt-2">Install the extension and start adding items from your favourite stores</p>
    </div>
  );
}
