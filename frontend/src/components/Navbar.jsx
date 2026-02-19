import React, { useEffect, useRef, useState } from "react";
import topBanner from "../assets/images/usa.logo.png";
import logo from "../assets/images/logo.png";

import { Link } from "react-router-dom";

const Navbar = () => {
    const [navbar, setNavbar] = useState(false);
    const isNavbar = () => {
        setNavbar(!navbar);
    };

    // Close the menu when clicking outside
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setNavbar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            {/* Official Government Header  */}
            <div className="w-full fixed top-0 z-50 bg-gray-50 border-b border-gray-200 py-2">
                <div className="flex items-center px-4 sm:px-6 lg:px-8">
                    <img
                        src={topBanner}
                        alt="USA Logo"
                        className="w-8 h-5 sm:w-10 sm:h-6 mr-3"
                    />
                    <p className="text-xs sm:text-sm text-gray-700 font-medium">
                        An official website of the United States government
                    </p>
                </div>
            </div>
            <nav className=" fixed top-8 w-full z-40 py-6 bg-gradient-to-r from-indigo-800 to-blue-900 backdrop-blur-sm shadow-lg border-b border-indigo-700">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center gap-10 shrink ">
                        <div className="flex items-center min-w-[200px]">
                            <Link to="/">
                                <img
                                    src={logo}
                                    alt="CIG Logo"
                                    className="h-14 w-auto cursor-pointer"
                                />
                            </Link>
                            <h1 className="ml-3 text-2xl md:text-3xl font-bold text-white truncate">
                                Community Impact Grant
                            </h1>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 mt-3 md:mt-0"></div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
