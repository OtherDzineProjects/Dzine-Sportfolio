// Kerala Administrative Hierarchy Data
export const keralaLocationData = {
  "Thiruvananthapuram": {
    corporations: ["Thiruvananthapuram Corporation"],
    municipalities: ["Attingal", "Neyyattinkara", "Varkala"],
    panchayaths: [
      "Aruvikkara", "Athiyannoor", "Balaramapuram", "Chemmaruthi", "Chirayinkeezhu",
      "Kallikode", "Kattakada", "Maranalloor", "Nedumangad", "Pallichal",
      "Parassala", "Perumkadavila", "Thirupuram", "Uzhamalackal", "Venganoor"
    ],
    wards: {
      "Thiruvananthapuram Corporation": Array.from({length: 100}, (_, i) => `Ward ${i + 1}`),
      "Attingal": Array.from({length: 34}, (_, i) => `Ward ${i + 1}`),
      "Neyyattinkara": Array.from({length: 32}, (_, i) => `Ward ${i + 1}`),
      "Varkala": Array.from({length: 30}, (_, i) => `Ward ${i + 1}`)
    }
  },
  "Kollam": {
    corporations: ["Kollam Corporation"],
    municipalities: ["Karunagappally", "Kottarakkara", "Punalur"],
    panchayaths: [
      "Anchal", "Chavara", "Clappana", "Elamad", "Kunnathur",
      "Mayyanad", "Oachira", "Pathanapuram", "Sasthamcotta", "Sooranad"
    ],
    wards: {
      "Kollam Corporation": Array.from({length: 55}, (_, i) => `Ward ${i + 1}`),
      "Karunagappally": Array.from({length: 28}, (_, i) => `Ward ${i + 1}`),
      "Kottarakkara": Array.from({length: 31}, (_, i) => `Ward ${i + 1}`),
      "Punalur": Array.from({length: 33}, (_, i) => `Ward ${i + 1}`)
    }
  },
  "Pathanamthitta": {
    corporations: [],
    municipalities: ["Adoor", "Pandalam", "Pathanamthitta"],
    panchayaths: [
      "Anicad", "Enadimangalam", "Ezhamkulam", "Kadapra", "Konni",
      "Kozhencherry", "Mallappally", "Omallur", "Ranni", "Seethathode"
    ],
    wards: {
      "Adoor": Array.from({length: 23}, (_, i) => `Ward ${i + 1}`),
      "Pandalam": Array.from({length: 22}, (_, i) => `Ward ${i + 1}`),
      "Pathanamthitta": Array.from({length: 34}, (_, i) => `Ward ${i + 1}`)
    }
  },
  "Alappuzha": {
    corporations: [],
    municipalities: ["Alappuzha", "Cherthala", "Kayamkulam"],
    panchayaths: [
      "Arattupuzha", "Bharanikavu", "Budhanoor", "Chengannur", "Harippad",
      "Karuvatta", "Karthikappally", "Kumbakonam", "Mannancherry", "Muttar"
    ],
    wards: {
      "Alappuzha": Array.from({length: 52}, (_, i) => `Ward ${i + 1}`),
      "Cherthala": Array.from({length: 33}, (_, i) => `Ward ${i + 1}`),
      "Kayamkulam": Array.from({length: 31}, (_, i) => `Ward ${i + 1}`)
    }
  },
  "Kottayam": {
    corporations: [],
    municipalities: ["Changanassery", "Kottayam", "Pala"],
    panchayaths: [
      "Ayarkunnam", "Bharananganam", "Chirakkadavu", "Ettumanoor", "Kaduthuruthy",
      "Kanakkary", "Kanjirappally", "Karukachal", "Meenadom", "Vaikom"
    ],
    wards: {
      "Changanassery": Array.from({length: 33}, (_, i) => `Ward ${i + 1}`),
      "Kottayam": Array.from({length: 52}, (_, i) => `Ward ${i + 1}`),
      "Pala": Array.from({length: 27}, (_, i) => `Ward ${i + 1}`)
    }
  },
  "Idukki": {
    corporations: [],
    municipalities: ["Thodupuzha"],
    panchayaths: [
      "Adimaly", "Alackode", "Azhutha", "Devikulam", "Elamdesam",
      "Kattappana", "Kumily", "Munnar", "Nedumkandam", "Udumbanchola"
    ],
    wards: {
      "Thodupuzha": Array.from({length: 30}, (_, i) => `Ward ${i + 1}`)
    }
  },
  "Ernakulam": {
    corporations: ["Kochi Corporation"],
    municipalities: ["Aluva", "Angamaly", "Kalamassery", "Kothamangalam", "Muvattupuzha", "North Parur", "Perumbavur", "Thrippunithura"],
    panchayaths: [
      "Aikaranad", "Chengamanad", "Cheranalloor", "Chottanikkara", "Edathala",
      "Karukutty", "Keezhmad", "Kunnathunadu", "Mudakuzha", "Paipra"
    ],
    wards: {
      "Kochi Corporation": Array.from({length: 74}, (_, i) => `Ward ${i + 1}`),
      "Aluva": Array.from({length: 32}, (_, i) => `Ward ${i + 1}`),
      "Angamaly": Array.from({length: 31}, (_, i) => `Ward ${i + 1}`),
      "Kalamassery": Array.from({length: 32}, (_, i) => `Ward ${i + 1}`),
      "Kothamangalam": Array.from({length: 30}, (_, i) => `Ward ${i + 1}`),
      "Muvattupuzha": Array.from({length: 27}, (_, i) => `Ward ${i + 1}`),
      "North Parur": Array.from({length: 25}, (_, i) => `Ward ${i + 1}`),
      "Perumbavur": Array.from({length: 29}, (_, i) => `Ward ${i + 1}`),
      "Thrippunithura": Array.from({length: 31}, (_, i) => `Ward ${i + 1}`)
    }
  },
  "Thrissur": {
    corporations: ["Thrissur Corporation"],
    municipalities: ["Chalakudy", "Guruvayur", "Irinjalakuda", "Kodungallur"],
    panchayaths: [
      "Adat", "Anthikkad", "Athirappilly", "Chelakkara", "Kondazhy",
      "Kunnamkulam", "Mala", "Ollur", "Peringottuthuruthi", "Wadakkanchery"
    ],
    wards: {
      "Thrissur Corporation": Array.from({length: 52}, (_, i) => `Ward ${i + 1}`),
      "Chalakudy": Array.from({length: 33}, (_, i) => `Ward ${i + 1}`),
      "Guruvayur": Array.from({length: 27}, (_, i) => `Ward ${i + 1}`),
      "Irinjalakuda": Array.from({length: 31}, (_, i) => `Ward ${i + 1}`),
      "Kodungallur": Array.from({length: 36}, (_, i) => `Ward ${i + 1}`)
    }
  },
  "Palakkad": {
    corporations: [],
    municipalities: ["Ottappalam", "Palakkad", "Shoranur"],
    panchayaths: [
      "Agali", "Alathur", "Chittur", "Elavanchery", "Kuzhalmannam",
      "Malampuzha", "Mannarkkad", "Nelliyampathy", "Pattambi", "Sreekrishnapuram"
    ],
    wards: {
      "Ottappalam": Array.from({length: 33}, (_, i) => `Ward ${i + 1}`),
      "Palakkad": Array.from({length: 52}, (_, i) => `Ward ${i + 1}`),
      "Shoranur": Array.from({length: 27}, (_, i) => `Ward ${i + 1}`)
    }
  },
  "Malappuram": {
    corporations: [],
    municipalities: ["Kottakkal", "Malappuram", "Manjeri", "Nilambur", "Perinthalmanna", "Ponnani", "Tanur", "Tirur"],
    panchayaths: [
      "Areekode", "Chelembra", "Edappal", "Kondotty", "Kuruva",
      "Makkaraparamba", "Pandikkad", "Perumpadappu", "Tirurrangadi", "Wandoor"
    ],
    wards: {
      "Kottakkal": Array.from({length: 31}, (_, i) => `Ward ${i + 1}`),
      "Malappuram": Array.from({length: 40}, (_, i) => `Ward ${i + 1}`),
      "Manjeri": Array.from({length: 36}, (_, i) => `Ward ${i + 1}`),
      "Nilambur": Array.from({length: 33}, (_, i) => `Ward ${i + 1}`),
      "Perinthalmanna": Array.from({length: 32}, (_, i) => `Ward ${i + 1}`),
      "Ponnani": Array.from({length: 31}, (_, i) => `Ward ${i + 1}`),
      "Tanur": Array.from({length: 22}, (_, i) => `Ward ${i + 1}`),
      "Tirur": Array.from({length: 31}, (_, i) => `Ward ${i + 1}`)
    }
  },
  "Kozhikode": {
    corporations: ["Kozhikode Corporation"],
    municipalities: ["Koyilandy", "Vadakara"],
    panchayaths: [
      "Balussery", "Chelannur", "Kodenchery", "Kozhikode Rural", "Kunnamangalam",
      "Narippatta", "Omassery", "Panthalayani", "Quilandy", "Thodannur"
    ],
    wards: {
      "Kozhikode Corporation": Array.from({length: 75}, (_, i) => `Ward ${i + 1}`),
      "Koyilandy": Array.from({length: 31}, (_, i) => `Ward ${i + 1}`),
      "Vadakara": Array.from({length: 37}, (_, i) => `Ward ${i + 1}`)
    }
  },
  "Wayanad": {
    corporations: [],
    municipalities: ["Kalpetta", "Mananthavady", "Sulthan Bathery"],
    panchayaths: [
      "Ambalavayal", "Edavaka", "Kalpetta", "Kaniyambetta", "Kappiset",
      "Meenangadi", "Muttil", "Noolpuzha", "Padinharethara", "Vellamunda"
    ],
    wards: {
      "Kalpetta": Array.from({length: 23}, (_, i) => `Ward ${i + 1}`),
      "Mananthavady": Array.from({length: 21}, (_, i) => `Ward ${i + 1}`),
      "Sulthan Bathery": Array.from({length: 27}, (_, i) => `Ward ${i + 1}`)
    }
  },
  "Kannur": {
    corporations: ["Kannur Corporation"],
    municipalities: ["Mattannur", "Taliparamba", "Thalassery"],
    panchayaths: [
      "Aralam", "Cherukunnu", "Chirakkal", "Dharmadam", "Irikkur",
      "Kalliassery", "Kannapuram", "Panniyur", "Peravoor", "Sreekantapuram"
    ],
    wards: {
      "Kannur Corporation": Array.from({length: 35}, (_, i) => `Ward ${i + 1}`),
      "Mattannur": Array.from({length: 27}, (_, i) => `Ward ${i + 1}`),
      "Taliparamba": Array.from({length: 31}, (_, i) => `Ward ${i + 1}`),
      "Thalassery": Array.from({length: 38}, (_, i) => `Ward ${i + 1}`)
    }
  },
  "Kasaragod": {
    corporations: [],
    municipalities: ["Kasaragod", "Kanhangad"],
    panchayaths: [
      "Badiyadka", "Bedaduka", "Cheruvathur", "Kumbla", "Madhur",
      "Mogral Puthur", "Mulleria", "Nileshwar", "Pilicode", "Vellarikundu"
    ],
    wards: {
      "Kasaragod": Array.from({length: 46}, (_, i) => `Ward ${i + 1}`),
      "Kanhangad": Array.from({length: 27}, (_, i) => `Ward ${i + 1}`)
    }
  }
};

export const getLocationsByDistrict = (district: string) => {
  return keralaLocationData[district as keyof typeof keralaLocationData] || {
    corporations: [],
    municipalities: [],
    panchayaths: [],
    wards: {}
  };
};

export const getWardsByLocation = (district: string, location: string) => {
  const districtData = getLocationsByDistrict(district);
  return districtData.wards[location] || [];
};

export const getAllLocalBodies = (district: string) => {
  const data = getLocationsByDistrict(district);
  return [
    ...data.corporations.map(name => ({ name, type: 'Corporation' })),
    ...data.municipalities.map(name => ({ name, type: 'Municipality' })),
    ...data.panchayaths.map(name => ({ name, type: 'Panchayath' }))
  ];
};