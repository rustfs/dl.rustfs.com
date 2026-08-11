import { Button } from "@/components/ui/button";
import { ArrowUpRight, BookOpen } from "lucide-react";

const INSTALLATION_GUIDE_URL = "https://docs.rustfs.com/en/installation";

export default function InstallationGuideBanner() {
  return (
    <section className="col-span-12 bg-background/80 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 px-6 py-5">
        <div className="flex items-center gap-3">
          <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Need step-by-step installation instructions? Read the official
            installation guide.
          </p>
        </div>
        <Button asChild size="sm" variant="outline" className="gap-2">
          <a href={INSTALLATION_GUIDE_URL} target="_blank" rel="noreferrer">
            Installation guide
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  );
}
