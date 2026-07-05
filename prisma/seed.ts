import {
  ListingDocumentType,
  ListingStatus,
  PrismaClient,
  UserRole,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const APP_TABLES = ['ListingDocument', 'ListingImage', 'Listing', 'User'];

const UNSPLASH_PHOTO_IDS = [
  'photo-1500382017468-9049fed747ef',
  'photo-1501785888041-af3ef285b470',
  'photo-1470071459604-3b5ec3a7fe05',
  'photo-1472214103451-9374bd1c798e',
  'photo-1506744038136-46273834b3fb',
  'photo-1469474968028-56623f02e42e',
  'photo-1502082553048-f009c37129b9',
  'photo-1465146344425-f00d5f5c8f07',
  'photo-1426604966848-d7adac402bff',
  'photo-1444927714506-8492d94b4e3d',
  'photo-1500534314209-a25ddb2bd429',
  'photo-1475924156734-496f6cac6ec1',
  'photo-1439066615861-d1af74d74000',
  'photo-1464822759023-fed622ff2c3b',
  'photo-1433086966358-54859d0ed716',
  'photo-1470770841072-f978cf4d019e',
  'photo-1494500764479-0c8f2919a3d8',
  'photo-1458668383970-8ddd3927deed',
  'photo-1547235001-d703406d3f17',
  'photo-1504280390367-361c6d9f38f4',
  'photo-1441974231531-c6227db76b6e',
  'photo-1447752875215-b2761acb3c5d',
  'photo-1509316975850-ff9c5deb0cd9',
  'photo-1476231682828-37e571bc172f',
  'photo-1519681393784-d120267933ba',
  'photo-1500530855697-b586d89ba3ee',
  'photo-1500534314209-a25ddb2bd429',
  'photo-1500534314209-a25ddb2bd429',
].map((id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`);

type UserSeed = {
  key: string;
  phone: string;
  email: string;
  name: string;
  role?: UserRole;
  region: string;
  isPhoneVerified: boolean;
};

type ListingSeed = {
  title: string;
  description: string;
  region: string;
  district: string;
  sizeSqm: number;
  price: string;
  status: ListingStatus;
  sellerKey: string;
  latitude: number;
  longitude: number;
  createdDaysAgo: number;
  photoCount: number;
  rejectionNote?: string;
};

const sellers: UserSeed[] = ([
  ['amina', '+252611482736', 'amina.hassan@example.com', 'Amina Hassan', 'Banaadir', true],
  ['fartun', '+252633905214', 'fartun.abdi@example.com', 'Fartun Abdi', 'Banaadir', true],
  ['hawa', '+252651337890', 'hawa.mohamud@example.com', 'Hawa Mohamud', 'Banaadir', false],
  ['omar', '+252634122507', 'omar.ali@example.com', 'Omar Ali', 'Woqooyi Galbeed', true],
  ['sahra', '+252651088432', 'sahra.dirie@example.com', 'Sahra Dirie', 'Woqooyi Galbeed', true],
  ['mohamed', '+252907743118', 'mohamed.warsame@example.com', 'Mohamed Warsame', 'Bari', true],
  ['idil', '+252906514887', 'idil.ahmed@example.com', 'Idil Ahmed', 'Bari', false],
  ['hodan', '+252659807441', 'hodan.yusuf@example.com', 'Hodan Yusuf', 'Jubbada Hoose', true],
  ['abdiqani', '+252686229013', 'abdiqani.said@example.com', 'Abdiqani Said', 'Jubbada Hoose', true],
  ['abdirahman', '+252619634280', 'abdirahman.nur@example.com', 'Abdirahman Nur', 'Bay', true],
  ['layla', '+252905771246', 'layla.ismail@example.com', 'Layla Ismail', 'Nugaal', true],
  ['yusuf', '+252634880129', 'yusuf.adan@example.com', 'Yusuf Adan', 'Togdheer', false],
  ['khadra', '+252618445902', 'khadra.osman@example.com', 'Khadra Osman', 'Hiiraan', true],
  ['ibrahim', '+252687039521', 'ibrahim.farah@example.com', 'Ibrahim Farah', 'Shabeellaha Hoose', true],
  ['maryan', '+252616704358', 'maryan.sheikh@example.com', 'Maryan Sheikh', 'Mudug', true],
  ['hassan', '+252652218694', 'hassan.jama@example.com', 'Hassan Jama', 'Galguduud', false],
] as const).map(([key, phone, email, name, region, verified]) => ({
  key,
  phone,
  email,
  name,
  region,
  isPhoneVerified: verified === true,
}));

const buyers: UserSeed[] = ([
  ['buyer-nimco', '+252615993481', 'nimco.buyer@example.com', 'Nimco Roble', 'Banaadir', true],
  ['buyer-anas', '+252638170224', 'anas.buyer@example.com', 'Anas Barre', 'Banaadir', false],
  ['buyer-ayaan', '+252654760913', 'ayaan.buyer@example.com', 'Ayaan Abdulle', 'Woqooyi Galbeed', true],
  ['buyer-bashir', '+252907811305', 'bashir.buyer@example.com', 'Bashir Mire', 'Bari', true],
  ['buyer-sagal', '+252686017439', 'sagal.buyer@example.com', 'Sagal Omar', 'Jubbada Hoose', false],
  ['buyer-faisal', '+252619884072', 'faisal.buyer@example.com', 'Faisal Aden', 'Bay', true],
  ['buyer-zamzam', '+252633127908', 'zamzam.buyer@example.com', 'Zamzam Ali', 'Nugaal', true],
  ['buyer-mahad', '+252652704611', 'mahad.buyer@example.com', 'Mahad Mohamed', 'Hiiraan', false],
  ['buyer-nasra', '+252907504366', 'nasra.buyer@example.com', 'Nasra Elmi', 'Mudug', true],
  ['buyer-ayaanle', '+252618102579', 'ayaanle.buyer@example.com', 'Ayaanle Guled', 'Shabeellaha Hoose', true],
  ['buyer-suleiman', '+252686940237', 'suleiman.buyer@example.com', 'Suleiman Yusuf', 'Togdheer', true],
  ['buyer-ifo', '+252615420836', 'ifo.buyer@example.com', 'Ifo Hassan', 'Awdal', false],
] as const).map(([key, phone, email, name, region, verified]) => ({
  key,
  phone,
  email,
  name,
  region,
  isPhoneVerified: verified === true,
}));

const admin: UserSeed = {
  key: 'admin',
  phone: '+252600000000',
  email: 'admin@acrex.so',
  name: 'AcreX Admin',
  role: UserRole.ADMIN,
  region: 'Banaadir',
  isPhoneVerified: true,
};

const listingSeeds: ListingSeed[] = [
  l('Corner residential plot in Hodan', 'Fenced corner plot two streets off Maka Al-Mukarama Road. Flat, cleared and ready to build, with water and electricity connections available at the boundary and a clean title deed at the Banaadir land office.', 'Banaadir', 'Hodan', 412, '52600.00', 'amina', 2.0333, 45.3051, 2, 5),
  l('Commercial frontage on Airport Road', 'Prime frontage on the airport corridor in Wadajir, suited to a showroom, bank branch or mixed-use building. Paved access on two sides and strong daily traffic.', 'Banaadir', 'Wadajir', 618, '147500.00', 'fartun', 2.0169, 45.2882, 4, 4),
  l('Family plot near Yaqshid market', 'Residential plot a short walk from Yaqshid market and two schools. Quiet neighborhood street with established homes on both sides; seller is relocating and ready for a quick transfer.', 'Banaadir', 'Yaqshid', 346, '28750.00', 'amina', 2.0652, 45.3524, 6, 3),
  l('Residential block in Deynile', 'Large block off the Deynile main road with space to subdivide into three standard family plots. New housing is spreading around the site and boundaries are clearly marked.', 'Banaadir', 'Deynile', 1018, '61200.00', 'fartun', 2.0851, 45.2828, 8, 5),
  l('Twin plots in Hamar Weyne', 'Two adjoining city-core plots sold together, walking distance to the old port, fish market and Friday mosque. Strong redevelopment potential in a historic district.', 'Banaadir', 'Hamar Weyne', 498, '88400.00', 'hawa', 2.0304, 45.3435, 10, 4),
  l('Quiet plot in Abdiaziz', 'Compact residential land near Liido access roads with a finished boundary wall and steel gate. Good fit for a family home close to the sea and city services.', 'Banaadir', 'Abdiaziz', 278, '39500.00', 'hawa', 2.0489, 45.3358, 12, 3),
  l('Small villa site in Taleex', 'Well-shaped villa plot close to Taleex junction. The street is already graded, neighboring homes are occupied, and the owner has recent registry paperwork.', 'Banaadir', 'Hodan - Taleex', 552, '96500.00', 'amina', 2.0421, 45.3118, 14, 4),
  l('Mixed-use site near KM4', 'Rare central parcel within easy reach of KM4 and Maka Al-Mukarama. Suitable for ground-floor shops with apartments above; seller can meet at the registry for document checks.', 'Banaadir', 'Waberi', 324, '118750.00', 'fartun', 2.0396, 45.319, 16, 4),
  l('Affordable plot in Dharkenley', 'Corner plot in a fast-growing Dharkenley pocket near the new market. Graded access road, simple boundary markers and neighbors already building nearby.', 'Banaadir', 'Dharkenley', 383, '24600.00', 'hawa', 2.007, 45.2761, 18, 3),
  l('New Hargeisa residential plot', 'Planned residential plot ten minutes from the airport. Roads are graded, several homes are under construction on the same block and the title deed is ready for transfer.', 'Woqooyi Galbeed', 'Hargeisa - New Hargeisa', 506, '38250.00', 'omar', 9.5602, 44.065, 3, 4),
  l('Hargeisa main-road shop plot', 'Shop-front plot near the central market with excellent foot traffic. Ideal for retail or a small office block; water and power are available from the street.', 'Woqooyi Galbeed', 'Hargeisa Central', 304, '46800.00', 'sahra', 9.5624, 44.0672, 5, 3),
  l('Smallholding outside Gabiley', 'Rain-fed farmland in the Gabiley agricultural belt, known for maize and vegetables. Includes a small storage hut and a simple fenced perimeter.', 'Woqooyi Galbeed', 'Gabiley', 10250, '16900.00', 'yusuf', 9.9647, 43.3358, 7, 4),
  l('Hillside plot overlooking Borama', 'Hillside residential plot with wide views over Borama and the Awdal hills. Cool climate, quiet setting and a graded access track already in place.', 'Awdal', 'Borama', 612, '21450.00', 'omar', 9.9361, 43.1806, 9, 3),
  l('Beachfront parcel north of Berbera port', 'Coastal land six kilometers north of Berbera port with direct access from the coastal road. Ideal for a guesthouse, storage yard or future tourism project.', 'Woqooyi Galbeed', 'Berbera', 2040, '97200.00', 'sahra', 10.4396, 45.0143, 11, 5),
  l('Warehouse land near Bosaso seaport', 'Level industrial land close to the Bosaso seaport gate. Heavy-vehicle access, perimeter wall on three sides and utilities at the road.', 'Bari', 'Bosaso Port Area', 1515, '112800.00', 'mohamed', 11.2842, 49.1816, 13, 4),
  l('Bosaso hillside residential parcel', 'Elevated residential land above the main town with sea breeze and wide views. Good for a family compound with parking and outdoor space.', 'Bari', 'Bosaso - Laanta Hawada', 742, '36500.00', 'idil', 11.2923, 49.1675, 15, 3),
  l('Roadside commercial plot in Qardho', 'Main-road plot on the Qardho trade route with room for shops, storage or a small hotel. Clear boundaries and easy truck access.', 'Bari', 'Qardho', 928, '31500.00', 'mohamed', 9.5007, 49.0866, 17, 4),
  l('Coastal land near Eyl fishing village', 'Land above the beach at Eyl with year-round fishing activity nearby. The parcel suits an eco-lodge, fish-processing yard or private retreat.', 'Nugaal', 'Eyl', 2575, '30800.00', 'layla', 7.9803, 49.8164, 19, 4),
  l('City-centre plot in Garoowe', 'Walled plot two blocks from the main government road in central Garoowe. Suitable for a family home or small office building.', 'Nugaal', 'Garoowe Central', 458, '33750.00', 'layla', 8.4054, 48.4845, 21, 4),
  l('Residential extension plot in Garoowe', 'Clean rectangular parcel in a calm extension area with several new homes nearby. Seller has both title deed and survey sketch available.', 'Nugaal', 'Garoowe - Israac', 672, '27900.00', 'layla', 8.4218, 48.4691, 23, 3),
  l('Main-road commercial plot in Galkacyo', 'Visible plot on the north-south trade road through Galkacyo. Strong location for fuel, hospitality or wholesale activity.', 'Mudug', 'Galkacyo', 905, '54800.00', 'maryan', 6.7697, 47.4308, 25, 4),
  l('Residential plot near Galmudug offices', 'Medium-sized residential parcel on a quiet street near public offices and shops. The land is cleared, level and ready for a boundary wall.', 'Mudug', 'Galkacyo - North', 434, '22100.00', 'maryan', 6.787, 47.4382, 27, 3),
  l('Roadside plot in Dhuusamareeb', 'Flat roadside plot on the paved main road through Dhuusamareeb. Commercial activity is increasing along this stretch and access is simple.', 'Galguduud', 'Dhuusamareeb', 655, '14400.00', 'hassan', 5.536, 46.3861, 29, 3),
  l('Compound land in Cadaado', 'Large parcel on the edge of Cadaado with space for a family compound, workshop or storage yard. Boundary corners are marked with concrete posts.', 'Galguduud', 'Cadaado', 1320, '23850.00', 'hassan', 6.136, 46.6256, 31, 4),
  l('Beach plot with ocean view in Kismayo', 'Elevated plot overlooking the Indian Ocean on the edge of Kismayo. Cool sea breeze, sunset views and a five-minute drive to the city center.', 'Jubbada Hoose', 'Kismayo - Calanley', 812, '42600.00', 'hodan', -0.3582, 42.5454, 4, 5),
  l('Harbour-view land in Kismayo', 'Parcel with a clear view of Kismayo harbour and quick access to the port road. Suitable for apartments, offices or a small hotel.', 'Jubbada Hoose', 'Kismayo Port Road', 1008, '51600.00', 'abdiqani', -0.3665, 42.5489, 6, 4),
  l('Agricultural parcel near Jamame', 'Fertile land outside Jamame with seasonal water access and a history of sesame and vegetable planting. Local caretaker can continue managing the parcel.', 'Jubbada Hoose', 'Jamame', 18500, '27600.00', 'hodan', 0.0697, 42.7449, 8, 4),
  l('Riverside farm near Jilib', 'Riverside farm parcel near Jilib with mature shade trees, irrigation channels and a small pump shelter included in the sale.', 'Jubbada Dhexe', 'Jilib', 24000, '34250.00', 'abdiqani', 0.4947, 42.7722, 10, 5),
  l('Sorghum farmland near Baidoa', 'Productive sorghum farmland eight kilometers from Baidoa on an all-season road. Deep soil, reliable seasonal rains and a storage shed included.', 'Bay', 'Baidoa Outskirts', 20300, '22600.00', 'abdirahman', 3.1138, 43.6498, 12, 4),
  l('Residential parcel in Baidoa town', 'Well-located plot in Baidoa town near schools and a neighborhood market. The land is cleared and compact enough for a starter home.', 'Bay', 'Baidoa - Isha', 365, '13400.00', 'abdirahman', 3.1199, 43.6582, 14, 3),
  l('Dryland farm near Xudur', 'Large dryland farm in Bakool with seasonal grazing and crop potential. Boundaries are known locally and the seller can introduce neighboring owners.', 'Bakool', 'Xudur', 41000, '18800.00', 'abdirahman', 4.1213, 43.8894, 16, 4),
  l('Plot near Beledweyne airstrip', 'High-ground plot near the Beledweyne airstrip, outside the seasonal flood zone. Good road access and clear sight lines for a residence or NGO compound.', 'Hiiraan', 'Beledweyne Airstrip', 706, '18400.00', 'khadra', 4.7358, 45.2036, 18, 4),
  l('Shabelle river farmland near Beledweyne', 'Fertile riverbank farmland with canal access and mature boundary trees. The parcel has supported vegetables and fodder crops for years.', 'Hiiraan', 'Beledweyne - Howlwadaag', 15400, '31500.00', 'khadra', 4.745, 45.1891, 20, 5),
  l('Orchard land on the river in Jowhar', 'Established mango and papaya orchard near the Shabelle river. Trees are mature and producing; sale includes a caretaker room and irrigation channels.', 'Shabeellaha Dhexe', 'Jowhar', 15200, '48900.00', 'ibrahim', 2.7669, 45.5005, 22, 5),
  l('Residential land near Jowhar stadium', 'Family-sized parcel near Jowhar stadium with easy access to shops and schools. A simple wall foundation is already started.', 'Shabeellaha Dhexe', 'Jowhar Town', 486, '16850.00', 'ibrahim', 2.7718, 45.5081, 24, 3),
  l('Irrigated farm on the Shabelle near Afgooye', 'Fertile irrigated farmland on the Shabelle river bank outside Afgooye. Currently planted with bananas and lemons, with a working pump house included.', 'Shabeellaha Hoose', 'Afgooye', 30400, '76200.00', 'ibrahim', 2.1381, 45.1212, 26, 5),
  l('Seaside land near Merca old town', 'Gently sloping land ten minutes from Merca old town with palm trees along the southern boundary and a clear path to the beach.', 'Shabeellaha Hoose', 'Merca', 1215, '36750.00', 'hodan', 1.7156, 44.7703, 28, 4),
  l('Residential plot in Wanlaweyn', 'Affordable residential plot close to the main road through Wanlaweyn. Good entry price for a buyer planning a modest family home.', 'Shabeellaha Hoose', 'Wanlaweyn', 532, '12800.00', 'ibrahim', 2.6189, 44.8931, 30, 3),
  l('Farm parcel near Luuq river bend', 'Riverside farm parcel near Luuq with seasonal flood irrigation and good soil. Seller has older title documents plus recent boundary photos.', 'Gedo', 'Luuq', 30200, '19600.00', 'abdiqani', 3.8127, 42.5445, 32, 4),
  l('Residential plot in Bardhere', 'Town plot near Bardhere market, suitable for a home with a small front shop. Road access is good and the neighborhood is already settled.', 'Gedo', 'Bardhere', 428, '11250.00', 'abdiqani', 2.3446, 42.2764, 34, 3),
  l('Livestock rangeland outside Burco', 'Open rangeland east of Burco with two functioning berkeds. Long grazing history and boundaries agreed with neighboring families.', 'Togdheer', 'Burco East', 50500, '27800.00', 'yusuf', 9.5273, 45.5341, 36, 4),
  l('Burco residential plot near university road', 'Urban residential parcel near the university road in Burco. The area has new homes, small shops and reliable road access.', 'Togdheer', 'Burco', 528, '19400.00', 'yusuf', 9.5221, 45.5407, 38, 3),
  l('Open land near Laascaanood', 'Open land on the edge of Laascaanood, close to the livestock market. Wide frontage and practical access for trucks or a family compound.', 'Sool', 'Laascaanood', 1815, '12350.00', 'yusuf', 8.4774, 47.3597, 40, 4),
  l('Plot in Ceerigaabo town', 'Central Ceerigaabo plot near the main mosque with a cool mountain climate and shops nearby. Good size for a family home.', 'Sanaag', 'Ceerigaabo', 508, '15300.00', 'idil', 10.6162, 47.3679, 42, 3),
  l('Mountain-view parcel near Daallo road', 'Scenic parcel near the Daallo road with cool weather and mountain views. Best suited for a small guesthouse or private retreat.', 'Sanaag', 'Daallo Road', 2360, '28600.00', 'idil', 10.751, 47.27, 44, 5),
  l('Mogadishu outskirts logistics yard', 'Large cleared yard outside the dense city center with room for containers, trucks or building materials. Access road connects back to the airport corridor.', 'Banaadir', 'Garasbaley', 4860, '73500.00', 'fartun', 2.0023, 45.2398, 46, 4),
  l('Hargeisa extension family compound', 'Spacious parcel in a planned extension area with enough room for a home, guest annex and garden. The owner has a recent survey sketch.', 'Woqooyi Galbeed', 'Hargeisa - Jigjiga Yar', 1180, '55750.00', 'sahra', 9.5841, 44.0837, 48, 4),
  l('Bosaso trade-route commercial site', 'Visible plot on the road toward the port and markets. Strong candidate for a service station, warehouse or wholesale shop.', 'Bari', 'Bosaso - Main Road', 1265, '69800.00', 'mohamed', 11.2761, 49.1714, 50, 4),
  l('Baidoa agricultural investment block', 'Larger farm block outside Baidoa with access from a dry-weather road. Suitable for sorghum, fodder or subdivision into smaller farm plots.', 'Bay', 'Baidoa - Berdale Road', 45600, '51200.00', 'abdirahman', 3.2, 43.5333, 52, 5),
  l('Kismayo residential plot near university', 'Family plot in a growing Kismayo neighborhood near student housing and small shops. Good resale prospects as the area fills in.', 'Jubbada Hoose', 'Kismayo - Farjano', 474, '23650.00', 'hodan', -0.349, 42.5361, 54, 3),
  l('Merca palm-lined residential land', 'Palm-lined parcel between town and the beach with enough room for a home and rental annex. The seller has survey points marked on site.', 'Shabeellaha Hoose', 'Merca - Beach Road', 875, '29400.00', 'ibrahim', 1.709, 44.7784, 56, 4),
  l('Garoowe commercial corner near bus station', 'Corner plot near transport activity in Garoowe with space for small shops and upstairs rooms. Strong visibility from two streets.', 'Nugaal', 'Garoowe Bus Station', 585, '44750.00', 'layla', 8.4097, 48.4886, 58, 4),
].map((seed, index) => {
  if (index < 42) return { ...seed, status: ListingStatus.APPROVED };
  if (index < 47) return { ...seed, status: ListingStatus.PENDING_REVIEW };
  if (index < 50) {
    const notes = [
      'The uploaded title deed is illegible. Please re-upload a clear scan of the original document and resubmit.',
      'The name on the ID card does not match the title deed. Please provide proof of ownership transfer or power of attorney.',
      'The described boundaries do not match the survey sketch. Please attach an updated survey map before resubmitting.',
    ];
    return { ...seed, status: ListingStatus.REJECTED, rejectionNote: notes[index - 47] };
  }
  return { ...seed, status: ListingStatus.SOLD };
});

function l(
  title: string,
  description: string,
  region: string,
  district: string,
  sizeSqm: number,
  price: string,
  sellerKey: string,
  latitude: number,
  longitude: number,
  createdDaysAgo: number,
  photoCount: number,
): ListingSeed {
  return {
    title,
    description,
    region,
    district,
    sizeSqm,
    price,
    status: ListingStatus.APPROVED,
    sellerKey,
    latitude,
    longitude,
    createdDaysAgo,
    photoCount,
  };
}

function requireDevDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  const nodeEnv = process.env.NODE_ENV;

  if (nodeEnv === 'production') {
    throw new Error('Refusing to seed while NODE_ENV=production.');
  }

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for seeding.');
  }

  let url: URL;
  try {
    url = new URL(databaseUrl);
  } catch {
    throw new Error('DATABASE_URL is not a valid URL.');
  }

  const host = url.hostname.toLowerCase();
  const dbName = url.pathname.replace(/^\//, '').toLowerCase();
  const user = decodeURIComponent(url.username).toLowerCase();
  const safeHost = ['localhost', '127.0.0.1', '::1'].includes(host);
  const safeName = ['acrex', 'acrex_dev', 'acrex_local', 'dev', 'development'].includes(dbName);
  const safeUser = ['acrex', 'arcex', 'postgres'].includes(user);

  if (!safeHost || !safeName || !safeUser) {
    throw new Error(
      `Refusing to reset database "${dbName}" on "${host}" as "${user}". Use a local AcreX dev database.`,
    );
  }
}

async function resetDatabase() {
  const tableList = APP_TABLES.map((table) => `"public"."${table}"`).join(', ');
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE;`);
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function listingPhotos(listingIndex: number, count: number) {
  return Array.from({ length: count }, (_, order) => ({
    url: UNSPLASH_PHOTO_IDS[(listingIndex * 5 + order) % UNSPLASH_PHOTO_IDS.length],
    order,
  }));
}

function docFile(label: string, listingIndex: number) {
  const text = encodeURIComponent(`${label} - AcreX Demo ${listingIndex + 1}`);
  return `https://placehold.co/850x1100/f7eedd/2b2014/png?text=${text}`;
}

function documentTypes(index: number) {
  const sets = [
    [ListingDocumentType.TITLE_DEED, ListingDocumentType.ID_CARD, ListingDocumentType.SURVEY_MAP],
    [ListingDocumentType.TITLE_DEED, ListingDocumentType.ID_CARD],
    [ListingDocumentType.TITLE_DEED, ListingDocumentType.SURVEY_MAP],
    [ListingDocumentType.TITLE_DEED, ListingDocumentType.ID_CARD, ListingDocumentType.OTHER],
  ];
  return sets[index % sets.length];
}

async function main() {
  requireDevDatabase();
  await resetDatabase();

  const passwordHash = await bcrypt.hash('Password123!', 12);
  const usersByKey = new Map<string, { id: string }>();
  const allUsers = [admin, ...sellers, ...buyers];

  for (const user of allUsers) {
    const created = await prisma.user.create({
      data: {
        phone: user.phone,
        email: user.email,
        passwordHash,
        name: user.name,
        role: user.role ?? UserRole.USER,
        region: user.region,
        isPhoneVerified: user.isPhoneVerified,
        createdAt: daysAgo(110 - (usersByKey.size % 45)),
      },
      select: { id: true },
    });
    usersByKey.set(user.key, created);
  }

  const adminUser = usersByKey.get(admin.key);
  if (!adminUser) throw new Error('Admin seed user was not created.');

  const docLabels: Record<ListingDocumentType, string> = {
    [ListingDocumentType.TITLE_DEED]: 'Title Deed',
    [ListingDocumentType.ID_CARD]: 'ID Card',
    [ListingDocumentType.SURVEY_MAP]: 'Survey Map',
    [ListingDocumentType.OTHER]: 'Supporting Document',
  };

  for (let index = 0; index < listingSeeds.length; index++) {
    const seed = listingSeeds[index];
    const seller = usersByKey.get(seed.sellerKey);
    if (!seller) throw new Error(`Seller "${seed.sellerKey}" was not created.`);

    const reviewed = seed.status !== ListingStatus.PENDING_REVIEW;
    const docs = documentTypes(index);
    await prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: seed.title,
        description: seed.description,
        region: seed.region,
        district: seed.district,
        sizeSqm: seed.sizeSqm,
        price: seed.price,
        currency: 'USD',
        latitude: seed.latitude,
        longitude: seed.longitude,
        status: seed.status,
        rejectionNote: seed.rejectionNote,
        createdAt: daysAgo(seed.createdDaysAgo),
        images: { create: listingPhotos(index, seed.photoCount) },
        documents: {
          create: docs.map((type) => ({
            type,
            fileUrl: docFile(docLabels[type], index),
            reviewedAt: reviewed ? daysAgo(Math.max(seed.createdDaysAgo - 1, 0)) : null,
            reviewedBy: reviewed ? adminUser.id : null,
          })),
        },
      },
    });
  }

  const [userCount, listingCount, imageCount, documentCount, statusCounts] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.listingImage.count(),
    prisma.listingDocument.count(),
    prisma.listing.groupBy({ by: ['status'], _count: true, orderBy: { status: 'asc' } }),
  ]);

  console.log('AcreX demo seed complete.');
  console.log(`Users: ${userCount} (${sellers.length} sellers, ${buyers.length} buyer-only accounts, 1 admin)`);
  console.log(`Listings: ${listingCount}`);
  for (const count of statusCounts) {
    console.log(`  ${count.status}: ${count._count}`);
  }
  console.log(`Images: ${imageCount}`);
  console.log(`Documents: ${documentCount}`);
  console.log('\nDemo logins (password for all: Password123!)');
  console.log('  Admin:  admin@acrex.so');
  console.log('  Seller: amina.hassan@example.com');
  console.log('  Buyer:  nimco.buyer@example.com');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
