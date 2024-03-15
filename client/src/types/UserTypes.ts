export interface UserTypes {
    _id?: string;
    fName: string,
    lName: string,
    phone?: number;
    email?: string;
    department?: string;
    role?: "admin" | "employee" | "driver";
    password?: string;
    profilePicture?: string;
    pickup?: [number, number];
    cabDetails?: {
        cabNumber: string;
        seatingCapacity: number;
        numberPlate: string;
        model: string;
        color: string;
    }; // Optional field
    address?: string;
    cancelCab?: boolean;
    createdAt?: Date;
}