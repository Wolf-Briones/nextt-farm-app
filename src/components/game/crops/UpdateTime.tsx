"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";  

interface ConnectionStatusProps {
  nasaData: {
    lastUpdate: string | Date;
  };
}

export default function ConnectionStatus({ nasaData }: ConnectionStatusProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    if (nasaData?.lastUpdate) {
      const date = new Date(nasaData.lastUpdate);
      setTime(date.toLocaleTimeString());
    }
  }, [nasaData]);

  return (
    <div className="mt-4 pt-3 border-t border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-3 sm:gap-0">
      <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start text-center sm:text-left">
        <motion.div
          className="w-2 h-2 bg-green-500 rounded-full shrink-0"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span className="text-green-400 leading-tight">
          NASA Earthdata <span className="hidden xs:inline">Connected</span>{" "}
          {time || "Cargando..."} horas
        </span>
      </div>
    </div>
  );
}
