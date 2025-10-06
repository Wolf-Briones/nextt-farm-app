
export interface Country {
  code: string;
  name: string;
  nameEs: string;
  latitude: number;
  longitude: number;
  continent: string;
  flag: string;
  capital?: string;
}

export const COUNTRIES_DATABASE: Country[] = [
  // AMÉRICA DEL SUR
  { code: "AR", name: "Argentina", nameEs: "Argentina", latitude: -34.6037, longitude: -58.3816, continent: "América del Sur", flag: "🇦🇷", capital: "Buenos Aires" },
  { code: "BO", name: "Bolivia", nameEs: "Bolivia", latitude: -16.5000, longitude: -68.1500, continent: "América del Sur", flag: "🇧🇴", capital: "La Paz" },
  { code: "BR", name: "Brazil", nameEs: "Brasil", latitude: -15.7939, longitude: -47.8828, continent: "América del Sur", flag: "🇧🇷", capital: "Brasília" },
  { code: "CL", name: "Chile", nameEs: "Chile", latitude: -33.4489, longitude: -70.6693, continent: "América del Sur", flag: "🇨🇱", capital: "Santiago" },
  { code: "CO", name: "Colombia", nameEs: "Colombia", latitude: 4.7110, longitude: -74.0721, continent: "América del Sur", flag: "🇨🇴", capital: "Bogotá" },
  { code: "EC", name: "Ecuador", nameEs: "Ecuador", latitude: -0.1807, longitude: -78.4678, continent: "América del Sur", flag: "🇪🇨", capital: "Quito" },
  { code: "GY", name: "Guyana", nameEs: "Guyana", latitude: 6.8013, longitude: -58.1551, continent: "América del Sur", flag: "🇬🇾", capital: "Georgetown" },
  { code: "PY", name: "Paraguay", nameEs: "Paraguay", latitude: -25.2637, longitude: -57.5759, continent: "América del Sur", flag: "🇵🇾", capital: "Asunción" },
  { code: "PE", name: "Peru", nameEs: "Perú", latitude: -12.0464, longitude: -77.0428, continent: "América del Sur", flag: "🇵🇪", capital: "Lima" },
  { code: "SR", name: "Suriname", nameEs: "Surinam", latitude: 5.8520, longitude: -55.2038, continent: "América del Sur", flag: "🇸🇷", capital: "Paramaribo" },
  { code: "UY", name: "Uruguay", nameEs: "Uruguay", latitude: -34.9011, longitude: -56.1645, continent: "América del Sur", flag: "🇺🇾", capital: "Montevideo" },
  { code: "VE", name: "Venezuela", nameEs: "Venezuela", latitude: 10.4806, longitude: -66.9036, continent: "América del Sur", flag: "🇻🇪", capital: "Caracas" },

  // AMÉRICA DEL NORTE
  { code: "CA", name: "Canada", nameEs: "Canadá", latitude: 45.4215, longitude: -75.6972, continent: "América del Norte", flag: "🇨🇦", capital: "Ottawa" },
  { code: "MX", name: "Mexico", nameEs: "México", latitude: 19.4326, longitude: -99.1332, continent: "América del Norte", flag: "🇲🇽", capital: "Ciudad de México" },
  { code: "US", name: "United States", nameEs: "Estados Unidos", latitude: 38.9072, longitude: -77.0369, continent: "América del Norte", flag: "🇺🇸", capital: "Washington D.C." },

  // AMÉRICA CENTRAL
  { code: "BZ", name: "Belize", nameEs: "Belice", latitude: 17.2510, longitude: -88.7590, continent: "América Central", flag: "🇧🇿", capital: "Belmopán" },
  { code: "CR", name: "Costa Rica", nameEs: "Costa Rica", latitude: 9.9281, longitude: -84.0907, continent: "América Central", flag: "🇨🇷", capital: "San José" },
  { code: "SV", name: "El Salvador", nameEs: "El Salvador", latitude: 13.6929, longitude: -89.2182, continent: "América Central", flag: "🇸🇻", capital: "San Salvador" },
  { code: "GT", name: "Guatemala", nameEs: "Guatemala", latitude: 14.6349, longitude: -90.5069, continent: "América Central", flag: "🇬🇹", capital: "Ciudad de Guatemala" },
  { code: "HN", name: "Honduras", nameEs: "Honduras", latitude: 14.0723, longitude: -87.1921, continent: "América Central", flag: "🇭🇳", capital: "Tegucigalpa" },
  { code: "NI", name: "Nicaragua", nameEs: "Nicaragua", latitude: 12.1150, longitude: -86.2362, continent: "América Central", flag: "🇳🇮", capital: "Managua" },
  { code: "PA", name: "Panama", nameEs: "Panamá", latitude: 8.9824, longitude: -79.5199, continent: "América Central", flag: "🇵🇦", capital: "Panamá" },

  // EUROPA
  { code: "ES", name: "Spain", nameEs: "España", latitude: 40.4168, longitude: -3.7038, continent: "Europa", flag: "🇪🇸", capital: "Madrid" },
  { code: "FR", name: "France", nameEs: "Francia", latitude: 48.8566, longitude: 2.3522, continent: "Europa", flag: "🇫🇷", capital: "París" },
  { code: "DE", name: "Germany", nameEs: "Alemania", latitude: 52.5200, longitude: 13.4050, continent: "Europa", flag: "🇩🇪", capital: "Berlín" },
  { code: "IT", name: "Italy", nameEs: "Italia", latitude: 41.9028, longitude: 12.4964, continent: "Europa", flag: "🇮🇹", capital: "Roma" },
  { code: "GB", name: "United Kingdom", nameEs: "Reino Unido", latitude: 51.5074, longitude: -0.1278, continent: "Europa", flag: "🇬🇧", capital: "Londres" },
  { code: "PT", name: "Portugal", nameEs: "Portugal", latitude: 38.7223, longitude: -9.1393, continent: "Europa", flag: "🇵🇹", capital: "Lisboa" },
  { code: "NL", name: "Netherlands", nameEs: "Países Bajos", latitude: 52.3676, longitude: 4.9041, continent: "Europa", flag: "🇳🇱", capital: "Ámsterdam" },
  { code: "BE", name: "Belgium", nameEs: "Bélgica", latitude: 50.8503, longitude: 4.3517, continent: "Europa", flag: "🇧🇪", capital: "Bruselas" },
  { code: "CH", name: "Switzerland", nameEs: "Suiza", latitude: 46.9479, longitude: 7.4474, continent: "Europa", flag: "🇨🇭", capital: "Berna" },
  { code: "AT", name: "Austria", nameEs: "Austria", latitude: 48.2082, longitude: 16.3738, continent: "Europa", flag: "🇦🇹", capital: "Viena" },

  // ASIA
  { code: "CN", name: "China", nameEs: "China", latitude: 39.9042, longitude: 116.4074, continent: "Asia", flag: "🇨🇳", capital: "Pekín" },
  { code: "IN", name: "India", nameEs: "India", latitude: 28.6139, longitude: 77.2090, continent: "Asia", flag: "🇮🇳", capital: "Nueva Delhi" },
  { code: "JP", name: "Japan", nameEs: "Japón", latitude: 35.6762, longitude: 139.6503, continent: "Asia", flag: "🇯🇵", capital: "Tokio" },
  { code: "KR", name: "South Korea", nameEs: "Corea del Sur", latitude: 37.5665, longitude: 126.9780, continent: "Asia", flag: "🇰🇷", capital: "Seúl" },
  { code: "TH", name: "Thailand", nameEs: "Tailandia", latitude: 13.7563, longitude: 100.5018, continent: "Asia", flag: "🇹🇭", capital: "Bangkok" },
  { code: "VN", name: "Vietnam", nameEs: "Vietnam", latitude: 21.0285, longitude: 105.8542, continent: "Asia", flag: "🇻🇳", capital: "Hanói" },
  { code: "ID", name: "Indonesia", nameEs: "Indonesia", latitude: -6.2088, longitude: 106.8456, continent: "Asia", flag: "🇮🇩", capital: "Yakarta" },
  { code: "MY", name: "Malaysia", nameEs: "Malasia", latitude: 3.1390, longitude: 101.6869, continent: "Asia", flag: "🇲🇾", capital: "Kuala Lumpur" },

  // ÁFRICA
  { code: "ZA", name: "South Africa", nameEs: "Sudáfrica", latitude: -25.7479, longitude: 28.2293, continent: "África", flag: "🇿🇦", capital: "Pretoria" },
  { code: "EG", name: "Egypt", nameEs: "Egipto", latitude: 30.0444, longitude: 31.2357, continent: "África", flag: "🇪🇬", capital: "El Cairo" },
  { code: "NG", name: "Nigeria", nameEs: "Nigeria", latitude: 9.0765, longitude: 7.3986, continent: "África", flag: "🇳🇬", capital: "Abuja" },
  { code: "KE", name: "Kenya", nameEs: "Kenia", latitude: -1.2864, longitude: 36.8172, continent: "África", flag: "🇰🇪", capital: "Nairobi" },
  { code: "MA", name: "Morocco", nameEs: "Marruecos", latitude: 33.9716, longitude: -6.8498, continent: "África", flag: "🇲🇦", capital: "Rabat" },
  { code: "ET", name: "Ethiopia", nameEs: "Etiopía", latitude: 9.0320, longitude: 38.7469, continent: "África", flag: "🇪🇹", capital: "Adís Abeba" },

  // OCEANÍA
  { code: "AU", name: "Australia", nameEs: "Australia", latitude: -35.2809, longitude: 149.1300, continent: "Oceanía", flag: "🇦🇺", capital: "Canberra" },
  { code: "NZ", name: "New Zealand", nameEs: "Nueva Zelanda", latitude: -41.2865, longitude: 174.7762, continent: "Oceanía", flag: "🇳🇿", capital: "Wellington" },
  { code: "FJ", name: "Fiji", nameEs: "Fiyi", latitude: -18.1248, longitude: 178.4501, continent: "Oceanía", flag: "🇫🇯", capital: "Suva" },
];

export const CONTINENTS = [
  "América del Sur",
  "América del Norte",
  "América Central",
  "Europa",
  "Asia",
  "África",
  "Oceanía"
];

export function getCountriesByContinent(continent: string): Country[] {
  return COUNTRIES_DATABASE.filter(country => country.continent === continent);
}

export function searchCountries(query: string): Country[] {
  const lowerQuery = query.toLowerCase();
  return COUNTRIES_DATABASE.filter(country => 
    country.nameEs.toLowerCase().includes(lowerQuery) ||
    country.name.toLowerCase().includes(lowerQuery) ||
    country.capital?.toLowerCase().includes(lowerQuery)
  );
}

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES_DATABASE.find(country => country.code === code);
}