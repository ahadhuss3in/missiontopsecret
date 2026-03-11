"use client";

import Link from "next/link";
import type { OutfitWithItems } from "@fashion/shared";

interface Props {
  outfit: OutfitWithItems;
}

export function OutfitCard({ outfit }: Props) {
  const stores = [...new Set(outfit.items.map((i) => i.product.store))];

  return (
    <Link href={`/dashboard/outfits/${outfit.id}`}>
      <div className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer">
        {/* Canvas preview placeholder */}
        <div className="bg-gray-50 h-48 flex items-center justify-center text-4xl">👗</div>
        <div className="p-4">
          <div className="font-semibold text-sm truncate">{outfit.name}</div>
          <div className="text-xs text-gray-400 mt-1">{outfit.items.length} items · {stores.join(", ")}</div>
          <div className="text-xs text-gray-300 mt-1">{new Date(outfit.updatedAt).toLocaleDateString()}</div>
        </div>
      </div>
    </Link>
  );
}
