import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { Button } from "../ui/button";
import { BusinessSwitcher } from "./BusinessSwitcher";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-12 items-center justify-between border-b bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link to="/" className="font-bold text-sm">
        Fiscal App
      </Link>
      <div className="flex items-center gap-1">
        <BusinessSwitcher />
        <Button variant="outline" size="sm" asChild>
          <Link to="/onboarding/setup-business">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}
