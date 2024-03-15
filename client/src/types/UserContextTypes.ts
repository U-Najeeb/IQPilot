import { UserTypes } from "./UserTypes";

type UserContextTypes = {
    userData?: UserTypes | undefined; // Update here
    setUserData?: (userData: UserTypes | undefined) => void; // Update here
};

export default UserContextTypes