'use client';

import { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Star,
  Sparkles,
  Award,
  Package,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Lock,
  Upload,
  MapPin,
  AlertCircle,
  Camera,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Key,
  ArrowRight,
  Loader2,
  LogOut,
  LayoutDashboard,
  Calendar as CalendarIcon,
  MessageSquare,
  Search,
  Bell,
  ChevronDown,
  CheckCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { mockStore } from '@/utils/mockStore';
import { getServiceCategories, setServiceCategories } from '@/utils/servicesData';
import { saveMediaBlob, useResolvedImage, createThumbnailBlob } from '@/utils/indexedDBStore';
import {
  fetchAlbumsSync,
  saveAlbumSync,
  deleteAlbumSync,
  fetchPortfolioSync,
  savePortfolioSync,
  deletePortfolioSync,
  uploadImageSync
} from '@/utils/dbSync';

function SafeImage({ src, alt, className, style, onDragStart, isThumbnail = false }) {
  const resolved = useResolvedImage(src, isThumbnail);
  return (
    <img
      src={resolved}
      alt={alt}
      className={className}
      style={style}
      onDragStart={onDragStart}
      loading="lazy"
      decoding="async"
    />
  );
}

export default function AdminPage() {
  // Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  // 2FA / OTP State
  const [authStep, setAuthStep] = useState('login'); // 'login' | 'otp'
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loginError, setLoginError] = useState('');

  // Session recovery
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('admin_authenticated');
      const remember = localStorage.getItem('admin_remember_me');
      if (auth === 'true' || remember === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const creds = mockStore.getAdminCredentials();
    if (email.trim().toLowerCase() !== creds.email.toLowerCase() || password !== creds.password) {
      setLoginError(`Invalid credentials. Hint: ${creds.email} / ${creds.password}`);
      return;
    }

    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setAuthStep('otp');
    }, 1200);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setOtpError('');

    if (otpCode !== '123456') {
      setOtpError('Invalid 2FA code. Hint: 123456');
      return;
    }

    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setAuthSuccess(true);

      setTimeout(() => {
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          if (rememberMe) {
            localStorage.setItem('admin_remember_me', 'true');
          } else {
            sessionStorage.setItem('admin_authenticated', 'true');
          }
        }
      }, 1000);
    }, 1200);
  };

  const handleLogout = () => {
    triggerConfirm(
      'Secure Log Out',
      'Are you sure you want to securely log out of the admin console?',
      () => {
        setIsAuthenticated(false);
        setAuthStep('login');
        setEmail('');
        setPassword('');
        setOtpCode('');
        setAuthSuccess(false);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_remember_me');
        }
      }
    );
  };



  const [activeTab, setActiveTab] = useState('galleries');

  // Data States
  const [albums, setAlbums] = useState([]);
  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [team, setTeam] = useState([]);

  // Notifications/Alerts
  const [alertMsg, setAlertMsg] = useState({ text: '', type: '' });

  // Form & Modals States
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [adminLightboxImage, setAdminLightboxImage] = useState(null);
  const [adminLightboxIndex, setAdminLightboxIndex] = useState(-1);
  const [isCreateAlbumModalOpen, setIsCreateAlbumModalOpen] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState('');
  const [isEditAlbumModalOpen, setIsEditAlbumModalOpen] = useState(false);
  const [editingAlbumObj, setEditingAlbumObj] = useState(null);

  // Services Management State
  const [adminCategories, setAdminCategories] = useState([]);
  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [isCatSvcFormOpen, setIsCatSvcFormOpen] = useState(false);
  const [editingCatSvc, setEditingCatSvc] = useState(null);
  const [selectedCatId, setSelectedCatId] = useState('');
  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const [catServiceImageFile, setCatServiceImageFile] = useState(null);

  // Team Form State
  const [isTeamFormOpen, setIsTeamFormOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState('');
  const [teamForm, setTeamForm] = useState({
    name: '', role: '', bio: '', image: '/pic/pic-5.png'
  });

  // Client Tab Form State
  const [clientForm, setClientForm] = useState({
    clientName: '',
    eventName: '',
    eventCode: '',
    mobile: '',
    category: 'Wedding',
    eventDate: '',
    location: ''
  });
  const [clientFiles, setClientFiles] = useState([]);
  const [clientUploading, setClientUploading] = useState(false);

  const [isPkgFormOpen, setIsPkgFormOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const triggerConfirm = (title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Album Form State
  const [newAlbum, setNewAlbum] = useState({
    eventCode: '', clientName: '', mobile: '', eventName: '', eventDate: '', location: '', category: 'Wedding'
  });
  const [newAlbumPhotosFiles, setNewAlbumPhotosFiles] = useState([]);
  const [newMediaFiles, setNewMediaFiles] = useState([]);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [mediaUploadedCount, setMediaUploadedCount] = useState(0);

  // Media Form State
  const [newMedia, setNewMedia] = useState({
    type: 'photo', title: '', url: '/pic/pic-1.jpeg', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-outside-43229-large.mp4', dur: '3:00 Mins'
  });

  // Change credentials form state
  const [credForm, setCredForm] = useState({
    currentEmail: '',
    newEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [credError, setCredError] = useState('');
  const [credSuccess, setCredSuccess] = useState('');

  // Package Form State
  const [editingPackageIndex, setEditingPackageIndex] = useState(-1);
  const [packageForm, setPackageForm] = useState({
    name: '', price: '', type: 'Standard', desc: '', popular: false, features: ''
  });



  // Portfolio Form State
  const [portfolioForm, setPortfolioForm] = useState({
    title: '', category: 'Wedding', image: '/pic/pic-6.jpeg', albumId: ''
  });
  const [portfolioFilter, setPortfolioFilter] = useState('All');

  // Preset Demo Images list for easy mock uploading
  const demoImages = [
    { name: "Bridal Portrait", url: "/pic/70678.jpg" },
    { name: "Exchange of Rings", url: "/pic/69493.jpg" },
    { name: "Candid laughter", url: "/pic/69496.jpg" },
    { name: "Sparklers entry", url: "/pic/69498.jpg" },
    { name: "Couple silhouette", url: "/pic/pic-5.png" },
    { name: "Traditional Stage", url: "/pic/70235.jpg" },
    { name: "Outdoor Couple Walk", url: "/pic/69610.jpg" },
    { name: "Groom Portrait", url: "/pic/pic-12.png" },
    { name: "Creative Details", url: "/pic/pic-6.png" },
  ];
  // Compute portfolio categories dynamically based on services/categories defined by the user
  const getPortfolioCategories = () => {
    const base = [
      "Wedding", "Reception", "Engagement", "Pre Wedding", "Baby Shoot", "Maternity", "Events", "Drone Shots"
    ];
    adminCategories.forEach(cat => {
      if (cat.name) base.push(cat.name);
      if (cat.services) {
        cat.services.forEach(svc => {
          if (svc.name) base.push(svc.name);
          if (svc.subServices) {
            svc.subServices.forEach(sub => {
              if (sub) base.push(sub);
            });
          }
        });
      }
    });
    const unique = [];
    base.forEach(cat => {
      const trimmed = cat.trim();
      if (trimmed && !unique.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
        unique.push(trimmed);
      }
    });
    return unique;
  };

  const portfolioCategories = getPortfolioCategories();

  // Load Initial Data
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    // 1. Fetch albums
    const albumSync = await fetchAlbumsSync();
    let a;
    if (albumSync.configured) {
      a = albumSync.albums || [];
      // Seed any missing default albums
      const defaults = mockStore.getAlbums();
      let seededNew = false;
      for (const alb of defaults) {
        if (!a.some(x => x.id === alb.id)) {
          console.log(`Seeding missing album ${alb.id} to D1 database...`);
          await saveAlbumSync(alb);
          seededNew = true;
        }
      }
      if (seededNew) {
        const updatedAlbums = await fetchAlbumsSync();
        a = updatedAlbums.albums || [];
      }
      // Sync local cache
      mockStore.setAlbums(a);
    } else {
      a = mockStore.getAlbums();
    }
    setAlbums(a);

    // 2. Fetch portfolio
    const portfolioSync = await fetchPortfolioSync();
    let port;
    if (portfolioSync.configured) {
      port = portfolioSync.portfolio || [];
      // Seed any missing default portfolio items
      const defaults = mockStore.getPortfolio();
      let seededNew = false;
      for (const item of defaults) {
        if (!port.some(x => x.id === item.id)) {
          console.log(`Seeding missing portfolio item ${item.id} to D1 database...`);
          await savePortfolioSync(item);
          seededNew = true;
        }
      }
      if (seededNew) {
        const updatedPort = await fetchPortfolioSync();
        port = updatedPort.portfolio || [];
      }
      mockStore.setPortfolio(port);
    } else {
      port = mockStore.getPortfolio();
    }
    setPortfolio(port);

    // 3. Fetch packages and services
    const p = mockStore.getPackages();
    const s = mockStore.getServices();
    setPackages(p);
    setServices(s);

    // 4. Fetch team members
    const t = mockStore.getTeam();
    setTeam(t);

    // 5. Fetch service categories
    const cats = getServiceCategories();
    setAdminCategories(cats);

    if (a.length > 0 && !selectedAlbumId) {
      setSelectedAlbumId(a[0].id);
    }
  };

  const showAlert = (text, type = 'success') => {
    setAlertMsg({ text, type });
    setTimeout(() => setAlertMsg({ text: '', type: '' }), 4000);
  };

  // --- Service Category Actions ---
  const handleAddNewCategoryClick = () => {
    setEditingCat({
      id: '',
      name: '',
      desc: '',
      price: '',
      image: '/pic/services/events.png',
      services: [],
      isNew: true
    });
    setCategoryImageFile(null);
    setIsCatFormOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    
    let finalImageUrl = editingCat.image;
    if (categoryImageFile) {
      const id = `user_uploaded_${Date.now()}_cat_${Math.random().toString(36).substr(2, 9)}`;
      const thumbBlob = await createThumbnailBlob(categoryImageFile);
      const originalUpload = await uploadImageSync(categoryImageFile, `${id}.jpg`);
      const thumbUpload = await uploadImageSync(thumbBlob, `${id}_thumb.jpg`);
      if (originalUpload.configured && thumbUpload.configured) {
        finalImageUrl = originalUpload.url;
      } else {
        await saveMediaBlob(id, categoryImageFile);
        await saveMediaBlob(`${id}_thumb`, thumbBlob);
        finalImageUrl = `indexeddb://${id}`;
      }
    }

    let updated;
    if (editingCat.isNew) {
      const newCatId = editingCat.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      let uniqueId = newCatId;
      let counter = 1;
      while (adminCategories.some(cat => cat.id === uniqueId)) {
        uniqueId = `${newCatId}-${counter}`;
        counter++;
      }
      const newCat = {
        id: uniqueId,
        name: editingCat.name,
        desc: editingCat.desc,
        price: editingCat.price,
        image: finalImageUrl || '/pic/services/events.png',
        services: []
      };
      updated = [...adminCategories, newCat];
    } else {
      updated = adminCategories.map(cat => {
        if (cat.id === editingCat.id) {
          return {
            ...cat,
            name: editingCat.name,
            desc: editingCat.desc,
            price: editingCat.price,
            image: finalImageUrl
          };
        }
        return cat;
      });
    }

    setAdminCategories(updated);
    setServiceCategories(updated);
    setIsCatFormOpen(false);
    setEditingCat(null);
    setCategoryImageFile(null);
    showAlert(editingCat.isNew ? 'Category created successfully.' : 'Category details updated successfully.');
  };

  const handleEditCategory = (cat) => {
    setEditingCat({ ...cat });
    setCategoryImageFile(null);
    setIsCatFormOpen(true);
  };

  const handleDeleteCategory = (catId) => {
    triggerConfirm(
      'Delete Service Category',
      'Are you sure you want to delete this service category? All services and sub-services inside it will be permanently removed.',
      () => {
        const updated = adminCategories.filter(cat => cat.id !== catId);
        setAdminCategories(updated);
        setServiceCategories(updated);
        showAlert('Category deleted successfully.', 'warning');
      }
    );
  };

  const handleSaveCatService = async (e) => {
    e.preventDefault();
    const subServices = editingCatSvc.subServicesText
      ? editingCatSvc.subServicesText.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
      : [];

    let finalImageUrl = editingCatSvc.image;
    if (catServiceImageFile) {
      const id = `user_uploaded_${Date.now()}_svc_${Math.random().toString(36).substr(2, 9)}`;
      const thumbBlob = await createThumbnailBlob(catServiceImageFile);
      const originalUpload = await uploadImageSync(catServiceImageFile, `${id}.jpg`);
      const thumbUpload = await uploadImageSync(thumbBlob, `${id}_thumb.jpg`);
      if (originalUpload.configured && thumbUpload.configured) {
        finalImageUrl = originalUpload.url;
      } else {
        await saveMediaBlob(id, catServiceImageFile);
        await saveMediaBlob(`${id}_thumb`, thumbBlob);
        finalImageUrl = `indexeddb://${id}`;
      }
    }

    const updated = adminCategories.map(cat => {
      if (cat.id === selectedCatId) {
        let updatedServices = [];
        if (editingCatSvc.isNew) {
          const newSvc = {
            id: editingCatSvc.id || 'svc-' + Date.now(),
            name: editingCatSvc.name,
            price: editingCatSvc.price,
            image: finalImageUrl || '/pic/services/events.png',
            desc: editingCatSvc.desc || '',
            ...(subServices.length > 0 ? { subServices } : {})
          };
          updatedServices = [...(cat.services || []), newSvc];
        } else {
          updatedServices = (cat.services || []).map(svc => {
            if (svc.id === editingCatSvc.id) {
              return {
                ...svc,
                name: editingCatSvc.name,
                price: editingCatSvc.price,
                image: finalImageUrl,
                desc: editingCatSvc.desc || '',
                ...(subServices.length > 0 ? { subServices } : {})
              };
            }
            return svc;
          });
        }
        return { ...cat, services: updatedServices };
      }
      return cat;
    });

    setAdminCategories(updated);
    setServiceCategories(updated);
    setIsCatSvcFormOpen(false);
    setEditingCatSvc(null);
    setCatServiceImageFile(null);
    showAlert(editingCatSvc.isNew ? 'New service added successfully.' : 'Service details updated successfully.');
  };

  const handleEditCatService = (catId, svc) => {
    setSelectedCatId(catId);
    setEditingCatSvc({
      ...svc,
      isNew: false,
      desc: svc.desc || '',
      subServicesText: svc.subServices ? svc.subServices.join('\n') : ''
    });
    setCatServiceImageFile(null);
    setIsCatSvcFormOpen(true);
  };

  const handleAddNewCatServiceClick = (catId) => {
    setSelectedCatId(catId);
    setEditingCatSvc({
      id: 'svc-' + Date.now(),
      name: '',
      price: '',
      image: '/pic/services/events.png',
      desc: '',
      subServicesText: '',
      isNew: true
    });
    setCatServiceImageFile(null);
    setIsCatSvcFormOpen(true);
  };

  const handleDeleteCatService = (catId, svcId) => {
    triggerConfirm(
      'Delete Service',
      'Are you sure you want to delete this service?',
      () => {
        const updated = adminCategories.map(cat => {
          if (cat.id === catId) {
            return {
              ...cat,
              services: (cat.services || []).filter(s => s.id !== svcId)
            };
          }
          return cat;
        });

        setAdminCategories(updated);
        setServiceCategories(updated);
        showAlert('Service deleted successfully.', 'warning');
      }
    );
  };

  // --- Album Actions ---
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbum.eventName) {
      showAlert('Please enter the album name.', 'danger');
      return;
    }

    const code = `ALB${Date.now().toString().slice(-6)}`;
    const clientName = newAlbum.eventName;

    let albumPhotos = [];
    if (newAlbumPhotosFiles && newAlbumPhotosFiles.length > 0) {
      for (let i = 0; i < newAlbumPhotosFiles.length; i++) {
        const file = newAlbumPhotosFiles[i];
        const id = `user_uploaded_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`;
        const thumbBlob = await createThumbnailBlob(file);

        // Upload to R2 if configured, else IndexedDB
        const originalUpload = await uploadImageSync(file, `${id}.jpg`);
        const thumbUpload = await uploadImageSync(thumbBlob, `${id}_thumb.jpg`);

        if (originalUpload.configured && thumbUpload.configured) {
          albumPhotos.push({
            id: i + 1,
            title: file.name.split('.')[0],
            url: originalUpload.url
          });
        } else {
          await saveMediaBlob(id, file);
          await saveMediaBlob(`${id}_thumb`, thumbBlob);
          albumPhotos.push({
            id: i + 1,
            title: file.name.split('.')[0],
            url: `indexeddb://${id}`
          });
        }
      }
    }

    const newAlb = {
      id: code.toLowerCase(),
      eventCode: code,
      clientName: clientName,
      mobile: '0000000000',
      eventName: newAlbum.eventName,
      eventDate: newAlbum.eventDate || new Date().toLocaleDateString(),
      location: newAlbum.location || 'Theni Residency',
      category: newAlbum.category || 'Wedding',
      photos: albumPhotos,
      videos: [],
      albumType: 'general'
    };

    const res = await saveAlbumSync(newAlb);
    if (res.configured) {
      const updatedRes = await fetchAlbumsSync();
      if (updatedRes.configured) {
        setAlbums(updatedRes.albums);
        mockStore.setAlbums(updatedRes.albums);
      }
    } else {
      const updated = [...albums, newAlb];
      mockStore.setAlbums(updated);
      setAlbums(updated);
    }
    setSelectedAlbumId(newAlb.id);
    setNewAlbum({ eventCode: '', clientName: '', mobile: '', eventName: '', eventDate: '', location: '', category: 'Wedding' });
    setNewAlbumPhotosFiles([]);
    showAlert(`Album created successfully with ${albumPhotos.length} photos!`);
  };

  const handleDeleteAlbum = (id) => {
    triggerConfirm(
      'Delete Client Album',
      'Are you sure you want to delete this client album? All photo/video links inside will be removed.',
      async () => {
        const res = await deleteAlbumSync(id);
        if (res.configured) {
          const updatedRes = await fetchAlbumsSync();
          if (updatedRes.configured) {
            setAlbums(updatedRes.albums);
            mockStore.setAlbums(updatedRes.albums);
            setSelectedAlbumId(updatedRes.albums.length > 0 ? updatedRes.albums[0].id : '');
          }
        } else {
          const updated = albums.filter(a => a.id !== id);
          mockStore.setAlbums(updated);
          setAlbums(updated);
          setSelectedAlbumId(updated.length > 0 ? updated[0].id : '');
        }
        showAlert('Album deleted.', 'warning');
      }
    );
  };

  const handleStartEditAlbum = (album) => {
    setEditingAlbumObj({
      id: album.id,
      eventCode: album.eventCode || '',
      clientName: album.clientName || '',
      mobile: album.mobile || '',
      eventName: album.eventName || '',
      eventDate: album.eventDate || '',
      location: album.location || '',
      category: album.category || 'Wedding',
      photos: album.photos || [],
      videos: album.videos || [],
      albumType: album.albumType || 'general'
    });
    setIsEditAlbumModalOpen(true);
  };

  const handleSaveEditAlbum = async (e) => {
    e.preventDefault();
    if (!editingAlbumObj.eventName) {
      showAlert('Please enter the event/album name.', 'danger');
      return;
    }
    const res = await saveAlbumSync(editingAlbumObj);
    if (res.configured) {
      const updatedRes = await fetchAlbumsSync();
      if (updatedRes.configured) {
        setAlbums(updatedRes.albums);
        mockStore.setAlbums(updatedRes.albums);
      }
    } else {
      const updatedAlbums = albums.map(a => a.id === editingAlbumObj.id ? editingAlbumObj : a);
      mockStore.setAlbums(updatedAlbums);
      setAlbums(updatedAlbums);
    }
    setIsEditAlbumModalOpen(false);
    setEditingAlbumObj(null);
    showAlert('Album details updated successfully!');
  };

  const handleClientFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 20 * 1024 * 1024; // 20 MB limit
    const invalidFiles = files.filter(f => f.size > maxSize);

    if (invalidFiles.length > 0) {
      const names = invalidFiles.map(f => `${f.name} (${(f.size / (1024 * 1024)).toFixed(2)} MB)`).join(', ');
      showAlert(`Error: Image file size must be under 20 MB. The following file(s) exceed this limit and were rejected: ${names}`, 'danger');
      e.target.value = null;
      setClientFiles([]);
      return;
    }

    setClientFiles(files);
    showAlert(`${files.length} photo(s) selected successfully!`);
  };

  const handleCreateClientAlbum = async (e) => {
    e.preventDefault();
    if (!clientForm.clientName || !clientForm.eventName) {
      showAlert('Client Name and Event Name are required.', 'danger');
      return;
    }

    const code = clientForm.eventCode || `ALB${Date.now().toString().slice(-6)}`;
    const phone = clientForm.mobile || '0000000000';

    setClientUploading(true);
    try {
      let albumPhotos = [];
      if (clientFiles && clientFiles.length > 0) {
        for (let i = 0; i < clientFiles.length; i++) {
          const file = clientFiles[i];
          const id = `user_uploaded_${Date.now()}_client_${i}_${Math.random().toString(36).substr(2, 9)}`;
          const thumbBlob = await createThumbnailBlob(file);

          const originalUpload = await uploadImageSync(file, `${id}.jpg`);
          const thumbUpload = await uploadImageSync(thumbBlob, `${id}_thumb.jpg`);

          if (originalUpload.configured && thumbUpload.configured) {
            albumPhotos.push({
              id: i + 1,
              title: file.name.split('.')[0],
              url: originalUpload.url
            });
          } else {
            await saveMediaBlob(id, file);
            await saveMediaBlob(`${id}_thumb`, thumbBlob);
            albumPhotos.push({
              id: i + 1,
              title: file.name.split('.')[0],
              url: `indexeddb://${id}`
            });
          }
        }
      }
      const newAlb = {
        id: code.toLowerCase(),
        eventCode: code,
        clientName: clientForm.clientName,
        mobile: phone,
        eventName: clientForm.eventName,
        eventDate: clientForm.eventDate || new Date().toLocaleDateString(),
        location: clientForm.location || 'Theni Residency',
        category: clientForm.category || 'Wedding',
        photos: albumPhotos,
        videos: [],
        albumType: 'client'
      };

      const res = await saveAlbumSync(newAlb);
      if (res.configured) {
        const updatedRes = await fetchAlbumsSync();
        if (updatedRes.configured) {
          setAlbums(updatedRes.albums);
          mockStore.setAlbums(updatedRes.albums);
        }
      } else {
        const updated = [...albums, newAlb];
        mockStore.setAlbums(updated);
        setAlbums(updated);
      }

      setClientForm({
        clientName: '',
        eventName: '',
        eventCode: '',
        mobile: '',
        category: 'Wedding',
        eventDate: '',
        location: ''
      });
      setClientFiles([]);
      setClientUploading(false);

      setActiveTab('galleries');
      setSelectedAlbumId('');
      showAlert(`Client Album created successfully with ${albumPhotos.length} photos!`);
    } catch (err) {
      console.error(err);
      setClientUploading(false);
      showAlert('Failed to upload images. Please try again.', 'danger');
    }
  };

  // --- Media Uploader Actions ---
  const handleAddMedia = async (e) => {
    e.preventDefault();
    if (!selectedAlbumId) {
      showAlert('Please select or create an album first.', 'danger');
      return;
    }

    const album = albums.find(a => a.id === selectedAlbumId);
    if (!album) return;

    if (newMedia.type === 'photo') {
      let updatedPhotos = [...(album.photos || [])];
      let startId = updatedPhotos.length + 1;

      if (newMediaFiles && newMediaFiles.length > 0) {
        if (album.albumType === 'client') {
          const maxSize = 20 * 1024 * 1024;
          const invalidFiles = newMediaFiles.filter(f => f.size > maxSize);
          if (invalidFiles.length > 0) {
            const names = invalidFiles.map(f => `${f.name} (${(f.size / (1024 * 1024)).toFixed(2)} MB)`).join(', ');
            showAlert(`Error: Image file size must be under 20 MB. The following file(s) exceed this limit and were rejected: ${names}`, 'danger');
            return;
          }
        }
        
        setMediaUploading(true);
        setMediaUploadedCount(0);
        
        try {
          // Upload multiple files
          for (let i = 0; i < newMediaFiles.length; i++) {
            const file = newMediaFiles[i];
            const id = `user_uploaded_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`;
            const thumbBlob = await createThumbnailBlob(file);

            const originalUpload = await uploadImageSync(file, `${id}.jpg`);
            const thumbUpload = await uploadImageSync(thumbBlob, `${id}_thumb.jpg`);

            if (originalUpload.configured && thumbUpload.configured) {
              updatedPhotos.push({
                id: startId + i,
                title: file.name.split('.')[0],
                url: originalUpload.url
              });
            } else {
              await saveMediaBlob(id, file);
              await saveMediaBlob(`${id}_thumb`, thumbBlob);
              updatedPhotos.push({
                id: startId + i,
                title: file.name.split('.')[0],
                url: `indexeddb://${id}`
              });
            }
            setMediaUploadedCount(i + 1);
          }
        } catch (err) {
          console.error('Error uploading media files:', err);
          showAlert('Failed to upload some files. Please try again.', 'danger');
        } finally {
          setMediaUploading(false);
          setMediaUploadedCount(0);
        }
      } else {
        // Upload single preset or custom URL
        const newPhoto = {
          id: startId,
          title: newMedia.title || `Gallery Shot ${startId}`,
          url: newMedia.url
        };
        updatedPhotos.push(newPhoto);
      }

      album.photos = updatedPhotos;
    } else {
      const newVideo = {
        id: `v${(album.videos?.length || 0) + 1}`,
        title: newMedia.title || `Highlight Reel ${(album.videos?.length || 0) + 1}`,
        thumb: '/pic/pic-6.jpeg',
        url: newMedia.videoUrl,
        dur: newMedia.dur
      };
      album.videos = [...(album.videos || []), newVideo];
    }

    const res = await saveAlbumSync(album);
    if (res.configured) {
      const updatedRes = await fetchAlbumsSync();
      if (updatedRes.configured) {
        setAlbums(updatedRes.albums);
        mockStore.setAlbums(updatedRes.albums);
      }
    } else {
      const updatedAlbums = albums.map(a => a.id === selectedAlbumId ? album : a);
      mockStore.setAlbums(updatedAlbums);
      setAlbums(updatedAlbums);
    }
    setNewMedia({ ...newMedia, title: '' });
    setNewMediaFiles([]);
    if (e.target && typeof e.target.reset === 'function') {
      e.target.reset();
    }
    showAlert(`${newMedia.type === 'photo' ? 'Photo(s)' : 'Video'} uploaded to album successfully!`);
  };

  const handleDeleteMedia = (mediaType, id) => {
    const album = albums.find(a => a.id === selectedAlbumId);
    if (!album) return;

    triggerConfirm(
      'Delete Media Item',
      `Are you sure you want to permanently delete this ${mediaType}?`,
      async () => {
        const updatedAlbum = {
          ...album,
          photos: mediaType === 'photo' ? album.photos.filter(p => p.id !== id) : [...(album.photos || [])],
          videos: mediaType !== 'photo' ? album.videos.filter(v => v.id !== id) : [...(album.videos || [])]
        };
        const res = await saveAlbumSync(updatedAlbum);
        if (res.configured) {
          const updatedRes = await fetchAlbumsSync();
          if (updatedRes.configured) {
            setAlbums(updatedRes.albums);
            mockStore.setAlbums(updatedRes.albums);
          }
        } else {
          const updatedAlbums = albums.map(a => a.id === selectedAlbumId ? updatedAlbum : a);
          mockStore.setAlbums(updatedAlbums);
          setAlbums(updatedAlbums);
        }
        showAlert('Media item deleted.', 'warning');
      }
    );
  };

  // --- Package Actions ---
  const handleSavePackage = (e) => {
    e.preventDefault();
    if (!packageForm.name || !packageForm.price || !packageForm.desc) {
      showAlert('All package fields except features are required.', 'danger');
      return;
    }

    // Parse features from comma-separated or line-separated list
    const featuresList = packageForm.features
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const include = !line.startsWith('-');
        const text = line.replace(/^[+-]\s*/, '').trim();
        return { text, include };
      });

    const pkgData = {
      name: packageForm.name,
      price: packageForm.price.replace(/[^\d,]/g, ''),
      type: packageForm.type,
      desc: packageForm.desc,
      popular: packageForm.popular,
      features: featuresList.length > 0 ? featuresList : [
        { text: "Full Day Photography Coverage", include: true },
        { text: "Edited Digital Files", include: true }
      ]
    };

    let updated;
    if (editingPackageIndex > -1) {
      updated = packages.map((p, idx) => idx === editingPackageIndex ? pkgData : p);
      showAlert('Package updated successfully!');
    } else {
      updated = [...packages, pkgData];
      showAlert('Package created successfully!');
    }

    mockStore.setPackages(updated);
    setPackages(updated);
    setEditingPackageIndex(-1);
    setPackageForm({ name: '', price: '', type: 'Standard', desc: '', popular: false, features: '' });
  };

  const handleEditPackage = (index) => {
    const pkg = packages[index];
    const featuresText = pkg.features
      .map(f => `${f.include ? '+' : '-'} ${f.text}`)
      .join('\n');

    setEditingPackageIndex(index);
    setPackageForm({
      name: pkg.name,
      price: pkg.price,
      type: pkg.type || 'Standard',
      desc: pkg.desc,
      popular: pkg.popular || false,
      features: featuresText
    });
  };

  const handleDeletePackage = (index) => {
    triggerConfirm(
      'Delete Package',
      `Are you sure you want to permanently delete the ${packages[index].name} package?`,
      () => {
        const updated = packages.filter((_, idx) => idx !== index);
        mockStore.setPackages(updated);
        setPackages(updated);
        showAlert('Package deleted.', 'warning');
      }
    );
  };



  // --- Portfolio Actions ---
  const handleSavePortfolio = async (e) => {
    e.preventDefault();
    if (!portfolioForm.title) {
      showAlert('Portfolio item title is required.', 'danger');
      return;
    }
    if (editingPortfolioId) {
      const updatedItem = {
        id: editingPortfolioId,
        title: portfolioForm.title,
        category: portfolioForm.category,
        image: portfolioForm.image || '/pic/pic-6.jpeg',
        albumId: portfolioForm.albumId || undefined
      };
      const res = await savePortfolioSync(updatedItem);
      if (res.configured) {
        const updatedRes = await fetchPortfolioSync();
        if (updatedRes.configured) {
          setPortfolio(updatedRes.portfolio);
          mockStore.setPortfolio(updatedRes.portfolio);
        }
      } else {
        const updated = portfolio.map(p => p.id === editingPortfolioId ? updatedItem : p);
        mockStore.setPortfolio(updated);
        setPortfolio(updated);
      }
      setEditingPortfolioId('');
      setPortfolioForm({ title: '', category: 'Wedding', image: '/pic/pic-6.jpeg', albumId: '' });
      showAlert('Portfolio item updated successfully!');
    } else {
      const newItem = {
        title: portfolioForm.title,
        category: portfolioForm.category,
        image: portfolioForm.image || '/pic/pic-6.jpeg',
        albumId: portfolioForm.albumId || undefined
      };
      const res = await savePortfolioSync(newItem);
      if (res.configured) {
        const updatedRes = await fetchPortfolioSync();
        if (updatedRes.configured) {
          setPortfolio(updatedRes.portfolio);
          mockStore.setPortfolio(updatedRes.portfolio);
        }
      } else {
        const nextId = portfolio.length > 0 ? Math.max(...portfolio.map(p => p.id)) + 1 : 1;
        const localItem = { ...newItem, id: nextId };
        const updated = [...portfolio, localItem];
        mockStore.setPortfolio(updated);
        setPortfolio(updated);
      }
      setPortfolioForm({ title: '', category: 'Wedding', image: '/pic/pic-6.jpeg', albumId: '' });
      showAlert('Portfolio item added successfully!');
    }
  };

  const handleEditPortfolio = (item) => {
    setEditingPortfolioId(item.id);
    setPortfolioForm({
      title: item.title,
      category: item.category,
      image: item.image || '/pic/pic-6.jpeg',
      albumId: item.albumId || ''
    });
  };

  const handleDeletePortfolio = (id) => {
    const item = portfolio.find(p => p.id === id);
    const title = item ? item.title : 'this showcase item';
    triggerConfirm(
      'Delete Portfolio Item',
      `Are you sure you want to permanently delete "${title}" from the portfolio showcase?`,
      async () => {
        const res = await deletePortfolioSync(id);
        if (res.configured) {
          const updatedRes = await fetchPortfolioSync();
          if (updatedRes.configured) {
            setPortfolio(updatedRes.portfolio);
            mockStore.setPortfolio(updatedRes.portfolio);
          }
        } else {
          const updated = portfolio.filter(p => p.id !== id);
          mockStore.setPortfolio(updated);
          setPortfolio(updated);
        }
        showAlert('Portfolio item deleted.', 'warning');
      }
    );
  };

  // --- Team Actions ---
  const handleSaveTeam = (e) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.role || !teamForm.bio) {
      showAlert('Name, Role, and Bio are required.', 'danger');
      return;
    }

    const memberData = {
      id: editingTeamId || `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: teamForm.name,
      role: teamForm.role,
      bio: teamForm.bio,
      image: teamForm.image || '/pic/pic-5.png'
    };

    let updated;
    if (editingTeamId) {
      updated = team.map(m => m.id === editingTeamId ? memberData : m);
      showAlert('Team member details updated successfully!');
    } else {
      updated = [...team, memberData];
      showAlert('New team member added successfully!');
    }

    mockStore.setTeam(updated);
    setTeam(updated);
    setEditingTeamId('');
    setTeamForm({ name: '', role: '', bio: '', image: '/pic/pic-5.png' });
  };

  const handleEditTeam = (member) => {
    setEditingTeamId(member.id);
    setTeamForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image || '/pic/pic-5.png'
    });
  };

  const handleDeleteTeam = (id) => {
    const member = team.find(m => m.id === id);
    const name = member ? member.name : 'this member';
    triggerConfirm(
      'Delete Team Member',
      `Are you sure you want to permanently remove ${name} from the team?`,
      () => {
        const updated = team.filter(m => m.id !== id);
        mockStore.setTeam(updated);
        setTeam(updated);
        showAlert('Team member removed.', 'warning');
      }
    );
  };

  const handleChangeCredentials = (e) => {
    e.preventDefault();
    setCredError('');
    setCredSuccess('');

    const currentCreds = mockStore.getAdminCredentials();

    if (credForm.currentEmail.trim().toLowerCase() !== currentCreds.email.toLowerCase()) {
      setCredError('Incorrect current email address.');
      return;
    }

    if (credForm.currentPassword !== currentCreds.password) {
      setCredError('Incorrect current password.');
      return;
    }

    if (credForm.newPassword !== credForm.confirmNewPassword) {
      setCredError('New password and confirm password do not match.');
      return;
    }

    if (credForm.newPassword.length < 4) {
      setCredError('New password must be at least 4 characters long.');
      return;
    }

    mockStore.setAdminCredentials({
      email: credForm.newEmail.trim().toLowerCase(),
      password: credForm.newPassword
    });

    setCredSuccess('Admin credentials updated successfully! Log in with your new email and password next time.');
    setCredForm({
      currentEmail: '',
      newEmail: '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  // --- Clean State Reset ---
  const handleResetToDefaults = () => {
    triggerConfirm(
      'Reset All System Data',
      'Are you sure you want to reset all client albums, packages, services, and portfolio items to default presets? This will permanently erase your customizations.',
      async () => {
        // Clear D1 database if configured
        const albumSync = await fetchAlbumsSync();
        if (albumSync.configured) {
          console.log("Resetting D1 albums...");
          for (const alb of albumSync.albums || []) {
            await deleteAlbumSync(alb.id);
          }
        }
        const portfolioSync = await fetchPortfolioSync();
        if (portfolioSync.configured) {
          console.log("Resetting D1 portfolio...");
          for (const item of portfolioSync.portfolio || []) {
            await deletePortfolioSync(item.id);
          }
        }

        localStorage.removeItem('td_albums');
        localStorage.removeItem('td_packages_v2');
        localStorage.removeItem('td_packages_v3');
        localStorage.removeItem('td_packages_v4');
        localStorage.removeItem('td_services');
        localStorage.removeItem('td_services_v2');
        localStorage.removeItem('td_service_categories_v2');
        localStorage.removeItem('td_portfolio');
        localStorage.removeItem('td_team');
        await refreshData();
        showAlert('Data successfully reset to default presets!', 'warning');
      }
    );
  };

  const activeAlbumObj = albums.find(a => a.id === selectedAlbumId);

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        {/* Animated background */}
        <div className="login-bg-glow-orange"></div>
        <div className="login-bg-glow-purple"></div>
        <div className="login-floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        {/* Login Container */}
        <div className="login-container">
          <div className="login-card-glass">

            {/* Header */}
            <div className="login-header animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="login-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span>Dream <span className="logo-highlight">Photography</span></span>
              </div>
              <h2 className="login-title mitshuka-title-font" style={{ color: 'var(--primary)' }}>Admin Console</h2>
              <p className="login-subtitle">Secure access to control center & galleries</p>
            </div>

            {authStep === 'login' ? (
              /* Step 1: Login Form */
              <form onSubmit={handleLoginSubmit} className="login-form-content animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {loginError && (
                  <div className="auth-error-box animate-shake">
                    <AlertCircle size={16} />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="login-input-group">
                  <label className="login-label">Email Address</label>
                  <div className="login-input-wrapper">
                    <Mail size={18} className="login-input-icon" />
                    <input
                      type="email"
                      className="login-input-control"
                      placeholder="admin@thenidream.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={authLoading}
                    />
                  </div>
                </div>

                <div className="login-input-group">
                  <label className="login-label">Password</label>
                  <div className="login-input-wrapper">
                    <Lock size={18} className="login-input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="login-input-control"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={authLoading}
                    />
                    <button
                      type="button"
                      className="login-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={authLoading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="login-options-row">
                  <label className="login-remember-me">
                    <input
                      type="checkbox"
                      className="login-checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={authLoading}
                    />
                    <span>Remember Me</span>
                  </label>
                  <button
                    type="button"
                    className="login-forgot-link"
                    onClick={() => alert("Password reset link has been simulated. Hint: Password is 'admin'.")}
                    disabled={authLoading}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn-login-submit"
                  disabled={authLoading}
                >
                  {authLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" style={{ marginRight: '8px' }} />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed with Login</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: 2FA OTP Form */
              <form onSubmit={handleOtpSubmit} className="login-form-content animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {otpError && (
                  <div className="auth-error-box animate-shake">
                    <AlertCircle size={16} />
                    <span>{otpError}</span>
                  </div>
                )}

                {authSuccess ? (
                  <div className="auth-success-screen animate-scale-up">
                    <div className="success-checkmark-circle">
                      <Check size={40} className="success-check-icon" />
                    </div>
                    <h3 className="success-title">Login Successful!</h3>
                    <p className="success-desc">Redirecting to Dashboard...</p>
                  </div>
                ) : (
                  <>
                    <div className="login-input-group animate-slide-up">
                      <div className="otp-header-info">
                        <Key size={24} className="otp-info-icon" />
                        <label className="login-label text-center">Two-Factor Authentication (OTP)</label>
                        <p className="otp-instructions">We've simulated sending a 6-digit verification code to your device.</p>
                      </div>

                      <div className="login-input-wrapper">
                        <ShieldCheck size={18} className="login-input-icon" />
                        <input
                          type="text"
                          maxLength={6}
                          pattern="[0-9]*"
                          className="login-input-control font-mono tracking-widest text-center text-lg"
                          placeholder="123456"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          required
                          disabled={authLoading}
                        />
                      </div>
                      <span className="otp-code-hint text-center">Hint: Enter 123456</span>
                    </div>

                    <button
                      type="submit"
                      className="btn-login-submit btn-otp-verify animate-slide-up"
                      disabled={authLoading}
                    >
                      {authLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" style={{ marginRight: '8px' }} />
                          <span>Verifying Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Log In</span>
                          <Check size={18} />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn-otp-back animate-slide-up"
                      onClick={() => { setAuthStep('login'); setOtpCode(''); setOtpError(''); }}
                      disabled={authLoading}
                    >
                      Back to Credentials
                    </button>
                  </>
                )}
              </form>
            )}

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-wrapper">
      {/* Admin Container */}
      <section className="admin-main-section section-padding">
        <div className="admin-container">

          {/* Global Alert Notification */}
          {alertMsg.text && (
            <div className={`alert-toast animate-fade-in ${alertMsg.type === 'danger' ? 'alert-danger' : alertMsg.type === 'warning' ? 'alert-warning' : 'alert-success'}`}>
              <Check size={18} className="alert-icon" />
              <span>{alertMsg.text}</span>
            </div>
          )}

          <div className="admin-grid-layout">

            {/* Sidebar Navigation */}
            <aside className="admin-sidebar glass-card etech-curve">
              <div className="sidebar-menu-section">
                <h5 className="sidebar-menu-category">General</h5>
                <nav className="sidebar-menu">
                  <button
                    className={`menu-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('portfolio');
                      setEditingPortfolioId('');
                      setPortfolioForm({ title: '', category: 'Wedding', image: '/pic/pic-6.jpeg', albumId: '' });
                    }}
                  >
                    <Camera size={18} />
                    <span>Portfolio page showcase</span>
                  </button>
                  <button
                    className={`menu-btn ${activeTab === 'galleries' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('galleries');
                      setSelectedAlbumId('');
                      setIsEditAlbumModalOpen(false);
                      setEditingAlbumObj(null);
                    }}
                  >
                    <ImageIcon size={18} />
                    <span>Grid gallery album</span>
                  </button>
                  <button
                    className={`menu-btn ${activeTab === 'packages' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('packages');
                      setSelectedAlbumId('');
                    }}
                  >
                    <Package size={18} />
                    <span>Pricing Packages</span>
                  </button>
                  <button
                    className={`menu-btn ${activeTab === 'team' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('team');
                      setSelectedAlbumId('');
                    }}
                  >
                    <Users size={18} />
                    <span>Meet Team</span>
                  </button>
                  <button
                    className={`menu-btn ${activeTab === 'services-management' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('services-management');
                      setSelectedAlbumId('');
                    }}
                  >
                    <Sparkles size={18} />
                    <span>Manage Services</span>
                  </button>
                </nav>
              </div>

              <div className="sidebar-menu-section" style={{ marginTop: '20px' }}>
                <h5 className="sidebar-menu-category">Client Album</h5>
                <nav className="sidebar-menu">
                  <button
                    className={`menu-btn ${activeTab === 'client-add' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('client-add');
                      setSelectedAlbumId('');
                    }}
                  >
                    <Users size={18} />
                    <span>Add Client Details</span>
                  </button>
                  <button
                    className={`menu-btn ${activeTab === 'client-manage' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('client-manage');
                      setSelectedAlbumId('');
                      setIsEditAlbumModalOpen(false);
                      setEditingAlbumObj(null);
                    }}
                  >
                    <LayoutDashboard size={18} />
                    <span>Manage Client Albums</span>
                  </button>
                  <button
                    className={`menu-btn ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('settings');
                      setSelectedAlbumId('');
                      setIsEditAlbumModalOpen(false);
                      setEditingAlbumObj(null);
                    }}
                    style={{ marginTop: '10px' }}
                  >
                    <Settings size={18} />
                    <span>System Settings</span>
                  </button>
                  <button
                    className="menu-btn logout-btn"
                    onClick={handleLogout}
                    style={{ color: '#ef4444', marginTop: '10px' }}
                  >
                    <LogOut size={18} />
                    <span>Log Out</span>
                  </button>
                </nav>
              </div>
            </aside>

            {/* Content Display Area */}
            <main className="admin-content-area">


              {/* --- TAB: GALLERIES & ALBUMS --- */}
              {activeTab === 'galleries' && !selectedAlbumId && (
                <div className="tab-pane animate-fade-in glass-card etech-curve" style={{ padding: '2rem', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 className="pane-subtitle serif-font" style={{ margin: 0 }}>Grid Gallery / Albums</h3>
                    <button
                      onClick={() => setIsCreateAlbumModalOpen(true)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.65rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Plus size={16} /> Create Album
                    </button>
                  </div>

                  {/* Album Grid */}
                  <div className="client-register-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {albums.filter(a => a.albumType !== 'client').length === 0 ? (
                      <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
                        <AlertCircle size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.6 }} className="animate-pulse" />
                        <p style={{ fontWeight: '600' }}>No albums created yet.</p>
                        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.25rem' }}>Click "Create Album" at the top right to start adding.</p>
                      </div>
                    ) : (
                      albums.filter(a => a.albumType !== 'client').map((a) => (
                        <div
                          key={a.id}
                          className="client-register-card glass-card etech-curve"
                          style={{
                            padding: '1.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: '1px solid rgba(0, 0, 0, 0.04)',
                            background: '#ffffff',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '220px',
                            position: 'relative'
                          }}
                          onClick={() => setSelectedAlbumId(a.id)}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                              <span className="album-badge-vip" style={{ margin: 0 }}>PORTFOLIO ALBUM</span>
                            </div>
                            <h3 className="serif-font" style={{ fontSize: '1.25rem', color: '#1f2937', margin: '0 0 0.25rem 0', paddingRight: '24px' }}>{a.eventName}</h3>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 1rem 0', fontWeight: '500' }}>Category: {a.category}</p>
                          </div>

                          <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#4b5563' }}>
                              <span style={{ fontWeight: 'bold' }}>Event Date:</span> {a.eventDate}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#4b5563' }}>
                              <span style={{ fontWeight: 'bold' }}>Location:</span> {a.location}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                              <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <span style={{ fontSize: '0.75rem', background: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '20px', color: '#4b5563', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <ImageIcon size={12} /> {a.photos?.length || 0} Photos
                                </span>
                                <span style={{ fontSize: '0.75rem', background: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '20px', color: '#4b5563', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Plus size={12} /> {a.videos?.length || 0} Videos
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', zIndex: 10 }}>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleStartEditAlbum(a); }}
                                  className="btn-icon-sm"
                                  style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(249, 115, 22, 0.08)', color: 'var(--primary)', border: 'none', cursor: 'pointer' }}
                                  title="Edit Album Details"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(a.id); }}
                                  className="btn-icon-danger-sm"
                                  style={{ padding: '0.4rem', borderRadius: '8px' }}
                                  title="Delete Album"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {((activeTab === 'galleries' || activeTab === 'client-manage') && selectedAlbumId) && (
                <div className="tab-pane animate-fade-in glass-card etech-curve" style={{ padding: '2rem', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.04)' }}>
                  {activeAlbumObj ? (
                    <>
                      {/* Sticky Header Container */}
                      <div className="album-sticky-header">
                        {/* Navigation Top Bar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
                          <button
                            onClick={() => setSelectedAlbumId('')}
                            className="btn btn-outline btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}
                          >
                            <ChevronLeft size={16} /> Back to Albums List
                          </button>

                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'bold', fontFamily: 'monospace', background: 'rgba(249, 115, 22, 0.08)', padding: '0.35rem 0.65rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center' }}>
                              CODE: {activeAlbumObj.eventCode}
                            </span>
                          </div>
                        </div>

                        {/* Header title */}
                        <div className="active-album-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                          <span className="album-badge-vip">MANAGING ALBUM FILES</span>
                          <h2 className="serif-font album-manage-title" style={{ marginTop: '0.5rem', fontSize: '2rem' }}>{activeAlbumObj.eventName}</h2>
                          <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                            Category: <strong>{activeAlbumObj.category}</strong> | Venue: {activeAlbumObj.location} ({activeAlbumObj.eventDate})
                          </p>
                        </div>
                      </div>

                      {/* Side-by-side management view */}
                      <div className="gallery-management-split" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2.5rem', alignItems: 'start' }}>

                        {/* Left column: Upload form */}
                        <div className="album-uploader-col">
                          <div className="media-uploader-box glass-card" style={{ padding: '1.5rem', background: '#f9fafb', border: '1px solid rgba(0, 0, 0, 0.03)', borderRadius: '16px' }}>
                            <h3 className="uploader-subtitle serif-font" style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>Upload Photos & Videos</h3>
                            <form onSubmit={handleAddMedia} className="admin-form">
                              <div className="form-group">
                                <label className="form-label">Media Type</label>
                                <select
                                  className="form-control"
                                  value={newMedia.type}
                                  disabled={mediaUploading}
                                  onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value })}
                                  style={{ height: '40px', borderRadius: '8px', padding: '0 12px' }}
                                >
                                  <option value="photo">Photo</option>
                                  <option value="video">Video</option>
                                </select>
                              </div>
                              <div className="form-group">
                                <label className="form-label">Title / Caption</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="e.g. Ring Exchange"
                                  value={newMedia.title}
                                  disabled={mediaUploading}
                                  onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                                  style={{ height: '40px', borderRadius: '8px', padding: '0 12px' }}
                                />
                              </div>

                              {newMedia.type === 'photo' ? (
                                <div className="photo-uploader-controls" style={{ marginTop: '0.5rem' }}>
                                  <label className="form-label">Select Mock Photo Template</label>

                                  {/* Preset grid */}
                                  <div className="preset-images-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                    {demoImages.map((img, i) => (
                                      <button
                                        type="button"
                                        key={i}
                                        className={`preset-img-btn ${newMedia.url === img.url ? 'active' : ''}`}
                                        disabled={mediaUploading}
                                        onClick={() => setNewMedia({ ...newMedia, url: img.url })}
                                        style={{ height: '54px', borderRadius: '6px' }}
                                      >
                                        <img src={img.url} alt={img.name} />
                                        <span style={{ fontSize: '0.55rem', padding: '0.05rem' }}>{img.name}</span>
                                      </button>
                                    ))}
                                  </div>

                                  <label className="form-label">Or Custom Photo URL</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Custom Photo URL (e.g. /pic/pic-1.jpeg)"
                                    value={newMedia.url}
                                    disabled={mediaUploading}
                                    onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                                    style={{ height: '40px', borderRadius: '8px', padding: '0 12px' }}
                                  />

                                  <label className="form-label" style={{ marginTop: '0.75rem' }}>Or Choose Photo File(s)</label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="form-control"
                                    disabled={mediaUploading}
                                    onChange={(e) => {
                                      const files = Array.from(e.target.files);
                                      if (activeAlbumObj && activeAlbumObj.albumType === 'client') {
                                        const maxSize = 20 * 1024 * 1024;
                                        const invalidFiles = files.filter(f => f.size > maxSize);
                                        if (invalidFiles.length > 0) {
                                          const names = invalidFiles.map(f => `${f.name} (${(f.size / (1024 * 1024)).toFixed(2)} MB)`).join(', ');
                                          showAlert(`Error: Image file size must be under 20 MB. The following file(s) exceed this limit and were rejected: ${names}`, 'danger');
                                          e.target.value = null;
                                          setNewMediaFiles([]);
                                          return;
                                        }
                                      }
                                      setNewMediaFiles(files);
                                      if (files.length > 0) {
                                        showAlert(`${files.length} photo(s) selected and ready to upload!`);
                                      }
                                    }}
                                    style={{ height: 'auto', borderRadius: '8px', padding: '8px' }}
                                  />

                                  {mediaUploading && (
                                    <div style={{
                                      marginTop: '12px',
                                      padding: '12px',
                                      borderRadius: '8px',
                                      background: 'rgba(255, 122, 0, 0.08)',
                                      border: '1px solid rgba(255, 122, 0, 0.2)',
                                      color: 'var(--primary)',
                                      fontSize: '0.9rem',
                                      fontWeight: '500'
                                    }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span>Uploading Images...</span>
                                        <span>{newMediaFiles.length > 0 ? Math.round((mediaUploadedCount / newMediaFiles.length) * 100) : 0}%</span>
                                      </div>
                                      <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                          width: `${newMediaFiles.length > 0 ? (mediaUploadedCount / newMediaFiles.length) * 100 : 0}%`,
                                          height: '100%',
                                          background: 'var(--primary)',
                                          transition: 'width 0.2s ease-out'
                                        }} />
                                      </div>
                                      <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#6b7280', textAlign: 'center' }}>
                                        Uploaded: {mediaUploadedCount} / {newMediaFiles.length} images
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="video-uploader-controls" style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                  <div className="form-group">
                                    <label className="form-label">Video Stream URL</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="MP4 video URL"
                                      value={newMedia.videoUrl}
                                      disabled={mediaUploading}
                                      onChange={(e) => setNewMedia({ ...newMedia, videoUrl: e.target.value })}
                                      style={{ height: '40px', borderRadius: '8px', padding: '0 12px' }}
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label className="form-label">Duration</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="e.g. 3:15 Mins"
                                      value={newMedia.dur}
                                      disabled={mediaUploading}
                                      onChange={(e) => setNewMedia({ ...newMedia, dur: e.target.value })}
                                      style={{ height: '40px', borderRadius: '8px', padding: '0 12px' }}
                                    />
                                  </div>
                                </div>
                              )}

                              <button 
                                type="submit" 
                                className="btn btn-secondary btn-block" 
                                disabled={mediaUploading}
                                style={{ 
                                  marginTop: '1.25rem', 
                                  height: '44px', 
                                  borderRadius: '10px', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  gap: '0.5rem',
                                  opacity: mediaUploading ? 0.7 : 1,
                                  cursor: mediaUploading ? 'not-allowed' : 'pointer'
                                }}
                              >
                                {mediaUploading ? (
                                  <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Uploading: {mediaUploadedCount} / {newMediaFiles.length} images...
                                  </>
                                ) : (
                                  <>
                                    <Upload size={16} /> Link & Upload Media
                                  </>
                                )}
                              </button>
                            </form>
                          </div>
                        </div>

                        {/* Right column: Files list */}
                        <div className="album-files-col" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                          {/* Photos Section */}
                          <div>
                            <h4 className="asset-type-header" style={{ fontSize: '1.05rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <ImageIcon size={16} /> Photos ({activeAlbumObj.photos?.length || 0})
                            </h4>
                            {(!activeAlbumObj.photos || activeAlbumObj.photos.length === 0) ? (
                              <p className="no-media-text" style={{ paddingLeft: '0.5rem' }}>No photos in this album yet.</p>
                            ) : (
                              <div className="admin-media-thumb-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1.25rem' }}>
                                {activeAlbumObj.photos.map((p) => (
                                  <div key={p.id} className="media-thumb-card glass-card" style={{ padding: '0.5rem', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '12px', background: '#ffffff' }}>
                                    <SafeImage src={p.url} alt={p.title} className="media-thumb" style={{ height: '100px', width: '100%', objectFit: 'cover', borderRadius: '8px' }} isThumbnail={true} />
                                    <div className="media-thumb-body" style={{ marginTop: '0.6rem' }}>
                                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151' }}>{p.title}</span>
                                      <button onClick={() => handleDeleteMedia('photo', p.id)} className="btn-icon-danger-sm" style={{ padding: '0.2rem' }}>
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Videos Section */}
                          <div>
                            <h4 className="asset-type-header" style={{ fontSize: '1.05rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Plus size={16} /> Videos ({activeAlbumObj.videos?.length || 0})
                            </h4>
                            {(!activeAlbumObj.videos || activeAlbumObj.videos.length === 0) ? (
                              <p className="no-media-text" style={{ paddingLeft: '0.5rem' }}>No videos in this album yet.</p>
                            ) : (
                              <div className="admin-media-thumb-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
                                {activeAlbumObj.videos.map((v) => (
                                  <div key={v.id} className="media-thumb-card glass-card" style={{ padding: '0.5rem', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '12px', background: '#ffffff' }}>
                                    <img src={v.thumb || '/pic/pic-6.jpeg'} alt={v.title} className="media-thumb" style={{ height: '110px', width: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                    <div className="media-thumb-body" style={{ marginTop: '0.6rem' }}>
                                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151' }}>{v.title} ({v.dur})</span>
                                      <button onClick={() => handleDeleteMedia('video', v.id)} className="btn-icon-danger-sm" style={{ padding: '0.2rem' }}>
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>

                      </div>
                    </>
                  ) : (
                    <div className="empty-panel-prompt">
                      <AlertCircle size={40} className="c-muted animate-pulse" />
                      <p>Create or select a client album from the sidebar to manage files.</p>
                      <button onClick={() => setSelectedAlbumId('')} className="btn btn-primary btn-sm">
                        Back to List
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* --- TAB: PORTFOLIO SHOWCASE --- */}
              {activeTab === 'portfolio' && (
                <div className="tab-pane animate-fade-in">
                  <div className="booking-split-view">

                    {/* List Grid */}
                    <div className="booking-list-panel glass-card etech-curve">
                      <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h3 className="pane-subtitle serif-font" style={{ margin: 0 }}>Showcase Gallery</h3>

                        <select
                          className="status-select-control"
                          value={portfolioFilter}
                          onChange={(e) => setPortfolioFilter(e.target.value)}
                        >
                          <option value="All">All Categories</option>
                          {portfolioCategories.map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {portfolio.filter(p => portfolioFilter === 'All' || p.category === portfolioFilter).length === 0 ? (
                        <div className="empty-panel-prompt" style={{ padding: '3rem 0' }}>
                          <AlertCircle size={32} className="c-muted" />
                          <p>No portfolio items found in this category.</p>
                        </div>
                      ) : (
                        <div className="admin-media-thumb-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
                          {portfolio
                            .filter(p => portfolioFilter === 'All' || p.category === portfolioFilter)
                            .map((p) => (
                              <div key={p.id} className="media-thumb-card glass-card">
                                <img src={p.image} alt={p.title} className="media-thumb" style={{ height: '100px', width: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                <div className="media-thumb-body" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem' }}>
                                  <span style={{ fontWeight: '600', maxWidth: '100%' }}>{p.title}</span>
                                  <span className="event-badge-pill" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', margin: 0 }}>{p.category}</span>
                                  <div style={{ display: 'flex', gap: '4px', alignSelf: 'flex-end', marginTop: '-1.2rem' }}>
                                    <button
                                      onClick={() => handleEditPortfolio(p)}
                                      className="btn-icon-sm"
                                      style={{ padding: '0.2rem', borderRadius: '4px', background: 'rgba(249, 115, 22, 0.08)', color: 'var(--primary)', border: 'none', cursor: 'pointer' }}
                                      title="Edit showcase"
                                    >
                                      <Edit2 size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeletePortfolio(p.id)}
                                      className="btn-icon-danger-sm"
                                      style={{ padding: '0.2rem', borderRadius: '4px' }}
                                      title="Delete showcase"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Add/Edit Showcase Item Form */}
                    <div className="booking-add-form-panel glass-card etech-curve">
                      <h3 className="pane-subtitle serif-font">{editingPortfolioId ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</h3>
                      <form onSubmit={handleSavePortfolio} className="admin-form">
                        <div className="form-group">
                          <label className="form-label">Showcase Title *</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Whispering Pines Shoot"
                            value={portfolioForm.title}
                            onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Category *</label>
                          <select
                            className="form-control"
                            value={portfolioForm.category}
                            onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value })}
                            required
                          >
                            {portfolioCategories.map((cat, i) => (
                              <option key={i} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>



                        <div className="form-group">
                          <label className="form-label">Select Cover Image Template or URL</label>
                          <div className="preset-images-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                            {demoImages.map((img, i) => (
                              <button
                                type="button"
                                key={i}
                                className={`preset-img-btn ${portfolioForm.image === img.url ? 'active' : ''}`}
                                onClick={() => setPortfolioForm({ ...portfolioForm, image: img.url })}
                              >
                                <img src={img.url} alt={img.name} />
                                <span>{img.name}</span>
                              </button>
                            ))}
                          </div>

                          <input
                            type="text"
                            className="form-control margin-top-sm"
                            placeholder="Custom Image URL (e.g. /pic/pic-1.jpeg)"
                            value={portfolioForm.image}
                            onChange={(e) => setPortfolioForm({ ...portfolioForm, image: e.target.value })}
                          />

                          <label className="form-label" style={{ marginTop: '0.75rem' }}>Or Choose Photo File</label>
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const id = `user_uploaded_${Date.now()}_port_${Math.random().toString(36).substr(2, 9)}`;
                                const originalUpload = await uploadImageSync(file, `${id}.jpg`);
                                if (originalUpload.configured) {
                                  setPortfolioForm({ ...portfolioForm, image: originalUpload.url });
                                  showAlert('Showcase photo file uploaded to R2!');
                                } else {
                                  await saveMediaBlob(id, file);
                                  setPortfolioForm({ ...portfolioForm, image: `indexeddb://${id}` });
                                  showAlert('Showcase photo file uploaded locally & ready!');
                                }
                              }
                            }}
                            style={{ height: 'auto', borderRadius: '8px', padding: '8px' }}
                          />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">
                          {editingPortfolioId ? 'Save Changes' : <><Plus size={16} /> Save to Portfolio</>}
                        </button>
                        {editingPortfolioId && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-block"
                            style={{ marginTop: '10px' }}
                            onClick={() => {
                              setEditingPortfolioId('');
                              setPortfolioForm({ title: '', category: 'Wedding', image: '/pic/pic-6.jpeg', albumId: '' });
                            }}
                          >
                            Cancel Edit
                          </button>
                        )}
                      </form>
                    </div>

                  </div>
                </div>
              )}

              {/* --- TAB: CLIENT REGISTRATION --- */}
              {activeTab === 'client-add' && (
                <div className="tab-pane animate-fade-in glass-card etech-curve" style={{ padding: '2.5rem', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.04)', maxWidth: '900px', margin: '0 auto' }}>
                  <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
                    <span className="album-badge-vip" style={{ background: 'rgba(249, 115, 22, 0.1)', color: 'var(--primary)', padding: '0.35rem 0.75rem', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 'bold' }}>CLIENT REGISTRATION</span>
                    <h2 className="serif-font" style={{ fontSize: '2rem', color: '#1f2937', marginTop: '0.5rem', marginBottom: '0.25rem' }}>Add Client Details</h2>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>Register a new client, define their event details, assign an access code, and upload event gallery images under 20 MB.</p>
                  </div>

                  <form onSubmit={handleCreateClientAlbum} className="admin-form">
                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>Client Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Ajith Kumar"
                          value={clientForm.clientName}
                          onChange={(e) => setClientForm({ ...clientForm, clientName: e.target.value })}
                          required
                          style={{ height: '44px', borderRadius: '10px', padding: '0 14px' }}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>Event / Album Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Ajith & Lavanya Wedding"
                          value={clientForm.eventName}
                          onChange={(e) => setClientForm({ ...clientForm, eventName: e.target.value })}
                          required
                          style={{ height: '44px', borderRadius: '10px', padding: '0 14px' }}
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>Access Code *</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. ALB827361"
                            value={clientForm.eventCode}
                            onChange={(e) => setClientForm({ ...clientForm, eventCode: e.target.value })}
                            required
                            style={{ height: '44px', borderRadius: '10px', padding: '0 14px', flex: 1 }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const randomCode = `ALB${Math.floor(100000 + Math.random() * 900000)}`;
                              setClientForm({ ...clientForm, eventCode: randomCode });
                              showAlert(`Generated code: ${randomCode}`);
                            }}
                            className="btn btn-outline"
                            style={{ height: '44px', borderRadius: '10px', padding: '0 15px', whiteSpace: 'nowrap', fontSize: '0.85rem' }}
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>Phone Number (Mobile) *</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="e.g. 9876543210"
                          value={clientForm.mobile}
                          onChange={(e) => setClientForm({ ...clientForm, mobile: e.target.value.replace(/\D/g, '') })}
                          required
                          style={{ height: '44px', borderRadius: '10px', padding: '0 14px' }}
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>Event Date (Optional)</label>
                        <input
                          type="date"
                          className="form-control"
                          value={clientForm.eventDate}
                          onChange={(e) => setClientForm({ ...clientForm, eventDate: e.target.value })}
                          style={{ height: '44px', borderRadius: '10px', padding: '0 14px' }}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>Venue Location (Optional)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Palace Hall, Theni"
                          value={clientForm.location}
                          onChange={(e) => setClientForm({ ...clientForm, location: e.target.value })}
                          style={{ height: '44px', borderRadius: '10px', padding: '0 14px' }}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: '600', color: '#374151' }}>Event Category *</label>
                      <select
                        className="form-control"
                        value={clientForm.category}
                        onChange={(e) => setClientForm({ ...clientForm, category: e.target.value })}
                        required
                        style={{ height: '44px', borderRadius: '10px', padding: '0 14px' }}
                      >
                        {portfolioCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Image uploads */}
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label className="form-label" style={{ fontWeight: '600', color: '#374151', display: 'flex', justifyContents: 'space-between', justifyContent: 'space-between' }}>
                        <span>Upload Client Images *</span>
                        <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '500' }}>Strict Limit: Max 20 MB per image</span>
                      </label>

                      {/* Dropzone container */}
                      <div
                        style={{
                          border: '2px dashed rgba(249, 115, 22, 0.3)',
                          borderRadius: '16px',
                          padding: '2.5rem 1.5rem',
                          textAlign: 'center',
                          background: 'rgba(249, 115, 22, 0.02)',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.2s ease'
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                          const maxSize = 20 * 1024 * 1024;
                          const invalidFiles = files.filter(f => f.size > maxSize);
                          if (invalidFiles.length > 0) {
                            const names = invalidFiles.map(f => `${f.name} (${(f.size / (1024 * 1024)).toFixed(2)} MB)`).join(', ');
                            showAlert(`Error: The following file(s) exceed the 20 MB limit and were rejected: ${names}`, 'danger');
                            return;
                          }
                          setClientFiles(files);
                          showAlert(`${files.length} photo(s) dropped successfully!`);
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleClientFileChange}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer',
                            zIndex: 2
                          }}
                          required={clientFiles.length === 0}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <Upload size={24} />
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: '700', color: '#374151', fontSize: '0.95rem' }}>Drag and drop images here, or click to browse</p>
                            <p style={{ margin: '0.25rem 0 0 0', color: '#9ca3af', fontSize: '0.8rem' }}>Supports PNG, JPG, JPEG up to 20 MB each</p>
                          </div>
                        </div>
                      </div>

                      {/* Selected files preview */}
                      {clientFiles.length > 0 && (
                        <div style={{ marginTop: '1.25rem', background: '#f9fafb', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                          <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#4b5563', fontWeight: 'bold' }}>Selected Files ({clientFiles.length})</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                            {clientFiles.map((f, index) => (
                              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#4b5563', padding: '0.25rem 0.5rem', background: '#ffffff', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.02)' }}>
                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '70%', fontWeight: '500' }}>{f.name}</span>
                                <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={clientUploading}
                      className="btn btn-primary btn-block"
                      style={{
                        height: '48px',
                        borderRadius: '12px',
                        marginTop: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        background: 'linear-gradient(135deg, var(--primary) 0%, #ff8a50 100%)',
                        border: 'none',
                        color: '#ffffff',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        boxShadow: '0 4px 15px rgba(249, 115, 22, 0.2)'
                      }}
                    >
                      {clientUploading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Uploading & Registering Client...</span>
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          <span>Register Client & Create Album</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* --- TAB: MANAGE CLIENT ALBUMS --- */}
              {activeTab === 'client-manage' && !selectedAlbumId && (
                <div className="tab-pane animate-fade-in glass-card etech-curve" style={{ padding: '2rem', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                      <h3 className="pane-subtitle serif-font" style={{ margin: 0, fontSize: '1.75rem' }}>Client Albums</h3>
                      <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>Manage client access passcodes, upload photos, and update event details.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('client-add')}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.65rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Plus size={16} /> Add Client Album
                    </button>
                  </div>

                  {/* Client Albums Grid */}
                  <div className="client-register-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {albums.filter(a => a.albumType === 'client').length === 0 ? (
                      <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
                        <AlertCircle size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.6 }} className="animate-pulse" />
                        <p style={{ fontWeight: '600' }}>No client albums registered yet.</p>
                        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.25rem' }}>Click "Add Client Album" to register your first client.</p>
                      </div>
                    ) : (
                      albums
                        .filter(a => a.albumType === 'client')
                        .map((a) => (
                          <div
                            key={a.id}
                            className="client-register-card glass-card etech-curve"
                            style={{
                              padding: '1.5rem',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              border: '1px solid rgba(0, 0, 0, 0.04)',
                              background: '#ffffff',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              minHeight: '220px',
                              position: 'relative'
                            }}
                            onClick={() => setSelectedAlbumId(a.id)}
                          >
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <span className="album-badge-vip" style={{ margin: 0, background: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6' }}>CLIENT PORTAL ALBUM</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace', background: 'rgba(0, 0, 0, 0.04)', padding: '0.2rem 0.4rem', borderRadius: '4px', color: '#374151' }}>
                                  CODE: {a.eventCode}
                                </span>
                              </div>
                              <h3 className="serif-font" style={{ fontSize: '1.25rem', color: '#1f2937', margin: '0 0 0.25rem 0', paddingRight: '24px' }}>{a.eventName}</h3>
                              <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 1rem 0', fontWeight: '500' }}>Client: <strong>{a.clientName}</strong> | Phone: {a.mobile}</p>
                            </div>

                            <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#4b5563' }}>
                                <span style={{ fontWeight: 'bold' }}>Event Date:</span> {a.eventDate}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#4b5563' }}>
                                <span style={{ fontWeight: 'bold' }}>Location:</span> {a.location}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                  <span style={{ fontSize: '0.75rem', background: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '20px', color: '#4b5563', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <ImageIcon size={12} /> {a.photos?.length || 0} Photos
                                  </span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', zIndex: 10 }}>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleStartEditAlbum(a); }}
                                    className="btn-icon-sm"
                                    style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(249, 115, 22, 0.08)', color: 'var(--primary)', border: 'none', cursor: 'pointer' }}
                                    title="Edit Album Details"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(a.id); }}
                                    className="btn-icon-danger-sm"
                                    style={{ padding: '0.4rem', borderRadius: '8px' }}
                                    title="Delete Album"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}

              {/* --- TAB: PACKAGES --- */}
              {activeTab === 'packages' && (
                <div className="tab-pane animate-fade-in">

                  {/* Packages Header */}
                  <div className="section-header-box" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h3 className="serif-font" style={{ fontSize: '24px', fontWeight: '700', color: 'var(--fg-main)' }}>Pricing Packages</h3>
                      <p style={{ color: 'var(--fg-muted)', fontSize: '14px', marginTop: '5px' }}>
                        Manage the wedding & photography package details, pricing, and features shown to clients.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-add-new-glow"
                      onClick={() => {
                        setEditingPackageIndex(-1);
                        setPackageForm({ name: '', price: '', type: 'Standard', desc: '', popular: false, features: '' });
                        setIsPkgFormOpen(true);
                      }}
                    >
                      <Plus size={18} />
                      <span>Add Package</span>
                    </button>
                  </div>

                  {/* packages list rendering */}
                  <div className="packages-cards-grid">
                    {packages.map((pkg, idx) => (
                      <div key={idx} className={`package-visual-card glass-card etech-curve ${pkg.popular ? 'popular-card' : ''}`}>
                        {pkg.popular && (
                          <div className="popular-badge-glow">
                            <Sparkles size={12} />
                            <span>Featured</span>
                          </div>
                        )}

                        <div className="card-top-info">
                          <span className="package-tier-label">{pkg.type || 'Standard'}</span>
                          <h3 className="package-card-title serif-font">{pkg.name}</h3>
                          <div className="package-card-price-container">
                            <span className="price-symbol">₹</span>
                            <span className="price-amount">{pkg.price}</span>
                            <span className="price-period">/ Event</span>
                          </div>
                          <p className="package-card-desc">{pkg.desc}</p>
                        </div>

                        <div className="package-card-features-container">
                          <h4 className="features-title">What's Included:</h4>
                          <ul className="package-card-features-list">
                            {pkg.features && pkg.features.map((f, fIdx) => (
                              <li key={fIdx} className={`feature-item ${f.include ? 'included' : 'excluded'}`}>
                                <span className="feature-icon">
                                  {f.include ? <Check size={14} /> : <X size={14} />}
                                </span>
                                <span className="feature-text">{f.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="package-card-actions">
                          <button
                            type="button"
                            className="card-edit-btn"
                            onClick={() => {
                              handleEditPackage(idx);
                              setIsPkgFormOpen(true);
                            }}
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            type="button"
                            className="card-delete-btn"
                            onClick={() => handleDeletePackage(idx)}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- TAB: MEET TEAM --- */}
              {activeTab === 'team' && (
                <div className="tab-pane animate-fade-in glass-card etech-curve" style={{ padding: '2rem', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                      <h3 className="pane-subtitle serif-font" style={{ margin: 0, fontSize: '1.75rem' }}>Meet Team</h3>
                      <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>Manage team members, roles, bios, and portrait pictures shown on the About page.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingTeamId('');
                        setTeamForm({ name: '', role: '', bio: '', image: '/pic/pic-5.png' });
                        setIsTeamFormOpen(true);
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.65rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Plus size={16} /> Add Member
                    </button>
                  </div>

                  {/* Team Members Grid */}
                  <div className="services-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {team.length === 0 ? (
                      <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
                        <AlertCircle size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.6 }} className="animate-pulse" />
                        <p style={{ fontWeight: '600' }}>No team members registered yet.</p>
                        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.25rem' }}>Click "Add Member" to start building your crew.</p>
                      </div>
                    ) : (
                      team.map((member) => (
                        <div
                          key={member.id}
                          className="service-visual-card glass-card etech-curve"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            border: '1px solid rgba(0, 0, 0, 0.04)',
                            background: '#ffffff',
                            overflow: 'hidden'
                          }}
                        >
                          <div className="service-card-image-wrapper" style={{ height: '200px', position: 'relative' }}>
                            <SafeImage src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} isThumbnail={true} />
                          </div>

                          <div className="service-card-body" style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <h3 className="service-card-title serif-font" style={{ fontSize: '1.25rem', margin: 0 }}>{member.name}</h3>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{member.role}</span>
                            <p className="service-card-desc" style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0, lineHeight: '1.4' }}>{member.bio}</p>
                          </div>

                          <div className="service-card-actions" style={{ display: 'flex', gap: '0.5rem', padding: '1rem 1.25rem', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                            <button
                              type="button"
                              className="card-edit-btn"
                              onClick={() => {
                                handleEditTeam(member);
                                setIsTeamFormOpen(true);
                              }}
                              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            <button
                              type="button"
                              className="card-delete-btn"
                              onClick={() => handleDeleteTeam(member.id)}
                              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* --- TAB: SERVICES PAGE DETAILS MANAGEMENT --- */}
              {activeTab === 'services-management' && (
                <div className="tab-pane animate-fade-in">
                  <div className="section-header-box" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h3 className="serif-font" style={{ fontSize: '24px', fontWeight: '700', color: 'var(--fg-main)' }}>Services & Categories Manager</h3>
                      <p style={{ color: 'var(--fg-muted)', fontSize: '14px', marginTop: '5px' }}>
                        Add, edit, or remove service categories, service names, images, and sub-services listed on the public Services page.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={handleAddNewCategoryClick}
                    >
                      <Plus size={16} /> Add Category
                    </button>
                  </div>

                  <div className="categories-management-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {adminCategories.map(cat => (
                      <div key={cat.id} className="category-admin-card glass-card etech-curve" style={{ padding: '30px', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                        
                        {/* Category Header Info */}
                        <div className="category-admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '20px', marginBottom: '20px' }}>
                          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <img src={cat.image} alt={cat.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' }} />
                            <div>
                              <h4 className="serif-font" style={{ fontSize: '20px', fontWeight: '700', color: 'var(--fg-main)', margin: 0 }}>{cat.name}</h4>
                              <p style={{ color: 'var(--fg-muted)', fontSize: '13.5px', margin: '5px 0' }}>{cat.desc}</p>
                              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>Starts from ₹{cat.price}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                              onClick={() => handleEditCategory(cat)}
                            >
                              <Edit2 size={14} /> Edit Category
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                              onClick={() => handleAddNewCatServiceClick(cat.id)}
                            >
                              <Plus size={14} /> Add Service
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm"
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)' }}
                              onClick={() => handleDeleteCategory(cat.id)}
                            >
                              <Trash2 size={14} /> Delete Category
                            </button>
                          </div>
                        </div>

                        {/* Category Services Grid */}
                        <h5 style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--fg-muted)', marginBottom: '15px' }}>Services inside category</h5>
                        
                        {(!cat.services || cat.services.length === 0) ? (
                          <p style={{ fontStyle: 'italic', color: 'var(--fg-muted)', fontSize: '13.5px', padding: '15px 0' }}>No services in this category. Click "Add Service" above to create one.</p>
                        ) : (
                          <div className="services-admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {cat.services.map(svc => (
                              <div key={svc.id} className="service-admin-item glass-card etech-curve" style={{ border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '140px', width: '100%', position: 'relative' }}>
                                  <img src={svc.image} alt={svc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'var(--primary)', color: 'white', fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px' }}>
                                    Starts from ₹{svc.price}
                                  </div>
                                </div>
                                <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                  <h6 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--fg-main)', margin: '0 0 10px 0' }}>{svc.name}</h6>
                                  
                                  {svc.subServices && svc.subServices.length > 0 && (
                                    <div style={{ flexGrow: 1 }}>
                                      <span style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--fg-muted)', display: 'block', marginBottom: '5px' }}>Sub-services:</span>
                                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {svc.subServices.map((sub, sIdx) => (
                                          <li key={sIdx} style={{ fontSize: '11.5px', color: 'var(--fg-muted)', background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '4px' }}>
                                            {sub}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '12px' }}>
                                    <button
                                      type="button"
                                      className="card-edit-btn"
                                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', padding: '6px 12px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '6px', background: 'transparent', cursor: 'pointer', flex: 1, justifyContent: 'center' }}
                                      onClick={() => handleEditCatService(cat.id, svc)}
                                    >
                                      <Edit2 size={12} /> Edit
                                    </button>
                                    <button
                                      type="button"
                                      className="card-delete-btn"
                                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', padding: '6px 12px', border: '1px solid rgba(220,38,38,0.1)', color: '#dc2626', borderRadius: '6px', background: 'transparent', cursor: 'pointer', flex: 1, justifyContent: 'center' }}
                                      onClick={() => handleDeleteCatService(cat.id, svc.id)}
                                    >
                                      <Trash2 size={12} /> Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    ))}
                  </div>



                </div>
              )}

              {/* --- TAB: SETTINGS --- */}
              {activeTab === 'settings' && (
                <div className="tab-pane animate-fade-in glass-card" style={{ padding: '2rem' }}>
                  <h3 className="pane-subtitle serif-font">System Settings</h3>
                  <p className="margin-bottom-sm" style={{ color: 'var(--fg-muted)' }}>
                    Manage application configuration, reset database structures, and control developer setups.
                  </p>

                  <hr className="divider" />

                  <div className="settings-section-card" style={{ marginBottom: '2.5rem' }}>
                    <h4 className="form-inside-title serif-font" style={{ fontSize: '18px', fontWeight: '700', marginBottom: '1rem', color: 'var(--fg-main)' }}>Change Admin Credentials</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--fg-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                      Update the login email address and secure password for this administrative console.
                    </p>

                    {credError && (
                      <div className="error-alert-box" style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', color: '#dc2626', fontSize: '13.5px', marginBottom: '1.25rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <AlertCircle size={16} />
                        <span>{credError}</span>
                      </div>
                    )}

                    {credSuccess && (
                      <div className="success-alert-box" style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.15)', color: '#16a34a', fontSize: '13.5px', marginBottom: '1.25rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <CheckCircle size={16} />
                        <span>{credSuccess}</span>
                      </div>
                    )}

                    <form onSubmit={handleChangeCredentials} className="admin-form" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label" style={{ fontWeight: '600', color: 'var(--fg-muted)', fontSize: '13px' }}>Current Email *</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Current Admin Email"
                            value={credForm.currentEmail}
                            onChange={(e) => setCredForm({ ...credForm, currentEmail: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" style={{ fontWeight: '600', color: 'var(--fg-muted)', fontSize: '13px' }}>New Email *</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="New Admin Email"
                            value={credForm.newEmail}
                            onChange={(e) => setCredForm({ ...credForm, newEmail: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '600', color: 'var(--fg-muted)', fontSize: '13px' }}>Current Password *</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Current Password"
                          value={credForm.currentPassword}
                          onChange={(e) => setCredForm({ ...credForm, currentPassword: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label className="form-label" style={{ fontWeight: '600', color: 'var(--fg-muted)', fontSize: '13px' }}>New Password *</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="New Secure Password"
                            value={credForm.newPassword}
                            onChange={(e) => setCredForm({ ...credForm, newPassword: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" style={{ fontWeight: '600', color: 'var(--fg-muted)', fontSize: '13px' }}>Confirm New Password *</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm New Password"
                            value={credForm.confirmNewPassword}
                            onChange={(e) => setCredForm({ ...credForm, confirmNewPassword: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                        Update Credentials
                      </button>
                    </form>
                  </div>

                  <hr className="divider" style={{ margin: '2.5rem 0' }} />

                  <div className="settings-section-card">
                    <h4 className="form-inside-title">Database Cleanup & Reset</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--fg-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                      Reverts all customized client albums, wedding photography services, portfolio categories, and packages back to original factory presets. This action cannot be undone.
                    </p>
                    <button
                      onClick={handleResetToDefaults}
                      className="btn btn-outline"
                      style={{ borderColor: '#ef4444', color: '#ef4444' }}
                    >
                      Reset App defaults
                    </button>
                  </div>
                </div>
              )}

            </main>
          </div>

        </div>
      </section>

      {/* Create Album Modal */}
      {isCreateAlbumModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateAlbumModalOpen(false)}>
          <div className="modal-container glass-card etech-curve" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title serif-font">Create New Portfolio Album</h3>
              <button className="modal-close-btn" onClick={() => setIsCreateAlbumModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={async (e) => { e.preventDefault(); await handleCreateAlbum(e); setIsCreateAlbumModalOpen(false); }} className="admin-form" style={{ padding: '1.5rem 2rem 2rem 2rem' }}>
              <div className="form-group">
                <label className="form-label">Album Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ajith & Lavanya Grand Wedding"
                  value={newAlbum.eventName}
                  onChange={(e) => setNewAlbum({ ...newAlbum, eventName: e.target.value })}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Event Date (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. June 15, 2026"
                    value={newAlbum.eventDate}
                    onChange={(e) => setNewAlbum({ ...newAlbum, eventDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Venue Location (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Theni Palace Hall"
                    value={newAlbum.location}
                    onChange={(e) => setNewAlbum({ ...newAlbum, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-control"
                  value={newAlbum.category}
                  onChange={(e) => setNewAlbum({ ...newAlbum, category: e.target.value })}
                  required
                >
                  {portfolioCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Choose/Upload Pictures * (First selected photo will be the cover photo)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="form-control"
                  onChange={(e) => setNewAlbumPhotosFiles(Array.from(e.target.files))}
                  style={{ height: 'auto', borderRadius: '8px', padding: '8px' }}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block margin-top-sm">
                <Plus size={16} /> Create & Select Album
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Album Modal */}
      {isEditAlbumModalOpen && editingAlbumObj && (
        <div className="modal-backdrop" onClick={() => { setIsEditAlbumModalOpen(false); setEditingAlbumObj(null); }}>
          <div className="modal-container glass-card etech-curve" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title serif-font">Edit Album Details</h3>
              <button className="modal-close-btn" onClick={() => { setIsEditAlbumModalOpen(false); setEditingAlbumObj(null); }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveEditAlbum} className="admin-form" style={{ padding: '1.5rem 2rem 2rem 2rem' }}>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Client Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Client Name"
                    value={editingAlbumObj.clientName}
                    onChange={(e) => setEditingAlbumObj({ ...editingAlbumObj, clientName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Event Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Event Name"
                    value={editingAlbumObj.eventName}
                    onChange={(e) => setEditingAlbumObj({ ...editingAlbumObj, eventName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Access Code *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Event Code"
                    value={editingAlbumObj.eventCode}
                    onChange={(e) => setEditingAlbumObj({ ...editingAlbumObj, eventCode: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number (Mobile)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone Number"
                    value={editingAlbumObj.mobile}
                    onChange={(e) => setEditingAlbumObj({ ...editingAlbumObj, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Event Date (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Event Date"
                    value={editingAlbumObj.eventDate}
                    onChange={(e) => setEditingAlbumObj({ ...editingAlbumObj, eventDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Venue Location (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Venue Location"
                    value={editingAlbumObj.location}
                    onChange={(e) => setEditingAlbumObj({ ...editingAlbumObj, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-control"
                  value={editingAlbumObj.category}
                  onChange={(e) => setEditingAlbumObj({ ...editingAlbumObj, category: e.target.value })}
                  required
                >
                  {portfolioCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-row-2" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary btn-block">
                  <Check size={16} /> Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-block"
                  onClick={() => { setIsEditAlbumModalOpen(false); setEditingAlbumObj(null); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="modal-backdrop" onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}>
          <div className="modal-container glass-card etech-curve confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <h3 className="modal-title serif-font" style={{ color: '#ef4444' }}>{confirmModal.title}</h3>
              <button className="modal-close-btn" onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '1.5rem' }}>
              <p style={{ margin: 0, color: '#1f2937', fontSize: '0.95rem', lineHeight: '1.5' }}>{confirmModal.message}</p>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1rem 1.5rem', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                style={{ minWidth: '80px' }}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={confirmModal.onConfirm}
                style={{ backgroundColor: '#ef4444', color: '#ffffff', minWidth: '80px', border: 'none' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Modal Form */}
      {isPkgFormOpen && (
        <div className="modal-backdrop" onClick={() => {
          setIsPkgFormOpen(false);
          setEditingPackageIndex(-1);
          setPackageForm({ name: '', price: '', type: 'Standard', desc: '', popular: false, features: '' });
        }}>
          <div className="modal-container glass-card etech-curve" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title serif-font">{editingPackageIndex > -1 ? 'Edit Package Details' : 'Add New Package'}</h3>
              <button className="modal-close-btn" onClick={() => {
                setIsPkgFormOpen(false);
                setEditingPackageIndex(-1);
                setPackageForm({ name: '', price: '', type: 'Standard', desc: '', popular: false, features: '' });
              }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={(e) => { handleSavePackage(e); setIsPkgFormOpen(false); }} className="admin-form" style={{ padding: '1.5rem 2rem 2rem 2rem' }}>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Package Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Silver Package"
                    value={packageForm.name}
                    onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                    required
                    style={{ padding: '0 12px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price (INR) *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 45,000"
                    value={packageForm.price}
                    onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                    required
                    style={{ padding: '0 12px' }}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Sub-Tier Label</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Standard, Popular, Ultimate"
                    value={packageForm.type}
                    onChange={(e) => setPackageForm({ ...packageForm, type: e.target.value })}
                    style={{ padding: '0 12px' }}
                  />
                </div>

                <div className="form-group flex-align-center" style={{ marginTop: '1.8rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="pkg-popular-modal"
                    className="checkbox-input"
                    checked={packageForm.popular}
                    onChange={(e) => setPackageForm({ ...packageForm, popular: e.target.checked })}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="pkg-popular-modal" className="form-label pointer" style={{ margin: 0, cursor: 'pointer' }}>Is Featured (Popular)</label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Brief marketing summary of the package..."
                  value={packageForm.desc}
                  onChange={(e) => setPackageForm({ ...packageForm, desc: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Features list (+ for Include, - for Exclude, one per line)</label>
                <textarea
                  className="form-control font-mono"
                  rows="4"
                  placeholder={"+ Full Day Coverage\n+ 2 Photographers\n- Traditional Video"}
                  value={packageForm.features}
                  onChange={(e) => setPackageForm({ ...packageForm, features: e.target.value })}
                />
              </div>

              <div className="form-row-2" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary btn-block">
                  <Check size={16} /> Save Package
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-block"
                  onClick={() => {
                    setIsPkgFormOpen(false);
                    setEditingPackageIndex(-1);
                    setPackageForm({ name: '', price: '', type: 'Standard', desc: '', popular: false, features: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Team Member Modal Form */}
      {isTeamFormOpen && (
        <div className="modal-backdrop" onClick={() => {
          setIsTeamFormOpen(false);
          setEditingTeamId('');
          setTeamForm({ name: '', role: '', bio: '', image: '/pic/pic-5.png' });
        }}>
          <div className="modal-container glass-card etech-curve" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title serif-font">{editingTeamId ? 'Edit Team Member Details' : 'Add New Team Member'}</h3>
              <button className="modal-close-btn" onClick={() => {
                setIsTeamFormOpen(false);
                setEditingTeamId('');
                setTeamForm({ name: '', role: '', bio: '', image: '/pic/pic-5.png' });
              }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={(e) => { handleSaveTeam(e); setIsTeamFormOpen(false); }} className="admin-form" style={{ padding: '1.5rem 2rem 2rem 2rem' }}>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. J.P. Ganesan"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    required
                    style={{ height: '44px', borderRadius: '10px', padding: '0 14px', width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role / Specialty *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Founder & Lead Photographer"
                    value={teamForm.role}
                    onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                    required
                    style={{ height: '44px', borderRadius: '10px', padding: '0 14px', width: '100%' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Portrait Preview</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }}>
                    <SafeImage src={teamForm.image || '/pic/pic-5.png'} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} isThumbnail={true} />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280', wordBreak: 'break-all' }}>Current path: {teamForm.image}</span>
                </div>

                <label className="form-label">Select Portrait Template</label>
                <div className="preset-images-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {demoImages.slice(4, 7).map((img, i) => (
                    <button
                      type="button"
                      key={i}
                      className={`preset-img-btn ${teamForm.image === img.url ? 'active' : ''}`}
                      onClick={() => setTeamForm({ ...teamForm, image: img.url })}
                      style={{ height: '54px', borderRadius: '6px' }}
                    >
                      <img src={img.url} alt={img.name} />
                      <span style={{ fontSize: '0.55rem', padding: '0.1rem' }}>{img.name}</span>
                    </button>
                  ))}
                </div>

                <label className="form-label">Or Custom Portrait URL</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Custom Image URL"
                  value={teamForm.image}
                  onChange={(e) => setTeamForm({ ...teamForm, image: e.target.value })}
                  style={{ height: '44px', borderRadius: '10px', padding: '0 14px', width: '100%' }}
                />

                <label className="form-label" style={{ marginTop: '0.75rem' }}>Or Choose Portrait File</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const id = `user_uploaded_${Date.now()}_team_${Math.random().toString(36).substr(2, 9)}`;
                      const originalUpload = await uploadImageSync(file, `${id}.jpg`);
                      if (originalUpload.configured) {
                        setTeamForm({ ...teamForm, image: originalUpload.url });
                        showAlert('Portrait photo uploaded to R2!');
                      } else {
                        await saveMediaBlob(id, file);
                        setTeamForm({ ...teamForm, image: `indexeddb://${id}` });
                        showAlert('Portrait photo uploaded locally & ready!');
                      }
                    }
                  }}
                  style={{ height: 'auto', borderRadius: '10px', padding: '10px', width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Biography *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Brief history/skills biography..."
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  required
                />
              </div>

              <div className="form-row-2" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary btn-block">
                  <Check size={16} /> Save Member
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-block"
                  onClick={() => {
                    setIsTeamFormOpen(false);
                    setEditingTeamId('');
                    setTeamForm({ name: '', role: '', bio: '', image: '/pic/pic-5.png' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox for Admin Client Details */}
      {adminLightboxImage && (
        <div className="admin-lightbox-backdrop" onClick={() => setAdminLightboxImage(null)}>
          <button className="admin-lightbox-close" onClick={() => setAdminLightboxImage(null)}>
            <X size={24} />
          </button>
          {(() => {
            const activeClient = albums.find(a => a.id === selectedClientId);
            if (activeClient && activeClient.photos && activeClient.photos.length > 1) {
              return (
                <>
                  <button
                    className="admin-lightbox-nav prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newIndex = (adminLightboxIndex - 1 + activeClient.photos.length) % activeClient.photos.length;
                      setAdminLightboxIndex(newIndex);
                      setAdminLightboxImage(activeClient.photos[newIndex].url);
                    }}
                  >
                    <ChevronLeft size={36} />
                  </button>
                  <button
                    className="admin-lightbox-nav next"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newIndex = (adminLightboxIndex + 1) % activeClient.photos.length;
                      setAdminLightboxIndex(newIndex);
                      setAdminLightboxImage(activeClient.photos[newIndex].url);
                    }}
                  >
                    <ChevronRight size={36} />
                  </button>
                </>
              );
            }
            return null;
          })()}
          <SafeImage
            src={adminLightboxImage}
            alt="Fullscreen view"
            className="admin-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Category Modal Form */}
      {isCatFormOpen && editingCat && (
        <div className="modal-backdrop" onClick={() => { setIsCatFormOpen(false); setEditingCat(null); setCategoryImageFile(null); }}>
          <div className="modal-container glass-card etech-curve" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title serif-font">{editingCat.isNew ? 'Add New Category' : 'Edit Category Details'}</h3>
              <button className="modal-close-btn" onClick={() => { setIsCatFormOpen(false); setEditingCat(null); setCategoryImageFile(null); }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="admin-form" style={{ padding: '1.5rem 2rem 2rem 2rem' }}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingCat.name}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  required
                  style={{ height: '40px', borderRadius: '8px', padding: '0 12px', width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={editingCat.desc}
                  onChange={(e) => setEditingCat({ ...editingCat, desc: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Starts From Price (INR) *</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingCat.price}
                  onChange={(e) => setEditingCat({ ...editingCat, price: e.target.value })}
                  required
                  style={{ height: '40px', borderRadius: '8px', padding: '0 12px', width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image Path / URL *</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingCat.image}
                  onChange={(e) => setEditingCat({ ...editingCat, image: e.target.value })}
                  required
                  style={{ height: '40px', borderRadius: '8px', padding: '0 12px', width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Or Upload Custom Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => setCategoryImageFile(e.target.files[0])}
                  style={{ height: 'auto', borderRadius: '8px', padding: '8px' }}
                />
                {categoryImageFile && (
                  <div style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>Selected: {categoryImageFile.name}</span>
                  </div>
                )}
              </div>

              <div className="form-row-2" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary btn-block">
                  <Check size={16} /> {editingCat.isNew ? 'Create Category' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-block"
                  onClick={() => { setIsCatFormOpen(false); setEditingCat(null); setCategoryImageFile(null); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Modal Form */}
      {isCatSvcFormOpen && editingCatSvc && (
        <div className="modal-backdrop" onClick={() => { setIsCatSvcFormOpen(false); setEditingCatSvc(null); setCatServiceImageFile(null); }}>
          <div className="modal-container glass-card etech-curve" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title serif-font">{editingCatSvc.isNew ? 'Add New Service' : 'Edit Service Details'}</h3>
              <button className="modal-close-btn" onClick={() => { setIsCatSvcFormOpen(false); setEditingCatSvc(null); setCatServiceImageFile(null); }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCatService} className="admin-form" style={{ padding: '1.5rem 2rem 2rem 2rem' }}>
              <div className="form-group">
                <label className="form-label">Service Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingCatSvc.name}
                  onChange={(e) => setEditingCatSvc({ ...editingCatSvc, name: e.target.value })}
                  required
                  style={{ height: '40px', borderRadius: '8px', padding: '0 12px', width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Service Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Enter a brief description for this service"
                  value={editingCatSvc.desc || ''}
                  onChange={(e) => setEditingCatSvc({ ...editingCatSvc, desc: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Starts From Price (INR) *</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingCatSvc.price}
                  onChange={(e) => setEditingCatSvc({ ...editingCatSvc, price: e.target.value })}
                  required
                  style={{ height: '40px', borderRadius: '8px', padding: '0 12px', width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image Path / URL *</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingCatSvc.image}
                  onChange={(e) => setEditingCatSvc({ ...editingCatSvc, image: e.target.value })}
                  required
                  style={{ height: '40px', borderRadius: '8px', padding: '0 12px', width: '100%' }}
                />
                {/* Preset Image Helpers */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {[
                    { name: "Wedding", path: "/pic/services/wedding.png" },
                    { name: "Candid", path: "/pic/services/candid_v2.png" },
                    { name: "Traditional", path: "/pic/services/traditional_v2.jpg" },
                    { name: "Drone", path: "/pic/services/drone.png" },
                    { name: "Cinematic", path: "/pic/services/cinematic.png" },
                    { name: "Maternity", path: "/pic/services/maternity_v2.png" },
                    { name: "Puberty", path: "/pic/services/puberty.png" },
                    { name: "Baby", path: "/pic/services/baby_v3.png" },
                    { name: "Model", path: "/pic/services/model_v2.png" },
                    { name: "Events", path: "/pic/services/events.png" }
                  ].map(img => (
                    <button
                      key={img.name}
                      type="button"
                      style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.03)', cursor: 'pointer' }}
                      onClick={() => setEditingCatSvc({ ...editingCatSvc, image: img.path })}
                    >
                      {img.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Or Upload Custom Service Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => setCatServiceImageFile(e.target.files[0])}
                  style={{ height: 'auto', borderRadius: '8px', padding: '8px' }}
                />
                {catServiceImageFile && (
                  <div style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>Selected: {catServiceImageFile.name}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Sub-services (one per line or separated by commas)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g. Traditional Photography, Candid Videography, LED Wall"
                  value={editingCatSvc.subServicesText || ''}
                  onChange={(e) => setEditingCatSvc({ ...editingCatSvc, subServicesText: e.target.value })}
                />
              </div>

              <div className="form-row-2" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary btn-block">
                  <Check size={16} /> {editingCatSvc.isNew ? 'Create Service' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-block"
                  onClick={() => { setIsCatSvcFormOpen(false); setEditingCatSvc(null); setCatServiceImageFile(null); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styled Embed System */}
      <style jsx>{`
        .admin-page-wrapper {
          min-height: 100vh;
          color: var(--fg);
          background-color: #f9fafb; /* Light pastel background */
        }
        .admin-main-section {
          padding: 1.5rem 0;
        }
        .admin-container {
          width: 96%;
          max-width: 1560px;
          margin: 0 auto;
          padding: 0 16px;
        }
        .admin-grid-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 992px) {
          .admin-grid-layout {
            grid-template-columns: 1fr;
          }
        }
        .admin-sidebar {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.04);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
          border-radius: 24px;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          height: auto;
          min-height: calc(100vh - 120px);
        }
        @media (min-width: 993px) {
          .admin-sidebar {
            position: sticky;
            top: 1.5rem;
            height: fit-content;
            min-height: auto;
          }
        }
        
        /* Sidebar Profile Card */
        .sidebar-profile-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        .sidebar-avatar-wrapper {
          position: relative;
          width: 48px;
          height: 48px;
        }
        .sidebar-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(249, 115, 22, 0.2);
        }
        .sidebar-status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          background-color: #10b981; /* Green active status */
          border: 2px solid #ffffff;
          border-radius: 50%;
        }
        .sidebar-profile-info {
          display: flex;
          flex-direction: column;
        }
        .sidebar-profile-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }
        .sidebar-profile-role {
          font-size: 0.75rem;
          color: #9ca3af;
          margin: 0;
        }

        .sidebar-menu-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .sidebar-menu-category {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #9ca3af;
          margin: 0 0 0.25rem 0.5rem;
        }
        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .menu-btn {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.8rem 1.2rem;
          border: none;
          background: transparent;
          color: #6b7280;
          border-radius: 14px;
          text-align: left;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          width: 100%;
        }
        .menu-btn:hover {
          color: var(--primary);
          background: rgba(249, 115, 22, 0.05);
          transform: translateX(4px);
        }
        .menu-btn.active {
          color: #ffffff;
          background: linear-gradient(135deg, var(--primary) 0%, #ff8a50 100%);
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.25);
          font-weight: 600;
        }
        .menu-btn.logout-btn:hover {
          background: rgba(239, 68, 68, 0.08);
          color: #ef4444;
        }
        
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .admin-table th {
          padding: 1rem;
          font-size: 0.8rem;
          text-transform: uppercase;
          color: var(--fg-muted);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          vertical-align: middle;
        }
        .client-cell-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .client-cell-info span {
          font-size: 0.8rem;
          color: var(--fg-muted);
        }
        .client-email {
          font-size: 0.75rem !important;
          opacity: 0.8;
        }

        .booking-split-view, .gallery-split-view, .package-service-split-view {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2rem;
          align-items: start;
        }
        .package-service-split-view {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 1200px) {
          .booking-split-view, .gallery-split-view, .package-service-split-view {
            grid-template-columns: 1fr;
          }
        }
        .booking-add-form-panel, .album-list-col {
          padding: 1.5rem;
        }
        .album-media-col {
          padding: 2rem;
        }
        .pane-subtitle {
          font-size: 1.25rem;
          margin-bottom: 1.25rem;
          border-left: 3px solid var(--primary);
          padding-left: 0.75rem;
        }
        .uploader-subtitle {
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        .form-inside-title {
          font-size: 1rem;
          margin-bottom: 1rem;
          color: var(--primary);
          font-weight: 600;
        }
        
        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .admin-form.glass-card {
          padding: 1.5rem;
        }
        .divider {
          border: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 1.5rem 0;
        }
        .margin-top-sm { margin-top: 1rem; }
        .margin-bottom-sm { margin-bottom: 1.5rem; }

        .album-selector-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 250px;
          overflow-y: auto;
          padding-right: 0.25rem;
        }
        .album-selector-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .album-selector-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }
        .album-selector-item.active {
          border-color: var(--primary);
          background: rgba(124, 58, 237, 0.05);
        }
        .alb-sel-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .alb-sel-details strong {
          font-size: 0.9rem;
        }
        .alb-sel-details span {
          font-size: 0.75rem;
          color: var(--fg-muted);
        }

        .active-album-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .album-manage-title {
          font-size: 1.5rem;
          margin-top: 0.5rem;
        }
        .album-manage-meta {
          font-size: 0.85rem;
          color: var(--fg-muted);
          margin-top: 0.25rem;
        }

        .media-uploader-box {
          padding: 1.25rem;
        }
        .preset-images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .preset-img-btn {
          border: 2px solid transparent;
          background: transparent;
          border-radius: 6px;
          overflow: hidden;
          padding: 0;
          cursor: pointer;
          position: relative;
          height: 60px;
          transition: all 0.2s ease;
        }
        .preset-img-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .preset-img-btn span {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.7);
          font-size: 0.6rem;
          color: #ffffff;
          padding: 0.1rem;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .preset-img-btn:hover {
          opacity: 0.8;
        }
        .preset-img-btn.active {
          border-color: var(--primary);
        }

        .asset-type-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--primary);
        }
        .no-media-text {
          font-size: 0.85rem;
          color: var(--fg-muted);
          font-style: italic;
          padding: 1rem 0;
        }
        
        .admin-media-thumb-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .media-thumb-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 0.5rem;
          border-radius: 8px;
        }
        .media-thumb {
          width: 100%;
          height: 90px;
          object-fit: cover;
          border-radius: 6px;
        }
        .media-thumb-body {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
          gap: 0.25rem;
        }
        .media-thumb-body span {
          font-size: 0.7rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90px;
        }

        .btn-icon-danger, .btn-icon-purple, .btn-icon-danger-sm {
          background: transparent;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .btn-icon-danger {
          color: var(--danger);
          padding: 0.4rem;
        }
        .btn-icon-danger:hover {
          background: rgba(239, 68, 68, 0.1);
        }
        .btn-icon-danger-sm {
          color: var(--danger);
          padding: 0.25rem;
        }
        .btn-icon-danger-sm:hover {
          background: rgba(239, 68, 68, 0.1);
        }
        .btn-icon-purple {
          color: var(--primary);
          padding: 0.4rem;
        }
        .btn-icon-purple:hover {
          background: rgba(124, 58, 237, 0.1);
        }
        .action-row-buttons {
          display: flex;
          gap: 0.25rem;
        }

        .packages-panel, .services-panel {
          padding: 1.5rem;
        }
        .empty-panel-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 0;
          color: var(--fg-muted);
          gap: 1rem;
        }
        
        .flex-align-center {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .pointer { cursor: pointer; }
        .checkbox-input {
          width: 16px;
          height: 16px;
          accent-color: var(--primary);
        }

        .highlight-glow {
          border-color: rgba(124, 58, 237, 0.15);
          box-shadow: 0 0 15px rgba(124, 58, 237, 0.05);
        }

        .alert-toast {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .alert-success {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #10b881;
        }
        .alert-warning {
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }
        .alert-danger {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .reset-data-btn {
          position: absolute;
          top: 0;
          right: 0;
          border-color: rgba(239, 68, 68, 0.3) !important;
          color: #ef4444 !important;
        }
        .reset-data-btn:hover {
          background: rgba(239, 68, 68, 0.08) !important;
        }
        @media (max-width: 768px) {
          .reset-data-btn {
            position: relative;
            margin-top: 1rem;
            top: auto;
            right: auto;
          }
        }
        .status-select-control {
          background: var(--bg);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--fg);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
        }
        .event-badge-pill {
          background: rgba(255, 255, 255, 0.06);
          padding: 0.25rem 0.6rem;
          border-radius: 50px;
          font-size: 0.8rem;
        }

        /* ── DASHBOARD STYLES ── */
        .dashboard-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Top Bar styling */
        .dashboard-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          background: #ffffff;
          padding: 1rem 1.5rem;
          border-radius: 20px;
          border: 1px solid rgba(0, 0, 0, 0.04);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);
        }
        .dashboard-search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          max-width: 460px;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          color: #9ca3af;
        }
        .dashboard-search-input {
          width: 100%;
          background: #f3f4f6;
          border: 1px solid transparent;
          border-radius: 100px;
          padding: 0.65rem 1rem 0.65rem 44px;
          color: #1f2937;
          font-size: 0.9rem;
          font-weight: 500;
          outline: none;
          transition: all 0.2s ease;
        }
        .dashboard-search-input:focus {
          background: #ffffff;
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }
        .dashboard-search-input::placeholder {
          color: #9ca3af;
        }
        .dashboard-topbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .quick-add-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--primary) 0%, #ff8a50 100%);
          color: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
        }
        .quick-add-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(249, 115, 22, 0.35);
        }
        .notification-bell-wrapper {
          position: relative;
          width: 40px;
          height: 40px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .notification-bell-wrapper:hover {
          background: #f3f4f6;
          color: #1f2937;
        }
        .bell-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background-color: var(--primary);
          border: 2px solid #ffffff;
          border-radius: 50%;
        }

        /* Dashboard sections */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2rem;
        }
        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
        .dashboard-section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        /* Project Cards styling */
        .dashboard-recent-projects {
          display: flex;
          flex-direction: column;
        }
        .recent-projects-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 640px) {
          .recent-projects-grid {
            grid-template-columns: 1fr;
          }
        }
        .project-card {
          border-radius: 24px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 250px;
          transition: all 0.3s ease;
        }
        .gradient-orange-card {
          background: linear-gradient(135deg, #f97316 0%, #ff8a50 100%);
          color: #ffffff;
          box-shadow: 0 15px 30px rgba(249, 115, 22, 0.15);
        }
        .gradient-orange-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 35px rgba(249, 115, 22, 0.25);
        }
        .white-border-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.05);
          color: #1f2937;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
        }
        .white-border-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
          border-color: rgba(249, 115, 22, 0.15);
        }
        .project-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .project-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0 0 0.25rem 0;
          font-family: var(--font-sans);
        }
        .project-subtitle {
          font-size: 0.8rem;
          opacity: 0.8;
          margin: 0;
        }
        .project-more-btn {
          font-size: 1.25rem;
          cursor: pointer;
          opacity: 0.7;
          line-height: 1;
        }
        .project-meta-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.75rem;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          opacity: 0.9;
        }
        .project-progress-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .progress-bar-track {
          height: 6px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 10px;
          overflow: hidden;
          width: 100%;
        }
        .white-border-card .progress-bar-track {
          background: #f3f4f6;
        }
        .progress-bar-fill {
          height: 100%;
          background: #ffffff;
          border-radius: 10px;
        }
        .progress-bar-fill.orange-fill {
          background: linear-gradient(90deg, #f97316 0%, #ff8a50 100%);
        }
        .project-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        .client-avatars {
          display: flex;
          align-items: center;
        }
        .avatar-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
          margin-right: -8px;
          color: #ffffff;
        }
        .white-border-card .avatar-circle {
          background: #f3f4f6;
          border-color: #ffffff;
          color: #6b7280;
        }
        .days-remain-badge {
          font-size: 0.75rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.35rem 0.75rem;
          border-radius: 50px;
        }
        .days-remain-badge.orange-badge {
          background: rgba(249, 115, 22, 0.08);
          color: var(--primary);
        }

        /* Activity panel details */
        .dashboard-activity-panel {
          padding: 1.5rem;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 24px;
        }
        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .activity-subtitle {
          font-size: 0.8rem;
          color: #9ca3af;
          margin: 0;
        }
        .activity-dropdown-icon {
          color: #6b7280;
          cursor: pointer;
        }
        .activity-chart-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .dashboard-chart-svg {
          width: 100%;
          height: auto;
          max-height: 160px;
        }
        .chart-days-row {
          display: flex;
          justify-content: space-between;
          width: 95%;
          margin-top: 0.5rem;
          padding: 0 0.5rem;
        }
        .chart-days-row span {
          font-size: 0.75rem;
          font-weight: 700;
          color: #9ca3af;
          width: 20px;
          text-align: center;
        }

        /* Bottom grid and schedule panel */
        .dashboard-schedule-panel {
          padding: 1.75rem;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 24px;
        }
        .schedule-split-layout {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 1.5rem;
        }
        @media (max-width: 640px) {
          .schedule-split-layout {
            grid-template-columns: 1fr;
          }
        }
        .mini-calendar-widget {
          display: flex;
          flex-direction: column;
          background: #f9fafb;
          border-radius: 16px;
          padding: 1rem;
          border: 1px solid rgba(0, 0, 0, 0.02);
        }
        .calendar-header {
          text-align: center;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.75rem;
        }
        .calendar-grid-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
          text-align: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: #9ca3af;
          margin-bottom: 0.5rem;
        }
        .calendar-grid-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
          text-align: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: #4b5563;
        }
        .calendar-grid-days span {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
        }
        .calendar-grid-days span:hover {
          background: rgba(0,0,0,0.03);
        }
        .day-empty {
          visibility: hidden;
        }
        .calendar-grid-days .day-highlighted {
          background-color: var(--primary);
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 4px 10px rgba(249, 115, 22, 0.2);
        }
        .calendar-events-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 200px;
          overflow-y: auto;
        }
        .event-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.02);
          transition: all 0.2s ease;
        }
        .event-item:hover {
          background: #f3f4f6;
          border-color: rgba(249, 115, 22, 0.1);
        }
        .event-date-block {
          width: 42px;
          height: 42px;
          background: rgba(249, 115, 22, 0.08);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
        }
        .event-day {
          font-size: 0.95rem;
          font-weight: 700;
          line-height: 1;
        }
        .event-month {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .event-details {
          flex: 1;
          min-width: 0;
        }
        .event-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.15rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .event-meta {
          font-size: 0.7rem;
          color: #9ca3af;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .event-play-icon {
          font-size: 0.65rem;
          color: #9ca3af;
          opacity: 0.6;
        }

        /* Messages panel details */
        .dashboard-messages-panel {
          padding: 1.75rem;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 24px;
        }
        .messages-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .message-filter-tabs {
          display: flex;
          background: #f3f4f6;
          padding: 0.2rem;
          border-radius: 100px;
          gap: 0.1rem;
        }
        .msg-filter-btn {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          border: none;
          background: transparent;
          padding: 0.35rem 0.8rem;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .msg-filter-btn.active {
          background: var(--primary);
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(249, 115, 22, 0.15);
        }
        .dashboard-messages-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 200px;
          overflow-y: auto;
        }
        .dashboard-message-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 0.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.03);
          transition: all 0.2s ease;
        }
        .dashboard-message-item:hover {
          background: #f9fafb;
        }
        .msg-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .bg-avatar-blue { background: #3b82f6; }
        .bg-avatar-pink { background: #ec4899; }
        .bg-avatar-yellow { background: #f59e0b; }
        .msg-content {
          flex: 1;
          min-width: 0;
        }
        .msg-sender {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.15rem 0;
        }
        .msg-snippet {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .msg-time {
          font-size: 0.7rem;
          color: #9ca3af;
          font-weight: 500;
        }

        /* Settings card details */
        .settings-section-card {
          background: #f9fafb;
          border: 1px solid rgba(0, 0, 0, 0.03);
          border-radius: 16px;
          padding: 1.5rem;
          margin-top: 1rem;
        }

        /* ── MODAL SYSTEM ── */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: modal-fade-in 0.25s ease-out;
        }
        .modal-container {
          background: #ffffff;
          width: 90%;
          max-width: 580px;
          max-height: 90vh;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: modal-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .modal-container .admin-form {
          overflow-y: auto;
          flex: 1;
        }
        .modal-container.confirm-modal {
          max-width: 440px;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        .modal-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }
        .modal-close-btn {
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .modal-close-btn:hover {
          color: #1f2937;
        }
        @keyframes modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-slide-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* ── LIGHTBOX SYSTEM ── */
        .admin-lightbox-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          animation: modal-fade-in 0.2s ease-out;
        }
        .admin-lightbox-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        .admin-lightbox-close:hover {
          opacity: 1;
        }
        .admin-lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          color: #ffffff;
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0.7;
          transition: all 0.2s ease;
        }
        .admin-lightbox-nav:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.2);
        }
        .admin-lightbox-nav.prev {
          left: 32px;
        }
        .admin-lightbox-nav.next {
          right: 32px;
        }
        .admin-lightbox-img {
          max-width: 85%;
          max-height: 85vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          animation: zoom-in-image 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes zoom-in-image {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        /* ── CUSTOM COMPONENT ENHANCEMENTS ── */
        .client-photo-item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
          border-color: rgba(249, 115, 22, 0.2) !important;
        }
        .client-register-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 12px 30px rgba(249, 115, 22, 0.08) !important;
          border-color: rgba(249, 115, 22, 0.25) !important;
        }
        @media (max-width: 1024px) {
          .gallery-management-split {
            grid-template-columns: 1fr !important;
          }
        }
        .client-sticky-header, .album-sticky-header {
          position: sticky;
          top: -2rem;
          z-index: 90;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          margin-left: -2rem;
          margin-right: -2rem;
          padding-left: 2rem;
          padding-right: 2rem;
          padding-top: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        @media (min-width: 1025px) {
          .album-uploader-col {
            position: sticky;
            top: 200px; /* Offset for sticky header */
            z-index: 80;
          }
        }

        /* ── SEGMENTED SWITCHER SYSTEM ── */
        .packages-services-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(8px);
          padding: 1rem 1.5rem;
          border-radius: 16px;
          border: 1px solid rgba(249, 115, 22, 0.1);
        }
        .segmented-switcher-container {
          display: flex;
          align-items: center;
        }
        .segmented-switcher {
          background: rgba(249, 115, 22, 0.05);
          border: 1px solid rgba(249, 115, 22, 0.15);
          border-radius: 30px;
          padding: 4px;
          display: flex;
          gap: 4px;
        }
        .switcher-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 26px;
          border: none;
          background: transparent;
          color: #4b5563;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .switcher-btn:hover {
          color: var(--primary);
        }
        .switcher-btn.active {
          background: linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
        }
        .btn-add-new-glow {
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.15);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-add-new-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(249, 115, 22, 0.3);
        }

        /* ── PACKAGES & SERVICES CARDS GRID ── */
        .packages-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .services-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        /* ── PACKAGE CARD ── */
        .package-visual-card {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(249, 115, 22, 0.08);
          border-radius: 20px;
          padding: 2rem;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 480px;
          transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease;
        }
        .package-visual-card:hover {
          transform: translateY(-8px);
          border-color: rgba(249, 115, 22, 0.25);
          box-shadow: 0 22px 40px rgba(249, 115, 22, 0.08), 0 0 30px rgba(139, 92, 246, 0.03);
        }
        .package-visual-card.popular-card {
          border: 2px solid rgba(249, 115, 22, 0.3);
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
          box-shadow: 0 10px 30px rgba(249, 115, 22, 0.05);
        }
        .popular-badge-glow {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(135deg, var(--primary) 0%, #f97316 100%);
          color: #fff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 10px rgba(249, 115, 22, 0.25);
        }
        .package-tier-label {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #8b5cf6;
          margin-bottom: 0.5rem;
        }
        .package-card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 1rem 0;
        }
        .package-card-price-container {
          display: flex;
          align-items: baseline;
          margin-bottom: 1.25rem;
        }
        .price-symbol {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
        }
        .price-amount {
          font-size: 2.5rem;
          font-weight: 800;
          color: #111827;
          line-height: 1;
        }
        .price-period {
          font-size: 0.875rem;
          color: #6b7280;
          margin-left: 4px;
        }
        .package-card-desc {
          font-size: 0.9rem;
          color: #4b5563;
          line-height: 1.5;
          margin: 0 0 1.5rem 0;
        }
        .package-card-features-container {
          flex-grow: 1;
          margin-bottom: 1.5rem;
        }
        .features-title {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #374151;
          margin: 0 0 0.75rem 0;
        }
        .package-card-features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.85rem;
        }
        .feature-item.included {
          color: #374151;
        }
        .feature-item.excluded {
          color: #9ca3af;
          text-decoration: line-through;
        }
        .feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .feature-item.included .feature-icon {
          color: #10b981;
        }
        .feature-item.excluded .feature-icon {
          color: #ef4444;
        }
        .feature-text {
          line-height: 1.4;
        }

        .package-card-actions, .service-card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          margin-top: auto;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          padding-top: 1.25rem;
          width: 100%;
        }
        .card-edit-btn {
          flex: 1 1 0% !important;
          width: 0 !important;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 38px;
          padding: 0 16px !important;
          border-radius: 10px !important;
          border: 1px solid var(--primary) !important;
          color: var(--primary) !important;
          background: transparent !important;
          font-size: 0.85rem !important;
          font-weight: 700 !important;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .card-edit-btn:hover {
          background: rgba(249, 115, 22, 0.05) !important;
          border-color: var(--primary) !important;
          transform: translateY(-1px);
        }
        .card-delete-btn {
          flex: 1 1 0% !important;
          width: 0 !important;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 38px;
          padding: 0 16px !important;
          border-radius: 10px !important;
          border: 1px solid rgba(239, 68, 68, 0.2) !important;
          background: transparent !important;
          color: #ef4444 !important;
          font-size: 0.85rem !important;
          font-weight: 700 !important;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .card-delete-btn:hover {
          background: rgba(239, 68, 68, 0.05) !important;
          border-color: #ef4444 !important;
          transform: translateY(-1px) !important;
        }

        /* ── SERVICE CARD ── */
        .service-visual-card {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(249, 115, 22, 0.08);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 480px;
          transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease;
        }
        .service-visual-card:hover {
          transform: translateY(-8px);
          border-color: rgba(249, 115, 22, 0.2);
          box-shadow: 0 22px 40px rgba(249, 115, 22, 0.08);
        }
        .service-card-image-wrapper {
          position: relative;
          width: 100%;
          height: 180px;
          overflow: hidden;
        }
        .service-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .service-visual-card:hover .service-card-img {
          transform: scale(1.06);
        }
        .service-card-price-overlay {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          color: #fff;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .service-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .service-card-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.75rem 0;
        }
        .service-card-desc {
          font-size: 0.875rem;
          color: #4b5563;
          line-height: 1.5;
          margin: 0 0 1.25rem 0;
        }
        .service-card-features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: auto;
        }
        .service-feature-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.1);
          color: #6d28d9;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .feat-check {
          color: #8b5cf6;
          flex-shrink: 0;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 576px) {
          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
