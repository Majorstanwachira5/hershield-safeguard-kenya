import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", path: "/" }
  ];

  let currentPath = "";
  pathnames.forEach((pathname) => {
    currentPath += `/${pathname}`;
    
    // Map paths to friendly labels
    const labelMap: Record<string, string> = {
      "/dashboard": "Dashboard",
      "/help": "Help & Support",
      "/privacy": "Privacy Settings",
      "/contacts": "Trusted Contacts",
      "/resources": "Emergency Resources"
    };
    
    breadcrumbs.push({
      label: labelMap[currentPath] || pathname.charAt(0).toUpperCase() + pathname.slice(1),
      path: currentPath
    });
  });

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex items-center gap-2">
          {index === 0 && <Home className="h-3 w-3" />}
          
          {index < breadcrumbs.length - 1 ? (
            <Link 
              to={breadcrumb.path}
              className="hover:text-foreground transition-colors"
            >
              {breadcrumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">
              {breadcrumb.label}
            </span>
          )}
          
          {index < breadcrumbs.length - 1 && (
            <ChevronRight className="h-3 w-3" />
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;