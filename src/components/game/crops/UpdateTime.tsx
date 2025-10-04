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
    <div className="mt-4 pt-3 border-t border-gray-700 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <motion.div
          className="w-2 h-2 bg-green-500 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span className="text-green-400">NASA Earthdata Connected {time || "Cargando..."} horas</span>
      </div>
      
    </div>
  );
}