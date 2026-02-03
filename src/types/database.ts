export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isCellarModeEnabled?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface WineCellar {
  userId: string;
  wines: string[]; // List of wine names or identifiers
  updatedAt: number;
}

export interface SavedPairing {
  id?: string;
  userId: string;
  dishName: string;
  dishDescription?: string;
  dishCategory: string;
  recommendation: {
    recommendedGrapeVarietals: string;
    specificWineExamples: string[];
    wineCharacteristics: string;
    tastingNotes: string;
    servingTemperature: string;
    suitableGlassware: string;
  };
  descriptors: {
    wineDescriptors: string;
  };
  timestamp: number;
}
