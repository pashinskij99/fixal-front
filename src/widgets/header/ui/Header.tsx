import { useLogout } from "@/entities/session";
import { BusinessSwitcher } from "@/shared/components/BusinessSwitcher";
import { ModeToggle } from "@/shared/components/mode-toggle";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const { mutate: logout, isPending } = useLogout();

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

        <Button
          variant="outline"
          size="sm"
          onClick={() => logout()}
          disabled={isPending}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
