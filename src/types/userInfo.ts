// types/user-profile.ts

// Base types for nested objects
interface NameDescriptionPair {
    name: string;
    description: string;
  }
  
  interface StudentDetails {
    studentNumber: string;
    semester: string;
    entranceType: string;
    passedSemesters: number;
    studyLevel: NameDescriptionPair;
    studyMajor: NameDescriptionPair;
    educationalStatus: NameDescriptionPair;
  }
  
  interface GroupDetails {
    id: number;
    foodDeliveryBasedOnFacialRecognition: boolean;
    onlineCreditChargeForbidden: boolean;
  }
  
  interface MarriageStatus {
    name: string;
    description: string;
  }
  
  // Main user profile type
  export interface UserProfile {
    id: number;
    nurtureCreditProfileId: string;
    firstName: string;
    lastName: string;
    username: string;
    fatherName: string;
    gender: Gender;
    enabled: boolean;
    nationalCode: string;
    personnel: boolean;
    changeProfilePicturePermission: boolean;
    faculty: boolean;
    birthDate: string; // Consider using Date type if you'll parse it
    postalCode: string;
    mobileNumber: string;
    shenasnameNumber: string;
    birthPlace: string;
    marriageStatus: MarriageStatus;
    student: StudentDetails;
    group: GroupDetails;
    faceMatching: boolean;
  }
  
  // Optional: Union type for gender if you know all possible values
  export type Gender = 'مرد' | 'زن'; // Add other possible values
  
  // Optional: Type for date strings if you need to handle them specially
  export type PersianDateString = string; // Format: "YYYY-MM-DD HH:mm:ss"
  
  // Optional: Enhanced version with stricter types
  export interface EnhancedUserProfile extends Omit<UserProfile, 'gender' | 'birthDate'> {
    gender: Gender;
    birthDate: Date | null; // Parsed date object
    student: StudentDetails & {
      entranceType: 'روزانه' | 'شبانه' | 'مجازی'; // Example values
    };
  }