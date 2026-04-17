export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Cafea' | 'Patiserie' | 'Specialități Reci';
  availableAt: string[];
  imageUrl: string;
}

export let menuProducts: Product[] = [
  {
    id: "prod-1",
    name: "Classic Flat White",
    description: "Espresso dublu combinat perfect cu lapte micro-spumat, având o textură mătăsoasă și un gust echilibrat de ciocolată și nuci prăjite.",
    price: 18,
    category: "Cafea",
    availableAt: ["loc-1", "loc-2", "loc-3"],
    imageUrl: "/images/menu_flat_white.png"
  },
  {
    id: "prod-2",
    name: "Cold Brew Tonic",
    description: "Cafea extrasă la rece timp de 18 ore, amestecată cu apă tonică premium și o felie de portocală deshidratată. Fresh și incredibil de revitalizant.",
    price: 24,
    category: "Specialități Reci",
    availableAt: ["loc-1", "loc-3"],
    imageUrl: "/images/menu_cold_brew.png"
  },
  {
    id: "prod-3",
    name: "Prăjitură Glazurată cu Lămâie",
    description: "Blat umed și pufos de lămâie cu o glazură dulce-acrișoară. Preparată zilnic în mica noastră brutărie artizanală.",
    price: 22,
    category: "Patiserie",
    availableAt: ["loc-2"],
    imageUrl: "/images/menu_lemon_loaf.png"
  },
  {
    id: "prod-4",
    name: "Matcha Latte Rece",
    description: "Pudră de matcha ceremonială mixată manual cu lapte de ovăz și gheață. Un boost de antioxidanți perfect pentru zilele călduroase.",
    price: 26,
    category: "Specialități Reci",
    availableAt: ["loc-1", "loc-2", "loc-3"],
    imageUrl: "/images/menu_matcha_latte.png"
  },
  {
    id: "prod-5",
    name: "V60 Filter Coffee",
    description: "Cafea de origine preparată lent prin metoda V60 manual. Profil aromatic clar, evidențiind notele florale și fructate subtile.",
    price: 20,
    category: "Cafea",
    availableAt: ["loc-3"],
    imageUrl: "/images/menu_filter_coffee.png"
  },
  {
    id: "prod-6",
    name: "Croissant cu Unt",
    description: "Croissant franțuzesc rulat manual, pufos în interior și crocant la exterior, plin de straturi generoase de unt fin.",
    price: 14,
    category: "Patiserie",
    availableAt: ["loc-1", "loc-2"],
    imageUrl: "/images/menu_croissant.png"
  },
  {
    id: "prod-7",
    name: "Espresso Corto",
    description: "O extracție scurtă și intensă a celui mai iubit blend al nostru, caracterizată printr-o cremă groasă și note persistente de ciocolată amară.",
    price: 11,
    category: "Cafea",
    availableAt: ["loc-1", "loc-2", "loc-3"],
    imageUrl: "/images/menu_espresso.png"
  },
  {
    id: "prod-8",
    name: "Iced V60",
    description: "Metoda V60 preparată direct pe pat de gheață japoneză. Păstrează aciditatea vibrantă a boabelor de origine din Etiopia. Extrem de răcoritor.",
    price: 22,
    category: "Specialități Reci",
    availableAt: ["loc-3"],
    imageUrl: "/images/menu_iced_v60.png"
  },
  {
    id: "prod-9",
    name: "Cookie Gourmet cu Matcha",
    description: "Cookie american pufos, copt lent, infuzat cu matcha ceremonială și plin de bucăți mari de ciocolată albă belgiană.",
    price: 16,
    category: "Patiserie",
    availableAt: ["loc-1", "loc-2", "loc-3"],
    imageUrl: "/images/menu_matcha_cookie.png"
  },
  {
    id: "prod-10",
    name: "Cortado",
    description: "Echilibrul perfect: o parte espresso fierbinte, o parte lapte microspumat cu o textură fină. Origine: Spania.",
    price: 14,
    category: "Cafea",
    availableAt: ["loc-1", "loc-2", "loc-3"],
    imageUrl: "/images/menu_cortado.png"
  },
  {
    id: "prod-11",
    name: "Cheesecake Basque",
    description: "Un cheesecake revoluționar, ars la exterior pentru un gust caramelizat și cu un interior incredibil de cremos.",
    price: 28,
    category: "Patiserie",
    availableAt: ["loc-1"],
    imageUrl: "/images/menu_cheesecake.png"
  }
];

export const addLocationToProducts = (locationId: string, productIds: string[]) => {
  menuProducts = menuProducts.map(prod => {
    if (productIds.includes(prod.id) && !prod.availableAt.includes(locationId)) {
      return { ...prod, availableAt: [...prod.availableAt, locationId] };
    }
    return prod;
  });
};

export const addMenuProduct = (name: string, description: string, price: number, category: Product['category'], availableAt: string[]) => {
  let img = "";
  if (category === 'Cafea') {
    img = "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1000&auto=format&fit=crop";
  } else if (category === 'Patiserie') {
    img = "https://images.unsplash.com/photo-1549996647-190b679b33d7?q=80&w=1000&auto=format&fit=crop";
  } else {
    img = "https://images.unsplash.com/photo-1461023058943-07cb128ec809?q=80&w=1000&auto=format&fit=crop";
  }

  const newProd: Product = {
    id: `prod-${Date.now()}`,
    name,
    description,
    price,
    category,
    availableAt,
    imageUrl: img
  };
  menuProducts = [...menuProducts, newProd];
};

export const setProductsForLocation = (locationId: string, activeProductIds: string[]) => {
  menuProducts = menuProducts.map(prod => {
    const isCurrentlyAvailable = prod.availableAt.includes(locationId);
    const shouldBeAvailable = activeProductIds.includes(prod.id);

    if (shouldBeAvailable && !isCurrentlyAvailable) {
      // Add location
      return { ...prod, availableAt: [...prod.availableAt, locationId] };
    } else if (!shouldBeAvailable && isCurrentlyAvailable) {
      // Remove location
      return { ...prod, availableAt: prod.availableAt.filter(id => id !== locationId) };
    }

    return prod;
  });
};
