import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cdnUrl, formatBytes } from "@/lib/utils";
import { Project } from "@/projects.config";
import { type Release, ReleaseAsset } from "@/types";
import { Download, ExternalLink, PaperclipIcon } from "lucide-react";
import Markdown from "./markdown";

export default function ReleaseCard(props: {
  project: Project;
  release: Release;
  isLatest?: boolean;
}) {
  const { release, project } = props;

  return (
    <Card className="gap-0 border-0 bg-transparent py-0">
      <CardHeader className="gap-4 border-b border-border/60 px-6 py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-xl font-semibold">
              {release.name || release.tag_name}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {props.isLatest ? (
                <span className="rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Latest
                </span>
              ) : null}
              {release.prerelease ? (
                <span className="rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Pre-release
                </span>
              ) : null}
            </div>
          </div>
          <div className="text-right text-xs font-medium text-muted-foreground">
            Released on{" "}
            {release.published_at
              ? new Date(release.published_at).toLocaleDateString()
              : "Unknown"}
          </div>
        </div>
      </CardHeader>

      {release.body ? (
        <CardContent className="bg-muted/40 px-6 py-6">
          <Markdown>{release.body}</Markdown>
        </CardContent>
      ) : null}

      {release.assets.length > 0 ? (
        <CardFooter className="flex flex-col items-stretch gap-4 border-t border-border/60 px-6 py-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Assets
          </div>
          <div className="divide-y divide-border/60">
            {release.assets.map((asset: ReleaseAsset, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                    {asset.name}
                  </div>
                  <span className="rounded-full border border-neutral-200/70 bg-white/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {formatBytes(asset.size)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline" className="gap-2">
                    <a
                      href={cdnUrl(
                        `${project.repo}/${release.tag_name}/${asset.name}`
                      )}
                    >
                      <Download className="h-4 w-4" />
                      CDN
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="gap-2">
                    <a href={asset.browser_download_url}>
                      <ExternalLink className="h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
}
