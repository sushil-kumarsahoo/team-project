"use client";
import { User } from "@/app/types/index";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/provider/authProvider";

interface HeaderProps {
  user: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const pathname = usePathname();
  const {logout} = useAuth();
  const navigation = [
    { name: "Home", href: "/", show: true },
    { name: "Dashboard", href: "/dashboard", show: true },
  ].filter((item) => item.show);

  const getNavItemClass = (href: string) => {
    let isActive = false;
    if (href === "/") {
      isActive = pathname === href;
    } else if (href === "/dashboard") {
      isActive = pathname.startsWith(href);
    }
    return `px-3 py-2 rounded text-white hover:text-gray-300 ${isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`;
  };

  return (
    <header className="bg-slate border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-white hover:text-gray-300 text-xl"
          >
            TeamAcess
          </Link>

          {/* Navigation */}
          <nav className="flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={getNavItemClass(item.href)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-slate-300 text-sm">{user.name} ({user.role})</span>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-blue-600 text-blue-300 hover:bg-blue-700 hover:text-blue-200 rounded-md inline-block"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-blue-300 hover:bg-blue-700 hover:text-blue-200 rounded-md ml-4 inline-block"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
