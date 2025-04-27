"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 bg-warning rounded-full pointer-events-none mix-blend-difference"
      // style={{ backgroundImage: "url('/cursor.png')" }}
      animate={{ x: position.x - 7, y: position.y - 7 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    />
  );
};

export default CustomCursor;
