// import React, { createContext, useState, useContext } from "react";
// import { localStorageKeys } from "./Static/LocalStorage";

// const UserContext = createContext();

// export default function UserProvider({ children }) {
//   const [person, setPerson] = useState(undefined);

//   const updatePerson = () => {
//     const data = JSON.parse(localStorage.getItem(localStorageKeys.loginSession))
//     const mapping = data ? {...data, is_user: data?.uid ? true : false } : undefined
//     console.log("Global Person:", mapping)
//     setPerson(mapping);
//   };

//   const logout = () => {
//     localStorage.removeItem(localStorageKeys.loginSession)
//     setPerson(undefined)
//   }

//   return (
//     <UserContext.Provider
//       value={{
//         person,
//         updatePerson,
//         logout
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUser() {
//   const context = useContext(UserContext);

//   if (!context) throw new Error("useUser must be used within a UserProvider");

//   const { person, updatePerson, logout } = context;

//   return { person, updatePerson, logout };
// }
// UserProvider.js


import React, { createContext, useState, useContext } from "react";
import { localStorageKeys } from "./Static/LocalStorage";


const UserContext = createContext();

export default function UserProvider({ children }) {
  const [person, setPerson] = useState(undefined);


  const updatePerson = () => {
    const data = JSON.parse(localStorage.getItem(localStorageKeys.loginSession));
    const mapping = data ? { ...data, is_user: data?.uid ? true : false } : undefined;
    console.log("Global Person:", mapping);
    setPerson(mapping);


    if (mapping && mapping.user_type === 0) {

      return { to: '/admin/cashier' };
    } else if (mapping && mapping.user_type === 2) {

      return { to: '/profile' };
    } else if (mapping && mapping.is_user) {

      return { to: '/promotion/promotionadd' };
    }


    return {};
  };


  const logout = () => {
    localStorage.removeItem(localStorageKeys.loginSession);
    setPerson(undefined);
  };
  return (
    <UserContext.Provider
      value={{
        person,
        updatePerson,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) throw new Error("useUser must be used within a UserProvider");

  const { person, updatePerson, logout } = context;


  return { person, updatePerson, logout, };
}
