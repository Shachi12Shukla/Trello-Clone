import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return Boolean(localStorage.getItem("token"));
    });

    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem("user");

        return savedUser ? JSON.parse(savedUser) : null;
    });


    const login = (token, user) => {

        localStorage.setItem("token", token);

        if (user) {
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            setUserData(user);
        }

        setIsLoggedIn(true);
    };


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
        setUserData(null);
    };


    const value = {
        isLoggedIn,
        userData,
        login,
        logout,
        setUserData
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthContextProvider"
        );
    }

    return context;
};