import type { Lookalike, Species } from './types';

// Frequently repeated dangerous or confusing lookalikes.
const zlcovy = (diff: Lookalike['diff']): Lookalike => ({
  latin: 'Tylopilus felleus', sk: 'Hríb žlčový', en: 'Bitter bolete', edibility: 'inedible', diff,
});
const zelena = (diff: Lookalike['diff']): Lookalike => ({
  latin: 'Amanita phalloides', sk: 'Muchotrávka zelená', en: 'Death cap', edibility: 'deadly', diff,
});
const kapucnovka = (diff: Lookalike['diff']): Lookalike => ({
  latin: 'Galerina marginata', sk: 'Kapucňovka obrúbená', en: 'Funeral bell', edibility: 'deadly', diff,
});
const satansky = (diff: Lookalike['diff']): Lookalike => ({
  latin: 'Rubroboletus satanas', sk: 'Hríb satanský', en: "Satan's bolete", edibility: 'toxic', diff,
});

export const SPECIES: Species[] = [
  {
    id: 'boletus-edulis', latin: 'Boletus edulis', sk: 'Hríb smrekový', en: 'Penny bun (cep)',
    edibility: 'choice', season: [6, 11], peak: [8, 10], temp: [7, 11, 18, 24], rain: 35,
    habitats: ['coniferous', 'deciduous'], hosts: ['spruce', 'beech', 'pine', 'fir', 'birch', 'oak'], altitude: [300, 1600],
    where: {
      sk: 'Okraje smrekových a bukových lesov, svetlejšie miesta s machom a čučoriedkami, pri chodníkoch a na pasienkoch pri lese. Často rastie 1–2 týždne po výdatnom daždi, keď sa ochladí.',
      en: 'Edges of spruce and beech forests, lighter spots with moss and blueberries, along paths and pasture edges. Often appears 1–2 weeks after heavy rain followed by a cool spell.',
    },
    features: {
      sk: ['Klobúk hnedý, hladký, za vlhka mierne mazľavý, okraj často svetlejší', 'Rúrky biele, neskôr žltozelené, na dotyk nemodrajú', 'Hlúbik hrubý, bruchatý, so svetlou (bielou) sieťkou hore', 'Dužina biela, nemení farbu, chuť mierna, oriešková'],
      en: ['Cap brown, smooth, slightly greasy when wet, often with a paler margin', 'Pores white, later yellow-green, not bruising blue', 'Stem stout, club-shaped, with a fine white net near the top', 'Flesh white, unchanging, mild nutty taste'],
    },
    lookalikes: [
      zlcovy({ sk: 'Rúrky ružovkasté, na hlúbiku hrubá TMAVÁ sieťka, dužina veľmi horká (stačí olíznuť klobúk). Nie je jedovatý, ale pokazí celé jedlo.', en: 'Pores pinkish, coarse DARK net on the stem, flesh extremely bitter (lick the cap). Not poisonous but ruins the whole dish.' }),
      satansky({ sk: 'Rúrky červené, hlúbik s červenou sieťkou, klobúk sivobiely, dužina modrie; rastie v teplých dubových a bukových lesoch na vápenci. Spôsobuje prudké zažívacie ťažkosti.', en: 'Red pores, red net on the stem, greyish-white cap, flesh turns blue; warm oak and beech woods on limestone. Causes severe gastrointestinal poisoning.' }),
    ],
  },
  {
    id: 'boletus-reticulatus', latin: 'Boletus reticulatus', sk: 'Hríb dubový', en: 'Summer cep',
    edibility: 'choice', season: [5, 10], peak: [6, 8], temp: [12, 16, 23, 28], rain: 30,
    habitats: ['deciduous'], hosts: ['oak', 'beech', 'hornbeam'], altitude: [100, 900],
    where: {
      sk: 'Teplé listnaté lesy s dubom, bukom a hrabom, parky a hrádze s dubmi. Prvé hríby sezóny – po letných búrkach.',
      en: 'Warm broadleaf woods with oak, beech and hornbeam, parks and dykes with oaks. The first ceps of the season – after summer storms.',
    },
    features: {
      sk: ['Klobúk svetlohnedý, matný, zamatový, za sucha jemne rozpraskaný', 'Sieťka pokrýva takmer celý hlúbik', 'Rúrky biele až olivové, nemodrajú', 'Dužina biela, mäkšia než pri hríbe smrekovom'],
      en: ['Cap pale brown, matt, velvety, finely cracked in dry weather', 'Net covers almost the whole stem', 'Pores white to olive, not bruising blue', 'Flesh white, softer than in penny bun'],
    },
    lookalikes: [
      zlcovy({ sk: 'Ružovkasté rúrky, tmavá sieťka, horká chuť.', en: 'Pinkish pores, dark net, bitter taste.' }),
      satansky({ sk: 'Červené rúrky a modrajúca dužina – v rovnakých teplých dubových lesoch!', en: 'Red pores and blueing flesh – in the same warm oak woods!' }),
    ],
  },
  {
    id: 'boletus-pinophilus', latin: 'Boletus pinophilus', sk: 'Hríb sosnový', en: 'Pine bolete',
    edibility: 'choice', season: [6, 10], peak: [8, 9], temp: [7, 11, 18, 23], rain: 35,
    habitats: ['coniferous'], hosts: ['pine', 'spruce'], altitude: [200, 1500],
    where: {
      sk: 'Borovicové lesy na piesčitých kyslých pôdach (Záhorie, Orava), aj horské smrečiny. Medzi machom a čučoriedkami.',
      en: 'Pine forests on sandy acidic soils (Záhorie, Orava), also mountain spruce forests. Among moss and blueberries.',
    },
    features: {
      sk: ['Klobúk gaštanovohnedý až vínovočervený, hrbolatý', 'Hlúbik červenohnedý so svetlou sieťkou', 'Rúrky biele až žltozelené, nemodrajú'],
      en: ['Cap chestnut to wine-red, bumpy', 'Stem reddish-brown with pale net', 'Pores white to yellow-green, not bruising'],
    },
    lookalikes: [zlcovy({ sk: 'Ružovkasté rúrky, tmavá sieťka a horká dužina.', en: 'Pinkish pores, dark net, bitter flesh.' })],
  },
  {
    id: 'imleria-badia', latin: 'Imleria badia', sk: 'Suchohríb hnedý', en: 'Bay bolete',
    edibility: 'edible', season: [7, 11], peak: [9, 10], temp: [3, 7, 15, 22], rain: 30,
    habitats: ['coniferous'], hosts: ['spruce', 'pine', 'fir'], altitude: [200, 1500],
    where: {
      sk: 'Smrekové a borovicové lesy na kyslých pôdach, aj na pňoch obrastených machom. Rastie do neskorej jesene.',
      en: 'Spruce and pine forests on acidic soils, also on mossy stumps. Fruits until late autumn.',
    },
    features: {
      sk: ['Klobúk gaštanovohnedý, za vlhka lepkavý', 'Rúrky žltkasté, po stlačení MODRAJÚ', 'Hlúbik bez sieťky, hnedo vláknitý', 'Dužina belavá, na reze slabo modrie'],
      en: ['Cap chestnut-brown, sticky when wet', 'Pores yellowish, bruise BLUE when pressed', 'Stem without net, brown-streaked', 'Flesh whitish, turns slightly blue when cut'],
    },
    lookalikes: [zlcovy({ sk: 'Rúrky nemodrajú, sú ružové; hlúbik má tmavú sieťku; horký.', en: 'Pores do not bruise blue, they are pink; dark net on stem; bitter.' })],
  },
  {
    id: 'neoboletus-erythropus', latin: 'Neoboletus erythropus', sk: 'Hríb zrnitohlúbikový', en: 'Scarletina bolete',
    edibility: 'caution', season: [5, 10], peak: [7, 9], temp: [8, 12, 20, 25], rain: 30,
    habitats: ['coniferous', 'deciduous'], hosts: ['spruce', 'beech', 'fir'], altitude: [300, 1400],
    where: {
      sk: 'Kyslé pôdy v smrekových, jedľových aj bukových lesoch, horské oblasti.',
      en: 'Acidic soils in spruce, fir and beech forests, hilly and mountain areas.',
    },
    features: {
      sk: ['Klobúk tmavohnedý, zamatový', 'Rúrky červené, okamžite tmavomodrajú', 'Hlúbik žltý s červenými ZRNKAMI (nie sieťkou)', 'Dužina žltá, na reze okamžite modrie'],
      en: ['Cap dark brown, velvety', 'Pores red, instantly bruising dark blue', 'Stem yellow with red DOTS (not a net)', 'Flesh yellow, instantly blue when cut'],
    },
    lookalikes: [satansky({ sk: 'Svetlý sivobiely klobúk, na hlúbiku červená SIEŤKA, nepríjemný zápach; rastie na vápenci v teple.', en: 'Pale greyish cap, red NET on stem, unpleasant smell; on limestone in warm areas.' })],
    note: { sk: 'Jedlý len dobre tepelne upravený (min. 20 min). Pre začiatočníkov neodporúčaný – ľahko sa zamení s jedovatými hríbmi.', en: 'Edible only when thoroughly cooked (20+ min). Not for beginners – easily confused with toxic boletes.' },
  },
  {
    id: 'leccinum-scabrum', latin: 'Leccinum scabrum', sk: 'Kozák brezový', en: 'Brown birch bolete',
    edibility: 'edible', season: [6, 10], peak: [7, 9], temp: [8, 12, 20, 26], rain: 25,
    habitats: ['deciduous'], hosts: ['birch'], altitude: [100, 1500],
    where: {
      sk: 'Vždy pod BREZAMI – brezové háje, okraje lesov, rašeliniská, aj samostatné brezy v parkoch.',
      en: 'Always under BIRCH – birch groves, forest edges, bogs, even single birches in parks.',
    },
    features: {
      sk: ['Klobúk sivohnedý, mäkký', 'Hlúbik štíhly, biely s ČIERNYMI šupinkami', 'Rúrky belavé až sivé, nemodrajú', 'Dužina biela, mierne ružovie alebo nemení farbu'],
      en: ['Cap grey-brown, soft', 'Stem slender, white with BLACK scales', 'Pores whitish to grey, not bruising blue', 'Flesh white, unchanging or slightly pinkish'],
    },
    lookalikes: [zlcovy({ sk: 'Hlúbik bez čiernych šupiniek, so sieťkou; rúrky ružové; horký.', en: 'Stem without black scales, with a net; pores pink; bitter.' })],
  },
  {
    id: 'leccinum-aurantiacum', latin: 'Leccinum aurantiacum', sk: 'Kozák osikový (červený)', en: 'Red-capped scaber stalk',
    edibility: 'caution', season: [6, 10], peak: [7, 9], temp: [8, 12, 20, 25], rain: 25,
    habitats: ['deciduous'], hosts: ['aspen', 'birch'], altitude: [100, 1300],
    where: {
      sk: 'Pod osikami a topoľmi, na okrajoch lesov, v mladých porastoch a na rúbaniskách.',
      en: 'Under aspen and poplar, at forest edges, young stands and clearings.',
    },
    features: {
      sk: ['Klobúk oranžovočervený, presahuje okraj', 'Hlúbik belavý so šupinkami, ktoré tmavnú', 'Dužina na reze sivie až čiernofialovo tmavne'],
      en: ['Cap orange-red, overhanging margin', 'Stem whitish with scales that darken', 'Flesh turns grey to purplish-black when cut'],
    },
    lookalikes: [zlcovy({ sk: 'Bez šupín na hlúbiku, ružové rúrky, horká chuť.', en: 'No scales on stem, pink pores, bitter taste.' })],
    note: { sk: 'Treba dôkladne tepelne upraviť (nedovarené môže spôsobiť ťažkosti).', en: 'Must be thoroughly cooked (undercooked may cause upset).' },
  },
  {
    id: 'suillus-luteus', latin: 'Suillus luteus', sk: 'Masliak obyčajný', en: 'Slippery jack',
    edibility: 'edible', season: [6, 11], peak: [8, 10], temp: [5, 9, 18, 24], rain: 20,
    habitats: ['coniferous'], hosts: ['pine'], altitude: [100, 1200],
    where: {
      sk: 'Pod borovicami – mladé borovicové porasty, okraje lesov, piesčité pôdy, aj trávnaté plochy pri borovici.',
      en: 'Under pine – young pine stands, forest edges, sandy soils, grassy places near pines.',
    },
    features: {
      sk: ['Klobúk hnedý, veľmi slizký', 'Na hlúbiku blanitý PRSTEŇ, nad ním žlté zrnká', 'Rúrky drobné, žlté', 'Šupku z klobúka treba stiahnuť'],
      en: ['Cap brown, very slimy', 'Membranous RING on the stem, yellow dots above it', 'Pores small, yellow', 'Peel the slimy skin before cooking'],
    },
    lookalikes: [{ latin: 'Chalciporus piperatus', sk: 'Hríb korenistý', en: 'Peppery bolete', edibility: 'inedible', diff: { sk: 'Menší, bez prsteňa, rúrky hrdzavé, chuť ostro pálivá.', en: 'Smaller, no ring, rusty pores, hot peppery taste.' } }],
  },
  {
    id: 'suillus-grevillei', latin: 'Suillus grevillei', sk: 'Masliak smrekovcový', en: 'Larch bolete',
    edibility: 'edible', season: [6, 10], peak: [8, 9], temp: [5, 9, 18, 24], rain: 20,
    habitats: ['coniferous'], hosts: ['larch'], altitude: [200, 1600],
    where: {
      sk: 'Výlučne pod SMREKOVCAMI – aj v parkoch a výsadbách smrekovca.',
      en: 'Exclusively under LARCH – including parks and larch plantations.',
    },
    features: {
      sk: ['Klobúk zlatožltý až oranžový, slizký', 'Rúrky žlté, na otlak hnednú', 'Biely až žltý blanitý prsteň'],
      en: ['Cap golden yellow to orange, slimy', 'Pores yellow, bruising brownish', 'White to yellow membranous ring'],
    },
    lookalikes: [],
  },
  {
    id: 'cantharellus-cibarius', latin: 'Cantharellus cibarius', sk: 'Kuriatko jedlé (Líška)', en: 'Chanterelle',
    edibility: 'choice', season: [6, 10], peak: [7, 8], temp: [11, 15, 22, 27], rain: 25,
    habitats: ['coniferous', 'deciduous'], hosts: ['spruce', 'beech', 'oak', 'pine', 'fir'], altitude: [200, 1300],
    where: {
      sk: 'Kyslé pôdy v smrekových, bukových a dubových lesoch, v machu a v čučoriedčí. Rastie v skupinách, rok čo rok na tých istých miestach.',
      en: 'Acidic soils in spruce, beech and oak forests, in moss and bilberry. Grows in groups, in the same places year after year.',
    },
    features: {
      sk: ['Celá huba vaječne žltá', 'Namiesto lupeňov tupé, rozvetvené LIŠTY zbiehajúce na hlúbik', 'Dužina biela, pevná, voňavá (marhuľa)', 'Neláme sa krehko, trhá sa ako vlákna'],
      en: ['Whole mushroom egg-yolk yellow', 'Blunt, forked RIDGES instead of gills, running down the stem', 'Flesh white, firm, fruity (apricot) smell', 'Tears into fibres rather than snapping'],
    },
    lookalikes: [
      { latin: 'Hygrophoropsis aurantiaca', sk: 'Líškovec oranžový', en: 'False chanterelle', edibility: 'inedible', diff: { sk: 'Oranžovejší, má pravé tenké husto rozvetvené LUPENE, mäkkú dužinu, často na tlejúcom dreve.', en: 'More orange, true thin forked GILLS, soft flesh, often on rotting wood.' } },
      { latin: 'Omphalotus olearius', sk: 'Kalichovec olivový', en: 'Jack-o’-lantern', edibility: 'toxic', diff: { sk: 'Rastie v trsoch NA DREVE (pne dubov), má ostré pravé lupene, oranžovočervený. Silno jedovatý.', en: 'Grows in clusters ON WOOD (oak stumps), true sharp gills, orange-red. Strongly toxic.' } },
    ],
  },
  {
    id: 'craterellus-cornucopioides', latin: 'Craterellus cornucopioides', sk: 'Lievik trúbkovitý', en: 'Horn of plenty',
    edibility: 'choice', season: [7, 11], peak: [8, 10], temp: [8, 12, 18, 24], rain: 30,
    habitats: ['deciduous'], hosts: ['beech', 'oak', 'hornbeam'], altitude: [200, 1000],
    where: {
      sk: 'Bukové lesy na vlhkých miestach, v lístí pri potokoch, často vo veľkých skupinách. V lístí je ťažko viditeľný.',
      en: 'Beech woods in damp places, in leaf litter near streams, often in large groups. Hard to spot in leaves.',
    },
    features: {
      sk: ['Tvar trúbky / lievika, dutý až po základňu', 'Vnútro čiernohnedé, vonkajšok sivý, hladký (bez lupeňov)', 'Tenká, kožovitá dužina'],
      en: ['Trumpet/funnel shape, hollow to the base', 'Inside black-brown, outside grey and smooth (no gills)', 'Thin, leathery flesh'],
    },
    lookalikes: [],
  },
  {
    id: 'macrolepiota-procera', latin: 'Macrolepiota procera', sk: 'Bedľa vysoká', en: 'Parasol mushroom',
    edibility: 'choice', season: [7, 10], peak: [8, 9], temp: [10, 14, 22, 27], rain: 25,
    habitats: ['meadow', 'deciduous', 'coniferous'], hosts: ['grass'], altitude: [100, 1300],
    where: {
      sk: 'Lúky a pasienky pri lese, okraje lesov, svetlé listnaté a zmiešané lesy, čistiny a rúbaniská.',
      en: 'Meadows and pastures near forests, forest edges, light broadleaf and mixed woods, clearings.',
    },
    features: {
      sk: ['Klobúk veľký (10–30 cm) so šupinami, v strede hnedý hrboľ', 'Hlúbik vysoký, s hadím (zebrovaným) vzorom', 'Dvojitý POSUVNÝ prsteň', 'Lupene biele, voľné; bez pošvy na báze'],
      en: ['Large cap (10–30 cm) with scales and a brown central bump', 'Tall stem with snake-skin pattern', 'Double MOVABLE ring', 'Gills white, free; no volva at the base'],
    },
    lookalikes: [
      zelena({ sk: 'Mladá „paličková“ bedľa sa dá zameniť s muchotrávkou! Muchotrávka má hladký zelenkastý klobúk, pevný prsteň a na báze POŠVU (vajce). Zbierajte len roztvorené, typické bedle.', en: 'Young drumstick parasols can be confused with Amanitas! Death cap has a smooth greenish cap, fixed ring and a VOLVA (sac) at the base. Pick only open, typical parasols.' }),
      { latin: 'Lepiota cristata', sk: 'Bedlička hrebenitá', en: 'Stinking dapperling', edibility: 'toxic', diff: { sk: 'Malé bedličky (do 10 cm) sú jedovaté, niektoré smrteľne. Zbierajte len veľké bedle.', en: 'Small parasols (under 10 cm) are toxic, some deadly. Pick only large specimens.' } },
    ],
  },
  {
    id: 'agaricus-campestris', latin: 'Agaricus campestris', sk: 'Pečiarka poľná (šampiňón)', en: 'Field mushroom',
    edibility: 'edible', season: [6, 10], peak: [8, 9], temp: [10, 13, 22, 27], rain: 20,
    habitats: ['meadow'], hosts: ['grass'], altitude: [100, 1200],
    where: {
      sk: 'Hnojené lúky a pasienky, kde sa pásol dobytok alebo kone, záhrady. Nie v lese.',
      en: 'Manured meadows and pastures grazed by cattle or horses, gardens. Not in forest.',
    },
    features: {
      sk: ['Lupene najprv RUŽOVÉ, potom čokoládovohnedé až čierne', 'Jednoduchý tenký prsteň, bez pošvy', 'Dužina biela, slabo ružovie, vonia hubovo/anízovo'],
      en: ['Gills first PINK, then chocolate brown to black', 'Simple thin ring, no volva', 'Flesh white, slightly pinkish, mushroomy/aniseed smell'],
    },
    lookalikes: [
      zelena({ sk: 'Lupene vždy BIELE, na báze pošva. Smrteľne jedovatá – aj muchotrávka jedovatá (Amanita virosa), ktorá je celá biela.', en: 'Gills always WHITE, volva at the base. Deadly – the destroying angel (Amanita virosa) is entirely white.' }),
      { latin: 'Agaricus xanthodermus', sk: 'Pečiarka žltnúca', en: 'Yellow stainer', edibility: 'toxic', diff: { sk: 'Báza hlúbika po rozrezaní okamžite ŽLTNE, zapácha atramentom/fenolom.', en: 'Stem base instantly turns YELLOW when cut, smells of ink/phenol.' } },
    ],
  },
  {
    id: 'calocybe-gambosa', latin: 'Calocybe gambosa', sk: 'Čírovka májová', en: "St George's mushroom",
    edibility: 'edible', season: [4, 6], peak: [5, 5], temp: [5, 9, 16, 21], rain: 20,
    habitats: ['meadow', 'deciduous'], hosts: ['grass', 'fruit'], altitude: [100, 1000],
    where: {
      sk: 'Na jar v kruhoch na lúkach, v sadoch, pri kroch (trnka, hloh), okraje listnatých lesov.',
      en: 'In spring, in rings in meadows, orchards, near shrubs (blackthorn, hawthorn), edges of broadleaf woods.',
    },
    features: {
      sk: ['Celá biela až krémová, mäsitá', 'Lupene husté, biele', 'Silná múčna vôňa (ako čerstvé cesto/uhorka)', 'Rastie v apríli–máji, keď iné huby ešte nerastú'],
      en: ['Entirely white to cream, fleshy', 'Gills crowded, white', 'Strong mealy smell (fresh dough/cucumber)', 'Fruits in April–May when little else grows'],
    },
    lookalikes: [
      { latin: 'Inocybe erubescens', sk: 'Vláknica Patouillardova', en: 'Deadly fibrecap', edibility: 'deadly', diff: { sk: 'Rastie v rovnakom čase! Klobúk kužeľovitý, vláknitý, na otlak ČERVENIE, nemá múčnu vôňu. Muskarín – môže byť smrteľná.', en: 'Same season! Cap conical, fibrous, bruises RED, no mealy smell. Muscarine – can be fatal.' } },
      { latin: 'Entoloma sinuatum', sk: 'Hodvábnica jedovatá', en: 'Livid pinkgill', edibility: 'toxic', diff: { sk: 'Lupene neskôr RUŽOVÉ, klobúk sivastý; ťažké otravy.', en: 'Gills become PINK, cap greyish; severe poisoning.' } },
    ],
  },
  {
    id: 'morchella-esculenta', latin: 'Morchella esculenta', sk: 'Smrčok jedlý', en: 'Yellow morel',
    edibility: 'choice', season: [3, 5], peak: [4, 4], temp: [4, 8, 15, 20], rain: 20,
    habitats: ['deciduous', 'meadow'], hosts: ['ash', 'elm', 'fruit'], altitude: [100, 800],
    where: {
      sk: 'Na jar v lužných lesoch pod jaseňmi a brestmi, staré sady (jablone), násypy, okraje potokov, vápenité pôdy.',
      en: 'In spring in floodplain forests under ash and elm, old orchards (apple), embankments, stream banks, calcareous soils.',
    },
    features: {
      sk: ['Klobúk vajcovitý, s jamkami ako plást', 'Klobúk zrastený s hlúbikom', 'Po pozdĺžnom rozrezaní celý DUTÝ (jedna dutina)'],
      en: ['Cap egg-shaped with honeycomb pits', 'Cap fused to the stem', 'Completely HOLLOW when cut lengthwise (single chamber)'],
    },
    lookalikes: [
      { latin: 'Gyromitra esculenta', sk: 'Ušiak obyčajný', en: 'False morel', edibility: 'deadly', diff: { sk: 'Klobúk nepravidelne zvlnený ako mozog (nie jamky), vnútri komôrkový, nie jednoducho dutý. Obsahuje gyromitrín – smrteľne jedovatý.', en: 'Cap brain-like and lobed (not pitted), chambered inside, not simply hollow. Contains gyromitrin – deadly.' } },
    ],
    note: { sk: 'Smrčky jedzte len dobre tepelne upravené.', en: 'Eat morels only well cooked.' },
  },
  {
    id: 'marasmius-oreades', latin: 'Marasmius oreades', sk: 'Tanečnica poľná', en: 'Fairy ring champignon',
    edibility: 'edible', season: [5, 10], peak: [6, 9], temp: [10, 14, 23, 28], rain: 15,
    habitats: ['meadow'], hosts: ['grass'], altitude: [100, 1500],
    where: {
      sk: 'V kruhoch na kosených lúkach, trávnikoch, pasienkoch a pri cestách. Rastie hneď po daždi, aj v lete.',
      en: 'In rings on mown meadows, lawns, pastures and roadsides. Appears right after rain, even in summer.',
    },
    features: {
      sk: ['Malá huba (klobúk 2–5 cm), svetlookrovej farby, s hrboľom', 'Lupene RIEDKE, široké', 'Hlúbik tenký, húževnatý – dá sa skrútiť bez zlomenia'],
      en: ['Small (cap 2–5 cm), pale tan, with central bump', 'Gills DISTANT, broad', 'Stem thin and tough – can be twisted without breaking'],
    },
    lookalikes: [
      { latin: 'Clitocybe rivulosa', sk: 'Strmuľka biela', en: 'Fool’s funnel', edibility: 'deadly', diff: { sk: 'Rastie na tých istých lúkach! Biela, lupene HUSTÉ a zbiehavé, hlúbik krehký. Obsahuje muskarín.', en: 'Grows on the same lawns! White, gills CROWDED and decurrent, stem brittle. Contains muscarine.' } },
    ],
  },
  {
    id: 'lycoperdon-perlatum', latin: 'Lycoperdon perlatum', sk: 'Prášnica bradavičnatá', en: 'Common puffball',
    edibility: 'edible', season: [6, 11], peak: [8, 10], temp: [8, 12, 20, 26], rain: 20,
    habitats: ['deciduous', 'coniferous', 'meadow'], hosts: ['spruce', 'beech', 'grass'], altitude: [100, 1600],
    where: {
      sk: 'Takmer všade – v lesoch na zemi a pri chodníkoch, na lúkach.',
      en: 'Almost everywhere – on the forest floor, along paths, in meadows.',
    },
    features: {
      sk: ['Hruškovitý tvar, biela, s kužeľovitými bradavkami', 'Jedlá len MLADÁ – vnútri úplne biela a pevná', 'Neskôr vnútri žltne a mení sa na hnedý prach'],
      en: ['Pear-shaped, white with cone-shaped warts', 'Edible only YOUNG – completely white and firm inside', 'Later turns yellow and becomes brown powder'],
    },
    lookalikes: [
      { latin: 'Scleroderma citrinum', sk: 'Pestrec obyčajný', en: 'Common earthball', edibility: 'toxic', diff: { sk: 'Hrubá žltohnedá šupinatá koža, vnútri čoskoro FIALOVOČIERNY.', en: 'Thick yellowish scaly skin, inside soon PURPLE-BLACK.' } },
      zelena({ sk: 'Mladé „vajíčko“ muchotrávky! Vždy rozrežte pozdĺžne – ak vidíte obrys klobúka a lupeňov, je to muchotrávka.', en: 'Young Amanita “egg”! Always cut lengthwise – if you see the outline of a cap and gills, it is an Amanita.' }),
    ],
  },
  {
    id: 'coprinus-comatus', latin: 'Coprinus comatus', sk: 'Hnojník obyčajný', en: 'Shaggy ink cap',
    edibility: 'edible', season: [5, 11], peak: [9, 10], temp: [5, 9, 18, 24], rain: 20,
    habitats: ['meadow'], hosts: ['grass'], altitude: [100, 1200],
    where: {
      sk: 'Okraje ciest, trávniky, hnojené lúky, rumoviská. Mimo lesa.',
      en: 'Roadsides, lawns, manured grassland, disturbed ground. Outside forest.',
    },
    features: {
      sk: ['Klobúk valcovitý, biely s odstávajúcimi šupinami', 'Lupene biele, rýchlo ružovejú a rozkladajú sa na čierny „atrament“', 'Jedlý len mladý (biele lupene), spracovať hneď'],
      en: ['Cap cylindrical, white with shaggy scales', 'Gills white, quickly turning pink then dissolving into black “ink”', 'Edible only young (white gills), cook immediately'],
    },
    lookalikes: [
      { latin: 'Coprinopsis atramentaria', sk: 'Hnojník atramentový', en: 'Common ink cap', edibility: 'toxic', diff: { sk: 'Sivý hladký klobúk bez šupín. S ALKOHOLOM (aj 2–3 dni potom) spôsobuje otravu.', en: 'Grey smooth cap without scales. Poisonous with ALCOHOL (even 2–3 days later).' } },
    ],
  },
  {
    id: 'amanita-rubescens', latin: 'Amanita rubescens', sk: 'Muchotrávka červenkastá (Prašivka)', en: 'Blusher',
    edibility: 'caution', season: [6, 10], peak: [7, 9], temp: [10, 14, 22, 27], rain: 25,
    habitats: ['deciduous', 'coniferous'], hosts: ['spruce', 'pine', 'beech', 'oak'], altitude: [100, 1500],
    where: { sk: 'Takmer všetky typy lesov, veľmi bežná.', en: 'Almost all forest types, very common.' },
    features: {
      sk: ['Klobúk ružovohnedý so sivými zvyškami plachtičky', 'Dužina a otlaky ČERVENEJÚ (najmä v hlúbiku a v požerkoch)', 'Prsteň ryhovaný na hornej strane'],
      en: ['Cap pinkish-brown with greyish veil patches', 'Flesh and bruises turn PINK-RED (especially in the stem and insect holes)', 'Ring striated on its upper surface'],
    },
    lookalikes: [
      { latin: 'Amanita pantherina', sk: 'Muchotrávka tigrovaná', en: 'Panther cap', edibility: 'toxic', diff: { sk: 'Biele bradavky, dužina NEčervenie, prsteň hladký, na báze golierik. Ťažká otrava.', en: 'Pure white warts, flesh does NOT redden, ring smooth, collar-like rim on the bulb. Serious poisoning.' } },
    ],
    note: { sk: 'Len pre skúsených! Surová je jedovatá, musí sa dôkladne tepelne upraviť.', en: 'Experts only! Toxic raw, must be thoroughly cooked.' },
  },
  {
    id: 'russula-cyanoxantha', latin: 'Russula cyanoxantha', sk: 'Plávka modrastá', en: 'Charcoal burner',
    edibility: 'edible', season: [6, 10], peak: [7, 9], temp: [10, 14, 22, 27], rain: 25,
    habitats: ['deciduous'], hosts: ['beech', 'oak', 'hornbeam'], altitude: [100, 1000],
    where: { sk: 'Bukové a dubové lesy, bežná.', en: 'Beech and oak woods, common.' },
    features: {
      sk: ['Klobúk fialovo-zelenkastý, pestro sfarbený', 'Lupene biele, pružné, mastné na dotyk (nelámu sa ako pri iných plávkach)', 'Bez prsteňa a bez pošvy, dužina krehká, chuť mierna'],
      en: ['Cap mix of violet and greenish shades', 'Gills white, flexible and greasy (not brittle like other brittlegills)', 'No ring, no volva, brittle flesh, mild taste'],
    },
    lookalikes: [
      zelena({ sk: 'Zelenkastý klobúk podobný! Muchotrávka má na hlúbiku PRSTEŇ a na báze POŠVU – vždy vyberte hubu aj s bázou.', en: 'Similar greenish cap! Death cap has a RING and a VOLVA at the base – always dig out the whole base.' }),
    ],
  },
  {
    id: 'lactarius-deliciosus', latin: 'Lactarius deliciosus', sk: 'Rýdzik pravý', en: 'Saffron milk cap',
    edibility: 'choice', season: [7, 10], peak: [8, 9], temp: [6, 10, 17, 23], rain: 25,
    habitats: ['coniferous'], hosts: ['pine'], altitude: [100, 1200],
    where: { sk: 'Pod borovicami na vápenitých aj piesočných pôdach, v tráve pri mladých borovicách.', en: 'Under pines on calcareous or sandy soils, in grass near young pines.' },
    features: {
      sk: ['Klobúk oranžový so sústrednými kruhmi, lievikovitý', 'Pri poranení roní MRKVOVOORANŽOVÉ mlieko', 'Otlaky a staré huby ZELENAJÚ'],
      en: ['Cap orange with concentric zones, funnel-shaped', 'Exudes CARROT-ORANGE milk when cut', 'Bruises and old specimens turn GREEN'],
    },
    lookalikes: [
      { latin: 'Lactarius torminosus', sk: 'Rýdzik kravský', en: 'Woolly milkcap', edibility: 'toxic', diff: { sk: 'Okraj klobúka chlpatý, mlieko BIELE a pálivé; rastie pod brezou.', en: 'Hairy cap margin, WHITE acrid milk; grows under birch.' } },
    ],
  },
  {
    id: 'lactarius-deterrimus', latin: 'Lactarius deterrimus', sk: 'Rýdzik smrekový', en: 'False saffron milkcap',
    edibility: 'edible', season: [7, 10], peak: [8, 9], temp: [6, 10, 17, 23], rain: 25,
    habitats: ['coniferous'], hosts: ['spruce'], altitude: [300, 1500],
    where: { sk: 'Pod smrekmi, najmä v mladých smrečinách a pri okrajoch lesov.', en: 'Under spruce, especially in young spruce stands and forest edges.' },
    features: {
      sk: ['Oranžový klobúk, rýchlo zelenajúci', 'Oranžové mlieko, ktoré do 10 min sčervenie', 'Hlúbik bez jamiek'],
      en: ['Orange cap, quickly turning green', 'Orange milk turning red within 10 min', 'Stem without pits'],
    },
    lookalikes: [
      { latin: 'Lactarius torminosus', sk: 'Rýdzik kravský', en: 'Woolly milkcap', edibility: 'toxic', diff: { sk: 'Biele mlieko a chlpatý okraj klobúka.', en: 'White milk and hairy cap margin.' } },
    ],
  },
  {
    id: 'sparassis-crispa', latin: 'Sparassis crispa', sk: 'Kotrč kučeravý', en: 'Cauliflower fungus',
    edibility: 'choice', season: [8, 10], peak: [9, 9], temp: [8, 12, 19, 24], rain: 25,
    habitats: ['coniferous', 'wood'], hosts: ['pine', 'spruce'], altitude: [200, 1300],
    where: { sk: 'Na báze kmeňov a pňov BOROVÍC, každý rok na tom istom mieste.', en: 'At the base of PINE trunks and stumps, in the same spot every year.' },
    features: {
      sk: ['Kučeravý „karfiol“ alebo „špongia“ zo zvlnených lístkov', 'Krémovo biely až žltkastý', 'Veľký – aj niekoľko kg'],
      en: ['Curly “cauliflower/sponge” of wavy lobes', 'Creamy white to yellowish', 'Large – can weigh several kg'],
    },
    lookalikes: [],
  },
  {
    id: 'laetiporus-sulphureus', latin: 'Laetiporus sulphureus', sk: 'Sírovec obyčajný', en: 'Chicken of the woods',
    edibility: 'caution', season: [5, 9], peak: [5, 7], temp: [10, 14, 24, 30], rain: 15,
    habitats: ['wood'], hosts: ['oak', 'willow', 'fruit', 'aspen'], altitude: [100, 800],
    where: { sk: 'Na kmeňoch živých aj odumretých dubov, vŕb, topoľov a čerešní – v lužných lesoch, sadoch, pri vode.', en: 'On living and dead trunks of oak, willow, poplar and cherry – floodplain woods, orchards, near water.' },
    features: {
      sk: ['Veľké prekrývajúce sa konzoly', 'Vrch oranžový, spodok sírovožltý s pórmi', 'Jedlé len mladé mäkké okraje'],
      en: ['Large overlapping brackets', 'Top orange, underside sulphur-yellow with pores', 'Only young soft edges are edible'],
    },
    lookalikes: [],
    note: { sk: 'Nezbierajte z tisu ani ihličnanov. Vždy dobre tepelne upraviť, u niektorých ľudí spôsobuje alergie.', en: 'Do not collect from yew or conifers. Always cook thoroughly; some people react allergically.' },
  },
  {
    id: 'armillaria-mellea', latin: 'Armillaria mellea', sk: 'Podpňovka obyčajná', en: 'Honey fungus',
    edibility: 'caution', season: [9, 11], peak: [10, 10], temp: [4, 8, 15, 20], rain: 25,
    habitats: ['wood', 'deciduous', 'coniferous'], hosts: ['beech', 'oak', 'spruce', 'fruit'], altitude: [100, 1300],
    where: { sk: 'V hustých trsoch na pňoch a koreňoch listnáčov aj ihličnanov, v sadoch. Rastie vo „vlnách“ po prvých jesenných ochladeniach.', en: 'In dense clusters on stumps and roots of broadleaf and conifer trees, in orchards. Comes in “flushes” after the first autumn cool-down.' },
    features: {
      sk: ['Klobúk medovožltý až hnedý s tmavými šupinkami v strede', 'Biely blanitý prsteň', 'Výtrusný prach BIELY', 'Rastie v trsoch na dreve'],
      en: ['Cap honey-yellow to brown with dark scales in the centre', 'White membranous ring', 'Spore print WHITE', 'Grows in clusters on wood'],
    },
    lookalikes: [
      kapucnovka({ sk: 'Menšia, hnedá, prsteň slabý, výtrusný prach HRDZAVOHNEDÝ, rastie na tlejúcom dreve. Obsahuje amanitíny (ako muchotrávka zelená)!', en: 'Smaller, brown, weak ring, RUSTY-BROWN spore print, on rotting wood. Contains amatoxins (like the death cap)!' }),
      { latin: 'Hypholoma fasciculare', sk: 'Strapcovka zväzkovitá', en: 'Sulphur tuft', edibility: 'toxic', diff: { sk: 'Sírovožltá, lupene zelenkasto-žlté, bez prsteňa, veľmi horká.', en: 'Sulphur yellow, greenish-yellow gills, no ring, very bitter.' } },
    ],
    note: { sk: 'Surová je jedovatá – vždy povariť a vodu vyliať, potom tepelne upraviť.', en: 'Toxic raw – always blanch, discard the water, then cook.' },
  },
  {
    id: 'pleurotus-ostreatus', latin: 'Pleurotus ostreatus', sk: 'Hliva ustricovitá', en: 'Oyster mushroom',
    edibility: 'edible', season: [10, 3], peak: [11, 12], temp: [-3, 2, 10, 15], rain: 15, frostTolerant: true,
    habitats: ['wood', 'deciduous'], hosts: ['beech', 'aspen', 'willow'], altitude: [100, 1000],
    where: { sk: 'Na odumretých kmeňoch a pňoch bukov, topoľov, vŕb – lužné lesy, brehy riek. Rastie po prvých mrazoch, aj počas oteplenia v zime.', en: 'On dead trunks and stumps of beech, poplar, willow – floodplain woods, river banks. Appears after the first frosts and in winter thaws.' },
    features: {
      sk: ['Ustricovité klobúky v strieškovitých trsoch', 'Sivé až modrosivé', 'Lupene biele, zbiehajú na krátky bočný hlúbik', 'Príjemná hubová vôňa'],
      en: ['Oyster-shaped caps in shelving clusters', 'Grey to bluish-grey', 'White gills running down to a short lateral stem', 'Pleasant mushroomy smell'],
    },
    lookalikes: [],
  },
  {
    id: 'flammulina-velutipes', latin: 'Flammulina velutipes', sk: 'Plamienka zimná', en: 'Velvet shank',
    edibility: 'edible', season: [11, 3], peak: [12, 2], temp: [-5, 0, 8, 13], rain: 10, frostTolerant: true,
    habitats: ['wood'], hosts: ['willow', 'aspen', 'elm', 'ash'], altitude: [100, 1000],
    where: { sk: 'V zime na odumretom dreve vŕb, topoľov, brestov – pri vodných tokoch. Znáša mráz, po roztopení rastie ďalej.', en: 'In winter on dead willow, poplar, elm wood – near watercourses. Survives frost and keeps growing after thawing.' },
    features: {
      sk: ['Klobúk oranžovohnedý, lepkavý', 'Hlúbik zamatový, k báze tmavohnedý až čierny', 'Rastie v trsoch na dreve v zime'],
      en: ['Cap orange-brown, sticky', 'Stem velvety, dark brown to black towards the base', 'Grows in clusters on wood in winter'],
    },
    lookalikes: [kapucnovka({ sk: 'Má prsteň (alebo jeho zvyšok), hlúbik nie je zamatový ani čierny, hrdzavohnedý výtrusný prach. Smrteľne jedovatá.', en: 'Has a ring (or its remnant), stem not velvety or black, rusty-brown spore print. Deadly.' })],
  },
  // Dangerous species – shown so people know they are fruiting too.
  {
    id: 'amanita-phalloides', latin: 'Amanita phalloides', sk: 'Muchotrávka zelená', en: 'Death cap',
    edibility: 'deadly', season: [7, 10], peak: [8, 9], temp: [10, 14, 22, 27], rain: 25,
    habitats: ['deciduous'], hosts: ['oak', 'beech', 'hornbeam'], altitude: [100, 900],
    where: { sk: 'Teplé listnaté lesy s dubom, bukom a hrabom, parky. Príčina väčšiny smrteľných otráv hubami.', en: 'Warm broadleaf woods with oak, beech and hornbeam, parks. Cause of most fatal mushroom poisonings.' },
    features: {
      sk: ['Klobúk olivovozelený až žltozelený, hladký', 'Lupene VŽDY biele', 'Prsteň na hlúbiku', 'Na báze blanitá POŠVA (vajce) – často skrytá v zemi'],
      en: ['Cap olive-green to yellowish, smooth', 'Gills ALWAYS white', 'Ring on the stem', 'Membranous VOLVA (sac) at the base – often hidden in soil'],
    },
    lookalikes: [],
    note: { sk: 'Už jedna huba môže zabiť. Príznaky nastupujú až po 6–24 hodinách. Pri podozrení volajte 112 / Národné toxikologické informačné centrum: +421 2 5477 4166.', en: 'A single mushroom can kill. Symptoms appear only after 6–24 hours. If in doubt call 112 / Slovak toxicology centre: +421 2 5477 4166.' },
  },
  {
    id: 'amanita-muscaria', latin: 'Amanita muscaria', sk: 'Muchotrávka červená', en: 'Fly agaric',
    edibility: 'toxic', season: [7, 11], peak: [8, 10], temp: [6, 10, 18, 23], rain: 25,
    habitats: ['coniferous', 'deciduous'], hosts: ['birch', 'spruce', 'pine'], altitude: [200, 1700],
    where: { sk: 'Pod brezami a smrekmi. Jej výskyt často signalizuje, že rastú aj hríby smrekové (rovnaké podmienky).', en: 'Under birch and spruce. Its presence often signals ceps fruiting too (same conditions).' },
    features: {
      sk: ['Červený klobúk s bielymi bradavkami', 'Biele lupene a prsteň', 'Hľuznatá báza s kruhmi bradaviek'],
      en: ['Red cap with white warts', 'White gills and ring', 'Bulbous base with rings of warts'],
    },
    lookalikes: [],
  },
  {
    id: 'amanita-pantherina', latin: 'Amanita pantherina', sk: 'Muchotrávka tigrovaná', en: 'Panther cap',
    edibility: 'toxic', season: [6, 10], peak: [7, 9], temp: [10, 14, 22, 27], rain: 25,
    habitats: ['deciduous', 'coniferous'], hosts: ['beech', 'oak', 'spruce', 'pine'], altitude: [100, 1200],
    where: { sk: 'Listnaté aj ihličnaté lesy. Zamieňa sa s muchotrávkou červenkastou.', en: 'Broadleaf and coniferous woods. Confused with the blusher.' },
    features: {
      sk: ['Hnedý klobúk s čisto BIELYMI bradavkami a ryhovaným okrajom', 'Prsteň hladký (bez rýh)', 'Dužina nečervenie'],
      en: ['Brown cap with pure WHITE warts and striate margin', 'Ring smooth (not striated)', 'Flesh does not redden'],
    },
    lookalikes: [],
  },
];

export const SPECIES_BY_ID = Object.fromEntries(SPECIES.map((s) => [s.id, s]));
