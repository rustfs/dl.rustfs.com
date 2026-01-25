import { Badge } from "@/components/ui/badge";
import { Project } from "@/projects.config";
import { DownloadCloud } from "lucide-react";
import ProjectCard from "./project-card";

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <>
      <section
        id="projects"
        className="col-span-12 bg-background/80 px-8 pt-8 backdrop-blur"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Projects
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Choose a RustFS release stream
            </h2>
          </div>
          <Badge
            variant="outline"
            className="gap-2 rounded-full border-border/70 bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground"
          >
            <DownloadCloud className="h-4 w-4" />
            {projects.length} active projects
          </Badge>
        </div>
      </section>

      {projects.map((project) => (
        <ProjectCard key={`${project.repo}-${project.title}`} project={project} />
      ))}

      {projects.length === 0 && (
        <div className="col-span-12 bg-background/80 p-6 text-sm text-muted-foreground backdrop-blur">
          No projects available. Add a repository to projects.config.ts to
          populate the catalog.
        </div>
      )}
    </>
  );
}
