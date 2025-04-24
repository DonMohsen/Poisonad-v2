'use client';

import useRoutes from "@/hooks/useRoutes";
import MobileItem from "./MobileItem";


const MobileFooter = () => {
  const routes = useRoutes();



  return ( 
    <div 
      className="
      
        fixed 
        justify-between 
        w-full 
        bottom-0 
        z-40 
        flex 
        items-center 
        bg-white 
      
        shadow-2xl
        lg:hidden
      "
    >
      {routes.map((route) => (
        <MobileItem 
        label={route.label}
          key={route.href} 
          href={route.href} 
          active={route.active} 
          icon={route.icon}
          
        //   onClick={route.onClick}
        />
      ))}
      
    </div>
   );
}
 
export default MobileFooter;