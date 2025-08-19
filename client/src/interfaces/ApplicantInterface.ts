export interface ApplicantColumns {
    applicant_id: number;
    applicant: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface ApplicantFieldErrors {
  applicant?: string[];
}