import { useCallback, useEffect, useState } from "react"
import { Loader2, MailOpen, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchSubmissions, updateSubmission } from "@/helper/functions"

const priorityOptions = [
  { value: 0, label: "Low" },
  { value: 1, label: "Medium" },
  { value: 2, label: "High" },
  { value: 3, label: "Urgent" },
]

export default function SubmissionInbox() {
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState([])
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [count, setCount] = useState(0)
  const [updatingId, setUpdatingId] = useState(null)

  const loadSubmissions = useCallback(async (nextPage = page) => {
    setLoading(true)
    try {
      const response = await fetchSubmissions(nextPage)
      const results = response?.results || response?.submissions || []
      const totalCount = response?.count || results.length
      const pageSize = results.length || 10

      setSubmissions(results)
      setPage(nextPage)
      setCount(totalCount)
      setPageCount(Math.max(1, Math.ceil(totalCount / pageSize)))
    } catch (error) {
      toast.error(error.message || "Failed to load submissions")
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    loadSubmissions(1)
  }, [loadSubmissions])

  const handlePriorityChange = async (submissionId, priority) => {
    setUpdatingId(submissionId)
    try {
      const updatedSubmission = await updateSubmission(submissionId, { priority })
      setSubmissions((current) =>
        current.map((submission) =>
          submission.id === submissionId
            ? {
                ...submission,
                ...updatedSubmission,
                priority: updatedSubmission?.priority ?? priority,
                priority_label: updatedSubmission?.priority_label || priorityOptions.find((item) => item.value === priority)?.label || submission.priority_label,
              }
            : submission
        )
      )
      toast.success("Submission priority updated")
    } catch (error) {
      toast.error(error.message || "Could not update priority")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDismiss = async (submissionId, isDismissed) => {
    setUpdatingId(submissionId)
    try {
      const updatedSubmission = await updateSubmission(submissionId, { is_dismissed: !isDismissed })
      setSubmissions((current) =>
        current.map((submission) =>
          submission.id === submissionId
            ? { ...submission, ...updatedSubmission, is_dismissed: updatedSubmission?.is_dismissed ?? !isDismissed }
            : submission
        )
      )
      toast.success(isDismissed ? "Submission restored" : "Submission dismissed")
    } catch (error) {
      toast.error(error.message || "Could not update submission")
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <div className="cinematic-panel relative flex h-[400px] items-center justify-center rounded-[2.5rem] shadow-xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex items-center justify-center">
            {/* Cinematic Glow Behind Spinner */}
            <div className="absolute h-20 w-20 rounded-full bg-primary/20 blur-[30px]" />
            <Loader2 className="relative size-8 animate-spin text-primary" />
          </div>
          <p className="text-sm font-light tracking-wide text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Panel */}
      <div className="cinematic-panel relative overflow-hidden rounded-[2.5rem] p-8 shadow-xl shadow-background/50 lg:flex lg:items-center lg:justify-between">
        {/* Subtle Ambient Glow */}
        <div className="absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 mb-6 lg:mb-0">
          <p className="text-xs font-bold uppercase tracking-widest text-primary/80">Submissions</p>
          <h2 className="mt-2 text-3xl font-medium tracking-tight text-foreground">{count} enquiry records</h2>
        </div>
        
        <Button 
          variant="outline" 
          className="relative z-10 h-12 w-full rounded-full border-border/50 bg-card/30 px-6 font-medium backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:bg-card/60 hover:text-primary lg:w-auto" 
          onClick={() => loadSubmissions(page)}
        >
          <RefreshCw className="mr-2.5 size-4" />
          Refresh inbox
        </Button>
      </div>

      {/* Submissions List */}
      <div className="grid gap-6">
        {submissions.length === 0 ? (
          <div className="cinematic-panel flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-border/40 bg-card/10 p-16 text-center shadow-inner">
            <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-border/30 bg-card/30 shadow-sm">
              <MailOpen className="size-7 text-muted-foreground/70" />
            </div>
            <p className="text-xl font-medium tracking-tight text-foreground">No submissions yet</p>
            <p className="mt-2 max-w-sm text-sm font-light leading-relaxed text-muted-foreground">
              Messages from your public portfolio contact form will securely appear here.
            </p>
          </div>
        ) : (
          submissions.map((submission) => (
            <article key={submission.id} className="cinematic-panel-hover group relative rounded-[2rem] border border-border/30 bg-card/20 p-6 sm:p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-primary/30 hover:bg-card/40 hover:shadow-[0_0_30px_0_color-mix(in_oklch,var(--primary)_10%,transparent)]">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
                <div className="space-y-4">
                  {/* Title & Badges */}
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-medium tracking-tight text-foreground">{submission.name}</h3>
                    <Badge variant="secondary" className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-widest border ${submission.is_dismissed ? 'border-border/40 bg-card/40 text-muted-foreground' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'}`}>
                      {submission.is_dismissed ? "Dismissed" : "Active"}
                    </Badge>
                    <Badge variant="outline" className="rounded-full border-border/40 bg-background/50 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                      {submission.priority_label || "Priority"}
                    </Badge>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-light tracking-wide text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-primary/40" />
                      {submission.email}
                    </span>
                    {submission.phone && (
                      <span className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-primary/40" />
                        {submission.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-border" />
                      {new Date(submission.submitted_at).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </span>
                  </div>

                  {/* Message Body */}
                  <div className="rounded-2xl border border-border/30 bg-card/30 p-5 backdrop-blur-sm shadow-inner">
                    <p className="text-sm font-light leading-relaxed text-foreground/90 whitespace-pre-wrap">
                      {submission.message}
                    </p>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="grid gap-4 rounded-2xl border border-border/30 bg-muted/10 p-5 xl:sticky xl:top-28">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground pl-1">Priority Level</label>
                    <Select
                      value={String(submission.priority)}
                      onValueChange={(value) => handlePriorityChange(submission.id, Number(value))}
                      disabled={updatingId === submission.id}
                    >
                      <SelectTrigger className="h-11 w-full rounded-xl border-border/40 bg-card/40 font-medium backdrop-blur-sm transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary/40">
                        <SelectValue placeholder="Set priority" />
                      </SelectTrigger>
                      <SelectContent className="border-border/40 bg-background/95 backdrop-blur-xl">
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={String(option.value)} className="font-medium">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant={submission.is_dismissed ? "default" : "outline"}
                    className={`h-11 w-full rounded-xl font-medium transition-all duration-500 shadow-none ${
                      submission.is_dismissed 
                        ? 'hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(var(--primary),0.3)]' 
                        : 'border-border/50 bg-card/30 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive'
                    }`}
                    onClick={() => handleDismiss(submission.id, submission.is_dismissed)}
                    disabled={updatingId === submission.id}
                  >
                    {submission.is_dismissed ? "Restore Submission" : "Dismiss Submission"}
                  </Button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Pagination Panel */}
      <div className="cinematic-panel flex flex-col gap-5 rounded-[2rem] p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm font-medium tracking-wide text-muted-foreground pl-2">
          Page <span className="text-foreground">{page}</span> of <span className="text-foreground">{pageCount}</span>
        </p>
        <div className="flex gap-3">
          <Button 
            className="h-11 rounded-full px-6 font-medium transition-transform duration-300 hover:scale-[1.02] border-border/50 bg-card/30 shadow-none" 
            variant="outline" 
            disabled={page <= 1} 
            onClick={() => loadSubmissions(page - 1)}
          >
            Previous
          </Button>
          <Button 
            className="h-11 rounded-full px-6 font-medium transition-transform duration-300 hover:scale-[1.02] border-border/50 bg-card/30 shadow-none" 
            variant="outline" 
            disabled={page >= pageCount} 
            onClick={() => loadSubmissions(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}