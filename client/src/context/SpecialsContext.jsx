import { createContext, useContext } from "react";
export const SpecialsContext = createContext([]);
export function useSpecials() { return useContext(SpecialsContext); }
