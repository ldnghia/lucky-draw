export interface Employee {
  id: string;
  name: string;
}

export interface Prize {
  id: string;
  name: string;
  enabled: boolean;
  numberPrizes: number;
}

export interface DrawSettings {
  title: string;
  prizes: Prize[];
}


export interface CheckSettings {
  id: number;
  lucky: string;
  w: string;
  rank: string
}