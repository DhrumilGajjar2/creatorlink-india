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

// ─── Nav items config ─────────────────────────────────────────────────────────

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

/** Returns true when the nav item should be treated as active */
function isActive(itemHref: string, pathname: string): boolean {
  if (itemHref === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname.startsWith(itemHref);
}

/** Avatar circle: first letter of handle */
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
        rounded-full bg-indigo-100 text-indigo-700 font-bold
        flex items-center justify-center select-none flex-shrink-0
        ${size === "sm" ? "w-8 h-8 text-sm" : "w-10 h-10 text-base"}
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
      className="flex items-center gap-1.5 select-none focus:outline-none"
      aria-label="CreatorLink dashboard home"
    >
      <span className="text-lg">🔗</span>
      <span
        className="
          font-extrabold text-transparent bg-clip-text
          bg-gradient-to-r from-indigo-600 to-purple-600
          text-base tracking-tight
        "
      >
        CreatorLink
      </span>
    </Link>
  );
}

// ─── Logout button ────────────────────────────────────────────────────────────

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
        flex items-center gap-1.5 text-xs text-gray-400
        hover:text-red-500 transition-colors duration-150
        px-2 py-1 rounded-lg hover:bg-red-50
      "
      aria-label="Log out"
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
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────

function TopBar({ session, router }: { session: Session; router: ReturnType<typeof useRouter> }) {
  return (
    <header
      className="
        sticky top-0 z-50 h-16
        flex items-center justify-between
        px-4 md:px-6
        bg-white border-b border-gray-100/80 shadow-sm
      "
      aria-label="Dashboard header"
    >
      {/* Left: Logo + separator + handle */}
      <div className="flex items-center gap-3">
        <Logo />

        {/* Separator + handle — desktop only */}
        <div className="hidden md:flex items-center gap-2">
          <span className="w-px h-4 bg-gray-200" aria-hidden="true" />
          <span className="text-gray-400 text-sm font-medium">
            @{session.handle}
          </span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* View live page */}
        <Link
          href={`/${session.handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            hidden sm:flex items-center gap-1.5
            text-indigo-600 hover:text-indigo-800
            text-xs font-semibold
            px-3 py-1.5 rounded-full
            border border-indigo-100 hover:border-indigo-300
            bg-indigo-50/50 hover:bg-indigo-50
            transition-all duration-150
          "
          aria-label={`View live page for @${session.handle}`}
        >
          View Live Page
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </Link>

        {/* Notification dot placeholder */}
        <div
          className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0"
          aria-hidden="true"
          title="Notifications (coming soon)"
        />

        {/* Avatar */}
        <AvatarCircle handle={session.handle} size="sm" />

        {/* Logout */}
        <LogoutButton router={router} />
      </div>
    </header>
  );
}

// ─── Sidebar (desktop only) ───────────────────────────────────────────────────

function Sidebar({ session, pathname }: { session: Session; pathname: string }) {
  return (
    <aside
      className="
        hidden md:flex flex-col
        w-60 flex-shrink-0
        bg-white border-r border-gray-100
        min-h-[calc(100vh-4rem)]
        sticky top-16 self-start
      "
      aria-label="Sidebar navigation"
    >
      {/* Creator card */}
      <div className="flex flex-col items-center text-center pt-6 pb-4 px-4 border-b border-gray-100/80">
        <AvatarCircle handle={session.handle} size="md" />
        <p className="text-gray-800 font-semibold text-sm mt-2 leading-tight">
          {session.handle}
        </p>
        <p className="text-gray-400 text-xs mt-0.5">@{session.handle}</p>
        <Link
          href={`/${session.handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-2 text-[11px] text-indigo-500 hover:text-indigo-700
            flex items-center gap-0.5 transition-colors duration-150
          "
          aria-label={`View public page for @${session.handle}`}
        >
          View Page
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-5 px-3 space-y-0.5" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-150
                ${
                  active
                    ? "bg-indigo-50 text-indigo-700 font-semibold border-l-2 border-indigo-600 pl-2.5"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
              aria-current={active ? "page" : undefined}
            >
              <span className="text-base w-5 text-center" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom upgrade pill */}
      <div className="p-4">
        <div
          className="
            flex items-center justify-center gap-1.5
            text-[11px] text-gray-400 font-medium
            bg-gray-50 border border-gray-100
            rounded-full py-2 px-3
          "
          aria-label="Pro features coming soon"
        >
          ✨ Pro Features Coming
        </div>
      </div>
    </aside>
  );
}

// ─── Bottom nav (mobile only) ─────────────────────────────────────────────────

function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav
      className="
        md:hidden fixed bottom-0 left-0 right-0 z-50
        bg-white border-t border-gray-100
        flex items-center justify-around
        pb-safe pt-2
        shadow-[0_-1px_12px_rgba(0,0,0,0.06)]
      "
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      aria-label="Mobile bottom navigation"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="
              flex flex-col items-center gap-0.5 flex-1
              py-1 relative focus:outline-none
            "
            aria-current={active ? "page" : undefined}
            aria-label={item.label}
          >
            {/* Active indicator dot above icon */}
            <span
              className={`
                absolute top-0 w-1 h-1 rounded-full
                transition-all duration-300 ease-out
                ${active ? "bg-indigo-500 opacity-100" : "opacity-0"}
              `}
              aria-hidden="true"
            />

            {/* Icon */}
            <span
              className={`
                text-xl transition-transform duration-200
                ${active ? "scale-110" : "scale-100"}
              `}
              aria-hidden="true"
            >
              {item.mobileIcon}
            </span>

            {/* Label */}
            <span
              className={`
                text-[10px] font-semibold transition-colors duration-150
                ${active ? "text-indigo-600" : "text-gray-400"}
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

// ─── Main shell ───────────────────────────────────────────────────────────────

export default function DashboardShell({ session, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top bar */}
      <TopBar session={session} router={router} />

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — desktop */}
        <Sidebar session={session} pathname={pathname} />

        {/* Main content area */}
        <main
          className="
            flex-1 overflow-y-auto
            p-5 md:p-8
            pb-24 md:pb-8
            bg-gray-50/50
          "
          aria-label="Dashboard content"
        >
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <BottomNav pathname={pathname} />
    </div>
  );
}
