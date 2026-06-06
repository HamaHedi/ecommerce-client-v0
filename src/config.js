// Central API base. Override with REACT_APP_API_BASE in .env to point at a
// local backend (e.g. http://localhost:8000) during development.
export const API_BASE =
  process.env.REACT_APP_API_BASE || "https://api.lagha.shop";

// Auth header used by admin / protected requests (token stored at login).
export const authHeaders = () => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  },
});

// Tunisian governorates with delivery fees (DT). Tune as needed.
export const GOVERNORATES = [
  { name: "Tunis", fee: 7 },
  { name: "Ariana", fee: 7 },
  { name: "Ben Arous", fee: 7 },
  { name: "Manouba", fee: 7 },
  { name: "Nabeul", fee: 8 },
  { name: "Zaghouan", fee: 8 },
  { name: "Bizerte", fee: 8 },
  { name: "Béja", fee: 9 },
  { name: "Jendouba", fee: 9 },
  { name: "Le Kef", fee: 9 },
  { name: "Siliana", fee: 9 },
  { name: "Sousse", fee: 8 },
  { name: "Monastir", fee: 8 },
  { name: "Mahdia", fee: 8 },
  { name: "Kairouan", fee: 9 },
  { name: "Kasserine", fee: 10 },
  { name: "Sidi Bouzid", fee: 10 },
  { name: "Sfax", fee: 8 },
  { name: "Gabès", fee: 10 },
  { name: "Médenine", fee: 11 },
  { name: "Tataouine", fee: 12 },
  { name: "Gafsa", fee: 10 },
  { name: "Tozeur", fee: 11 },
  { name: "Kébili", fee: 11 },
];

// Free-shipping threshold (DT). Set to 0 to disable.
export const FREE_SHIPPING_THRESHOLD = 199;
