import { UserTypes } from './UserTypes';
type AttendanceTypes = {
    _id?: string;
    ofEmployee?: UserTypes,
    ofRoute?: string,
    isPresent?: boolean,
    Driver?: string
}

export default AttendanceTypes;