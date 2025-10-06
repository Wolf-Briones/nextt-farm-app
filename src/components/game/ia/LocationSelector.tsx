"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTINENTS, getCountriesByContinent, searchCountries } from "@/lib/const/countries-data";
import type { Country } from "@/lib/const/countries-data";

interface LocationSelectorProps {
  onLocationChange: (country: Country) => void;
  initialCountry?: Country;
}

export function LocationSelector({ onLocationChange, initialCountry }: LocationSelectorProps) {
  const [selectedContinent, setSelectedContinent] = useState<string>("América del Sur");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(initialCountry || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredCountries(searchCountries(searchQuery));
    } else {
      setFilteredCountries(getCountriesByContinent(selectedContinent));
    }
  }, [searchQuery, selectedContinent]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowSearch(false);
    setSearchQuery("");
    onLocationChange(country);
  };

  const handleContinentChange = (continent: string) => {
    setSelectedContinent(continent);
    setSearchQuery("");
  };

  const getContinentIcon = (continent: string): string => {
    const icons: Record<string, string> = {
      "América del Sur": "🌎",
      "América del Norte": "🌎",
      "América Central": "🌎",
      "Europa": "🌍",
      "Asia": "🌏",
      "África": "🌍",
      "Oceanía": "🌏"
    };
    return icons[continent] || "🌍";
  };

  return (
    <div className="bg-gray-800/50 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-green-400 flex items-center gap-2">
          🌍 Seleccionar Ubicación
        </h3>
        <motion.button
          onClick={() => setShowSearch(!showSearch)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            showSearch 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔍 {showSearch ? 'Cerrar Búsqueda' : 'Buscar País'}
        </motion.button>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar país o capital..."
                className="w-full bg-gray-900 border border-green-500/50 text-white rounded-lg px-4 py-3 pl-12 focus:outline-none focus:border-green-400 transition-colors"
                autoFocus
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
              {searchQuery && (
                <motion.button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-2 text-sm text-gray-400">
                {filteredCountries.length} resultado{filteredCountries.length !== 1 ? 's' : ''} encontrado{filteredCountries.length !== 1 ? 's' : ''}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continent Selector */}
      {!showSearch && (
        <div className="mb-6">
          <label className="text-green-400 text-sm mb-3 block font-semibold">
            Selecciona un Continente
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CONTINENTS.map((continent) => (
              <motion.button
                key={continent}
                onClick={() => handleContinentChange(continent)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedContinent === continent
                    ? 'border-green-400 bg-green-900/30 text-white'
                    : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-green-500/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-2xl mb-1">{getContinentIcon(continent)}</div>
                <div className="text-xs font-semibold">{continent}</div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Countries Grid */}
      <div className="mb-6">
        <label className="text-green-400 text-sm mb-3 block font-semibold">
          {searchQuery ? 'Resultados de Búsqueda' : `Países en ${selectedContinent}`}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto p-2">
          {filteredCountries.map((country) => (
            <motion.button
              key={country.code}
              onClick={() => handleCountrySelect(country)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedCountry?.code === country.code
                  ? 'border-green-400 bg-green-900/30 shadow-lg'
                  : 'border-gray-600 bg-gray-700/50 hover:border-green-500/50'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">
                    {country.nameEs}
                  </div>
                </div>
              </div>
              {country.capital && (
                <div className="text-xs text-gray-400 truncate">
                  📍 {country.capital}
                </div>
              )}
            </motion.button>
          ))}
        </div>
        {filteredCountries.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🔍</div>
            <div>No se encontraron países</div>
          </div>
        )}
      </div>

      {/* Selected Country Display */}
      {selectedCountry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{selectedCountry.flag}</span>
              <div>
                <div className="text-white font-bold text-lg">{selectedCountry.nameEs}</div>
                <div className="text-green-400 text-sm">
                  📍 {selectedCountry.capital || 'Capital no disponible'}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  🌍 {selectedCountry.continent}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1">Coordenadas</div>
              <div className="text-green-400 font-mono text-sm">
                {selectedCountry.latitude.toFixed(4)}°
              </div>
              <div className="text-green-400 font-mono text-sm">
                {selectedCountry.longitude.toFixed(4)}°
              </div>
            </div>
          </div>
          
          {/* Quick Info */}
          <div className="mt-3 pt-3 border-t border-green-500/30 grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <div className="text-gray-400">Código</div>
              <div className="text-white font-semibold">{selectedCountry.code}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Latitud</div>
              <div className="text-white font-semibold">{selectedCountry.latitude.toFixed(2)}°</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Longitud</div>
              <div className="text-white font-semibold">{selectedCountry.longitude.toFixed(2)}°</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* No Country Selected */}
      {!selectedCountry && (
        <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 text-center">
          <div className="text-yellow-400 text-sm">
            ⚠️ Selecciona un país para ver las predicciones
          </div>
        </div>
      )}
    </div>
  );
}