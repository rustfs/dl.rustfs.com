import ReleaseCard from "@/components/release";
import { Button } from "@/components/ui/button";
import { projects } from "@/projects.config";
import { fetchReleases } from "@/scripts/generate-releases";
import { Release } from "@/types";
import { DownloadCloud } from "lucide-react";
import fs from "fs";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "path";

// 生成静态路径参数
export async function generateStaticParams() {
  await fetchReleases();
  return projects.map((project) => ({
    repo: project.repo,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ repo: string }>;
}) {
  const { repo } = await params;

  // 查找项目信息
  const project = projects.find((p) => p.repo === repo);

  if (!project) {
    notFound();
  }

  // 读取存储的 releases 数据
  let releases: Release[] = [];
  try {
    releases = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "data", repo, "releases.json"),
        "utf8"
      )
    );
  } catch (error) {
    console.error("Failed to load releases data:", error);
  }

  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100">
      <div className="mx-auto flex max-w-5xl flex-col px-6 pb-16 pt-10">
        <div className="grid grid-cols-12 border border-border/60 bg-white/70 backdrop-blur">
          <section className="col-span-12 grid grid-cols-12">
            <div className="col-span-12 space-y-4 border-b border-border/60 p-8 lg:col-span-8 lg:border-b-0 lg:border-r">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {project.title || repo}
              </h1>
              {project.description ? (
                <p className="text-base text-muted-foreground">
                  {project.description}
                </p>
              ) : null}
            </div>

            <div className="col-span-12 flex flex-col gap-4 p-6 lg:col-span-4">
              <div className="flex items-center gap-2 rounded-full border border-neutral-200/70 bg-white/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <DownloadCloud className="h-3.5 w-3.5" />
                {releases.length} releases
              </div>
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

          {releases.length > 0 ? (
            <section className="col-span-12 border-t border-border/60">
              <div className="divide-y divide-border/60">
                {releases.map((release, index) => (
                  <ReleaseCard
                    key={release.id}
                    project={project}
                    release={release}
                    isLatest={index === 0}
                  />
                ))}
              </div>
            </section>
          ) : (
            <div className="col-span-12 border-t border-border/60 p-8 text-sm text-muted-foreground">
              No releases found for this project.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
