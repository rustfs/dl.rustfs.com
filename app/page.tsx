import HomeHero from "@/components/home/hero";
import ProjectsSection from "@/components/home/projects-section";
import PageBackground from "@/components/page-background";
import { projects } from "@/projects.config";

export default function HomePage() {
  return (
    <PageBackground>
      <div className="relative overflow-hidden">
        <div className="absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-neutral-200 via-white to-transparent blur-2xl opacity-80" />

        <div className="mx-auto flex max-w-6xl flex-col px-6 pb-20 pt-12 lg:pt-20">
          <div className="grid grid-cols-12 gap-px border border-border/60 bg-border/60">
            <HomeHero />
            <ProjectsSection projects={projects} />
          </div>
        </div>
      </div>
    </PageBackground>
  );
}
