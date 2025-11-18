export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  age: string;
  height: string;
  weight: string;
  complexion: string;
  bloodGroup: string;
  maritalStatus: string;
  motherTongue: string;
  religion: string;
  caste: string;
  subCaste: string;
  gotra: string;
  manglik: string;
}

export interface FamilyDetails {
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  brothers: string;
  sisters: string;
  familyType: string;
  familyStatus: string;
  familyValues: string;
  nativePlace: string;
}

export interface EducationOccupation {
  highestEducation: string;
  educationDetails: string;
  occupation: string;
  occupationDetails: string;
  annualIncome: string;
  workLocation: string;
}

export interface ContactInfo {
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
}

export interface PartnerPreferences {
  ageRange: string;
  heightRange: string;
  education: string;
  occupation: string;
  location: string;
  otherExpectations: string;
}

export interface WeddingBiodataData {
  personal: PersonalInfo;
  family: FamilyDetails;
  education: EducationOccupation;
  contact: ContactInfo;
  preferences: PartnerPreferences;
}
