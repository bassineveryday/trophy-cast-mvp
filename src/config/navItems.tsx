import { HomeIcon, TrophyIcon, UsersIcon, UserIcon } from "@/components/icons";
import { ReactNode } from "react";

interface NavItem {
  id: string;
  label: string;
  to: string;
  icon: ReactNode;
}

export const coreNavItems: NavItem[] = [
  { id: "home",        label: "Home",        to: "/",            icon: <HomeIcon /> },
  { id: "tournaments", label: "Tournaments", to: "/tournaments", icon: <TrophyIcon /> },
  { id: "clubs",       label: "Clubs",       to: "/clubs",       icon: <UsersIcon /> },
  { id: "profile",     label: "Profile",     to: "/profile",     icon: <UserIcon /> },
];

export const overflowNavItems: NavItem[] = [
  // additional items can be appended here
];