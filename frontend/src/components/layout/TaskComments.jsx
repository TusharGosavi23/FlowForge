import { useEffect, useState } from "react";
import { commentService } from "../../services/commentService";
import { MessageSquare, Send, Loader2 } from "lucide-react";

function TaskComments({ taskId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const loadComments = async () => {
    try {
      const data = await commentService.getByTask(taskId);
      setComments(data);
    } catch (err) {
      setError(err.message || "Unable to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() || sending) return;

    setSending(true);
    setError("");

    try {
      const newComment = await commentService.create(
        taskId,
        content.trim()
      );

      setComments((prev) => [...prev, newComment]);
      setContent("");
    } catch (err) {
      setError(err.message || "Failed to add comment.");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center gap-2">
        <MessageSquare size={18} className="text-indigo-600" />
        <h3 className="font-semibold text-slate-900">
          Comments ({comments.length})
        </h3>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading comments...</p>
      ) : (
        <div className="mb-5 max-h-80 space-y-4 overflow-y-auto">
          {comments.length === 0 ? (
            <div className="py-6 text-center">
              <MessageSquare
                size={30}
                className="mx-auto mb-2 text-slate-300"
              />
              <p className="text-sm text-slate-500">
                No comments yet.
              </p>
              <p className="text-xs text-slate-400">
                Start the discussion.
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg bg-slate-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-slate-800">
                    {comment.authorEmail}
                  </span>

                  <span className="text-xs text-slate-400">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>

                <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-600">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          rows={2}
          maxLength={2000}
          className="min-w-0 flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <button
          type="submit"
          disabled={!content.trim() || sending}
          className="flex items-center justify-center gap-2 self-end rounded-lg bg-indigo-600 px-4 py-2.5 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}

export default TaskComments;