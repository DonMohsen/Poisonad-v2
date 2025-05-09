// components/CustomToast.tsx
"use client";

import { toast, Toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react"; // or any icons you like

type CustomToastProps = {
  t: Toast;
  message: string;
  type?: "success" | "error" | "loading";
};

export const CustomToast = ({ t, message, type = "success" }: CustomToastProps) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (type === "loading") return;

    const start = Date.now();
    const duration = 4000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentage = 100 - (elapsed / duration) * 100;
      setProgress(Math.max(0, percentage));
    }, 30);

    const timeout = setTimeout(() => toast.dismiss(t.id), duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [t, type]);

  const getColor = () => {
    if (type === "success") return "bg-green-600";
    if (type === "error") return "bg-red-600";
    if (type === "loading") return "bg-blue-600";
    return "bg-zinc-900";
  };

  const getIcon = () => {
    if (type === "success") return <CheckCircle className="h-5 w-5 mr-2" />;
    if (type === "error") return <XCircle className="h-5 w-5 mr-2" />;
    if (type === "loading") return <Loader2 className="h-5 w-5 mr-2 animate-spin" />;
    return null;
  };

  return (
    <AnimatePresence>
 {t.visible && (
  <motion.div
    layout
    initial={{ x: 300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 300, opacity: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    drag="x"
    onDragEnd={(e, info) => {
      if (info.offset.x > 100) toast.dismiss(t.id);
    }}
    className={`text-white px-4 py-3 rounded-lg shadow-lg cursor-pointer w-full max-w-sm relative ${getColor()}`}
  >
    <div className="flex items-center">
      {getIcon()}
      <span>{message}</span>
    </div>

    {/* Timer bar */}
    {type !== "loading" && (
      <div
        className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg"
        style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
      />
    )}

    {/* Close Button */}
    <div className="mt-3 text-right">
      <button
        onClick={() => toast.dismiss(t.id)}
        className="text-sm text-white/80 hover:text-white transition"
      >
        Close
      </button>
    </div>
  </motion.div>
)}

    </AnimatePresence>
  );
};
