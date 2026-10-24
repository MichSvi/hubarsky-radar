export type Lang = 'sk' | 'en';
export type Text = { sk: string; en: string };
export type TextList = { sk: string[]; en: string[] };

export type Edibility = 'choice' | 'edible' | 'caution' | 'inedible' | 'toxic' | 'deadly';

/** Where the fruit bodies grow. 'wood' = on wood (stumps, trunks), independent of forest type. */
export type Habitat = 'deciduous' | 'coniferous' | 'meadow' | 'wood';

export type Tree =
  | 'spruce' | 'pine' | 'fir' | 'larch' | 'beech' | 'oak' | 'hornbeam' | 'birch'
  | 'aspen' | 'willow' | 'ash' | 'elm' | 'fruit' | 'grass';

export interface Lookalike {
  latin: string;
  sk: string;
  en: string;
  edibility: Edibility;
  diff: Text;
}

export interface Species {
  id: string;
  latin: string;
  sk: string;
  en: string;
  edibility: Edibility;
  /** Months (1–12) when fruiting is possible; start may be > end for winter species. */
  season: [number, number];
  /** Months of main fruiting. */
  peak: [number, number];
  /** Daily mean air temperature profile °C: [min, optimum low, optimum high, max]. */
  temp: [number, number, number, number];
  /** Weighted rain (mm) over the previous ~3 weeks needed for full score. */
  rain: number;
  /** Fruiting continues (or is triggered) after frosts. */
  frostTolerant?: boolean;
  habitats: Habitat[];
  hosts: Tree[];
  /** Typical altitude range in metres. */
  altitude: [number, number];
  where: Text;
  features: TextList;
  lookalikes: Lookalike[];
  note?: Text;
}
