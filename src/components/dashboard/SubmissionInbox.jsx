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
      await updateSubmission(submissionId, { priority })
      setSubmissions((current) =>
        current.map((submission) =>
          submission.id === submissionId
            ? {
                ...submission,
                priority,
                priority_label: priorityOptions.find((item) => item.value === priority)?.label || submission.priority_label,
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
      await updateSubmission(submissionId, { is_dismissed: !isDismissed })
      setSubmissions((current) =>
        current.map((submission) =>
          submission.id === submissionId
            ? { ...submission, is_dismissed: !isDismissed }
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
      <div className="flex h-[320px] items-center justify-center rounded-2xl border bg-card">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Submissions</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{count} enquiry records</h2>
        </div>
        <Button variant="outline" onClick={() => loadSubmissions(page)}>
          <RefreshCw className="mr-2 size-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {submissions.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
            <MailOpen className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold tracking-tight">No submissions yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Messages from the public contact form will show up here.
            </p>
          </div>
        ) : (
          submissions.map((submission) => (
            <article key={submission.id} className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-tight">{submission.name}</h3>
                    <Badge variant={submission.is_dismissed ? "secondary" : "default"}>
                      {submission.is_dismissed ? "Dismissed" : "Active"}
                    </Badge>
                    <Badge variant="outline">{submission.priority_label || "Priority"}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>{submission.email}</span>
                    {submission.phone ? <span>{submission.phone}</span> : null}
                    <span>{new Date(submission.submitted_at).toLocaleString()}</span>
                  </div>

                  <p className="text-sm leading-7 text-foreground/90">{submission.message}</p>
                </div>

                <div className="flex min-w-[220px] flex-col gap-3">
                  <Select
                    value={String(submission.priority)}
                    onValueChange={(value) => handlePriorityChange(submission.id, Number(value))}
                    disabled={updatingId === submission.id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Set priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant={submission.is_dismissed ? "outline" : "secondary"}
                    onClick={() => handleDismiss(submission.id, submission.is_dismissed)}
                    disabled={updatingId === submission.id}
                  >
                    {submission.is_dismissed ? "Restore" : "Dismiss"}
                  </Button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="flex items-center justify-between rounded-2xl border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          Page {page} of {pageCount}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => loadSubmissions(page - 1)}>
            Previous
          </Button>
          <Button variant="outline" disabled={page >= pageCount} onClick={() => loadSubmissions(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
