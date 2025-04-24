import Link from "next/link";

import clsx from "clsx";

interface MobileItemProps {
  href: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
  label:string
}

const MobileItem: React.FC<MobileItemProps> = ({ 
  href, 
  icon: Icon, 
  active,
  label,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return ( 
    <Link 
      onClick={handleClick} 
      href={href} 
      className={clsx(`
        group 
        flex 
        gap-x-3 
        text-sm 
        leading-6 
        font-semibold 
        w-full 
        justify-center 
        pt-2
        px-4
        text-gray-500 
       
      `,
      )}>
        <div className="flex flex-col  items-center justify-center">
      <Icon className={clsx(`h-6 w-6 text-[#64ce69] transition-all duration-200`,active? 'stroke-3':'stroke-1')} />
        <p className={clsx(`text-black text-[10px]`,active? 'font-bold':'font-medium')}>{label}</p>
        </div>
    </Link>
   );
}
 
export default MobileItem;