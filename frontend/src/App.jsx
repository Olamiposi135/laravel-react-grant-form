import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Footer from "./components/Footer";
import { FloatButton } from "antd";

import ApplicationPage from "./pages/ApplicationPage";
import SuccessPage from "./pages/SuccessPage";
import NotFoundPage from "./pages/NotFoundPage";

import ScrollToTop from "./components/ScrollToTop";

const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<ApplicationPage />} />

                <Route path="/success" element={<SuccessPage />} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
            <FloatButton.BackTop />
        </BrowserRouter>
    );
};

export default App;
