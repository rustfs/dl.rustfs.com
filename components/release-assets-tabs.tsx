"use client";

import { useMemo, useState } from "react";
import { Download, PaperclipIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatBytes } from "@/lib/utils";
import type { Release, ReleaseAsset } from "@/types";

const CDN_BASE = "https://dl.rustfs.com/artifacts";

type TabId = "binary" | "deb" | "rpm" | "all";

function AssetRow({
  cdnReleasePrefix,
  cdnReleaseIncludeTag,
  release,
  asset,
}: {
  cdnReleasePrefix?: string;
  cdnReleaseIncludeTag?: boolean;
  release: Release;
  asset: ReleaseAsset;
}) {
  const cdnReleasePathParts =
    cdnReleaseIncludeTag === false
      ? [cdnReleasePrefix]
      : [cdnReleasePrefix ?? "", release.tag_name];

  return (
    <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={asset.cdn_url ?? asset.browser_download_url}
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
        {asset.cdn_url ? (
          <Button asChild size="sm" variant="outline" className="gap-2">
            <a href={asset.cdn_url}>
              <Download className="h-4 w-4" />
              Download
            </a>
          </Button>
        ) : (
          <>
            <Button asChild size="sm" variant="outline" className="gap-2">
              <a
                href={`${CDN_BASE}/${[...cdnReleasePathParts, asset.name].join("/")}`}
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
          </>
        )}
      </div>
    </div>
  );
}

export default function ReleaseAssetsTabs({
  cdnReleasePrefix,
  cdnReleaseIncludeTag,
  release,
}: {
  cdnReleasePrefix?: string;
  cdnReleaseIncludeTag?: boolean;
  release: Release;
}) {
  const tabs = useMemo(() => {
    const binaryAssets = release.assets.filter(
      (asset) => !/\.(deb|rpm)$/i.test(asset.name)
    );
    const debAssets = release.assets.filter((asset) => /\.deb$/i.test(asset.name));
    const rpmAssets = release.assets.filter((asset) => /\.rpm$/i.test(asset.name));

    return [
      { id: "binary" as const, label: "Binary", assets: binaryAssets },
      { id: "deb" as const, label: "DEB", assets: debAssets },
      { id: "rpm" as const, label: "RPM", assets: rpmAssets },
      { id: "all" as const, label: "All assets", assets: release.assets },
    ].filter((tab) => tab.assets.length > 0);
  }, [release.assets]);

  const [activeTabId, setActiveTabId] = useState<TabId>(tabs[0]?.id ?? "all");
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  if (!activeTab || release.assets.length === 0) {
    return null;
  }

  const installCommand =
    activeTab.id === "deb" && activeTab.assets[0]
      ? `sudo dpkg -i ${activeTab.assets[0].name}`
      : activeTab.id === "rpm" && activeTab.assets[0]
        ? `sudo rpm -ivh ${activeTab.assets[0].name}`
        : null;

  return (
    <div className="flex flex-col gap-4 border-t border-border/60 px-6 py-6">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Assets
      </div>

      <div
        role="tablist"
        aria-label={`${release.name || release.tag_name} assets`}
        className="flex border-b border-border"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTabId(tab.id)}
              className={cn(
                "border-b-2 border-b-transparent px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground",
                isActive && "border-b-primary text-foreground"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {installCommand ? (
        <pre className="overflow-x-auto rounded-lg border border-border/70 bg-muted/50 px-4 py-3 font-mono text-[13px] leading-6 text-foreground">
          <span className="select-none text-muted-foreground">$ </span>
          {installCommand}
        </pre>
      ) : null}

      <div className="divide-y divide-border/60">
        {activeTab.assets.map((asset, index) => (
          <AssetRow
            key={`${asset.name}-${index}`}
            cdnReleasePrefix={cdnReleasePrefix}
            cdnReleaseIncludeTag={cdnReleaseIncludeTag}
            release={release}
            asset={asset}
          />
        ))}
      </div>
    </div>
  );
}
