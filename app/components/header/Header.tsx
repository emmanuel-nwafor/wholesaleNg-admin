"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";

const pathToTitle: Record<string, string> = {
  "/": "Dashboard",
  "/management/product-management": "Products Management",
  "/management/category-management": "Category Management",
  "/starter-packs": "Starter Packs",
  "/transactions": "Transactions",
  "/management/users-management": "Users Management",
  "/requests": "Verification Request",
  "/management/report-management": "Report Management",
  "/management/communication-management": "Communication Management",
  "/management/banner-management": "Banners Management",
  "/settings": "Settings",
};

export default function Header() {
  const pathname = usePathname();
  const title = pathToTitle[pathname ?? ""] ?? "Dashboard";

  const [open, setOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <header className="top-0 left-0 w-full z-20 bg-white shadow-sm">
      {/* Inner container */}
      <div className="mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:ml-64">
        <h1 className="font-semibold text-sm sm:text-base min-w-0 flex-1">
          <span className="block truncate">{title}</span>
        </h1>

        {/* Profile / dropdown */}
        <div className="mt-4 flex items-center relative" ref={menuRef}>
          <button
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-300"
            type="button"
          >
            <img
              src="https://i.pinimg.com/736x/ed/f2/f0/edf2f0344a86c77a821e9cb711b21ec0.jpg"
              alt="profile"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
            />
            <span className="hidden sm:inline-block text-sm font-medium text-slate-700 max-w-[160px] truncate">
              Joanna Adeleke
            </span>
            <ChevronDown className="w-4 h-4 text-slate-600" />
          </button>

          {/* Dropdown */}
          {open && (
            <div
              role="menu"
              aria-label="Profile menu"
              className="absolute right-0 mt-12 w-48 bg-white rounded-md shadow-lg border border-slate-200 overflow-hidden"
            >
              <ul className="py-1">
                <li>
                  <a
                    href="/profile"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/settings"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpen(false);
                      // logout logic here
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
