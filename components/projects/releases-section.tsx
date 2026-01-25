import ReleaseCard from "@/components/release";
import { Project } from "@/projects.config";
import { Release } from "@/types";

export default function ReleasesSection({
  project,
  releases,
}: {
  project: Project;
  releases: Release[];
}) {
  if (releases.length === 0) {
    return (
      <div className="col-span-12 bg-background/80 p-8 text-sm text-muted-foreground backdrop-blur">
        No releases found for this project.
      </div>
    );
  }

  return (
    <section className="col-span-12 bg-border/60">
      <div className="grid grid-cols-12 gap-px">
        {releases.map((release, index) => (
          <div
            key={release.id}
            className="col-span-12 bg-background/80 backdrop-blur"
          >
            <ReleaseCard
              project={project}
              release={release}
              isLatest={index === 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
