import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";
import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  Trophy, 
  Award, 
  User,
  Menu,
  X,
  Code2
} from "lucide-react";
import { calculateLevel } from "@/lib/constants";
import type { UserStats } from "@shared/schema";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: stats } = useQuery<UserStats>({
    queryKey: ['/api/stats'],
  });

  const level = stats ? calculateLevel(stats.totalXP) : 1;

  const navLinks = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/leaderboard", label: "Clasificación", icon: Trophy },
    { href: "/achievements", label: "Logros", icon: Award },
    { href: "/profile", label: "Perfil", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover-elevate px-3 py-2 rounded-lg transition-all">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">PyMaster</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="gap-2"
                    data-testid={`nav-${link.label.toLowerCase()}`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:flex">
              Nivel {level}
            </Badge>
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
