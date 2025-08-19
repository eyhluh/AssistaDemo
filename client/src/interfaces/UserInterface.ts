import type { GenderColumns } from "./GenderInterface";
import type { ApplicantColumns } from "./ApplicantInterface";

export interface UserColumns {
    user_id: number;
    profile_picture?: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix_name?: string;
    gender: GenderColumns;
    applicant: ApplicantColumns;
    birth_date: string;
    age: number | string;
    gmail: string;
    password: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserFieldErrors {
    add_user_profile_picture?: string[];
    edit_user_profile_picture?: string[];
    first_name?: string[];
    middle_name?: string[];
    last_name?: string[];
    suffix_name?: string[];
    gender?: string[];
    applicant?: string[];
    birth_date?: string[];
    gmail?: string[];
    password?: string[];
    password_confirmation?: string[];
}