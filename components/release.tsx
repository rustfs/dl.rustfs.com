import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cdnUrl, formatBytes } from "@/lib/utils";
import { Project } from "@/projects.config";
import { type Release, ReleaseAsset } from "@/types";
import { ChevronDown, Download, PaperclipIcon } from "lucide-react";
import Markdown from "./markdown";

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
                    <a
                      href={asset.browser_download_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 font-mono text-sm text-foreground hover:underline"
                    >
                      <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                      {asset.name}
                    </a>
                    <Badge
                      variant="outline"
                      className="rounded-full border-border/70 bg-background/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      {formatBytes(asset.size)}
                    </Badge>
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
                    <Button asChild size="sm" variant="outline" className="gap-2">
                      <a href={asset.browser_download_url}>
                        <Download className="h-4 w-4" />
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
    </details>
  );
}
