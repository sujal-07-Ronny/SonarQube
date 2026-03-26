import { useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// A color map for Tailwind CSS dynamic classes
const colorMap = {
    blue: { bg: 'bg-blue-50', from: 'from-blue-50', to: 'to-blue-100', hoverFrom: 'hover:from-blue-100', hoverTo: 'hover:to-blue-200', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', from: 'from-purple-50', to: 'to-purple-100', hoverFrom: 'hover:from-purple-100', hoverTo: 'hover:to-purple-200', text: 'text-purple-600' },
    pink: { bg: 'bg-pink-50', from: 'from-pink-50', to: 'to-pink-100', hoverFrom: 'hover:from-pink-100', hoverTo: 'hover:to-pink-200', text: 'text-pink-600' },
    green: { bg: 'bg-green-50', from: 'from-green-50', to: 'to-green-100', hoverFrom: 'hover:from-green-100', hoverTo: 'hover:to-green-200', text: 'text-green-600' },
    yellow: { bg: 'bg-yellow-50', from: 'from-yellow-50', to: 'to-yellow-100', hoverFrom: 'hover:from-yellow-100', hoverTo: 'hover:to-yellow-200', text: 'text-yellow-600' },
    orange: { bg: 'bg-orange-50', from: 'from-orange-50', to: 'to-orange-100', hoverFrom: 'hover:from-orange-100', hoverTo: 'hover:to-orange-200', text: 'text-orange-600' },
    gray: { bg: 'bg-gray-50', from: 'from-gray-50', to: 'to-gray-100', hoverFrom: 'hover:from-gray-100', hoverTo: 'hover:to-gray-200', text: 'text-gray-600' },
    indigo: { bg: 'bg-indigo-50', from: 'from-indigo-50', to: 'to-indigo-100', hoverFrom: 'hover:from-indigo-100', hoverTo: 'hover:to-indigo-200', text: 'text-indigo-600' },
    red: { bg: 'bg-red-50', from: 'from-red-50', to: 'to-red-100', hoverFrom: 'hover:from-red-100', hoverTo: 'hover:to-red-200', text: 'text-red-600' }
};

const ImageGenerator = () => {
    const [activeTab, setActiveTab] = useState('generate');
    const [stylePreset, setStylePreset] = useState('realistic');
    const [aspectRatio, setAspectRatio] = useState('square');
    const [showPromptWizard, setShowPromptWizard] = useState(false);
    const [promptCategory, setPromptCategory] = useState('landscape');
    const [promptAttributes, setPromptAttributes] = useState([]);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [seedValue, setSeedValue] = useState('');
    const [cfgScale, setCfgScale] = useState(7.5);
    const [steps, setSteps] = useState(30);
    const [upscaleLevel, setUpscaleLevel] = useState(1);
    const [showBatchGenerate, setShowBatchGenerate] = useState(false);
    const [batchCount, setBatchCount] = useState(1);
    const [batchResults, setBatchResults] = useState([]);
    const [showImageToImage, setShowImageToImage] = useState(false);
    const [imageToImageStrength, setImageToImageStrength] = useState(0.5);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [showPromptEnhancer, setShowPromptEnhancer] = useState(false);
    const [enhancedPrompt, setEnhancedPrompt] = useState('');
    const [showNegativePrompt, setShowNegativePrompt] = useState(false);
    const [negativePrompt, setNegativePrompt] = useState('');
    const [showPromptHistory, setShowPromptHistory] = useState(false);
    const [savedPrompts, setSavedPrompts] = useState([]);
    const imageRef = useRef(null);
    const baseEditImageSrcRef = useRef(null);
    const liveCanvasRef = useRef(null);
    const tempCanvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const debounceTimerRef = useRef(null);
    const fileInputRef = useRef(null);
    const batchProgressRef = useRef(0);
    const adjustmentsStateRef = useRef({
        brightness: 100,
        contrast: 100,
        saturation: 100,
        temperature: 0,
        highlights: 0,
        shadows: 0,
        clarity: 0,
        vignette: 0,
        flipHorizontal: false,
        flipVertical: false,
    });
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [temperature, setTemperature] = useState(0);
    const [highlights, setHighlights] = useState(0);
    const [shadows, setShadows] = useState(0);
    const [clarity, setClarity] = useState(0);
    const [vignette, setVignette] = useState(0);
    const [flipHorizontal, setFlipHorizontal] = useState(false);
    const [flipVertical, setFlipVertical] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [historySearchTerm, setHistorySearchTerm] = useState('');
    const [historySortOrder, setHistorySortOrder] = useState('date_desc');
    const [historyFilterStyle, setHistoryFilterStyle] = useState('all');
    const [isBatchGenerating, setIsBatchGenerating] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // This section has been refactored for clarity and to directly track user actions in local state
    const [analyticsData, setAnalyticsData] = useState(() => {
        const storedData = localStorage.getItem('user_analytics_data');
        return storedData ? JSON.parse(storedData) : {
            generationsByStyle: {},
            generationsByRatio: {},
            promptsSaved: 0,
            imagesEdited: 0,
            downloads: 0,
            generationCount: 0
        };
    });

    useEffect(() => {
        localStorage.setItem('user_analytics_data', JSON.stringify(analyticsData));
    }, [analyticsData]);

    const trackEvent = useCallback((event, details = {}) => {
        setAnalyticsData(prev => {
            const newAnalytics = { ...prev };
            switch (event) {
                case 'generate':
                    newAnalytics.generationsByStyle[details.style] = (newAnalytics.generationsByStyle[details.style] || 0) + 1;
                    newAnalytics.generationsByRatio[details.ratio] = (newAnalytics.generationsByRatio[details.ratio] || 0) + 1;
                    newAnalytics.generationCount = (newAnalytics.generationCount || 0) + 1;
                    break;
                case 'savePrompt':
                    newAnalytics.promptsSaved = (newAnalytics.promptsSaved || 0) + 1;
                    break;
                case 'editImage':
                    newAnalytics.imagesEdited = (newAnalytics.imagesEdited || 0) + 1;
                    break;
                case 'downloadImage':
                    newAnalytics.downloads = (newAnalytics.downloads || 0) + 1;
                    break;
                default:
                    break;
            }
            return newAnalytics;
        });
    }, []);

    // VOICE-BASED PROMPT FUNCTIONALITY
    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setPrompt(transcript);
                toast.success('Voice prompt captured!');
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                toast.error(`Voice input error: ${event.error}`);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const handleVoiceInput = () => {
        if (!recognitionRef.current) {
            toast.error('Voice input is not supported in your browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const stylePresets = [
        { id: 'realistic', name: 'Photorealistic 🖼️', prompt: 'hyper realistic, 8k, ultra detailed' },
        { id: 'anime', name: 'Anime 🎌', prompt: 'anime style, vibrant colors, detailed background' },
        { id: 'oil-painting', name: 'Oil Painting 🎨', prompt: 'oil painting, brush strokes visible, artistic' },
        { id: 'cyberpunk', name: 'Cyberpunk 🌆', prompt: 'cyberpunk style, neon lights, futuristic city' },
        { id: 'fantasy', name: 'Fantasy 🏰', prompt: 'fantasy art, magical, ethereal lighting' },
        { id: 'watercolor', name: 'Watercolor 🌊', prompt: 'watercolor painting, soft edges, pastel colors' },
        { id: 'steampunk', name: 'Steampunk ⚙️', prompt: 'steampunk style, brass gears, mechanical details' },
        { id: 'low-poly', name: 'Low Poly 🔶', prompt: 'low poly style, geometric shapes, flat colors' },
        { id: 'pixel-art', name: 'Pixel Art 🎮', prompt: 'pixel art, retro video game style' },
        { id: 'isometric', name: 'Isometric 🧊', prompt: 'isometric perspective, 3D render' },
    ];

    const aspectRatios = [
        { id: 'square', name: 'Square (1:1)', width: 512, height: 512 },
        { id: 'portrait', name: 'Portrait (3:4)', width: 512, height: 682 },
        { id: 'landscape', name: 'Landscape (16:9)', width: 1024, height: 576 },
        { id: 'ultrawide', name: 'Ultrawide (21:9)', width: 1024, height: 438 },
        { id: 'mobile', name: 'Mobile (9:16)', width: 576, height: 1024 },
        { id: 'cinematic', name: 'Cinematic (2.35:1)', width: 1024, height: 436 },
    ];

    const promptCategories = [
        { id: 'landscape', name: 'Landscape' },
        { id: 'portrait', name: 'Portrait' },
        { id: 'animal', name: 'Animal' },
        { id: 'fantasy', name: 'Fantasy' },
        { id: 'cars', name: 'Car' },
        { id: 'food', name: 'Food' },
        { id: 'architecture', name: 'Architecture' },
        { id: 'scifi', name: 'Sci-Fi' },
        { id: 'fashion', name: 'Fashion' },
        { id: 'abstract', name: 'Abstract' },
    ];
    const promptAttributesByCategory = {
        landscape: ['mountains', 'beach', 'forest', 'desert', 'waterfall', 'sunset', 'night', 'autumn', 'winter', 'volcano', 'aurora'],
        portrait: ['elderly', 'child', 'warrior', 'scientist', 'cyborg', 'viking', 'royalty', 'punk', 'mystical', 'cyberpunk', 'steampunk'],
        animal: ['lion', 'dragon', 'wolf', 'eagle', 'octopus', 'butterfly', 'dinosaur', 'cat', 'unicorn', 'phoenix', 'kraken'],
        fantasy: ['castle', 'wizard', 'fairy', 'dungeon', 'magic portal', 'enchanted forest', 'sky city', 'underwater kingdom', 'floating islands', 'dragon lair'],
        cars: ['BMW M5', 'Lamborghini', 'Mercedes', 'Porsche', 'Aston Martin', 'Rolls-Royce', 'Pagani', 'Bugatti', 'Ferrari', 'Tesla', 'Cyberpunk vehicle'],
        food: ['cake', 'sushi', 'pizza', 'burger', 'fruit', 'chocolate', 'steak', 'red sauce pasta', 'breakfast', 'gourmet', 'molecular gastronomy'],
        architecture: ['skyscraper', 'futuristic city', 'ancient temple', 'modern villa', 'gothic cathedral', 'brutalist', 'organic architecture', 'floating structure'],
        scifi: ['space station', 'alien planet', 'time machine', 'robot city', 'holographic interface', 'cyberspace', 'nanotech', 'dyson sphere'],
        fashion: ['haute couture', 'streetwear', 'cyber fashion', 'steampunk outfit', 'fantasy armor', 'futuristic dress', 'luxury accessories'],
        abstract: ['geometric patterns', 'fluid dynamics', 'cosmic energy', 'surreal composition', 'fractal design', 'psychedelic', 'minimalist', 'chaos theory'],
    };
    const promptSuggestions = [
        "A futuristic city at night 🌃 with neon lights and flying cars, cyberpunk aesthetic, 8k ultra detailed",
        "A majestic dragon 🐉 flying over snow-capped mountains at sunset, fantasy art style, dramatic lighting",
        "Surreal forest 🌳 with glowing trees and floating islands, dreamlike atmosphere, digital painting",
        "Cyberpunk street scene 🤖 with rain reflections and holograms, neon signs, cinematic composition",
        "Ancient library with floating books 📚 and magical energy, fantasy style, warm lighting",
        "Underwater city with glass domes 🏙️ and marine life, sci-fi concept art, bioluminescent glow",
        "Steampunk airship fleet ⛵ in the clouds, brass and copper details, vintage futuristic style",
        "Alien landscape with strange vegetation 👽 and multiple moons, otherworldly colors, hyper realistic",
        "Post-apocalyptic wasteland with overgrown ruins 🏚️ and lone wanderer, cinematic lighting",
        "Futuristic space station 🛰️ orbiting a gas giant, sci-fi realism, NASA punk aesthetic",
    ];

    // Persist session data to localStorage on changes
    useEffect(() => {
        localStorage.setItem('user_analytics_data', JSON.stringify(analyticsData));
    }, [analyticsData]);

    // Simulating login and logout events
    const handleLogin = () => {
        setAnalyticsData(prev => ({ ...prev, loginCount: (prev.loginCount || 0) + 1 }));
        toast.info("Logged in! Analytics updated.");
    };

    const handleLogout = () => {
        setAnalyticsData(prev => ({ ...prev, logoutCount: (prev.logoutCount || 0) + 1 }));
        toast.info("Logged out! Analytics updated.");
    };

    // Get current aspect ratio dimensions
    const getCurrentAspectRatioDimensions = useCallback(() => {
        const selectedRatio = aspectRatios.find(r => r.id === aspectRatio) || aspectRatios[0];
        return {
            width: selectedRatio.width,
            height: selectedRatio.height,
            ratio: selectedRatio.width / selectedRatio.height
        };
    }, [aspectRatio]);

    // Initialize canvases on mount
    useEffect(() => {
        liveCanvasRef.current = document.createElement('canvas');
        tempCanvasRef.current = document.createElement('canvas');

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const generatePromptFromWizard = useCallback(() => {
        if (promptAttributes.length === 0) {
            toast.warn("Please select at least one attribute.");
            return;
        }
        const styleEnhancers = {
            landscape: "ultra-detailed, 8K, HDR, golden hour lighting, cinematic composition",
            portrait: "studio lighting, 85mm lens, bokeh background, hyper-detailed skin texture",
            animal: "wildlife photography, telephoto lens, shallow depth of field, dynamic action shot",
            fantasy: "concept art style, digital painting, intricate details, unreal engine 5",
            cars: "photorealistic, glossy finish, studio lighting or natural reflections, low angle shot, ultra-detailed, cinematic background, 8K resolution, car magazine style",
            food: "commercial photography, soft diffused lighting, high detail texture, appetizing",
            architecture: "architectural visualization, realistic materials, perfect perspective, golden ratio composition",
            scifi: "sci-fi concept art, futuristic technology, highly detailed, cinematic lighting",
            fashion: "high fashion photography, studio lighting, luxury aesthetic, vogue magazine style",
            abstract: "abstract expressionism, bold colors, dynamic composition, contemporary art"
        };
        const qualityBoosters = ["award-winning", "highest quality", "masterpiece", "ultra-realistic", "4K resolution", "trending on ArtStation", "Unreal Engine 5 render"];
        let basePrompt = '';
        const selectedCategoryDetails = promptCategories.find(c => c.id === promptCategory) || promptCategories[0];
        const attributesString = promptAttributes.join(', ');
        const currentEnhancer = styleEnhancers[promptCategory] || styleEnhancers.landscape;
        const currentBooster = qualityBoosters[Math.floor(Math.random() * qualityBoosters.length)];
        basePrompt = `A breathtaking ${attributesString} ${selectedCategoryDetails.name.toLowerCase()}, ${currentEnhancer}, ${currentBooster}`;
        const artisticStyles = ["in the style of Studio Ghibli", "Pixar animation style", "photorealistic CGI", "oil painting technique", "digital matte painting", "concept art"];
        const randomStyle = artisticStyles[Math.floor(Math.random() * artisticStyles.length)];
        setPrompt(`${basePrompt}, ${randomStyle}`);
        setShowPromptWizard(false);
        toast.success("Prompt generated and applied!");
    }, [promptAttributes, promptCategory, promptCategories]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!prompt.trim()) {
            toast.error("Prompt cannot be empty.");
            return;
        }
        if (credit <= 0) {
            toast.error("You are out of credits!");
            return;
        }

        let finalPrompt = prompt;
        const selectedPreset = stylePresets.find(p => p.id === stylePreset);
        if (selectedPreset && stylePreset !== 'realistic') {
            finalPrompt = `${selectedPreset.prompt}, ${prompt}`;
        }

        if (showNegativePrompt && negativePrompt.trim()) {
            finalPrompt += ` | negative: ${negativePrompt}`;
        }

        const selectedRatio = aspectRatios.find(r => r.id === aspectRatio);
        const options = {
            seed: seedValue || undefined,
            cfg_scale: cfgScale,
            steps: steps,
            upscale: upscaleLevel > 1 ? upscaleLevel : undefined,
            image: uploadedImage,
            strength: imageToImageStrength,
            style: stylePreset,
            ratio: aspectRatio
        };

        try {
            await generateImage(finalPrompt, selectedRatio, options);
            trackEvent('generate', { style: stylePreset, ratio: aspectRatio });
            if (uploadedImage) {
                setUploadedImage(null);
                setShowImageToImage(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Image generation failed.");
        }
    }, [prompt, credit, stylePreset, aspectRatio, generateImage, showNegativePrompt, negativePrompt, seedValue, cfgScale, steps, upscaleLevel, uploadedImage, imageToImageStrength, trackEvent, stylePresets, aspectRatios]);

    const handleBatchGenerate = useCallback(async (e) => {
        e.preventDefault();
        if (!prompt.trim()) {
            toast.error("Prompt cannot be empty.");
            return;
        }
        if (credit < batchCount) {
            toast.error("You don't have enough credits for this batch size!");
            return;
        }
        if (batchCount < 1 || batchCount > 5) {
            toast.error("Batch count must be between 1 and 5");
            return;
        }

        setIsBatchGenerating(true);
        setBatchResults([]);
        batchProgressRef.current = 0;

        let finalPrompt = prompt;
        const selectedPreset = stylePresets.find(p => p.id === stylePreset);
        if (selectedPreset && stylePreset !== 'realistic') {
            finalPrompt = `${selectedPreset.prompt}, ${prompt}`;
        }

        if (showNegativePrompt && negativePrompt.trim()) {
            finalPrompt += ` | negative: ${negativePrompt}`;
        }

        const selectedRatio = aspectRatios.find(r => r.id === aspectRatio);
        const options = {
            seed: seedValue || undefined,
            cfg_scale: cfgScale,
            steps: steps,
            upscale: upscaleLevel > 1 ? upscaleLevel : undefined,
            style: stylePreset,
            ratio: aspectRatio
        };

        try {
            const results = [];
            for (let i = 0; i < batchCount; i++) {
                batchProgressRef.current = ((i + 1) / batchCount) * 100;
                const result = await generateImage(finalPrompt, selectedRatio, options);
                if (result) {
                    results.push(result);
                    setBatchResults([...results]);
                    trackEvent('generate', { style: stylePreset, ratio: aspectRatio });
                }
            }
            toast.success(`Generated ${batchCount} variations successfully!`);
        } catch (error) {
            toast.error("Error during batch generation");
            console.error(error);
        } finally {
            setIsBatchGenerating(false);
        }
    }, [prompt, credit, stylePreset, aspectRatio, generateImage, showNegativePrompt, negativePrompt, seedValue, cfgScale, steps, upscaleLevel, batchCount, trackEvent, stylePresets, aspectRatios]);


    const enterFullscreen = useCallback(() => {
        const imgElement = document.getElementById('generated-image-display');
        if (imgElement && imgElement.requestFullscreen) {
            imgElement.requestFullscreen();
        } else if (imageRef.current && imageRef.current.requestFullscreen) {
            imageRef.current.requestFullscreen();
        }
    }, []);

    const printImage = useCallback(async () => {
        const imageToPrint = activeTab === 'edit' && imageRef.current ? imageRef.current.src : generatedImage;
        if (!imageToPrint || imageToPrint.startsWith('data:image/gif')) {
            toast.error("No image to print.");
            return;
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<html><head><title>Print Image</title></head><body style="display:flex;justify-content:center;align-items:center;margin:0;height:100vh;"><img src="${imageToPrint}" style="max-width:100%;max-height:100vh;object-fit:contain;" /></body></html>`);
        printWindow.document.close();
        setTimeout(() => { printWindow.print(); }, 500);
    }, [activeTab, generatedImage]);

    const openLightbox = useCallback((imageSrc) => {
        setSelectedImage(imageSrc);
        setLightboxOpen(true);
    }, []);

    const exportHistory = useCallback(() => {
        if (!generationHistory || generationHistory.length === 0) {
            toast.warn("No history to export.");
            return;
        }

        const dataStr = JSON.stringify(generationHistory, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `generation-history-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("History exported!");
    }, [generationHistory]);

    const formatDate = useCallback((dateString) => {
        if (!dateString) {
            return 'Unknown date';
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }
        return date.toLocaleString();
    }, []);

    const applyAllAdjustmentsToContext = useCallback((ctx, canvasWidth, canvasHeight, adjustments) => {
        const bcstFilter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`;

        if (bcstFilter !== 'brightness(100%) contrast(100%) saturate(100%)') {
            const tempCtx = tempCanvasRef.current.getContext('2d');
            tempCanvasRef.current.width = canvasWidth;
            tempCanvasRef.current.height = canvasHeight;

            tempCtx.filter = bcstFilter;
            tempCtx.drawImage(ctx.canvas, 0, 0);
            tempCtx.filter = 'none';
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(tempCanvasRef.current, 0, 0);
        }
        const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        const data = imageData.data;
        if (adjustments.temperature !== 0) {
            const tempShift = adjustments.temperature;
            for (let i = 0; i < data.length; i += 4) {
                if (tempShift > 0) {
                    data[i] = Math.min(255, data[i] + tempShift * 0.30);
                    data[i + 1] = Math.min(255, data[i + 1] + tempShift * 0.15);
                } else {
                    data[i + 2] = Math.min(255, data[i + 2] - tempShift * 0.30);
                }
            }
        }
        if (adjustments.highlights !== 0 || adjustments.shadows !== 0) {
            const hFactor = adjustments.highlights / 100;
            const sFactor = adjustments.shadows / 100;

            for (let i = 0; i < data.length; i += 4) {
                let r = data[i], g = data[i + 1], b = data[i + 2];
                const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

                if (hFactor !== 0) {
                    const highlightBoost = hFactor * (luminance / 255) * 100;
                    r += highlightBoost; g += highlightBoost; b += highlightBoost;
                }
                if (sFactor !== 0) {
                    const shadowBoost = sFactor * (1 - luminance / 255) * 100;
                    r += shadowBoost; g += shadowBoost; b += shadowBoost;
                }

                data[i] = Math.max(0, Math.min(255, r));
                data[i + 1] = Math.max(0, Math.min(255, g));
                data[i + 2] = Math.max(0, Math.min(255, b));
            }
        }

        ctx.putImageData(imageData, 0, 0);
        if (adjustments.clarity !== 0) {
            const clarityAmount = adjustments.clarity / 100;
            const tempCtx = tempCanvasRef.current.getContext('2d');
            tempCanvasRef.current.width = canvasWidth;
            tempCanvasRef.current.height = canvasHeight;

            if (clarityAmount > 0) {
                tempCtx.filter = `contrast(${1 + clarityAmount * 0.25}) brightness(${1 + clarityAmount * 0.01})`;
            } else {
                tempCtx.filter = `blur(${Math.abs(clarityAmount) * 0.75}px)`;
            }

            tempCtx.drawImage(ctx.canvas, 0, 0);
            tempCtx.filter = 'none';
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(tempCanvasRef.current, 0, 0);
        }

        if (adjustments.vignette > 0) {
            const vigAmount = adjustments.vignette / 100;
            const centerX = canvasWidth / 2;
            const centerY = canvasHeight / 2;
            const outerRadius = Math.sqrt(centerX * centerX + centerY * centerY);
            const innerRadiusRatio = 1 - vigAmount * 0.85;
            const innerRadius = outerRadius * Math.max(0.05, innerRadiusRatio);

            const radialGradient = ctx.createRadialGradient(
                centerX, centerY, innerRadius,
                centerX, centerY, outerRadius
            );
            radialGradient.addColorStop(0, 'rgba(0,0,0,0)');
            radialGradient.addColorStop(0.5, `rgba(0,0,0,${vigAmount * 0.35})`);
            radialGradient.addColorStop(1, `rgba(0,0,0,${vigAmount * 0.75})`);

            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = radialGradient;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.globalCompositeOperation = 'source-over';
        }
    }, []);

    const applyLiveAdjustmentsToPreview = useCallback(() => {
        if (!imageRef.current || !baseEditImageSrcRef.current || baseEditImageSrcRef.current.startsWith('data:image/gif')) {
            if (imageRef.current) {
                imageRef.current.src = baseEditImageSrcRef.current || generatedImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                imageRef.current.style.filter = '';
                imageRef.current.style.transform = '';
                imageRef.current.style.boxShadow = '';
            }
            return;
        }

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(() => {
            const baseImage = new Image();
            baseImage.crossOrigin = "Anonymous";

            baseImage.onload = () => {
                const liveCanvas = liveCanvasRef.current;
                const liveCtx = liveCanvas.getContext('2d');
                liveCanvas.width = baseImage.naturalWidth;
                liveCanvas.height = baseImage.naturalHeight;

                liveCtx.save();
                if (adjustmentsStateRef.current.flipHorizontal || adjustmentsStateRef.current.flipVertical) {
                    liveCtx.translate(liveCanvas.width / 2, liveCanvas.height / 2);
                    liveCtx.scale(
                        adjustmentsStateRef.current.flipHorizontal ? -1 : 1,
                        adjustmentsStateRef.current.flipVertical ? -1 : 1
                    );
                    liveCtx.translate(-liveCanvas.width / 2, -liveCanvas.height / 2);
                }
                liveCtx.drawImage(baseImage, 0, 0);
                liveCtx.restore();
                applyAllAdjustmentsToContext(liveCtx, liveCanvas.width, liveCanvas.height, adjustmentsStateRef.current);

                if (imageRef.current) {
                    imageRef.current.src = liveCanvas.toDataURL('image/png');
                    imageRef.current.style.filter = '';
                    imageRef.current.style.transform = '';
                    imageRef.current.style.boxShadow = '';
                }
            };

            baseImage.onerror = () => {
                console.error("Failed to load base image for live preview adjustments.");
                if (imageRef.current) {
                    imageRef.current.src = baseEditImageSrcRef.current || generatedImage || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                }
            };

            baseImage.src = baseEditImageSrcRef.current;
        });
    }, [applyAllAdjustmentsToContext, generatedImage]);

    // Optimized slider change handler to reduce lag
    const handleSliderChange = useCallback((setter, value, property) => {
        setter(value);
        adjustmentsStateRef.current[property] = value;
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            applyLiveAdjustmentsToPreview();
        }, 150);
    }, [applyLiveAdjustmentsToPreview]);

    const resetAllAdjustments = useCallback((triggerPreviewUpdate = true) => {
        setBrightness(100); setContrast(100); setSaturation(100); setTemperature(0); setHighlights(0); setShadows(0); setClarity(0); setVignette(0); setFlipHorizontal(false); setFlipVertical(false);
        adjustmentsStateRef.current = {
            brightness: 100, contrast: 100, saturation: 100, temperature: 0, highlights: 0, shadows: 0, clarity: 0, vignette: 0, flipHorizontal: false, flipVertical: false
        };
        toast.info("Manual adjustments reset.");
        if (triggerPreviewUpdate) {
            applyLiveAdjustmentsToPreview();
        }
    }, [applyLiveAdjustmentsToPreview]);

    const resetAIToolsAndAdjustments = useCallback(() => {
        if (generatedImage) {
            baseEditImageSrcRef.current = generatedImage;
            trackEvent('editImage', { action: 'reset' });
        } else {
            baseEditImageSrcRef.current = null;
            if (imageRef.current) {
                imageRef.current.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            }
        }
        resetAllAdjustments(true);
        toast.info("AI tools and all adjustments have been reset to the original generated image.");
    }, [generatedImage, resetAllAdjustments, trackEvent]);

    const applyAITool = useCallback(async (toolName, processFunction) => {
        const currentSrcForAI = baseEditImageSrcRef.current;
        if (!currentSrcForAI || currentSrcForAI.startsWith('data:image/gif')) {
            toast.error("Base image not available. Please generate an image first.");
            return;
        }
        setIsProcessing(true);
        try {
            const baseImage = new Image();
            baseImage.crossOrigin = "Anonymous";
            await new Promise((resolve, reject) => {
                baseImage.onload = resolve;
                baseImage.onerror = reject;
                baseImage.src = currentSrcForAI;
            });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            processFunction(baseImage, canvas, ctx);
            const newSrc = canvas.toDataURL('image/png');
            baseEditImageSrcRef.current = newSrc;
            resetAllAdjustments(true);
            trackEvent('editImage', { tool: toolName });
            toast.success(`${toolName} applied! Manual adjustments reset.`);
        } catch (error) {
            console.error(`Error applying ${toolName}:`, error);
            toast.error(`Failed to apply ${toolName}.`);
        } finally {
            setIsProcessing(false);
        }
    }, [resetAllAdjustments, trackEvent]);

    const applyAISuperResolution = useCallback(() => applyAITool("AI Super Resolution", (img, canvas, ctx) => {
        const scaleFactor = 2;
        canvas.width = img.naturalWidth * scaleFactor;
        canvas.height = img.naturalHeight * scaleFactor;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let y = 1; y < canvas.height - 1; y++) {
            for (let x = 1; x < canvas.width - 1; x++) {
                const i = (y * canvas.width + x) * 4;
                const neighbors = [
                    (y - 1) * canvas.width * 4 + x * 4,
                    (y + 1) * canvas.width * 4 + x * 4,
                    y * canvas.width * 4 + (x - 1) * 4,
                    y * canvas.width * 4 + (x + 1) * 4
                ];
                let edgeStrength = 0;
                neighbors.forEach(ni => {
                    edgeStrength += Math.abs(data[i] - data[ni]) +
                        Math.abs(data[i + 1] - data[ni + 1]) +
                        Math.abs(data[i + 2] - data[ni + 2]);
                });
                if (edgeStrength > 50) {
                    const sharpness = Math.min(1, edgeStrength / 300);
                    data[i] = Math.min(255, data[i] * (1 + 0.3 * sharpness));
                    data[i + 1] = Math.min(255, data[i + 1] * (1 + 0.3 * sharpness));
                    data[i + 2] = Math.min(255, data[i + 2] * (1 + 0.3 * sharpness));
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }), [applyAITool]);

    const applyAICartoonify = useCallback(() => applyAITool("AI Cartoonify", (img, canvas, ctx) => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.filter = 'grayscale(100%) brightness(1.1) contrast(1.5)';
        ctx.drawImage(img, 0, 0);
        const edgeData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const quantLevels = 8;
            data[i] = Math.round(data[i] / (255 / quantLevels)) * (255 / quantLevels);
            data[i + 1] = Math.round(data[i + 1] / (255 / quantLevels)) * (255 / quantLevels);
            data[i + 2] = Math.round(data[i + 2] / (255 / quantLevels)) * (255 / quantLevels);
        }
        for (let i = 0; i < data.length; i += 4) {
            if (edgeData.data[i] < 100) {
                data[i] *= 0.6;
                data[i + 1] *= 0.6;
                data[i + 2] *= 0.6;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        ctx.filter = 'saturate(1.5) contrast(1.1)';
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';
    }), [applyAITool]);

    const applyAIColorize = useCallback(() => applyAITool("AI Colorize", (img, canvas, ctx) => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.filter = 'grayscale(100%)';
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const luminance = data[i];
            if (luminance < 60) {
                data[i] = luminance * 0.7;
                data[i + 1] = luminance * 0.5;
                data[i + 2] = luminance * 1.2;
            }
            else if (luminance < 160) {
                data[i] = luminance * 1.3;
                data[i + 1] = luminance * 0.9;
                data[i + 2] = luminance * 0.7;
            }
            else {
                data[i] = luminance * 1.1;
                data[i + 1] = luminance * 0.95;
                data[i + 2] = luminance * 0.8;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        ctx.filter = 'sepia(0.2) saturate(1.3) contrast(1.1) hue-rotate(-5deg)';
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';
    }), [applyAITool]);

    const applyAISketch = useCallback(() => applyAITool("AI Sketch (Sim)", (img, canvas, ctx) => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.filter = 'grayscale(1) contrast(200%) brightness(1.1)';
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';
    }), [applyAITool]);

    const handleImageUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.match('image.*')) {
            toast.error("Please select an image file");
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            setUploadedImage(event.target.result);
            setShowImageToImage(true);
        };
        reader.readAsDataURL(file);
    }, []);

    const downloadEditedImage = useCallback(() => {
        const sourceForDownload = baseEditImageSrcRef.current;
        if (!sourceForDownload || sourceForDownload.startsWith('data:image/gif')) {
            toast.error('No valid image available to download');
            return;
        }

        const imgToDownload = new Image();
        imgToDownload.crossOrigin = "Anonymous";

        imgToDownload.onload = () => {
            const workingCanvas = document.createElement('canvas');
            const workingCtx = workingCanvas.getContext('2d');
            workingCanvas.width = imgToDownload.naturalWidth;
            workingCanvas.height = imgToDownload.naturalHeight;

            workingCtx.save();
            if (flipHorizontal || flipVertical) {
                workingCtx.translate(workingCanvas.width / 2, workingCanvas.height / 2);
                workingCtx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
                workingCtx.translate(-workingCanvas.width / 2, -workingCanvas.height / 2);
            }
            workingCtx.drawImage(imgToDownload, 0, 0);
            workingCtx.restore();

            const currentAdjustments = { brightness, contrast, saturation, temperature, highlights, shadows, clarity, vignette };
            applyAllAdjustmentsToContext(workingCtx, workingCanvas.width, workingCanvas.height, currentAdjustments);

            const link = document.createElement('a');
            link.download = `ai-edited-${Date.now()}.png`;
            link.href = workingCanvas.toDataURL('image/png', 1.0);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            trackEvent('downloadImage');
            toast.success('Edited image downloaded successfully!');
        };

        imgToDownload.onerror = () => {
            toast.error("Failed to load image for download.");
        };

        imgToDownload.src = sourceForDownload;
    }, [applyAllAdjustmentsToContext, brightness, contrast, saturation, temperature, highlights, shadows, clarity, vignette, flipHorizontal, flipVertical, trackEvent]);

    const enhancePrompt = useCallback(() => {
        if (!prompt.trim()) {
            toast.error("Please enter a prompt first");
            return;
        }

        const enhancements = [
            "ultra-detailed, 8K, HDR, cinematic lighting",
            "trending on ArtStation, Unreal Engine 5 render",
            "award-winning, masterpiece, highest quality",
            "hyper-realistic, photorealistic, intricate details",
            "concept art, digital painting, matte painting"
        ];

        const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
        const enhanced = `${prompt}, ${randomEnhancement}`;
        setEnhancedPrompt(enhanced);
        setShowPromptEnhancer(true);
    }, [prompt]);

    const applyEnhancedPrompt = useCallback(() => {
        setPrompt(enhancedPrompt);
        setShowPromptEnhancer(false);
        trackEvent('savePrompt');
        toast.success("Enhanced prompt applied!");
    }, [enhancedPrompt, trackEvent]);

    const savePrompt = useCallback(() => {
        if (!prompt.trim()) {
            toast.error("No prompt to save");
            return;
        }
        setSavedPrompts(prev => [...prev, {
            id: Date.now(),
            text: prompt,
            date: new Date().toISOString()
        }]);
        trackEvent('savePrompt');
        toast.success("Prompt saved to history!");
    }, [prompt, trackEvent]);

    const loadPrompt = useCallback((savedPrompt) => {
        setPrompt(savedPrompt.text);
        setShowPromptHistory(false);
        toast.success("Prompt loaded!");
    }, []);

    useEffect(() => {
        if (activeTab === 'edit') {
            applyLiveAdjustmentsToPreview();
        }
    }, [activeTab, applyLiveAdjustmentsToPreview]);

    useEffect(() => {
        if (activeTab === 'edit') {
            if (generatedImage && (!baseEditImageSrcRef.current || baseEditImageSrcRef.current !== generatedImage)) {
                baseEditImageSrcRef.current = generatedImage;
                resetAllAdjustments(true);
            } else if (!generatedImage && !baseEditImageSrcRef.current && imageRef.current) {
                imageRef.current.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                baseEditImageSrcRef.current = null;
                resetAllAdjustments(true);
            }
        }
    }, [activeTab, generatedImage, resetAllAdjustments]);

    const getFilteredAndSortedHistory = useCallback(() => {
        let items = [...generationHistory];
        if (historySearchTerm) {
            items = items.filter(item => item.prompt.toLowerCase().includes(historySearchTerm.toLowerCase()));
        }
        if (historyFilterStyle !== 'all') {
            items = items.filter(item => (item.style || 'realistic') === historyFilterStyle);
        }
        items.sort((a, b) => {
            switch (historySortOrder) {
                case 'date_asc':
                    const dateA_asc = new Date(a.date);
                    const dateB_asc = new Date(b.date);
                    return isNaN(dateA_asc.getTime()) || isNaN(dateB_asc.getTime()) ? 0 : dateA_asc - dateB_asc;
                case 'prompt_asc': return a.prompt.localeCompare(b.prompt);
                case 'prompt_desc': return b.prompt.localeCompare(a.prompt);
                case 'date_desc':
                default:
                    const dateA_desc = new Date(a.date);
                    const dateB_desc = new Date(b.date);
                    return isNaN(dateA_desc.getTime()) || isNaN(dateB_desc.getTime()) ? 0 : dateB_desc - dateA_desc;
            }
        });
        return items;
    }, [generationHistory, historySearchTerm, historyFilterStyle, historySortOrder]);

    const allStylePresetsForFilter = useMemo(() => ['all', ...stylePresets.map(p => p.id)], [stylePresets]);

    useEffect(() => { adjustmentsStateRef.current.brightness = brightness; }, [brightness]);
    useEffect(() => { adjustmentsStateRef.current.contrast = contrast; }, [contrast]);
    useEffect(() => { adjustmentsStateRef.current.saturation = saturation; }, [saturation]);
    useEffect(() => { adjustmentsStateRef.current.temperature = temperature; }, [temperature]);
    useEffect(() => { adjustmentsStateRef.current.highlights = highlights; }, [highlights]);
    useEffect(() => { adjustmentsStateRef.current.shadows = shadows; }, [shadows]);
    useEffect(() => { adjustmentsStateRef.current.clarity = clarity; }, [clarity]);
    useEffect(() => { adjustmentsStateRef.current.vignette = vignette; }, [vignette]);
    useEffect(() => { adjustmentsStateRef.current.flipHorizontal = flipHorizontal; }, [flipHorizontal]);
    useEffect(() => { adjustmentsStateRef.current.flipVertical = flipVertical; }, [flipVertical]);

    const getAspectRatioClass = useCallback(() => {
        switch (aspectRatio) {
            case 'portrait': return 'aspect-[3/4]';
            case 'landscape': return 'aspect-[16/9]';
            case 'ultrawide': return 'aspect-[21/9]';
            case 'mobile': return 'aspect-[9/16]';
            case 'cinematic': return 'aspect-[2.35/1]';
            case 'square':
            default: return 'aspect-square';
        }
    }, [aspectRatio]);

    const pieChartStyleData = {
        labels: Object.keys(analyticsData.generationsByStyle),
        datasets: [{
            data: Object.values(analyticsData.generationsByStyle),
            backgroundColor: [
                '#8b5cf6', '#a855f7', '#d946ef', '#f472b6', '#f9a8d4',
                '#be185d', '#e879f9', '#a21caf', '#db2777', '#f87171',
            ],
            hoverBackgroundColor: [
                '#7c3aed', '#9333ea', '#c026d3', '#ec4899', '#f472b6',
                '#be185d', '#c57efb', '#93159a', '#c7236b', '#ea5d5d',
            ],
            borderWidth: 1,
        }],
    };

    const barChartRatioData = {
        labels: Object.keys(analyticsData.generationsByRatio),
        datasets: [{
            label: 'Generations by Aspect Ratio',
            data: Object.values(analyticsData.generationsByRatio),
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 1,
            borderRadius: 4,
            hoverBackgroundColor: 'rgba(99, 102, 241, 1)',
        }],
    };

    const generalActionsData = {
        labels: ['Generations', 'Prompts Saved', 'Edits', 'Downloads'],
        datasets: [{
            label: 'User Actions',
            data: [
                analyticsData.generationCount || 0,
                analyticsData.promptsSaved || 0,
                analyticsData.imagesEdited || 0,
                analyticsData.downloads || 0
            ],
            backgroundColor: ['rgba(139, 92, 246, 0.8)', 'rgba(99, 102, 241, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(34, 197, 94, 0.8)'],
            borderColor: ['rgba(139, 92, 246, 1)', 'rgba(99, 102, 241, 1)', 'rgba(236, 72, 153, 1)', 'rgba(34, 197, 94, 1)'],
            borderWidth: 1,
            borderRadius: 4,
        }],
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-indigo-200/30"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: Math.random() * window.innerHeight,
                                width: Math.random() * 60 + 20,
                                height: Math.random() * 60 + 20,
                                opacity: Math.random() * 0.15 + 0.05,
                            }}
                            animate={{
                                y: [null, Math.random() * 80 - 40 + (window.innerHeight / 2)],
                                x: [null, Math.random() * 80 - 40 + (window.innerWidth / 2)],
                                scale: [1, 1.15, 1],
                            }}
                            transition={{
                                duration: Math.random() * 18 + 12,
                                repeat: Infinity,
                                repeatType: 'mirror',
                                ease: 'easeInOut'
                            }}
                        />
                    ))}
                </div>
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">AI Image Studio 🎨</h1>
                <p className="text-center text-gray-600 mb-8">
                    Unleash your creativity with advanced AI image generation and editing tools.
                </p>

                <div className="flex justify-center space-x-1 mb-8">
                    <motion.button
                        onClick={() => setActiveTab('generate')}
                        className={`py-2 px-6 rounded-2xl text-sm font-medium transition-colors ${activeTab === 'generate' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Generate
                    </motion.button>
                    <motion.button
                        onClick={() => setActiveTab('edit')}
                        className={`py-2 px-6 rounded-2xl text-sm font-medium transition-colors ${activeTab === 'edit' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Edit
                    </motion.button>
                    <motion.button
                        onClick={() => setActiveTab('history')}
                        className={`py-2 px-6 rounded-2xl text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        History
                    </motion.button>
                    <motion.button
                        onClick={() => setActiveTab('analytics')}
                        className={`py-2 px-6 rounded-2xl text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Analytics
                    </motion.button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'generate' && (
                        <motion.div key="generate-tab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <motion.form
                                    onSubmit={handleSubmit}
                                    className="bg-white/80 p-6 rounded-3xl shadow-lg border border-gray-200/70 space-y-6 backdrop-blur-sm"
                                    initial={{ scale: 0.98, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                                                Prompt <span className="text-gray-500">(be specific!)</span>
                                            </label>
                                            <div className="flex space-x-2">
                                                <motion.button
                                                    type="button"
                                                    onClick={enhancePrompt}
                                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                                    className="p-1.5 rounded-full bg-indigo-100 text-indigo-700"
                                                    title="Enhance Prompt"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                </motion.button>
                                                <motion.button
                                                    type="button"
                                                    onClick={() => setShowPromptWizard(true)}
                                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                                    className="p-1.5 rounded-full bg-yellow-100 text-yellow-700"
                                                    title="Prompt Wizard"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-5a1 1 0 10-2 0v5H5V7h5a1 1 0 000-2H5z" /></svg>
                                                </motion.button>
                                                <motion.button
                                                    type="button"
                                                    onClick={handleVoiceInput}
                                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                                    className={`p-1.5 rounded-full ${isListening ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
                                                    title="Voice Input"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>
                                                </motion.button>
                                            </div>
                                        </div>
                                        <textarea
                                            id="prompt"
                                            rows={3}
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-400"
                                            placeholder="A castle on a floating island, digital art, cinematic lighting..."
                                            disabled={isGenerating}
                                        />
                                        {showNegativePrompt && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="mt-4"
                                            >
                                                <label htmlFor="negativePrompt" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Negative Prompt (what to exclude)
                                                </label>
                                                <input
                                                    id="negativePrompt"
                                                    type="text"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-400"
                                                    value={negativePrompt}
                                                    onChange={(e) => setNegativePrompt(e.target.value)}
                                                    placeholder="e.g., blurry, low quality, distorted..."
                                                    disabled={isGenerating}
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Art Style 🎨</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {stylePresets.map((preset) => (
                                                    <motion.button
                                                        type="button"
                                                        key={preset.id}
                                                        whileHover={{ y: -3, boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-150 text-left w-full ${stylePreset === preset.id ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-400' : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm bg-white/80'}`}
                                                        onClick={() => setStylePreset(preset.id)}
                                                    >
                                                        <div className="flex items-center">
                                                            <div className={`w-3.5 h-3.5 rounded-full mr-2.5 border-2 ${stylePreset === preset.id ? 'bg-indigo-500 border-indigo-300' : 'bg-gray-300 border-gray-200'}`}></div>
                                                            <span className={`text-sm font-medium ${stylePreset === preset.id ? 'text-indigo-700' : 'text-gray-700'}`}>{preset.name}</span>
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Aspect Ratio 📐</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {aspectRatios.map((ratio) => (
                                                    <motion.button
                                                        type="button"
                                                        key={ratio.id}
                                                        whileHover={{ y: -3, boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-150 ${aspectRatio === ratio.id ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-400' : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm bg-white/80'}`}
                                                        onClick={() => setAspectRatio(ratio.id)}
                                                    >
                                                        <div className="flex items-center justify-center">
                                                            <span className={`text-sm font-medium ${aspectRatio === ratio.id ? 'text-indigo-700' : 'text-gray-700'}`}>{ratio.name}</span>
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                                            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-3"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 transition-transform ${showAdvancedOptions ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            Advanced Options
                                        </button>
                                        <AnimatePresence>
                                            {showAdvancedOptions && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="bg-gray-50/70 rounded-lg p-4 mb-4 space-y-4 border border-gray-200"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label htmlFor="seed" className="block text-xs font-medium text-gray-700 mb-1">Seed (optional)</label>
                                                            <input
                                                                id="seed"
                                                                type="text"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                                value={seedValue}
                                                                onChange={(e) => setSeedValue(e.target.value)}
                                                                placeholder="Random if empty"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="cfgScale" className="block text-xs font-medium text-gray-700 mb-1">Creativity (CFG Scale: 1-15)</label>
                                                            <input
                                                                id="cfgScale"
                                                                type="range"
                                                                min="1"
                                                                max="15"
                                                                step="0.5"
                                                                className="w-full"
                                                                value={cfgScale}
                                                                onChange={(e) => setCfgScale(parseFloat(e.target.value))}
                                                            />
                                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                                <span>Precise</span>
                                                                <span>{cfgScale}</span>
                                                                <span>Creative</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="steps" className="block text-xs font-medium text-gray-700 mb-1">Quality (Steps: 10-50)</label>
                                                            <input
                                                                id="steps"
                                                                type="range"
                                                                min="10"
                                                                max="50"
                                                                className="w-full"
                                                                value={steps}
                                                                onChange={(e) => setSteps(parseInt(e.target.value))}
                                                            />
                                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                                <span>Fast</span>
                                                                <span>{steps}</span>
                                                                <span>Detailed</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="upscale" className="block text-xs font-medium text-gray-700 mb-1">Upscale (1x-2x)</label>
                                                            <input
                                                                id="upscale"
                                                                type="range"
                                                                min="1"
                                                                max="2"
                                                                step="0.25"
                                                                className="w-full"
                                                                value={upscaleLevel}
                                                                onChange={(e) => setUpscaleLevel(parseFloat(e.target.value))}
                                                            />
                                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                                <span>1x</span>
                                                                <span>{upscaleLevel}x</span>
                                                                <span>2x</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-3 pt-2">
                                                        <motion.button
                                                            type="button"
                                                            onClick={() => setShowNegativePrompt(!showNegativePrompt)}
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.97 }}
                                                            className={`text-xs px-3 py-1.5 rounded-md ${showNegativePrompt ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
                                                        >
                                                            {showNegativePrompt ? 'Remove Negative Prompt' : 'Add Negative Prompt'}
                                                        </motion.button>
                                                        <motion.button
                                                            type="button"
                                                            onClick={() => setShowBatchGenerate(!showBatchGenerate)}
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.97 }}
                                                            className={`text-xs px-3 py-1.5 rounded-md ${showBatchGenerate ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
                                                        >
                                                            {showBatchGenerate ? 'Single Image' : 'Batch Generate'}
                                                        </motion.button>
                                                        <motion.button
                                                            type="button"
                                                            onClick={() => fileInputRef.current?.click()}
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.97 }}
                                                            className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md"
                                                        >
                                                            Image-to-Image
                                                        </motion.button>
                                                        <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            className="hidden"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <AnimatePresence>
                                            {showBatchGenerate && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="bg-indigo-50/70 rounded-lg p-4 mb-4 border border-indigo-200"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <label className="block text-sm font-medium text-indigo-700">Batch Generate ({batchCount} images)</label>
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => setBatchCount(Math.max(1, batchCount - 1))}
                                                                disabled={batchCount <= 1}
                                                                className="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full disabled:opacity-50"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="text-sm font-medium">{batchCount}</span>
                                                            <button
                                                                onClick={() => setBatchCount(Math.min(5, batchCount + 1))}
                                                                disabled={batchCount >= 5}
                                                                className="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full disabled:opacity-50"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-indigo-600 mb-3">
                                                        Note: This will use {batchCount} credit{batchCount > 1 ? 's' : ''}
                                                    </div>
                                                    <motion.button
                                                        type="button"
                                                        onClick={handleBatchGenerate}
                                                        disabled={isBatchGenerating || !prompt.trim() || credit < batchCount}
                                                        whileHover={!(isBatchGenerating || !prompt.trim() || credit < batchCount) ? { scale: 1.02, boxShadow: "0px 5px 15px rgba(96, 165, 250, 0.4)" } : {}}
                                                        whileTap={!(isBatchGenerating || !prompt.trim() || credit < batchCount) ? { scale: 0.98 } : {}}
                                                        className={`w-full py-2.5 px-6 rounded-lg font-medium transition-all duration-300 relative overflow-hidden text-sm ${isBatchGenerating || !prompt.trim() || credit < batchCount ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50'}`}
                                                    >
                                                        {isBatchGenerating ? (
                                                            <span className="flex items-center justify-center space-x-2">
                                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                                <span>Generating {Math.round(batchProgressRef.current)}%</span>
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center justify-center space-x-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                                <span>Generate {batchCount} Variations</span>
                                                            </span>
                                                        )}
                                                    </motion.button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <motion.button
                                        type="submit"
                                        disabled={isGenerating || isBatchGenerating || !prompt.trim() || credit <= 0 || showBatchGenerate}
                                        whileHover={!(isGenerating || isBatchGenerating || !prompt.trim() || credit <= 0 || showBatchGenerate) ? { scale: 1.02, boxShadow: "0px 5px 15px rgba(96, 165, 250, 0.4)" } : {}}
                                        whileTap={!(isGenerating || isBatchGenerating || !prompt.trim() || credit <= 0 || showBatchGenerate) ? { scale: 0.98 } : {}}
                                        className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden text-base ${isGenerating || isBatchGenerating || !prompt.trim() || credit <= 0 || showBatchGenerate ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50'}`}
                                    >
                                        {isGenerating ? (
                                            <span className="flex items-center justify-center space-x-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                <span>Creating...</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center space-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                <span>Generate Image ({credit > 0 ? '1 Credit' : 'No Credits'})</span>
                                            </span>
                                        )}
                                    </motion.button>
                                    {credit <= 0 && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-center text-sm text-red-600 bg-red-100/70 py-2.5 px-4 rounded-lg border border-red-200">
                                            You're out of credits!
                                        </motion.div>
                                    )}
                                </motion.form>
                                <div className="mt-8">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-medium text-gray-700">Inspiration:</h3>
                                        <button
                                            type="button"
                                            onClick={() => setPrompt(promptSuggestions[Math.floor(Math.random() * promptSuggestions.length)])}
                                            className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1.5 rounded-lg hover:bg-indigo-200 transition-colors shadow-sm"
                                        >
                                            Random Prompt
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {promptSuggestions.slice(0, 4).map((suggestion, idx) => (
                                            <motion.div
                                                key={idx}
                                                whileHover={{ y: -2, borderColor: 'rgb(129 140 248)' }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setPrompt(suggestion)}
                                                className="text-sm bg-white/80 border border-gray-200 p-3 rounded-lg cursor-pointer hover:shadow-sm transition-all h-full flex items-center"
                                            >
                                                {suggestion}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-1">
                                <div className="sticky top-6 space-y-4">
                                    <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/70 shadow-inner">
                                        <h3 className="text-base font-semibold text-gray-700 mb-3 text-center">Preview</h3>
                                        <div className={`${getAspectRatioClass()} bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex items-center justify-center shadow-md relative`}>
                                            {generatedImage ? (
                                                <motion.img
                                                    id="generated-image-display"
                                                    key={generatedImage}
                                                    src={generatedImage}
                                                    alt={generationPrompt || "Generated image"}
                                                    className="w-full h-full object-contain"
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            ) : (
                                                <div className="text-center p-6 text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    <p className="text-sm">Your image will appear here</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {generatedImage && (
                                        <div className="flex items-center justify-around mt-3 space-x-2">
                                            {[
                                                { label: 'Download', action: () => { const link = document.createElement('a'); link.href = generatedImage; link.download = `ai-image-${Date.now()}.png`; link.click(); trackEvent('downloadImage'); }, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> },
                                                { label: 'Fullscreen', action: enterFullscreen, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg> },
                                                { label: 'Print', action: printImage, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg> },
                                            ].map(btn => (
                                                <motion.button
                                                    key={btn.label}
                                                    whileHover={{ scale: 1.05, backgroundColor: 'rgb(99 102 241)' }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={btn.action}
                                                    className="flex items-center justify-center space-x-1.5 bg-indigo-600 text-white py-2 px-3 rounded-lg text-xs hover:bg-indigo-700 transition-colors shadow-sm flex-1"
                                                    title={btn.label}
                                                >
                                                    {btn.icon}
                                                    <span>{btn.label}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'edit' && (
                        <motion.div key="edit-tab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                            {(baseEditImageSrcRef.current || generatedImage) ? (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2">
                                        <div className="bg-white/80 rounded-xl p-4 border border-gray-200/70 shadow-md">
                                            <h3 className="text-base font-semibold text-gray-700 mb-3 text-center">Image Preview</h3>
                                            <div className="aspect-w-16 aspect-h-9 max-h-[70vh] flex items-center justify-center mx-auto bg-gray-100 rounded-lg overflow-hidden relative shadow-inner">
                                                <img
                                                    ref={imageRef}
                                                    id="edited-image-display"
                                                    src={baseEditImageSrcRef.current || generatedImage}
                                                    alt="Generated image for editing"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-1 space-y-5">
                                        <div className="bg-white/80 rounded-xl p-4 border border-gray-200/70 shadow-md">
                                            <h3 className="text-base font-semibold text-gray-700 mb-3">AI Magic Tools ✨</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { name: 'Super Res', action: applyAISuperResolution, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>, color: 'blue' },
                                                    { name: 'Cartoonify', action: applyAICartoonify, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>, color: 'purple' },
                                                    { name: 'Colorize Sim', action: applyAIColorize, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>, color: 'pink' },
                                                    { name: 'Sketch Sim', action: applyAISketch, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>, color: 'green' },
                                                ].map(tool => {
                                                    const toolColors = colorMap[tool.color];
                                                    return (
                                                        <motion.button
                                                            key={tool.name}
                                                            whileHover={{ scale: 1.03, y: -2, boxShadow: "0px 3px 8px rgba(0,0,0,0.1)" }}
                                                            whileTap={{ scale: 0.97 }}
                                                            onClick={tool.action}
                                                            disabled={isProcessing}
                                                            className={`flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br ${toolColors.from} ${toolColors.to} ${toolColors.hoverFrom} ${toolColors.hoverTo} transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        >
                                                            <div className={`w-8 h-8 mb-1.5 flex items-center justify-center ${colorMap[tool.color].bg} rounded-full ${toolColors.text}`}>
                                                                {tool.icon}
                                                            </div>
                                                            <span className="text-xs font-medium text-center text-gray-700">{tool.name}</span>
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                onClick={resetAIToolsAndAdjustments}
                                                className="mt-3 w-full flex items-center justify-center space-x-1.5 bg-red-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-600 transition-colors shadow-sm"
                                                disabled={!baseEditImageSrcRef.current && !generatedImage}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                <span>Reset AI & Adjustments</span>
                                            </motion.button>
                                        </div>
                                        <div className="bg-white/80 rounded-xl p-4 border border-gray-200/70 shadow-md">
                                            <h3 className="text-base font-semibold text-gray-700 mb-3">Advanced Adjustments</h3>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'Brightness', value: brightness, setter: setBrightness, min: 0, max: 200, unit: '%', accent: 'blue', property: 'brightness' },
                                                    { label: 'Contrast', value: contrast, setter: setContrast, min: 0, max: 200, unit: '%', accent: 'purple', property: 'contrast' },
                                                    { label: 'Saturation', value: saturation, setter: setSaturation, min: 0, max: 200, unit: '%', accent: 'pink', property: 'saturation' },
                                                    { label: 'Temperature', value: temperature, setter: setTemperature, min: -100, max: 100, unit: '', accent: 'orange', property: 'temperature' },
                                                    { label: 'Highlights', value: highlights, setter: setHighlights, min: -100, max: 100, unit: '', accent: 'yellow', property: 'highlights' },
                                                    { label: 'Shadows', value: shadows, setter: setShadows, min: -100, max: 100, unit: '', accent: 'gray', property: 'shadows' },
                                                    { label: 'Clarity', value: clarity, setter: setClarity, min: -100, max: 100, unit: '', accent: 'green', property: 'clarity' },
                                                    { label: 'Vignette', value: vignette, setter: setVignette, min: 0, max: 100, unit: '', accent: 'indigo', property: 'vignette' },
                                                ].map((adjustment) => (
                                                    <div key={adjustment.label} className="space-y-1">
                                                        <div className="flex justify-between items-center">
                                                            <label className="text-xs font-medium text-gray-700">{adjustment.label}</label>
                                                            <span className="text-xs text-gray-500">{adjustment.value}{adjustment.unit}</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min={adjustment.min}
                                                            max={adjustment.max}
                                                            value={adjustment.value}
                                                            onChange={(e) => handleSliderChange(adjustment.setter, parseInt(e.target.value), adjustment.property)}
                                                            className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${adjustment.accent}-500`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-between mt-4 space-x-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setFlipHorizontal(!flipHorizontal);
                                                        adjustmentsStateRef.current.flipHorizontal = !flipHorizontal;
                                                        applyLiveAdjustmentsToPreview();
                                                    }}
                                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all relative group overflow-hidden ${flipHorizontal ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                                >
                                                    <motion.span className="flex items-center justify-center space-x-1.5">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 12H3m4 0l4-4m-4 4l4 4M17 4v12m0-12h4m-4 0l-4 4m4-4l-4-4" /></svg>
                                                    </motion.span>
                                                    <span>Flip H</span>
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setFlipVertical(!flipVertical);
                                                        adjustmentsStateRef.current.flipVertical = !flipVertical;
                                                        applyLiveAdjustmentsToPreview();
                                                    }}
                                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all relative group overflow-hidden ${flipVertical ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                                >
                                                    <motion.span className="flex items-center justify-center space-x-1.5">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 12L3 8m4 4l4-4m-4 4h14m0 0l-4-4m4 4l4 4M12 20l-4-4m4 4l4-4" /></svg>
                                                    </motion.span>
                                                    <span>Flip V</span>
                                                </motion.button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => resetAllAdjustments(true)} className="flex items-center justify-center space-x-1.5 bg-gray-600 text-white py-2.5 px-3 rounded-lg text-sm hover:bg-gray-700 transition-colors shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                <span>Reset Adjustments</span>
                                            </motion.button>
                                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={downloadEditedImage} className="flex items-center justify-center space-x-1.5 bg-indigo-600 text-white py-2.5 px-3 rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                <span>Download</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-700">No image generated yet</h3>
                                    <p className="mt-1.5 text-gray-500">Generate an image to start editing.</p>
                                    <motion.button whileHover={{ scale: 1.02, boxShadow: "0px 3px 10px rgba(96, 165, 250, 0.3)" }} whileTap={{ scale: 0.98 }} onClick={() => setActiveTab('generate')} className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md">
                                        Go to Generate Tab
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'history' && (
                        <motion.div key="history-tab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h2 className="text-2xl font-bold text-gray-800">Generation History</h2>
                                <button
                                    onClick={exportHistory}
                                    disabled={!generationHistory || generationHistory.length === 0}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Export All History
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50/80 rounded-lg border border-gray-200/70 shadow-sm">
                                <div>
                                    <label htmlFor="historySearch" className="block text-sm font-medium text-gray-700 mb-1">Search by Prompt</label>
                                    <input
                                        type="text"
                                        id="historySearch"
                                        placeholder="e.g., dragon, castle..."
                                        value={historySearchTerm}
                                        onChange={(e) => setHistorySearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white/90"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="historyFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Style</label>
                                    <select
                                        id="historyFilter"
                                        value={historyFilterStyle}
                                        onChange={(e) => setHistoryFilterStyle(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white/90"
                                    >
                                        <option value="all">All Styles</option>
                                        {stylePresets.map(preset => (
                                            <option key={preset.id} value={preset.id}>{preset.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="historySort" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                                    <select
                                        id="historySort"
                                        value={historySortOrder}
                                        onChange={(e) => setHistorySortOrder(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white/90"
                                    >
                                        <option value="date_desc">Newest First</option>
                                        <option value="date_asc">Oldest First</option>
                                        <option value="prompt_asc">Prompt (A-Z)</option>
                                        <option value="prompt_desc">Prompt (Z-A)</option>
                                    </select>
                                </div>
                            </div>
                            {getFilteredAndSortedHistory().length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {getFilteredAndSortedHistory().map((item) => (
                                        <motion.div
                                            key={item.date + item.prompt}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white/90 rounded-xl overflow-hidden shadow-lg border flex flex-col group relative transition-all duration-200 border-gray-200/80"
                                        >
                                            <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden cursor-pointer" onClick={(e) => { e.stopPropagation(); openLightbox(item.image); }}>
                                                <img
                                                    src={item.image}
                                                    alt={`History: ${item.prompt}`}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                                                    {item.style || 'realistic'} / {item.ratio || 'square'}
                                                </div>
                                            </div>
                                            <div className="p-4 flex flex-col flex-grow">
                                                <p className="text-xs text-gray-500 mb-1">{formatDate(item.date)}</p>
                                                <p className="text-sm font-medium text-gray-700 line-clamp-3 mb-2 flex-grow" title={item.prompt}>{item.prompt}</p>
                                                <div className="mt-auto flex justify-end space-x-2 pt-2">
                                                    <motion.a
                                                        href={item.image}
                                                        download={`ai-history-${Date.now()}.png`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                                        className="p-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors" title="Download Image"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                    </motion.a>
                                                    <motion.button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPrompt(item.prompt);
                                                            setActiveTab('generate');
                                                            if (item.style) setStylePreset(item.style);
                                                            if (item.ratio) setAspectRatio(item.ratio);
                                                        }}
                                                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                                        className="p-1.5 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors" title="Reuse Prompt"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: "spring" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400/80 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        <h3 className="mt-2 text-xl font-semibold text-gray-700">No Generation History</h3>
                                        <p className="mt-2 text-gray-500">Generate images to see your history.</p>
                                        <motion.button
                                            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(96, 165, 250, 0.4)" }} whileTap={{ scale: 0.95 }}
                                            onClick={() => setActiveTab('generate')}
                                            className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
                                        >
                                            Start Generating
                                        </motion.button>
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                        <motion.div key="analytics-tab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
                            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">User Analytics Dashboard 📈</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <motion.div
                                    className="bg-white/80 p-6 rounded-3xl border border-gray-200/70 shadow-lg backdrop-blur-sm"
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
                                >
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Generations by Style</h3>
                                    <p className="text-sm text-gray-600 mb-6">A breakdown of the different art styles you've used most frequently.</p>
                                    <div className="w-full max-w-sm mx-auto p-4 bg-gray-50 rounded-2xl shadow-inner">
                                        {Object.keys(pieChartStyleData.labels).length > 0 ? (
                                            <Pie
                                                data={pieChartStyleData}
                                                options={{
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            position: 'right',
                                                            labels: {
                                                                font: { size: 12 },
                                                                boxWidth: 15,
                                                                padding: 10
                                                            }
                                                        },
                                                        tooltip: {
                                                            callbacks: {
                                                                label: function (context) {
                                                                    const label = stylePresets.find(p => p.id === context.label)?.name || context.label;
                                                                    const value = context.raw;
                                                                    const total = context.dataset.data.reduce((sum, current) => sum + current, 0);
                                                                    const percentage = ((value / total) * 100).toFixed(1);
                                                                    return `${label}: ${value} (${percentage}%)`;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="text-center text-gray-500 py-12">No style data available yet.</div>
                                        )}
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="bg-white/80 p-6 rounded-3xl border border-gray-200/70 shadow-lg backdrop-blur-sm"
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
                                >
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Generations by Aspect Ratio</h3>
                                    <p className="text-sm text-gray-600 mb-6">Your most used aspect ratios for image generation.</p>
                                    <div className="w-full max-w-sm mx-auto p-4 bg-gray-50 rounded-2xl shadow-inner">
                                        {Object.keys(barChartRatioData.labels).length > 0 ? (
                                            <Bar
                                                data={barChartRatioData}
                                                options={{
                                                    responsive: true,
                                                    scales: {
                                                        x: { grid: { display: false } },
                                                        y: { beginAtZero: true, ticks: { precision: 0 } }
                                                    },
                                                    plugins: {
                                                        legend: { display: false },
                                                        tooltip: {
                                                            callbacks: {
                                                                title: (tooltipItem) => `Aspect Ratio: ${tooltipItem[0].label}`,
                                                                label: (context) => `Count: ${context.parsed.y}`,
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="text-center text-gray-500 py-12">No aspect ratio data available yet.</div>
                                        )}
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="bg-white/80 p-6 rounded-3xl border border-gray-200/70 shadow-lg backdrop-blur-sm"
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.3 }}
                                >
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">User Actions</h3>
                                    <p className="text-sm text-gray-600 mb-6">Track your interactions stored locally on this device.</p>
                                    <div className="w-full max-w-sm mx-auto p-4 bg-gray-50 rounded-2xl shadow-inner">
                                        <Bar
                                            data={generalActionsData}
                                            options={{
                                                responsive: true,
                                                scales: {
                                                    x: { grid: { display: false } },
                                                    y: { beginAtZero: true, ticks: { precision: 0 } }
                                                },
                                                plugins: {
                                                    legend: { display: false },
                                                    tooltip: {
                                                        callbacks: {
                                                            title: (tooltipItem) => `Action: ${tooltipItem[0].label}`,
                                                            label: (context) => `Count: ${context.parsed.y}`,
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <AnimatePresence>
                {showPromptWizard && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
                        onClick={() => setShowPromptWizard(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative overflow-hidden border border-gray-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Prompt Wizard 🪄</h2>
                                <button
                                    onClick={() => setShowPromptWizard(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                    aria-label="Close prompt wizard"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {promptCategories.map((category) => (
                                            <motion.button
                                                type="button"
                                                key={category.id}
                                                whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                                                onClick={() => setPromptCategory(category.id)}
                                                className={`p-2 rounded-lg text-xs font-medium transition-all ${promptCategory === category.id ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            >
                                                {category.name}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Attributes</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {promptAttributesByCategory[promptCategory].map((attribute) => (
                                            <motion.button
                                                type="button"
                                                key={attribute}
                                                whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    if (promptAttributes.includes(attribute)) {
                                                        setPromptAttributes(promptAttributes.filter(a => a !== attribute));
                                                    } else {
                                                        setPromptAttributes([...promptAttributes, attribute]);
                                                    }
                                                }}
                                                className={`p-2 rounded-lg text-xs font-medium transition-all ${promptAttributes.includes(attribute) ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            >
                                                {attribute}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={generatePromptFromWizard}
                                        className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                                    >
                                        Generate Prompt
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showPromptEnhancer && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
                        onClick={() => setShowPromptEnhancer(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative overflow-hidden border border-gray-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Prompt Enhancer ✨</h2>
                                <button
                                    onClick={() => setShowPromptEnhancer(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                    aria-label="Close prompt enhancer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Prompt</label>
                                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 mb-3">{prompt}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Enhanced Prompt</label>
                                    <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-700">{enhancedPrompt}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowPromptEnhancer(false)}
                                        className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={applyEnhancedPrompt}
                                        className="py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                                    >
                                        Apply Enhanced
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {lightboxOpen && selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative max-w-4xl max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage}
                                alt="Lightbox view"
                                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            />
                            <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setLightboxOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageGenerator;