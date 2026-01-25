import GithubStarButton from "@/components/github-star-button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

const highlights = [
  {
    title: "Verified artifacts",
    description: "Release assets synced from official repositories.",
  },
  {
    title: "Fast global delivery",
    description: "Edge-cached downloads for stable throughput.",
  },
  {
    title: "Project-ready",
    description: "Server, Console, and CLI packages in one place.",
  },
];

export default function HomeHero() {
  return (
    <section className="col-span-12 grid grid-cols-12 gap-px bg-border/60 lg:col-span-12">
      <div className="col-span-12 space-y-6 bg-background/80 p-8 backdrop-blur lg:col-span-7">
        <Badge
          variant="outline"
          className="gap-2 rounded-full border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5" />
          RustFS Download Center
        </Badge>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Downloads for RustFS
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Curated release artifacts for the RustFS ecosystem, delivered through
            GitHub and our global CDN.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <GithubStarButton />
        </div>
      </div>

      <div className="col-span-12 bg-background/80 backdrop-blur lg:col-span-5">
        <div className="grid divide-y divide-border/60">
          {highlights.map((item) => (
            <div key={item.title} className="space-y-2 p-6">
              <p className="text-sm font-semibold text-foreground">
                {item.title}
              </p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
