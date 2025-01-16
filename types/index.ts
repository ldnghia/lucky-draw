export interface Employee {
  id: string;
  name: string;
}

export interface Prize {
  id: string;
  name: string;
  enabled: boolean;
}

export interface DrawSettings {
  title: string;
  prizes: Prize[];
}

