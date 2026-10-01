import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface FirestoreJobApplication {
  id?: string;
  applicationNumber: string;
  careerId?: string;
  jobTitle: string;
  institutionPreference?: string;
  specialization?: string;
  employmentType?: string;
  name: string;
  nameMarathi?: string;
  fatherOrHusbandName?: string;
  motherName?: string;
  dob?: string;
  age?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  domicile?: string;
  category?: string;
  casteName?: string;
  casteValidity?: string;
  pwd?: string;
  pwdDetails?: string;
  aadhaar?: string;
  pan?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  correspondenceAddress?: string;
  qualifications?: any[];
  experience?: any[];
  totalExperienceYears?: string;
  currentEmploymentStatus?: string;
  currentOrganization?: string;
  currentDesignation?: string;
  publications?: string;
  coverLetter?: string;
  status: string;
  createdAtIso: string;
  created_at?: any;
}

// Convert FormData into an object suitable for Firestore
export function formDataToApplicationObject(formData: FormData): FirestoreJobApplication {
  const appYear = new Date().getFullYear();
  const randomCode = Math.floor(10000 + Math.random() * 90000);
  const applicationNumber = (formData.get('applicationNumber') as string) || `SSM-${appYear}-REC-${randomCode}`;

  let qualifications: any[] = [];
  try {
    const qStr = formData.get('qualifications') as string;
    if (qStr) qualifications = JSON.parse(qStr);
  } catch {}

  let experience: any[] = [];
  try {
    const eStr = formData.get('experience') as string;
    if (eStr) experience = JSON.parse(eStr);
  } catch {}

  return {
    applicationNumber,
    careerId: (formData.get('careerId') as string) || '',
    jobTitle: (formData.get('jobTitle') as string) || 'Employment Application',
    institutionPreference: (formData.get('institutionPreference') as string) || '',
    specialization: (formData.get('specialization') as string) || '',
    employmentType: (formData.get('employmentType') as string) || 'Full-Time',
    name: (formData.get('name') as string) || '',
    nameMarathi: (formData.get('nameMarathi') as string) || '',
    fatherOrHusbandName: (formData.get('fatherOrHusbandName') as string) || '',
    motherName: (formData.get('motherName') as string) || '',
    dob: (formData.get('dob') as string) || '',
    age: (formData.get('age') as string) || '',
    gender: (formData.get('gender') as string) || 'Not Specified',
    maritalStatus: (formData.get('maritalStatus') as string) || 'Unmarried',
    nationality: (formData.get('nationality') as string) || 'Indian',
    domicile: (formData.get('domicile') as string) || 'Yes',
    category: (formData.get('category') as string) || 'OPEN',
    casteName: (formData.get('casteName') as string) || '',
    casteValidity: (formData.get('casteValidity') as string) || 'Available',
    pwd: (formData.get('pwd') as string) || 'No',
    pwdDetails: (formData.get('pwdDetails') as string) || '',
    aadhaar: (formData.get('aadhaar') as string) || '',
    pan: (formData.get('pan') as string) || '',
    email: (formData.get('email') as string) || '',
    phone: (formData.get('phone') as string) || '',
    alternatePhone: (formData.get('alternatePhone') as string) || '',
    address: (formData.get('address') as string) || '',
    city: (formData.get('city') as string) || '',
    district: (formData.get('district') as string) || '',
    state: (formData.get('state') as string) || 'Maharashtra',
    pincode: (formData.get('pincode') as string) || '',
    correspondenceAddress: (formData.get('correspondenceAddress') as string) || '',
    qualifications,
    experience,
    totalExperienceYears: (formData.get('totalExperienceYears') as string) || '0',
    currentEmploymentStatus: (formData.get('currentEmploymentStatus') as string) || '',
    currentOrganization: (formData.get('currentOrganization') as string) || '',
    currentDesignation: (formData.get('currentDesignation') as string) || '',
    publications: (formData.get('publications') as string) || '',
    coverLetter: (formData.get('coverLetter') as string) || '',
    status: 'new',
    createdAtIso: new Date().toISOString()
  };
}

export async function saveJobApplicationToFirestore(data: Partial<FirestoreJobApplication>) {
  try {
    const colRef = collection(db, 'job_applications');
    const docRef = await addDoc(colRef, {
      ...data,
      created_at: serverTimestamp(),
      createdAtIso: data.createdAtIso || new Date().toISOString()
    });
    return {
      success: true,
      id: docRef.id,
      applicationNumber: data.applicationNumber,
      data: {
        ...data,
        id: docRef.id
      }
    };
  } catch (error) {
    console.error('Failed to save to Firestore:', error);
    throw error;
  }
}

export async function fetchJobApplicationsFromFirestore() {
  try {
    const colRef = collection(db, 'job_applications');
    const q = query(colRef, orderBy('createdAtIso', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  } catch (error) {
    console.warn('Could not fetch from Firestore, falling back to empty list:', error);
    return [];
  }
}
