import React, { useState, useEffect } from 'react';
import { User, Quote, ContactMessage, Settings, Service, Post, Category } from '../types';
import { apiFetch, setAuthSession, clearAuthSession, validateStoredSession } from '../lib/api';
import { DEFAULT_PACKING_DATA, DEFAULT_STORAGE_DATA, DEFAULT_TRANSPORT_DATA, DEFAULT_WORKERS_DATA } from './ServiceLanding';
import { DEFAULT_AREAS_DATA } from '../data/areas_defaults';
import ImageUploader from './ImageUploader';
import VideoUploader from './VideoUploader';
import PageEditor from './PageEditor';
import UserManagement from './UserManagement';
import { 
  Lock, KeyRound, LayoutDashboard, FileText, ClipboardList, Settings as SettingsIcon, 
  Layers, PhoneCall, HelpCircle, LogOut, CheckCircle2, RotateCw, Trash2, Edit2, 
  PlusCircle, Save, Check, Grid, Info, Shield, Bookmark, Tag, User as UserIcon,
  Calculator, Menu
} from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
  phone: string;
}

export default function AdminPanel({ onLogout, phone }: AdminPanelProps) {
  // Login State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quotes' | 'posts' | 'services' | 'settings' | 'contacts' | 'pages' | 'users'>(() => {
    const saved = localStorage.getItem('zarifbar_admin_active_tab');
    return (saved as any) || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('zarifbar_admin_active_tab', activeTab);
  }, [activeTab]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Database lists
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  // Loading indicator states
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Post form states (for adding/updating)
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postCategoryId, setPostCategoryId] = useState<number>(1);
  const [postSeoTitle, setPostSeoTitle] = useState('');
  const [postSeoDesc, setPostSeoDesc] = useState('');
  const [postStatus, setPostStatus] = useState<'draft' | 'published'>('published');
  const [showPostForm, setShowPostForm] = useState(false);

  // Service editing states
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceContent, setServiceContent] = useState('');
  const [serviceImg, setServiceImg] = useState('');
  const [serviceSeoTitle, setServiceSeoTitle] = useState('');
  const [serviceSeoDesc, setServiceSeoDesc] = useState('');
  const [serviceVideoUrl, setServiceVideoUrl] = useState('');

  // Category state
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');

  // Dynamics packing page states
  const [packingForm, setPackingForm] = useState<any>(null);
  const [packingSubTab, setPackingSubTab] = useState<'hero' | 'branches' | 'pillars' | 'materials' | 'topics' | 'outro'>('hero');

  // Dynamics storage page states
  const [storageForm, setStorageForm] = useState<any>(null);
  const [storageSubTab, setStorageSubTab] = useState<'hero' | 'branches' | 'pillars' | 'materials' | 'topics' | 'outro'>('hero');

  // Dynamics transport page states
  const [transportForm, setTransportForm] = useState<any>(null);
  const [transportSubTab, setTransportSubTab] = useState<'hero' | 'branches' | 'pillars' | 'materials' | 'topics' | 'outro'>('hero');

  // Dynamics workers page states
  const [workersForm, setWorkersForm] = useState<any>(null);
  const [workersSubTab, setWorkersSubTab] = useState<'hero' | 'branches' | 'pillars' | 'materials' | 'topics' | 'outro'>('hero');

  // Dynamics areas page states
  const [areasForm, setAreasForm] = useState<any>(null);
  const [areasActiveTab, setAreasActiveTab] = useState<'general' | 'north' | 'west' | 'east' | 'karaj'>('general');

  // Sync settings['packing_data'] with local packingForm
  useEffect(() => {
    if (settings.packing_data) {
      try {
        const parsed = JSON.parse(settings.packing_data);
        setPackingForm({
          ...DEFAULT_PACKING_DATA,
          ...parsed,
          branches: parsed.branches || DEFAULT_PACKING_DATA.branches,
          pillars: parsed.pillars || DEFAULT_PACKING_DATA.pillars,
          materials: parsed.materials || DEFAULT_PACKING_DATA.materials,
          topics: parsed.topics || DEFAULT_PACKING_DATA.topics,
        });
      } catch (e) {
        console.error('Error parsing packing_data', e);
        setPackingForm(DEFAULT_PACKING_DATA);
      }
    } else {
      setPackingForm(DEFAULT_PACKING_DATA);
    }
  }, [settings.packing_data]);

  // Sync settings['storage_data'] with local storageForm
  useEffect(() => {
    if (settings.storage_data) {
      try {
        const parsed = JSON.parse(settings.storage_data);
        setStorageForm({
          ...DEFAULT_STORAGE_DATA,
          ...parsed,
          branches: parsed.branches || DEFAULT_STORAGE_DATA.branches,
          pillars: parsed.pillars || DEFAULT_STORAGE_DATA.pillars,
          materials: parsed.materials || DEFAULT_STORAGE_DATA.materials,
          topics: parsed.topics || DEFAULT_STORAGE_DATA.topics,
        });
      } catch (e) {
        console.error('Error parsing storage_data', e);
        setStorageForm(DEFAULT_STORAGE_DATA);
      }
    } else {
      setStorageForm(DEFAULT_STORAGE_DATA);
    }
  }, [settings.storage_data]);

  // Sync settings['transport_data'] with local transportForm
  useEffect(() => {
    if (settings.transport_data) {
      try {
        const parsed = JSON.parse(settings.transport_data);
        setTransportForm({
          ...DEFAULT_TRANSPORT_DATA,
          ...parsed,
          branches: parsed.branches || DEFAULT_TRANSPORT_DATA.branches,
          pillars: parsed.pillars || DEFAULT_TRANSPORT_DATA.pillars,
          materials: parsed.materials || DEFAULT_TRANSPORT_DATA.materials,
          topics: parsed.topics || DEFAULT_TRANSPORT_DATA.topics,
        });
      } catch (e) {
        console.error('Error parsing transport_data', e);
        setTransportForm(DEFAULT_TRANSPORT_DATA);
      }
    } else {
      setTransportForm(DEFAULT_TRANSPORT_DATA);
    }
  }, [settings.transport_data]);

  // Sync settings['workers_data'] with local workersForm
  useEffect(() => {
    if (settings.workers_data) {
      try {
        const parsed = JSON.parse(settings.workers_data);
        setWorkersForm({
          ...DEFAULT_WORKERS_DATA,
          ...parsed,
          branches: parsed.branches || DEFAULT_WORKERS_DATA.branches,
          pillars: parsed.pillars || DEFAULT_WORKERS_DATA.pillars,
          materials: parsed.materials || DEFAULT_WORKERS_DATA.materials,
          topics: parsed.topics || DEFAULT_WORKERS_DATA.topics,
        });
      } catch (e) {
        console.error('Error parsing workers_data', e);
        setWorkersForm(DEFAULT_WORKERS_DATA);
      }
    } else {
      setWorkersForm(DEFAULT_WORKERS_DATA);
    }
  }, [settings.workers_data]);

  // Sync settings['areas_data'] with local areasForm
  useEffect(() => {
    if (settings.areas_data) {
      try {
        const parsed = JSON.parse(settings.areas_data);
        setAreasForm({
          ...DEFAULT_AREAS_DATA,
          ...parsed,
          regions: {
            north: parsed.regions?.north || DEFAULT_AREAS_DATA.regions.north,
            west: parsed.regions?.west || DEFAULT_AREAS_DATA.regions.west,
            east: parsed.regions?.east || DEFAULT_AREAS_DATA.regions.east,
            karaj: parsed.regions?.karaj || DEFAULT_AREAS_DATA.regions.karaj,
          }
        });
      } catch (e) {
        console.error('Error parsing areas_data', e);
        setAreasForm(DEFAULT_AREAS_DATA);
      }
    } else {
      setAreasForm(DEFAULT_AREAS_DATA);
    }
  }, [settings.areas_data]);

  // Handler to update a field in packingForm and save it to parent settings.packing_data
  const handlePackingFieldChange = (key: string, value: any) => {
    const updated = { ...(packingForm || DEFAULT_PACKING_DATA), [key]: value };
    setPackingForm(updated);
    setSettings(prev => ({ ...prev, packing_data: JSON.stringify(updated) }));
  };

  // Handler for nested arrays (branches, pillars, materials, topics)
  const handlePackingArrayChange = (arrayKey: 'branches' | 'pillars' | 'materials' | 'topics', index: number, field: string, value: any) => {
    const currentForm = packingForm || DEFAULT_PACKING_DATA;
    const arr = [...(currentForm[arrayKey] || DEFAULT_PACKING_DATA[arrayKey])];
    arr[index] = { ...arr[index], [field]: value };
    const updated = { ...currentForm, [arrayKey]: arr };
    setPackingForm(updated);
    setSettings(prev => ({ ...prev, packing_data: JSON.stringify(updated) }));
  };

  // Handler to update a field in storageForm and save it to parent settings.storage_data
  const handleStorageFieldChange = (key: string, value: any) => {
    const updated = { ...(storageForm || DEFAULT_STORAGE_DATA), [key]: value };
    setStorageForm(updated);
    setSettings(prev => ({ ...prev, storage_data: JSON.stringify(updated) }));
  };

  // Handler for nested arrays (branches, pillars, materials, topics) for storage
  const handleStorageArrayChange = (arrayKey: 'branches' | 'pillars' | 'materials' | 'topics', index: number, field: string, value: any) => {
    const currentForm = storageForm || DEFAULT_STORAGE_DATA;
    const arr = [...(currentForm[arrayKey] || DEFAULT_STORAGE_DATA[arrayKey])];
    arr[index] = { ...arr[index], [field]: value };
    const updated = { ...currentForm, [arrayKey]: arr };
    setStorageForm(updated);
    setSettings(prev => ({ ...prev, storage_data: JSON.stringify(updated) }));
  };

  // Handler to update a field in transportForm and save it to parent settings.transport_data
  const handleTransportFieldChange = (key: string, value: any) => {
    const updated = { ...(transportForm || DEFAULT_TRANSPORT_DATA), [key]: value };
    setTransportForm(updated);
    setSettings(prev => ({ ...prev, transport_data: JSON.stringify(updated) }));
  };

  // Handler for nested arrays (branches, pillars, materials, topics) for transport
  const handleTransportArrayChange = (arrayKey: 'branches' | 'pillars' | 'materials' | 'topics', index: number, field: string, value: any) => {
    const currentForm = transportForm || DEFAULT_TRANSPORT_DATA;
    const arr = [...(currentForm[arrayKey] || DEFAULT_TRANSPORT_DATA[arrayKey])];
    arr[index] = { ...arr[index], [field]: value };
    const updated = { ...currentForm, [arrayKey]: arr };
    setTransportForm(updated);
    setSettings(prev => ({ ...prev, transport_data: JSON.stringify(updated) }));
  };

  // Handler to update a field in workersForm and save it to parent settings.workers_data
  const handleWorkersFieldChange = (key: string, value: any) => {
    const updated = { ...(workersForm || DEFAULT_WORKERS_DATA), [key]: value };
    setWorkersForm(updated);
    setSettings(prev => ({ ...prev, workers_data: JSON.stringify(updated) }));
  };

  // Handler for nested arrays (branches, pillars, materials, topics) for workers
  const handleWorkersArrayChange = (arrayKey: 'branches' | 'pillars' | 'materials' | 'topics', index: number, field: string, value: any) => {
    const currentForm = workersForm || DEFAULT_WORKERS_DATA;
    const arr = [...(currentForm[arrayKey] || DEFAULT_WORKERS_DATA[arrayKey])];
    arr[index] = { ...arr[index], [field]: value };
    const updated = { ...currentForm, [arrayKey]: arr };
    setWorkersForm(updated);
    setSettings(prev => ({ ...prev, workers_data: JSON.stringify(updated) }));
  };

  // Handler to update top-level areas field (title, subtitle) and save back to settings
  const handleAreasFieldChange = (key: string, value: any) => {
    const updated = { ...(areasForm || DEFAULT_AREAS_DATA), [key]: value };
    setAreasForm(updated);
    setSettings(prev => ({ ...prev, areas_data: JSON.stringify(updated) }));
  };

  // Handler to update regional top-level field (lead, name)
  const handleAreasRegionFieldChange = (regionKey: 'north' | 'west' | 'east' | 'karaj', key: string, value: any) => {
    const currentForm = areasForm || DEFAULT_AREAS_DATA;
    const regionObj = currentForm.regions?.[regionKey] || DEFAULT_AREAS_DATA.regions[regionKey];
    const updatedRegion = { ...regionObj, [key]: value };
    const updated = { 
      ...currentForm, 
      regions: {
        ...(currentForm.regions || DEFAULT_AREAS_DATA.regions),
        [regionKey]: updatedRegion
      } 
    };
    setAreasForm(updated);
    setSettings(prev => ({ ...prev, areas_data: JSON.stringify(updated) }));
  };

  // Handler to update nested array of regional phones
  const handleAreasRegionPhoneChange = (regionKey: 'north' | 'west' | 'east' | 'karaj', index: number, field: string, value: any) => {
    const currentForm = areasForm || DEFAULT_AREAS_DATA;
    const regionObj = currentForm.regions?.[regionKey] || DEFAULT_AREAS_DATA.regions[regionKey];
    const phones = [...(regionObj.phones || [])];
    phones[index] = { ...phones[index], [field]: value };
    const updatedRegion = { ...regionObj, phones };
    const updated = { 
      ...currentForm, 
      regions: {
        ...(currentForm.regions || DEFAULT_AREAS_DATA.regions),
        [regionKey]: updatedRegion
      } 
    };
    setAreasForm(updated);
    setSettings(prev => ({ ...prev, areas_data: JSON.stringify(updated) }));
  };

  // Handler to update nested array of regional sections (title, text)
  const handleAreasRegionSectionChange = (regionKey: 'north' | 'west' | 'east' | 'karaj', index: number, field: string, value: any) => {
    const currentForm = areasForm || DEFAULT_AREAS_DATA;
    const regionObj = currentForm.regions?.[regionKey] || DEFAULT_AREAS_DATA.regions[regionKey];
    const sections = [...(regionObj.sections || [])];
    sections[index] = { ...sections[index], [field]: value };
    const updatedRegion = { ...regionObj, sections };
    const updated = { 
      ...currentForm, 
      regions: {
        ...(currentForm.regions || DEFAULT_AREAS_DATA.regions),
        [regionKey]: updatedRegion
      } 
    };
    setAreasForm(updated);
    setSettings(prev => ({ ...prev, areas_data: JSON.stringify(updated) }));
  };

  // Hydrate session from stored token
  useEffect(() => {
    validateStoredSession().then((user) => {
      if (user) setCurrentUser(user);
    });
  }, []);

  // Fetch admin items once logged in
  useEffect(() => {
    if (currentUser) {
      fetchAdminData();
    }
  }, [currentUser]);

  const fetchAdminData = () => {
    setLoading(true);
    const endpoints = [
      apiFetch('/api/quotes').then(res => res.json()),
      apiFetch('/api/contacts').then(res => res.json()),
      apiFetch('/api/posts').then(res => res.json()),
      apiFetch('/api/categories').then(res => res.json()),
      apiFetch('/api/services').then(res => res.json()),
      apiFetch('/api/settings').then(res => res.json())
    ];

    Promise.all(endpoints)
      .then(([quotesData, contactsData, postsData, catsData, servicesData, settingsData]) => {
        if (!quotesData.error) setQuotes(quotesData);
        if (!contactsData.error) setContacts(contactsData);
        if (!postsData.error) setPosts(postsData);
        if (!catsData.error) setCategories(catsData);
        if (!servicesData.error) setServices(servicesData);
        if (!settingsData.error) setSettings(settingsData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await apiFetch('/api/login', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        setAuthSession(data.token, data.user);
        setCurrentUser(data.user);
      } else {
        setLoginError(data.message || 'نام کاربری یا رمز عبور نامعتبر است.');
      }
    } catch (err) {
      setLoginError('خطا در برقراری ارتباط با سرویس ورود.');
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser(null);
    onLogout();
  };

  // Quotes management
  const updateQuoteStatus = async (id: number, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/quotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus as any } : q));
        showSuccessMessage('وضعیت درخواست با موفقیت بروزرسانی شد.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteQuote = async (id: number) => {
    if (!window.confirm('آیا از حذف این درخواست اسباب‌کشی اطمینان دارید؟')) return;
    try {
      const res = await apiFetch(`/api/quotes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setQuotes(quotes.filter(q => q.id !== id));
        showSuccessMessage('درخواست اسباب‌کشی با موفقیت حذف گردید.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Contacts management
  const updateContactStatus = async (id: number, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus as any } : c));
        showSuccessMessage('وضعیت پیام با موفقیت تغییر کرد.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteContact = async (id: number) => {
    if (!window.confirm('آیا از حذف این پیام اطمینان دارید؟')) return;
    try {
      const res = await apiFetch(`/api/contacts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setContacts(contacts.filter(c => c.id !== id));
        showSuccessMessage('پیام با موفقیت حذف شد.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Categories management
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;
    try {
      const res = await apiFetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName, slug: newCatSlug })
      });
      const data = await res.json();
      if (data.success) {
        setNewCatName('');
        setNewCatSlug('');
        showSuccessMessage('دسته بندی جدید افزوده شد.');
        // Refresh data
        apiFetch('/api/categories').then(r => r.json()).then(d => setCategories(d));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!window.confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) return;
    try {
      const res = await apiFetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCategories(categories.filter(c => c.id !== id));
        showSuccessMessage('دسته‌بندی با موفقیت حذف شد.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Blog posts management
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postSlug || !postContent) {
      alert('لطفاً عنوان، اسلاگ و کل متن مقاله را پر کنید.');
      return;
    }

    const payload = {
      title: postTitle,
      slug: postSlug,
      content: postContent,
      image_url: postImageUrl,
      category_id: postCategoryId,
      seo_title: postSeoTitle || postTitle,
      seo_description: postSeoDesc || postTitle,
      status: postStatus,
      author_id: currentUser?.id || 1
    };

    try {
      let res;
      if (editingPost) {
        res = await apiFetch(`/api/posts/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await apiFetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        showSuccessMessage(editingPost ? 'مقاله شما با موفقیت بروزرسانی شد.' : 'مقاله جدید با موفقیت منتشر گردید.');
        setShowPostForm(false);
        setEditingPost(null);
        clearPostForm();
        // Refresh
        apiFetch('/api/posts').then(r => r.json()).then(d => setPosts(d));
      } else {
        alert('خطایی رخ داد: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (id: number) => {
    if (!window.confirm('آیا از حذف این مقاله اطمینان قلبی دارید؟')) return;
    try {
      const res = await apiFetch(`/api/posts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.filter(p => p.id !== id));
        showSuccessMessage('مقاله با موفقیت حذف گردید.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const clearPostForm = () => {
    setPostTitle('');
    setPostSlug('');
    setPostContent('');
    setPostImageUrl('');
    setPostCategoryId(categories[0]?.id || 1);
    setPostSeoTitle('');
    setPostSeoDesc('');
    setPostStatus('published');
  };

  const startEditPost = (post: Post) => {
    setEditingPost(post);
    setPostTitle(post.title);
    setPostSlug(post.slug);
    setPostContent(post.content);
    setPostImageUrl(post.image_url || '');
    setPostCategoryId(post.category_id || 1);
    setPostSeoTitle(post.seo_title || '');
    setPostSeoDesc(post.seo_description || '');
    setPostStatus(post.status);
    setShowPostForm(true);
  };

  // Services management
  const startEditService = async (srv: Service) => {
    setEditingService(srv);
    setServiceName(srv.name);
    setServiceTitle(srv.title);
    setServiceDesc(srv.description);
    setServiceContent(srv.content);
    setServiceImg(srv.image_url);
    setServiceSeoTitle(srv.seo_title || '');
    setServiceSeoDesc(srv.seo_description || '');
    
    // Fetch video
    const res = await apiFetch(`/api/service_videos/${srv.slug}`);
    const videoData = res.ok ? await res.json() : {};
    setServiceVideoUrl(videoData.video_url || '');
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      // Save content
      const res = await apiFetch(`/api/services/${editingService.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: serviceName,
          title: serviceTitle,
          description: serviceDesc,
          content: serviceContent,
          image_url: serviceImg,
          icon_name: editingService.icon_name,
          seo_title: serviceSeoTitle,
          seo_description: serviceSeoDesc
        })
      });
      // Save video
      await apiFetch(`/api/service_videos/${editingService.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: serviceVideoUrl })
      });

      const data = await res.json();
      if (data.success) {
        showSuccessMessage('خدمت فرود تکی با موفقیت ویرایش شد.');
        setEditingService(null);
        // Refresh services
        apiFetch('/api/services').then(r => r.json()).then(d => setServices(d));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Settings save management
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();

      // Synchronize video URLs to service_videos table for all 4 services
      try {
        if (packingForm?.videoUrl !== undefined) {
          await apiFetch('/api/service_videos/packing', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ video_url: packingForm.videoUrl || '' })
          });
        }
        if (storageForm?.videoUrl !== undefined) {
          await apiFetch('/api/service_videos/storage', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ video_url: storageForm.videoUrl || '' })
          });
        }
        if (transportForm?.videoUrl !== undefined) {
          await apiFetch('/api/service_videos/transport', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ video_url: transportForm.videoUrl || '' })
          });
        }
        if (workersForm?.videoUrl !== undefined) {
          await apiFetch('/api/service_videos/workers', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ video_url: workersForm.videoUrl || '' })
          });
        }
      } catch (errSync) {
        console.error('Failed to sync service landing videos during settings save:', errSync);
      }

      if (data.success) {
        showSuccessMessage('تمامی تنظیمات وب‌سایت با موفقیت ذخیره گردید.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getParsedEstimatorConfig = () => {
    if (settings.estimator_config) {
      try {
        return JSON.parse(settings.estimator_config);
      } catch (e) {
        console.error("Failed to parse settings.estimator_config", e);
      }
    }
    // Deep copy of a structured default matching typical step forms
    return {
      notifications: {
        step_alert: "کاربر گرامی، قیمت نهایی شامل **بیمه مسئولیت بار تا سقف ۱۰۰ میلیون تومان رایگان** از طرف شرکت بزرگ ظریف بار صادر خواهد شد.",
        step_alert_step: 1,
        price_disclaimer: "محاسبه بر اساس نرخ صنف باربری بهران سال ۱۴۰۵",
        success_title: "درخواست استعلام شما با موفقیت ثبت شد!",
        success_message: "کد پیگیری شما صادر گردید. کارشناسان پشتیبان ظریف بار تا ۱۵ دقیقه آینده جهت هماهنگی نهایی تماس میگیرند."
      },
      steps: [
        {
          title: "نوع سرویس اصلی اسباب‌کشی",
          description: "خدمت لوکس مورد نظر خود را برای جابجایی انتخاب نمایید:",
          fields: [
            {
              name: "service_type",
              label: "نوع سرویس اسباب‌کشی",
              type: "select",
              required: true,
              options: [
                { value: "packing", label: "بسته‌بندی تخصصی اثاثیه + حمل بار اسباب‌کشی کامل", desc: "کارتن‌های ۵ لایه ضربه‌گیر، بابل رپ، چسب، کادر ورزیده فنی و راننده تخصصی" },
                { value: "workers", label: "کارگر خالی اسباب‌کشی (جهت تخلیه یا چیدمان بار)", desc: "سرویس ویژه چیدمان مجلل دکوراسیون و جابجایی بین طبقات بدون نیاز به کامیون" },
                { value: "transport", label: "کامیونت مسقف بزرگ پتودار (تنها ماشین باربری)", desc: "بدون کادر حمل بار - اعزام راننده تخصصی و ماشین مسقف پتودار ضد ضربه" },
                { value: "storage", label: "اجاره انبارهای موقت کانتینری و کانکس امن", desc: "انبار ایمن فلزی شخصی مجهز به نگهبانی دائم و کلید انحصاری دست مشتری" }
              ]
            }
          ]
        },
        {
          title: "مبدا و مقصد اسباب‌کشی",
          description: "محدوده مکانی جابجایی بار خود را ثبت نمایید:",
          fields: [
            {
              name: "origin_city",
              label: "محدوده مبدا حرکت اثاثیه",
              type: "select",
              required: true,
              options: [
                { value: "tehran_north", label: "شمال تهران (نیاوران، پاسداران، الهیه، تجریش)" },
                { value: "tehran_west", label: "غرب تهران (شهرک غرب، سعادت آباد، مرزداران، آریاشهر)" },
                { value: "tehran_center", label: "مرکز و شرق تهران (تهرانپارس، هفت حوض، سهروردی)" },
                { value: "alborz", label: "استان البرز و شهر کرج (عظیمیه، جهانشهر، مهرشهر)" },
                { value: "intercity", label: "ارسال اثاثیه به شهرستان‌ها (سراسر کشور از مبدا تهران)" }
              ]
            },
            {
              name: "dest_city",
              label: "محدوده مقصد نهایی تخلیه",
              type: "select",
              required: true,
              options: [
                { value: "tehran_north", label: "شمال تهران (نیاوران، پاسداران، الهیه، تجریش)" },
                { value: "tehran_west", label: "غرب تهران (شهرک غرب، سعادت آباد، مرزداران، آریاشهر)" },
                { value: "tehran_center", label: "مرکز و شرق تهران (تهرانپارس، هفت حوض، سهروردی)" },
                { value: "alborz", label: "استان البرز و شهر کرج (عظیمیه، جهانشهر، مهرشهر)" },
                { value: "intercity", label: "مقصد شهرستان است" }
              ]
            }
          ]
        },
        {
          title: "جزییات ملک و طبقات",
          description: "تعداد طبقات و وجود آسانسور در نرخ‌دهی پایه تاثیرگذار است:",
          fields: [
            {
              name: "floors",
              label: "تعداد طبقات مبدا (به همراه همکف)",
              type: "number-buttons",
              required: true,
              options: [
                { value: "1", label: "همکف / طبقه ۱" },
                { value: "2", label: "طبقه ۲" },
                { value: "3", label: "طبقه ۳" },
                { value: "4", label: "طبقه ۴" },
                { value: "5", label: "طبقه ۵ +" }
              ]
            },
            {
              name: "has_elevator",
              label: "آیا ملک مبدا مجهز به آسانسور بزرگ حمل بار است؟",
              type: "radio",
              required: true,
              options: [
                { value: "yes", label: "بله، آسانسور دارد" },
                { value: "no", label: "خیـر، فقط راه‌پله" }
              ]
            }
          ]
        },
        {
          title: "تاریخ و تماس نهایی",
          description: "مشخصات و زمان اعزام ناوگان را مشخص فرمایید:",
          fields: [
            {
              name: "moving_date",
              label: "تاریخ دقیق توافقی اسباب‌کشی",
              type: "date",
              required: true
            },
            {
              name: "full_name",
              label: "نام و نام خانوادگی کارفرما",
              type: "text",
              placeholder: "مثال: علی حسینی",
              required: true
            },
            {
              name: "phone",
              label: "شماره همراه متقاضی (جهت دریافت کد رهگیری)",
              type: "tel",
              placeholder: "09123456789",
              required: true
            }
          ]
        }
      ]
    };
  };

  const updateEstimatorConfig = (newConfig: any) => {
    setSettings(prev => ({ ...prev, estimator_config: JSON.stringify(newConfig) }));
  };

  const showSuccessMessage = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // LOGIN SCREEN
  if (!currentUser) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">ورود به پنل یکپارچه مدیریت ظریف بار</h1>
            <p className="text-xs text-slate-400">امکان تغییر در کل استایل، وبلاگ، خدمات و قیمت‌ها</p>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-xs py-3 px-4 rounded-xl font-bold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">نام کاربری ادمین یا نویسنده</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  placeholder="نام کاربری"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pr-10 pl-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <UserIcon className="w-4.5 h-4.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">رمز عبور اختصاصی</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  placeholder="کلمه عبور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pr-10 pl-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 text-left"
                  dir="ltr"
                />
                <Lock className="w-4.5 h-4.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-2xl py-3.5 px-6 font-black text-sm transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              ورود امن به داشبورد
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isWriter = currentUser.role === 'writer';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row" dir="rtl">
      
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="fixed top-6 left-6 z-[9999] bg-green-600 text-white py-3 px-6 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* MOBILE HEADER */}
      <header className="lg:hidden bg-slate-950 border-b border-slate-800 text-white px-5 py-4 sticky top-0 z-50 flex items-center justify-between shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/10">
            <Shield className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-sm font-black block leading-tight text-white">مدیریت هوشمند ظریف بار</span>
            <span className="text-[10px] text-amber-400 font-extrabold block leading-none pt-0.5">
              {currentUser.role === 'admin' ? 'کنترل پنل مدیر ارشد' : 'دسترسی همکار/نویسنده'}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 hover:text-amber-300 rounded-xl transition-all cursor-pointer shadow-inner"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* MOBILE SIDEBAR BACKDROP OVERLAY */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-all duration-300"
        />
      )}

      {/* ADMIN SIDEBAR */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 p-6 border-l border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:overflow-y-auto ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full lg:translate-x-0 lg:rtl:translate-x-0'
      }`}>
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black text-white block">پنل مدیریت ظریف بار</span>
              <span className="text-[10px] text-amber-500 font-bold block">
                {currentUser.role === 'admin' ? 'دسترسی ادمین کل' : 'دسترسی همکار/نویسنده'}
              </span>
            </div>
          </div>

          {/* User profile card */}
          <div className="bg-slate-950/60 rounded-2xl p-4 flex items-center gap-3 border border-slate-800/40">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400 capitalize">
              {currentUser.username[0]}
            </div>
            <div>
              <span className="block text-xs font-bold text-white">{currentUser.name}</span>
              <span className="block text-[10px] text-slate-400">{currentUser.username}@</span>
            </div>
          </div>

          {/* Navigator tabs */}
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-semibold text-right transition-colors ${
                activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950' : 'hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              پیشخوان مدیریت
            </button>

            {!isWriter && (
              <button
                onClick={() => { setActiveTab('quotes'); setSidebarOpen(false); }}
                className={`flex items-center justify-between py-3 px-4 rounded-xl text-xs font-semibold text-right transition-colors ${
                  activeTab === 'quotes' ? 'bg-amber-500 text-slate-950' : 'hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-3">
                  <ClipboardList className="w-4.5 h-4.5" />
                  درخواست‌های استعلام
                </span>
                {quotes.filter(q => q.status === 'pending').length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {quotes.filter(q => q.status === 'pending').length}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => { setActiveTab('posts'); setSidebarOpen(false); }}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-semibold text-right transition-colors ${
                activeTab === 'posts' ? 'bg-amber-500 text-slate-950' : 'hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4.5 h-4.5" />
              مدیریت وبلاگ و دانستنی‌ها
            </button>

            {!isWriter && (
              <button
                onClick={() => { setActiveTab('services'); setSidebarOpen(false); }}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-semibold text-right transition-colors ${
                  activeTab === 'services' ? 'bg-amber-500 text-slate-950' : 'hover:bg-slate-800'
                }`}
              >
                <Grid className="w-4.5 h-4.5" />
                مدیریت صفحات خدمات
              </button>
            )}

            {!isWriter && (
              <button
                onClick={() => { setActiveTab('contacts'); setSidebarOpen(false); }}
                className={`flex items-center justify-between py-3 px-4 rounded-xl text-xs font-semibold text-right transition-colors ${
                  activeTab === 'contacts' ? 'bg-amber-500 text-slate-950' : 'hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-3">
                  <PhoneCall className="w-4.5 h-4.5" />
                  پیام‌های ورودی
                </span>
                {contacts.filter(c => c.status === 'unread').length > 0 && (
                  <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {contacts.filter(c => c.status === 'unread').length}
                  </span>
                )}
              </button>
            )}

            {!isWriter && (
              <button
                onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-semibold text-right transition-colors ${
                  activeTab === 'settings' ? 'bg-amber-500 text-slate-950' : 'hover:bg-slate-800'
                }`}
              >
                <SettingsIcon className="w-4.5 h-4.5" />
                تنظیمات کلی وب‌سایت
              </button>
            )}
            
            {!isWriter && (
              <button
                onClick={() => { setActiveTab('pages'); setSidebarOpen(false); }}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-semibold text-right transition-colors ${
                  activeTab === 'pages' ? 'bg-amber-500 text-slate-950' : 'hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4.5 h-4.5" />
                مدیریت محتوای صفحات
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button
                onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-semibold text-right transition-colors ${
                  activeTab === 'users' ? 'bg-amber-500 text-slate-950' : 'hover:bg-slate-800'
                }`}
              >
                <UserIcon className="w-4.5 h-4.5" />
                مدیریت کاربران و دسترسی‌ها
              </button>
            )}
          </nav>
        </div>

        {/* Bottom utility */}
        <div className="pt-6 border-t border-slate-800">
          <button 
            onClick={() => { handleLogout(); setSidebarOpen(false); }}
            className="flex items-center justify-between w-full py-3 px-4 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
          >
            <span>خروج از پنل</span>
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </aside>

      {/* ADMIN MAIN CONTAINER */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto space-y-8">
        
        {/* Quick info toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">پنل زمرد</h2>
            <p className="text-xs text-slate-400 font-medium">طراحی و توسعه فارینو</p>
          </div>
          <button 
            onClick={fetchAdminData}
            className="flex items-center gap-2 bg-white text-slate-700 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
            بروزرسانی اطلاعات
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <>
            {/* 1. DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Stats widget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="block text-xs text-slate-400 font-bold">کل درخواست‌های اسباب‌کشی</span>
                      <strong className="block text-2xl font-black text-slate-900 mt-2 font-sans">{quotes.length}</strong>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="block text-xs text-slate-400 font-bold">پیام‌های جدید دریافتی</span>
                      <strong className="block text-2xl font-black text-slate-900 mt-2 font-sans">
                        {contacts.filter(c => c.status === 'unread').length}
                      </strong>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="block text-xs text-slate-400 font-bold">کل مقالات وبلاگ</span>
                      <strong className="block text-2xl font-black text-slate-900 mt-2 font-sans">{posts.length}</strong>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="block text-xs text-slate-400 font-bold">نوع دسترسی شما</span>
                      <strong className="block text-md font-bold text-slate-700 mt-3">
                        {currentUser.role === 'admin' ? 'مدیر ارشد' : 'نویسنده محتوا'}
                      </strong>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                  </div>

                </div>

                {/* Info and help guidance */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
                  <h3 className="text-base font-black text-slate-900">📌 راهنمای استفاده سریع از سیستم</h3>
                  <p className="text-xs text-slate-500 leading-relaxed text-justify">
                    اتوبار ظریف بار مجهز به یک موتور مدیریت محتوای قدرتمند است. تغییراتی که در فیلد تلفن‌ها، آدرس، کارتن‌های ضربه‌گیر، نرخ‌های محاسباتی یا محتوای وبلاگ ایجاد می‌کنید، بلافاصله در کل فرانت‌اِند وب‌سایت اعمال و بروزرسانی خواهند شد. 
                    از امنیت اسناد و سوابق تماس گرفته تا تصاویر، همگی بهینه بارگذاری می‌شوند.
                  </p>
                  
                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100/60 max-w-xl text-xs text-amber-900 space-y-2">
                    <span className="font-bold block">💡 نرخ‌های پایه محاسباتی محاسبه‌گر هزینه:</span>
                    <p>• کامیون اسباب‌کشی ۳ ساعته: <span className="font-bold">{Number(settings.pricing_base_truck).toLocaleString()} تومان</span></p>
                    <p>• دستمزد هر کارگر جابه‌جایی: <span className="font-bold">{Number(settings.pricing_per_worker).toLocaleString()} تومان</span></p>
                    <p>• خدمات ممتاز بسته‌بندی: <span className="font-bold">{Number(settings.pricing_pack_service).toLocaleString()} تومان</span></p>
                    <p className="text-[10px] text-amber-700">* قابل ویرایش از زبانه **تنظیمات کلی** برای مدیر ارشد.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. QUOTES TAB (Admin only) */}
            {activeTab === 'quotes' && !isWriter && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-black text-slate-900">لیست استعلام هزینه‌ها و رزرو‌های اسباب‌کشی</h3>
                  <span className="text-xs text-slate-400 font-bold">تعداد کل درخواست‌ها: {quotes.length}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right text-gray-500">
                    <thead className="bg-gray-50 text-slate-700 uppercase font-black border-b border-gray-100">
                      <tr>
                        <th className="py-3 px-4">مشتری / تلفن</th>
                        <th className="py-3 px-4">مسیر جابجایی</th>
                        <th className="py-3 px-4">تاریخ اعزام</th>
                        <th className="py-3 px-4">جزئیات ملک</th>
                        <th className="py-3 px-4">هزینه محاسباتی</th>
                        <th className="py-3 px-4">وضعیت</th>
                        <th className="py-3 px-4 text-center">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-bold text-slate-600">
                      {quotes.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50">
                          <td className="py-4 px-4">
                            <span className="block text-slate-900 font-black">{q.full_name}</span>
                            <a href={`tel:${q.phone}`} className="text-blue-500" dir="ltr">{q.phone}</a>
                          </td>
                          <td className="py-4 px-4">
                            {q.origin_city} ⬅️ {q.dest_city}
                            <span className="block text-[10px] text-slate-400 font-medium">نوع سرویس: {q.service_type}</span>
                          </td>
                          <td className="py-4 px-4 font-sans">{q.moving_date}</td>
                          <td className="py-4 px-4">
                            <span>طبقه {q.floors}</span>
                            <span className="block text-[10px] text-slate-400 font-medium">
                              آسانسور: {q.has_elevator === 'yes' ? 'دارد' : 'خیر'}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-sans text-emerald-600" dir="ltr">
                            {q.estimated_price ? q.estimated_price.toLocaleString() : 0} تومان
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={q.status}
                              onChange={(e) => updateQuoteStatus(q.id, e.target.value)}
                              className={`p-1.5 rounded-lg font-bold text-[10px] focus:outline-none ${
                                q.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                q.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}
                            >
                              <option value="pending">در انتظار تماس</option>
                              <option value="contacted">تماس گرفته شده</option>
                              <option value="completed">بررسی کامل ملغی</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button 
                              onClick={() => deleteQuote(q.id)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. POSTS TAB - WRITING / BLOG MANAGEMENT */}
            {activeTab === 'posts' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Add dynamic post form toggle */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-base font-black text-slate-900">بخش مدیریت و انتشار مقالات وبلاگ</h3>
                  <button
                    onClick={() => {
                      if (showPostForm) {
                        setShowPostForm(false);
                        setEditingPost(null);
                        clearPostForm();
                      } else {
                        clearPostForm();
                        setEditingPost(null);
                        setShowPostForm(true);
                      }
                    }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl text-xs font-black transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-4.5 h-4.5" />
                    {showPostForm ? 'بستن فرم ویرایش' : 'افزودن مقاله جدید برای سئو'}
                  </button>
                </div>

                {/* Blog Editor Form */}
                {showPostForm && (
                  <form onSubmit={handleSavePost} className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
                    <h4 className="text-sm font-black text-blue-600 border-b border-gray-100 pb-3">
                      {editingPost ? 'ویرایش آنلاین مطلب وبلاگ' : 'ایجاد و بارگذاری مقاله تخصصی جدید'}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">عنوان اصلی مقاله *</label>
                        <input 
                          type="text" 
                          required
                          value={postTitle}
                          onChange={(e) => {
                            setPostTitle(e.target.value);
                            // Generate clean auto-slug if needed
                            if (!editingPost) {
                              setPostSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').slice(0, 50));
                            }
                          }}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">اسلاگ ادرس انگلیسی یا فارسی (URL Slug) *</label>
                        <input 
                          type="text" 
                          required
                          value={postSlug}
                          onChange={(e) => setPostSlug(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">دسته‌بندی موضوعی</label>
                        <select
                          value={postCategoryId}
                          onChange={(e) => setPostCategoryId(Number(e.target.value))}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">آدرس تصویر شاخص (URL)</label>
                        <input 
                          type="text" 
                          value={postImageUrl}
                          onChange={(e) => setPostImageUrl(e.target.value)}
                          placeholder="تصویر پیش فرض بارگذاری می شود..."
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800"
                        />
                        <div className="mt-1.5">
                          <ImageUploader onUpload={(url) => setPostImageUrl(url)} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">وضعیت انتشار</label>
                        <select
                          value={postStatus}
                          onChange={(e) => setPostStatus(e.target.value as any)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800"
                        >
                          <option value="published">منتشره شده (نمایش روی سایت)</option>
                          <option value="draft">پیش‌نویس (مخفی در سایت)</option>
                        </select>
                      </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4">
                      <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-blue-600" />
                        تنظیمات سئو (Meta SEO settings):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 mb-2">عنوان سئو (موتور جستجو)</label>
                          <input 
                            type="text" 
                            value={postSeoTitle}
                            onChange={(e) => setPostSeoTitle(e.target.value)}
                            placeholder="عنوان اختصاصی گوگل..."
                            className="w-full bg-white border border-gray-100 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 mb-2">توضیحات دیسکریپشن گوگل</label>
                          <input 
                            type="text" 
                            value={postSeoDesc}
                            onChange={(e) => setPostSeoDesc(e.target.value)}
                            placeholder="توضیحات کوتاه سئو..."
                            className="w-full bg-white border border-gray-100 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">متن اصلی مقاله و دانستنی‌ها *</label>
                      <textarea 
                        rows={10}
                        required
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="در این قسمت شروع به نوشتن متن کامل بکنید..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button 
                        type="button"
                        onClick={() => {
                          setShowPostForm(false);
                          setEditingPost(null);
                        }}
                        className="py-2.5 px-5 bg-gray-150 border border-gray-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        لغو عملیات
                      </button>
                      
                      <button 
                        type="submit"
                        className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        ذخیره و انتشار نهایی
                      </button>
                    </div>

                  </form>
                )}

                {/* Categories Management Panel (Admin Only) */}
                {!isWriter && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Add Category Form */}
                    <form onSubmit={handleAddCategory} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm md:col-span-5 space-y-4">
                      <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <Bookmark className="w-5 h-5 text-amber-500" />
                        افزودن دسته‌بندی موضوعی جدید
                      </h4>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-2">نام فارسی دسته</label>
                        <input 
                          type="text" 
                          required
                          placeholder="مثال: بسته‌بندی مبلمان"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-2">اسلاگ آدرس انگلیسی</label>
                        <input 
                          type="text" 
                          required
                          placeholder="مثال: furniture-packing"
                          value={newCatSlug}
                          onChange={(e) => setNewCatSlug(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs text-left"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-850"
                      >
                        ایجاد دسته‌بندی موضوعی
                      </button>
                    </form>

                    {/* Existing Categories Table */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm md:col-span-7 space-y-4">
                      <h4 className="text-sm font-black text-slate-800">دسته‌بندی‌های موجود سیستم</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-right text-slate-500">
                          <thead>
                            <tr className="border-b border-gray-100 text-slate-700">
                              <th className="pb-2">شناسه</th>
                              <th className="pb-2">عنوان دسته</th>
                              <th className="pb-2">اسلاگ</th>
                              <th className="pb-2 text-center">حذف</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map((c) => (
                              <tr key={c.id} className="border-b border-gray-50">
                                <td className="py-2.5 font-sans">{c.id}</td>
                                <td className="py-2.5 font-bold text-slate-900">{c.name}</td>
                                <td className="py-2.5 font-sans" dir="ltr">{c.slug}</td>
                                <td className="py-2.5 text-center">
                                  <button 
                                    onClick={() => deleteCategory(c.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Existing Blog posts Table */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h4 className="text-sm font-black text-slate-800">کل مقالات نوشته شده</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-right text-slate-500">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="py-3 px-4">عنوان خبر</th>
                          <th className="py-3 px-4">دسته‌بندی</th>
                          <th className="py-3 px-4">نویسنده</th>
                          <th className="py-3 px-4">تاریخ انتشار</th>
                          <th className="py-3 px-4">وضعیت</th>
                          <th className="py-3 px-4 text-center">عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.map((p) => (
                          <tr key={p.id} className="border-b border-gray-100 hover:bg-slate-50">
                            <td className="py-3 px-4 font-black text-slate-900 max-w-xs truncate">{p.title}</td>
                            <td className="py-3 px-4 text-slate-600 font-bold">{p.category_name || '_'}</td>
                            <td className="py-3 px-4 text-slate-500 font-bold">{p.author_name || '_'}</td>
                            <td className="py-3 px-4 font-sans">{formatDate(p.created_at)}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                p.status === 'published' ? 'bg-green-150 text-green-800' : 'bg-gray-200 text-gray-700'
                              }`}>
                                {p.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center space-x-2">
                              <button 
                                onClick={() => startEditPost(p)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                              >
                                <Edit2 className="w-3.5 h-3.5 inline" />
                              </button>
                              <button 
                                onClick={() => deletePost(p.id)}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'pages' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-in fade-in duration-200">
                <PageEditor />
              </div>
            )}

            {/* 4. SERVICES LANDING PAGES MANAGERS (Admin only) */}
            {activeTab === 'services' && !isWriter && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div>
                    <h3 className="text-base font-black text-slate-900">مدیریت لندینگ خدمات (بسته‌بندی، کارگر خالی، وانت، انبار)</h3>
                    <p className="text-xs text-slate-400 mt-1">تغییر فوری متن، تصاویر شاخص و سئوی لندینگ تکی ۴ خدمت اصلی سایت</p>
                  </div>
                  <span className="text-xs text-blue-600 font-bold">بیمه دولتی رایگان تضمینی</span>
                </div>

                {editingService ? (
                  <form onSubmit={handleSaveService} className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
                    <h4 className="text-sm font-black text-blue-600">
                      ویرایش آنلاین فیلدهای مربوط به لندینگ: {editingService.name}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">نام خدمت</label>
                        <input 
                          type="text" 
                          required
                          value={serviceName}
                          onChange={(e) => setServiceName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-150 rounded-2xl py-3 px-4 text-xs font-bold text-slate-850"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">عنوان فرعی لندینگ (H1)</label>
                        <input 
                          type="text" 
                          required
                          value={serviceTitle}
                          onChange={(e) => setServiceTitle(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-150 rounded-2xl py-3 px-4 text-xs font-bold text-slate-850"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">تصویر شاخص خدمت (Unsplash / URL)</label>
                        <input 
                          type="text" 
                          required
                          value={serviceImg}
                          onChange={(e) => setServiceImg(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-150 rounded-2xl py-3 px-4 text-xs font-bold text-slate-850"
                        />
                        <div className="mt-1.5">
                          <ImageUploader onUpload={(url) => setServiceImg(url)} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">توضیحات کوتاه در صفحه اصلی (خلاصه کارت)</label>
                        <textarea 
                          required
                          value={serviceDesc}
                          onChange={(e) => setServiceDesc(e.target.value)}
                          rows={4}
                          className="w-full bg-gray-50 border border-gray-150 rounded-2xl py-3 px-4 text-xs font-medium text-slate-850"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 mt-2">
                      <label className="block text-xs font-black text-slate-800 mb-2">🎥 ویدیو اختصاصی لندینگ خدمت (لینک مستقیم یا آپلود فایل)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                        <div className="sm:col-span-2">
                          <input 
                            type="text" 
                            placeholder="آدرس اینترنتی ویدیو (مثلا http://.../video.mp4) یا از کلید آپلود استفاده کنید"
                            value={serviceVideoUrl || ''}
                            onChange={(e) => setServiceVideoUrl(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-xs font-medium text-slate-850"
                          />
                        </div>
                        <div>
                          <VideoUploader onUpload={(url) => setServiceVideoUrl(url)} buttonText="آپلود فایل ویدیویی لندینگ" />
                        </div>
                      </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 inline-block w-full">
                      <span className="text-xs font-black text-slate-700 block mb-2">💡 بهینه‌سازی سئو برای این لندینگ تخصصی:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold mb-1">SEO Title (برای گوگل)</label>
                          <input 
                            type="text" 
                            value={serviceSeoTitle}
                            onChange={(e) => setServiceSeoTitle(e.target.value)}
                            className="w-full bg-white border border-gray-150 rounded-xl py-2 px-3 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold mb-1">SEO Description</label>
                          <input 
                            type="text" 
                            value={serviceSeoDesc}
                            onChange={(e) => setServiceSeoDesc(e.target.value)}
                            className="w-full bg-white border border-gray-150 rounded-xl py-2 px-3 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">متن بدنه و توضیحات تکمیلی (فرمت متنی)</label>
                      <textarea 
                        rows={8}
                        required
                        value={serviceContent}
                        onChange={(e) => setServiceContent(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-150 rounded-2xl py-3 px-4 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <button 
                        type="button" 
                        onClick={() => setEditingService(null)}
                        className="py-2.5 px-5 bg-gray-200 hover:bg-gray-250 text-slate-700 rounded-xl text-xs font-bold"
                      >
                        انصراف
                      </button>
                      <button 
                        type="submit" 
                        className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md"
                      >
                        بروزرسانی لندینگ
                      </button>
                    </div>

                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {services.map((srv) => (
                      <div key={srv.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                          <strong className="text-sm font-black text-slate-900">{srv.name}</strong>
                          <span className="text-[10px] bg-slate-100 text-slate-500 py-1 px-2.5 rounded-full font-bold">
                            /{srv.slug}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{srv.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed text-justify">{srv.description}</p>
                        <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xs">
                          <span className="text-[10px] text-slate-400 font-bold">عکس شاخص: {srv.image_url ? 'دارد' : 'ندارد'}</span>
                          <button
                            onClick={() => startEditService(srv)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl cursor-pointer transition-all text-xs inline-flex items-center gap-1.5 shadow-sm shadow-amber-500/10"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            ویرایش کل صفحه و ویدیو
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* 5. CONTACTS MESSAGES TAB (Admin only) */}
            {activeTab === 'contacts' && !isWriter && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-black text-slate-900">لیست پیام‌ها و پیشنهادات کاربران</h3>
                  <span className="text-xs text-slate-400 font-bold">کل مکاتبات: {contacts.length}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right text-slate-500">
                    <thead className="bg-gray-50 text-slate-700 font-black uppercase border-b border-gray-100">
                      <tr>
                        <th className="py-3 px-4">مخاطب</th>
                        <th className="py-3 px-4">موبایل</th>
                        <th className="py-3 px-4">متن پیام کاربران</th>
                        <th className="py-3 px-4">تاریخ ارسال</th>
                        <th className="py-3 px-4">وضعیت بررسی</th>
                        <th className="py-3 px-4 text-center">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-slate-600 font-bold">
                      {contacts.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="py-4 px-4 text-slate-900 font-black">{c.name}</td>
                          <td className="py-4 px-4">
                            <a href={`tel:${c.phone}`} className="text-blue-500" dir="ltr">{c.phone}</a>
                          </td>
                          <td className="py-4 px-4 max-w-sm whitespace-pre-wrap">{c.message || '_'}</td>
                          <td className="py-4 px-4 font-sans">{formatDate(c.created_at)}</td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => updateContactStatus(c.id, c.status === 'unread' ? 'read' : 'unread')}
                              className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black cursor-pointer transition-colors ${
                                c.status === 'unread' ? 'bg-red-50 text-red-650 hover:bg-neutral-100' : 'bg-green-50 text-green-700 hover:bg-neutral-100'
                              }`}
                            >
                              {c.status === 'unread' ? '⚠️ نیاز به بررسی' : '✅ بررسی شده'}
                            </button>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button 
                              onClick={() => deleteContact(c.id)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. SETTINGS TAB (Admin only) */}
            {activeTab === 'settings' && !isWriter && (
              <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">تنظیمات اصلی و فاکتوردهی وب‌سایت</h3>
                    <p className="text-xs text-slate-400 mt-1">تغییر فوری شماره تلفن سراسری، کلمات کلیدی سئو و آدرس شعبات</p>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    ذخیره کلی کل تنظیمات
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">عنوان سایت برای تایتل اصلی</label>
                    <input 
                      type="text" 
                      required
                      value={settings.site_title || ''}
                      onChange={(e) => handleSettingChange('site_title', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-150 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">شماره تلفن خط ویژه ۴ رقمی</label>
                    <input 
                      type="text" 
                      required
                      value={settings.phone || ''}
                      onChange={(e) => handleSettingChange('phone', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-150 rounded-2xl py-3 px-4 text-xs font-bold text-slate-850 tracking-wider text-left"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">تلفن پشتیبانی یا موبایل فرعی</label>
                    <input 
                      type="text" 
                      required
                      value={settings.phone_alt || ''}
                      onChange={(e) => handleSettingChange('phone_alt', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-150 rounded-2xl py-3 px-4 text-xs font-bold text-slate-850 tracking-wider text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">پست الکترونیک (ایمیل)</label>
                    <input 
                      type="email" 
                      required
                      value={settings.email || ''}
                      onChange={(e) => handleSettingChange('email', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-150 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 text-left"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">ساعات پاسخگویی و فعالیت</label>
                    <input 
                      type="text" 
                      required
                      value={settings.working_hours || ''}
                      onChange={(e) => handleSettingChange('working_hours', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-150 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">کلمات کلیدی سئوی سایت (با ویرگول)</label>
                    <input 
                      type="text" 
                      required
                      value={settings.seo_keywords || ''}
                      onChange={(e) => handleSettingChange('seo_keywords', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-150 rounded-2xl py-3 px-4 text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>

                {/* Website Logo Section with Image Uploader */}
                <div className="bg-indigo-50/20 rounded-3xl p-6 border border-indigo-100/50 space-y-4">
                  <h4 className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                    ⚙️ لوگوی رسمی و برندینگ هدر وب‌سایت
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">آدرس اینترنتی فایل لوگو (Image URL)</label>
                      <input 
                        type="text" 
                        value={settings.logo_url || ''}
                        onChange={(e) => handleSettingChange('logo_url', e.target.value)}
                        placeholder="با آپلود زیر، مسیر خودکار ساخته می‌شود..."
                        className="w-full bg-white border border-gray-150 rounded-2xl py-3 px-4 text-xs font-medium text-slate-800 font-mono text-left"
                        dir="ltr"
                      />
                      <div className="mt-3">
                        <ImageUploader onUpload={(url) => handleSettingChange('logo_url', url)} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-2xl min-h-[140px] shadow-sm">
                      <span className="text-[10px] text-gray-400 font-bold mb-2">پیش‌نمایش زنده لوگوی هدر:</span>
                      {settings.logo_url ? (
                        <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center overflow-hidden border border-gray-100 p-1">
                          <img src={settings.logo_url} alt="لوگوی وب‌سایت" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md font-black text-xs">
                          <span>LOGO</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dynamic Floating Contacts and Back to Top Configuration */}
                <div className="bg-emerald-50/10 rounded-3xl p-6 border border-emerald-100/50 space-y-4">
                  <h4 className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    ⚙️ تنظیمات دکمه‌های شناور تعاملی (تماس سریع و برگشت به بالا)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-2">نمایش دکمه تماس سریع شناور (پنجره گفتگو و شماره‌گیری سریع)</label>
                      <select
                        value={settings.float_contact_enabled !== 'false' ? 'true' : 'false'}
                        onChange={(e) => handleSettingChange('float_contact_enabled', e.target.value)}
                        className="w-full bg-white border border-gray-150 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 font-sans"
                      >
                        <option value="true">فعال (نمایش دکمه‌های تماس مستقیم و چت واتس‌اپ)</option>
                        <option value="false">غیرفعال (عدم نمایش دکمه‌های تماس سریع)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-2">نمایش دکمه برگشت به بالا (پایین سمت چپ صفحه)</label>
                      <select
                        value={settings.back_to_top_enabled !== 'false' ? 'true' : 'false'}
                        onChange={(e) => handleSettingChange('back_to_top_enabled', e.target.value)}
                        className="w-full bg-white border border-gray-155 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 font-sans"
                      >
                        <option value="true">فعال (ظهور اتوماتیک هنگام اسکرول به پایین)</option>
                        <option value="false">غیرفعال (عدم نمایش دکمه برگشت به بالا)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-2">شماره تلفن مستقیم در دکمه شناور (خالی باشد = خط ویژه ۱۵۰۰)</label>
                      <input 
                        type="text" 
                        value={settings.float_call_phone || ''}
                        onChange={(e) => handleSettingChange('float_call_phone', e.target.value)}
                        placeholder="مثال: 1500 یا شماره همراه مستقل"
                        className="w-full bg-white border border-gray-150 rounded-2xl py-3 px-4 text-xs font-medium text-slate-800 font-mono text-left"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-2">شماره موبایل واتس‌اپ (مثال: 09121111111)</label>
                      <input 
                        type="text" 
                        value={settings.float_whatsapp_phone || ''}
                        onChange={(e) => handleSettingChange('float_whatsapp_phone', e.target.value)}
                        placeholder="با فرمت عددی یا لینک مستقیم"
                        className="w-full bg-white border border-gray-150 rounded-2xl py-3 px-4 text-xs font-medium text-slate-800 font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                {/* Estimate Prices Multipliers */}
                <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200/50 space-y-4">
                  <h4 className="text-sm font-black text-amber-800 flex items-center gap-1.5">
                    <Info className="w-5 h-5 text-amber-600" />
                    پارامترهای مالی جهت محاسبه پیش فاکتور تعرفه و دستمزدها اسباب‌کشی (تومان)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 mb-2">تعرفه پایه کامیون ۳ ساعته</label>
                      <input 
                        type="number"
                        required
                        value={settings.pricing_base_truck || ''}
                        onChange={(e) => handleSettingChange('pricing_base_truck', e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 mb-2">دستمزد هر کارگر برای ۳ ساعت</label>
                      <input 
                        type="number"
                        required
                        value={settings.pricing_per_worker || ''}
                        onChange={(e) => handleSettingChange('pricing_per_worker', e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 mb-2">هزینه پایه پک و کارتن ضربه‌گیر</label>
                      <input 
                        type="number"
                        required
                        value={settings.pricing_pack_service || ''}
                        onChange={(e) => handleSettingChange('pricing_pack_service', e.target.value)}
                        className="w-full bg-white border border-amber-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">آدرس شعب دفتر هماهنگی مرکزی</label>
                  <input 
                    type="text" 
                    required
                    value={settings.address || ''}
                    onChange={(e) => handleSettingChange('address', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-150 rounded-2xl py-3 px-4 text-xs font-semibold text-slate-850"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">دیسکریپشن خلاصه تایتل گوگل (SEO Meta Description)</label>
                  <textarea 
                    rows={4}
                    required
                    value={settings.site_description || ''}
                    onChange={(e) => handleSettingChange('site_description', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-150 rounded-2xl py-3 px-4 text-xs font-medium text-slate-800 leading-relaxed"
                  />
                </div>

                {/* DYNAMIC PACKING PAGE CONTENT EDITOR SECTION */}
                <div className="border-t border-gray-150 pt-8 mt-8 space-y-6">
                  <div className="bg-blue-50/40 rounded-[32px] p-6 md:p-8 border border-blue-100 space-y-6">
                    <div>
                      <h4 className="text-sm font-black text-blue-900 flex items-center gap-2">
                        <Grid className="w-5 h-5 text-blue-600" />
                        مدیریت محتوای فرود تکی صفحه بسته‌بندی ظریف بار
                      </h4>
                      <p className="text-[11px] text-blue-600 mt-1">
                        با زدن دکمه‌های زیر، متون و تصاویر و قیمت‌های مخصوص صفحه بسته‌بندی را ویرایش کنید، سپس روی «ذخیره کلی تنظیمات» در بالا کلیک کنید.
                      </p>
                    </div>

                    {/* Sub tabs selectors */}
                    <div className="flex flex-wrap gap-2 border-b border-blue-100/50 pb-4">
                      {[
                        { id: 'hero', name: 'هدر و عنوان اصلی' },
                        { id: 'branches', name: 'شعبه‌ها و شماره‌ها' },
                        { id: 'pillars', name: 'سه رکن طلایی اعتماد' },
                        { id: 'materials', name: 'تجهیزات و ملزومات کارتن' },
                        { id: 'topics', name: 'سوالات و مباحث تفصیلی' },
                        { id: 'outro', name: 'داستان برند و پاورقی' },
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setPackingSubTab(t.id as any)}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            packingSubTab === t.id 
                              ? 'bg-blue-600 text-white shadow-sm' 
                              : 'bg-white hover:bg-blue-50 text-blue-800 border border-blue-100'
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>

                    {/* Rendering inputs depending on active packingSubTab */}
                    {packingForm && (
                      <div className="space-y-6 bg-white rounded-2xl p-6 border border-blue-50 animate-in fade-in duration-200 text-right">
                        {packingSubTab === 'hero' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">نوار نشان بالا (Badge Text)</label>
                              <input
                                type="text"
                                value={packingForm.heroBadge || ''}
                                onChange={(e) => handlePackingFieldChange('heroBadge', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان اصلی صفحه (Hero Title)</label>
                              <input
                                type="text"
                                value={packingForm.heroTitle || ''}
                                onChange={(e) => handlePackingFieldChange('heroTitle', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">تلفن مستقیم رزرو (Hero Phone)</label>
                              <input
                                type="text"
                                value={packingForm.heroPhone || ''}
                                onChange={(e) => handlePackingFieldChange('heroPhone', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-extrabold text-slate-800 font-sans"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">تصویر پس‌زمینه هدر (Unsplash URL)</label>
                              <input
                                type="text"
                                value={packingForm.heroImage || ''}
                                onChange={(e) => handlePackingFieldChange('heroImage', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-medium text-slate-800"
                              />
                              <div className="mt-1.5">
                                <ImageUploader onUpload={(url) => handlePackingFieldChange('heroImage', url)} />
                              </div>
                            </div>
                            <div className="md:col-span-2 bg-blue-50/40 rounded-2xl p-4 border border-blue-100">
                              <label className="block text-xs font-black text-slate-800 mb-2">🎥 ویدیو هیرو لندینگ بسته‌بندی</label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                                <div className="sm:col-span-2">
                                  <input 
                                    type="text" 
                                    placeholder="آدرس اینترنتی ویدیو (مثلا http://.../video.mp4 یا آپارات)"
                                    value={packingForm.videoUrl || ''}
                                    onChange={(e) => handlePackingFieldChange('videoUrl', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 text-left"
                                    dir="ltr"
                                  />
                                </div>
                                <div>
                                  <VideoUploader onUpload={(url) => handlePackingFieldChange('videoUrl', url)} buttonText="آپلود ویدیو لندینگ" />
                                </div>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">توضیحات طولانی هدر (Hero Description)</label>
                              <textarea
                                rows={4}
                                value={packingForm.heroDesc || ''}
                                onChange={(e) => handlePackingFieldChange('heroDesc', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-medium text-slate-800 leading-relaxed"
                              />
                            </div>
                          </div>
                        )}

                        {packingSubTab === 'branches' && (
                          <div className="space-y-6">
                            <p className="text-[10px] text-gray-400 font-bold">بخش تماس‌های مستقیم شعب شمال، مرکز، غرب و شرق تهران:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {(packingForm.branches || []).map((br: any, i: number) => (
                                <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                                  <div className="font-black text-xs text-blue-900 border-b border-blue-50 pb-2">شعبه شماره {i + 1}</div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 mb-1">نام شعبه</label>
                                      <input
                                        type="text"
                                        value={br.name || ''}
                                        onChange={(e) => handlePackingArrayChange('branches', i, 'name', e.target.value)}
                                        className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 mb-1">شماره تلفن</label>
                                      <input
                                        type="text"
                                        value={br.phone || ''}
                                        onChange={(e) => handlePackingArrayChange('branches', i, 'phone', e.target.value)}
                                        className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-extrabold font-sans"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">مناطق تحت پوشش</label>
                                    <input
                                      type="text"
                                      value={br.desc || ''}
                                      onChange={(e) => handlePackingArrayChange('branches', i, 'desc', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-medium"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {packingSubTab === 'pillars' && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان کل بخش ارکان</label>
                                <input
                                  type="text"
                                  value={packingForm.pillarsTitle || ''}
                                  onChange={(e) => handlePackingFieldChange('pillarsTitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">متن توضیحات بخش ارکان</label>
                                <input
                                  type="text"
                                  value={packingForm.pillarsSubtitle || ''}
                                  onChange={(e) => handlePackingFieldChange('pillarsSubtitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                            </div>

                            <div className="border-t border-slate-50 pt-4 space-y-4">
                              <p className="text-[10px] text-gray-400 font-bold">ارکان سه گانه به صورت ستونی:</p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(packingForm.pillars || []).map((p: any, i: number) => (
                                  <div key={i} className="bg-orange-50/30 border border-orange-100 rounded-2xl p-4 space-y-3">
                                    <div className="font-extrabold text-xs text-orange-900">ستون {i + 1}</div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 mb-1">عنوان ستون</label>
                                      <input
                                        type="text"
                                        value={p.title || ''}
                                        onChange={(e) => handlePackingArrayChange('pillars', i, 'title', e.target.value)}
                                        className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 mb-1">شرح ستون</label>
                                      <textarea
                                        rows={3}
                                        value={p.desc || ''}
                                        onChange={(e) => handlePackingArrayChange('pillars', i, 'desc', e.target.value)}
                                        className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-medium"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {packingSubTab === 'materials' && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان بخش ملزومات کارتن و لوازم</label>
                                <input
                                  type="text"
                                  value={packingForm.materialsTitle || ''}
                                  onChange={(e) => handlePackingFieldChange('materialsTitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">تصویر شعار بخش کارتن</label>
                                <input
                                  type="text"
                                  value={packingForm.materialsSubtitle || ''}
                                  onChange={(e) => handlePackingFieldChange('materialsSubtitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                            </div>

                            <div className="border-t border-slate-50 pt-4 space-y-4">
                              <p className="text-[10px] text-gray-400 font-bold">ملزومات مختلف ۵ گانه بسته‌بندی:</p>
                              <div className="space-y-4">
                                {(packingForm.materials || []).map((m: any, i: number) => (
                                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-1 border-l border-slate-100 flex items-center justify-center font-black text-xs text-blue-900">
                                      آیتم {i + 1}
                                    </div>
                                    <div className="md:col-span-3 space-y-2">
                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">عنوان متریال</label>
                                        <input
                                          type="text"
                                          value={m.title || ''}
                                          onChange={(e) => handlePackingArrayChange('materials', i, 'title', e.target.value)}
                                          className="w-full bg-white border border-gray-150 rounded-lg py-1 px-2 text-xs font-bold"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">نشان برجسته (Badge)</label>
                                        <input
                                          type="text"
                                          value={m.badge || ''}
                                          onChange={(e) => handlePackingArrayChange('materials', i, 'badge', e.target.value)}
                                          className="w-full bg-white border border-gray-150 rounded-lg py-1 px-2 text-xs font-bold text-blue-700"
                                        />
                                      </div>
                                    </div>
                                    <div className="md:col-span-4">
                                      <label className="block text-[10px] font-bold text-slate-500 mb-1">شرح متریال بکار رفته در کار</label>
                                      <textarea
                                        rows={3}
                                        value={m.desc || ''}
                                        onChange={(e) => handlePackingArrayChange('materials', i, 'desc', e.target.value)}
                                        className="w-full bg-white border border-gray-150 rounded-lg py-1 px-2 text-xs font-semibold leading-relaxed"
                                      />
                                    </div>
                                    <div className="md:col-span-4">
                                      <label className="block text-[10px] font-bold text-slate-500 mb-1">آدرس اینترنتی تصویر متریال (Image URL)</label>
                                      <input
                                        type="text"
                                        value={m.image || ''}
                                        onChange={(e) => handlePackingArrayChange('materials', i, 'image', e.target.value)}
                                        className="w-full bg-white border border-gray-150 rounded-lg py-1 px-2 text-xs font-medium"
                                      />
                                      <div className="mt-1">
                                        <ImageUploader onUpload={(url) => handlePackingArrayChange('materials', i, 'image', url)} />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {packingSubTab === 'topics' && (
                          <div className="space-y-6">
                            <p className="text-[10px] text-gray-400 font-bold">بخش ۵ ردیف موضوعی تفصیلی و پرسش و پاسخ برای سئو موتورهای جستجو:</p>
                            <div className="space-y-4">
                              {(packingForm.topics || []).map((t: any, i: number) => (
                                <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                                  <div className="font-extrabold text-xs text-blue-900 border-b border-blue-50/50 pb-1">موضوع تفصیلی هماهنگی {i + 1}</div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">عنوان موضوع (مثال: نحوه بسته‌بندی ظریف بار)</label>
                                    <input
                                      type="text"
                                      value={t.title || ''}
                                      onChange={(e) => handlePackingArrayChange('topics', i, 'title', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-3 text-xs font-black"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">متن تفصیلی و بند پاراگراف</label>
                                    <textarea
                                      rows={4}
                                      value={t.desc || ''}
                                      onChange={(e) => handlePackingArrayChange('topics', i, 'desc', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-3 text-xs font-semibold leading-relaxed"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {packingSubTab === 'outro' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <h5 className="font-bold text-xs text-blue-900 mb-2 border-b border-blue-50 pb-2">داستان برند ظریف بار (Brand Trust Story)</h5>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان داستان برند</label>
                              <input
                                type="text"
                                value={packingForm.fullStoryTitle || ''}
                                onChange={(e) => handlePackingFieldChange('fullStoryTitle', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">آدرس عکس کارگری و داستان برند</label>
                              <input
                                type="text"
                                value={packingForm.fullStoryImage || ''}
                                onChange={(e) => handlePackingFieldChange('fullStoryImage', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                              <div className="mt-1.5">
                                <ImageUploader onUpload={(url) => handlePackingFieldChange('fullStoryImage', url)} />
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">شرح تفصیلی داستان برند</label>
                              <textarea
                                rows={4}
                                value={packingForm.fullStoryDesc || ''}
                                onChange={(e) => handlePackingFieldChange('fullStoryDesc', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-medium text-slate-800 leading-relaxed"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <h5 className="font-bold text-xs text-blue-900 mt-4 mb-2 border-b border-blue-50 pb-2">پاورقی و کادر سئوی پایین صفحه (Concluding Outro Alert)</h5>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان کادر نهایی</label>
                              <input
                                type="text"
                                value={packingForm.concludingTitle || ''}
                                onChange={(e) => handlePackingFieldChange('concludingTitle', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">شرح خلاصه نهایی</label>
                              <input
                                type="text"
                                value={packingForm.concludingDesc || ''}
                                onChange={(e) => handlePackingFieldChange('concludingDesc', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* DYNAMIC STORAGE PAGE CONTENT EDITOR SECTION */}
                <div className="border-t border-gray-150 pt-8 mt-8 space-y-6">
                  <div className="bg-violet-50/40 rounded-[32px] p-6 md:p-8 border border-violet-100 space-y-6">
                    <div>
                      <h4 className="text-sm font-black text-violet-900 flex items-center gap-2">
                        <Grid className="w-5 h-5 text-violet-600" />
                        مدیریت محتوای فرود تکی صفحه اجاره انبار ظریف بار
                      </h4>
                      <p className="text-[11px] text-violet-600 mt-1">
                        با زدن دکمه‌های زیر، متون و تصاویر و قیمت‌های مخصوص صفحه اجاره انبار را ویرایش کنید، سپس روی «ذخیره کلی تنظیمات» در بالا کلیک کنید.
                      </p>
                    </div>

                    {/* Sub tabs selectors */}
                    <div className="flex flex-wrap gap-2 border-b border-violet-100/50 pb-4">
                      {[
                        { id: 'hero', name: 'هدر و عنوان اصلی' },
                        { id: 'branches', name: 'شعبه‌ها و شماره‌ها' },
                        { id: 'pillars', name: 'سه رکن طلایی اعتماد' },
                        { id: 'materials', name: 'تجهیزات و ملزومات کانتینرها' },
                        { id: 'topics', name: 'سوالات و مباحث تفصیلی' },
                        { id: 'outro', name: 'داستان برند و پاورقی' },
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setStorageSubTab(t.id as any)}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            storageSubTab === t.id 
                              ? 'bg-violet-600 text-white shadow-sm' 
                              : 'bg-white hover:bg-violet-50 text-violet-800 border border-violet-100'
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>

                    {/* Rendering inputs depending on active storageSubTab */}
                    {storageForm && (
                      <div className="space-y-6 bg-white rounded-2xl p-6 border border-violet-50 animate-in fade-in duration-200 text-right">
                        {storageSubTab === 'hero' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">نوار نشان بالا (Badge Text)</label>
                              <input
                                type="text"
                                value={storageForm.heroBadge || ''}
                                onChange={(e) => handleStorageFieldChange('heroBadge', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان اصلی صفحه (Hero Title)</label>
                              <input
                                type="text"
                                value={storageForm.heroTitle || ''}
                                onChange={(e) => handleStorageFieldChange('heroTitle', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">تلفن مستقیم رزرو (Hero Phone)</label>
                              <input
                                type="text"
                                value={storageForm.heroPhone || ''}
                                onChange={(e) => handleStorageFieldChange('heroPhone', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-extrabold text-slate-800 font-sans"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">تصویر پس‌زمینه هدر (Unsplash URL)</label>
                              <input
                                type="text"
                                value={storageForm.heroImage || ''}
                                onChange={(e) => handleStorageFieldChange('heroImage', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-medium text-slate-800"
                              />
                              <div className="mt-1.5">
                                <ImageUploader onUpload={(url) => handleStorageFieldChange('heroImage', url)} />
                              </div>
                            </div>
                            <div className="md:col-span-2 bg-violet-50/40 rounded-2xl p-4 border border-violet-100">
                              <label className="block text-xs font-black text-slate-800 mb-2">🎥 ویدیو هیرو لندینگ انبارداری</label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                                <div className="sm:col-span-2">
                                  <input 
                                    type="text" 
                                    placeholder="آدرس اینترنتی ویدیو (مثلا http://.../video.mp4 یا آپارات)"
                                    value={storageForm.videoUrl || ''}
                                    onChange={(e) => handleStorageFieldChange('videoUrl', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 text-left"
                                    dir="ltr"
                                  />
                                </div>
                                <div>
                                  <VideoUploader onUpload={(url) => handleStorageFieldChange('videoUrl', url)} buttonText="آپلود ویدیو لندینگ" />
                                </div>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">توضیحات طولانی هدر (Hero Description)</label>
                              <textarea
                                rows={4}
                                value={storageForm.heroDesc || ''}
                                onChange={(e) => handleStorageFieldChange('heroDesc', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-medium text-slate-800 leading-relaxed"
                              />
                            </div>
                          </div>
                        )}

                        {storageSubTab === 'branches' && (
                          <div className="space-y-6">
                            <p className="text-[10px] text-gray-400 font-bold">بخش تماس‌های مستقیم شعب شمال، مرکز، غرب و شرق تهران:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {(storageForm.branches || []).map((br: any, i: number) => (
                                <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                                  <div className="font-black text-xs text-violet-900 border-b border-violet-50 pb-2">شعبه شماره {i + 1}</div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 mb-1">نام شعبه</label>
                                      <input
                                        type="text"
                                        value={br.name || ''}
                                        onChange={(e) => handleStorageArrayChange('branches', i, 'name', e.target.value)}
                                        className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 mb-1">شماره تلفن</label>
                                      <input
                                        type="text"
                                        value={br.phone || ''}
                                        onChange={(e) => handleStorageArrayChange('branches', i, 'phone', e.target.value)}
                                        className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-extrabold font-sans"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">مناطق تحت پوشش</label>
                                    <input
                                      type="text"
                                      value={br.desc || ''}
                                      onChange={(e) => handleStorageArrayChange('branches', i, 'desc', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-medium"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {storageSubTab === 'pillars' && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان کل بخش ارکان</label>
                                <input
                                  type="text"
                                  value={storageForm.pillarsTitle || ''}
                                  onChange={(e) => handleStorageFieldChange('pillarsTitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">متن توضیحات بخش ارکان</label>
                                <input
                                  type="text"
                                  value={storageForm.pillarsSubtitle || ''}
                                  onChange={(e) => handleStorageFieldChange('pillarsSubtitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                            </div>

                            <div className="border-t border-slate-50 pt-4 space-y-4">
                              <p className="text-[10px] text-gray-400 font-bold">ارکان سه گانه به صورت ستونی:</p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(storageForm.pillars || []).map((p: any, i: number) => (
                                  <div key={i} className="bg-orange-50/30 border border-orange-100 rounded-2xl p-4 space-y-3">
                                    <div className="font-extrabold text-xs text-orange-900">ستون {i + 1}</div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 mb-1">عنوان ستون</label>
                                      <input
                                        type="text"
                                        value={p.title || ''}
                                        onChange={(e) => handleStorageArrayChange('pillars', i, 'title', e.target.value)}
                                        className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-bold"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 mb-1">شرح ستون</label>
                                      <textarea
                                        rows={3}
                                        value={p.desc || ''}
                                        onChange={(e) => handleStorageArrayChange('pillars', i, 'desc', e.target.value)}
                                        className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-medium"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {storageSubTab === 'materials' && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان بخش مشخصات کانتینرها</label>
                                <input
                                  type="text"
                                  value={storageForm.materialsTitle || ''}
                                  onChange={(e) => handleStorageFieldChange('materialsTitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان فرعی بخش کانتینرها</label>
                                <input
                                  type="text"
                                  value={storageForm.materialsSubtitle || ''}
                                  onChange={(e) => handleStorageFieldChange('materialsSubtitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                            </div>

                            <div className="border-t border-slate-50 pt-4 space-y-4">
                              <p className="text-[10px] text-gray-400 font-bold">انواع انبار و کانتینرها:</p>
                              <div className="space-y-4">
                                {(storageForm.materials || []).map((m: any, i: number) => (
                                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-1 border-l border-slate-100 flex items-center justify-center font-black text-xs text-violet-900">
                                      آیتم {i + 1}
                                    </div>
                                    <div className="md:col-span-3 space-y-2">
                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">عنوان کاربری</label>
                                        <input
                                          type="text"
                                          value={m.title || ''}
                                          onChange={(e) => handleStorageArrayChange('materials', i, 'title', e.target.value)}
                                          className="w-full bg-white border border-gray-150 rounded-lg py-1 px-2 text-xs font-bold"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-1">نشان برجسته (Badge)</label>
                                        <input
                                          type="text"
                                          value={m.badge || ''}
                                          onChange={(e) => handleStorageArrayChange('materials', i, 'badge', e.target.value)}
                                          className="w-full bg-white border border-gray-150 rounded-lg py-1 px-2 text-xs font-bold text-violet-700"
                                        />
                                      </div>
                                    </div>
                                    <div className="md:col-span-4">
                                      <label className="block text-[10px] font-bold text-slate-500 mb-1">شرح مشخصات و مزایای فیزیکی</label>
                                      <textarea
                                        rows={3}
                                        value={m.desc || ''}
                                        onChange={(e) => handleStorageArrayChange('materials', i, 'desc', e.target.value)}
                                        className="w-full bg-white border border-gray-150 rounded-lg py-1 px-2 text-xs font-semibold leading-relaxed"
                                      />
                                    </div>
                                    <div className="md:col-span-4">
                                      <label className="block text-[10px] font-bold text-slate-500 mb-1">آدرس اینترنتی تصویر انبار (Image URL)</label>
                                      <input
                                        type="text"
                                        value={m.image || ''}
                                        onChange={(e) => handleStorageArrayChange('materials', i, 'image', e.target.value)}
                                        className="w-full bg-white border border-gray-150 rounded-lg py-1 px-2 text-xs font-medium"
                                      />
                                      <div className="mt-1">
                                        <ImageUploader onUpload={(url) => handleStorageArrayChange('materials', i, 'image', url)} />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {storageSubTab === 'topics' && (
                          <div className="space-y-6">
                            <p className="text-[10px] text-gray-400 font-bold">بخش ۵ ردیف موضوعی تفصیلی و پرسش و پاسخ برای سئو موتورهای جستجو:</p>
                            <div className="space-y-4">
                              {(storageForm.topics || []).map((t: any, i: number) => (
                                <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                                  <div className="font-extrabold text-xs text-violet-900 border-b border-violet-50/50 pb-1">موضوع تفصیلی هماهنگی {i + 1}</div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">عنوان موضوع (مثال: نحوه محاسبه هزینه انبار)</label>
                                    <input
                                      type="text"
                                      value={t.title || ''}
                                      onChange={(e) => handleStorageArrayChange('topics', i, 'title', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-3 text-xs font-black"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">متن تفصیلی و بند پاراگراف</label>
                                    <textarea
                                      rows={4}
                                      value={t.desc || ''}
                                      onChange={(e) => handleStorageArrayChange('topics', i, 'desc', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-3 text-xs font-semibold leading-relaxed"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {storageSubTab === 'outro' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <h5 className="font-bold text-xs text-violet-900 mb-2 border-b border-violet-50 pb-2">رهن و اجاره انبار تهران (Brand Trust Story)</h5>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان بخش رهن انبار</label>
                              <input
                                type="text"
                                value={storageForm.fullStoryTitle || ''}
                                onChange={(e) => handleStorageFieldChange('fullStoryTitle', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">آدرس عکس بخش داستان برند انبار</label>
                              <input
                                type="text"
                                value={storageForm.fullStoryImage || ''}
                                onChange={(e) => handleStorageFieldChange('fullStoryImage', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                              <div className="mt-1.5">
                                <ImageUploader onUpload={(url) => handleStorageFieldChange('fullStoryImage', url)} />
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">شرح تفصیلی رهن و اجاره انبار</label>
                              <textarea
                                rows={4}
                                value={storageForm.fullStoryDesc || ''}
                                onChange={(e) => handleStorageFieldChange('fullStoryDesc', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-medium text-slate-800 leading-relaxed"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <h5 className="font-bold text-xs text-violet-900 mt-4 mb-2 border-b border-violet-50 pb-2">پاورقی و کادر سئوی پایین صفحه (Concluding Outro Alert)</h5>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان کادر نهایی</label>
                              <input
                                type="text"
                                value={storageForm.concludingTitle || ''}
                                onChange={(e) => handleStorageFieldChange('concludingTitle', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">شرح خلاصه نهایی</label>
                              <input
                                type="text"
                                value={storageForm.concludingDesc || ''}
                                onChange={(e) => handleStorageFieldChange('concludingDesc', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* DYNAMIC TRANSPORT PAGE CONTENT EDITOR SECTION */}
                <div className="border-t border-gray-150 pt-8 mt-8 space-y-6">
                  <div className="bg-indigo-50/40 rounded-[32px] p-6 md:p-8 border border-indigo-100 space-y-6">
                    <div>
                      <h4 className="text-sm font-black text-indigo-900 flex items-center gap-2">
                        <Grid className="w-5 h-5 text-indigo-600" />
                        مدیریت محتوای فرود تکی صفحه وانت بار و نیسان بار ظریف بار
                      </h4>
                      <p className="text-[11px] text-indigo-600 mt-1">
                        با زدن دکمه‌های زیر، متون و تصاویر و قیمت‌های مخصوص صفحه وانت و نیسان بار را ویرایش کنید، سپس روی «ذخیره کلی تنظیمات» در بالا کلیک کنید.
                      </p>
                    </div>

                    {/* Sub tabs selectors */}
                    <div className="flex flex-wrap gap-2 border-b border-indigo-100/50 pb-4">
                      {[
                        { id: 'hero', name: 'هدر و عنوان اصلی' },
                        { id: 'branches', name: 'شعبه‌ها و شماره‌ها' },
                        { id: 'pillars', name: 'سه رکن طلایی اعتماد' },
                        { id: 'materials', name: 'تجهیزات و ملزومات کارتن' },
                        { id: 'topics', name: 'سوالات و مباحث تفصیلی' },
                        { id: 'outro', name: 'داستان برند و پاورقی' },
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTransportSubTab(t.id as any)}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            transportSubTab === t.id 
                              ? 'bg-indigo-600 text-white shadow-sm' 
                              : 'bg-white hover:bg-indigo-50 text-indigo-850 border border-indigo-100'
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>

                    {/* Rendering inputs depending on active transportSubTab */}
                    {transportForm && (
                      <div className="space-y-6 bg-white rounded-2xl p-6 border border-indigo-50 animate-in fade-in duration-200 text-right font-semibold">
                        {transportSubTab === 'hero' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">نوار نشان بالا (Badge Text)</label>
                              <input
                                type="text"
                                value={transportForm.heroBadge || ''}
                                onChange={(e) => handleTransportFieldChange('heroBadge', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان اصلی صفحه (Hero Title)</label>
                              <input
                                type="text"
                                value={transportForm.heroTitle || ''}
                                onChange={(e) => handleTransportFieldChange('heroTitle', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">شماره تلفن هدر (Hero Phone)</label>
                              <input
                                type="text"
                                value={transportForm.heroPhone || ''}
                                onChange={(e) => handleTransportFieldChange('heroPhone', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 font-sans"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">آدرس اینترنتی تصویر پس‌زمینه (Hero Background-Image URL)</label>
                              <input
                                type="text"
                                value={transportForm.heroImage || ''}
                                onChange={(e) => handleTransportFieldChange('heroImage', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 font-mono"
                                dir="ltr"
                              />
                              <div className="mt-1.5">
                                <ImageUploader onUpload={(url) => handleTransportFieldChange('heroImage', url)} />
                              </div>
                            </div>
                            <div className="md:col-span-2 bg-indigo-50/40 rounded-2xl p-4 border border-indigo-100">
                              <label className="block text-xs font-black text-slate-800 mb-2">🎥 ویدیو هیرو لندینگ وانت بار و نیسان بار</label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                                <div className="sm:col-span-2">
                                  <input 
                                    type="text" 
                                    placeholder="آدرس اینترنتی ویدیو (مثلا http://.../video.mp4 یا آپارات)"
                                    value={transportForm.videoUrl || ''}
                                    onChange={(e) => handleTransportFieldChange('videoUrl', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 text-left"
                                    dir="ltr"
                                  />
                                </div>
                                <div>
                                  <VideoUploader onUpload={(url) => handleTransportFieldChange('videoUrl', url)} buttonText="آپلود ویدیو لندینگ" />
                                </div>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">توضیح هدر (Hero Description)</label>
                              <textarea
                                rows={3}
                                value={transportForm.heroDesc || ''}
                                onChange={(e) => handleTransportFieldChange('heroDesc', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-medium text-slate-800"
                              />
                            </div>
                          </div>
                        )}

                        {transportSubTab === 'branches' && (
                          <div className="space-y-6">
                            <div className="border-b border-gray-100 pb-2">
                              <h5 className="font-bold text-xs text-indigo-900 mb-1">شماره‌های ۴ شعبه اصلی در لندینگ وانت بار</h5>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              {(transportForm.branches || []).map((br: any, i: number) => (
                                <div key={i} className="p-4 rounded-xl border border-gray-100 bg-slate-50 space-y-4">
                                  <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded">شعبه {i + 1}</span>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">نام منطقه (مثال: شعبه شمال تهران)</label>
                                    <input
                                      type="text"
                                      value={br.name || ''}
                                      onChange={(e) => handleTransportArrayChange('branches', i, 'name', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1 px-2 text-xs font-bold text-slate-800"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">شماره تماس مستقیم</label>
                                    <input
                                      type="text"
                                      value={br.phone || ''}
                                      onChange={(e) => handleTransportArrayChange('branches', i, 'phone', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1 px-2 text-xs font-bold text-slate-800 font-sans"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {transportSubTab === 'pillars' && (
                          <div className="space-y-6">
                            <div>
                              <h5 className="font-bold text-xs text-indigo-900 mb-4 border-b border-indigo-50 pb-2">سه رکن اساسی خدمات وانت نیسان بار</h5>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان سه رکن</label>
                                <input
                                  type="text"
                                  value={transportForm.pillarsTitle || ''}
                                  onChange={(e) => handleTransportFieldChange('pillarsTitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">توضیح فرعی سه رکن</label>
                                <input
                                  type="text"
                                  value={transportForm.pillarsSubtitle || ''}
                                  onChange={(e) => handleTransportFieldChange('pillarsSubtitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-50">
                              {(transportForm.pillars || []).map((p: any, i: number) => (
                                <div key={i} className="p-4 rounded-xl border border-gray-100 bg-slate-50 space-y-4">
                                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">رکن {i + 1}</span>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">عنوان اصلی رکن</label>
                                    <input
                                      type="text"
                                      value={p.title || ''}
                                      onChange={(e) => handleTransportArrayChange('pillars', i, 'title', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2 text-xs font-bold text-slate-800"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">شرح کوتاه رکن</label>
                                    <textarea
                                      rows={3}
                                      value={p.desc || ''}
                                      onChange={(e) => handleTransportArrayChange('pillars', i, 'desc', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2 text-xs font-medium text-slate-800"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {transportSubTab === 'materials' && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان بخش انواع خودروهای حمل و نقل</label>
                                <input
                                  type="text"
                                  value={transportForm.materialsTitle || ''}
                                  onChange={(e) => handleTransportFieldChange('materialsTitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">توضیحات کوتاه بخش خودروها</label>
                                <input
                                  type="text"
                                  value={transportForm.materialsSubtitle || ''}
                                  onChange={(e) => handleTransportFieldChange('materialsSubtitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                            </div>
                            <div className="space-y-4">
                              <p className="text-[10px] text-gray-400 font-bold">انواع روشها و وسایل نقلیه خودرویی:</p>
                              {(transportForm.materials || []).map((m: any, i: number) => (
                                <div key={i} className="p-4 rounded-2xl border border-gray-100 bg-slate-50 grid grid-cols-1 md:grid-cols-12 gap-4">
                                  <div className="md:col-span-1 flex flex-col justify-center">
                                    <span className="inline-block text-center py-1 bg-amber-100 text-amber-800 text-[10px] font-black rounded-lg">خودرو {i + 1}</span>
                                  </div>
                                  <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">نوار وضعیت بالا (Badge)</label>
                                    <input
                                      type="text"
                                      value={m.badge || ''}
                                      onChange={(e) => handleTransportArrayChange('materials', i, 'badge', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2 text-xs font-bold text-slate-850"
                                    />
                                  </div>
                                  <div className="md:col-span-3">
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">تایتل / عنوان خودرو</label>
                                    <input
                                      type="text"
                                      value={m.title || ''}
                                      onChange={(e) => handleTransportArrayChange('materials', i, 'title', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2 text-xs font-bold text-slate-850"
                                    />
                                  </div>
                                  <div className="md:col-span-6">
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">توضیح مشخصات فنی و شرایط خودرو</label>
                                    <input
                                      type="text"
                                      value={m.desc || ''}
                                      onChange={(e) => handleTransportArrayChange('materials', i, 'desc', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2 text-xs font-medium text-slate-800"
                                    />
                                  </div>
                                  <div className="md:col-span-12">
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">آدرس اینترنتی تصویر نقلیه (Image URL)</label>
                                    <input
                                      type="text"
                                      value={m.image || ''}
                                      onChange={(e) => handleTransportArrayChange('materials', i, 'image', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2 text-xs font-semibold text-slate-800 font-mono text-left"
                                      dir="ltr"
                                    />
                                    <div className="mt-1">
                                      <ImageUploader onUpload={(url) => handleTransportArrayChange('materials', i, 'image', url)} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {transportSubTab === 'topics' && (
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-bold text-xs text-indigo-900 border-b border-indigo-50 pb-2">فهرست ۵ مبحث علمی-آموزشی فرود وانت بار و نیسان بار</h5>
                            </div>
                            {(transportForm.topics || []).map((t: any, i: number) => (
                              <div key={i} className="p-4 rounded-xl border border-gray-100 bg-slate-50 space-y-4">
                                <span className="inline-block px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded">مبحث {i + 1}</span>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                  <div className="md:col-span-4">
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">عنوان موضوع (مثال: نحوه محاسبه هزینه حمل نیسان)</label>
                                    <input
                                      type="text"
                                      value={t.title || ''}
                                      onChange={(e) => handleTransportArrayChange('topics', i, 'title', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2 text-xs font-bold text-slate-850"
                                    />
                                  </div>
                                  <div className="md:col-span-8">
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">متن تفصیلی و سوابق موضوع</label>
                                    <textarea
                                      rows={3}
                                      value={t.desc || ''}
                                      onChange={(e) => handleTransportArrayChange('topics', i, 'desc', e.target.value)}
                                      className="w-full bg-white border border-gray-150 rounded-lg py-1.5 px-2 text-xs font-semibold text-slate-800"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {transportSubTab === 'outro' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                              <h5 className="font-bold text-xs text-indigo-900 mb-2 border-b border-indigo-50 pb-2">وانت بار و نیسان بار تهران (Brand Trust Story)</h5>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان بخش حمل و نقل</label>
                              <input
                                type="text"
                                value={transportForm.fullStoryTitle || ''}
                                onChange={(e) => handleTransportFieldChange('fullStoryTitle', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">آدرس عکس بخش داستان برند وانت بار</label>
                              <input
                                type="text"
                                value={transportForm.fullStoryImage || ''}
                                onChange={(e) => handleTransportFieldChange('fullStoryImage', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 font-mono text-left"
                                dir="ltr"
                              />
                              <div className="mt-1.5">
                                <ImageUploader onUpload={(url) => handleTransportFieldChange('fullStoryImage', url)} />
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">شرح تفصیلی حمل وانت و نیسان</label>
                              <textarea
                                rows={4}
                                value={transportForm.fullStoryDesc || ''}
                                onChange={(e) => handleTransportFieldChange('fullStoryDesc', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-medium text-slate-800"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <h5 className="font-bold text-xs text-indigo-900 mt-4 mb-2 border-b border-indigo-50 pb-2">پاورقی و کادر سئوی پایین صفحه (Concluding Outro Alert)</h5>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان کادر نهایی</label>
                              <input
                                type="text"
                                value={transportForm.concludingTitle || ''}
                                onChange={(e) => handleTransportFieldChange('concludingTitle', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">شرح خلاصه نهایی</label>
                              <input
                                type="text"
                                value={transportForm.concludingDesc || ''}
                                onChange={(e) => handleTransportFieldChange('concludingDesc', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* DYNAMIC WORKERS PAGE CONTENT EDITOR SECTION */}
                <div className="border-t border-gray-150 pt-8 mt-8 space-y-6">
                  <div className="bg-blue-50/40 rounded-[32px] p-6 md:p-8 border border-blue-100 space-y-6">
                    <div>
                      <h4 className="text-sm font-black text-blue-900 flex items-center gap-2">
                        <Grid className="w-5 h-5 text-blue-600" />
                        مدیریت محتوای فرود تکی صفحه کارگر خالی اسباب کشی ظریف بار
                      </h4>
                      <p className="text-[11px] text-blue-600 mt-1">
                        با زدن دکمه‌های زیر، متون و تصاویر و قیمت‌های مخصوص صفحه کارگر خالی را ویرایش کنید، سپس روی «ذخیره کلی تنظیمات» در بالا کلیک کنید.
                      </p>
                    </div>

                    {/* Sub tabs selectors */}
                    <div className="flex flex-wrap gap-2 border-b border-blue-100/50 pb-4">
                      {[
                        { id: 'hero', name: 'هدر و عنوان اصلی' },
                        { id: 'branches', name: 'شعبه‌ها و شماره‌ها' },
                        { id: 'pillars', name: 'سه رکن طلایی اعتماد' },
                        { id: 'materials', name: 'تجهیزات و ملزومات کارتن' },
                        { id: 'topics', name: 'سوالات و مباحث تفصیلی' },
                        { id: 'outro', name: 'داستان برند و پاورقی' },
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setWorkersSubTab(t.id as any)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                            workersSubTab === t.id 
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>

                    {/* Rendering inputs depending on active workersSubTab */}
                    {workersForm && (
                      <div className="text-right">
                        {workersSubTab === 'hero' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">نشان ریز بالای هدر (Badge)</label>
                              <input
                                type="text"
                                value={workersForm.heroBadge || ''}
                                onChange={(e) => handleWorkersFieldChange('heroBadge', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان اصلی صفحه (H1 Title)</label>
                              <input
                                type="text"
                                value={workersForm.heroTitle || ''}
                                onChange={(e) => handleWorkersFieldChange('heroTitle', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">تلفن ویژه تماس (Phone)</label>
                              <input
                                type="text"
                                value={workersForm.heroPhone || ''}
                                onChange={(e) => handleWorkersFieldChange('heroPhone', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">آدرس عکس هدر (Hero Image)</label>
                              <input
                                type="text"
                                value={workersForm.heroImage || ''}
                                onChange={(e) => handleWorkersFieldChange('heroImage', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div className="sm:col-span-2 bg-emerald-50/40 rounded-2xl p-4 border border-emerald-100">
                              <label className="block text-xs font-black text-slate-800 mb-2">🎥 ویدیو هیرو لندینگ کارگر خالی</label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                                <div className="sm:col-span-2">
                                  <input 
                                    type="text" 
                                    placeholder="آدرس اینترنتی ویدیو (مثلا http://.../video.mp4 یا آپارات)"
                                    value={workersForm.videoUrl || ''}
                                    onChange={(e) => handleWorkersFieldChange('videoUrl', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 text-left"
                                    dir="ltr"
                                  />
                                </div>
                                <div>
                                  <VideoUploader onUpload={(url) => handleWorkersFieldChange('videoUrl', url)} buttonText="آپلود ویدیو لندینگ" />
                                </div>
                              </div>
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">توضیحات معرفی هدر (H1 Subtitle / Desc)</label>
                              <textarea
                                value={workersForm.heroDesc || ''}
                                onChange={(e) => handleWorkersFieldChange('heroDesc', e.target.value)}
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                          </div>
                        )}

                        {workersSubTab === 'branches' && (
                          <div className="space-y-4">
                            <p className="text-[10px] text-gray-400 font-bold">بخش ۴ شعبه تلفنی زیر هدر اصلی:</p>
                            {(workersForm.branches || []).map((br: any, i: number) => (
                              <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                                <div>
                                  <label className="block text-[10px] text-gray-400 mb-1">نام شعبه/عنوان</label>
                                  <input
                                    type="text"
                                    value={br.name || ''}
                                    onChange={(e) => handleWorkersArrayChange('branches', i, 'name', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-gray-400 mb-1">شماره تلفن مستقیم شعب</label>
                                  <input
                                    type="text"
                                    value={br.phone || ''}
                                    onChange={(e) => handleWorkersArrayChange('branches', i, 'phone', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-gray-400 mb-1">پوشش محلی مناطق</label>
                                  <input
                                    type="text"
                                    value={br.desc || ''}
                                    onChange={(e) => handleWorkersArrayChange('branches', i, 'desc', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {workersSubTab === 'pillars' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان سکشن ارکان طلایی</label>
                                <input
                                  type="text"
                                  value={workersForm.pillarsTitle || ''}
                                  onChange={(e) => handleWorkersFieldChange('pillarsTitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">زیرعنوان سکشن ارکان طلایی</label>
                                <input
                                  type="text"
                                  value={workersForm.pillarsSubtitle || ''}
                                  onChange={(e) => handleWorkersFieldChange('pillarsSubtitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold">ارکان سه‌گانه اعتبار مکتوب:</p>
                            {(workersForm.pillars || []).map((p: any, i: number) => (
                              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                                <div>
                                  <label className="block text-[10px] text-gray-400 mb-1">عنوان اصلی رکن {i + 1}</label>
                                  <input
                                    type="text"
                                    value={p.title || ''}
                                    onChange={(e) => handleWorkersArrayChange('pillars', i, 'title', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-gray-400 mb-1">توضیحات فرعی جزئیات</label>
                                  <input
                                    type="text"
                                    value={p.desc || ''}
                                    onChange={(e) => handleWorkersArrayChange('pillars', i, 'desc', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {workersSubTab === 'materials' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان تخصص‌ها و توانمندی‌ها</label>
                                <input
                                  type="text"
                                  value={workersForm.materialsTitle || ''}
                                  onChange={(e) => handleWorkersFieldChange('materialsTitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-2">زیرعنوان تخصص‌ها و توانمندی‌ها</label>
                                <input
                                  type="text"
                                  value={workersForm.materialsSubtitle || ''}
                                  onChange={(e) => handleWorkersFieldChange('materialsSubtitle', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                />
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold">تخصص‌ها و حوزه‌های مهارتی کارگران:</p>
                            {(workersForm.materials || []).map((m: any, i: number) => (
                              <div key={i} className="space-y-3 p-4 bg-white rounded-2xl border border-gray-100">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div>
                                    <label className="block text-[10px] text-gray-400 mb-1">نام یا عنوان آیتم {i + 1}</label>
                                    <input
                                      type="text"
                                      value={m.title || ''}
                                      onChange={(e) => handleWorkersArrayChange('materials', i, 'title', e.target.value)}
                                      className="w-full bg-gray-50 border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-gray-400 mb-1">نشانک برجسته (Badge)</label>
                                    <input
                                      type="text"
                                      value={m.badge || ''}
                                      onChange={(e) => handleWorkersArrayChange('materials', i, 'badge', e.target.value)}
                                      className="w-full bg-gray-50 border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-gray-400 mb-1">آدرس تصویر آیتم</label>
                                    <input
                                      type="text"
                                      value={m.image || ''}
                                      onChange={(e) => handleWorkersArrayChange('materials', i, 'image', e.target.value)}
                                      className="w-full bg-gray-50 border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[10px] text-gray-400 mb-1">توضیحات کامل این حوزه مهارتی</label>
                                  <textarea
                                    value={m.desc || ''}
                                    onChange={(e) => handleWorkersArrayChange('materials', i, 'desc', e.target.value)}
                                    rows={2}
                                    className="w-full bg-gray-50 border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {workersSubTab === 'topics' && (
                          <div className="space-y-4">
                            <p className="text-[10px] text-gray-400 font-bold">بخش ۵ موضوع تفصیلی و دانستنی‌های سئو در پایین صفحه:</p>
                            {(workersForm.topics || []).map((t: any, i: number) => (
                              <div key={i} className="space-y-3 p-4 bg-white rounded-2xl border border-gray-100">
                                <div>
                                  <label className="block text-[10px] text-gray-400 mb-1">عنوان موضوع (مثال: دستمزد کارگر حمل ساید)</label>
                                  <input
                                    type="text"
                                    value={t.title || ''}
                                    onChange={(e) => handleWorkersArrayChange('topics', i, 'title', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-gray-400 mb-1">شرح مفصل محتوای متن</label>
                                  <textarea
                                    value={t.desc || ''}
                                    onChange={(e) => handleWorkersArrayChange('topics', i, 'desc', e.target.value)}
                                    rows={2}
                                    className="w-full bg-gray-50 border border-gray-150 rounded-lg py-1.5 px-2.5 text-xs font-semibold"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {workersSubTab === 'outro' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <h5 className="font-bold text-xs text-blue-900 mb-2 border-b border-blue-50 pb-2">داستان برند (Brand Story / Full Info)</h5>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان اصلی بخش داستان برند</label>
                              <input
                                type="text"
                                value={workersForm.fullStoryTitle || ''}
                                onChange={(e) => handleWorkersFieldChange('fullStoryTitle', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">عکس شاخص داستان برند</label>
                              <input
                                type="text"
                                value={workersForm.fullStoryImage || ''}
                                onChange={(e) => handleWorkersFieldChange('fullStoryImage', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">توضیحات کلی داستان برند</label>
                              <textarea
                                value={workersForm.fullStoryDesc || ''}
                                onChange={(e) => handleWorkersFieldChange('fullStoryDesc', e.target.value)}
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <h5 className="font-bold text-xs text-blue-900 mt-4 mb-2 border-b border-blue-50 pb-2">پاورقی و کادر سئوی پایین صفحه (Concluding Outro Alert)</h5>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">عنوان کادر نهایی</label>
                              <input
                                type="text"
                                value={workersForm.concludingTitle || ''}
                                onChange={(e) => handleWorkersFieldChange('concludingTitle', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-2">شرح خلاصه نهایی</label>
                              <input
                                type="text"
                                value={workersForm.concludingDesc || ''}
                                onChange={(e) => handleWorkersFieldChange('concludingDesc', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* DYNAMIC AREAS PAGE CONTENT EDITOR SECTION */}
                <div className="border-t border-gray-150 pt-8 mt-8 space-y-6 text-right">
                  <div className="bg-amber-50/40 rounded-[32px] p-6 md:p-8 border border-amber-200 space-y-6">
                    <div>
                      <h4 className="text-sm font-black text-amber-950 flex items-center gap-2">
                        <Grid className="w-5 h-5 text-amber-700" />
                        مدیریت محتوای محدوده و مناطق تحت پوشش (Covered Areas Pages)
                      </h4>
                      <p className="text-xs text-amber-800 mt-1">تغییر تایتل‌ها، متن‌ها، دایرکتوری شماره تلفن‌های هر ۴ منطقه تهران و کرج</p>
                    </div>

                    {areasForm && (
                      <div className="space-y-6">
                        {/* Sub-tabs to choose region */}
                        <div className="flex flex-wrap gap-1.5 bg-amber-100/60 p-1 rounded-2xl">
                          {[
                            { key: 'general', name: 'تنظیمات کلی صفحه' },
                            { key: 'north', name: 'منطقه شمال تهران' },
                            { key: 'west', name: 'منطقه غرب تهران' },
                            { key: 'east', name: 'منطقه شرق تهران' },
                            { key: 'karaj', name: 'منطقه کرج (البرز)' },
                          ].map((sub) => (
                            <button
                              key={sub.key}
                              type="button"
                              onClick={() => setAreasActiveTab(sub.key as any)}
                              className={`py-2 px-4 rounded-xl text-xs font-black transition-all ${
                                areasActiveTab === sub.key
                                  ? 'bg-amber-600 text-white shadow-sm'
                                  : 'text-amber-800 hover:text-amber-950 hover:bg-amber-50'
                              }`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>

                        {/* GENERAL SETTINGS */}
                        {areasActiveTab === 'general' && (
                          <div className="grid grid-cols-1 gap-6">
                            <div>
                              <label className="block text-[11px] font-bold text-gray-400 mb-2 font-mono">تایتل هدر صفحه مناطق</label>
                              <input
                                type="text"
                                value={areasForm.title || ''}
                                onChange={(e) => handleAreasFieldChange('title', e.target.value)}
                                className="w-full bg-white border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-400 mb-2 font-mono">زیرعنوان (Subtitle) صفحه مناطق</label>
                              <input
                                type="text"
                                value={areasForm.subtitle || ''}
                                onChange={(e) => handleAreasFieldChange('subtitle', e.target.value)}
                                className="w-full bg-white border border-gray-150 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800"
                              />
                            </div>
                          </div>
                        )}

                        {/* REGIONAL SETTINGS */}
                        {areasActiveTab !== 'general' && (() => {
                          const rKey = areasActiveTab as 'north' | 'west' | 'east' | 'karaj';
                          const rData = areasForm.regions?.[rKey] || DEFAULT_AREAS_DATA.regions[rKey];
                          return (
                            <div className="space-y-6 animate-in fade-in duration-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-400 mb-2 font-mono">نام نمایشی منطقه / شعبه</label>
                                  <input
                                    type="text"
                                    value={rData.name || ''}
                                    onChange={(e) => handleAreasRegionFieldChange(rKey, 'name', e.target.value)}
                                    className="w-full bg-white border border-gray-150 rounded-xl py-2 px-3 text-xs font-bold text-slate-800"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-[11px] font-bold text-gray-400 mb-2 font-mono">متن لید (توضیحات کوتاه ابتدایی شعبه)</label>
                                  <textarea
                                    rows={4}
                                    value={rData.lead || ''}
                                    onChange={(e) => handleAreasRegionFieldChange(rKey, 'lead', e.target.value)}
                                    className="w-full bg-white border border-gray-150 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 leading-relaxed"
                                  />
                                </div>
                              </div>

                              {/* PHONES SECTION */}
                              <div className="space-y-4">
                                <h5 className="font-bold text-[11px] text-amber-900 border-b border-amber-100 pb-1.5">لیست ۵ شماره تلفن مستقیم و اختصاصی شعبه ({rData.name})</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {(rData.phones || []).map((ph: any, idx: number) => (
                                    <div key={idx} className="flex gap-2 bg-white/70 p-3 rounded-2xl border border-amber-100/55">
                                      <div className="w-1/2">
                                        <label className="block text-[9px] text-gray-400 mb-1">لیبل تماس</label>
                                        <input
                                          type="text"
                                          value={ph.label || ''}
                                          onChange={(e) => handleAreasRegionPhoneChange(rKey, idx, 'label', e.target.value)}
                                          className="w-full bg-white border border-gray-155 rounded-lg py-1.5 px-2 text-[11px] font-bold text-slate-800"
                                        />
                                      </div>
                                      <div className="w-1/2">
                                        <label className="block text-[9px] text-gray-400 mb-1">شماره تلفن</label>
                                        <input
                                          type="text"
                                          value={ph.value || ''}
                                          onChange={(e) => handleAreasRegionPhoneChange(rKey, idx, 'value', e.target.value)}
                                          className="w-full bg-white border border-gray-155 rounded-lg py-1.5 px-2 text-[11px] font-bold text-slate-800 tracking-wider text-left"
                                          dir="ltr"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* SECTIONS CONTENTS */}
                              <div className="space-y-4">
                                <h5 className="font-bold text-[11px] text-amber-900 border-b border-amber-100 pb-1.5">بخش‌ها و مطالب تفصیلی پایین صفحه ({rData.name})</h5>
                                <div className="space-y-4">
                                  {(rData.sections || []).map((sec: any, idx: number) => (
                                    <div key={idx} className="bg-white/80 p-4 rounded-2xl border border-amber-150 space-y-3">
                                      <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center font-bold text-xs">{idx + 1}</span>
                                        <input
                                          type="text"
                                          value={sec.title || ''}
                                          placeholder="عنوان بخش"
                                          onChange={(e) => handleAreasRegionSectionChange(rKey, idx, 'title', e.target.value)}
                                          className="flex-1 bg-white border border-gray-150 rounded-lg py-1.5 px-2 text-xs font-bold text-slate-800"
                                        />
                                      </div>
                                      <textarea
                                        rows={4}
                                        value={sec.text || ''}
                                        placeholder="شرح توضیحات این بند"
                                        onChange={(e) => handleAreasRegionSectionChange(rKey, idx, 'text', e.target.value)}
                                        className="w-full bg-white border border-gray-150 rounded-lg py-2 px-2.5 text-xs font-semibold text-slate-700 leading-relaxed"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* ⚙️ CUSTOM ONLINE ESTIMATOR CONFIGURATOR PANEL ⚙️ */}
                <div className="border-t border-gray-150 dark:border-slate-800 pt-8 mt-8 space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-900/60 rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-slate-800 space-y-6">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-indigo-600" />
                        تنظیمات و کاستومایز کامل فرم محاسبه آنلاین و مراحل
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        با جدول زیر، تمام مراحل فرم محاسبه قیمت، فیلدهای دریافت اطلاعات، انواع ورودی‌ها و هشدارهای داخل فرم را بدون کدنویسی شخصی‌سازی کنید. پس از هر تغییر، روی «ذخیره کلی کل تنظیمات» کلیک کنید.
                      </p>
                    </div>

                    {/* Notification Alerts Settings */}
                    <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-gray-150 dark:border-slate-800 space-y-4">
                      <h5 className="text-xs font-black text-indigo-950 dark:text-slate-200 flex items-center gap-1 pb-2 border-b border-gray-100 dark:border-slate-800">
                        💬 مدیریت اعلان‌ها و پیام‌های داخل فرم
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-gray-400 dark:text-slate-450 font-bold mb-1.5">متن بنر راهنمای داخل مرحله (مکان قرارگیری طبق فیلد بعدی)</label>
                          <textarea
                            rows={3}
                            value={getParsedEstimatorConfig().notifications.step_alert || ''}
                            onChange={(e) => {
                              const conf = getParsedEstimatorConfig();
                              conf.notifications.step_alert = e.target.value;
                              updateEstimatorConfig(conf);
                            }}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-medium text-slate-850 dark:text-slate-200 leading-relaxed"
                            placeholder="متن هشدار یا راهنما..."
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-gray-400 dark:text-slate-450 font-bold mb-1.5 font-sans">نمایش بنر راهنما در کدام مرحله؟</label>
                            <input
                              type="number"
                              min={1}
                              max={getParsedEstimatorConfig().steps.length}
                              value={getParsedEstimatorConfig().notifications.step_alert_step || 1}
                              onChange={(e) => {
                                const conf = getParsedEstimatorConfig();
                                conf.notifications.step_alert_step = Number(e.target.value);
                                updateEstimatorConfig(conf);
                              }}
                              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 dark:text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-400 dark:text-slate-450 font-bold mb-1.5 font-sans">سلب مسئولیت قیمت (زیر خلاصه پیش فاکتور)</label>
                            <input
                              type="text"
                              value={getParsedEstimatorConfig().notifications.price_disclaimer || ''}
                              onChange={(e) => {
                                const conf = getParsedEstimatorConfig();
                                conf.notifications.price_disclaimer = e.target.value;
                                updateEstimatorConfig(conf);
                              }}
                              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs font-medium text-slate-850 dark:text-slate-200"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <div>
                          <label className="block text-[10px] text-gray-400 dark:text-slate-450 font-bold mb-1.5">تیتر پیام تشکر و موفقیت نهایی (بعد از زدن دکمه ارسال)</label>
                          <input
                            type="text"
                            value={getParsedEstimatorConfig().notifications.success_title || ''}
                            onChange={(e) => {
                              const conf = getParsedEstimatorConfig();
                              conf.notifications.success_title = e.target.value;
                              updateEstimatorConfig(conf);
                            }}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-850 dark:text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 dark:text-slate-450 font-bold mb-1.5">توضیحات تکمیلی پیام تشکر و ترخیص</label>
                          <textarea
                            rows={1}
                            value={getParsedEstimatorConfig().notifications.success_message || ''}
                            onChange={(e) => {
                              const conf = getParsedEstimatorConfig();
                              conf.notifications.success_message = e.target.value;
                              updateEstimatorConfig(conf);
                            }}
                            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Customizer UI */}
                    <div className="space-y-6">
                      {getParsedEstimatorConfig().steps.map((st: any, sIdx: number) => (
                        <div key={sIdx} className="bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 dark:border-slate-850 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-350 font-black flex items-center justify-center text-xs shrink-0">
                                {sIdx + 1}
                              </span>
                              <div>
                                <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 block">عنوان مرحله {sIdx + 1}:</span>
                                <input
                                  type="text"
                                  value={st.title}
                                  onChange={(e) => {
                                    const conf = getParsedEstimatorConfig();
                                    conf.steps[sIdx].title = e.target.value;
                                    updateEstimatorConfig(conf);
                                  }}
                                  placeholder="مثال: اطلاعات مکانی"
                                  className="bg-transparent border-b border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 focus:border-blue-500 text-xs font-extrabold py-0.5 text-slate-900 dark:text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Actions on Step */}
                            <div className="flex gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={sIdx === 0}
                                onClick={() => {
                                  const conf = getParsedEstimatorConfig();
                                  const temp = conf.steps[sIdx];
                                  conf.steps[sIdx] = conf.steps[sIdx - 1];
                                  conf.steps[sIdx - 1] = temp;
                                  updateEstimatorConfig(conf);
                                }}
                                className="p-1 px-2.5 rounded-lg border border-gray-150 text-[10px] font-bold text-gray-500 hover:bg-gray-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-40"
                              >
                                ⬆️ بالا
                              </button>
                              <button
                                type="button"
                                disabled={sIdx === getParsedEstimatorConfig().steps.length - 1}
                                onClick={() => {
                                  const conf = getParsedEstimatorConfig();
                                  const temp = conf.steps[sIdx];
                                  conf.steps[sIdx] = conf.steps[sIdx + 1];
                                  conf.steps[sIdx + 1] = temp;
                                  updateEstimatorConfig(conf);
                                }}
                                className="p-1 px-2.5 rounded-lg border border-gray-150 text-[10px] font-bold text-gray-500 hover:bg-gray-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-40"
                              >
                                ⬇️ پایین
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm("آیا مایل به حذف این مرحله و تمام فیلدهای داخل آن هستید؟")) {
                                    const conf = getParsedEstimatorConfig();
                                    conf.steps.splice(sIdx, 1);
                                    updateEstimatorConfig(conf);
                                  }
                                }}
                                className="p-1 px-2.5 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 text-[10px] font-bold hover:bg-red-100"
                              >
                                حذف مرحله
                              </button>
                            </div>
                          </div>

                          {/* Step description input */}
                          <div>
                            <label className="block text-[10px] text-gray-400 dark:text-slate-500 font-bold mb-1">توضیح هدر این مرحله (مثال: جزییات مبدا و مقصد خود را وارد کنید)</label>
                            <input
                              type="text"
                              value={st.description}
                              onChange={(e) => {
                                const conf = getParsedEstimatorConfig();
                                conf.steps[sIdx].description = e.target.value;
                                updateEstimatorConfig(conf);
                              }}
                              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 dark:text-slate-100"
                            />
                          </div>

                          {/* Fields Customizer mapping inside Step */}
                          <div className="space-y-3 pt-2">
                            <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold block">فیلدهای این مرحله:</span>
                            {(st.fields || []).map((fd: any, fIdx: number) => {
                              return (
                                <div key={fIdx} className="bg-slate-50 dark:bg-slate-900/40 border border-gray-150 dark:border-slate-800/80 rounded-xl p-4 space-y-3">
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                      {/* Field Type Badge */}
                                      <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-md">
                                        نوع {fd.type}
                                      </span>
                                      
                                      {/* Key Identifier */}
                                      <span className="text-[10px] font-mono text-gray-400 dark:text-slate-500">
                                        (Key: {fd.name})
                                      </span>
                                    </div>
                                    
                                    <div className="flex gap-1.5">
                                      <button
                                        type="button"
                                        disabled={fIdx === 0}
                                        onClick={() => {
                                          const conf = getParsedEstimatorConfig();
                                          const temp = conf.steps[sIdx].fields[fIdx];
                                          conf.steps[sIdx].fields[fIdx] = conf.steps[sIdx].fields[fIdx - 1];
                                          conf.steps[sIdx].fields[fIdx - 1] = temp;
                                          updateEstimatorConfig(conf);
                                        }}
                                        className="text-[9px] px-2 py-0.5 bg-white border border-gray-200 dark:bg-slate-850 text-gray-500 dark:text-slate-350 hover:bg-gray-100 dark:hover:bg-slate-800 rounded disabled:opacity-30"
                                      >
                                        ⬆️ بالا
                                      </button>
                                      <button
                                        type="button"
                                        disabled={fIdx === st.fields.length - 1}
                                        onClick={() => {
                                          const conf = getParsedEstimatorConfig();
                                          const temp = conf.steps[sIdx].fields[fIdx];
                                          conf.steps[sIdx].fields[fIdx] = conf.steps[sIdx].fields[fIdx + 1];
                                          conf.steps[sIdx].fields[fIdx + 1] = temp;
                                          updateEstimatorConfig(conf);
                                        }}
                                        className="text-[9px] px-2 py-0.5 bg-white border border-gray-200 dark:bg-slate-850 text-gray-500 dark:text-slate-350 hover:bg-gray-100 dark:hover:bg-slate-800 rounded disabled:opacity-30"
                                      >
                                        ⬇️ پایین
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const conf = getParsedEstimatorConfig();
                                          conf.steps[sIdx].fields.splice(fIdx, 1);
                                          updateEstimatorConfig(conf);
                                        }}
                                        className="text-[9px] px-2 py-0.5 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 rounded font-bold"
                                      >
                                        حذف فیلد
                                      </button>
                                    </div>
                                  </div>

                                  {/* Inputs config for specific field */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                    <div>
                                      <label className="block text-[9px] text-gray-400 dark:text-slate-500 mb-1">نام فارسی فیلد (برچسب)</label>
                                      <input
                                        type="text"
                                        value={fd.label}
                                        onChange={(e) => {
                                          const conf = getParsedEstimatorConfig();
                                          conf.steps[sIdx].fields[fIdx].label = e.target.value;
                                          updateEstimatorConfig(conf);
                                        }}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg py-1.5 px-2 text-xs font-bold text-slate-800 dark:text-slate-150"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] text-gray-400 dark:text-slate-500 mb-1">کلید انگلیسی فیلد (یک کلمه انگلیسی متناظر)</label>
                                      <input
                                        type="text"
                                        value={fd.name}
                                        onChange={(e) => {
                                          const conf = getParsedEstimatorConfig();
                                          conf.steps[sIdx].fields[fIdx].name = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                                          updateEstimatorConfig(conf);
                                        }}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg py-1.5 px-2 text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono text-left"
                                        dir="ltr"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] text-gray-400 dark:text-slate-500 mb-1">نوع ورودی فیلد (Type)</label>
                                      <select
                                        value={fd.type}
                                        onChange={(e) => {
                                          const conf = getParsedEstimatorConfig();
                                          conf.steps[sIdx].fields[fIdx].type = e.target.value as any;
                                          // Add sample options if select/radio/number-buttons is selected and option is empty
                                          if (['select', 'radio', 'number-buttons'].includes(e.target.value) && (!fd.options || fd.options.length === 0)) {
                                            conf.steps[sIdx].fields[fIdx].options = [
                                              { value: 'yes', label: 'بله' },
                                              { value: 'no', label: 'خیر' }
                                            ];
                                          }
                                          updateEstimatorConfig(conf);
                                        }}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg py-1.5 px-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                                      >
                                        <option value="text">متنی استاندارد</option>
                                        <option value="tel">تلفن و موبایل</option>
                                        <option value="date">تاریخ اسباب‌کشی</option>
                                        <option value="number-buttons">دکمه‌های انتخاب عدد</option>
                                        <option value="radio">دکمه‌های رادیویی هم عرض</option>
                                        <option value="select">کارت کادر دار عکس/توضیح چند گزینه‌ای</option>
                                      </select>
                                    </div>
                                    <div className="flex items-center gap-2 pt-4">
                                      <input
                                        type="checkbox"
                                        id={`req-${sIdx}-${fIdx}`}
                                        checked={!!fd.required}
                                        onChange={(e) => {
                                          const conf = getParsedEstimatorConfig();
                                          conf.steps[sIdx].fields[fIdx].required = e.target.checked;
                                          updateEstimatorConfig(conf);
                                        }}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                      />
                                      <label htmlFor={`req-${sIdx}-${fIdx}`} className="text-xs text-gray-500 dark:text-slate-400 font-bold select-none cursor-pointer">پر کردن فیلد اجباری است</label>
                                    </div>
                                  </div>

                                  {/* Placeholder config if applicable */}
                                  {['text', 'tel'].includes(fd.type) && (
                                    <div>
                                      <label className="block text-[9px] text-gray-400 dark:text-slate-500 mb-1">راهنمای داخل کادر (Placeholder / مثال)</label>
                                      <input
                                        type="text"
                                        value={fd.placeholder || ''}
                                        onChange={(e) => {
                                          const conf = getParsedEstimatorConfig();
                                          conf.steps[sIdx].fields[fIdx].placeholder = e.target.value;
                                          updateEstimatorConfig(conf);
                                        }}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg py-1.5 px-2 text-[11px] font-semibold text-slate-800 dark:text-slate-100"
                                      />
                                    </div>
                                  )}

                                  {/* Custom Options Array customizer (for select, radio, number-buttons types) */}
                                  {['select', 'radio', 'number-buttons'].includes(fd.type) && (
                                    <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-850 space-y-2">
                                      <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-850 pb-1.5">
                                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black">بخش تعریف گزینه‌های ورودی (Options)</span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const conf = getParsedEstimatorConfig();
                                            if (!conf.steps[sIdx].fields[fIdx].options) {
                                              conf.steps[sIdx].fields[fIdx].options = [];
                                            }
                                            conf.steps[sIdx].fields[fIdx].options.push({ value: 'new_val', label: 'گزینه جدید' });
                                            updateEstimatorConfig(conf);
                                          }}
                                          className="text-[9px] bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-750 dark:text-indigo-400 font-bold px-2 py-0.5 rounded"
                                        >
                                          + افزودن گزینه جدید
                                        </button>
                                      </div>

                                      <div className="space-y-2">
                                        {(fd.options || []).map((opt: any, oIdx: number) => (
                                          <div key={oIdx} className="flex flex-wrap md:flex-nowrap gap-2 items-center">
                                            <div className="w-1/4">
                                              <input
                                                type="text"
                                                value={opt.value}
                                                placeholder="مقدار انگلیسی"
                                                onChange={(e) => {
                                                  const conf = getParsedEstimatorConfig();
                                                  conf.steps[sIdx].fields[fIdx].options[oIdx].value = e.target.value;
                                                  updateEstimatorConfig(conf);
                                                }}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded py-1 px-1.5 text-[10px] font-mono text-slate-800 dark:text-slate-150"
                                              />
                                            </div>
                                            <div className="w-1/4">
                                              <input
                                                type="text"
                                                value={opt.label}
                                                placeholder="لیبل فارسی فارسی"
                                                onChange={(e) => {
                                                  const conf = getParsedEstimatorConfig();
                                                  conf.steps[sIdx].fields[fIdx].options[oIdx].label = e.target.value;
                                                  updateEstimatorConfig(conf);
                                                }}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded py-1 px-1.5 text-[10px] font-bold text-slate-800 dark:text-slate-150"
                                              />
                                            </div>
                                            <div className="flex-1">
                                              <input
                                                type="text"
                                                value={opt.desc || ''}
                                                placeholder="توضیح کوچک زیر دکمه (اختیاری)"
                                                onChange={(e) => {
                                                  const conf = getParsedEstimatorConfig();
                                                  conf.steps[sIdx].fields[fIdx].options[oIdx].desc = e.target.value;
                                                  updateEstimatorConfig(conf);
                                                }}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded py-1 px-1.5 text-[10px] text-slate-700 dark:text-slate-300"
                                              />
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const conf = getParsedEstimatorConfig();
                                                conf.steps[sIdx].fields[fIdx].options.splice(oIdx, 1);
                                                updateEstimatorConfig(conf);
                                              }}
                                              className="p-1 text-red-650 hover:text-red-800 font-bold"
                                            >
                                              ❌
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                </div>
                              );
                            })}
                            <button
                              type="button"
                              onClick={() => {
                                const conf = getParsedEstimatorConfig();
                                const baseName = 'custom_field';
                                let count = 1;
                                while(st.fields.some((f: any) => f.name === `${baseName}_${count}`)) {
                                  count++;
                                }
                                st.fields.push({
                                  name: `${baseName}_${count}`,
                                  label: 'عنوان فیلد جدید',
                                  type: 'text',
                                  required: false
                                });
                                updateEstimatorConfig(conf);
                              }}
                              className="text-xs text-indigo-650 dark:text-indigo-400 hover:text-indigo-850 font-black flex items-center gap-1 cursor-pointer bg-indigo-50/20 dark:bg-indigo-950/20 px-4 py-2.5 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-900 mt-2"
                            >
                              <PlusCircle className="w-4 h-4" />
                              + افزودن فیلد جدید به مرحله {sIdx + 1}
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add new Step Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const conf = getParsedEstimatorConfig();
                          conf.steps.push({
                            title: `مرحله جدید ${conf.steps.length + 1}`,
                            description: 'شرح کوتاه مرحله جدید خود را بنویسید...',
                            fields: []
                          });
                          updateEstimatorConfig(conf);
                        }}
                        className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-white dark:bg-slate-950 text-slate-650 dark:text-slate-300 hover:text-indigo-600 transition-all font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <PlusCircle className="w-5 h-5" />
                        + ایجاد و افزودن مرحله جدید به فرم محاسبه گر آنلاین (اضافه کردن مرحله)
                      </button>
                    </div>

                  </div>
                </div>

              </form>
            )}

            {/* 7. USER MANAGEMENT TAB */}
            {activeTab === 'users' && !isWriter && (
              <UserManagement currentUser={currentUser} onToast={showSuccessMessage} />
            )}
          </>
        )}

      </main>

    </div>
  );
}
