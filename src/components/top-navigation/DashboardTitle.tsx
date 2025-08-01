import { useLocation } from 'react-router-dom';

export function DashboardTitle() {
  const location = useLocation();
  
  const getPageTitle = () => {
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