export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'pronoun' | 'conjunction' | 'article' | 'numeral';

export interface Word {
  id: number;
  spanish: string;
  english: string;
  pos: PartOfSpeech;
  example: string;
  phonetic: string;
  tier: 1 | 2 | 3 | 4;
  category: string;
  subcategory: string;
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  estTime: number;
  subcategories: SubCategory[];
}

export const POS_COLORS: Record<PartOfSpeech, string> = {
  noun: '#60a5fa',
  verb: '#4ade80',
  adjective: '#c084fc',
  adverb: '#facc15',
  preposition: '#06b6d4',
  pronoun: '#818cf8',
  conjunction: '#2dd4bf',
  article: '#94a3b8',
  numeral: '#a78bfa',
};

export const categories: Category[] = [
  { id: "pronouns", name: "Pronouns", emoji: "🗣️", estTime: 1, subcategories: [
    { id: "personal", name: "Personal" },
    { id: "object", name: "Object & Reflexive" },
    { id: "demonstrative", name: "Demonstrative & Other" },
  ]},
  { id: "articles", name: "Articles & Basics", emoji: "📝", estTime: 2, subcategories: [
    { id: "articles-det", name: "Articles & Determiners" },
    { id: "prepositions", name: "Prepositions" },
    { id: "conjunctions", name: "Conjunctions" },
    { id: "adverbs-basic", name: "Common Adverbs" },
  ]},
  { id: "verbs", name: "Common Verbs", emoji: "🏃", estTime: 3, subcategories: [
    { id: "movement", name: "Movement" },
    { id: "communication", name: "Communication" },
    { id: "mental", name: "Mental" },
    { id: "daily-actions", name: "Daily Actions" },
  ]},
  { id: "food", name: "Food & Drink", emoji: "🍔", estTime: 2, subcategories: [
    { id: "fruits", name: "Fruits" },
    { id: "meats", name: "Meats" },
    { id: "drinks", name: "Drinks" },
    { id: "meals", name: "Meals & Staples" },
    { id: "dairy", name: "Dairy & Condiments" },
    { id: "sweets", name: "Sweets" },
  ]},
  { id: "family", name: "Family & People", emoji: "👨‍👩‍👧", estTime: 2, subcategories: [
    { id: "immediate", name: "Immediate Family" },
    { id: "extended", name: "Extended Family" },
    { id: "relationships", name: "Relationships & People" },
  ]},
  { id: "house", name: "House & Rooms", emoji: "🏠", estTime: 1, subcategories: [
    { id: "rooms", name: "Rooms" },
    { id: "furniture", name: "Furniture" },
    { id: "structure", name: "Parts of House" },
  ]},
  { id: "clothes", name: "Clothes", emoji: "👕", estTime: 1, subcategories: [
    { id: "upper", name: "Upper Body" },
    { id: "lower", name: "Lower Body" },
    { id: "footwear", name: "Footwear" },
    { id: "accessories", name: "Accessories" },
  ]},
  { id: "colors", name: "Colors", emoji: "🎨", estTime: 1, subcategories: [
    { id: "basic-colors", name: "Basic Colors" },
    { id: "warm-colors", name: "Warm Colors" },
    { id: "cool-colors", name: "Cool Colors" },
  ]},
  { id: "nature", name: "Nature", emoji: "🌍", estTime: 2, subcategories: [
    { id: "land", name: "Land" },
    { id: "sky", name: "Sky" },
    { id: "water", name: "Water" },
    { id: "plants", name: "Plants" },
  ]},
  { id: "body", name: "Body", emoji: "🧍", estTime: 1, subcategories: [
    { id: "head", name: "Head" },
    { id: "upper-body", name: "Upper Body" },
    { id: "lower-body", name: "Lower Body" },
    { id: "internal", name: "Internal" },
  ]},
  { id: "adjectives", name: "Adjectives", emoji: "📏", estTime: 2, subcategories: [
    { id: "size", name: "Size & Quantity" },
    { id: "speed", name: "Speed & Quality" },
    { id: "appearance", name: "Appearance" },
    { id: "emotion", name: "Emotion & Difficulty" },
  ]},
  { id: "numbers", name: "Numbers & Time", emoji: "🔢", estTime: 2, subcategories: [
    { id: "numbers-num", name: "Numbers" },
    { id: "days", name: "Days of the Week" },
    { id: "time-words", name: "Time Words" },
    { id: "time-of-day", name: "Time of Day" },
  ]},
  { id: "school", name: "School & Learning", emoji: "🏫", estTime: 2, subcategories: [
    { id: "places", name: "Places" },
    { id: "supplies", name: "Supplies" },
    { id: "people-school", name: "People" },
    { id: "concepts", name: "Concepts" },
  ]},
  { id: "daily", name: "Daily Life", emoji: "💰", estTime: 1, subcategories: [
    { id: "places-daily", name: "Places" },
    { id: "technology", name: "Technology" },
    { id: "transportation", name: "Transportation" },
    { id: "objects", name: "Objects & Abstract" },
  ]},
  { id: "actions", name: "Actions & Activities", emoji: "🎵", estTime: 2, subcategories: [
    { id: "physical", name: "Physical" },
    { id: "creative", name: "Creative" },
    { id: "commerce", name: "Commerce & Practical" },
  ]},
];

let _id = 0;
const w = (spanish: string, english: string, pos: PartOfSpeech, example: string, phonetic: string, tier: 1|2|3|4, category: string, subcategory: string): Word => ({
  id: ++_id, spanish, english, pos, example, phonetic, tier, category, subcategory
});

export const vocabulary: Word[] = [
  // ── PRONOUNS ──
  // Personal
  w("yo", "I", "pronoun", "Yo quiero ir.", "yoh", 1, "pronouns", "personal"),
  w("tú", "you (informal)", "pronoun", "Tú eres mi amigo.", "too", 1, "pronouns", "personal"),
  w("él", "he / him", "pronoun", "Él es mi hermano.", "ehl", 1, "pronouns", "personal"),
  w("ella", "she / her", "pronoun", "Ella es doctora.", "EH-yah", 1, "pronouns", "personal"),
  w("nosotros", "we", "pronoun", "Nosotros vamos.", "noh-SOH-trohs", 2, "pronouns", "personal"),
  w("ellos", "they (m)", "pronoun", "Ellos están aquí.", "EH-yohs", 2, "pronouns", "personal"),
  w("ellas", "they (f)", "pronoun", "Ellas cantan bien.", "EH-yahs", 2, "pronouns", "personal"),
  w("usted", "you (formal)", "pronoun", "¿Cómo está usted?", "oos-TEHD", 2, "pronouns", "personal"),
  // Object & Reflexive
  w("me", "me / myself", "pronoun", "Me gusta.", "meh", 1, "pronouns", "object"),
  w("se", "oneself", "pronoun", "Se llama Juan.", "seh", 1, "pronouns", "object"),
  w("le", "him/her (indirect)", "pronoun", "Le doy el libro.", "leh", 1, "pronouns", "object"),
  w("lo", "it/him (direct)", "pronoun", "Lo sé.", "loh", 1, "pronouns", "object"),
  w("su", "his/her/your", "pronoun", "Su casa es bonita.", "soo", 1, "pronouns", "object"),
  // Demonstrative & Other
  w("todo", "all / everything", "pronoun", "Todo está bien.", "TOH-doh", 1, "pronouns", "demonstrative"),
  w("este", "this (m)", "pronoun", "Este libro es mío.", "EHS-teh", 1, "pronouns", "demonstrative"),
  w("ese", "that (m)", "pronoun", "Ese es mi amigo.", "EH-seh", 1, "pronouns", "demonstrative"),

  // ── ARTICLES & BASICS ──
  // Articles & Determiners
  w("el", "the (m)", "article", "El gato es negro.", "el", 1, "articles", "articles-det"),
  w("la", "the (f)", "article", "La casa es grande.", "lah", 1, "articles", "articles-det"),
  w("un", "a / an (m)", "article", "Un libro nuevo.", "oon", 1, "articles", "articles-det"),
  // Prepositions
  w("de", "of / from", "preposition", "Soy de México.", "deh", 1, "articles", "prepositions"),
  w("en", "in / on", "preposition", "Estoy en casa.", "en", 1, "articles", "prepositions"),
  w("por", "for / by", "preposition", "Gracias por todo.", "pohr", 1, "articles", "prepositions"),
  w("con", "with", "preposition", "Café con leche.", "kohn", 1, "articles", "prepositions"),
  w("para", "for / in order to", "preposition", "Es para ti.", "PAH-rah", 1, "articles", "prepositions"),
  w("sin", "without", "preposition", "Sin azúcar.", "seen", 1, "articles", "prepositions"),
  w("entre", "between / among", "preposition", "Entre tú y yo.", "EHN-treh", 2, "articles", "prepositions"),
  // Conjunctions
  w("y", "and", "conjunction", "Tú y yo.", "ee", 1, "articles", "conjunctions"),
  w("o", "or", "conjunction", "¿Sí o no?", "oh", 1, "articles", "conjunctions"),
  w("que", "that / which", "conjunction", "Creo que sí.", "keh", 1, "articles", "conjunctions"),
  w("pero", "but", "conjunction", "Quiero, pero no puedo.", "PEH-roh", 1, "articles", "conjunctions"),
  w("porque", "because", "conjunction", "Porque te quiero.", "pohr-KEH", 1, "articles", "conjunctions"),
  w("si", "if / yes", "conjunction", "Si quieres, ven.", "see", 1, "articles", "conjunctions"),
  w("cuando", "when", "conjunction", "Cuando llueve.", "KWAHN-doh", 1, "articles", "conjunctions"),
  // Common Adverbs
  w("no", "no / not", "adverb", "No quiero.", "noh", 1, "articles", "adverbs-basic"),
  w("como", "like / as / how", "adverb", "¿Cómo estás?", "KOH-moh", 1, "articles", "adverbs-basic"),
  w("más", "more / most", "adverb", "Quiero más agua.", "mahs", 1, "articles", "adverbs-basic"),
  w("muy", "very", "adverb", "Muy bueno.", "mooy", 1, "articles", "adverbs-basic"),
  w("ya", "already / now", "adverb", "Ya lo sé.", "yah", 1, "articles", "adverbs-basic"),
  w("también", "also / too", "adverb", "Yo también.", "tahm-bee-EHN", 2, "articles", "adverbs-basic"),
  w("bien", "well / good", "adverb", "Estoy bien.", "bee-EHN", 1, "articles", "adverbs-basic"),
  w("así", "like this / so", "adverb", "Así es.", "ah-SEE", 1, "articles", "adverbs-basic"),
  w("donde", "where", "adverb", "¿Dónde vives?", "DOHN-deh", 2, "articles", "adverbs-basic"),
  w("menos", "less / minus", "adverb", "Más o menos.", "MEH-nohs", 2, "articles", "adverbs-basic"),
  w("después", "after / later", "adverb", "Después de comer.", "dehs-PWEHS", 2, "articles", "adverbs-basic"),
  w("gracias", "thank you", "noun", "Muchas gracias.", "GRAH-see-ahs", 4, "articles", "adverbs-basic"),

  // ── COMMON VERBS ──
  // Movement
  w("ir", "to go", "verb", "Voy a la escuela.", "eer", 1, "verbs", "movement"),
  w("llegar", "to arrive", "verb", "Voy a llegar tarde.", "yeh-GAHR", 2, "verbs", "movement"),
  w("salir", "to leave / go out", "verb", "Voy a salir.", "sah-LEER", 2, "verbs", "movement"),
  w("volver", "to return", "verb", "Voy a volver.", "bohl-BEHR", 2, "verbs", "movement"),
  w("llevar", "to carry / wear", "verb", "Llevo una camisa.", "yeh-BAHR", 2, "verbs", "movement"),
  w("seguir", "to follow / continue", "verb", "Sigue adelante.", "seh-GEER", 3, "verbs", "movement"),
  // Communication
  w("decir", "to say / to tell", "verb", "¿Qué dices?", "deh-SEER", 1, "verbs", "communication"),
  w("hablar", "to speak / talk", "verb", "Hablo español.", "ah-BLAHR", 2, "verbs", "communication"),
  w("llamar", "to call", "verb", "Te voy a llamar.", "yah-MAHR", 3, "verbs", "communication"),
  w("contar", "to count / tell", "verb", "Cuéntame todo.", "kohn-TAHR", 3, "verbs", "communication"),
  w("escribir", "to write", "verb", "Voy a escribir.", "ehs-kree-BEER", 2, "verbs", "communication"),
  w("leer", "to read", "verb", "Me gusta leer.", "leh-EHR", 2, "verbs", "communication"),
  // Mental
  w("ser", "to be (permanent)", "verb", "Yo soy estudiante.", "sehr", 1, "verbs", "mental"),
  w("estar", "to be (temporary)", "verb", "Estoy bien.", "ehs-TAHR", 1, "verbs", "mental"),
  w("poder", "to be able to", "verb", "Puedo hacerlo.", "poh-DEHR", 1, "verbs", "mental"),
  w("saber", "to know (facts)", "verb", "Sé la respuesta.", "sah-BEHR", 1, "verbs", "mental"),
  w("querer", "to want / to love", "verb", "Te quiero mucho.", "keh-REHR", 2, "verbs", "mental"),
  w("pensar", "to think", "verb", "Pienso en ti.", "pehn-SAHR", 2, "verbs", "mental"),
  w("conocer", "to know (people)", "verb", "¿La conoces?", "koh-noh-SEHR", 2, "verbs", "mental"),
  w("sentir", "to feel", "verb", "Me siento bien.", "sehn-TEER", 2, "verbs", "mental"),
  w("parecer", "to seem", "verb", "Parece fácil.", "pah-reh-SEHR", 2, "verbs", "mental"),
  w("creer", "to believe", "verb", "Creo que sí.", "kreh-EHR", 3, "verbs", "mental"),
  w("entender", "to understand", "verb", "No entiendo.", "ehn-tehn-DEHR", 3, "verbs", "mental"),
  w("esperar", "to wait / hope", "verb", "Espera un momento.", "ehs-peh-RAHR", 3, "verbs", "mental"),
  // Daily Actions
  w("tener", "to have", "verb", "Tengo hambre.", "teh-NEHR", 1, "verbs", "daily-actions"),
  w("hacer", "to do / to make", "verb", "¿Qué haces?", "ah-SEHR", 1, "verbs", "daily-actions"),
  w("haber", "to have (aux)", "verb", "He comido.", "ah-BEHR", 1, "verbs", "daily-actions"),
  w("ver", "to see", "verb", "Puedo ver el mar.", "behr", 1, "verbs", "daily-actions"),
  w("dar", "to give", "verb", "Dame agua.", "dahr", 1, "verbs", "daily-actions"),
  w("tomar", "to take / drink", "verb", "Tomar un café.", "toh-MAHR", 2, "verbs", "daily-actions"),
  w("encontrar", "to find", "verb", "No puedo encontrar.", "ehn-kohn-TRAHR", 2, "verbs", "daily-actions"),
  w("crear", "to create", "verb", "Voy a crear algo.", "kreh-AHR", 2, "verbs", "daily-actions"),
  w("vivir", "to live", "verb", "Vivo en España.", "bee-BEER", 2, "verbs", "daily-actions"),
  w("comer", "to eat", "verb", "Quiero comer.", "koh-MEHR", 2, "verbs", "daily-actions"),
  w("poner", "to put / place", "verb", "Pon aquí.", "poh-NEHR", 3, "verbs", "daily-actions"),
  w("empezar", "to begin / start", "verb", "Vamos a empezar.", "ehm-peh-SAHR", 3, "verbs", "daily-actions"),

  // ── FOOD & DRINK ──
  // Fruits
  w("fruta", "fruit", "noun", "Fruta fresca.", "FROO-tah", 3, "food", "fruits"),
  w("manzana", "apple", "noun", "Una manzana roja.", "mahn-SAH-nah", 3, "food", "fruits"),
  // Meats
  w("carne", "meat", "noun", "La carne está lista.", "KAHR-neh", 3, "food", "meats"),
  w("pollo", "chicken", "noun", "Pollo con arroz.", "POH-yoh", 3, "food", "meats"),
  w("pescado", "fish", "noun", "Me gusta el pescado.", "pehs-KAH-doh", 3, "food", "meats"),
  // Drinks
  w("agua", "water", "noun", "Quiero agua fría.", "AH-gwah", 2, "food", "drinks"),
  w("cerveza", "beer", "noun", "Una cerveza fría.", "sehr-BEH-sah", 3, "food", "drinks"),
  w("jugo", "juice", "noun", "Jugo de naranja.", "HOO-goh", 3, "food", "drinks"),
  w("café", "coffee", "noun", "Un café caliente.", "kah-FEH", 3, "food", "drinks"),
  w("leche", "milk", "noun", "Un vaso de leche.", "LEH-cheh", 3, "food", "drinks"),
  // Meals & Staples
  w("comida", "food / meal", "noun", "La comida está rica.", "koh-MEE-dah", 3, "food", "meals"),
  w("pan", "bread", "noun", "Quiero pan fresco.", "pahn", 3, "food", "meals"),
  w("arroz", "rice", "noun", "Arroz con frijoles.", "ah-RROHS", 3, "food", "meals"),
  w("ensalada", "salad", "noun", "Una ensalada verde.", "ehn-sah-LAH-dah", 3, "food", "meals"),
  w("sopa", "soup", "noun", "Sopa caliente.", "SOH-pah", 3, "food", "meals"),
  w("hamburguesa", "hamburger", "noun", "Una hamburguesa grande.", "ahm-boor-GEH-sah", 3, "food", "meals"),
  w("huevo", "egg", "noun", "Huevos fritos.", "WEH-boh", 3, "food", "meals"),
  // Dairy & Condiments
  w("queso", "cheese", "noun", "Queso con pan.", "KEH-soh", 3, "food", "dairy"),
  w("sal", "salt", "noun", "Pásame la sal.", "sahl", 3, "food", "dairy"),
  w("azúcar", "sugar", "noun", "Sin azúcar.", "ah-SOO-kahr", 3, "food", "dairy"),
  // Sweets
  w("postre", "dessert", "noun", "¿Quieres postre?", "POHS-treh", 3, "food", "sweets"),
  w("helado", "ice cream", "noun", "Helado de chocolate.", "eh-LAH-doh", 3, "food", "sweets"),

  // ── FAMILY & PEOPLE ──
  // Immediate
  w("padre", "father", "noun", "Mi padre cocina.", "PAH-dreh", 3, "family", "immediate"),
  w("madre", "mother", "noun", "Mi madre canta.", "MAH-dreh", 3, "family", "immediate"),
  w("hermano", "brother", "noun", "Mi hermano mayor.", "ehr-MAH-noh", 3, "family", "immediate"),
  w("hermana", "sister", "noun", "Mi hermana menor.", "ehr-MAH-nah", 3, "family", "immediate"),
  w("hijo", "son / child", "noun", "Mi hijo es joven.", "EE-hoh", 2, "family", "immediate"),
  w("hija", "daughter", "noun", "Mi hija estudia.", "EE-hah", 3, "family", "immediate"),
  // Extended
  w("abuelo", "grandfather", "noun", "Mi abuelo es sabio.", "ah-BWEH-loh", 3, "family", "extended"),
  w("abuela", "grandmother", "noun", "Mi abuela cocina.", "ah-BWEH-lah", 3, "family", "extended"),
  w("tío", "uncle", "noun", "Mi tío vive lejos.", "TEE-oh", 3, "family", "extended"),
  w("tía", "aunt", "noun", "Mi tía es doctora.", "TEE-ah", 3, "family", "extended"),
  w("primo", "cousin", "noun", "Mi primo juega fútbol.", "PREE-moh", 3, "family", "extended"),
  // Relationships & People
  w("mujer", "woman", "noun", "La mujer fuerte.", "moo-HEHR", 2, "family", "relationships"),
  w("hombre", "man", "noun", "El hombre alto.", "OHM-breh", 2, "family", "relationships"),
  w("amigo", "friend", "noun", "Mi mejor amigo.", "ah-MEE-goh", 2, "family", "relationships"),
  w("niño", "boy / child", "noun", "El niño juega.", "NEE-nyoh", 2, "family", "relationships"),
  w("familia", "family", "noun", "Mi familia es grande.", "fah-MEE-lee-ah", 2, "family", "relationships"),
  w("bebé", "baby", "noun", "El bebé duerme.", "beh-BEH", 3, "family", "relationships"),

  // ── HOUSE & ROOMS ──
  // Rooms
  w("casa", "house", "noun", "Mi casa es tu casa.", "KAH-sah", 2, "house", "rooms"),
  w("cocina", "kitchen", "noun", "Cocino en la cocina.", "koh-SEE-nah", 4, "house", "rooms"),
  w("baño", "bathroom", "noun", "¿Dónde está el baño?", "BAH-nyoh", 4, "house", "rooms"),
  w("sala", "living room", "noun", "Estamos en la sala.", "SAH-lah", 4, "house", "rooms"),
  w("jardín", "garden", "noun", "El jardín tiene flores.", "hahr-DEEN", 4, "house", "rooms"),
  // Furniture
  w("mesa", "table", "noun", "En la mesa.", "MEH-sah", 3, "house", "furniture"),
  w("silla", "chair", "noun", "Siéntate en la silla.", "SEE-yah", 4, "house", "furniture"),
  w("cama", "bed", "noun", "Voy a la cama.", "KAH-mah", 4, "house", "furniture"),
  // Parts of House
  w("puerta", "door", "noun", "Abre la puerta.", "PWEHR-tah", 3, "house", "structure"),
  w("ventana", "window", "noun", "Abre la ventana.", "behn-TAH-nah", 4, "house", "structure"),
  w("techo", "roof / ceiling", "noun", "El techo es alto.", "TEH-choh", 4, "house", "structure"),
  w("piso", "floor / apartment", "noun", "El piso está limpio.", "PEE-soh", 4, "house", "structure"),
  w("escalera", "stairs", "noun", "Sube la escalera.", "ehs-kah-LEH-rah", 4, "house", "structure"),
  w("pared", "wall", "noun", "La pared es blanca.", "pah-REHD", 4, "house", "structure"),

  // ── CLOTHES ──
  // Upper Body
  w("camisa", "shirt", "noun", "Una camisa azul.", "kah-MEE-sah", 4, "clothes", "upper"),
  w("chaqueta", "jacket", "noun", "Ponte la chaqueta.", "chah-KEH-tah", 4, "clothes", "upper"),
  w("vestido", "dress", "noun", "Un vestido bonito.", "behs-TEE-doh", 4, "clothes", "upper"),
  w("ropa", "clothes", "noun", "La ropa limpia.", "RROH-pah", 4, "clothes", "upper"),
  // Lower Body
  w("pantalón", "pants", "noun", "Un pantalón negro.", "pahn-tah-LOHN", 4, "clothes", "lower"),
  w("falda", "skirt", "noun", "Una falda corta.", "FAHL-dah", 4, "clothes", "lower"),
  // Footwear
  w("zapato", "shoe", "noun", "Mis zapatos nuevos.", "sah-PAH-toh", 4, "clothes", "footwear"),
  w("calcetín", "sock", "noun", "Un calcetín rojo.", "kahl-seh-TEEN", 4, "clothes", "footwear"),
  // Accessories
  w("sombrero", "hat", "noun", "Un sombrero grande.", "sohm-BREH-roh", 4, "clothes", "accessories"),
  w("bufanda", "scarf", "noun", "Una bufanda de lana.", "boo-FAHN-dah", 4, "clothes", "accessories"),

  // ── COLORS ──
  // Basic Colors
  w("blanco", "white", "adjective", "El gato blanco.", "BLAHN-koh", 4, "colors", "basic-colors"),
  w("negro", "black", "adjective", "El perro negro.", "NEH-groh", 4, "colors", "basic-colors"),
  w("gris", "gray", "adjective", "El cielo gris.", "grees", 4, "colors", "basic-colors"),
  w("marrón", "brown", "adjective", "Zapatos marrones.", "mah-RROHN", 4, "colors", "basic-colors"),
  // Warm Colors
  w("rojo", "red", "adjective", "La manzana roja.", "RROH-hoh", 4, "colors", "warm-colors"),
  w("naranja", "orange", "adjective", "Una flor naranja.", "nah-RAHN-hah", 4, "colors", "warm-colors"),
  w("amarillo", "yellow", "adjective", "El sol amarillo.", "ah-mah-REE-yoh", 4, "colors", "warm-colors"),
  w("rosa", "pink", "adjective", "La flor rosa.", "RROH-sah", 4, "colors", "warm-colors"),
  // Cool Colors
  w("azul", "blue", "adjective", "El cielo azul.", "ah-SOOL", 4, "colors", "cool-colors"),
  w("verde", "green", "adjective", "La hoja verde.", "BEHR-deh", 4, "colors", "cool-colors"),
  w("morado", "purple", "adjective", "Un vestido morado.", "moh-RAH-doh", 4, "colors", "cool-colors"),

  // ── NATURE ──
  // Land
  w("tierra", "earth / land", "noun", "La tierra fértil.", "tee-EH-rrah", 4, "nature", "land"),
  w("montaña", "mountain", "noun", "La montaña alta.", "mohn-TAH-nyah", 4, "nature", "land"),
  w("bosque", "forest", "noun", "El bosque oscuro.", "BOHS-keh", 4, "nature", "land"),
  w("playa", "beach", "noun", "Vamos a la playa.", "PLAH-yah", 4, "nature", "land"),
  // Sky
  w("cielo", "sky / heaven", "noun", "El cielo azul.", "see-EH-loh", 4, "nature", "sky"),
  w("sol", "sun", "noun", "Brilla el sol.", "sohl", 3, "nature", "sky"),
  w("luna", "moon", "noun", "La luna llena.", "LOO-nah", 3, "nature", "sky"),
  w("estrella", "star", "noun", "Una estrella brillante.", "ehs-TREH-yah", 4, "nature", "sky"),
  w("nube", "cloud", "noun", "Una nube blanca.", "NOO-beh", 4, "nature", "sky"),
  w("lluvia", "rain", "noun", "La lluvia cae.", "YOO-bee-ah", 4, "nature", "sky"),
  w("viento", "wind", "noun", "El viento sopla.", "bee-EHN-toh", 4, "nature", "sky"),
  // Water
  w("mar", "sea", "noun", "El mar azul.", "mahr", 4, "nature", "water"),
  w("río", "river", "noun", "El río corre.", "RREE-oh", 4, "nature", "water"),
  w("lago", "lake", "noun", "El lago es grande.", "LAH-goh", 4, "nature", "water"),
  // Plants
  w("árbol", "tree", "noun", "Un árbol grande.", "AHR-bohl", 4, "nature", "plants"),
  w("flor", "flower", "noun", "Una flor bonita.", "flohr", 4, "nature", "plants"),

  // ── BODY ──
  // Head
  w("cabeza", "head", "noun", "Me duele la cabeza.", "kah-BEH-sah", 3, "body", "head"),
  w("ojo", "eye", "noun", "Tiene ojos verdes.", "OH-hoh", 3, "body", "head"),
  w("boca", "mouth", "noun", "Abre la boca.", "BOH-kah", 4, "body", "head"),
  w("nariz", "nose", "noun", "Tiene nariz grande.", "nah-REES", 4, "body", "head"),
  w("oreja", "ear", "noun", "Me duele la oreja.", "oh-REH-hah", 4, "body", "head"),
  // Upper Body
  w("mano", "hand", "noun", "Dame la mano.", "MAH-noh", 2, "body", "upper-body"),
  w("brazo", "arm", "noun", "Me duele el brazo.", "BRAH-soh", 4, "body", "upper-body"),
  w("dedo", "finger / toe", "noun", "Cinco dedos.", "DEH-doh", 4, "body", "upper-body"),
  w("espalda", "back", "noun", "Me duele la espalda.", "ehs-PAHL-dah", 4, "body", "upper-body"),
  // Lower Body
  w("pierna", "leg", "noun", "La pierna derecha.", "pee-EHR-nah", 4, "body", "lower-body"),
  w("pie", "foot", "noun", "Me duele el pie.", "pee-EH", 4, "body", "lower-body"),
  w("rodilla", "knee", "noun", "Me duele la rodilla.", "roh-DEE-yah", 4, "body", "lower-body"),
  // Internal
  w("cuerpo", "body", "noun", "El cuerpo humano.", "KWEHR-poh", 4, "body", "internal"),
  w("corazón", "heart", "noun", "Mi corazón late.", "koh-rah-SOHN", 4, "body", "internal"),

  // ── ADJECTIVES ──
  // Size & Quantity
  w("grande", "big / large", "adjective", "Una casa grande.", "GRAHN-deh", 1, "adjectives", "size"),
  w("pequeño", "small / little", "adjective", "Un gato pequeño.", "peh-KEH-nyoh", 3, "adjectives", "size"),
  w("alto", "tall / high", "adjective", "Es muy alto.", "AHL-toh", 3, "adjectives", "size"),
  w("bajo", "short / low", "adjective", "Es bajo.", "BAH-hoh", 3, "adjectives", "size"),
  w("poco", "little / few", "adjective", "Un poco de agua.", "POH-koh", 1, "adjectives", "size"),
  w("otro", "other / another", "adjective", "Dame otro.", "OH-troh", 1, "adjectives", "size"),
  w("primer", "first", "adjective", "El primer día.", "pree-MEHR", 2, "adjectives", "size"),
  // Speed & Quality
  w("rápido", "fast / quick", "adjective", "El carro es rápido.", "RRAH-pee-doh", 3, "adjectives", "speed"),
  w("lento", "slow", "adjective", "Camina lento.", "LEHN-toh", 3, "adjectives", "speed"),
  w("bueno", "good", "adjective", "Es muy bueno.", "BWEH-noh", 2, "adjectives", "speed"),
  w("mejor", "better / best", "adjective", "El mejor día.", "meh-HOHR", 2, "adjectives", "speed"),
  w("nuevo", "new", "adjective", "Un carro nuevo.", "NWEH-boh", 2, "adjectives", "speed"),
  w("fuerte", "strong", "adjective", "Es muy fuerte.", "FWEHR-teh", 3, "adjectives", "speed"),
  w("mismo", "same / self", "adjective", "El mismo día.", "MEES-moh", 1, "adjectives", "speed"),
  // Appearance
  w("bonito", "pretty / nice", "adjective", "Qué bonito.", "boh-NEE-toh", 3, "adjectives", "appearance"),
  w("feo", "ugly", "adjective", "No es feo.", "FEH-oh", 3, "adjectives", "appearance"),
  w("viejo", "old", "adjective", "El hombre viejo.", "bee-EH-hoh", 3, "adjectives", "appearance"),
  w("joven", "young", "adjective", "Es muy joven.", "HOH-behn", 3, "adjectives", "appearance"),
  w("caliente", "hot", "adjective", "El café está caliente.", "kah-lee-EHN-teh", 3, "adjectives", "appearance"),
  w("frío", "cold", "adjective", "Hace frío.", "FREE-oh", 3, "adjectives", "appearance"),
  // Emotion & Difficulty
  w("feliz", "happy", "adjective", "Estoy feliz.", "feh-LEES", 3, "adjectives", "emotion"),
  w("triste", "sad", "adjective", "Estoy triste.", "TREES-teh", 3, "adjectives", "emotion"),
  w("fácil", "easy", "adjective", "Es fácil.", "FAH-seel", 3, "adjectives", "emotion"),
  w("difícil", "difficult", "adjective", "Es difícil.", "dee-FEE-seel", 3, "adjectives", "emotion"),

  // ── NUMBERS & TIME ──
  // Numbers
  w("uno", "one", "numeral", "Solo uno.", "OO-noh", 4, "numbers", "numbers-num"),
  w("dos", "two", "numeral", "Tengo dos.", "dohs", 4, "numbers", "numbers-num"),
  w("tres", "three", "numeral", "Somos tres.", "trehs", 4, "numbers", "numbers-num"),
  w("cuatro", "four", "numeral", "Cuatro gatos.", "KWAH-troh", 4, "numbers", "numbers-num"),
  w("cinco", "five", "numeral", "Cinco dedos.", "SEEN-koh", 4, "numbers", "numbers-num"),
  w("seis", "six", "numeral", "Son las seis.", "sehs", 4, "numbers", "numbers-num"),
  w("siete", "seven", "numeral", "Siete días.", "see-EH-teh", 4, "numbers", "numbers-num"),
  w("ocho", "eight", "numeral", "Ocho horas.", "OH-choh", 4, "numbers", "numbers-num"),
  w("nueve", "nine", "numeral", "Nueve meses.", "NWEH-beh", 4, "numbers", "numbers-num"),
  w("diez", "ten", "numeral", "Diez minutos.", "dee-EHS", 4, "numbers", "numbers-num"),
  w("cien", "one hundred", "numeral", "Cien por ciento.", "see-EHN", 4, "numbers", "numbers-num"),
  // Days of the Week
  w("lunes", "Monday", "noun", "Hoy es lunes.", "LOO-nehs", 4, "numbers", "days"),
  w("martes", "Tuesday", "noun", "Mañana es martes.", "MAHR-tehs", 4, "numbers", "days"),
  w("miércoles", "Wednesday", "noun", "El miércoles voy.", "mee-EHR-koh-lehs", 4, "numbers", "days"),
  w("jueves", "Thursday", "noun", "Nos vemos el jueves.", "HWEH-behs", 4, "numbers", "days"),
  w("viernes", "Friday", "noun", "¡Es viernes!", "bee-EHR-nehs", 4, "numbers", "days"),
  w("sábado", "Saturday", "noun", "El sábado salimos.", "SAH-bah-doh", 4, "numbers", "days"),
  w("domingo", "Sunday", "noun", "El domingo descanso.", "doh-MEEN-goh", 4, "numbers", "days"),
  // Time Words
  w("hoy", "today", "adverb", "Hoy es lunes.", "oy", 4, "numbers", "time-words"),
  w("mañana", "tomorrow / morning", "noun", "Hasta mañana.", "mah-NYAH-nah", 4, "numbers", "time-words"),
  w("ayer", "yesterday", "adverb", "Ayer fue lunes.", "ah-YEHR", 4, "numbers", "time-words"),
  w("siempre", "always", "adverb", "Siempre feliz.", "see-EHM-preh", 4, "numbers", "time-words"),
  w("nunca", "never", "adverb", "Nunca digas nunca.", "NOON-kah", 4, "numbers", "time-words"),
  w("semana", "week", "noun", "La próxima semana.", "seh-MAH-nah", 4, "numbers", "time-words"),
  w("mes", "month", "noun", "El mes de enero.", "mehs", 4, "numbers", "time-words"),
  // Time of Day
  w("día", "day", "noun", "Un buen día.", "DEE-ah", 2, "numbers", "time-of-day"),
  w("noche", "night", "noun", "Buenas noches.", "NOH-cheh", 2, "numbers", "time-of-day"),
  w("año", "year", "noun", "El año nuevo.", "AH-nyoh", 2, "numbers", "time-of-day"),
  w("tiempo", "time / weather", "noun", "No tengo tiempo.", "tee-EHM-poh", 1, "numbers", "time-of-day"),
  w("momento", "moment", "noun", "Un momento, por favor.", "moh-MEHN-toh", 2, "numbers", "time-of-day"),
  w("hora", "hour", "noun", "¿Qué hora es?", "OH-rah", 4, "numbers", "time-of-day"),
  w("minuto", "minute", "noun", "Un minuto más.", "mee-NOO-toh", 4, "numbers", "time-of-day"),

  // ── SCHOOL & LEARNING ──
  // Places
  w("escuela", "school", "noun", "Voy a la escuela.", "ehs-KWEH-lah", 3, "school", "places"),
  w("clase", "class", "noun", "La clase empieza.", "KLAH-seh", 4, "school", "places"),
  // Supplies
  w("libro", "book", "noun", "Leo un libro.", "LEE-broh", 3, "school", "supplies"),
  w("lápiz", "pencil", "noun", "Un lápiz amarillo.", "LAH-pees", 4, "school", "supplies"),
  w("papel", "paper", "noun", "Una hoja de papel.", "pah-PEHL", 4, "school", "supplies"),
  // People
  w("maestro", "teacher", "noun", "El maestro enseña.", "mah-EHS-troh", 4, "school", "people-school"),
  w("estudiante", "student", "noun", "Soy estudiante.", "ehs-too-dee-AHN-teh", 4, "school", "people-school"),
  // Concepts
  w("palabra", "word", "noun", "Una nueva palabra.", "pah-LAH-brah", 3, "school", "concepts"),
  w("pregunta", "question", "noun", "Tengo una pregunta.", "preh-GOON-tah", 3, "school", "concepts"),
  w("respuesta", "answer", "noun", "Sé la respuesta.", "rehs-PWEHS-tah", 3, "school", "concepts"),
  w("número", "number", "noun", "¿Cuál es tu número?", "NOO-meh-roh", 3, "school", "concepts"),
  w("nombre", "name", "noun", "¿Cuál es tu nombre?", "NOHM-breh", 2, "school", "concepts"),
  w("ejemplo", "example", "noun", "Por ejemplo.", "eh-HEHM-ploh", 2, "school", "concepts"),
  w("aprender", "to learn", "verb", "Quiero aprender.", "ah-prehn-DEHR", 4, "school", "concepts"),
  w("enseñar", "to teach", "verb", "Me gusta enseñar.", "ehn-seh-NYAHR", 4, "school", "concepts"),
  w("examen", "exam", "noun", "Tengo un examen.", "ehk-SAH-mehn", 4, "school", "concepts"),
  w("tarea", "homework", "noun", "Hago mi tarea.", "tah-REH-ah", 4, "school", "concepts"),

  // ── DAILY LIFE ──
  // Places
  w("ciudad", "city", "noun", "La ciudad grande.", "see-oo-DAHD", 2, "daily", "places-daily"),
  w("calle", "street", "noun", "Camino por la calle.", "KAH-yeh", 3, "daily", "places-daily"),
  w("tienda", "store", "noun", "Voy a la tienda.", "tee-EHN-dah", 4, "daily", "places-daily"),
  w("banco", "bank", "noun", "Voy al banco.", "BAHN-koh", 4, "daily", "places-daily"),
  w("hospital", "hospital", "noun", "Está en el hospital.", "ohs-pee-TAHL", 4, "daily", "places-daily"),
  w("país", "country", "noun", "Este país es bonito.", "pah-EES", 2, "daily", "places-daily"),
  w("mundo", "world", "noun", "Todo el mundo.", "MOON-doh", 2, "daily", "places-daily"),
  // Technology
  w("teléfono", "phone", "noun", "Mi teléfono suena.", "teh-LEH-foh-noh", 4, "daily", "technology"),
  w("computadora", "computer", "noun", "Uso la computadora.", "kohm-poo-tah-DOH-rah", 4, "daily", "technology"),
  w("correo", "mail / email", "noun", "Reviso mi correo.", "koh-RREH-oh", 4, "daily", "technology"),
  // Transportation
  w("carro", "car", "noun", "Tengo un carro.", "KAH-rroh", 3, "daily", "transportation"),
  // Objects & Abstract
  w("trabajo", "work / job", "noun", "Tengo mucho trabajo.", "trah-BAH-hoh", 2, "daily", "objects"),
  w("dinero", "money", "noun", "No tengo dinero.", "dee-NEH-roh", 3, "daily", "objects"),
  w("llave", "key", "noun", "¿Dónde está la llave?", "YAH-beh", 4, "daily", "objects"),
  w("bolsa", "bag / purse", "noun", "Mi bolsa es grande.", "BOHL-sah", 4, "daily", "objects"),
  w("vida", "life", "noun", "La vida es bella.", "BEE-dah", 2, "daily", "objects"),
  w("cosa", "thing", "noun", "Una cosa más.", "KOH-sah", 2, "daily", "objects"),
  w("parte", "part", "noun", "La mejor parte.", "PAHR-teh", 2, "daily", "objects"),
  w("forma", "form / way", "noun", "De esta forma.", "FOHR-mah", 2, "daily", "objects"),
  w("lado", "side", "noun", "A mi lado.", "LAH-doh", 3, "daily", "objects"),
  w("gobierno", "government", "noun", "El gobierno nuevo.", "goh-bee-EHR-noh", 2, "daily", "objects"),
  w("perro", "dog", "noun", "El perro ladra.", "PEH-rroh", 3, "daily", "objects"),
  w("gato", "cat", "noun", "El gato duerme.", "GAH-toh", 3, "daily", "objects"),
  w("color", "color", "noun", "¿De qué color?", "koh-LOHR", 4, "daily", "objects"),

  // ── ACTIONS & ACTIVITIES ──
  // Physical
  w("jugar", "to play", "verb", "Quiero jugar.", "hoo-GAHR", 3, "actions", "physical"),
  w("correr", "to run", "verb", "Me gusta correr.", "koh-REHR", 3, "actions", "physical"),
  w("dormir", "to sleep", "verb", "Quiero dormir.", "dohr-MEER", 3, "actions", "physical"),
  w("caminar", "to walk", "verb", "Me gusta caminar.", "kah-mee-NAHR", 3, "actions", "physical"),
  w("nadar", "to swim", "verb", "Me gusta nadar.", "nah-DAHR", 4, "actions", "physical"),
  w("limpiar", "to clean", "verb", "Voy a limpiar.", "leem-pee-AHR", 4, "actions", "physical"),
  w("trabajar", "to work", "verb", "Trabajo todos los días.", "trah-bah-HAHR", 4, "actions", "physical"),
  // Creative
  w("cantar", "to sing", "verb", "Me gusta cantar.", "kahn-TAHR", 4, "actions", "creative"),
  w("bailar", "to dance", "verb", "Quiero bailar.", "bai-LAHR", 4, "actions", "creative"),
  w("cocinar", "to cook", "verb", "Voy a cocinar.", "koh-see-NAHR", 4, "actions", "creative"),
  w("viajar", "to travel", "verb", "Quiero viajar.", "bee-ah-HAHR", 4, "actions", "creative"),
  // Commerce & Practical
  w("ayudar", "to help", "verb", "¿Puedes ayudar?", "ah-yoo-DAHR", 4, "actions", "commerce"),
  w("comprar", "to buy", "verb", "Voy a comprar.", "kohm-PRAHR", 4, "actions", "commerce"),
  w("vender", "to sell", "verb", "Quiero vender.", "behn-DEHR", 4, "actions", "commerce"),
  w("abrir", "to open", "verb", "Abre la puerta.", "ah-BREER", 4, "actions", "commerce"),
  w("cerrar", "to close", "verb", "Cierra la puerta.", "seh-RRAHR", 4, "actions", "commerce"),
];

// ── QUERY FUNCTIONS ──

export function getWordsByTier(tier: number): Word[] {
  return vocabulary.filter(w => w.tier === tier);
}

export function getWordsByTiers(tiers: number[]): Word[] {
  return vocabulary.filter(w => tiers.includes(w.tier));
}

export function getWordsByCategory(categoryId: string): Word[] {
  return vocabulary.filter(w => w.category === categoryId);
}

export function getWordsByCategories(categoryIds: string[]): Word[] {
  return vocabulary.filter(w => categoryIds.includes(w.category));
}

export function getWordsBySubcategory(categoryId: string, subcategoryId: string): Word[] {
  return vocabulary.filter(w => w.category === categoryId && w.subcategory === subcategoryId);
}
