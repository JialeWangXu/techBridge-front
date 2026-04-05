export interface UserDto {
    id?:string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    telephone?: string;
    contactPreference?: string;
    specialties?:string;
    isAvailable?:boolean;
    active?:boolean;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: number;
    role: 'SENIOR' | 'VOLUNTEER';
}
