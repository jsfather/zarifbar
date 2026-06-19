import React, { useEffect, useState } from 'react';
import { Post, Category } from '../types';
import { Calendar, User, Search, ArrowRight, BookOpen, Clock, Tag, ChevronLeft } from 'lucide-react';

interface BlogViewProps {
  onNavigate: (path: string) => void;
  selectedPostSlug?: string;
  onSelectPost: (slug: string) => void;
}

export default function BlogView({ onNavigate, selectedPostSlug, onSelectPost }: BlogViewProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Single post states
  const [singlePost, setSinglePost] = useState<Post | null>(null);
  const [singleLoading, setSingleLoading] = useState(false);

  // Load all posts
  useEffect(() => {
    if (!selectedPostSlug) {
      setLoading(true);
      Promise.all([
        fetch('/api/posts').then((res) => res.json()),
        fetch('/api/categories').then((res) => res.json()),
      ])
        .then(([postsData, catsData]) => {
          if (!postsData.error) setPosts(postsData);
          if (!catsData.error) setCategories(catsData);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [selectedPostSlug]);

  // Load individual post
  useEffect(() => {
    if (selectedPostSlug) {
      setSingleLoading(true);
      fetch(`/api/posts/${selectedPostSlug}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setSinglePost(data);
            // Apply meta SEO tags dynamically
            if (data.seo_title) document.title = data.seo_title;
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setSingleLoading(false));
    } else {
      setSinglePost(null);
    }
  }, [selectedPostSlug]);

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory ? post.category_id === selectedCategory : true;
    
    return matchesSearch && matchesCategory && post.status === 'published';
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Render Single Post Page
  if (selectedPostSlug) {
    if (singleLoading) {
      return (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!singlePost) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">
          مطلب مورد نظر یافت نشد.
          <button onClick={() => onSelectPost('')} className="block mx-auto mt-4 text-blue-600 font-bold underline">بازگشت به آرشیو وبلاگ</button>
        </div>
      );
    }

    return (
      <div className="pt-3 pb-12 md:pt-4 md:pb-16 max-w-4xl mx-auto px-4 leading-relaxed" dir="rtl">
        {/* Breadcrumb path */}
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-400 font-bold">
          <button onClick={() => onSelectPost('')} className="hover:text-blue-600">دانستنی‌های وبلاگ</button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 font-black">{singlePost.title}</span>
        </div>

        {/* Back button */}
        <button 
          onClick={() => onSelectPost('')}
          className="mb-8 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-black transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به لیست مطالب و وبلاگ
        </button>

        {/* Article Details */}
        <article className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm p-6 md:p-10 space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-bold">
            {singlePost.category_name && (
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {singlePost.category_name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(singlePost.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              نویسنده: {singlePost.author_name || 'ظریف بار'}
            </span>
          </div>

          <h1 className="text-xl md:text-3xl font-black text-slate-900 leading-tight">
            {singlePost.title}
          </h1>

          {singlePost.image_url && (
            <div className="rounded-2xl overflow-hidden max-h-[400px]">
              <img 
                src={singlePost.image_url} 
                alt={singlePost.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="border-t border-gray-100 my-6"></div>

          {/* Body Content */}
          <div className="text-sm md:text-base text-gray-700 leading-8 whitespace-pre-wrap text-justify">
            {singlePost.content}
          </div>
        </article>

        {/* SEO Note for client awareness */}
        {singlePost.seo_title && (
          <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-gray-100 text-xs text-slate-500 font-semibold space-y-1">
            <p>ℹ️ مشخصات سئو این صفحه:</p>
            <p>عنوان سئو: <span className="text-slate-700 font-bold">{singlePost.seo_title}</span></p>
            <p>توضیحات سئو: <span className="text-slate-700 font-medium">{singlePost.seo_description}</span></p>
          </div>
        )}
      </div>
    );
  }

  // Render Archive List Page
  return (
    <div className="pt-3 pb-12 md:pt-4 md:pb-16 max-w-7xl mx-auto px-4 md:px-8" dir="rtl">
      
      {/* Intro and Search block */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          دانستنی‌های اسباب‌کشی و باربری
        </h1>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">
          پیش از شروع اسباب‌کشی، با خواندن مقالات و آموزش‌های تخصصی ظریف بار، امنیت اثاثیه و سلامت کار خود را بالا ببرید.
        </p>

        {/* Search */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <input 
              type="text"
              placeholder="جستجو در مقالات وبلاگ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl py-3 pr-10 pl-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex gap-2 justify-center flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 text-xs font-black rounded-xl border transition-all ${
                selectedCategory === null 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              همه دسته‌ها
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-black rounded-xl border transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-medium">
              هیچ مطلبی یافت نشد که مطابق با جستجوی شما باشد.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article 
                  key={post.id}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow duration-300"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={post.image_url || 'https://images.unsplash.com/photo-1549401378-02484c349d21?auto=format&fit=crop&q=80&w=800'} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {post.category_name && (
                      <span className="absolute top-4 right-4 bg-blue-600 text-white font-black text-[10px] px-3 py-1.5 rounded-full shadow-md">
                        {post.category_name}
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(post.created_at)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {post.author_name || 'ظریف بار'}
                        </span>
                      </div>
                      
                      <h3 
                        onClick={() => onSelectPost(post.slug)}
                        className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 leading-snug"
                      >
                        {post.title}
                      </h3>
                      
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed text-justify">
                        {post.content}
                      </p>
                    </div>

                    <button
                      onClick={() => onSelectPost(post.slug)}
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-black transition-colors self-start"
                    >
                      ادامه مطلب و دیدگاه‌ها
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}
