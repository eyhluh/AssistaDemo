import type { GenderColumns } from "./GenderInterface";
import type { CrisisColumns } from "./CrisisInterface";
import type { SituationColumns } from "./SituationInterface";

export interface ApplicantColumns {
  applicant_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix_name?: string;
  gender: GenderColumns;
  birth_date: string;
  age: number | string;
  
  contact_number: string;
  gmail: string;
  house_no: string;
  street: string;
  subdivision?: string;
  barangay: string;
  city: string;

  crisis: CrisisColumns;
  incident_date: string;
  situation: SituationColumns;

  attached_file?: string;
  attached_file_url?: string;

  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApplicantFieldErrors {
  first_name?: string[];
  middle_name?: string[];
  last_name?: string[];
  suffix_name?: string[];
  gender?: string[];
  birth_date?: string[];
  age?: string[];
  
  contact_number?: string[];
  gmail?: string[];
  house_no?: string[];
  street?: string[];
  subdivision?: string[];
  barangay?: string[];
  city?: string[];

  crisis?: string[];
  incident_date?: string[];
  situation?: string[];

  add_applicant_file?: string[];
  edit_applicant_file?: string[];
  remove_attached_file?: string[];
}
