// Known mountain towns, so the live weather works without any setup. Anything else is looked up by name.
const PLACES = [
  { k: ["spiti", "kaza", "kibber", "langza", "key monastery"], name: "Kaza", lat: 32.2276, lon: 78.0719 },
  { k: ["kasol", "kheerganga", "parvati", "tosh", "malana"], name: "Kasol", lat: 32.0100, lon: 77.3150 },
  { k: ["jibhi", "tirthan", "shoja"], name: "Jibhi", lat: 31.5937, lon: 77.3547 },
  { k: ["manali", "solang", "sissu", "atal", "rohtang"], name: "Manali", lat: 32.2432, lon: 77.1892 },
  { k: ["ladakh", "leh", "nubra", "pangong"], name: "Leh", lat: 34.1526, lon: 77.5771 },
  { k: ["kashmir", "srinagar", "gulmarg", "pahalgam"], name: "Srinagar", lat: 34.0837, lon: 74.7973 },
  { k: ["shimla", "kufri"], name: "Shimla", lat: 31.1048, lon: 77.1734 },
  { k: ["dharamshala", "mcleod", "dalhousie", "khajjiar"], name: "Dharamshala", lat: 32.2190, lon: 76.3234 },
  { k: ["mussoorie", "dhanaulti"], name: "Mussoorie", lat: 30.4598, lon: 78.0664 },
  { k: ["nainital", "bhimtal", "mukteshwar"], name: "Nainital", lat: 29.3919, lon: 79.4542 },
  { k: ["rishikesh", "haridwar"], name: "Rishikesh", lat: 30.0869, lon: 78.2676 },
  { k: ["udaipur"], name: "Udaipur", lat: 24.5854, lon: 73.7125 },
  { k: ["jaipur"], name: "Jaipur", lat: 26.9124, lon: 75.7873 },
  { k: ["jaisalmer"], name: "Jaisalmer", lat: 26.9157, lon: 70.9083 },
  { k: ["goa"], name: "Goa", lat: 15.4909, lon: 73.8278 },
  { k: ["chambal"], name: "Morena", lat: 26.4947, lon: 78.0004 },
  { k: ["kedarnath", "badrinath", "chopta", "auli"], name: "Auli", lat: 30.5284, lon: 79.5654 },
];

export function guessPlace(tour) {
  if (tour?.weatherPlace) {
    const w = tour.weatherPlace.toLowerCase();
    const hit = PLACES.find((p) => p.name.toLowerCase() === w || p.k.includes(w));
    return hit || { name: tour.weatherPlace };
  }
  const hay = `${tour?.title || ""} ${tour?.location || ""} ${tour?.slug || ""}`.toLowerCase();
  return PLACES.find((p) => p.k.some((k) => hay.includes(k))) || (tour?.location ? { name: tour.location.split(",")[0].trim() } : null);
}
