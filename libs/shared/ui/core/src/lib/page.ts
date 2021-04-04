export interface Page {
  id: string;
  icon: string;
  label: string;
  image?: string;
  path?: string[];
  event?: { name: string; data?: any };
}
