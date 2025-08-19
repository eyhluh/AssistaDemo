export interface CrisisColumns {
  crisis_id: number;
  crisis: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CrisisFieldErrors {
  crisis?: string[];
}
