import React from "react";
import { FcSms } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { FaFacebookMessenger } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-indigo-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-semibold mb-4">
                            {" "}
                            Community Impact Grant for Individual Solutions
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            Empowering individuals through accessible government
                            grants. Find funding opportunities for education,
                            housing, business development, and personal growth
                            initiatives.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                <FaFacebookMessenger
                                    className="text-gray-300 hover:text-white hover:-translate-y-1 duration-300 ease-in-out
                                    transition-all  w-6 h-6"
                                />
                            </a>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                <FaFacebook
                                    className="text-gray-300 hover:text-white hover:-translate-y-1 duration-300 ease-in-out
                                    transition-all  w-6 h-6"
                                />
                            </a>
                            <a
                                href="sms:+18056259810?body=Hello%20I%20want%20to%20apply"
                                rel="noopener noreferrer"
                                target="_blank"
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                <FcSms
                                    className="text-gray-300 hover:text-white hover:-translate-y-1 duration-300 ease-in-out
                                    transition-all  w-6 h-6"
                                />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-indigo-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-300 text-sm">
                        © {currentYear} Government Grant for Individual
                        Solutions. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a
                            href="#"
                            className="text-gray-300 hover:text-white text-sm transition-colors"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="text-gray-300 hover:text-white text-sm transition-colors"
                        >
                            Terms of Service
                        </a>
                        <a
                            href="#"
                            className="text-gray-300 hover:text-white text-sm transition-colors"
                        >
                            Accessibility
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
