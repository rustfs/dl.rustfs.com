import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReleaseAssetsTabs from "@/components/release-assets-tabs";
import { Project } from "@/projects.config";
import { type Release } from "@/types";
import { ChevronDown, ExternalLink } from "lucide-react";

export default function ReleaseCard(props: {
  project: Project;
  release: Release;
  isLatest?: boolean;
}) {
  const { release, project } = props;

  return (
    <details open={props.isLatest} className="group">
      <summary className="list-none">
        <Card className="gap-0 border-0 bg-transparent py-0">
          <CardHeader className="gap-4 border-b-0 px-6 py-6 group-open:border-b group-open:border-border/60">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="text-xl font-semibold">
                  {release.name || release.tag_name}
                </CardTitle>
                {props.isLatest ? (
                  <Badge
                    variant="outline"
                    className="rounded-full border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-200"
                  >
                    Latest
                  </Badge>
                ) : null}
                {release.prerelease ? (
                  <Badge
                    variant="outline"
                    className="rounded-full border-amber-200/80 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-200"
                  >
                    Pre-release
                  </Badge>
                ) : null}
              </div>
              <div className="flex items-center gap-3 text-right text-xs font-medium text-muted-foreground">
                <span>
                  Released on{" "}
                  {release.published_at
                    ? new Date(release.published_at).toLocaleDateString()
                    : "Unknown"}
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </summary>

      <Card className="gap-0 border-0 bg-transparent py-0">
        <CardContent className="bg-muted/40 px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Changelog</p>
              <p className="text-xs text-muted-foreground">
                Full release notes are maintained on GitHub.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="gap-2">
              <a href={release.html_url} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </CardContent>

        {release.assets.length > 0 ? (
          <ReleaseAssetsTabs
            cdnReleasePrefix={project.cdnReleasePrefix}
            cdnReleaseIncludeTag={project.cdnReleaseIncludeTag}
            release={release}
          />
        ) : null}
      </Card>
    </details>
  );
}
