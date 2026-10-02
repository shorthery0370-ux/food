export interface MenuItem {
  name: string;
  price: string;
  description: string;
  isMustTry?: boolean;
}

export interface OperatingHours {
  hours: string;
  breakTime?: string;
  lastOrder?: string;
  closedDays: string;
}

export interface CatchTableInfo {
  available: boolean;
  badgeLabel: string;
  typeText: string;
  tip: string;
  bookingUrl?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  subName: string;
  category: string;
  region: string;
  district: 'jeju-si' | 'seogwipo-si';
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  image: string;
  imageAlt: string;
  summary: string;
  story: string;
  menuList: MenuItem[];
  operatingHours: OperatingHours;
  catchTable: CatchTableInfo;
  parkingInfo: string;
  transportTip: string;
  tags: string[];
}
