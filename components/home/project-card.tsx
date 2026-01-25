import { Badge } from "@/components/ui/badge";
import { Project } from "@/projects.config";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/${project.repo}`}
      className="group col-span-12 flex h-full flex-col bg-background/80 p-6 backdrop-blur transition hover:bg-background/90 md:col-span-6 lg:col-span-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">
          {project.title || project.repo}
        </h3>
        <Badge
          variant="outline"
          className="rounded-full border-border/70 bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Releases
        </Badge>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.links.map((link) => {
          const Icon = link.icon;
          return (
            <Badge
              key={`${project.repo}-${link.label}`}
              variant="outline"
              className="gap-1 rounded-full border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
              {link.label}
            </Badge>
          );
        })}
      </div>
      <div className="mt-auto flex items-center gap-2 pt-6 text-sm font-medium text-foreground">
        View releases
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
