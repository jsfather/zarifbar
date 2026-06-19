export interface User {
  id: number;
  username: string;
  role: 'admin' | 'writer';
  name: string;
  password?: string;
}

export interface Service {
  id: number;
  slug: string;
  name: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  icon_name: string;
  seo_title?: string;
  seo_description?: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  status: 'draft' | 'published';
  category_id?: number;
  category_name?: string;
  author_id?: number;
  author_name?: string;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Quote {
  id: number;
  full_name: string;
  phone: string;
  origin_city: string;
  dest_city: string;
  moving_date: string;
  service_type: string;
  has_elevator: 'yes' | 'no';
  floors: number;
  estimated_price: number;
  status: 'pending' | 'contacted' | 'completed';
  description?: string;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  message: string;
  status: 'unread' | 'read';
  created_at: string;
}

export interface Settings {
  site_title: string;
  site_description: string;
  phone: string;
  phone_alt: string;
  email: string;
  address: string;
  seo_keywords: string;
  instagram: string;
  telegram: string;
  working_hours: string;
  pricing_base_truck: string;
  pricing_per_worker: string;
  pricing_pack_service: string;
  packing_data?: string;
  areas_data?: string;
  storage_data?: string;
  transport_data?: string;
  workers_data?: string;
  logo_url?: string;
  float_contact_enabled?: string;
  float_whatsapp_phone?: string;
  float_call_phone?: string;
  back_to_top_enabled?: string;
  estimator_config?: string;
  about_text?: string;
  privacy_text?: string;
  contact_text?: string;
}

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  sort_order: number;
}
