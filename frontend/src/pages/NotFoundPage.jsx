import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-xl w-full text-center bg-white rounded-lg shadow-lg p-10">
                <div className="text-6xl font-extrabold text-blue-600 mb-4">
                    404
                </div>
                <h1 className="text-2xl font-semibold mb-2">Page Not Found</h1>
                <p className="text-gray-600 mb-6">
                    The page you are looking for doesn't exist or has been
                    moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/" className="btn-primary px-5 py-2">
                        Go to Homepage
                    </Link>
                    <button
                        className="btn-secondary px-5 py-2"
                        onClick={() => navigate("/start-application")}
                    >
                        Start Application
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
