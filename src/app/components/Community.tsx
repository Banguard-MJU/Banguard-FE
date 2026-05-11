import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useParams } from "react-router";
import {
  MessageCircle,
  ThumbsUp,
  Eye,
  Plus,
  Search,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  MapPin,
  Users,
  Clock,
  Share2,
  Bookmark,
  Send,
  MoreVertical,
  Flag,
  Trash2,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import {
  COMMUNITY_REPORT_REASONS,
  type CommunityComment as Comment,
  type CommunityPost as Post,
  type CommunityReportReasonId,
} from "../data/community";
import {
  bookmarkPost,
  createCommunityPost,
  createPostComment,
  deletePostComment,
  getCommunityPost,
  getCommunityPosts,
  getPostComments as getPostCommentsFromBackend,
  likeComment,
  likePost,
  unbookmarkPost,
  unlikeComment,
  unlikePost,
} from "../lib/community-api";
import { getDisplayErrorMessage } from "../lib/error-message";

const CATEGORY_CONFIG = {
  all: { label: "전체", icon: Users, color: "from-gray-500 to-gray-600" },
  experience: { label: "경험 공유", icon: Share2, color: "from-blue-500 to-blue-600" },
  qa: { label: "Q&A", icon: HelpCircle, color: "from-green-500 to-green-600" },
  region: { label: "지역 정보", icon: MapPin, color: "from-purple-500 to-purple-600" },
  warning: { label: "주의 매물", icon: AlertTriangle, color: "from-red-500 to-red-600" }
};

type ReportRecord = {
  postId: string;
  reason: CommunityReportReasonId;
  details: string;
  submittedAt: Date;
};

type ReportFormState = {
  reason: CommunityReportReasonId;
  details: string;
};

const DEFAULT_REPORT_REASON: CommunityReportReasonId = "fraud";

export function Community() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasLoadedBackendPosts, setHasLoadedBackendPosts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportTargetPostId, setReportTargetPostId] = useState<string | null>(null);
  const [reportForm, setReportForm] = useState<ReportFormState>({
    reason: DEFAULT_REPORT_REASON,
    details: "",
  });
  const [submittedReports, setSubmittedReports] = useState<Record<string, ReportRecord>>({});
  const [reportStep, setReportStep] = useState<"form" | "submitted">("form");
  const viewedPostIdRef = useRef<string | null>(null);

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "experience" as Post["category"],
    tags: ""
  });

  const communityDisplayName = user?.nickname || user?.name || "나";

  const selectedPost = selectedPostId ? posts.find((post) => post.id === selectedPostId) ?? null : null;
  const reportTargetPost = reportTargetPostId ? posts.find((post) => post.id === reportTargetPostId) ?? null : null;
  const activeReport = reportTargetPostId ? submittedReports[reportTargetPostId] : undefined;

  useEffect(() => {
    let isMounted = true;

    getCommunityPosts({ size: 50 })
      .then((backendPosts) => {
        if (!isMounted) {
          return;
        }

        setPosts(backendPosts);
        setHasLoadedBackendPosts(true);
      })
      .catch((error) => {
        if (isMounted) {
          setHasLoadedBackendPosts(true);
          toast.error(getDisplayErrorMessage(error, "커뮤니티 게시글을 불러오지 못했습니다"));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const filteredPosts = useMemo(
    () =>
      posts
        .filter((post) => selectedCategory === "all" || post.category === selectedCategory)
        .filter(
          (post) =>
            searchQuery === "" ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
          if (sortBy === "latest") {
            return b.timestamp.getTime() - a.timestamp.getTime();
          }
          return b.likes + b.comments - (a.likes + a.comments);
        }),
    [posts, searchQuery, selectedCategory, sortBy]
  );

  useEffect(() => {
    if (!postId) {
      setSelectedPostId(null);
      setIsDetailDialogOpen(false);
      setNewCommentContent("");
      viewedPostIdRef.current = null;
      return;
    }

    const targetPost = posts.find((post) => post.id === postId);
    if (!targetPost) {
      if (!hasLoadedBackendPosts) {
        return;
      }

      navigate("/community", { replace: true });
      return;
    }

    setSelectedPostId(postId);
    setIsDetailDialogOpen(true);

    if (targetPost.content === "") {
      getCommunityPost(postId)
        .then((backendPost) => {
          setPosts((currentPosts) =>
            currentPosts.map((currentPost) =>
              currentPost.id === postId
                ? {
                    ...currentPost,
                    ...backendPost,
                    tags: currentPost.tags,
                  }
                : currentPost
            )
          );
        })
        .catch(() => undefined);
    }

    getPostCommentsFromBackend(postId)
      .then((backendComments) => {
        setComments((currentComments) => [
          ...currentComments.filter((comment) => comment.postId !== postId),
          ...backendComments,
        ]);
      })
      .catch(() => undefined);
  }, [hasLoadedBackendPosts, navigate, postId, posts]);

  useEffect(() => {
    if (!postId || viewedPostIdRef.current === postId) {
      return;
    }

    viewedPostIdRef.current = postId;
    setPosts((currentPosts) =>
      currentPosts.map((currentPost) =>
        currentPost.id === postId ? { ...currentPost, views: currentPost.views + 1 } : currentPost
      )
    );
  }, [postId]);

  const resetReportForm = (report?: ReportRecord) => {
    setReportForm({
      reason: report?.reason ?? DEFAULT_REPORT_REASON,
      details: report?.details ?? "",
    });
  };

  const handleLike = async (postId: string) => {
    if (!isAuthenticated || !user?.id) {
      toast.error("좋아요 기록을 남기려면 로그인이 필요합니다");
      return;
    }

    const targetPost = posts.find((post) => post.id === postId);
    if (!targetPost) {
      return;
    }

    const nextIsLiked = !targetPost.isLiked;

    try {
      const result = nextIsLiked ? await likePost(postId) : await unlikePost(postId);
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: result.like_count,
                isLiked: nextIsLiked,
              }
            : post
        )
      );
      toast.success(nextIsLiked ? "좋아요가 저장되었습니다!" : "좋아요를 취소했습니다");
    } catch (error) {
      toast.error(getDisplayErrorMessage(error, "좋아요 처리에 실패했습니다"));
    }
  };

  const handleBookmark = async (postId: string) => {
    if (!isAuthenticated || !user?.id) {
      toast.error("저장 목록에 담으려면 로그인이 필요합니다");
      return;
    }

    const targetPost = posts.find((post) => post.id === postId);
    if (!targetPost) {
      return;
    }

    const nextIsBookmarked = !targetPost.isBookmarked;

    try {
      if (nextIsBookmarked) {
        await bookmarkPost(postId);
      } else {
        await unbookmarkPost(postId);
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isBookmarked: nextIsBookmarked,
              }
            : post
        )
      );
      toast.success(nextIsBookmarked ? "저장됨에 추가되었습니다!" : "저장됨에서 제거되었습니다");
    } catch (error) {
      toast.error(getDisplayErrorMessage(error, "저장 처리에 실패했습니다"));
    }
  };

  const handleSubmitPost = async () => {
    if (!isAuthenticated) {
      toast.error("게시글을 작성하려면 로그인이 필요합니다");
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("제목과 내용을 입력해주세요");
      return;
    }

    let post: Post;
    try {
      post = await createCommunityPost({
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
      });
    } catch (error) {
      toast.error(getDisplayErrorMessage(error, "게시글 작성에 실패했습니다"));
      return;
    }

    setPosts((currentPosts) => [post, ...currentPosts]);
    setIsWriteDialogOpen(false);
    setNewPost({ title: "", content: "", category: "experience", tags: "" });
    toast.success("게시글이 작성되었습니다!");
  };

  const handlePostClick = (post: Post) => {
    navigate(`/community/${post.id}`);
  };

  const handleDetailDialogChange = (open: boolean) => {
    setIsDetailDialogOpen(open);
    if (!open) {
      navigate("/community");
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      toast.error("댓글을 작성하려면 로그인이 필요합니다");
      return;
    }

    if (!newCommentContent.trim() || !selectedPost) {
      toast.error("댓글 내용을 입력해주세요");
      return;
    }

    let comment: Comment;
    try {
      comment = await createPostComment(selectedPost.id, newCommentContent);
    } catch (error) {
      toast.error(getDisplayErrorMessage(error, "댓글 작성에 실패했습니다"));
      return;
    }

    setComments((currentComments) => [...currentComments, comment]);
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === selectedPost.id ? { ...post, comments: post.comments + 1 } : post
      )
    );
    setNewCommentContent("");
    toast.success("댓글이 작성되었습니다!");
  };

  const handleCommentLike = async (commentId: string) => {
    const targetComment = comments.find((comment) => comment.id === commentId);
    if (!targetComment) {
      return;
    }

    try {
      const result = targetComment.isLiked ? await unlikeComment(commentId) : await likeComment(commentId);
      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: result.like_count, isLiked: !comment.isLiked }
            : comment
        )
      );
    } catch (error) {
      toast.error(getDisplayErrorMessage(error, "댓글 좋아요 처리에 실패했습니다"));
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const deletedComment = comments.find((comment) => comment.id === commentId);

    try {
      await deletePostComment(commentId);
    } catch (error) {
      toast.error(getDisplayErrorMessage(error, "댓글 삭제에 실패했습니다"));
      return;
    }

    setComments((currentComments) => currentComments.filter((comment) => comment.id !== commentId));

    if (deletedComment) {
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === deletedComment.postId ? { ...post, comments: Math.max(0, post.comments - 1) } : post
        )
      );
    }

    toast.success("댓글이 삭제되었습니다");
  };

  const handleSharePost = async (post: Post) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/community/${post.id}`);
      toast.success("링크가 복사되었습니다!");
    } catch {
      toast.error("링크 복사에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const openReportDialog = (post: Post) => {
    if (!isAuthenticated) {
      toast.error("신고하려면 로그인이 필요합니다");
      return;
    }

    const existingReport = submittedReports[post.id];
    setReportTargetPostId(post.id);
    resetReportForm(existingReport);
    setReportStep(existingReport ? "submitted" : "form");
    setIsReportDialogOpen(true);
  };

  const handleReportDialogChange = (open: boolean) => {
    setIsReportDialogOpen(open);
    if (!open) {
      setReportTargetPostId(null);
      setReportStep("form");
      resetReportForm();
    }
  };

  const handleSubmitReport = () => {
    if (!reportTargetPost) {
      toast.error("신고할 게시글을 찾을 수 없습니다");
      return;
    }

    if (!reportForm.reason) {
      toast.error("신고 사유를 선택해주세요");
      return;
    }

    const nextRecord: ReportRecord = {
      postId: reportTargetPost.id,
      reason: reportForm.reason,
      details: reportForm.details.trim(),
      submittedAt: new Date(),
    };

    const alreadyReported = Boolean(submittedReports[reportTargetPost.id]);

    setSubmittedReports((currentReports) => ({
      ...currentReports,
      [reportTargetPost.id]: nextRecord,
    }));
    setReportStep("submitted");
    toast.success(alreadyReported ? "신고 내용이 업데이트되었습니다." : "신고가 접수되었습니다.");
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return "방금 전";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  const getPostComments = (postId: string) => comments.filter((comment) => comment.postId === postId);
  const getAuthorInitial = (author: string) => author.charAt(0).toUpperCase();
  const getReportRecord = (postId: string) => submittedReports[postId];
  const getReportReasonLabel = (reasonId: CommunityReportReasonId) =>
    COMMUNITY_REPORT_REASONS.find((reason) => reason.id === reasonId)?.label ?? "기타";

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30">
      <div className="app-shell">
        <Card className="mb-8 rounded-2xl border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80 sm:rounded-3xl">
          <CardContent className="flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 text-sm font-semibold text-blue-700 dark:text-blue-300">토론과 후기 분리</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">실제 거주 후기는 별도 리뷰 화면에서 확인할 수 있어요</div>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                여기는 질문, 경험 공유, 주의 정보 중심 커뮤니티입니다. 생활 만족도와 주거 형태 후기는 거주지 리뷰 화면에서 더 정돈된 형태로 볼 수 있습니다.
              </p>
            </div>
            <Button className="w-full rounded-xl sm:w-auto" onClick={() => navigate("/reviews")}>
              거주지 리뷰 보러가기
            </Button>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 px-5 py-2 rounded-full mb-4 backdrop-blur-sm">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">함께 만드는 안전한 주거</span>
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent dark:from-indigo-400 dark:to-purple-400 sm:text-5xl">
            커뮤니티
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            경험을 공유하고 질문하며 함께 전세 사기를 예방해요
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="게시글, 태그 검색..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-12 h-12 rounded-xl border-2 focus:border-indigo-300 transition-all"
              />
            </div>
            <Dialog open={isWriteDialogOpen} onOpenChange={setIsWriteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 w-full rounded-xl px-6 shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 sm:w-auto">
                  <Plus className="w-5 h-5 mr-2" />
                  글쓰기
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl sm:max-w-2xl sm:rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">새 게시글 작성</DialogTitle>
                  <DialogDescription>
                    경험과 정보를 공유하여 다른 사용자들을 도와주세요
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="category">카테고리</Label>
                    <Select
                      value={newPost.category}
                      onValueChange={(value: Post["category"]) => setNewPost({ ...newPost, category: value })}
                    >
                      <SelectTrigger id="category" className="mt-2 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="experience">경험 공유</SelectItem>
                        <SelectItem value="qa">Q&A</SelectItem>
                        <SelectItem value="region">지역 정보</SelectItem>
                        <SelectItem value="warning">주의 매물</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="title">제목</Label>
                    <Input
                      id="title"
                      value={newPost.title}
                      onChange={(event) => setNewPost({ ...newPost, title: event.target.value })}
                      placeholder="제목을 입력하세요"
                      className="mt-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">내용</Label>
                    <Textarea
                      id="content"
                      value={newPost.content}
                      onChange={(event) => setNewPost({ ...newPost, content: event.target.value })}
                      placeholder="내용을 입력하세요"
                      className="mt-2 rounded-xl min-h-[200px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
                    <Input
                      id="tags"
                      value={newPost.tags}
                      onChange={(event) => setNewPost({ ...newPost, tags: event.target.value })}
                      placeholder="예: 전세, 계약서, 신림동"
                      className="mt-2 rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button variant="outline" onClick={() => setIsWriteDialogOpen(false)} className="rounded-xl">
                    취소
                  </Button>
                  <Button onClick={handleSubmitPost} className="rounded-xl">
                    작성하기
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center">
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
              const Icon = config.icon;
              const isActive = selectedCategory === key;
              return (
                <Button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  variant={isActive ? "default" : "outline"}
                  className={`min-w-0 rounded-xl px-3 transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                      : "hover:border-indigo-300 hover:bg-indigo-50 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/50"
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{config.label}</span>
                </Button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="text-sm text-gray-600">
            총 <span className="font-bold text-indigo-600">{filteredPosts.length}</span>개의 게시글
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex">
            <Button
              variant={sortBy === "latest" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("latest")}
              className="rounded-xl"
            >
              <Clock className="w-4 h-4 mr-1" />
              최신순
            </Button>
            <Button
              variant={sortBy === "popular" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("popular")}
              className="rounded-xl"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              인기순
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => {
              const categoryConfig = CATEGORY_CONFIG[post.category];
              const CategoryIcon = categoryConfig.icon;
              const reportRecord = getReportRecord(post.id);

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <Card
                    className="hover:shadow-xl transition-all cursor-pointer border-0 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group"
                    onClick={() => handlePostClick(post)}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <div className={`h-12 w-12 flex-shrink-0 rounded-xl bg-gradient-to-br ${categoryConfig.color} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                          <CategoryIcon className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="mb-2 flex min-w-0 items-start justify-between gap-2 sm:gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="min-w-0 text-base font-bold text-gray-900 line-clamp-2 transition-colors group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400 sm:text-lg">
                                  {post.title}
                                </h3>
                                {reportRecord && (
                                  <Badge className="rounded-full border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300">
                                    <Flag className="w-3 h-3 mr-1" />
                                    신고 접수됨
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                {post.content}
                              </p>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="rounded-xl shrink-0 text-gray-500"
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuItem
                                  onClick={() => handleSharePost(post)}
                                >
                                  <Share2 className="w-4 h-4 mr-2" />
                                  링크 복사
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openReportDialog(post)}
                                >
                                  <Flag className="w-4 h-4 mr-2" />
                                  {reportRecord ? "신고 내용 보기" : "신고하기"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary" className="rounded-lg text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-medium text-gray-700 dark:text-gray-300">{post.author}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatTimeAgo(post.timestamp)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {post.views}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleLike(post.id);
                                }}
                                className={`min-w-0 rounded-xl px-2 ${post.isLiked ? "text-red-500" : ""}`}
                              >
                                <ThumbsUp className={`w-4 h-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                                {post.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="min-w-0 rounded-xl px-2">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {post.comments}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleBookmark(post.id);
                                }}
                                className={`min-w-0 rounded-xl px-2 ${post.isBookmarked ? "text-yellow-500" : ""}`}
                              >
                                <Bookmark className={`w-4 h-4 ${post.isBookmarked ? "fill-current" : ""}`} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">다른 검색어나 카테고리를 시도해보세요</p>
            </motion.div>
          )}
        </div>

        <Dialog open={isDetailDialogOpen} onOpenChange={handleDetailDialogChange}>
          <DialogContent className="max-h-[85vh] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl dark:border-gray-700 dark:bg-gray-800/95 sm:max-w-2xl sm:rounded-3xl">
            {selectedPost && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl dark:text-gray-100">{selectedPost.title}</DialogTitle>
                  <DialogDescription className="dark:text-gray-400 text-base leading-relaxed mt-3">
                    {selectedPost.content}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedPost.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="rounded-lg text-xs dark:bg-gray-700 dark:text-gray-300">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{selectedPost.author}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTimeAgo(selectedPost.timestamp)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {selectedPost.views}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 sm:flex sm:items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(selectedPost.id)}
                        className={`rounded-xl ${selectedPost.isLiked ? "text-red-500" : ""}`}
                      >
                        <ThumbsUp className={`w-4 h-4 mr-1 ${selectedPost.isLiked ? "fill-current" : ""}`} />
                        {selectedPost.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-xl">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {selectedPost.comments}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(selectedPost.id)}
                        className={`rounded-xl ${selectedPost.isBookmarked ? "text-yellow-500" : ""}`}
                      >
                        <Bookmark className={`w-4 h-4 ${selectedPost.isBookmarked ? "fill-current" : ""}`} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="rounded-xl">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                          <DropdownMenuItem onClick={() => handleSharePost(selectedPost)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            링크 복사
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openReportDialog(selectedPost)}>
                            <Flag className="w-4 h-4 mr-2" />
                            {getReportRecord(selectedPost.id) ? "신고 내용 보기" : "신고하기"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {getReportRecord(selectedPost.id) && (
                    <Card className="rounded-2xl border border-amber-200/70 bg-amber-50/80 shadow-none dark:border-amber-900/70 dark:bg-amber-950/30">
                      <CardContent className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-300 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                            이 게시글은 이미 신고 접수되었습니다
                          </p>
                          <p className="text-sm text-amber-700/90 dark:text-amber-300/80">
                            중복 신고를 쌓지 않고 기존 신고 내용을 확인하거나 수정할 수 있습니다.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Separator className="dark:bg-gray-700" />

                  <div className="space-y-4">
                    <h4 className="text-lg font-bold dark:text-gray-100">댓글 ({getPostComments(selectedPost.id).length})</h4>
                    {getPostComments(selectedPost.id).length > 0 ? (
                      <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-4">
                          {getPostComments(selectedPost.id).map((comment) => (
                            <div key={comment.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-indigo-500 text-white text-sm">
                                  {getAuthorInitial(comment.author)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">{comment.author}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {formatTimeAgo(comment.timestamp)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleCommentLike(comment.id)}
                                      className={`h-7 px-2 rounded-lg ${comment.isLiked ? "text-red-500" : ""}`}
                                    >
                                      <ThumbsUp className={`w-3 h-3 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
                                      <span className="text-xs">{comment.likes}</span>
                                    </Button>
                                    {comment.author === communityDisplayName && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="h-7 px-2 rounded-lg text-gray-500 hover:text-red-500"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">첫 댓글을 작성해보세요!</p>
                      </div>
                    )}
                  </div>

                  <Separator className="dark:bg-gray-700" />

                  <div className="space-y-3">
                    <h4 className="text-base font-bold dark:text-gray-100">댓글 작성</h4>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-indigo-500 text-white text-sm">나</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <Textarea
                          value={newCommentContent}
                          onChange={(event) => setNewCommentContent(event.target.value)}
                          placeholder="댓글을 입력하세요..."
                          className="rounded-xl min-h-[80px] resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                        <div className="flex justify-end gap-2">
                          <Button onClick={handleSubmitComment} className="rounded-xl" disabled={!newCommentContent.trim()}>
                            <Send className="w-4 h-4 mr-2" />
                            등록
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isReportDialogOpen} onOpenChange={handleReportDialogChange}>
          <DialogContent className="max-w-xl rounded-3xl overflow-hidden dark:bg-gray-800/95 dark:border-gray-700">
            {reportTargetPost && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl">
                    <ShieldAlert className="w-6 h-6 text-amber-500" />
                    게시글 신고
                  </DialogTitle>
                  <DialogDescription className="leading-relaxed">
                    운영진 검토에 도움이 되도록 사유와 맥락을 남겨주세요. 신고는 중복으로 누적되지 않고 마지막 제출 내용 기준으로 관리됩니다.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <Card className="rounded-2xl border border-slate-200/80 bg-slate-50/90 shadow-none dark:border-gray-700 dark:bg-gray-900/60">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{reportTargetPost.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{reportTargetPost.content}</CardDescription>
                    </CardHeader>
                  </Card>

                  {reportStep === "submitted" && activeReport ? (
                    <Card className="rounded-2xl border border-emerald-200 bg-emerald-50/90 shadow-none dark:border-emerald-900/60 dark:bg-emerald-950/30">
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-300 mt-0.5" />
                          <div>
                            <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                              신고가 접수되었습니다
                            </p>
                            <p className="text-sm text-emerald-700/90 dark:text-emerald-300/80">
                              {formatTimeAgo(activeReport.submittedAt)}에 접수되었고, 같은 게시글은 중복 신고 대신 현재 내용으로 유지됩니다.
                            </p>
                          </div>
                        </div>

                        <div className="rounded-2xl bg-white/80 p-4 space-y-3 dark:bg-gray-900/60">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                              신고 사유
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                              {getReportReasonLabel(activeReport.reason)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                              추가 설명
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                              {activeReport.details || "추가 설명 없이 접수되었습니다."}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                          <Button variant="outline" className="rounded-xl" onClick={() => handleReportDialogChange(false)}>
                            닫기
                          </Button>
                          <Button className="rounded-xl" onClick={() => setReportStep("form")}>
                            내용 수정
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">신고 사유</Label>
                        <RadioGroup
                          value={reportForm.reason}
                          onValueChange={(value) =>
                            setReportForm((current) => ({
                              ...current,
                              reason: value as CommunityReportReasonId,
                            }))
                          }
                        >
                          {COMMUNITY_REPORT_REASONS.map((reason) => (
                            <label
                              key={reason.id}
                              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 transition hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30"
                            >
                              <RadioGroupItem value={reason.id} id={`report-reason-${reason.id}`} className="mt-1" />
                              <div className="space-y-1">
                                <div className="font-medium text-gray-900 dark:text-gray-100">{reason.label}</div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{reason.description}</p>
                              </div>
                            </label>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="report-details" className="text-base font-semibold">
                          추가 설명
                        </Label>
                        <Textarea
                          id="report-details"
                          value={reportForm.details}
                          onChange={(event) =>
                            setReportForm((current) => ({
                              ...current,
                              details: event.target.value,
                            }))
                          }
                          placeholder="운영진이 빠르게 판단할 수 있도록 문제 상황을 적어주세요."
                          className="min-h-[120px] rounded-2xl resize-none"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          링크, 노출된 개인정보, 반복 게시 여부 같은 맥락을 적으면 더 빨리 검토할 수 있습니다.
                        </p>
                      </div>

                      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
                        <Button variant="outline" className="rounded-xl" onClick={() => handleReportDialogChange(false)}>
                          취소
                        </Button>
                        <Button className="rounded-xl" onClick={handleSubmitReport}>
                          {activeReport ? "신고 내용 업데이트" : "신고 제출"}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
