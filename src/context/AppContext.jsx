import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [credit, setCredit] = useState(0);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [generationPrompt, setGenerationPrompt] = useState("");
    const [generationHistory, setGenerationHistory] = useState([]);
    const [backendUrl] = useState(
        import.meta.env.VITE_API_URL || "http://localhost:4000"
    );
    const [isGenerating, setIsGenerating] = useState(false);

    const navigate = useNavigate();

    console.log('user: ', user);


    // Initialize axios instance with the token
    const api = axios.create({
        baseURL: backendUrl,
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
        },
        timeout: 30000, // 30 seconds timeout
    });

    // Load user data when token changes
    useEffect(() => {
        if (token) {
            loadCreditsData();
        }
    }, [token]);

    const handleLogout = useCallback(() => {
        setUser(null);
        setToken(null);
        setCredit(0);
        setGeneratedImage(null);
        setGenerationHistory([]);
        localStorage.removeItem("token");
        navigate("/");
        toast.success("Logged out successfully");
    }, [navigate]);

    const handleLoginSuccess = useCallback((userData, token) => {
        setToken(token);
        localStorage.setItem("token", token);
        const updatedUser = {
            ...userData,
            creditBalance: userData.creditBalance ?? 5,
        };
        setUser(updatedUser);
        setCredit(updatedUser.creditBalance);
    }, []);

    const loadCreditsData = useCallback(async () => {
        try {
            const { data } = await api.get("/api/users/credits");
            if (data.success) {
                setCredit(data.credits);
                setUser((prev) => ({
                    ...prev,
                    ...data.user,
                    creditBalance: data.credits,
                }));
            }
        } catch (error) {
            console.error("Credit load error:", error);
            if (error.response?.status === 401) {
                handleLogout();
                toast.error("Session expired. Please login again.");
            } else {
                toast.error(error.response?.data?.message || "Failed to load credits");
            }
        }
    }, [api, handleLogout]);

    const generateImage = useCallback(async (prompt) => {
        if (!prompt || prompt.trim().length === 0) {
            toast.error("Please enter a valid prompt");
            return null;
        }

        if (!user) {
            toast.error("Please login to generate images");
            setShowLogin(true);
            return null;
        }

        if (credit <= 0) {
            toast.error("You don't have enough credits");
            navigate("/pricing");
            return null;
        }


        setIsGenerating(true);
        try {
            const { data } = await api.post(
                "/api/image/generate-image",
                { prompt, userId: user.id },
                { withCredentials: true },
            );

            if (data.success) {
                setGeneratedImage(data.resultImage);
                setGenerationPrompt(prompt);
                setCredit(data.creditBalance);
                setGenerationHistory(prev => [
                    { prompt, image: data.resultImage, timestamp: new Date() },
                    ...prev.slice(0, 9) // Keep last 10 items
                ]);
                toast.success(`Image generated! Credits remaining: ${data.creditBalance}`);
                return data.resultImage;
            }
            throw new Error(data.message || "Generation failed");
        } catch (error) {
            console.error("Generation error:", error);

            let errorMessage = "Failed to generate image";
            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = "Session expired. Please login again.";
                    handleLogout();
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.code === "ECONNABORTED") {
                errorMessage = "Request timeout. Please try again.";
            }

            toast.error(errorMessage);
            return null;
        } finally {
            setIsGenerating(false);
        }
    }, [user, credit, api, navigate, handleLogout]);

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        handleLogout,
        handleLoginSuccess,
        generateImage,
        generatedImage,
        generationPrompt,
        generationHistory,
        isGenerating,
        loadCreditsData,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;