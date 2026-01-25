import { Button } from "@/components/ui/button";
import { projects } from "@/projects.config";
import { ArrowRight, DownloadCloud, Github, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-neutral-50 to-neutral-100">
      <div className="relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[28rem] w-[38rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-neutral-200 via-white to-neutral-200 blur-3xl opacity-80" />
        <div className="absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-neutral-200 via-white to-transparent blur-2xl opacity-80" />

        <div className="mx-auto flex max-w-6xl flex-col px-6 pb-20 pt-12 lg:pt-20">
          <div className="grid grid-cols-12 border border-border/60 bg-white/70 backdrop-blur">
            <section className="col-span-12 grid grid-cols-12">
              <div className="col-span-12 space-y-6 border-b border-border/60 p-8 lg:col-span-7 lg:border-b-0 lg:border-r">
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  RustFS Download Center
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    Downloads for RustFS
                  </h1>
                  <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                    Curated release artifacts for the RustFS ecosystem, delivered through GitHub and our global CDN.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link
                      href="https://github.com/rustfs"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Github className="h-4 w-4" />
                      RustFS on GitHub
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="col-span-12 grid divide-y divide-border/60 lg:col-span-5">
                {[
                  {
                    title: "Verified artifacts",
                    description:
                      "Release assets synced from official repositories.",
                  },
                  {
                    title: "Fast global delivery",
                    description:
                      "Edge-cached downloads for stable throughput.",
                  },
                  {
                    title: "Project-ready",
                    description:
                      "Server, Console, and CLI packages in one place.",
                  },
                ].map((item) => (
                  <div key={item.title} className="space-y-2 p-6">
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section id="projects" className="col-span-12 border-t border-border/60">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 px-8 pt-8">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Projects
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    Choose a RustFS release stream
                  </h2>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-neutral-200/70 bg-white/80 px-4 py-2 text-xs font-medium text-muted-foreground">
                  <DownloadCloud className="h-4 w-4" />
                  {projects.length} active projects
                </div>
              </div>

              <div className="grid grid-cols-12 gap-px border border-border/60 bg-border/60">
                {projects.map((project) => (
                  <Link
                    key={`${project.repo}-${project.title}`}
                    href={`/${project.repo}`}
                    className="group col-span-12 flex h-full flex-col bg-white/70 p-6 transition hover:bg-white/80 md:col-span-6 lg:col-span-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-foreground">
                        {project.title || project.repo}
                      </h3>
                      <span className="rounded-full border border-neutral-200/70 bg-neutral-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Releases
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.links.map((link) => {
                        const Icon = link.icon;
                        return (
                          <span
                            key={`${project.repo}-${link.label}`}
                            className="inline-flex items-center gap-1 rounded-full border border-neutral-200/70 bg-white/80 px-3 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                            {link.label}
                          </span>
                        );
                      })}
                    </div>
                    <div className="mt-auto flex items-center gap-2 pt-6 text-sm font-medium text-foreground">
                      View releases
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>

              {projects.length === 0 && (
                <div className="border border-dashed border-border/60 bg-white/70 p-6 text-sm text-muted-foreground">
                  No projects available. Add a repository to projects.config.ts
                  to populate the catalog.
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
