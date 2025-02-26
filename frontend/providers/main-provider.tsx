"use client"

import React, {createContext, useState} from "react";

/**
 * Navigation context
 * */
export const MainLayoutContext = createContext<any>({
    notificationCount: 0,
    setNotificationCount: () => {},
    cartCount: 0,
    setCartCount: () => {},
});

/**
 * Navigation provider
 * @param children
 * */
const MainProvider = ({children}: any) => {
    const [notificationCount, setNotificationCount] = useState<number>(0);
    const [cartCount, setCartCount] = useState<number>(0);

    return (
        <MainLayoutContext.Provider value={{
            notificationCount,
            setNotificationCount,
            cartCount,
            setCartCount,
        }}>
            {children}
        </MainLayoutContext.Provider>
    );
};

export default MainProvider;