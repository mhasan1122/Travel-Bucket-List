import { Destination } from '@/types/destination';

export const sampleDestinations: Destination[] = [
  {
    id: '1',
    name: 'Santorini',
    country: 'Greece',
    description: 'Famous for its stunning sunsets, white-washed buildings, and blue domes.',
    imageUrl: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg',
    isInBucketList: false,
    isVisited: false,
    dateAdded: new Date().toISOString(),
    coordinates: {
      latitude: 36.3932,
      longitude: 25.4615
    }
  },
  {
    id: '2',
    name: 'Kyoto',
    country: 'Japan',
    description: 'Known for its classical Buddhist temples, gardens, imperial palaces, and traditional wooden houses.',
    imageUrl: 'https://images.pexels.com/photos/5374432/pexels-photo-5374432.jpeg',
    isInBucketList: false,
    isVisited: false,
    dateAdded: new Date().toISOString(),
    coordinates: {
      latitude: 35.0116,
      longitude: 135.7681
    }
  },
  {
    id: '3',
    name: 'Machu Picchu',
    country: 'Peru',
    description: 'An Incan citadel set high in the Andes Mountains, renowned for its sophisticated dry-stone walls.',
    imageUrl: 'https://images.pexels.com/photos/2929906/pexels-photo-2929906.jpeg',
    isInBucketList: false,
    isVisited: false,
    dateAdded: new Date().toISOString(),
    coordinates: {
      latitude: -13.1631,
      longitude: -72.5450
    }
  },
  {
    id: '4',
    name: 'Bora Bora',
    country: 'French Polynesia',
    description: 'A small South Pacific island famous for its turquoise lagoon and overwater bungalows.',
    imageUrl: 'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg',
    isInBucketList: false,
    isVisited: false,
    dateAdded: new Date().toISOString(),
    coordinates: {
      latitude: -16.5004,
      longitude: -151.7415
    }
  },
  {
    id: '5',
    name: 'Serengeti National Park',
    country: 'Tanzania',
    description: 'Famous for its annual migration of over 1.5 million wildebeest and 250,000 zebra.',
    imageUrl: 'https://images.pexels.com/photos/624063/pexels-photo-624063.jpeg',
    isInBucketList: false,
    isVisited: false,
    dateAdded: new Date().toISOString(),
    coordinates: {
      latitude: -2.3333,
      longitude: 34.8333
    }
  },
  {
    id: '6',
    name: 'Venice',
    country: 'Italy',
    description: 'Built on more than 100 small islands in a lagoon in the Adriatic Sea, with no roads, just canals.',
    imageUrl: 'https://images.pexels.com/photos/358/water-italy-boats-boat.jpg',
    isInBucketList: false,
    isVisited: false,
    dateAdded: new Date().toISOString(),
    coordinates: {
      latitude: 45.4408,
      longitude: 12.3155
    }
  }
];