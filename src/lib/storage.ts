
// Local storage management for the photo kiosk system
interface Session {
  id: string;
  name: string;
  location: string;
  pin: string;
  photographerId: string;
  createdAt: Date;
  photos: string[];
  status: 'active' | 'completed' | 'printed';
}

interface Photographer {
  id: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
}

interface BundlePlan {
  id: string;
  name: string;
  photoLimit: number;
  price: number;
  description: string;
}

interface Order {
  id: string;
  sessionId: string;
  bundlePlan: BundlePlan;
  selectedPhotos: string[];
  editedPhotos: { [key: string]: any };
  totalAmount: number;
  status: 'pending' | 'paid' | 'printed';
  createdAt: Date;
}

interface Location {
  id: string;
  name: string;
  description?: string;
}

class LocalStorage {
  private static instance: LocalStorage;

  static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }

  // Initialize default data
  init() {
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

    if (!this.getBundlePlans().length) {
      const defaultPlans: BundlePlan[] = [
        { id: '1', name: 'Basic', photoLimit: 2, price: 100, description: 'Perfect for a few memorable shots' },
        { id: '2', name: 'Standard', photoLimit: 5, price: 250, description: 'Great for small groups' },
        { id: '3', name: 'Premium', photoLimit: 10, price: 500, description: 'Ideal for families' },
        { id: '4', name: 'Unlimited', photoLimit: 20, price: 1000, description: 'Maximum value package' }
      ];
      defaultPlans.forEach(plan => this.addBundlePlan(plan));
    }

    if (!this.getLocations().length) {
      const defaultLocations: Location[] = [
        { id: '1', name: 'Beach Resort', description: 'Beautiful beachside location' },
        { id: '2', name: 'Mountain View', description: 'Scenic mountain backdrop' },
        { id: '3', name: 'City Park', description: 'Urban park setting' },
        { id: '4', name: 'Wedding Hall', description: 'Indoor elegant venue' }
      ];
      defaultLocations.forEach(location => this.addLocation(location));
    }
  }

  // Photographers
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

  authenticatePhotographer(email: string, password: string): Photographer | null {
    const photographers = this.getPhotographers();
    return photographers.find(p => p.email === email && p.password === password && p.isActive) || null;
  }

  // Sessions
  getSessions(): Session[] {
    return JSON.parse(localStorage.getItem('sessions') || '[]');
  }

  addSession(session: Session) {
    const sessions = this.getSessions();
    sessions.push(session);
    localStorage.setItem('sessions', JSON.stringify(sessions));
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
  }

  getSessionById(id: string): Session | null {
    const sessions = this.getSessions();
    return sessions.find(s => s.id === id) || null;
  }

  searchSessions(name: string): Session[] {
    const sessions = this.getSessions();
    return sessions.filter(s => 
      s.name.toLowerCase().includes(name.toLowerCase())
    );
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

  // Generate unique IDs
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Generate session PIN
  generatePin(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}

export const storage = LocalStorage.getInstance();
export type { Session, Photographer, BundlePlan, Order, Location };
