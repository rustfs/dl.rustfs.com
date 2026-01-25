"use client";

import * as React from "react";
import Link from "next/link";
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const REPO = "rustfs/rustfs";
const CACHE_MS = 5 * 60 * 1000;

let cachedStars: number | null = null;
let cachedAt = 0;

export default function GithubStarButton({ className }: { className?: string }) {
  const [stars, setStars] = React.useState<number | null>(() => {
    if (cachedStars !== null && Date.now() - cachedAt < CACHE_MS) {
      return cachedStars;
    }
    return null;
  });

  React.useEffect(() => {
    if (cachedStars !== null && Date.now() - cachedAt < CACHE_MS) {
      return;
    }

    let cancelled = false;

    fetch(`https://api.github.com/repos/${REPO}`, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.stargazers_count !== undefined) {
          cachedStars = data.stargazers_count;
          cachedAt = Date.now();
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {
        // silent
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Button asChild variant="outline" size="lg" className={cn("gap-2", className)}>
      <Link href={`https://github.com/${REPO}`} target="_blank" rel="noreferrer">
        <Github className="h-4 w-4" />
        {stars === null ? (
          <span className="text-sm text-muted-foreground">Star on GitHub</span>
        ) : (
          <span className="text-sm text-muted-foreground">
            {stars.toLocaleString()} stars
          </span>
        )}
      </Link>
    </Button>
  );
}
