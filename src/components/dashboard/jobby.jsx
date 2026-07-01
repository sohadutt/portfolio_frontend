import React, { useState, useEffect } from 'react';
import { Briefcase, Star, Lock, Zap, Search, Play, Filter, ExternalLink } from 'lucide-react';
import { 
    fetchJobbyCredits, 
    fetchAllJobs, 
    fetchMatchedJobs, 
    startJobbyPipeline, 
    getUserProfile 
} from '../../helper/functions';

const Jobby = () => {
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);
    const [credits, setCredits] = useState(0);
    
    const [activeTab, setActiveTab] = useState('matched'); // 'matched' | 'all'
    const [jobs, setJobs] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, next: null, prev: null });
    
    // Filters
    const [siteName, setSiteName] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');
    const [minScore, setMinScore] = useState(0);
    const [isStarting, setIsStarting] = useState(false);

    useEffect(() => {
        checkUserStatus();
    }, []);

    useEffect(() => {
        if (isPremium) {
            loadJobs();
        }
    }, [isPremium, activeTab, pagination.page, siteName, minScore]);

    const checkUserStatus = async () => {
        try {
            setLoading(true);
            const userProfile = await getUserProfile();
            const creditData = await fetchJobbyCredits();
            
            setCredits(creditData.job_analysis_limit || 0);
            // Define your premium logic here. E.g., userProfile.tier > 0 or based on subscription flag
            setIsPremium(userProfile?.tier > 0 || userProfile?.is_premium === true); 
        } catch (error) {
            console.error("Failed to fetch user status", error);
        } finally {
            setLoading(false);
        }
    };

    const loadJobs = async () => {
        try {
            setLoading(true);
            const params = { page: pagination.page };
            if (siteName) params.site_name = siteName;
            
            let data;
            if (activeTab === 'matched') {
                if (minScore > 0) params.min_score = minScore;
                data = await fetchMatchedJobs(params);
            } else {
                data = await fetchAllJobs(params);
            }
            
            setJobs(data.results || []);
            setPagination(prev => ({
                ...prev,
                next: data.next,
                prev: data.previous,
                // Optional: calculate total pages if count is provided by DRF
            }));
        } catch (error) {
            console.error("Failed to load jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRunPipeline = async () => {
        if (!siteName) return alert("Please enter a site name (e.g., deloitte) in the filter first to run the pipeline.");
        
        try {
            setIsStarting(true);
            // Triggers Celery task in backend
            await startJobbyPipeline(siteName, { scraper: true, processor: true });
            alert(`Pipeline started for ${siteName}! This runs in the background. Check back in a few minutes.`);
            
            // Refresh credits
            const creditData = await fetchJobbyCredits();
            setCredits(creditData.job_analysis_limit || 0);
        } catch (error) {
            alert(error.message || "Failed to start pipeline. Check your credits.");
        } finally {
            setIsStarting(false);
        }
    };

    // Local filter for company name (since DRF endpoint doesn't natively filter by company in the provided code)
    const filteredJobs = jobs.filter(item => {
        const company = activeTab === 'matched' ? item.job?.company : item.company;
        if (!companyFilter) return true;
        return company?.toLowerCase().includes(companyFilter.toLowerCase());
    });

    if (loading && !jobs.length) {
        return <div className="p-8 text-center animate-pulse">Loading Jobby workspace...</div>;
    }

    // --- NON-PREMIUM ADVERTISEMENT VIEW ---
    if (!isPremium) {
        return (
            <div className="max-w-4xl mx-auto p-6 mt-10">
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-10 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Lock size={200} />
                    </div>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="mx-auto bg-indigo-500/20 w-20 h-20 rounded-full flex items-center justify-center mb-6 ring-4 ring-indigo-500/50">
                            <Zap className="text-yellow-400 w-10 h-10" />
                        </div>
                        
                        <h2 className="text-4xl font-extrabold tracking-tight">Unlock AI Job Matching</h2>
                        <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
                            Stop scrolling through hundreds of irrelevant job postings. Upgrade to Premium and let our AI scrape, analyze, and match open positions directly to your portfolio skills.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-10 text-left">
                            <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm">
                                <Briefcase className="text-indigo-400 mb-3" />
                                <h3 className="font-bold text-lg">Automated Scraping</h3>
                                <p className="text-sm text-gray-300 mt-1">Pull jobs directly from top company career portals.</p>
                            </div>
                            <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm">
                                <Star className="text-yellow-400 mb-3" />
                                <h3 className="font-bold text-lg">Smart Scoring</h3>
                                <p className="text-sm text-gray-300 mt-1">Gemini AI reads your portfolio and scores your match percentage.</p>
                            </div>
                            <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm">
                                <Search className="text-green-400 mb-3" />
                                <h3 className="font-bold text-lg">Tag Extraction</h3>
                                <p className="text-sm text-gray-300 mt-1">Instantly see which of your skills perfectly align with the job description.</p>
                            </div>
                        </div>

                        <button className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all transform hover:scale-105">
                            Upgrade to Premium Now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- PREMIUM VIEW ---
    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                        <Zap className="text-indigo-500" /> Jobby AI Matcher
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Review scraped jobs and AI portfolio matches.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-lg font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        Credits remaining: <span className="text-indigo-500 font-bold ml-1">{credits}</span>
                    </div>
                    
                    <button 
                        onClick={handleRunPipeline}
                        disabled={isStarting || credits <= 0}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
                    >
                        <Play size={18} />
                        {isStarting ? "Triggering..." : "Run Pipeline"}
                    </button>
                </div>
            </div>

            {/* Controls & Filters */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Tabs */}
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                    <button 
                        onClick={() => { setActiveTab('matched'); setPagination({ ...pagination, page: 1 }); }}
                        className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'matched' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
                    >
                        Matches
                    </button>
                    <button 
                        onClick={() => { setActiveTab('all'); setPagination({ ...pagination, page: 1 }); }}
                        className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
                    >
                        All Raw Jobs
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Filter company..." 
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-40"
                        />
                    </div>

                    <input 
                        type="text" 
                        placeholder="Site Name (e.g. deloitte)" 
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-48"
                    />

                    {activeTab === 'matched' && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">Min Score:</span>
                            <input 
                                type="number" 
                                min="0" max="100" 
                                value={minScore}
                                onChange={(e) => setMinScore(e.target.value)}
                                className="w-20 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Data Display */}
            <div className="space-y-4">
                {loading && <div className="text-center py-10 text-slate-500">Loading data...</div>}
                
                {!loading && filteredJobs.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <Filter className="mx-auto text-slate-400 mb-3" size={32} />
                        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">No jobs found</h3>
                        <p className="text-slate-500">Try adjusting your filters or running a new pipeline.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!loading && filteredJobs.map((item, idx) => {
                        // Normalize data depending on if it's a Match object or raw Job object
                        const isMatchTab = activeTab === 'matched';
                        const jobData = isMatchTab ? item.job : item;
                        
                        return (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="bg-slate-100 dark:bg-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        {jobData.platform_name}
                                    </div>
                                    
                                    {isMatchTab && (
                                        <div className={`font-bold px-2.5 py-1 rounded-md text-sm flex items-center gap-1 ${
                                            item.match_score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                            item.match_score >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                                            'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                                        }`}>
                                            <Star size={14} className={item.match_score >= 80 ? 'fill-current' : ''} /> 
                                            {item.match_score}%
                                        </div>
                                    )}
                                </div>
                                
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">
                                    {jobData.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                                    {jobData.company} • {jobData.location || 'Remote/Unspecified'}
                                </p>
                                
                                {isMatchTab && item.tags && item.tags.length > 0 && (
                                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                                        <div className="flex flex-wrap gap-2">
                                            {item.tags.slice(0, 4).map((tag, i) => (
                                                <span key={i} className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-1 rounded-md border border-indigo-100 dark:border-indigo-800">
                                                    {tag}
                                                </span>
                                            ))}
                                            {item.tags.length > 4 && (
                                                <span className="text-xs text-slate-400 px-1 py-1">+{item.tags.length - 4} more</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mt-5 pt-3">
                                    <a 
                                        href={jobData.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
                                    >
                                        View Original Post <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center gap-4 mt-8 pt-4">
                    <button 
                        disabled={!pagination.prev || loading}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 text-sm font-medium"
                    >
                        Previous
                    </button>
                    <span className="flex items-center text-sm text-slate-500">Page {pagination.page}</span>
                    <button 
                        disabled={!pagination.next || loading}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 text-sm font-medium"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Jobby;