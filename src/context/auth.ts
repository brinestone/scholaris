import { createContext } from "solid-js";

export interface AuthStateModel {
    accessToken: string;
    
}

const AuthContext = createContext<AuthStateModel>();