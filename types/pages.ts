export type PageType = 'academy' | 'community' | 'venue';

export interface UserPage {
  id: string;
  name: string;
  type: PageType;
  createdAt: Date;
  data: AcademyData | CommunityData | VenueData;
}

// Academy Data Interfaces
export interface AcademyData {
  id: string;
  name: string;
  description: string;
  type: string;
  established: string;
  students: number;
  coaches: number;
  successRate: number;
  rating: number;
  reviews: number;
  logo?: string;
  coverImage?: string;
  verified: boolean;
  facilities: AcademyFacility[];
  coaches: AcademyCoach[];
  programs: AcademyProgram[];
  contact: ContactInfo;
  socialMedia: SocialMedia;
}

export interface AcademyFacility {
  id: string;
  name: string;
  description: string;
  available: boolean;
  image?: string;
}

export interface AcademyCoach {
  id: string;
  name: string;
  role: string;
  experience: number;
  specialization: string[];
  image?: string;
  verified: boolean;
}

export interface AcademyProgram {
  id: string;
  name: string;
  duration: string;
  level: string;
  fee: number;
  description: string;
  enrolled: number;
  maxStudents: number;
}

// Community Data Interfaces
export interface CommunityData {
  id: string;
  name: string;
  description: string;
  type: string;
  founded: string;
  members: number;
  posts: number;
  events: number;
  isJoined: boolean;
  logo?: string;
  coverImage?: string;
  verified: boolean;
  members: CommunityMember[];
  events: CommunityEvent[];
  discussions: CommunityDiscussion[];
  rules: string[];
  contact: ContactInfo;
}

export interface CommunityMember {
  id: string;
  name: string;
  role: string;
  joinDate: string;
  avatar: string;
  isOnline: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  type: string;
}

export interface CommunityDiscussion {
  id: string;
  title: string;
  author: string;
  replies: number;
  lastReply: string;
  isPinned: boolean;
  isLocked: boolean;
}

// Venue Data Interfaces
export interface VenueData {
  id: string;
  name: string;
  description: string;
  type: string;
  established: string;
  capacity: number;
  facilities: number;
  bookings: number;
  rating: number;
  reviews: number;
  isAvailable: boolean;
  logo?: string;
  coverImage?: string;
  verified: boolean;
  facilities: VenueFacility[];
  pricing: VenuePricing[];
  availability: VenueAvailability[];
  contact: ContactInfo;
}

export interface VenueFacility {
  id: string;
  name: string;
  description: string;
  available: boolean;
  image?: string;
}

export interface VenuePricing {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  features: string[];
}

export interface VenueAvailability {
  date: string;
  timeSlots: VenueTimeSlot[];
}

export interface VenueTimeSlot {
  time: string;
  available: boolean;
  price: number;
}

// Shared Interfaces
export interface ContactInfo {
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
}

// Component Props Interfaces
export interface AcademyHeaderProps {
  onBack: () => void;
  onEdit: () => void;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export interface AcademyCoverProps {
  name: string;
  type: string;
  logo: string | null;
  coverImage: string | null;
  verified: boolean;
  rating: number;
  reviews: number;
}

export interface AcademyFacilitiesProps {
  facilities: AcademyFacility[];
  isEditing: boolean;
  onAddFacility: () => void;
  onRemoveFacility: (id: string) => void;
  onUpdateFacility: (id: string, field: string, value: string) => void;
}

export interface AcademyCoachesProps {
  coaches: AcademyCoach[];
  onCoachPress: (coachId: string) => void;
}

export interface AcademyProgramsProps {
  programs: AcademyProgram[];
  onProgramPress: (programId: string) => void;
  onEnroll: (programId: string) => void;
}

export interface AcademyContactProps {
  contact: ContactInfo;
  isEditing: boolean;
  onContactChange: (field: string, value: string) => void;
}

export interface CommunityHeaderProps {
  onBack: () => void;
  onEdit: () => void;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export interface CommunityCoverProps {
  name: string;
  type: string;
  logo: string | null;
  coverImage: string | null;
  verified: boolean;
  members: number;
  isJoined: boolean;
}

export interface CommunityMembersProps {
  members: CommunityMember[];
  totalMembers: number;
  onMemberPress: (memberId: string) => void;
  onViewAll: () => void;
}

export interface CommunityEventsProps {
  events: CommunityEvent[];
  onEventPress: (eventId: string) => void;
  onJoinEvent: (eventId: string) => void;
}

export interface CommunityDiscussionsProps {
  discussions: CommunityDiscussion[];
  onDiscussionPress: (discussionId: string) => void;
  onStartDiscussion: () => void;
}

export interface VenueHeaderProps {
  onBack: () => void;
  onEdit: () => void;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export interface VenueCoverProps {
  name: string;
  type: string;
  logo: string | null;
  coverImage: string | null;
  verified: boolean;
  rating: number;
  reviews: number;
  isAvailable: boolean;
}

export interface VenueFacilitiesProps {
  facilities: VenueFacility[];
  isEditing: boolean;
  onAddFacility: () => void;
  onRemoveFacility: (id: string) => void;
  onUpdateFacility: (id: string, field: string, value: string) => void;
}

export interface VenuePricingProps {
  pricing: VenuePricing[];
  onSelectPricing: (pricingId: string) => void;
  onBook: (pricingId: string) => void;
}

export interface VenueAvailabilityProps {
  availability: VenueAvailability[];
  onSelectTimeSlot: (date: string, time: string) => void;
  onBookSlot: (date: string, time: string) => void;
}

// Shared Component Props
export interface PageHeaderProps {
  onBack: () => void;
  onEdit: () => void;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export interface PageAboutSectionProps {
  description: string;
  stats: Record<string, number>;
  isEditing: boolean;
  onDescriptionChange: (description: string) => void;
}

export interface ContactInfoSectionProps {
  contact: ContactInfo;
  isEditing: boolean;
  onContactChange: (field: string, value: string) => void;
}

export interface PageTypeSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: PageType) => void;
}
