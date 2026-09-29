"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Session {
  creatorId: string;
  handle: string;
  email: string;
}

interface DashboardShellProps {
  session: Session;
  children: ReactNode;
}

// ─── Nav Items Config ─────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  icon: string;
  href: string;
  mobileIcon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Links",     icon: "🔗", href: "/dashboard",            mobileIcon: "🔗" },
  { label: "Analytics", icon: "📊", href: "/dashboard/analytics",  mobileIcon: "📊" },
  { label: "Products",  icon: "🛒", href: "/dashboard/products",   mobileIcon: "🛒" },
  { label: "Settings",  icon: "⚙️", href: "/dashboard/settings",   mobileIcon: "⚙️" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isActive(itemHref: string, pathname: string): boolean {
  if (itemHref === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname.startsWith(itemHref);
}

function AvatarCircle({
  handle,
  size = "sm",
}: {
  handle: string;
  size?: "sm" | "md";
}) {
  const letter = handle?.[0]?.toUpperCase() ?? "C";
  return (
    <div
      className={`
        rounded-full bg-neutral-100 text-neutral-900 font-semibold border border-neutral-200/80
        flex items-center justify-center select-none flex-shrink-0
        ${size === "sm" ? "w-8 h-8 text-xs" : "w-11 h-11 text-sm"}
      `}
      aria-hidden="true"
    >
      {letter}
    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2 select-none group"
      aria-label="CreatorLink dashboard"
    >
      <span className="text-xl">🔗</span>
      <span className="font-bold text-sm tracking-tight text-neutral-900 group-hover:text-indigo-600 transition-colors">
        CreatorLink <span className="font-normal text-neutral-400">India</span>
      </span>
    </Link>
  );
}

// ─── Logout Button ────────────────────────────────────────────────────────────

function LogoutButton({ router }: { router: ReturnType<typeof useRouter> }) {
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // best-effort
    } finally {
      router.push("/login");
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="
        touch-target-44 flex items-center gap-1.5 text-xs text-neutral-500
        hover:text-red-600 transition-colors px-2.5 py-1 rounded-lg hover:bg-red-50/60
      "
      aria-label="Log out of account"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span className="hidden sm:inline font-medium">Logout</span>
    </button>
  );
}

// ─── Top Bar (Apple Frosted Glass) ────────────────────────────────────────────

function TopBar({ session, router }: { session: Session; router: ReturnType<typeof useRouter> }) {
  return (
    <header
      className="
        sticky top-0 z-40 h-16
        flex items-center justify-between
        px-4 sm:px-6
        bg-white/85 backdrop-blur-xl border-b border-black/[0.06]
      "
      aria-label="Dashboard top navigation"
    >
      <div className="flex items-center gap-3">
        <Logo />
        <div className="hidden md:flex items-center gap-2">
          <span className="w-px h-3.5 bg-neutral-200" aria-hidden="true" />
          <span className="text-neutral-500 text-xs font-mono">
            @{session.handle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Single Primary Preview Live Page Action */}
        <Link
          href={`/${session.handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex items-center gap-1.5
            text-xs font-semibold
            px-3.5 py-1.5 rounded-full
            bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800
            transition-all duration-150 active:scale-95 border border-neutral-200/60
          "
          aria-label={`Preview live bio page for @${session.handle} in new tab`}
        >
          <span>Preview Page</span>
          <svg className="w-3 h-3 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>

        <AvatarCircle handle={session.handle} size="sm" />
        <LogoutButton router={router} />
      </div>
    </header>
  );
}

// ─── Sidebar (Desktop Clean Minimalist) ───────────────────────────────────────

function Sidebar({ session, pathname }: { session: Session; pathname: string }) {
  return (
    <aside
      className="
        hidden md:flex flex-col
        w-60 flex-shrink-0
        bg-[#fafafa] border-r border-black/[0.06]
        min-h-[calc(100vh-4rem)]
        sticky top-16 self-start
      "
      aria-label="Dashboard sidebar"
    >
      {/* Creator Profile Summary */}
      <div className="flex items-center gap-3 p-4 mx-3 mt-3 rounded-2xl bg-white border border-black/[0.04] shadow-2xs">
        <AvatarCircle handle={session.handle} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-neutral-900 font-semibold text-xs truncate">
            {session.handle}
          </p>
          <p className="text-neutral-400 text-[11px] font-mono truncate">
            creatorlink.in/{session.handle}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                text-xs font-medium transition-all duration-150
                ${
                  active
                    ? "bg-white text-neutral-950 font-semibold shadow-xs border border-black/[0.06]"
                    : "text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-900"
                }
              `}
              aria-current={active ? "page" : undefined}
            >
              <span className="text-base w-5 text-center" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Subtle footer */}
      <div className="p-4 text-center">
        <div className="text-[11px] text-neutral-400 font-medium bg-neutral-100/80 rounded-full py-1.5 px-3 border border-neutral-200/50">
          🇮🇳 India-First Creator Tool
        </div>
      </div>
    </aside>
  );
}

// ─── Bottom Navigation (Mobile with 44px touch targets) ───────────────────────

function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav
      className="
        md:hidden fixed bottom-0 left-0 right-0 z-40
        bg-white/92 backdrop-blur-xl border-t border-black/[0.06]
        flex items-center justify-around
        pt-1.5 pb-safe
        shadow-lg
      "
      style={{ paddingBottom: "max(0.6rem, env(safe-area-inset-bottom))" }}
      aria-label="Mobile bottom navigation"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="
              touch-target-44 flex flex-col items-center justify-center flex-1
              py-1 relative
            "
            aria-current={active ? "page" : undefined}
            aria-label={item.label}
          >
            {active && (
              <span
                className="absolute top-0.5 w-6 h-0.5 rounded-full bg-neutral-950"
                aria-hidden="true"
              />
            )}
            <span
              className={`
                text-lg transition-transform duration-200
                ${active ? "scale-105" : "scale-100 opacity-70"}
              `}
              aria-hidden="true"
            >
              {item.mobileIcon}
            </span>
            <span
              className={`
                text-[10px] mt-0.5 font-medium transition-colors
                ${active ? "text-neutral-950 font-semibold" : "text-neutral-400"}
              `}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

// ─── Main Shell Component ─────────────────────────────────────────────────────

export default function DashboardShell({ session, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex flex-col">
      <TopBar session={session} router={router} />
      <div className="flex flex-1">
        <Sidebar session={session} pathname={pathname} />
        <main
          className="
            flex-1 overflow-y-auto
            p-5 sm:p-8
            pb-28 md:pb-12
          "
          aria-label="Dashboard workspace"
        >
          {children}
        </main>
      </div>
      <BottomNav pathname={pathname} />
    </div>
  );
}
