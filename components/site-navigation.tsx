"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const RUSTFS_WEBSITE_URL = "https://rustfs.com";

const navigationSections = [
  {
    label: "Product",
    items: [
      {
        title: "Multiple Protocol Access",
        href: "/product/multiple-protocol-access",
        description: "Native S3, WebDAV, Swift, FTP(s), and MCP access.",
      },
      {
        title: "Data Management",
        href: "/product/data-management",
        description: "Buckets, lifecycle, Object Lock, versioning, multipart upload, and S3 Tables.",
      },
      {
        title: "High Availability & Scale",
        href: "/product/high-availability-scale",
        description: "Distributed topology, Erasure Coding, pool orchestration, and self-healing.",
      },
      {
        title: "Security & Compliance",
        href: "/product/security-compliance",
        description: "Identity, OIDC, mTLS, encryption, KMS, audit, and event handling.",
      },
      {
        title: "Operational & Observability",
        href: "/product/operational-observability",
        description: "Cluster management, OTEL signals, and rc operations.",
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        title: "EC Calculator",
        href: "/erasure-code-calculator",
        description: "Optimal EC configurations for durability and storage efficiency.",
      },
      {
        title: "Documentation",
        href: "/docs",
        description: "Deploy, configure, and manage RustFS from quickstarts to API references.",
      },
      {
        title: "Blog",
        href: "/blog",
        description: "Production best practices, technical deep dives, and expert insights.",
      },
    ],
  },
] as const;

const navigationLinks = [
  { label: "Download", href: "/download" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact us", href: "/contact-us" },
] as const;

function websiteUrl(path: string) {
  return `${RUSTFS_WEBSITE_URL}${path}`;
}

export function SiteNavigation() {
  return (
    <NavigationMenu viewport={false} className="hidden lg:flex">
      <NavigationMenuList className="gap-1">
        {navigationSections.map((section) => (
          <NavigationMenuItem key={section.label}>
            <NavigationMenuTrigger className="h-auto bg-transparent px-2 py-1 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-foreground">
              {section.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="w-[34rem] rounded-none p-2">
              <div className="grid grid-cols-2 gap-1">
                {section.items.map((item) => (
                  <NavigationMenuLink
                    href={websiteUrl(item.href)}
                    key={item.title}
                    className="rounded-none p-3"
                  >
                    <span className="font-semibold text-foreground">{item.title}</span>
                    <span className="text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </span>
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
        {navigationLinks.map((item) => (
          <NavigationMenuItem key={item.label}>
            <NavigationMenuLink
              href={websiteUrl(item.href)}
              className="rounded-none px-2 py-1 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground focus:bg-transparent focus:text-foreground"
            >
              {item.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function MobileSiteNavigation() {
  return (
    <details className="group relative lg:hidden">
      <summary className="flex h-8 w-8 cursor-pointer list-none items-center justify-center text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
        <span className="sr-only">Toggle navigation</span>
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 16 16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        >
          <path d="M1 3h14M1 8h14M1 13h14" className="group-open:hidden" />
          <path d="m3 3 10 10M13 3 3 13" className="hidden group-open:block" />
        </svg>
      </summary>
      <nav className="absolute right-0 top-full z-50 mt-3 max-h-[calc(100dvh-6rem)] w-80 overflow-y-auto border border-border bg-background p-3 shadow-xl">
        {navigationSections.map((section) => (
          <div className="mb-3 last:mb-0" key={section.label}>
            <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {section.label}
            </p>
            {section.items.map((item) => (
              <a
                className="block px-2 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                href={websiteUrl(item.href)}
                key={item.title}
              >
                {item.title}
              </a>
            ))}
          </div>
        ))}
        <div className="border-t border-border pt-2">
          {navigationLinks.map((item) => (
            <a
              className="block px-2 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              href={websiteUrl(item.href)}
              key={item.label}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </details>
  );
}
