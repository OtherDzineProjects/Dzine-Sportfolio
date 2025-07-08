// Kerala Districts and Local Self Government Data
export interface LSGD {
  name: string;
  type: 'Corporation' | 'Municipality' | 'Panchayat';
}

export interface District {
  name: string;
  lsgds: LSGD[];
}

export const KERALA_DISTRICTS: Record<string, District> = {
  thiruvananthapuram: {
    name: "Thiruvananthapuram",
    lsgds: [
      { name: "Thiruvananthapuram Corporation", type: "Corporation" },
      { name: "Attingal Municipality", type: "Municipality" },
      { name: "Varkala Municipality", type: "Municipality" },
      { name: "Neyyattinkara Municipality", type: "Municipality" },
      { name: "Anchuthengu-Kadakkavoor Panchayat", type: "Panchayat" },
      { name: "Aruvikkara Panchayat", type: "Panchayat" },
      { name: "Balaramapuram Panchayat", type: "Panchayat" },
      { name: "Chirayinkeezhu Panchayat", type: "Panchayat" },
      { name: "Kadinamkulam Panchayat", type: "Panchayat" },
      { name: "Kalliyoor Panchayat", type: "Panchayat" },
      { name: "Mangalapuram Panchayat", type: "Panchayat" },
      { name: "Pallichal Panchayat", type: "Panchayat" },
      { name: "Pravachambalam Panchayat", type: "Panchayat" },
      { name: "Venganoor Panchayat", type: "Panchayat" },
      { name: "Vilavoorkkal Panchayat", type: "Panchayat" }
    ]
  },
  kollam: {
    name: "Kollam",
    lsgds: [
      { name: "Kollam Corporation", type: "Corporation" },
      { name: "Paravur Municipality", type: "Municipality" },
      { name: "Karunagappally Municipality", type: "Municipality" },
      { name: "Punalur Municipality", type: "Municipality" },
      { name: "Anchal Panchayat", type: "Panchayat" },
      { name: "Chavara Panchayat", type: "Panchayat" },
      { name: "Chadayamangalam Panchayat", type: "Panchayat" },
      { name: "Ezhukone Panchayat", type: "Panchayat" },
      { name: "Kulakkada Panchayat", type: "Panchayat" },
      { name: "Mayyanad Panchayat", type: "Panchayat" },
      { name: "Oachira Panchayat", type: "Panchayat" },
      { name: "Perayam Panchayat", type: "Panchayat" },
      { name: "Sasthamcotta Panchayat", type: "Panchayat" },
      { name: "Thevalakkara Panchayat", type: "Panchayat" },
      { name: "Thrikkaruva Panchayat", type: "Panchayat" }
    ]
  },
  pathanamthitta: {
    name: "Pathanamthitta",
    lsgds: [
      { name: "Pathanamthitta Municipality", type: "Municipality" },
      { name: "Thiruvalla Municipality", type: "Municipality" },
      { name: "Adoor Municipality", type: "Municipality" },
      { name: "Aranmula Panchayat", type: "Panchayat" },
      { name: "Cherukole Panchayat", type: "Panchayat" },
      { name: "Konni Panchayat", type: "Panchayat" },
      { name: "Kozhencherry Panchayat", type: "Panchayat" },
      { name: "Mallappally Panchayat", type: "Panchayat" },
      { name: "Pandalam Panchayat", type: "Panchayat" },
      { name: "Ranni Panchayat", type: "Panchayat" },
      { name: "Seethathodu Panchayat", type: "Panchayat" },
      { name: "Vadasserikkara Panchayat", type: "Panchayat" }
    ]
  },
  alappuzha: {
    name: "Alappuzha",
    lsgds: [
      { name: "Alappuzha Municipality", type: "Municipality" },
      { name: "Cherthala Municipality", type: "Municipality" },
      { name: "Kayamkulam Municipality", type: "Municipality" },
      { name: "Arattupuzha Panchayat", type: "Panchayat" },
      { name: "Bharanikavu Panchayat", type: "Panchayat" },
      { name: "Budhanoor Panchayat", type: "Panchayat" },
      { name: "Champakulam Panchayat", type: "Panchayat" },
      { name: "Harippad Panchayat", type: "Panchayat" },
      { name: "Kanjikuzhy Panchayat", type: "Panchayat" },
      { name: "Karuvatta Panchayat", type: "Panchayat" },
      { name: "Kumarapuram Panchayat", type: "Panchayat" },
      { name: "Mannancherry Panchayat", type: "Panchayat" },
      { name: "Mararikulam Panchayat", type: "Panchayat" },
      { name: "Muttar Panchayat", type: "Panchayat" },
      { name: "Neelamperoor Panchayat", type: "Panchayat" }
    ]
  },
  kottayam: {
    name: "Kottayam",
    lsgds: [
      { name: "Kottayam Municipality", type: "Municipality" },
      { name: "Changanassery Municipality", type: "Municipality" },
      { name: "Pala Municipality", type: "Municipality" },
      { name: "Ettumanoor Municipality", type: "Municipality" },
      { name: "Ayarkunnam Panchayat", type: "Panchayat" },
      { name: "Chirakkadavu Panchayat", type: "Panchayat" },
      { name: "Erattupetta Panchayat", type: "Panchayat" },
      { name: "Kaduthuruthy Panchayat", type: "Panchayat" },
      { name: "Kanakkary Panchayat", type: "Panchayat" },
      { name: "Karoor Panchayat", type: "Panchayat" },
      { name: "Kuravilangad Panchayat", type: "Panchayat" },
      { name: "Manarcaud Panchayat", type: "Panchayat" },
      { name: "Meenachil Panchayat", type: "Panchayat" },
      { name: "Mundakayam Panchayat", type: "Panchayat" },
      { name: "Teekoy Panchayat", type: "Panchayat" }
    ]
  },
  idukki: {
    name: "Idukki",
    lsgds: [
      { name: "Thodupuzha Municipality", type: "Municipality" },
      { name: "Kattappana Municipality", type: "Municipality" },
      { name: "Adimaly Panchayat", type: "Panchayat" },
      { name: "Arakkulam Panchayat", type: "Panchayat" },
      { name: "Azhutha Panchayat", type: "Panchayat" },
      { name: "Bisonvalley Panchayat", type: "Panchayat" },
      { name: "Devikulam Panchayat", type: "Panchayat" },
      { name: "Edamalakudy Panchayat", type: "Panchayat" },
      { name: "Kanjikkuzhi Panchayat", type: "Panchayat" },
      { name: "Kumily Panchayat", type: "Panchayat" },
      { name: "Mankulam Panchayat", type: "Panchayat" },
      { name: "Munnar Panchayat", type: "Panchayat" },
      { name: "Nedumkandam Panchayat", type: "Panchayat" },
      { name: "Rajakumari Panchayat", type: "Panchayat" },
      { name: "Udumbanchola Panchayat", type: "Panchayat" }
    ]
  },
  ernakulam: {
    name: "Ernakulam",
    lsgds: [
      { name: "Kochi Corporation", type: "Corporation" },
      { name: "Aluva Municipality", type: "Municipality" },
      { name: "Thrikkakara Municipality", type: "Municipality" },
      { name: "Kalamassery Municipality", type: "Municipality" },
      { name: "Angamaly Municipality", type: "Municipality" },
      { name: "Perumbavoor Municipality", type: "Municipality" },
      { name: "Kothamangalam Municipality", type: "Municipality" },
      { name: "Muvattupuzha Municipality", type: "Municipality" },
      { name: "Aikaranad Panchayat", type: "Panchayat" },
      { name: "Chengamanad Panchayat", type: "Panchayat" },
      { name: "Chottanikkara Panchayat", type: "Panchayat" },
      { name: "Edakkattuvayal Panchayat", type: "Panchayat" },
      { name: "Kalloorkkad Panchayat", type: "Panchayat" },
      { name: "Kumbakonam Panchayat", type: "Panchayat" },
      { name: "Malayattoor Panchayat", type: "Panchayat" },
      { name: "Mudakkuzha Panchayat", type: "Panchayat" },
      { name: "Paingottoor Panchayat", type: "Panchayat" },
      { name: "Pallarimangalam Panchayat", type: "Panchayat" },
      { name: "Rayamangalam Panchayat", type: "Panchayat" },
      { name: "Vazhakulam Panchayat", type: "Panchayat" }
    ]
  },
  thrissur: {
    name: "Thrissur",
    lsgds: [
      { name: "Thrissur Corporation", type: "Corporation" },
      { name: "Chalakudy Municipality", type: "Municipality" },
      { name: "Kodungallur Municipality", type: "Municipality" },
      { name: "Irinjalakuda Municipality", type: "Municipality" },
      { name: "Guruvayur Municipality", type: "Municipality" },
      { name: "Kunnamkulam Municipality", type: "Municipality" },
      { name: "Anthikkad Panchayat", type: "Panchayat" },
      { name: "Arimpur Panchayat", type: "Panchayat" },
      { name: "Athirappilly Panchayat", type: "Panchayat" },
      { name: "Chavakkad Panchayat", type: "Panchayat" },
      { name: "Cherpu Panchayat", type: "Panchayat" },
      { name: "Kadukutty Panchayat", type: "Panchayat" },
      { name: "Kondazhy Panchayat", type: "Panchayat" },
      { name: "Kuttayi Panchayat", type: "Panchayat" },
      { name: "Mathilakam Panchayat", type: "Panchayat" },
      { name: "Mullassery Panchayat", type: "Panchayat" },
      { name: "Ollukkara Panchayat", type: "Panchayat" },
      { name: "Pananchery Panchayat", type: "Panchayat" },
      { name: "Puzhakkal Panchayat", type: "Panchayat" },
      { name: "Vellangallur Panchayat", type: "Panchayat" }
    ]
  },
  palakkad: {
    name: "Palakkad",
    lsgds: [
      { name: "Palakkad Municipality", type: "Municipality" },
      { name: "Ottappalam Municipality", type: "Municipality" },
      { name: "Chittur-Thathamangalam Municipality", type: "Municipality" },
      { name: "Shoranur Municipality", type: "Municipality" },
      { name: "Mannarkkad Municipality", type: "Municipality" },
      { name: "Agali Panchayat", type: "Panchayat" },
      { name: "Alathur Panchayat", type: "Panchayat" },
      { name: "Erimayur Panchayat", type: "Panchayat" },
      { name: "Kanhirapuzha Panchayat", type: "Panchayat" },
      { name: "Karimpuzha Panchayat", type: "Panchayat" },
      { name: "Kodumba Panchayat", type: "Panchayat" },
      { name: "Malampuzha Panchayat", type: "Panchayat" },
      { name: "Nattukal Panchayat", type: "Panchayat" },
      { name: "Pudunagaram Panchayat", type: "Panchayat" },
      { name: "Sholayur Panchayat", type: "Panchayat" },
      { name: "Thachanattukara Panchayat", type: "Panchayat" },
      { name: "Vadakkenchery Panchayat", type: "Panchayat" },
      { name: "Vandazhi Panchayat", type: "Panchayat" }
    ]
  },
  malappuram: {
    name: "Malappuram",
    lsgds: [
      { name: "Manjeri Municipality", type: "Municipality" },
      { name: "Perinthalmanna Municipality", type: "Municipality" },
      { name: "Ponnani Municipality", type: "Municipality" },
      { name: "Tirur Municipality", type: "Municipality" },
      { name: "Tanur Municipality", type: "Municipality" },
      { name: "Nilambur Municipality", type: "Municipality" },
      { name: "Kottakkal Municipality", type: "Municipality" },
      { name: "Areekode Panchayat", type: "Panchayat" },
      { name: "Chelembra Panchayat", type: "Panchayat" },
      { name: "Edakkara Panchayat", type: "Panchayat" },
      { name: "Kalikavu Panchayat", type: "Panchayat" },
      { name: "Karulai Panchayat", type: "Panchayat" },
      { name: "Kondotty Panchayat", type: "Panchayat" },
      { name: "Kuzhimanna Panchayat", type: "Panchayat" },
      { name: "Malappuram Panchayat", type: "Panchayat" },
      { name: "Mankada Panchayat", type: "Panchayat" },
      { name: "Marakkara Panchayat", type: "Panchayat" },
      { name: "Pulikkal Panchayat", type: "Panchayat" },
      { name: "Wandoor Panchayat", type: "Panchayat" }
    ]
  },
  kozhikode: {
    name: "Kozhikode",
    lsgds: [
      { name: "Kozhikode Corporation", type: "Corporation" },
      { name: "Vadakara Municipality", type: "Municipality" },
      { name: "Koyilandy Municipality", type: "Municipality" },
      { name: "Feroke Municipality", type: "Municipality" },
      { name: "Beypore Panchayat", type: "Panchayat" },
      { name: "Chemancheri Panchayat", type: "Panchayat" },
      { name: "Chelannur Panchayat", type: "Panchayat" },
      { name: "Kodenchery Panchayat", type: "Panchayat" },
      { name: "Koodaranji Panchayat", type: "Panchayat" },
      { name: "Kuttiadi Panchayat", type: "Panchayat" },
      { name: "Mavoor Panchayat", type: "Panchayat" },
      { name: "Mukkam Panchayat", type: "Panchayat" },
      { name: "Nanmanda Panchayat", type: "Panchayat" },
      { name: "Omassery Panchayat", type: "Panchayat" },
      { name: "Panthalayani Panchayat", type: "Panchayat" },
      { name: "Thikkodi Panchayat", type: "Panchayat" },
      { name: "Thurayur Panchayat", type: "Panchayat" },
      { name: "Unnikulam Panchayat", type: "Panchayat" },
      { name: "Villiappally Panchayat", type: "Panchayat" }
    ]
  },
  wayanad: {
    name: "Wayanad",
    lsgds: [
      { name: "Kalpetta Municipality", type: "Municipality" },
      { name: "Mananthavady Municipality", type: "Municipality" },
      { name: "Sultan Bathery Municipality", type: "Municipality" },
      { name: "Ambalavayal Panchayat", type: "Panchayat" },
      { name: "Edavaka Panchayat", type: "Panchayat" },
      { name: "Kaniyambetta Panchayat", type: "Panchayat" },
      { name: "Kottathara Panchayat", type: "Panchayat" },
      { name: "Krishnagiri Panchayat", type: "Panchayat" },
      { name: "Meenangadi Panchayat", type: "Panchayat" },
      { name: "Mullankolly Panchayat", type: "Panchayat" },
      { name: "Nenmeni Panchayat", type: "Panchayat" },
      { name: "Padinjarethara Panchayat", type: "Panchayat" },
      { name: "Pozhuthana Panchayat", type: "Panchayat" },
      { name: "Pulpally Panchayat", type: "Panchayat" },
      { name: "Sulthan Bathery Panchayat", type: "Panchayat" },
      { name: "Thavinjal Panchayat", type: "Panchayat" },
      { name: "Thirunelly Panchayat", type: "Panchayat" },
      { name: "Vellamunda Panchayat", type: "Panchayat" }
    ]
  },
  kannur: {
    name: "Kannur",
    lsgds: [
      { name: "Kannur Corporation", type: "Corporation" },
      { name: "Thalassery Municipality", type: "Municipality" },
      { name: "Payyanur Municipality", type: "Municipality" },
      { name: "Mattannur Municipality", type: "Municipality" },
      { name: "Anthoor Municipality", type: "Municipality" },
      { name: "Azhikode Panchayat", type: "Panchayat" },
      { name: "Cherukunnu Panchayat", type: "Panchayat" },
      { name: "Chirakkal Panchayat", type: "Panchayat" },
      { name: "Dharmadam Panchayat", type: "Panchayat" },
      { name: "Iritty Panchayat", type: "Panchayat" },
      { name: "Koodali Panchayat", type: "Panchayat" },
      { name: "Kuthuparamba Panchayat", type: "Panchayat" },
      { name: "Mahe Panchayat", type: "Panchayat" },
      { name: "Panoor Panchayat", type: "Panchayat" },
      { name: "Peravoor Panchayat", type: "Panchayat" },
      { name: "Sreekandapuram Panchayat", type: "Panchayat" },
      { name: "Thaliparamba Panchayat", type: "Panchayat" },
      { name: "Ulikkal Panchayat", type: "Panchayat" }
    ]
  },
  kasaragod: {
    name: "Kasaragod",
    lsgds: [
      { name: "Kasaragod Municipality", type: "Municipality" },
      { name: "Kanhangad Municipality", type: "Municipality" },
      { name: "Nileshwar Municipality", type: "Municipality" },
      { name: "Adkathbail Panchayat", type: "Panchayat" },
      { name: "Bellur Panchayat", type: "Panchayat" },
      { name: "Chemnad Panchayat", type: "Panchayat" },
      { name: "Delampady Panchayat", type: "Panchayat" },
      { name: "Karadka Panchayat", type: "Panchayat" },
      { name: "Kumbdaje Panchayat", type: "Panchayat" },
      { name: "Madhur Panchayat", type: "Panchayat" },
      { name: "Mogral Puthur Panchayat", type: "Panchayat" },
      { name: "Pallikkara Panchayat", type: "Panchayat" },
      { name: "Paivalike Panchayat", type: "Panchayat" },
      { name: "Pilicode Panchayat", type: "Panchayat" },
      { name: "Rajapuram Panchayat", type: "Panchayat" },
      { name: "Trikaripur Panchayat", type: "Panchayat" },
      { name: "Vorkady Panchayat", type: "Panchayat" }
    ]
  }
};

export const getDistrictOptions = (): { value: string; label: string }[] => {
  return Object.entries(KERALA_DISTRICTS).map(([key, district]) => ({
    value: key,
    label: district.name
  }));
};

export const getLSGDOptions = (districtKey: string): { value: string; label: string; type: string }[] => {
  const district = KERALA_DISTRICTS[districtKey];
  if (!district) return [];
  
  return district.lsgds.map(lsgd => ({
    value: lsgd.name,
    label: lsgd.name,
    type: lsgd.type
  }));
};