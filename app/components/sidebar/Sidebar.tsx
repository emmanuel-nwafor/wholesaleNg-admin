"use client";

import NextLink from "next/link";
import { useState } from "react";
import {
  Home,
  Package,
  Tag,
  Gift,
  CreditCard,
  Users,
  UserCheck,
  FileText,
  Mail,
  Image as ImageIcon,
  Settings,
  Menu,
  X,
} from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", href: "/", icon: <Home size={20} /> },
  {
    label: "Products Management",
    href: "/management/product-management",
    icon: <Package size={20} />,
  },
  {
    label: "Category Management",
    href: "/management/category-management",
    icon: <Tag size={20} />,
  },
  { label: "Starter Packs", href: "/starter-packs", icon: <Gift size={20} /> },
  {
    label: "Transactions",
    href: "/transactions",
    icon: <CreditCard size={20} />,
  },
  {
    label: "Users Management",
    href: "/management/users-management",
    icon: <Users size={20} />,
  },
  {
    label: "Verification Request",
    href: "/requests",
    icon: <UserCheck size={20} />,
  },
  {
    label: "Report Management",
    href: "/management/report-management",
    icon: <FileText size={20} />,
  },
  {
    label: "Communication Mgmt",
    href: "/management/communication-management",
    icon: <Mail size={20} />,
  },
  {
    label: "Banners Mgmt",
    href: "/management/banner-management",
    icon: <ImageIcon size={20} />,
  },
  { label: "Settings", href: "/settings", icon: <Settings size={20} /> },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = (
    <div className="flex flex-col h-full w-64 overflow-y-auto bg-slate-900 text-white p-4">
      {/* Logo */}
      <div className="mb-6 text-center">
        <img
          src="https://res.cloudinary.com/dqtjja88b/image/upload/v1760219419/Screenshot_2025-10-11_224658_q8bjy2.png"
          alt="Wholesale Naija"
          width={170}
          height={70}
          className="mx-auto"
        />
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {MENU_ITEMS.map((item) => (
            <li key={item.label}>
              <NextLink
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 hover:bg-white hover:text-black active:bg-white active:text-black"
              >
                {item.icon}
                <span>{item.label}</span>
              </NextLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white bg-slate-800 rounded-md shadow-md"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay + Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />

        {/* Sidebar Drawer */}
        <div className="relative z-50 w-full h-full bg-slate-900 shadow-xl">
          {SidebarContent}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-full w-64 border-r border-slate-700 bg-slate-900">
        {SidebarContent}
      </div>
    </>
  );
}
