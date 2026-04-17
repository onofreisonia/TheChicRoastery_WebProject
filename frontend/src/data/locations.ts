export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
}

export interface LocationItem {
  id: string;
  name: string;
  addr: string;
  img: string;
  images: string[];
  lat: number;
  lng: number;
  description: string;
  isOpen: boolean;
  schedule?: string;
  reviews: Review[];
}

export let locations: LocationItem[] = [
  { 
    id: "loc-1",
    name: "The Chic Downtown", 
    addr: "Str. Lipscani 12, București", 
    img: "/images/chic_downtown_1.png",
    images: [
      "/images/chic_downtown_1.png",
      "/images/chic_downtown_2.png",
      "/images/chic_downtown_3.png"
    ],
    lat: 44.4316,
    lng: 26.0995,
    description: "Inima orașului, unde cafeaua artizanală întâlnește arhitectura clasică. O oază de liniște urbană perfectă pentru întâlniri de afaceri sau relaxare. Gustul proaspăt prăjit îți va oferi energia necesară pentru a explora centrul vechi.",
    isOpen: true,
    reviews: [
      { id: "r11", author: "Alexandru M.", rating: 5, text: "Un espresso tonic perfect. Atmosfera este fabuloasă pentru lucrat pe laptop dimineața." },
      { id: "r12", author: "Maria V.", rating: 4, text: "Design interior extrem de elegant. Cafeaua de nota 10, dar uneori e un pic aglomerat la prânz." }
    ]
  },
  { 
    id: "loc-2",
    name: "Roastery Herăstrău", 
    addr: "Șos. Nordului 7, București", 
    img: "/images/roastery_herastrau_1.png",
    images: [
      "/images/roastery_herastrau_1.png",
      "/images/roastery_herastrau_2.png",
      "/images/roastery_herastrau_3.png"
    ],
    lat: 44.4754,
    lng: 26.0827,
    description: "Prăjitoria noastră unde magia se întâmplă chiar sub ochii tăi. Spațiu industrial chic, miros de boabe proaspăt prăjite și verdeața parcului chiar peste drum. Excelent în diminețile de weekend.",
    isOpen: true,
    reviews: [
      { id: "r21", author: "Ion G.", rating: 5, text: "Poți simți mirosul boabelor proaspăt prăjite de afară. Recomand prăjiturile cu lămâie!" },
      { id: "r22", author: "Sara T.", rating: 5, text: "Un colț de liniște deosebit pentru a te relaxa după o tură prin parcul Herăstrău." }
    ]
  },
  { 
    id: "loc-3",
    name: "Minimalist Floreasca", 
    addr: "Calea Floreasca 169, București", 
    img: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=2070&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop"
    ],
    lat: 44.4646,
    lng: 26.1037,
    description: "Design curat, scandinav și cafea preparată la rece. Locul preferat de freelanceri pentru productivitate maximă și networking organic.",
    isOpen: false,
    reviews: [
      { id: "r31", author: "Daniela L.", rating: 4, text: "Aesthetics-ul locației este divin. M-aș muta aici dacă aș putea! Flat white excelent." },
      { id: "r32", author: "Cristi C.", rating: 3, text: "Sistemul lor cold-brew e fantastic, doar că era cam frig ultima dată." }
    ]
  }
];

export const getLocations = () => locations;

export const addLocation = (name: string, addr: string, schedule: string, description: string, lat: number, lng: number) => {
  const newLocId = `loc-${Date.now()}`;
  const newLoc: LocationItem = {
    id: newLocId,
    name,
    addr,
    img: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=2069&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=2069&auto=format&fit=crop"],
    lat,
    lng,
    description,
    schedule: schedule || "Luni - Duminică: 08:00 - 20:00",
    isOpen: true,
    reviews: []
  };
  locations = [...locations, newLoc];
  return { locations, newLocId };
};

export const addReviewToLocation = (locationId: string, review: Omit<Review, 'id'>) => {
  const locIndex = locations.findIndex(l => l.id === locationId);
  if (locIndex !== -1) {
    const newReview = { ...review, id: `rev-${Date.now()}` };
    locations[locIndex] = {
      ...locations[locIndex],
      reviews: [newReview, ...locations[locIndex].reviews]
    };
  }
};

export const updateLocation = (id: string, updates: Partial<LocationItem>) => {
  locations = locations.map(loc => 
    loc.id === id ? { ...loc, ...updates } : loc
  );
};

export const deleteLocation = (id: string) => {
  locations = locations.filter(loc => loc.id !== id);
};

export const deleteReviewFromLocation = (locationId: string, reviewId: string) => {
  locations = locations.map(loc => {
    if (loc.id === locationId) {
      return {
        ...loc,
        reviews: loc.reviews.filter(r => r.id !== reviewId)
      };
    }
    return loc;
  });
};
