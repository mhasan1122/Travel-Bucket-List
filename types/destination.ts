export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  isInBucketList: boolean;
  isVisited: boolean;
  dateAdded: string;
  dateVisited?: string;
  notes?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}