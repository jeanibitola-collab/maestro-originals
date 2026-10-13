"use client";

import { useEffect } from "react";

export default function RecentTracker({ id }: { id: number }) {
  useEffect(() => {
    try {
      const saved: number[] = JSON.parse(localStorage.getItem("recent") || "[]");
      const next = [id, ...saved.filter((x) => x !== id)].slice(0, 10);
      localStorage.setItem("recent", JSON.stringify(next));
    } catch {}
  }, [id]);

  return null;
}