import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const SuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const reference = location.state?.reference;
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (reference) {
            setShowConfetti(true);
            // Stop confetti after 3 seconds
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [reference]);

    if (!reference) {
        // keep existing redirect behavior
        setTimeout(() => navigate("/"), 100);
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center py-16  px-4 mt-32 relative">
            {/* Confetti Effect */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-10">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-ping"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${1 + Math.random() * 2}s`,
                            }}
                        >
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: [
                                        "#10B981",
                                        "#3B82F6",
                                        "#F59E0B",
                                        "#EF4444",
                                        "#8B5CF6",
                                    ][Math.floor(Math.random() * 5)],
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="w-full max-w-2xl mx-auto space-y-8 text-center relative z-20">
                {/* Enhanced Success Icon */}
                <div className="relative inline-block">
                    <div className="relative">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-white rounded-full shadow-xl border-4 border-green-500 flex items-center justify-center relative overflow-hidden">
                            {/* Animated background pulse */}
                            <div className="absolute inset-0 bg-green-500/10 rounded-full animate-pulse"></div>
                            {/* Main checkmark */}
                            <svg
                                className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 relative z-10"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M5 13l4 4L19 7"
                                    className="animate-pulse"
                                />
                            </svg>
                        </div>
                        {/* Outer glow rings */}
                        <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full border-2 border-green-300/30 animate-ping"></div>
                        <div
                            className="absolute inset-0 w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-full border border-green-200/20 animate-ping"
                            style={{ animationDelay: "0.5s" }}
                        ></div>
                    </div>
                </div>

                {/* Congratulations Text */}
                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-600 tracking-tight">
                        CONGRATULATIONS!
                    </h1>

                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                        🎉 Application Submitted Successfully!
                    </h2>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200">
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                        Your grant application has been received and is now
                        under review. Our team will carefully evaluate your
                        submission and contact you with updates.
                    </p>

                    {/* Reference ID Box */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">
                            Your Reference ID:
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <code className="text-lg sm:text-xl font-mono font-bold text-gray-900 bg-white px-4 py-2 rounded-lg border">
                                {reference}
                            </code>
                            <button
                                onClick={() =>
                                    navigator.clipboard.writeText(reference)
                                }
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Copy to clipboard"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Important Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                            <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="text-left">
                            <h3 className="font-semibold text-blue-800 mb-1">
                                Important:
                            </h3>
                            <p className="text-blue-700 text-sm sm:text-base">
                                Please save your reference number and share it
                                with your assigned agent. You'll need this
                                number to track your application status.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link
                        to="/"
                        className="text-lg flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        Start New Application
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
