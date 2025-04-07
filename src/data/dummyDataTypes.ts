// Global and accessible types in the codebase without importing!

// FIXME: This make tuple of array of numbers with fixed length of 2 but cause issue!
// type Location = [number, number] // [latitude, longitude]
type Location = number[] // [latitude, longitude]

interface planType {
  planId: string
  title: string
  description: string
  images: string[] // Array of image URLs for the plan
  type: string // 'Full day' | 'Mid day' | 'Evening' | 'Night' | 'All Night'
  stopCount: number // Number of stops in the plan
  rating: number // Average rating of the plan (0 to 5)
  reviewCount: number // Number of reviews/rates for the plan
  startLocation: Location
  finishLocation: Location
  distance: number // Total distance in miles
  duration: string // e.g. "2 hours"
  userId: string
  categoryId: string
  createdAt: string // ISO 8601 format, e.g. "2023-10-01T12:00:00Z"
  updatedAt: string // ISO 8601 format, e.g. "2023-10-01T12:00:00Z"
}

interface stopType {
  stopId: string
  planId: string
  name: string
  imageURL: string
  address: string
  description: string
  location: Location
  sequence: number // Order of the stop in the plan
  createdAt: string // ISO 8601 format, e.g. "2023-10-01T12:00:00Z"
  updatedAt: string // ISO 8601 format, e.g. "2023-10-01T12:00:00Z"
}

interface categoryType {
  categoryId: string
  name: string
  description: string
  imageURL: string
  createdAt: string // ISO 8601 format, e.g. "2023-10-01T12:00:00Z"
  updatedAt: string // ISO 8601 format, e.g. "2023-10-01T12:00:00Z"
}

interface userType {
  userId: string
  name: string
  email: string
  password: string
  pictureURL: string
  createdAt: string // ISO 8601 format, e.g. "2023-10-01T12:00:00Z"
  updatedAt: string // ISO 8601 format, e.g. "2023-10-01T12:00:00Z"
}

export { planType, stopType, categoryType, userType }
