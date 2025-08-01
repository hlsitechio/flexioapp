import { useLocation } from 'react-router-dom';

interface DashboardTitleProps {
  customTitle?: string;
}

export function DashboardTitle({ customTitle }: DashboardTitleProps) {
  const location = useLocation();
  
  const getPageTitle = () => {
    if (customTitle && location.pathname === '/') {
      return customTitle;
    }
    
    switch (location.pathname) {
      case '/':
        return 'Premium Dashboard';
      case '/profile':
        return 'Profile';
      case '/settings':
        return 'Settings';
      case '/components':
        return 'Components';
      default:
        return 'Premium Dashboard';
    }
  };

  return (
    <div className="text-lg font-medium text-foreground">
      {getPageTitle()}
    </div>
  );
}