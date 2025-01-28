"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { instance } from "../Api/axios";

// 1. تعريف واجهة السياق
interface VariablesContextType {
  language: string;
  setlanguage: React.Dispatch<React.SetStateAction<string>>;
  global_loading: boolean;
  setglobal_loading: React.Dispatch<React.SetStateAction<boolean>>;
  showsidebar: boolean;
  setshowsidebar: React.Dispatch<React.SetStateAction<boolean>>;
  opensidebar: any;
  shortmenue: any;
  setshortmenue: any;
}

// 2. إنشاء السياق مع النوع الافتراضي
const Variables = createContext<VariablesContextType | undefined>(undefined);

// 3. تعريف واجهة `Props` للمكون
interface VariablesProviderProps {
  children: ReactNode;
}

export default function VariablesProvider({
  children,
}: VariablesProviderProps): JSX.Element {
  const [language, setlanguage] = useState("EN");
  const [global_loading, setglobal_loading] = useState(false);
  const [shortmenue, setshortmenue] = useState(false);
  const [showsidebar, setshowsidebar] = useState(true);

  const opensidebar = () => {
    setshowsidebar((prev) => !prev);
  };

  return (
    <Variables.Provider
      value={{
        language,
        setlanguage,
        global_loading,
        setglobal_loading,
        showsidebar,
        setshowsidebar,
        opensidebar,
        shortmenue,
        setshortmenue,
      }}
    >
      {children}
    </Variables.Provider>
  );
}

// 5. استهلاك السياق مع التحقق
export const UseVariables = (): VariablesContextType => {
  const context = useContext(Variables);
  if (!context) {
    throw new Error("UseVariables must be used within a VariablesProvider");
  }
  return context;
};
