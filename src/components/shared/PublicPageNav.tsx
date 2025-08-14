import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PublicPageNavProps {
  showBackButton?: boolean;
  showLogo?: boolean;
  logoClassName?: string;
}

export function PublicPageNav({ 
  showBackButton = true, 
  showLogo = true,
  logoClassName = "h-12 w-auto"
}: PublicPageNavProps) {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-16">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/landing" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            )}
            {showLogo && (
              <Link to="/landing" className="flex items-center hover:opacity-80 transition-opacity">
                <img 
                  src="/lovable-uploads/801f0a89-558e-4fd0-8e4e-102d5c5d2d3e.png" 
                  alt="FlexIO Logo" 
                  className={logoClassName}
                />
              </Link>
            )}
            {!showLogo && (
              <h1 className="text-xl font-bold">FlexIO</h1>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/auth" className="story-link hover-scale">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/workspace-selection">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}