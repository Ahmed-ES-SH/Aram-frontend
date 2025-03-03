"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { instance } from "../Api/axios";
import Pusher from "pusher-js";
import axios from "axios";
import { currencies } from "../constants/website";

// Define the structure of the context data
interface DataContextType {
  currentuser: any;
  type: string;
  settype: any;
  publishedOrgs: any;
  setPublishedOrgs: any;
  activeCards: any;
  randomArticles: any;
  activeOrganizations: any;
  activeArticles: any;
  activeServices: any;
  setcurrentuser: any;
  makeAllasRead: any;
  notifications: any;
  setNotifications: any;
  isLoggedIn: boolean;
  loading: boolean;
  setIsLoggedIn: (status: boolean) => void;
  setLoading: (status: boolean) => void;
  newNotification: any;
  setnewNotification: any;
  catgeories: any;
  locations: any;
  categoriesPage: any;
  allCategories: any;
  locationPage: any;
  lastcategoriesPage: any;
  setcategoriesPage: any;
  setlocationPage: any;
  lastlocationPage: any;
  randomOffers: any;
  setRandomOffers: any;
  currenciesValue: any;
  setCurrenciesValue: any;
  activeCurrency: any;
  setActiveCurrency: any;
}

// Create the context with a default value
const DataContext = createContext<DataContextType | undefined>(undefined);

// Define the props for the provider component
type DataProviderProps = {
  children: ReactNode;
};

// Create the provider component
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeServices, setActiveServices] = useState([]);
  const [activeCards, setActiveCards] = useState([]);
  const [activeArticles, setActiveArticles] = useState([]);
  const [randomArticles, setrandomArticles] = useState([]);
  const [currenciesValue, setCurrenciesValue] = useState([]);
  const [activeOrganizations, setActiveOrganizations] = useState([]);
  const [currentuser, setcurrentuser] = useState<any>(null);
  const [type, settype] = useState("");
  const [newNotification, setnewNotification] = useState<any>(null);
  const [notifications, setNotifications] = useState<any>([]);
  const [catgeories, setCategories] = useState<string[]>([]);
  const [publishedOrgs, setPublishedOrgs] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<any>([]);
  const [categoriesPage, setcategoriesPage] = useState(1);
  const [locationPage, setlocationPage] = useState(1);
  const [lastcategoriesPage, setlastcategoriesPage] = useState(1);
  const [lastlocationPage, setlastlocationPage] = useState(1);
  const [randomOffers, setRandomOffers] = useState([]);
  const [activeCurrency, setActiveCurrency] = useState(currencies[0]);
  const id = currentuser && currentuser.id;
  useEffect(() => {
    const fetchData = async (api: string, set: any) => {
      try {
        const response = await instance.get(api);
        set(response.data.data);
        if (response.data.user_type) {
          settype(response.data.user_type);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData("/currentuser", setcurrentuser);
    fetchData("/card-types", setActiveCards);
    fetchData("/random-offers", setRandomOffers);
    fetchData("/active-random-affiliate-services", setActiveServices);
    fetchData("/active-organizations", setActiveOrganizations);
    fetchData("/active-articals", setActiveArticles);
    fetchData("/random-five-articles", setrandomArticles);
    fetchData("/currentuser", setcurrentuser);
    fetchData("/all-service-categories", setAllCategories);
    fetchData("/organizations-by-rateing", setPublishedOrgs);
  }, []);

  // useEffect(() => {
  //   const getCurrencies = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://v6.exchangerate-api.com/v6/a0611cb7f1da1be0d03b52f6/latest/OMR`
  //       );
  //       setCurrenciesValue(response.data.conversion_rates);
  //     } catch (error: any) {
  //       console.log(error);
  //     }
  //   };
  //   getCurrencies();
  // }, []);

  useEffect(() => {
    const updateOffers = async () => {
      try {
        const response = await instance.post(`/check-expired-offers`);
      } catch (error) {
        console.log(error);
      }
    };
    updateOffers();
  }, []);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await instance.get(`/notifications-ten/${id}/${type}`);
        if (response.status === 200) {
          setNotifications(response.data.data);
        }
      } catch (error: any) {
        console.error("Error fetching notifications:", error);
      }
    };
    if (id) {
      getNotifications();
    }
  }, [id, type]);

  const makeAllasRead = async () => {
    try {
      const response = await instance.post(
        `notifications-user-read/${id}/${type}`
      );
      if (response.status == 200) {
        // تحديث الإشعارات بعد جعلها مقروءة
        setNotifications((prevnots: any) => {
          return prevnots.map((notif: any) => ({
            ...notif,
            is_read: 1, // تعيين حالة is_read إلى 1 لجميع الإشعارات
          }));
        });
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    // تحقق من أن currentuser و newNotification موجودين

    // إعداد Pusher
    const pusher = new Pusher("b28882360e35f7d42d06", { cluster: "eu" });
    const channel = pusher.subscribe("notifications");

    // استلام الإشعار الجديد
    channel.bind("NotificationEvent", (datachat: any) => {
      // إضافة الإشعار الجديد إلى الحالة
      const newnot =
        datachat.user_id && currentuser.id && datachat.user_id == currentuser.id
          ? datachat
          : null;
      if (newnot) {
        setnewNotification(newnot);
        setNotifications((prevdata: any) => [newnot, ...prevdata]);
      }
    });

    // تنظيف القناة عند إنهاء التفاعل أو عند الخروج من المكون
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [currentuser, newNotification, setnewNotification]);

  useEffect(() => {
    const getcategories_locations = async (
      setdata: any,
      setcurrentPage: any,
      setLastpage: any,
      api: string,
      page: number
    ) => {
      try {
        const response = await instance.get(`${api}?page=${page}`);
        if (response.status == 200) {
          const data = response.data.data;
          setdata(data);
          setcurrentPage(response.data.pagination.current_page);
          setLastpage(response.data.pagination.last_page);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    getcategories_locations(
      setCategories,
      setcategoriesPage,
      setlastcategoriesPage,
      "/service-categories",
      categoriesPage
    );
    getcategories_locations(
      setLocations,
      setlocationPage,
      setlastlocationPage,
      "/getlocations",
      locationPage
    );
  }, [categoriesPage, locationPage]);

  return (
    <DataContext.Provider
      value={{
        setcurrentuser,
        isLoggedIn,
        setIsLoggedIn,
        loading,
        setLoading,
        activeCards,
        allCategories,
        activeServices,
        activeOrganizations,
        activeArticles,
        randomOffers,
        setRandomOffers,
        randomArticles,
        currentuser,
        type,
        settype,
        publishedOrgs,
        setPublishedOrgs,
        notifications,
        setNotifications,
        makeAllasRead,
        newNotification,
        setnewNotification,
        catgeories,
        locations,
        categoriesPage,
        locationPage,
        lastcategoriesPage,
        lastlocationPage,
        setcategoriesPage,
        setlocationPage,
        currenciesValue,
        setCurrenciesValue,
        activeCurrency,
        setActiveCurrency,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Create a custom hook to use the DataContext
export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
