
// Local storage management for the photo kiosk system
interface Session {
  id: string;
  name: string;
  location: string;
  pin: string;
  photographerId: string;
  createdAt: Date;
  photos: Photo[];
  status: 'active' | 'completed' | 'printed';
}

interface Photo {
  id: string;
  sessionId: string;
  originalName: string;
  fileName: string;
  uploadedAt: Date;
  url: string;
  thumbnailUrl?: string;
}

interface Photographer {
  id: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

interface BundlePlan {
  id: string;
  name: string;
  photoLimit: number;
  price: number;
  description: string;
  isActive: boolean;
}

interface Order {
  id: string;
  sessionId: string;
  bundlePlan: BundlePlan;
  selectedPhotos: string[];
  editedPhotos: { [key: string]: EditedPhoto };
  totalAmount: number;
  status: 'pending' | 'paid' | 'printed' | 'cancelled';
  createdAt: Date;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

interface EditedPhoto {
  photoId: string;
  edits: {
    filter?: string;
    brightness?: number;
    contrast?: number;
    saturation?: number;
    crop?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    border?: {
      style: string;
      color: string;
      thickness: number;
      radius: number;
    };
    rotation?: number;
    mirrored?: boolean;
  };
  editedUrl?: string;
}

interface Location {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface Admin {
  id: string;
  username: string;
  password: string;
  name: string;
  createdAt: Date;
  lastLogin?: Date;
}

interface AppSettings {
  companyName: string;
  currency: string;
  taxRate: number;
  printSettings: {
    quality: 'standard' | 'high' | 'premium';
    paperSize: 'A4' | '4x6' | '5x7' | '8x10';
  };
}

class LocalStorage {
  private static instance: LocalStorage;
  private sessionFolders: Map<string, string[]> = new Map();

  static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }

  // Initialize default data
  init() {
    this.initPhotographers();
    this.initBundlePlans();
    this.initLocations();
    this.initAdmin();
    this.initSettings();
    this.loadSessionFolders();
    this.initSampleSessions();
  }

  private initPhotographers() {
    if (!this.getPhotographers().length) {
      this.addPhotographer({
        id: '1',
        name: 'John Photographer',
        email: 'john@photo.com',
        password: 'password123',
        isActive: true,
        createdAt: new Date()
      });
    }
  }

  private initBundlePlans() {
    if (!this.getBundlePlans().length) {
      const defaultPlans: BundlePlan[] = [
        { id: '1', name: 'Basic', photoLimit: 2, price: 100, description: 'Perfect for a few memorable shots', isActive: true },
        { id: '2', name: 'Standard', photoLimit: 5, price: 250, description: 'Great for small groups', isActive: true },
        { id: '3', name: 'Premium', photoLimit: 10, price: 500, description: 'Ideal for families', isActive: true },
        { id: '4', name: 'Unlimited', photoLimit: 20, price: 1000, description: 'Maximum value package', isActive: true }
      ];
      defaultPlans.forEach(plan => this.addBundlePlan(plan));
    }
  }

  private initLocations() {
    if (!this.getLocations().length) {
      const defaultLocations: Location[] = [
        { id: '1', name: 'Beach Resort', description: 'Beautiful beachside location', isActive: true },
        { id: '2', name: 'Mountain View', description: 'Scenic mountain backdrop', isActive: true },
        { id: '3', name: 'City Park', description: 'Urban park setting', isActive: true },
        { id: '4', name: 'Wedding Hall', description: 'Indoor elegant venue', isActive: true }
      ];
      defaultLocations.forEach(location => this.addLocation(location));
    }
  }

  private initAdmin() {
    if (!this.getAdmins().length) {
      this.addAdmin({
        id: '1',
        username: 'admin',
        password: 'admin123',
        name: 'System Administrator',
        createdAt: new Date()
      });
    }
  }

  private initSettings() {
    if (!this.getSettings()) {
      const defaultSettings: AppSettings = {
        companyName: 'PhotoKiosk Pro',
        currency: 'INR',
        taxRate: 18,
        printSettings: {
          quality: 'high',
          paperSize: '4x6'
        }
      };
      this.updateSettings(defaultSettings);
    }
  }

  private initSampleSessions() {
    if (!this.getSessions().length) {
      // Create sample sessions for testing
      const sampleSessions: Session[] = [
        {
          id: 'SMITH123456',
          name: 'Smith Family',
          location: 'Beach Resort',
          pin: '1234',
          photographerId: '1',
          createdAt: new Date(),
          photos: [
            {
              id: '1',
              sessionId: 'SMITH123456',
              originalName: 'IMG_001.jpg',
              fileName: 'IMG_001.jpg',
              uploadedAt: new Date(),
              url: '/placeholder.svg',
              thumbnailUrl: '/placeholder.svg'
            },
            {
              id: '2',
              sessionId: 'SMITH123456',
              originalName: 'IMG_002.jpg',
              fileName: 'IMG_002.jpg',
              uploadedAt: new Date(),
              url: '/placeholder.svg',
              thumbnailUrl: '/placeholder.svg'
            }
          ],
          status: 'active'
        },
        {
          id: 'JONES789012',
          name: 'Jones Wedding',
          location: 'Wedding Hall',
          pin: '5678',
          photographerId: '1',
          createdAt: new Date(),
          photos: [
            {
              id: '3',
              sessionId: 'JONES789012',
              originalName: 'WED_001.jpg',
              fileName: 'WED_001.jpg',
              uploadedAt: new Date(),
              url: '/placeholder.svg',
              thumbnailUrl: '/placeholder.svg'
            }
          ],
          status: 'active'
        }
      ];
      
      sampleSessions.forEach(session => this.addSession(session));
    }
  }

  private loadSessionFolders() {
    const folders = localStorage.getItem('sessionFolders');
    if (folders) {
      this.sessionFolders = new Map(JSON.parse(folders));
    }
  }

  private saveSessionFolders() {
    localStorage.setItem('sessionFolders', JSON.stringify(Array.from(this.sessionFolders.entries())));
  }

  // Photographers - simplified for testing
  getPhotographers(): Photographer[] {
    return JSON.parse(localStorage.getItem('photographers') || '[]');
  }

  addPhotographer(photographer: Photographer) {
    const photographers = this.getPhotographers();
    photographers.push(photographer);
    localStorage.setItem('photographers', JSON.stringify(photographers));
  }

  updatePhotographer(id: string, updates: Partial<Photographer>) {
    const photographers = this.getPhotographers();
    const index = photographers.findIndex(p => p.id === id);
    if (index !== -1) {
      photographers[index] = { ...photographers[index], ...updates };
      localStorage.setItem('photographers', JSON.stringify(photographers));
    }
  }

  deletePhotographer(id: string) {
    const photographers = this.getPhotographers().filter(p => p.id !== id);
    localStorage.setItem('photographers', JSON.stringify(photographers));
  }

  // Simplified authentication - always succeeds for testing
  authenticatePhotographer(email: string, password: string): Photographer | null {
    if (email.trim() && password.trim()) {
      return {
        id: '1',
        name: email.split('@')[0] || 'Test Photographer',
        email: email,
        password: password,
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date()
      };
    }
    return null;
  }

  // Sessions
  getSessions(): Session[] {
    return JSON.parse(localStorage.getItem('sessions') || '[]');
  }

  addSession(session: Session) {
    const sessions = this.getSessions();
    sessions.push(session);
    localStorage.setItem('sessions', JSON.stringify(sessions));
    
    // Create session folder structure
    this.createSessionFolder(session.id);
  }

  updateSession(id: string, updates: Partial<Session>) {
    const sessions = this.getSessions();
    const index = sessions.findIndex(s => s.id === id);
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates };
      localStorage.setItem('sessions', JSON.stringify(sessions));
    }
  }

  deleteSession(id: string) {
    const sessions = this.getSessions().filter(s => s.id !== id);
    localStorage.setItem('sessions', JSON.stringify(sessions));
    
    // Remove session folder
    this.deleteSessionFolder(id);
  }

  getSessionById(id: string): Session | null {
    const sessions = this.getSessions();
    return sessions.find(s => s.id === id) || null;
  }

  searchSessions(name: string): Session[] {
    const sessions = this.getSessions();
    return sessions.filter(s => 
      s.name.toLowerCase().includes(name.toLowerCase()) ||
      s.id.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Session Folder Management
  createSessionFolder(sessionId: string) {
    this.sessionFolders.set(sessionId, []);
    this.saveSessionFolders();
  }

  addPhotoToSession(sessionId: string, photo: Photo) {
    const session = this.getSessionById(sessionId);
    if (session) {
      session.photos.push(photo);
      this.updateSession(sessionId, { photos: session.photos });
      
      // Add to folder structure
      const folderFiles = this.sessionFolders.get(sessionId) || [];
      folderFiles.push(photo.fileName);
      this.sessionFolders.set(sessionId, folderFiles);
      this.saveSessionFolders();
    }
  }

  removePhotoFromSession(sessionId: string, photoId: string) {
    const session = this.getSessionById(sessionId);
    if (session) {
      const photo = session.photos.find(p => p.id === photoId);
      session.photos = session.photos.filter(p => p.id !== photoId);
      this.updateSession(sessionId, { photos: session.photos });
      
      // Remove from folder structure
      if (photo) {
        const folderFiles = this.sessionFolders.get(sessionId) || [];
        const updatedFiles = folderFiles.filter(f => f !== photo.fileName);
        this.sessionFolders.set(sessionId, updatedFiles);
        this.saveSessionFolders();
      }
    }
  }

  deleteSessionFolder(sessionId: string) {
    this.sessionFolders.delete(sessionId);
    this.saveSessionFolders();
  }

  getSessionFiles(sessionId: string): string[] {
    return this.sessionFolders.get(sessionId) || [];
  }

  // Bundle Plans
  getBundlePlans(): BundlePlan[] {
    return JSON.parse(localStorage.getItem('bundlePlans') || '[]');
  }

  addBundlePlan(plan: BundlePlan) {
    const plans = this.getBundlePlans();
    plans.push(plan);
    localStorage.setItem('bundlePlans', JSON.stringify(plans));
  }

  updateBundlePlan(id: string, updates: Partial<BundlePlan>) {
    const plans = this.getBundlePlans();
    const index = plans.findIndex(p => p.id === id);
    if (index !== -1) {
      plans[index] = { ...plans[index], ...updates };
      localStorage.setItem('bundlePlans', JSON.stringify(plans));
    }
  }

  deleteBundlePlan(id: string) {
    const plans = this.getBundlePlans().filter(p => p.id !== id);
    localStorage.setItem('bundlePlans', JSON.stringify(plans));
  }

  // Orders
  getOrders(): Order[] {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  }

  addOrder(order: Order) {
    const orders = this.getOrders();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  updateOrder(id: string, updates: Partial<Order>) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }

  getOrdersBySession(sessionId: string): Order[] {
    const orders = this.getOrders();
    return orders.filter(o => o.sessionId === sessionId);
  }

  getOrderById(id: string): Order | null {
    const orders = this.getOrders();
    return orders.find(o => o.id === id) || null;
  }

  // Locations
  getLocations(): Location[] {
    return JSON.parse(localStorage.getItem('locations') || '[]');
  }

  addLocation(location: Location) {
    const locations = this.getLocations();
    locations.push(location);
    localStorage.setItem('locations', JSON.stringify(locations));
  }

  updateLocation(id: string, updates: Partial<Location>) {
    const locations = this.getLocations();
    const index = locations.findIndex(l => l.id === id);
    if (index !== -1) {
      locations[index] = { ...locations[index], ...updates };
      localStorage.setItem('locations', JSON.stringify(locations));
    }
  }

  deleteLocation(id: string) {
    const locations = this.getLocations().filter(l => l.id !== id);
    localStorage.setItem('locations', JSON.stringify(locations));
  }

  // Admin - simplified for testing
  getAdmins(): Admin[] {
    return JSON.parse(localStorage.getItem('admins') || '[]');
  }

  addAdmin(admin: Admin) {
    const admins = this.getAdmins();
    admins.push(admin);
    localStorage.setItem('admins', JSON.stringify(admins));
  }

  // Simplified admin authentication - always succeeds for testing
  authenticateAdmin(username: string, password: string): Admin | null {
    if (username.trim() && password.trim()) {
      return {
        id: '1',
        username: username,
        password: password,
        name: 'Test Admin',
        createdAt: new Date(),
        lastLogin: new Date()
      };
    }
    return null;
  }

  updateAdmin(id: string, updates: Partial<Admin>) {
    const admins = this.getAdmins();
    const index = admins.findIndex(a => a.id === id);
    if (index !== -1) {
      admins[index] = { ...admins[index], ...updates };
      localStorage.setItem('admins', JSON.stringify(admins));
    }
  }

  // Settings
  getSettings(): AppSettings | null {
    const settings = localStorage.getItem('appSettings');
    return settings ? JSON.parse(settings) : null;
  }

  updateSettings(settings: AppSettings) {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }

  // Statistics
  getStatistics() {
    const sessions = this.getSessions();
    const orders = this.getOrders();
    const photographers = this.getPhotographers();

    return {
      totalSessions: sessions.length,
      activeSessions: sessions.filter(s => s.status === 'active').length,
      completedSessions: sessions.filter(s => s.status === 'completed').length,
      printedSessions: sessions.filter(s => s.status === 'printed').length,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      paidOrders: orders.filter(o => o.status === 'paid').length,
      totalRevenue: orders.filter(o => o.status === 'paid').reduce((sum, order) => sum + order.totalAmount, 0),
      activePhotographers: photographers.filter(p => p.isActive).length
    };
  }

  // Utility functions
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  generatePin(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  generateSessionId(name: string): string {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${cleanName.slice(0, 6)}${timestamp}`;
  }

  // Data export/import for backup
  exportData() {
    return {
      photographers: this.getPhotographers(),
      sessions: this.getSessions(),
      orders: this.getOrders(),
      bundlePlans: this.getBundlePlans(),
      locations: this.getLocations(),
      admins: this.getAdmins(),
      settings: this.getSettings(),
      sessionFolders: Array.from(this.sessionFolders.entries()),
      exportDate: new Date()
    };
  }

  importData(data: any) {
    if (data.photographers) localStorage.setItem('photographers', JSON.stringify(data.photographers));
    if (data.sessions) localStorage.setItem('sessions', JSON.stringify(data.sessions));
    if (data.orders) localStorage.setItem('orders', JSON.stringify(data.orders));
    if (data.bundlePlans) localStorage.setItem('bundlePlans', JSON.stringify(data.bundlePlans));
    if (data.locations) localStorage.setItem('locations', JSON.stringify(data.locations));
    if (data.admins) localStorage.setItem('admins', JSON.stringify(data.admins));
    if (data.settings) localStorage.setItem('appSettings', JSON.stringify(data.settings));
    if (data.sessionFolders) {
      this.sessionFolders = new Map(data.sessionFolders);
      this.saveSessionFolders();
    }
  }

  // Clear all data (for reset)
  clearAllData() {
    localStorage.removeItem('photographers');
    localStorage.removeItem('sessions');
    localStorage.removeItem('orders');
    localStorage.removeItem('bundlePlans');
    localStorage.removeItem('locations');
    localStorage.removeItem('admins');
    localStorage.removeItem('appSettings');
    localStorage.removeItem('sessionFolders');
    this.sessionFolders.clear();
  }
}

export const storage = LocalStorage.getInstance();
export type { Session, Photographer, BundlePlan, Order, Location, Admin, Photo, EditedPhoto, AppSettings };
