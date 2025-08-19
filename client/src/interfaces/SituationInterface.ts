export interface SituationColumns {
    situation_id: number;
    situation: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface SituationFieldErrors {
  situation?: string[];
}