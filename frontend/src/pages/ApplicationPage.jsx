import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Add skeleton loader library
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// Import the shared image-with-skeleton helper
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";

const totalSteps = 4;

const initialForm = {
    first_name: "",
    middle_name: "",
    last_name: "",
    address: "",
    zipCode: "",
    city: "",
    state: "",
    gender: "",
    dob: "",
    phone_number: "",
    email: "",
    income: "",
    maritalStatus: "",
    ssn: "",
    nextOfKin: "",
    motherName: "",
    hearingStatus: "",
    housingType: "",
    bank_name: "",
    phoneCourier: "",
    has_cards: "no",
    no_of_cards: "",
    card_limit: "",
    grantSelect: "",
    amount_applied: "",
    grantDescription: "",
    id_front: null,
    id_back: null,
    stored_front_path: "",
    stored_back_path: "",
};

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];
const maritalOptions = [
    "Single",
    "Married",
    "Separated",
    "Complicated",
    "In a Relationship",
    "Divorced",
    "Widowed",
    "Others",
];
const hearingOptions = ["Hearing", "Hearing impaired", "Deaf"];
const housingType = ["Home Owner", "Rent Appt", "Others"];
const grantOptions = [
    "Personal Assistance",
    "Business Funding",
    "Healthcare Funding",
    "Real Estate:Investing/Business",
    "Community Funding",
    "Education/Tuition Funding",
    "Real Estate: Personal Home Purchase/1st Time Home Buyer",
    "Personal Assistance: Home Repairs",
];
const grantAmountOptions = [
    "$30,000 - $50,000",
    "$50,000 - $90,000",
    "$90,000 - $150,000",
    "$150,000 - $200,000",
    "$200,000 - $300,000",
    "$300,000 - $450,000",
    "$450,000 - $600,000",
    "$600,000 - $750,000",
    "$750,000 - $1,000,000",
    "$1,000,000+",
];

function validateStep(step, form) {
    const errors = {};
    if (step === 1) {
        if (!form.first_name || form.first_name.length < 2)
            errors.first_name = "First Name is required ";
        if (!form.middle_name) errors.middle_name = "Middle Name is required ";
        if (!form.last_name || form.last_name.length < 2)
            errors.last_name = "Last Name is required ";
        if (!form.address) {
            errors.address = "Home Address is required ";
        }
        if (!form.zipCode) {
            errors.zipCode = "Zip code is required";
        } else if (!form.zipCode || !form.zipCode.match(/^\d{5}$/)) {
            errors.zipCode = "Zip Code must be exactly 5 digits";
        }
        if (!form.city) {
            errors.city = "Please fill in your City";
        } else if (!form.city.match(/^[a-zA-Z\s\-]+$/)) {
            errors.city = "City must contain only letters, spaces, or hyphens";
        }
        if (!form.state) {
            errors.state = "Please enter your State";
        } else if (!form.state.match(/^[a-zA-Z\s\-]+$/)) {
            errors.state =
                "State must contain only letters, spaces, or hyphens";
        }
        if (!form.gender) errors.gender = "Gender is required";
        if (!form.dob) errors.dob = "Date of Birth is required";

        // Phone: only digits allowed, length between 10 and 15 (adjust as needed)
        const rawPhone = String(form.phone_number || "").trim();
        if (rawPhone == "") {
            errors.phone_number = "Phone Number is required";
        } else if (!/^[\d\s()+-]+$/.test(rawPhone)) {
            errors.phone_number =
                "Phone Number may only contain digits, spaces, +, (), or -.";
        } else {
            // Step 2: strip everything except digits for length check
            const phoneDigits = rawPhone.replace(/\D/g, "");

            if (phoneDigits.length < 10) {
                errors.phone_number =
                    "Phone Number is required and must be at least 10 digits.";
            } else if (phoneDigits.length > 15) {
                errors.phone_number =
                    "Phone Number must be no more than 15 digits long.";
            }
        }

        if (!form.email) {
            errors.email = " Email is required";
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
        ) {
            errors.email = "Please enter a valid email";
        }
    }
    if (step === 2) {
        if (!form.income) errors.income = "Monthly Income is required";
        if (!form.ssn) errors.ssn = "SSN is required";
        if (!form.bank_name) errors.bank_name = "Bank Name is required";
        if (!form.has_cards) errors.has_cards = "Credit Card status required";
        if (form.has_cards === "yes") {
            if (!form.no_of_cards || form.no_of_cards < 1)
                errors.no_of_cards = "Number of Cards required (min 1)";
            if (!form.card_limit || form.card_limit.length < 3)
                errors.card_limit = "Card Limit required (min 3 digits)";
        }
    }
    if (step === 3) {
        if (!form.grantSelect) errors.grantSelect = "Select a grant area";
        if (!form.amount_applied)
            errors.amount_applied = "Select a grant amount category";
        if (!form.grantDescription || form.grantDescription.length < 30)
            errors.grantDescription = "Description required (min 30 chars)";
        if (!form.id_front) errors.id_front = "Front of ID is required";
        if (!form.id_back) errors.id_back = "Back of ID is required";
    }
    return errors;
}

const reviewFields = [
    { key: "first_name", label: "First Name" },
    { key: "middle_name", label: "Middle Name" },
    { key: "last_name", label: "Last Name" },
    { key: "address", label: "Address" },
    { key: "zipCode", label: "Zip Code" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "gender", label: "Gender" },
    { key: "dob", label: "Date of Birth" },
    { key: "email", label: "Email" },
    { key: "phone_number", label: "Phone Number" },
    { key: "income", label: "Monthly Income" },
    { key: "maritalStatus", label: "Marital Status" },
    { key: "ssn", label: "SSN" },
    { key: "nextOfKin", label: "Next of Kin" },
    { key: "motherName", label: "Mother's Name" },
    { key: "hearingStatus", label: "Hearing Status" },
    { key: "housingType", label: "Housing Type" },
    { key: "bank_name", label: "Bank Name" },
    { key: "phoneCourier", label: "Phone Courier" },
    { key: "has_cards", label: "Credit Cards" },
    { key: "no_of_cards", label: "No of Cards" },
    { key: "card_limit", label: "Card Limit" },
    { key: "grantSelect", label: "Selected Grant" },
    { key: "amount_applied", label: "Grant Amount Category" },
    { key: "grantDescription", label: "Grant Description detail" },
];

const ApplicationPage = () => {
    const [form, setForm] = useState(initialForm);
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    // New: track if user has unsaved changes
    const [isDirty, setIsDirty] = useState(false);

    // New: show only a compact submission spinner (hide form) while submitting
    const [showSpinnerOnly, setShowSpinnerOnly] = useState(false);

    // New: track if user is online
    const [isOnline, setIsOnline] = useState(window.navigator.onLine);

    // New: slow network detection state
    const [isSlowNetwork, setIsSlowNetwork] = useState(false);

    // New: hold stable blob URLs for previews
    const [previews, setPreviews] = useState({ id_front: null, id_back: null });

    // preview ref to avoid revoking newly created URLs by mistake
    const previewsRef = useRef({ id_front: null, id_back: null });

    // New: refs for file inputs
    const frontInputRef = useRef(null);
    const backInputRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Network Information API handling (detect slow connections / save-data)
        const conn =
            typeof navigator !== "undefined" &&
            (navigator.connection ||
                navigator.mozConnection ||
                navigator.webkitConnection);
        const updateSlow = () => {
            if (!conn) {
                setIsSlowNetwork(false);
                return;
            }
            const effective = conn.effectiveType || "";
            const saveData = conn.saveData || false;
            setIsSlowNetwork(
                saveData || effective === "2g" || effective === "slow-2g"
            );
        };
        updateSlow();
        if (conn && conn.addEventListener) {
            conn.addEventListener("change", updateSlow);
        } else if (conn && typeof conn.onchange === "function") {
            conn.onchange = updateSlow;
        }

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            if (conn && conn.removeEventListener)
                conn.removeEventListener("change", updateSlow);
        };
    }, []);

    // warn user if they attempt to refresh/close the page while there are unsaved changes
    useEffect(() => {
        const onBeforeUnload = (e) => {
            if (!isDirty || submitting) return;
            const message =
                "You have unsaved changes. If you refresh or leave, you will lose all filled information.";
            // Most browsers ignore the custom message, but setting returnValue is required
            e.preventDefault();
            e.returnValue = message;
            return message;
        };

        window.addEventListener("beforeunload", onBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
        };
    }, [isDirty, submitting]);

    // helper: format SSN input into XXX-XX-XXXX as user types
    const formatSSNInput = (value) => {
        // remove non-digits and limit to 9 digits
        const digits = String(value).replace(/\D/g, "").slice(0, 9);
        if (digits.length > 5) {
            return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(
                5
            )}`;
        } else if (digits.length > 3) {
            return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        }
        return digits;
    };

    // Replace existing handleChange with this (adds zipCode digit-only handling)
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        // any real change means the form is dirty
        setIsDirty(true);

        if (type === "file") {
            const file = files && files[0] ? files[0] : null;

            // Allowed types and max size (match backend: 2048 KB)
            const allowed = ["image/jpeg", "image/jpg", "image/png"];
            const maxBytes = 2048 * 1024; // 2MB

            // If user already uploaded a file for this field, ask before overriding
            if (previews[name]) {
                const ok = window.confirm(
                    "You already uploaded an image. Do you want to replace it?"
                );
                if (!ok) {
                    // Reset input value so same file can be re-selected later if needed
                    if (name === "id_front" && frontInputRef.current)
                        frontInputRef.current.value = "";
                    if (name === "id_back" && backInputRef.current)
                        backInputRef.current.value = "";
                    return;
                }
            }

            if (!file) {
                // user cleared input
                // revoke old preview if present
                setPreviews((prev) => {
                    if (prev[name]) {
                        try {
                            URL.revokeObjectURL(prev[name]);
                        } catch (er) {}
                    }
                    return { ...prev, [name]: null };
                });
                setForm((prev) => ({ ...prev, [name]: null }));
                setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy[name];
                    return copy;
                });
                return;
            }

            // Validate type
            if (!allowed.includes(file.type)) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: "Invalid file type. Accepted: jpg, jpeg, png.",
                }));
                // clear the input so user can try again
                if (name === "id_front" && frontInputRef.current)
                    frontInputRef.current.value = "";
                if (name === "id_back" && backInputRef.current)
                    backInputRef.current.value = "";
                return;
            }

            // Validate size
            if (file.size > maxBytes) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: "File too large. Max 2MB allowed.",
                }));
                if (name === "id_front" && frontInputRef.current)
                    frontInputRef.current.value = "";
                if (name === "id_back" && backInputRef.current)
                    backInputRef.current.value = "";
                return;
            }

            // Clear field-specific errors and create preview
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy[name];
                return copy;
            });

            // Revoke previous preview for this field if present and create new one
            setPreviews((prev) => {
                if (prev[name]) {
                    try {
                        URL.revokeObjectURL(prev[name]);
                    } catch (er) {
                        // ignore
                    }
                }
                const nextPreview = file ? URL.createObjectURL(file) : null;
                const next = { ...prev, [name]: nextPreview };
                // keep ref in sync
                previewsRef.current = next;
                return next;
            });

            setForm((prev) => ({ ...prev, [name]: file }));
        } else {
            if (name === "ssn") {
                const formatted = formatSSNInput(value);
                setForm((prev) => ({ ...prev, ssn: formatted }));
            } else if (name === "zipCode") {
                // Allow digits only, max length 5
                const digits = String(value).replace(/\D/g, "").slice(0, 5);
                setForm((prev) => ({ ...prev, zipCode: digits }));
            } else {
                setForm((prev) => ({ ...prev, [name]: value }));
            }
        }
    };

    // mark dirty on radio changes
    const handleRadio = (name, value) => {
        setIsDirty(true);
        setForm((prev) => ({ ...prev, [name]: value }));
        if (name === "has_cards" && value === "no") {
            setForm((prev) => ({ ...prev, no_of_cards: "", card_limit: "" }));
        }
    };

    // Add local state for navigation loading
    const [navLoading, setNavLoading] = useState({ next: false, prev: false });

    // Fix: Only allow navigation to next step if no validation errors, and show errors if any
    const nextStep = () => {
        setNavLoading((prev) => ({ ...prev, next: true }));
        setTimeout(() => {
            const stepErrors = validateStep(currentStep, form);
            setErrors(stepErrors);
            if (Object.keys(stepErrors).length === 0) {
                setCurrentStep((prev) => prev + 1);
            }
            setNavLoading((prev) => ({ ...prev, next: false }));
        }, 300); // short delay for spinner feedback
    };

    const previousStep = () => {
        setNavLoading((prev) => ({ ...prev, prev: true }));
        setTimeout(() => {
            setErrors({});
            setCurrentStep((prev) => prev - 1);
            setNavLoading((prev) => ({ ...prev, prev: false }));
        }, 300); // short delay for spinner feedback
    };

    // Update deleteImage to also sync previewsRef (the single correct implementation kept)
    const deleteImage = (field) => {
        // field expected to be "id_front" or "id_back"
        if (!previews[field] && !form[field]) return;
        const ok = window.confirm(
            "Delete this image? You can upload a new one after deleting."
        );
        if (!ok) return;

        // revoke and clear preview URL
        setPreviews((prev) => {
            const next = { ...prev };
            if (next[field]) {
                try {
                    URL.revokeObjectURL(next[field]);
                } catch (e) {
                    // ignore
                }
            }
            next[field] = null;
            // sync ref
            previewsRef.current = next;
            return next;
        });

        // clear file object from form
        setForm((prev) => ({ ...prev, [field]: null }));

        // clear any validation errors for this field
        setErrors((prev) => {
            const copy = { ...prev };
            delete copy[field];
            return copy;
        });

        // reset the native input so user can re-select same file later
        if (field === "id_front" && frontInputRef.current)
            frontInputRef.current.value = "";
        if (field === "id_back" && backInputRef.current)
            backInputRef.current.value = "";

        // mark dirty when deleting an image
        setIsDirty(true);
    };

    // Replace handleSubmit with improved error handling and user-friendly messages
    const handleSubmit = async () => {
        // quick pre-flight file checks (same limits as backend)
        const maxBytes = 2048 * 1024;
        if (form.id_front && form.id_front.size > maxBytes) {
            setSubmitError(
                "Front ID file too large (max 2MB). Please replace."
            );
            return;
        }
        if (form.id_back && form.id_back.size > maxBytes) {
            setSubmitError("Back ID file too large (max 2MB). Please replace.");
            return;
        }

        // Show compact spinner-only UI and mark submitting
        setShowSpinnerOnly(true);
        setSubmitting(true);
        setSubmitError("");
        let controller = new AbortController();
        let timeoutId = null;

        try {
            const data = new FormData();
            // build form data but strip SSN dashes before appending
            Object.entries(form).forEach(([key, value]) => {
                if (value === null || value === undefined) return;
                if (key === "ssn") {
                    const digits = String(value).replace(/\D/g, "").slice(0, 9);
                    data.append("ssn", digits);
                } else {
                    data.append(key, value);
                }
            });

            // Safe env lookup: avoid referencing process directly in browser
            const safeEnv =
                typeof process !== "undefined" &&
                process &&
                process.env &&
                process.env.REACT_APP_API_URL
                    ? process.env.REACT_APP_API_URL
                    : typeof window !== "undefined" && window.REACT_APP_API_URL
                    ? window.REACT_APP_API_URL
                    : null;

            const fallbackBase = safeEnv || "http://localhost:8000";
            const tryUrls = [
                "/api/application/submit",
                `${fallbackBase.replace(/\/$/, "")}/api/application/submit`,
            ];

            let success = false;
            let finalResult = null;
            let lastError = null;

            for (const url of tryUrls) {
                try {
                    const res = await axios.post(url, data, {
                        headers: { "Content-Type": "multipart/form-data" },
                        validateStatus: () => true, // Don't throw on HTTP error status
                        timeout: 60000, // 60 second axios timeout
                        signal: controller.signal,
                    });

                    // Clear timeout since we got a response
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                    }

                    if (res.status === 404) {
                        lastError =
                            "Service temporarily unavailable. Please try again later.";
                        console.error(`404 Error at ${url}:`, res);
                        continue; // Try next URL
                    }

                    // Handle different status codes with user-friendly messages
                    if (res.status >= 400 && res.status < 500) {
                        // Client errors (400-499)
                        if (
                            res.data?.errors &&
                            typeof res.data.errors === "object"
                        ) {
                            const all = Object.values(res.data.errors).flat();
                            lastError = all.join(" ");
                        } else if (res.data?.message) {
                            lastError = res.data.message;
                        } else if (res.status === 422) {
                            lastError =
                                "Please check your information and try again. Some fields may contain invalid data.";
                        } else if (res.status === 413) {
                            lastError =
                                "Files are too large. Please use smaller images (max 2MB each).";
                        } else {
                            lastError =
                                "Please check your information and try again.";
                        }

                        console.error(
                            `Client error ${res.status} at ${url}:`,
                            res.data
                        );
                        break; // Don't try other URLs for client errors
                    }

                    if (res.status >= 500) {
                        // Server errors (500+) - Show friendly message, log details
                        lastError =
                            "We're experiencing technical difficulties. Please try again in a few minutes.";
                        console.error(`Server error ${res.status} at ${url}:`, {
                            status: res.status,
                            statusText: res.statusText,
                            data: res.data,
                            url: url,
                            timestamp: new Date().toISOString(),
                        });
                        continue; // Try next URL for server errors
                    }

                    if (res.status < 200 || res.status >= 300) {
                        // Other non-success status codes
                        lastError =
                            "Something went wrong with your submission. Please try again.";
                        console.error(
                            `Unexpected status ${res.status} at ${url}:`,
                            res
                        );
                        break;
                    }

                    // Success response validation
                    if (!res.data || !res.data.reference) {
                        lastError =
                            "Your application was submitted but we couldn't generate a confirmation. Please contact support.";
                        console.error(
                            "Invalid success response at",
                            url,
                            res.data
                        );
                        break; // Don't try other URLs for invalid responses
                    }

                    // Valid success response
                    finalResult = res.data;
                    success = true;
                    break;
                } catch (err) {
                    // Clear timeout on any error
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                    }

                    // Handle specific error types with user-friendly messages
                    if (
                        err?.code === "ERR_CANCELED" ||
                        err?.name === "CanceledError"
                    ) {
                        lastError =
                            "Request was cancelled. Please try submitting again.";
                        console.error(`Request cancelled at ${url}:`, err);
                        break; // Don't try other URLs for cancellation
                    }

                    if (
                        err?.code === "ECONNABORTED" ||
                        err?.message?.includes("timeout")
                    ) {
                        lastError =
                            "The submission is taking longer than expected. Please check your internet connection and try again.";
                        console.error(`Timeout error at ${url}:`, err);
                        break; // Don't try other URLs for timeout
                    }

                    if (
                        err?.code === "ERR_NETWORK" ||
                        err?.message?.includes("Network Error")
                    ) {
                        lastError =
                            "Network connection problem. Please check your internet and try again.";
                        console.error(`Network error at ${url}:`, err);
                        continue; // Try next URL for network errors
                    }

                    if (err?.response?.status >= 500) {
                        lastError =
                            "We're experiencing technical difficulties. Please try again in a few minutes.";
                        console.error(`Server error via exception at ${url}:`, {
                            status: err.response?.status,
                            statusText: err.response?.statusText,
                            data: err.response?.data,
                            message: err.message,
                            timestamp: new Date().toISOString(),
                        });
                        continue; // Try next URL for server errors
                    }

                    // Generic error
                    lastError = "Something went wrong. Please try again.";
                    console.error(`Generic error at ${url}:`, {
                        message: err.message,
                        code: err.code,
                        name: err.name,
                        stack: err.stack,
                        timestamp: new Date().toISOString(),
                    });
                    continue; // Try next URL
                }
            }

            // Only navigate on true success
            if (success && finalResult?.reference) {
                // Clear dirty state before navigation
                setIsDirty(false);

                // Navigate to success page
                navigate("/success", {
                    state: { reference: finalResult.reference },
                    replace: true, // Prevent back navigation to form
                });
                return; // Exit early on success
            }

            // If we reach here, submission failed
            const friendlyError =
                lastError ||
                "We couldn't submit your application right now. Please try again.";
            // Hide spinner-only UI and show the form with the error
            setShowSpinnerOnly(false);
            setSubmitError(friendlyError);
        } catch (err) {
            // Catch any unexpected errors
            console.error("Unexpected submit error:", {
                message: err.message,
                stack: err.stack,
                timestamp: new Date().toISOString(),
                formData: Object.keys(form), // Log form structure, not values
            });
            // Hide spinner-only UI and show the form with the error
            setShowSpinnerOnly(false);
            setSubmitError(
                "An unexpected error occurred. Please refresh the page and try again."
            );
        } finally {
            // Always cleanup
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            try {
                controller.abort(); // Ensure any pending request is cancelled
            } catch (e) {
                // Ignore abort errors
            }
            setSubmitting(false);
            // Note: do NOT forcibly hide showSpinnerOnly here on success since we return early on success.
        }
    };

    // Clear error for a field on focus
    const handleFocus = (field) => {
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Stepper UI
    const stepLabels = [
        "Contact Information",
        "Personal Details",
        "Grant Details",
        "Preview & Submit",
    ];

    // Replace previous previews cleanup effect with unmount-only cleanup that reads previewsRef
    useEffect(() => {
        return () => {
            Object.values(previewsRef.current).forEach((u) => {
                if (u) {
                    try {
                        URL.revokeObjectURL(u);
                    } catch (e) {
                        // ignore
                    }
                }
            });
        };
    }, []);

    // Add local image preview component (placed near top of the file)
    const PreviewImg = ({ src, alt, className = "", style = {} }) => {
        // ...local state and effects...
        const [loaded, setLoaded] = useState(false);
        const [failed, setFailed] = useState(false);

        useEffect(() => {
            setLoaded(false);
            setFailed(false);
        }, [src]);

        if (!src) return null;

        return (
            <div className={`relative ${className}`} style={{ ...style }}>
                {!loaded && !failed && (
                    <div
                        aria-hidden="true"
                        className="w-full rounded-md bg-gray-200 animate-pulse"
                        style={{ minHeight: 160 }}
                    />
                )}
                {failed && (
                    <div className="text-sm text-red-500 text-center py-4">
                        Preview unavailable
                    </div>
                )}
                <img
                    src={src}
                    alt={alt}
                    loading="eager"
                    onLoad={() => setLoaded(true)}
                    onError={() => setFailed(true)}
                    style={{
                        display: loaded ? "block" : "none",
                        width: "100%",
                        height: "auto",
                        borderRadius: 8,
                    }}
                />
            </div>
        );
    };

    // Fix: Always use <PreviewImg> for both Step 3 and Step 4 previews (not <img> directly).
    // In Step 3 (upload step), replace any <img ...> preview with <PreviewImg ...> for both id_front and id_back:

    return (
        <div className="min-h-screen bg-gray-50 mt-18">
            <section className=" pt-16">
                <div className="formHeader text-gray-800 flex flex-col justify-center items-center space-y-6 px-4 text-center">
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4 z-10">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <h2 className="font-bold text-3xl md:text-5xl text-blue-400 z-10">
                        Grant Application Form
                    </h2>
                    <p className="max-w-2xl text-center font-medium text-lg text-gray-200 leading-relaxed z-10">
                        Complete the form below to apply for financial
                        assistance. All information provided will be kept
                        confidential and secure.
                    </p>
                </div>
            </section>

            {!isOnline && (
                <div className="max-w-4xl mx-auto px-4 mb-6">
                    <div
                        className="p-4 text-amber-800 rounded-xl bg-amber-50 border border-amber-200"
                        role="alert"
                    >
                        <div className="flex items-center gap-3">
                            <svg
                                className="w-5 h-5 text-amber-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div>
                                <span className="font-semibold">
                                    Network Warning:
                                </span>
                                Please check your internet connection and try
                                again.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {submitError && (
                <div className="max-w-4xl mx-auto px-4 mb-6">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-red-800 font-semibold mb-1">
                                    Submission Error
                                </h3>
                                <p className="text-red-700 text-sm">
                                    {submitError}
                                </p>
                            </div>
                            <button
                                className="text-red-400 hover:text-red-600 transition-colors"
                                onClick={() => setSubmitError("")}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Render spinner-only container when showSpinnerOnly is true,
                otherwise render the full form (existing markup). */}
            {showSpinnerOnly ? (
                <div className="max-w-3xl mx-auto my-20">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 py-16 px-6 md:px-10">
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-500 mb-2">
                                Processing Your Application
                            </h3>
                            <p className="text-gray-600 max-w-md text-center">
                                Please wait while we securely review and submit
                                your grant application. Do not close this
                                window.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="formPage relative max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 py-8 px-6 md:px-10 my-10 z-10">
                    {/* Enhanced submission overlay with shimmer effect */}
                    {submitting && (
                        <>
                            <style>{`
                            .submission-shimmer {
                                background: linear-gradient(90deg, 
                                    rgba(59, 130, 246, 0.1) 0%, 
                                    rgba(147, 197, 253, 0.3) 25%, 
                                    rgba(219, 234, 254, 0.5) 50%, 
                                    rgba(147, 197, 253, 0.3) 75%, 
                                    rgba(59, 130, 246, 0.1) 100%);
                                background-size: 200% 100%;
                                animation: shimmer 2s linear infinite;
                            }
                            .text-shimmer {
                                background: linear-gradient(90deg, 
                                    rgba(255, 255, 255, 0.8) 0%, 
                                    rgba(255, 255, 255, 1) 50%, 
                                    rgba(255, 255, 255, 0.8) 100%);
                                background-size: 200% 100%;
                                animation: shimmer 1.5s linear infinite;
                                -webkit-background-clip: text;
                                background-clip: text;
                                color: transparent;
                            }
                            @keyframes shimmer {
                                0% { background-position: -200% 0; }
                                100% { background-position: 200% 0; }
                            }
                            .pulse-ring {
                                animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
                            }
                            @keyframes pulse-ring {
                                0% { transform: scale(0.8); opacity: 1; }
                                80% { transform: scale(1.2); opacity: 0; }
                                100% { transform: scale(1.2); opacity: 0; }
                            }
                        `}</style>
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-2xl">
                                <div className="submission-shimmer absolute inset-0 rounded-2xl"></div>
                                <div className="relative z-10 flex flex-col items-center">
                                    {/* Enhanced loading animation */}
                                    <div className="relative mb-8">
                                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 w-24 h-24 border-2 border-blue-200 rounded-full pulse-ring"></div>
                                        </div>
                                    </div>

                                    {/* Shimmer text */}
                                    <div className="text-center space-y-3">
                                        <h3 className="text-2xl md:text-3xl font-bold text-blue-500">
                                            Processing Your Application
                                        </h3>
                                        <p className="text-gray-600 max-w-md">
                                            Please wait while we securely submit
                                            your grant application. Do not close
                                            this window.
                                        </p>
                                        <div className="flex items-center justify-center gap-2 mt-4">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                            <div
                                                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                                style={{
                                                    animationDelay: "0.1s",
                                                }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                                style={{
                                                    animationDelay: "0.2s",
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {isSlowNetwork && !submitting ? (
                        <div className="space-y-8">
                            {/* Enhanced skeleton loading */}
                            <div className="animate-pulse">
                                <div className="mb-8">
                                    <div className="flex justify-between mb-4">
                                        {Array.from({ length: 4 }).map(
                                            (_, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center space-x-3"
                                                >
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full"></div>
                                </div>

                                <div className="space-y-6">
                                    <div className="w-1/3 h-8 bg-gray-200 rounded"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {Array.from({ length: 6 }).map(
                                            (_, i) => (
                                                <div
                                                    key={i}
                                                    className="space-y-3"
                                                >
                                                    <div className="w-full h-4 bg-gray-200 rounded"></div>
                                                    <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Enhanced stepper */}
                            <div className="mb-12">
                                <div className="w-full">
                                    <div className="flex items-center justify-between mb-6">
                                        {stepLabels.map((label, idx) => {
                                            const stepIndex = idx + 1;
                                            const completed =
                                                currentStep > stepIndex;
                                            const active =
                                                currentStep === stepIndex;
                                            return (
                                                <div
                                                    key={label}
                                                    className="flex-1 flex flex-col items-center text-center relative"
                                                >
                                                    <div
                                                        className={`flex items-center justify-center rounded-full font-bold text-sm transition-all duration-300 ${
                                                            completed
                                                                ? "bg-green-500 text-white shadow-lg"
                                                                : active
                                                                ? "bg-blue-600 text-white shadow-lg ring-4 ring-blue-600/20"
                                                                : "bg-gray-200 text-gray-500"
                                                        } w-12 h-12 md:w-14 md:h-14`}
                                                    >
                                                        {completed ? (
                                                            <svg
                                                                className="w-6 h-6"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="3"
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        ) : (
                                                            stepIndex
                                                        )}
                                                    </div>

                                                    {/* Connection line */}
                                                    {idx <
                                                        stepLabels.length -
                                                            1 && (
                                                        <div
                                                            className={`absolute top-6 left-1/2 w-full h-0.5 -z-10 transition-all duration-300 ${
                                                                currentStep >
                                                                stepIndex
                                                                    ? "bg-green-500"
                                                                    : "bg-gray-200"
                                                            }`}
                                                        ></div>
                                                    )}

                                                    <div
                                                        className={`mt-3 text-xs md:text-sm font-medium transition-colors duration-300 ${
                                                            active
                                                                ? "text-blue-600"
                                                                : completed
                                                                ? "text-green-600"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {label}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out"
                                            style={{
                                                width: `${
                                                    ((currentStep - 1) /
                                                        (totalSteps - 1)) *
                                                    100
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form steps with enhanced styling */}
                            {currentStep === 1 && (
                                <div className="space-y-8">
                                    <div className="border-b border-gray-200 pb-4">
                                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <svg
                                                    className="w-5 h-5 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                            </div>
                                            Personal Information
                                        </h2>
                                        <p className="text-gray-600 mt-2">
                                            Please provide your basic contact
                                            information.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="required-input-label">
                                                First Name
                                            </label>
                                            <input
                                                name="first_name"
                                                value={form.first_name}
                                                onChange={handleChange}
                                                onFocus={() =>
                                                    handleFocus("first_name")
                                                }
                                                className="input"
                                                placeholder="Enter your first name"
                                            />
                                            {errors.first_name && (
                                                <p className="text-red-600 text-sm flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.first_name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="required-input-label">
                                                Middle Name
                                            </label>
                                            <input
                                                name="middle_name"
                                                value={form.middle_name}
                                                onChange={handleChange}
                                                onFocus={() =>
                                                    handleFocus("middle_name")
                                                }
                                                className="input"
                                                placeholder="Enter your middle name"
                                            />
                                            {errors.middle_name && (
                                                <p className="text-red-600 text-sm flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.middle_name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="required-input-label">
                                                Last Name
                                            </label>
                                            <input
                                                name="last_name"
                                                value={form.last_name}
                                                onChange={handleChange}
                                                onFocus={() =>
                                                    handleFocus("last_name")
                                                }
                                                className="input"
                                                placeholder="Enter your last name"
                                            />
                                            {errors.last_name && (
                                                <p className="text-red-600 text-sm flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.last_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="required-input-label">
                                                Address
                                            </label>
                                            <input
                                                name="address"
                                                value={form.address}
                                                onChange={handleChange}
                                                onFocus={() =>
                                                    handleFocus("address")
                                                }
                                                className="input"
                                                placeholder="Street address, P.O. box, etc."
                                            />
                                            {errors.address && (
                                                <p className="text-red-600 text-sm flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.address}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="required-input-label">
                                                Zip Code
                                            </label>
                                            <input
                                                name="zipCode"
                                                value={form.zipCode}
                                                onChange={handleChange}
                                                onFocus={() =>
                                                    handleFocus("zipCode")
                                                }
                                                className="input"
                                                maxLength={5}
                                                placeholder="12345"
                                                inputMode="numeric"
                                            />
                                            {errors.zipCode && (
                                                <p className="text-red-600 text-sm flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.zipCode}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="required-input-label">
                                                City
                                            </label>
                                            <input
                                                name="city"
                                                value={form.city}
                                                onChange={handleChange}
                                                onFocus={() =>
                                                    handleFocus("city")
                                                }
                                                className="input"
                                                placeholder="Enter your city"
                                            />
                                            {errors.city && (
                                                <p className="text-red-600 text-sm flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.city}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="required-input-label">
                                                State *
                                            </label>
                                            <input
                                                name="state"
                                                value={form.state}
                                                onChange={handleChange}
                                                onFocus={() =>
                                                    handleFocus("state")
                                                }
                                                className="input"
                                                placeholder="Enter your state"
                                            />
                                            {errors.state && (
                                                <p className="text-red-600 text-sm flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.state}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="required-input-label">
                                                Gender
                                            </label>
                                            <select
                                                name="gender"
                                                value={form.gender}
                                                onChange={handleChange}
                                                onFocus={() =>
                                                    handleFocus("gender")
                                                }
                                                className="input"
                                            >
                                                <option value="">
                                                    Choose Gender
                                                </option>
                                                {genderOptions.map((opt) => (
                                                    <option
                                                        key={opt}
                                                        value={opt}
                                                    >
                                                        {opt}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.gender && (
                                                <p className="text-red-600 text-sm flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.gender}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="required-input-label">
                                                Date of Birth
                                            </label>
                                            <input
                                                name="dob"
                                                type="date"
                                                value={form.dob}
                                                onChange={handleChange}
                                                onFocus={() =>
                                                    handleFocus("dob")
                                                }
                                                className="input"
                                            />
                                            {errors.dob && (
                                                <p className="text-red-600 text-sm flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.dob}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="required-input-label">
                                                Phone Number
                                            </label>
                                            <input
                                                name="phone_number"
                                                value={form.phone_number}
                                                onChange={handleChange}
                                                onFocus={() =>
                                                    handleFocus("phone_number")
                                                }
                                                className="input"
                                                placeholder="Phone number ( e.g. 555-123-4567)"
                                                type="tel"
                                                minLength={10}
                                                maxLength={15}
                                            />
                                            {errors.phone_number && (
                                                <p className="text-red-600 text-sm flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.phone_number}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="required-input-label">
                                                Email
                                            </label>
                                            <input
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                onFocus={() =>
                                                    handleFocus("email")
                                                }
                                                className="input"
                                                placeholder="you@example.com"
                                                type="email"
                                            />
                                            <span className="text-sm text-gray-800 italic">
                                                This email address will be used
                                                for communication regarding your
                                                application.
                                            </span>
                                            {errors.email && (
                                                <p className="text-red-600 text-sm flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2 */}
                            {currentStep === 2 && (
                                <>
                                    <h2 className="font-bold text-2xl mb-10 border-b-2 text-gray-700">
                                        PERSONAL INFORMATION :
                                    </h2>
                                    <div className="space-y-8">
                                        <div>
                                            <label className="required-input-label">
                                                Monthly Income
                                            </label>
                                            <input
                                                name="income"
                                                value={form.income}
                                                onChange={handleChange}
                                                onFocus={() =>
                                                    handleFocus("income")
                                                }
                                                className="input"
                                            />
                                            {errors.income && (
                                                <span className="text-red-500">
                                                    {errors.income}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-7">
                                            <div className="w-full">
                                                <label className="label">
                                                    Marital Status
                                                </label>
                                                <select
                                                    name="maritalStatus"
                                                    value={form.maritalStatus}
                                                    onChange={handleChange}
                                                    className="input"
                                                >
                                                    <option value="">
                                                        Select your status
                                                    </option>
                                                    {maritalOptions.map(
                                                        (opt) => (
                                                            <option
                                                                key={opt}
                                                                value={opt}
                                                            >
                                                                {opt}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                            <div className="w-full">
                                                <label className="required-input-label">
                                                    SSN
                                                </label>
                                                <input
                                                    name="ssn"
                                                    value={form.ssn}
                                                    onChange={handleChange}
                                                    onFocus={() =>
                                                        handleFocus("ssn")
                                                    }
                                                    className="input"
                                                    maxLength={11}
                                                    placeholder="XXX-XX-XXXX"
                                                    inputMode="numeric"
                                                    pattern="[0-9\-]*"
                                                />
                                                {errors.ssn && (
                                                    <span className="text-red-500">
                                                        {errors.ssn}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-7">
                                            <div className="w-full">
                                                <label className="label">
                                                    Next Of Kin
                                                </label>
                                                <input
                                                    name="nextOfKin"
                                                    value={form.nextOfKin}
                                                    onChange={handleChange}
                                                    className="input"
                                                />
                                            </div>
                                            <div className="w-full">
                                                <label className="label">
                                                    Mother's Name
                                                </label>
                                                <input
                                                    name="motherName"
                                                    value={form.motherName}
                                                    onChange={handleChange}
                                                    className="input"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-7">
                                            <div className="w-full">
                                                <label className="label">
                                                    Hearing or Deaf?
                                                </label>
                                                <select
                                                    name="hearingStatus"
                                                    value={form.hearingStatus}
                                                    onChange={handleChange}
                                                    className="input"
                                                >
                                                    <option value="">
                                                        Select Status
                                                    </option>
                                                    {hearingOptions.map(
                                                        (opt) => (
                                                            <option
                                                                key={opt}
                                                                value={opt}
                                                            >
                                                                {opt}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                            <div className="w-full">
                                                <label className="label">
                                                    Housing Type
                                                </label>
                                                <select
                                                    name="housingType"
                                                    value={form.housingType}
                                                    onChange={handleChange}
                                                    className="input"
                                                >
                                                    <option value="">
                                                        Select Option
                                                    </option>
                                                    {housingType.map((opt) => (
                                                        <option
                                                            key={opt}
                                                            value={opt}
                                                        >
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="required-input-label">
                                                Name of your Bank's
                                            </label>
                                            <input
                                                name="bank_name"
                                                value={form.bank_name}
                                                onChange={handleChange}
                                                onFocus={() =>
                                                    handleFocus("bank_name")
                                                }
                                                className="input"
                                            />
                                            <h2 className="text-gray-600 text-2xl font-semibold">
                                                Do you have Credit Card "s"?
                                            </h2>
                                            <div className="flex space-x-10">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="has_cards"
                                                        checked={
                                                            form.has_cards ===
                                                            "yes"
                                                        }
                                                        onChange={() =>
                                                            handleRadio(
                                                                "has_cards",
                                                                "yes"
                                                            )
                                                        }
                                                        onFocus={() =>
                                                            handleFocus(
                                                                "has_cards"
                                                            )
                                                        }
                                                    />
                                                    <span className="text-xl font-semibold ml-2">
                                                        Yes
                                                    </span>
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="has_cards"
                                                        checked={
                                                            form.has_cards ===
                                                            "no"
                                                        }
                                                        onChange={() =>
                                                            handleRadio(
                                                                "has_cards",
                                                                "no"
                                                            )
                                                        }
                                                        onFocus={() =>
                                                            handleFocus(
                                                                "has_cards"
                                                            )
                                                        }
                                                    />
                                                    <span className="text-xl font-semibold ml-2">
                                                        No
                                                    </span>
                                                </label>
                                            </div>
                                            {errors.has_cards && (
                                                <span className="text-red-500">
                                                    {errors.has_cards}
                                                </span>
                                            )}
                                        </div>
                                        {form.has_cards === "yes" && (
                                            <div className="flex flex-col md:flex-row gap-7">
                                                <div className="w-full">
                                                    <label className="required-input-label">
                                                        Number of Credit Cards
                                                    </label>
                                                    <input
                                                        name="no_of_cards"
                                                        type="number"
                                                        value={form.no_of_cards}
                                                        onChange={handleChange}
                                                        onFocus={() =>
                                                            handleFocus(
                                                                "no_of_cards"
                                                            )
                                                        }
                                                        className="input"
                                                    />
                                                    <span className="text-slate-700 my-1 block">
                                                        Note: This won't affect
                                                        your credit in whatever
                                                        way
                                                    </span>
                                                    {errors.no_of_cards && (
                                                        <span className="text-red-500">
                                                            {errors.no_of_cards}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="w-full">
                                                    <label className="required-input-label">
                                                        Credit Limit ($)
                                                    </label>
                                                    <input
                                                        name="card_limit"
                                                        value={form.card_limit}
                                                        onChange={handleChange}
                                                        onFocus={() =>
                                                            handleFocus(
                                                                "card_limit"
                                                            )
                                                        }
                                                        className="input"
                                                    />
                                                    {errors.card_limit && (
                                                        <span className="text-red-500">
                                                            {errors.card_limit}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Step 3 */}
                            {currentStep === 3 && (
                                <>
                                    <h2 className="font-bold text-2xl mb-10 border-b-2 text-gray-700">
                                        GRANT DETAILS :
                                    </h2>
                                    <div className="space-y-10">
                                        <div className=" flex flex-col md:flex-row gap-7 items-center">
                                            <div className="w-full">
                                                <label className="required-input-label">
                                                    Grant Amount Category
                                                </label>
                                                <select
                                                    name="amount_applied"
                                                    value={form.amount_applied}
                                                    onChange={handleChange}
                                                    onFocus={() =>
                                                        handleFocus(
                                                            "amount_applied"
                                                        )
                                                    }
                                                    className="input"
                                                >
                                                    <option value="">
                                                        Select a grant amount
                                                        category
                                                    </option>
                                                    {grantAmountOptions.map(
                                                        (opt) => (
                                                            <option
                                                                key={opt}
                                                                value={opt}
                                                            >
                                                                {opt}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                {errors.amount_applied && (
                                                    <span className="text-red-500">
                                                        {errors.amount_applied}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="w-full">
                                                <label className="required-input-label">
                                                    Check the area of Grant you
                                                    are interested in
                                                </label>
                                                <select
                                                    name="grantSelect"
                                                    value={form.grantSelect}
                                                    onChange={handleChange}
                                                    onFocus={() =>
                                                        handleFocus(
                                                            "grantSelect"
                                                        )
                                                    }
                                                    className="input"
                                                >
                                                    <option value="">
                                                        Select the area you're
                                                        interested
                                                    </option>
                                                    {grantOptions.map((opt) => (
                                                        <option
                                                            key={opt}
                                                            value={opt}
                                                        >
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.grantSelect && (
                                                    <span className="text-red-500">
                                                        {errors.grantSelect}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="required-input-label">
                                                Describe in detail who you're
                                                apply for the Federal Government
                                                Grant
                                            </label>
                                            <textarea
                                                name="grantDescription"
                                                value={form.grantDescription}
                                                onChange={handleChange}
                                                onFocus={() =>
                                                    handleFocus(
                                                        "grantDescription"
                                                    )
                                                }
                                                className="input"
                                                rows={6}
                                            />
                                            {errors.grantDescription && (
                                                <span className="text-red-500">
                                                    {errors.grantDescription}
                                                </span>
                                            )}
                                            <span className="text-lg my-2 block">
                                                Be specific about your needs and
                                                how this grant will help you
                                                achieve your goals.
                                            </span>
                                        </div>
                                        <div className="p-10 border-opacity-50 border-2 border-gray-600 rounded-md max-w-screen-md mx-auto px-4">
                                            <h3 className="text-2xl font-semibold text-gray-700 text-center my-7">
                                                Upload a clear picture of any
                                                Government ID or Drivers License
                                            </h3>
                                            <div className="space-y-8 flex flex-col justify-center items-center">
                                                <div className="flex flex-col space-y-3">
                                                    <label className="text-center text-xl mr-1 font-medium text-blue-800 after:content-['*'] after:text-red-500">
                                                        Upload Image "Front
                                                        Picture"
                                                    </label>

                                                    <input
                                                        ref={frontInputRef}
                                                        name="id_front"
                                                        type="file"
                                                        accept=".jpg,.jpeg,.png"
                                                        onChange={handleChange}
                                                        onFocus={() =>
                                                            handleFocus(
                                                                "id_front"
                                                            )
                                                        }
                                                        className="input"
                                                        disabled={false}
                                                    />
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Accepted: jpg, jpeg, png
                                                        — Max 2MB
                                                    </div>
                                                    {errors.id_front && (
                                                        <span className="text-red-500">
                                                            {errors.id_front}
                                                        </span>
                                                    )}
                                                    {form.id_front &&
                                                        previews.id_front && (
                                                            <div className="my-3 rounded-md">
                                                                <PreviewImg
                                                                    src={
                                                                        previews.id_front
                                                                    }
                                                                    alt="ID Front"
                                                                    className="max-w-xs mx-auto my-3"
                                                                    style={{
                                                                        maxWidth: 300,
                                                                    }}
                                                                />
                                                                <div className="flex justify-center mt-2 gap-3">
                                                                    <button
                                                                        type="button"
                                                                        className="btn-secondary px-3 py-1 text-sm flex items-center gap-2"
                                                                        onClick={() => {
                                                                            if (
                                                                                frontInputRef.current
                                                                            )
                                                                                frontInputRef.current.click();
                                                                        }}
                                                                    >
                                                                        Update{" "}
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="px-3 py-1 text-red-700 focus:text-red-800"
                                                                        onClick={() =>
                                                                            deleteImage(
                                                                                "id_front"
                                                                            )
                                                                        }
                                                                    >
                                                                        <RiDeleteBinLine
                                                                            size={
                                                                                28
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>
                                                <div className="flex flex-col space-y-3">
                                                    <label className="text-center text-xl mr-1 font-medium text-blue-800 after:content-['*'] after:text-red-500">
                                                        Upload Image "Back
                                                        Picture"
                                                    </label>

                                                    <input
                                                        ref={backInputRef}
                                                        name="id_back"
                                                        type="file"
                                                        accept=".jpg,.jpeg,.png"
                                                        onChange={handleChange}
                                                        onFocus={() =>
                                                            handleFocus(
                                                                "id_back"
                                                            )
                                                        }
                                                        className="input"
                                                        disabled={false}
                                                    />
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Accepted: jpg, jpeg, png
                                                        — Max 2MB
                                                    </div>
                                                    {errors.id_back && (
                                                        <span className="text-red-500">
                                                            {errors.id_back}
                                                        </span>
                                                    )}
                                                    {form.id_back &&
                                                        previews.id_back && (
                                                            <div className="my-3 rounded-md">
                                                                <PreviewImg
                                                                    src={
                                                                        previews.id_back
                                                                    }
                                                                    alt="ID Back"
                                                                    className="max-w-xs mx-auto my-3"
                                                                    style={{
                                                                        maxWidth: 300,
                                                                    }}
                                                                />
                                                                <div className="flex justify-center mt-2 gap-3">
                                                                    <button
                                                                        type="button"
                                                                        className="btn-secondary px-3 py-1 text-sm flex items-center gap-2"
                                                                        onClick={() => {
                                                                            if (
                                                                                backInputRef.current
                                                                            )
                                                                                backInputRef.current.click();
                                                                        }}
                                                                    >
                                                                        Update{" "}
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="text-red-700 px-3 py-1 focus:text-red-800"
                                                                        onClick={() =>
                                                                            deleteImage(
                                                                                "id_back"
                                                                            )
                                                                        }
                                                                    >
                                                                        <RiDeleteBinLine
                                                                            size={
                                                                                28
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Step 4: Review Page */}
                            {currentStep === 4 && (
                                <div className="relative">
                                    <div className="py-8 px-2 md:px-8 space-y-8 bg-gradient-to-br from-slate-900/90 via-slate-800/95 to-slate-900/90 rounded-2xl shadow-2xl border border-blue-900/10 max-w-3xl mx-auto">
                                        <h3 className="font-bold text-2xl md:text-3xl mb-8 border-b-2 border-blue-700/30 text-blue-100 text-center tracking-wide">
                                            Review Your Application Before
                                            Submitting
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <ul className="space-y-3">
                                                {reviewFields.map(
                                                    ({ key, label }) => {
                                                        // Exclude card fields if not applicable
                                                        if (
                                                            key ===
                                                                "no_of_cards" &&
                                                            form.has_cards !==
                                                                "yes"
                                                        )
                                                            return null;
                                                        if (
                                                            key ===
                                                                "card_limit" &&
                                                            form.has_cards !==
                                                                "yes"
                                                        )
                                                            return null;
                                                        // Hide empty fields for a cleaner review
                                                        if (!form[key])
                                                            return null;
                                                        return (
                                                            <li
                                                                key={key}
                                                                className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 bg-slate-800/60 rounded-lg px-3 py-2 overflow-auto"
                                                            >
                                                                <span className="font-semibold text-blue-200 text-base md:text-lg w-44 md:w-40">
                                                                    {label}:
                                                                </span>
                                                                <span className="text-blue-50 text-base md:text-lg break-words">
                                                                    {form[key]}
                                                                </span>
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                            <div className="flex flex-col gap-6 items-center justify-center">
                                                <div className="w-full flex flex-col items-center">
                                                    <span className="font-semibold text-blue-200 text-base md:text-lg mb-2">
                                                        Front Image
                                                    </span>
                                                    {form.id_front &&
                                                    previews.id_front ? (
                                                        <PreviewImg
                                                            className="rounded-xl shadow-lg border border-blue-900/20 w-full max-w-xs"
                                                            src={
                                                                previews.id_front
                                                            }
                                                            alt="Front Picture"
                                                            style={{
                                                                maxWidth: 260,
                                                                minHeight: 120,
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-blue-400 text-xs italic">
                                                            No image uploaded
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="w-full flex flex-col items-center">
                                                    <span className="font-semibold text-blue-200 text-base md:text-lg mb-2">
                                                        Back Image
                                                    </span>
                                                    {form.id_back &&
                                                    previews.id_back ? (
                                                        <PreviewImg
                                                            className="rounded-xl shadow-lg border border-blue-900/20 w-full max-w-xs"
                                                            src={
                                                                previews.id_back
                                                            }
                                                            alt="Back Picture"
                                                            style={{
                                                                maxWidth: 260,
                                                                minHeight: 120,
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-blue-400 text-xs italic">
                                                            No image uploaded
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center text-blue-300 mt-6 text-base md:text-lg">
                                            Please confirm all details above
                                            before submitting. You can go back
                                            to edit if needed.
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced navigation buttons */}
                            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 ">
                                {currentStep > 1 && (
                                    <button
                                        className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
                                        type="button"
                                        onClick={previousStep}
                                        disabled={submitting || navLoading.prev}
                                    >
                                        {navLoading.prev ? (
                                            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
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
                                                    d="M15 19l-7-7 7-7"
                                                />
                                            </svg>
                                        )}
                                        Previous
                                    </button>
                                )}

                                <div className="flex gap-4 ml-auto">
                                    {currentStep < totalSteps && (
                                        <button
                                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                                            type="button"
                                            onClick={nextStep}
                                            disabled={
                                                submitting || navLoading.next
                                            }
                                        >
                                            Next
                                            {navLoading.next ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
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
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    )}

                                    {currentStep === totalSteps && (
                                        <>
                                            <div className="flex gap-4 flex-col md:flex-row">
                                                <button
                                                    className="md:px-6 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
                                                    type="button"
                                                    onClick={() =>
                                                        setCurrentStep(1)
                                                    }
                                                    disabled={submitting}
                                                >
                                                    Edit Details
                                                </button>
                                                <button
                                                    className="flex items-center gap-2 px-4 py-3 md:px-8 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                                                    type="button"
                                                    onClick={handleSubmit}
                                                    disabled={
                                                        submitting || !isOnline
                                                    }
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
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    Confirm & Submit
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ApplicationPage;
