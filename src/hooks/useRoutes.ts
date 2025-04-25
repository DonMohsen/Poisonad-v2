import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, ScanSearch, Store, UtensilsCrossed } from "lucide-react";
import { IoRestaurantOutline, IoRestaurantSharp } from "react-icons/io5";

const useRoutes = () => {
  const pathname = usePathname();

  const routes = useMemo(() => [
    { 
      label: 'خانه', 
      href: '/', 
      icon: UtensilsCrossed ,
      active: pathname==='/',
    },
    { 
      label: 'گمشده', 
      
      href: '/lost', 
      icon: ScanSearch, 
      active: pathname.startsWith('/lost'),

    },
    {
      label: 'بازارچه', 
      href: '/market',
      icon: Store, 
      active: pathname.startsWith('/market'),



    }
  ], [pathname]);

  return routes;
};

export default useRoutes;