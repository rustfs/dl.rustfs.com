import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/projects.config";
import { DownloadCloud } from "lucide-react";
import Link from "next/link";

export default function ProjectHero({
  project,
  releasesCount,
}: {
  project: Project;
  releasesCount: number;
}) {
  return (
    <section className="col-span-12 bg-background/80 p-8 backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {project.title || project.repo}
          </h1>
          {project.description ? (
            <p className="text-base text-muted-foreground">
              {project.description}
            </p>
          ) : null}
        </div>
        <Badge
          variant="outline"
          className="gap-2 rounded-full border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          <DownloadCloud className="h-3.5 w-3.5" />
          {releasesCount} releases
        </Badge>
      </div>
      <div className="pt-4">
        {project.links.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {project.links.map((link) => {
              const Icon = link.icon;
              return (
                <Button
                  key={link.url}
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    {link.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No links added.</p>
        )}
      </div>
    </section>
  );
}
