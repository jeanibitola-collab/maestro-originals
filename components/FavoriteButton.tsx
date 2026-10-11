"use client";

import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

export default function FavoriteButton({ id }: { id: number }) {
  const [liked, setLiked] = useState(false);

  // Check if this shoe was already saved
  useEffect(() => {
    try {
      const saved: number[] = JSON.parse(localStorage.getItem("favorites") || "[]");
      setLiked(saved.includes(id));
    } catch {}
  }, [id]);

  function toggle(e: React.MouseEvent) {
    // Stop the click from opening the product page
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved: number[] = JSON.parse(localStorage.getItem("favorites") || "[]");
      const next = saved.includes(id)
        ? saved.filter((x) => x !== id)
        : [...saved, id];
      localStorage.setItem("favorites", JSON.stringify(next));
      setLiked(!liked);
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={liked ? "Remove from favorites" : "Add to favorites"}
      className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm text-black shadow transition-all hover:scale-105 ${
        liked ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
      }`}
    >
      {liked ? <FaHeart className="text-orange-600" /> : <FaRegHeart />}
    </button>
  );
}