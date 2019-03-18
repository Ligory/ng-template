export interface Menu {
  module?: any;
  title: string;
  menuItems: Array<MenuItem>;
}

export interface MenuItem {
  title: string;
  color?: string;
  icon: string;
  className?: string;
  isBusy?: boolean;
  routerLink: string;
  routerOutlet?: string;
  content?: Array<string>;
  pendingItemsInNumber?: number;
  quickActions?: Array<QuickAction>;
  contentCallback?: (menuItem: MenuItem) => void;
}

export interface QuickAction {
  title: string;
  icon: string;
  fontSet?: string;
  className?: string;
  routerLink: string;
}
