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

// Menu items
const MENU_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
  { label: "Products Management", href: "/products", icon: <Package size={20} /> },
  { label: "Category Management", href: "/categories", icon: <Tag size={20} /> },
  { label: "Starter Packs", href: "/starter-packs", icon: <Gift size={20} /> },
  { label: "Transactions", href: "/transactions", icon: <CreditCard size={20} /> },
  { label: "Users Management", href: "/users", icon: <Users size={20} /> },
  { label: "Verification Request", href: "/verifications", icon: <UserCheck size={20} /> },
  { label: "Report Management", href: "/reports", icon: <FileText size={20} /> },
  { label: "Communication Mgmt", href: "/communications", icon: <Mail size={20} /> },
  { label: "Banners Mgmt", href: "/banners", icon: <ImageIcon size={20} /> },
  { label: "Settings", href: "/settings", icon: <Settings size={20} /> },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = (
    <div className="flex flex-col h-full w-full overflow-y-auto bg-slate-900 text-white p-4">
      {/* Logo */}
      <div className="mb-6 text-center">
        <img
          src="https://res.cloudinary.com/dqtjja88b/image/upload/v1760219419/Screenshot_2025-10-11_224658_q8bjy2.png"
          alt="Wholesale Naija"
          width={170}
          height={70}
          className=""
        />
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {MENU_ITEMS.map((item) => (
            <li key={item.label}>
              <NextLink href={item.href} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white hover:text-black text-sm transition">
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
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-2 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white bg-slate-800 rounded">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-opacity-50" onClick={() => setIsOpen(false)} />
        {SidebarContent}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed top-0 left-0 h-full border-r border-slate-700">
        {SidebarContent}
      </div>
    </>
  );
}