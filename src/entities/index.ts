/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: guestlist
 * Interface for GuestList
 */
export interface GuestList {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  guestName?: string;
  /** @wixFieldType text */
  rsvpStatus?: string;
  /** @wixFieldType text */
  dietaryRestrictions?: string;
  /** @wixFieldType boolean */
  hasPlusOne?: boolean;
  /** @wixFieldType text */
  plusOneName?: string;
}


/**
 * Collection ID: vendordirectory
 * Interface for VendorDirectory
 */
export interface VendorDirectory {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  vendorName?: string;
  /** @wixFieldType text */
  serviceType?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  portfolioImage?: string;
}


/**
 * Collection ID: weddingchecklist
 * Interface for WeddingChecklist
 */
export interface WeddingChecklist {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  taskName?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType date */
  dueDate?: Date | string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  assignedTo?: string;
  /** @wixFieldType boolean */
  isCompleted?: boolean;
}


/**
 * Collection ID: weddingevents
 * Interface for WeddingEvents
 */
export interface WeddingEvents {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  eventTitle?: string;
  /** @wixFieldType datetime */
  eventDateTime?: Date | string;
  /** @wixFieldType text */
  location?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  eventImage?: string;
  /** @wixFieldType url */
  eventUrl?: string;
}
