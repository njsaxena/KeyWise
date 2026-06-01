export interface Listing {
  id: string;
  user_id: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  beds?: number | null;
  baths?: number | null;
  square_feet?: number | null;
  year_built?: number | null;
  seller_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeneratedContent {
  id: string;
  listing_id: string;
  content_type: string;
  content: string;
  created_at: string;
}
