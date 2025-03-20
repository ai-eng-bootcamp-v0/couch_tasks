export type EffortLevel = 1 | 2 | 3;

export interface Listing {
  id: string;
  city: string;
  country: string;
  effort_level: EffortLevel;
  image_url?: string;
  description?: string;
}
