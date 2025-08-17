export interface UserDetails {
    user: {
        user_id: number;
        profile_picture?: string;
        first_name: string;
        middle_name: string;
        last_name: string;
        suffix_name: string;
        gender: {
            gender_id: number;
            gender: string;
        }
        birth_date: string;
        age: string | number;
        gmail: string;
    }
    token?: string
}


export interface LoginCredentialsErrorFields {
    gmail?: string[]
    password?: string[]
}