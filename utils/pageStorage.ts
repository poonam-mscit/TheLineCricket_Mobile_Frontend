import AsyncStorage from '@react-native-async-storage/async-storage';
import { AcademyData, CommunityData, PageType, UserPage, VenueData } from '../types/pages';

const USER_PAGES_KEY = 'user_pages';

/**
 * Get all pages owned by the current user
 */
export const getUserPages = async (): Promise<UserPage[]> => {
  try {
    const pagesJson = await AsyncStorage.getItem(USER_PAGES_KEY);
    if (!pagesJson) {
      return [];
    }
    const pages = JSON.parse(pagesJson);
    // Convert date strings back to Date objects
    return pages.map((page: any) => ({
      ...page,
      createdAt: new Date(page.createdAt)
    }));
  } catch (error) {
    console.error('Error getting user pages:', error);
    return [];
  }
};

/**
 * Save a new page or update an existing one
 */
export const savePage = async (page: UserPage): Promise<boolean> => {
  try {
    const pages = await getUserPages();
    const existingIndex = pages.findIndex(p => p.id === page.id);
    
    if (existingIndex >= 0) {
      // Update existing page
      pages[existingIndex] = page;
    } else {
      // Add new page
      pages.push(page);
    }
    
    await AsyncStorage.setItem(USER_PAGES_KEY, JSON.stringify(pages));
    return true;
  } catch (error) {
    console.error('Error saving page:', error);
    return false;
  }
};

/**
 * Delete a page by ID
 */
export const deletePage = async (pageId: string): Promise<boolean> => {
  try {
    const pages = await getUserPages();
    const filteredPages = pages.filter(p => p.id !== pageId);
    await AsyncStorage.setItem(USER_PAGES_KEY, JSON.stringify(filteredPages));
    return true;
  } catch (error) {
    console.error('Error deleting page:', error);
    return false;
  }
};

/**
 * Get a specific page by ID
 */
export const getPageById = async (pageId: string): Promise<UserPage | null> => {
  try {
    const pages = await getUserPages();
    const page = pages.find(p => p.id === pageId);
    return page || null;
  } catch (error) {
    console.error('Error getting page by ID:', error);
    return null;
  }
};

/**
 * Get all pages of a specific type
 */
export const getAllPagesByType = async (type: PageType): Promise<UserPage[]> => {
  try {
    const pages = await getUserPages();
    return pages.filter(p => p.type === type);
  } catch (error) {
    console.error('Error getting pages by type:', error);
    return [];
  }
};

/**
 * Create a new empty Academy page template
 */
export const createEmptyAcademyPage = (): AcademyData => {
  return {
    id: '',
    name: '',
    description: '',
    type: 'Cricket Academy',
    established: new Date().getFullYear().toString(),
    students: 0,
    coaches: 0,
    successRate: 0,
    rating: 0,
    reviews: 0,
    verified: false,
    facilities: [],
    coaches: [],
    programs: [],
    contact: {
      phone: '',
      email: '',
      website: '',
      address: '',
      city: '',
      state: '',
      country: ''
    },
    socialMedia: {}
  };
};

/**
 * Create a new empty Community page template
 */
export const createEmptyCommunityPage = (): CommunityData => {
  return {
    id: '',
    name: '',
    description: '',
    type: 'Cricket Community',
    founded: new Date().getFullYear().toString(),
    members: 0,
    posts: 0,
    events: 0,
    isJoined: false,
    verified: false,
    members: [],
    events: [],
    discussions: [],
    rules: [],
    contact: {
      phone: '',
      email: '',
      website: '',
      address: '',
      city: '',
      state: '',
      country: ''
    }
  };
};

/**
 * Create a new empty Venue page template
 */
export const createEmptyVenuePage = (): VenueData => {
  return {
    id: '',
    name: '',
    description: '',
    type: 'Cricket Ground',
    established: new Date().getFullYear().toString(),
    capacity: 0,
    facilities: 0,
    bookings: 0,
    rating: 0,
    reviews: 0,
    isAvailable: true,
    verified: false,
    facilities: [],
    pricing: [],
    availability: [],
    contact: {
      phone: '',
      email: '',
      website: '',
      address: '',
      city: '',
      state: '',
      country: ''
    }
  };
};

