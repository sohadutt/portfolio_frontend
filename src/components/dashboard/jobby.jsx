import React, { useState, useEffect } from 'react';
import { 
    Briefcase, Star, Lock, Zap, Search, Play, Filter, 
    ExternalLink, Loader2, X, MapPin, Building2, Calendar, 
    LayoutTemplate, GraduationCap, Globe // <-- Globe imported here
} from 'lucide-react';
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

    // Modal State
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        checkUserStatus();
    }, []);

    useEffect(() => {
        if (isPremium) {
            loadJobs();
        }
    }, [isPremium, activeTab, pagination.page, siteName, minScore]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedJob) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedJob]);

    const checkUserStatus = async () => {
        try {
            setLoading(true);
            const userProfile = await getUserProfile();
            const creditData = await fetchJobbyCredits();
            
            setCredits(creditData.job_analysis_limit || 0);
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
            
            const PAGE_SIZE = 20;
            const calculatedTotalPages = data.count ? Math.ceil(data.count / PAGE_SIZE) : 1;

            setPagination(prev => ({
                ...prev,
                next: data.next,
                prev: data.previous,
                totalPages: calculatedTotalPages
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
            await startJobbyPipeline(siteName, { scraper: true, processor: true });
            alert(`Pipeline started for ${siteName}! This runs in the background. Check back in a few minutes.`);
            
            const creditData = await fetchJobbyCredits();
            setCredits(creditData.job_analysis_limit || 0);
        } catch (error) {
            alert(error.message || "Failed to start pipeline. Check your credits.");
        } finally {
            setIsStarting(false);
        }
    };

    const filteredJobs = jobs.filter(item => {
        const company = item?.job?.company || item?.company || '';
        if (!companyFilter) return true;
        return company.toLowerCase().includes(companyFilter.toLowerCase());
    });

    // Helper to format tools list from either array or comma-separated string
    const formatTools = (tools) => {
        if (!tools) return [];
        if (Array.isArray(tools)) return tools;
        if (typeof tools === 'string') return tools.split(',').map(t => t.trim());
        return [];
    };

    // --- MODAL RENDERER ---
    const renderJobModal = () => {
        if (!selectedJob) return null;

        // Bulletproof data resolution based on object shape, not tab state
        const jobData = selectedJob?.job || selectedJob || {};
        const isMatchRecord = selectedJob?.match_score !== undefined;
        const aiMeta = jobData?.ai_metadata || {};
        const tools = formatTools(aiMeta?.tools);

        return (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm sm:p-6 transition-opacity"
                onClick={() => setSelectedJob(null)}
            >
                <div 
                    className="cinematic-panel relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="flex items-start justify-between border-b border-border/40 bg-card/40 p-6 sm:p-8">
                        <div className="pr-4">
                            <div className="mb-3 flex items-center gap-3">
                                <span className="inline-flex rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                                    {jobData.platform_name}
                                </span>
                                {isMatchRecord && (
                                    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${
                                        selectedJob.match_score >= 80 ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' : 
                                        selectedJob.match_score >= 50 ? 'border-amber-500/20 bg-amber-500/10 text-amber-500' : 
                                        'border-border/50 bg-card/50 text-muted-foreground'
                                    }`}>
                                        <Star className={`size-3.5 ${selectedJob.match_score >= 80 ? 'fill-current' : ''}`} /> 
                                        {selectedJob.match_score}% Match
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl leading-tight">
                                {jobData.title}
                            </h2>
                            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-light text-muted-foreground">
                                <div className="flex items-center gap-1.5"><Building2 className="size-4" /> {jobData.company}</div>
                                <div className="flex items-center gap-1.5"><MapPin className="size-4" /> {aiMeta.location_type || jobData.location || 'Remote'}</div>
                                {jobData.date_posted && (
                                    <div className="flex items-center gap-1.5"><Calendar className="size-4" /> {jobData.date_posted}</div>
                                )}
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedJob(null)}
                            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card/50 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Modal Scrollable Body */}
                    <div className="flex-1 overflow-y-auto p-6 sm:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/50 [&::-webkit-scrollbar-track]:bg-transparent">
                        
                        {/* AI Metadata Grid */}
                        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {aiMeta.seniority && (
                                <div className="rounded-2xl border border-border/40 bg-card/20 p-4">
                                    <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                        <GraduationCap className="size-3.5" /> Seniority
                                    </div>
                                    <p className="font-medium text-foreground">{aiMeta.seniority}</p>
                                </div>
                            )}
                            {aiMeta.domain && (
                                <div className="rounded-2xl border border-border/40 bg-card/20 p-4">
                                    <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                        <Globe className="size-3.5" /> Domain
                                    </div>
                                    <p className="font-medium text-foreground truncate" title={aiMeta.domain}>{aiMeta.domain}</p>
                                </div>
                            )}
                            {aiMeta.role_family && (
                                <div className="rounded-2xl border border-border/40 bg-card/20 p-4">
                                    <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                        <LayoutTemplate className="size-3.5" /> Role Family
                                    </div>
                                    <p className="font-medium text-foreground truncate" title={aiMeta.role_family}>{aiMeta.role_family}</p>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">Job Description</h3>
                            {jobData.description ? (
                                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap font-light">
                                    {jobData.description}
                                </div>
                            ) : (
                                <p className="text-sm italic text-muted-foreground/60">No full description available in the database.</p>
                            )}
                        </div>

                        {/* Extracted Tools & Skills */}
                        {(tools.length > 0 || (aiMeta.primary_skills && aiMeta.primary_skills.length > 0)) && (
                            <div className="mb-8 space-y-6">
                                {tools.length > 0 && (
                                    <div>
                                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Tools & Tech Stack</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {tools.map((tool, i) => (
                                                <span key={i} className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-500 dark:text-indigo-400">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {aiMeta.primary_skills && aiMeta.primary_skills.length > 0 && (
                                    <div>
                                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Core Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {aiMeta.primary_skills.map((skill, i) => (
                                                <span key={i} className="rounded-lg border border-border/50 bg-card/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="border-t border-border/40 bg-card/40 p-4 sm:p-6 flex justify-end">
                        <a 
                            href={jobData.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-medium tracking-wide text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all hover:scale-[1.02] hover:bg-primary/90"
                        >
                            Open on {jobData.platform_name} <ExternalLink className="size-4" />
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    if (loading && !jobs.length) {
        return (
            <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-6 text-center">
                <div className="relative flex items-center justify-center">
                    <div className="absolute h-24 w-24 rounded-full bg-primary/20 blur-[40px]" />
                    <Loader2 className="relative size-10 animate-spin text-primary" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    Loading Jobby Workspace
                </p>
            </div>
        );
    }

    // --- NON-PREMIUM ADVERTISEMENT VIEW ---
    if (!isPremium) {
        return (
            <div className="mx-auto mt-10 max-w-4xl p-4 sm:p-6">
                <div className="cinematic-panel cinematic-panel-strong relative overflow-hidden rounded-[3rem] p-10 text-center shadow-2xl sm:p-16">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-[90px]" />
                    <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/10 blur-[90px]" />
                    <div className="pointer-events-none absolute -right-4 top-10 text-primary/5">
                        <Lock size={280} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center space-y-8">
                        <div className="flex size-24 items-center justify-center rounded-[2rem] border border-primary/20 bg-primary/10 text-primary shadow-[0_0_30px_rgba(var(--primary),0.2)]">
                            <Zap className="size-12" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">Unlock AI Job Matching</h2>
                            <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-muted-foreground">
                                Stop scrolling through hundreds of irrelevant job postings. Upgrade to Premium and let our AI scrape, analyze, and match open positions directly to your portfolio skills.
                            </p>
                        </div>
                        <div className="mb-8 mt-4 grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-3 sm:gap-8">
                            <div className="cinematic-panel rounded-2xl p-6">
                                <Briefcase className="mb-4 size-6 text-primary" />
                                <h3 className="text-lg font-medium tracking-tight text-foreground">Automated Scraping</h3>
                                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">Pull jobs directly from top company career portals.</p>
                            </div>
                            <div className="cinematic-panel rounded-2xl p-6">
                                <Star className="mb-4 size-6 text-amber-500" />
                                <h3 className="text-lg font-medium tracking-tight text-foreground">Smart Scoring</h3>
                                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">Gemini AI reads your portfolio and scores your match percentage.</p>
                            </div>
                            <div className="cinematic-panel rounded-2xl p-6">
                                <Search className="mb-4 size-6 text-emerald-500" />
                                <h3 className="text-lg font-medium tracking-tight text-foreground">Tag Extraction</h3>
                                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">Instantly see which of your skills perfectly align with the job.</p>
                            </div>
                        </div>
                        <button className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-base font-medium tracking-wide text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all duration-300 hover:scale-[1.02] hover:bg-primary/90">
                            Upgrade to Premium Now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- PREMIUM VIEW ---
    return (
        <div className="mx-auto max-w-7xl space-y-8">
            {renderJobModal()}
            
            {/* Header Section */}
            <div className="cinematic-panel flex flex-col justify-between gap-6 rounded-[2rem] p-6 sm:flex-row sm:items-center sm:p-8">
                <div className="flex items-center gap-5">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                        <Zap className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-medium tracking-tight text-foreground">Jobby AI Matcher</h1>
                        <p className="mt-1 text-sm font-light leading-relaxed text-muted-foreground">Review scraped jobs and AI portfolio matches.</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="inline-flex items-center rounded-full border border-border/40 bg-card/40 px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur-md">
                        Credits: <span className="ml-2 font-bold text-primary">{credits}</span>
                    </div>
                    
                    <button 
                        onClick={handleRunPipeline}
                        disabled={isStarting || credits <= 0}
                        className="inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-2.5 text-sm font-medium tracking-wide text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all duration-300 hover:scale-[1.02] hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {isStarting ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
                        {isStarting ? "Processing..." : "Run Pipeline"}
                    </button>
                </div>
            </div>

            {/* Controls & Filters */}
            <div className="cinematic-panel flex flex-col items-center justify-between gap-5 rounded-3xl p-3 sm:flex-row sm:p-4">
                <div className="flex w-full rounded-2xl border border-border/40 bg-card/30 p-1 sm:w-auto">
                    <button 
                        onClick={() => { setActiveTab('matched'); setPagination({ ...pagination, page: 1 }); }}
                        className={`flex-1 rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-300 sm:flex-none ${
                            activeTab === 'matched' 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'
                        }`}
                    >
                        AI Matches
                    </button>
                    <button 
                        onClick={() => { setActiveTab('all'); setPagination({ ...pagination, page: 1 }); }}
                        className={`flex-1 rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-300 sm:flex-none ${
                            activeTab === 'all' 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'
                        }`}
                    >
                        Raw Jobs
                    </button>
                </div>

                <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Filter company..." 
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                            className="w-full rounded-xl border border-border/40 bg-card/40 py-2.5 pl-10 pr-4 text-sm font-light text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-primary/50 focus:bg-card/60 focus:ring-1 focus:ring-primary/50 sm:w-48"
                        />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Site Name (e.g. deloitte)" 
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="w-full flex-1 rounded-xl border border-border/40 bg-card/40 px-4 py-2.5 text-sm font-light text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-primary/50 focus:bg-card/60 focus:ring-1 focus:ring-primary/50 sm:w-48 sm:flex-none"
                    />
                    {activeTab === 'matched' && (
                        <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-card/40 px-3 py-1.5 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
                            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Min Score</span>
                            <input 
                                type="number" 
                                min="0" max="100" 
                                value={minScore}
                                onChange={(e) => setMinScore(e.target.value)}
                                className="w-12 bg-transparent text-center text-sm font-medium text-foreground outline-none"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Data Display */}
            <div className="space-y-6">
                {loading && (
                    <div className="flex items-center justify-center py-20">
                       <Loader2 className="size-8 animate-spin text-primary" />
                    </div>
                )}
                
                {!loading && filteredJobs.length === 0 && (
                    <div className="cinematic-panel group relative flex h-64 flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-border/40 text-center transition-all duration-500 hover:border-primary/40 hover:bg-primary/5">
                        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-border/40 bg-card/40 text-muted-foreground shadow-sm backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:border-primary/30 group-hover:text-primary group-hover:shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                            <Filter className="size-7 transition-colors duration-500 group-hover:text-primary" />
                        </div>
                        <h3 className="text-xl font-medium tracking-tight text-foreground">No jobs found</h3>
                        <p className="mt-2 max-w-sm text-sm font-light leading-relaxed text-muted-foreground">
                            Try adjusting your filters or run a new pipeline to scrape and score more jobs.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {!loading && filteredJobs.map((item, idx) => {
                        const jobData = item?.job || item || {};
                        const isMatchRecord = item?.match_score !== undefined;
                        
                        return (
                            <div 
                                key={idx} 
                                onClick={() => setSelectedJob(item)}
                                className="cinematic-panel cinematic-panel-hover flex cursor-pointer flex-col justify-between rounded-[2rem] p-6 sm:p-7"
                            >
                                <div>
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="inline-flex rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                                            {jobData.platform_name}
                                        </div>
                                        
                                        {isMatchRecord && (
                                            <div className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${
                                                item.match_score >= 80 ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' : 
                                                item.match_score >= 50 ? 'border-amber-500/20 bg-amber-500/10 text-amber-500' : 
                                                'border-border/50 bg-card/50 text-muted-foreground'
                                            }`}>
                                                <Star className={`size-3.5 ${item.match_score >= 80 ? 'fill-current' : ''}`} /> 
                                                {item.match_score}%
                                            </div>
                                        )}
                                    </div>
                                    
                                    <h3 className="mb-2 line-clamp-2 text-lg font-medium leading-snug tracking-tight text-foreground">
                                        {jobData.title}
                                    </h3>
                                    <p className="mb-5 text-sm font-light text-muted-foreground">
                                        {jobData.company} <span className="mx-1.5 opacity-50">•</span> {jobData.location || 'Remote'}
                                    </p>
                                </div>
                                
                                <div>
                                    {isMatchRecord && item.tags && item.tags.length > 0 && (
                                        <div className="mb-5 flex flex-wrap gap-2 border-t border-border/30 pt-4">
                                            {item.tags.slice(0, 4).map((tag, i) => (
                                                <span key={i} className="rounded-md border border-border/50 bg-card/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                                                    {tag}
                                                </span>
                                            ))}
                                            {item.tags.length > 4 && (
                                                <span className="px-1 py-1 text-[11px] font-medium text-muted-foreground/60">
                                                    +{item.tags.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    
                                    <a 
                                        href={jobData.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="group inline-flex items-center gap-2 text-sm font-medium tracking-wide text-primary transition-colors hover:text-primary/80"
                                    >
                                        View Original Post 
                                        <ExternalLink className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination Controls */}
                {filteredJobs.length > 0 && (
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button 
                            disabled={!pagination.prev || loading}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            className="cinematic-panel inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-card/60 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="text-sm font-medium tracking-wide text-muted-foreground">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button 
                            disabled={!pagination.next || loading}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            className="cinematic-panel inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-card/60 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobby;