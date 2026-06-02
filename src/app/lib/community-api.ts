import { apiRequest } from "./api";
import type { CommunityComment, CommunityPost } from "../data/community";
import type { Listing } from "../data/listings";
import type { ResidenceReview } from "../data/reviews";

type CommunityCategory = CommunityPost["category"];

interface PostListItem {
  post_id: string | number;
  title: string;
  category: CommunityCategory;
  author: string;
  like_count: number;
  comment_count: number;
  view_count: number;
  is_liked?: boolean;
  is_bookmarked?: boolean;
  is_author?: boolean;
  created_at: string;
}

interface PostListResponse {
  page: number;
  size: number;
  total: number;
  total_pages: number;
  posts: PostListItem[];
}

interface PostDetailResponse extends PostListItem {
  content: string;
  is_liked: boolean;
  is_bookmarked: boolean;
  updated_at?: string | null;
}

interface PostWriteResponse {
  post_id: string | number;
  title: string;
  content: string;
  category: CommunityCategory;
  author: string;
  is_author?: boolean;
  created_at: string;
}

interface CommentResponse {
  comment_id: number;
  post_id: string;
  author: string;
  content: string;
  like_count: number;
  created_at: string;
}

interface LikeResponse {
  message: string;
  like_count: number;
}

interface PropertyResponse {
  property_id: number;
  address: string;
  type: "전세" | "월세" | string;
  deposit_amount: number;
  monthly_rent: number;
  area?: number | null;
  description?: string | null;
  images: Array<{ image_url: string; order_index: number }>;
}

interface ReviewResponse {
  review_id: number;
  building_address: string;
  rating: number;
  content_preview?: string | null;
  tags: Array<{ tag: string }>;
}

function mapPost(item: PostListItem | PostDetailResponse | PostWriteResponse): CommunityPost {
  return {
    id: String(item.post_id),
    title: item.title,
    content: "content" in item ? item.content : "",
    author: item.author,
    category: item.category,
    likes: "like_count" in item ? item.like_count : 0,
    comments: "comment_count" in item ? item.comment_count : 0,
    views: "view_count" in item ? item.view_count : 0,
    timestamp: new Date(item.created_at),
    isLiked: "is_liked" in item ? item.is_liked : undefined,
    isBookmarked: "is_bookmarked" in item ? item.is_bookmarked : undefined,
    isAuthor: "is_author" in item ? item.is_author : undefined,
    tags: [],
  };
}

function mapComment(comment: CommentResponse): CommunityComment {
  return {
    id: String(comment.comment_id),
    postId: String(comment.post_id),
    author: comment.author,
    content: comment.content,
    timestamp: new Date(comment.created_at),
    likes: comment.like_count,
  };
}

function compareCommentsByTime(a: CommunityComment, b: CommunityComment) {
  const timeDelta = a.timestamp.getTime() - b.timestamp.getTime();
  if (timeDelta !== 0) {
    return timeDelta;
  }
  const idDelta = Number(a.id) - Number(b.id);
  return Number.isNaN(idDelta) ? a.id.localeCompare(b.id) : idDelta;
}

function formatMoney(value: number) {
  if (value >= 100000000) {
    const units = value / 100000000;
    return `${Number.isInteger(units) ? units : units.toFixed(1)}억`;
  }
  return `${Math.round(value / 10000).toLocaleString("ko-KR")}만`;
}

function inferListingType(type: string): Listing["type"] {
  if (type === "전세") return "jeonse";
  if (type === "월세") return "monthly";
  return "office-tel";
}

export function mapPropertyToListing(property: PropertyResponse): Listing {
  const listingType = inferListingType(property.type);
  return {
    id: `property-${property.property_id}`,
    title: property.description?.split("\n")[0] || `${property.address} ${property.type} 매물`,
    region: "seoul",
    district: "",
    neighborhood: property.address.split(" ").slice(0, 2).join(" ") || property.address,
    address: property.address,
    type: listingType,
    depositText: `${property.type === "전세" ? "전세" : "보증금"} ${formatMoney(property.deposit_amount)}`,
    monthlyRentText: property.monthly_rent ? `월세 ${formatMoney(property.monthly_rent)}` : "월세 없음",
    priceValue: property.deposit_amount,
    areaText: property.area ? `전용 ${property.area}m²` : "면적 미확인",
    floorText: "층수 미확인",
    commuteText: "교통 정보 미확인",
    landlordType: "등록 임대인",
    riskLevel: "caution",
    riskSummary: property.description || "백엔드 등록 매물입니다. 계약 전 권리관계와 보증보험 가능 여부를 확인하세요.",
    highlights: property.images.length > 0 ? ["사진 등록", "백엔드 매물"] : ["백엔드 매물"],
    cautionPoints: ["계약 직전 등기부등본 확인", "보증보험 가능 여부 확인"],
    recommendedActions: ["계약서 분석", "AI 상담", "거주 후기 확인"],
    recommendedPolicyCategory: listingType === "monthly" ? "support" : "guarantee",
    nearbyUniversities: [],
    tags: [property.type, "등록매물"],
  };
}

export function mapReviewToResidenceReview(review: ReviewResponse): ResidenceReview {
  const satisfaction: ResidenceReview["satisfaction"] = review.rating >= 4 ? "high" : review.rating >= 3 ? "medium" : "low";
  return {
    id: `backend-review-${review.review_id}`,
    title: `${review.building_address} 거주 후기`,
    author: "방가드 사용자",
    region: "seoul",
    district: "",
    neighborhood: review.building_address,
    housingType: "one-room",
    satisfaction,
    monthlyCostText: "비용 정보 미확인",
    stayDurationText: "거주 기간 미확인",
    summary: review.content_preview || "상세 후기를 확인해보세요.",
    pros: review.rating >= 4 ? ["만족도가 높은 후기입니다."] : [],
    cons: review.rating < 4 ? ["추가 확인이 필요한 후기입니다."] : [],
    tips: ["계약 전 같은 주소의 후기를 함께 확인하세요."],
    tags: review.tags.map((tag) => tag.tag),
    createdAt: new Date(),
  };
}

export async function getCommunityPosts(params: {
  category?: string;
  keyword?: string;
  sort?: "latest" | "popular";
  page?: number;
  size?: number;
} = {}) {
  const searchParams = new URLSearchParams();
  if (params.category && params.category !== "all") searchParams.set("category", params.category);
  if (params.keyword) searchParams.set("keyword", params.keyword);
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.size) searchParams.set("size", String(params.size));

  const query = searchParams.toString();
  const response = await apiRequest<PostListResponse>(`/community/posts${query ? `?${query}` : ""}`, {
    auth: true,
  });
  return response.posts.map(mapPost);
}

export async function getCommunityPost(postId: string) {
  const response = await apiRequest<PostDetailResponse>(`/community/posts/${postId}`, {
    auth: true,
  });
  return mapPost(response);
}

export async function createCommunityPost(payload: {
  title: string;
  content: string;
  category: CommunityCategory;
}) {
  const response = await apiRequest<PostWriteResponse>("/community/posts", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
  return mapPost(response);
}

export async function deleteCommunityPost(postId: string) {
  await apiRequest<{ message: string }>(`/community/posts/${postId}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function getPostComments(postId: string) {
  const response = await apiRequest<CommentResponse[]>(`/community/posts/${postId}/comments`);
  return response.map(mapComment).sort(compareCommentsByTime);
}

export async function createPostComment(postId: string, content: string) {
  const response = await apiRequest<CommentResponse>(`/community/posts/${postId}/comments`, {
    method: "POST",
    auth: true,
    body: JSON.stringify({ content }),
  });
  return mapComment(response);
}

export async function deletePostComment(commentId: string) {
  await apiRequest<{ message: string }>(`/community/comments/${commentId}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function likePost(postId: string) {
  return apiRequest<LikeResponse>(`/community/posts/${postId}/like`, {
    method: "POST",
    auth: true,
  });
}

export async function unlikePost(postId: string) {
  return apiRequest<LikeResponse>(`/community/posts/${postId}/like`, {
    method: "DELETE",
    auth: true,
  });
}

export async function bookmarkPost(postId: string) {
  return apiRequest<{ message: string }>(`/community/posts/${postId}/bookmark`, {
    method: "POST",
    auth: true,
  });
}

export async function unbookmarkPost(postId: string) {
  return apiRequest<{ message: string }>(`/community/posts/${postId}/bookmark`, {
    method: "DELETE",
    auth: true,
  });
}

export async function likeComment(commentId: string) {
  return apiRequest<LikeResponse>(`/community/comments/${commentId}/like`, {
    method: "POST",
    auth: true,
  });
}

export async function unlikeComment(commentId: string) {
  return apiRequest<LikeResponse>(`/community/comments/${commentId}/like`, {
    method: "DELETE",
    auth: true,
  });
}

export async function getProperties(type?: string) {
  const query = type ? `?type=${encodeURIComponent(type)}` : "";
  const response = await apiRequest<PropertyResponse[]>(`/community/properties${query}`);
  return response.map(mapPropertyToListing);
}

export async function getResidenceReviews(buildingAddress?: string) {
  const query = buildingAddress ? `?building_address=${encodeURIComponent(buildingAddress)}` : "";
  const response = await apiRequest<ReviewResponse[]>(`/community/reviews${query}`);
  return response.map(mapReviewToResidenceReview);
}
