import { useT } from '../i18n';

const CONTENT = {
  sk: {
    title: 'Ako sa počíta šanca nájsť huby',
    intro: 'Plodnice húb (to, čo zbierame) sú len „ovocie“ podzemného podhubia. Podhubie vytvára plodnice, keď súčasne platí niekoľko podmienok. Aplikácia každú z nich vyhodnotí na stupnici 0–1 a vynásobí ich – stačí jedna nesplnená podmienka a huby nerastú (Liebigov zákon minima).',
    factors: [
      ['Sezóna (fenológia)', 'Každý druh plodí v typických mesiacoch – smrčky na jar, hríby v lete a na jeseň, hlivy v zime. Hodnota je najvyššia v hlavnej sezóne a plynulo klesá na jej okrajoch.'],
      ['Zrážky – vlaha', 'Najdôležitejší faktor. Plodnice sa objavujú najčastejšie 5–14 dní po výdatnom daždi. Zrážky v tomto okne sa počítajú naplno, staršie (15–21 dní) a úplne čerstvé (0–2 dni) len čiastočne. Hríby potrebujú za toto obdobie približne 30–35 mm, drevokazné druhy menej.'],
      ['Vlhkosť pôdy a vzduchu', 'Model Open-Meteo dáva objemovú vlhkosť pôdy v hĺbke 3–9 cm. Pod ~12 % je pôda pre huby príliš suchá, nad ~28 % je ideálna. Veľmi suchý vzduch (relatívna vlhkosť pod 60 %) plodnice vysušuje.'],
      ['Teplota vzduchu a pôdy', 'Priemerná teplota za posledných 7 dní a teplota pôdy v hĺbke 6 cm. Každý druh má svoj teplotný rozsah: napr. hríb smrekový 11–18 °C, kuriatko 15–22 °C, plamienka zimná 0–8 °C. Mimo rozsahu šanca lineárne klesá k nule.'],
      ['Mráz a horúčavy', 'Mrazivé noci (pod −1 °C) zastavia rast väčšiny druhov; zimné druhy (hliva, plamienka) mráz znesú. Viac dní nad 30 °C pôdu vysušuje.'],
      ['Porast (typ lesa)', 'Väčšina jedlých húb žije v symbióze (mykoríze) s konkrétnymi drevinami – kozák brezový len pod brezou, masliak smrekovcový len pod smrekovcom. Typ lesa v okruhu 2 km sa zisťuje zo satelitnej vrstvy Copernicus „Dominant Leaf Type“ (rozlíšenie 10 m: listnaté / ihličnaté / bez stromov), záložne z OpenStreetMap. Ak poznáte porast lepšie, zvoľte ho ručne.'],
      ['Nadmorská výška', 'Výška z digitálneho modelu terénu. Teplomilné druhy (hríb dubový, muchotrávka zelená) rastú najmä v nížinách a pahorkatinách, iné až do hôr.'],
      ['Skutočné nálezy v okolí', 'Pozorovania z iNaturalist v okruhu 25 km (všetky roky) a 50 km (posledných 14 dní). Ak je druh v okolí zaznamenaný, šanca mierne stúpa; čerstvé nálezy znamenajú, že plodnice práve rastú. Body na mape ukazujú, kde konkrétne ľudia huby našli.'],
    ],
    notIncluded: 'Čo zámerne nepočítame: fázy Mesiaca – vedecké štúdie nepreukázali ich vplyv na rast húb.',
    limits: 'Obmedzenia: výsledok je odhad, nie kalibrovaná pravdepodobnosť. Lokálne podmienky (svah, expozícia, pH pôdy, vek porastu, či ste prví na mieste) model nepozná. Úroda húb sa navyše medzi rokmi veľmi líši.',
    rulesTitle: 'Zásady zberu',
    rules: [
      'Zbierajte len huby, ktoré s istotou poznáte. Aplikácia nenahrádza znalca – pri pochybnostiach navštívte hubársku poradňu.',
      'Hubu vyberte celú aj s bázou hlúbika (pošva muchotrávok!), potom dieru zahrňte.',
      'Používajte košík, nie igelitovú tašku – huby sa v nej zaparia a pokazia.',
      'Nezbierajte staré, prezreté, plesnivé ani zamrznuté huby a huby pri cestách a skládkach.',
      'Rešpektujte chránené územia – v rezerváciách a v zónach s najvyšším stupňom ochrany je zber zakázaný.',
      'Pri podozrení na otravu volajte 112 alebo Národné toxikologické informačné centrum +421 2 5477 4166; odložte zvyšky húb na určenie.',
    ],
    refsTitle: 'Odborná literatúra',
  },
  en: {
    title: 'How the chance of finding mushrooms is calculated',
    intro: 'Mushrooms are only the “fruit” of the underground mycelium. The mycelium fruits when several conditions are met at once. The app rates each of them from 0 to 1 and multiplies them – one unmet condition is enough to stop fruiting (Liebig’s law of the minimum).',
    factors: [
      ['Season (phenology)', 'Each species fruits in typical months – morels in spring, ceps in summer and autumn, oysters in winter. The value is highest in the main season and decreases smoothly at its edges.'],
      ['Rain – moisture', 'The most important factor. Fruit bodies appear mostly 5–14 days after a soaking rain. Rain in this window counts fully, older (15–21 days) and very fresh (0–2 days) rain partially. Ceps need about 30–35 mm in this period, wood-decay species less.'],
      ['Soil and air humidity', 'Open-Meteo provides volumetric soil moisture at 3–9 cm. Below ~12% the soil is too dry, above ~28% it is ideal. Very dry air (relative humidity below 60%) dries out the fruit bodies.'],
      ['Air and soil temperature', 'The mean temperature of the last 7 days and soil temperature at 6 cm. Every species has its range: e.g. penny bun 11–18 °C, chanterelle 15–22 °C, velvet shank 0–8 °C. Outside the range the chance falls linearly to zero.'],
      ['Frost and heat', 'Frost nights (below −1 °C) stop most species; winter species (oyster, velvet shank) tolerate frost. Several days above 30 °C dry out the soil.'],
      ['Vegetation (forest type)', 'Most edible mushrooms live in symbiosis (mycorrhiza) with specific trees – the birch bolete only under birch, the larch bolete only under larch. The forest type within 2 km is read from the Copernicus “Dominant Leaf Type” satellite layer (10 m: broadleaf / conifer / no trees), with OpenStreetMap as fallback. If you know the stand better, choose it manually.'],
      ['Altitude', 'Elevation from a digital terrain model. Thermophilic species (summer cep, death cap) grow mainly in lowlands and hills, others up to the mountains.'],
      ['Real finds nearby', 'iNaturalist observations within 25 km (all years) and 50 km (last 14 days). If the species has been recorded nearby, the chance rises slightly; fresh finds mean fruiting is happening now. Map points show where people actually found mushrooms.'],
    ],
    notIncluded: 'Deliberately not included: moon phases – scientific studies have not shown an effect on mushroom fruiting.',
    limits: 'Limitations: the result is an estimate, not a calibrated probability. Local conditions (slope, aspect, soil pH, stand age, whether someone was there first) are unknown to the model. Mushroom yields also vary greatly between years.',
    rulesTitle: 'Foraging rules',
    rules: [
      'Only pick mushrooms you can identify with certainty. The app does not replace an expert – when in doubt, visit a mushroom advisory centre.',
      'Take the whole mushroom including the stem base (Amanita volva!), then cover the hole.',
      'Use a basket, not a plastic bag – mushrooms sweat and spoil in it.',
      'Do not pick old, overripe, mouldy or frozen mushrooms or ones next to roads and dumps.',
      'Respect protected areas – picking is banned in reserves and in zones with the highest protection level.',
      'In case of suspected poisoning call 112 or the Slovak toxicology centre +421 2 5477 4166; keep leftovers for identification.',
    ],
    refsTitle: 'Scientific literature',
  },
};

const REFS = [
  'Kauserud H. et al. (2008) Mushroom fruiting and climate change. PNAS 105: 3811–3814.',
  'Krebs C.J. et al. (2008) Mushroom crops in relation to weather in the southwestern Yukon. Botany 86: 1497–1502.',
  'Büntgen U., Kauserud H., Egli S. (2012) Linking climate variability to mushroom productivity and phenology. Frontiers in Ecology and the Environment 10: 14–19.',
  'Boddy L. et al. (2014) Climate variation effects on fungal fruiting. Fungal Ecology 10: 20–33.',
  'Alday J.G. et al. (2017) Mushroom biomass and diversity are driven by different spatio-temporal scales along Mediterranean elevation gradients. Scientific Reports 7: 45824.',
];

export default function Method() {
  const { lang } = useT();
  const c = CONTENT[lang];
  return (
    <article className="card prose">
      <h2>{c.title}</h2>
      <p>{c.intro}</p>
      <ol>
        {c.factors.map(([h, p]) => <li key={h}><b>{h}.</b> {p}</li>)}
      </ol>
      <p className="formula">{lang === 'sk'
        ? <>šanca = sezóna × vlaha<sup>0,9</sup> × teplota<sup>0,8</sup> × mráz × horúčavy × porast × výška × nálezy</>
        : <>chance = season × moisture<sup>0.9</sup> × temperature<sup>0.8</sup> × frost × heat × habitat × altitude × local finds</>}</p>
      <p>{c.notIncluded}</p>
      <p className="muted">{c.limits}</p>
      <h3>{c.rulesTitle}</h3>
      <ul>{c.rules.map((r) => <li key={r}>{r}</li>)}</ul>
      <h3>{c.refsTitle}</h3>
      <ul className="small">{REFS.map((r) => <li key={r}>{r}</li>)}</ul>
    </article>
  );
}
