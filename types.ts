export interface Client {
  id: string;
  createdAt: number;
  razonSocial: string;
  nombres: string;
  apellidos: string;
  nif: string;
  equivalenceSurcharge: boolean;
  direccion: string;
  province: string;
  poblacion: string;
  postalCode: string;
  telefono: string;
  telefono2: string;
  fax: string;
  correo: string;
  invoiceEmail: string;
  isCooperativeMember: boolean;
  cooperativeNumber: string;
  purchasingContactName: string;
  purchasingContactEmail: string;
  purchasingContactPhone: string;
  empresa: string;
  cargo: string;
  web: string;
  dni: string;
  ciudad: string;
  estado: string;
  comentarios: string;
  mapsUrl: string;
  photoBase64: string;
  photoBackBase64?: string;
  profilePhotoBase64?: string;
  scanType: 'tarjeta' | 'qr' | 'manual';
  interestSignage: boolean;
  interestStreetPlates: boolean;
  interestSpeedBumpsMirrors: boolean;
  interestBollardsBikeRacks: boolean;
  interestBalizamientoH75: boolean;
  interestProtections: boolean;
  interestTripodsPosts: boolean;
  interestMobileBases: boolean;
  interestPlasticMetalFences: boolean;
  interestWorksiteBalizamiento: boolean;
  interestConesAccessories: boolean;
  interestSpraysTapes: boolean;
  interestConstructionTools: boolean;
  interestVehicleSignage: boolean;
  interestSignageBoards: boolean;
  interestNoParking: boolean;
  interestStreetPlates2: boolean;
  interestParkingClamps: boolean;
  typeSupplyIndustry: boolean;
  typeIndustrialScreenPrinting: boolean;
  typeConstructionSupply: boolean;
  typeVehicleWrapping: boolean;
  typeAgriculturalSupply: boolean;
  typeSignage: boolean;
  typeRental: boolean;
  typeWorkClothing: boolean;
  typeAutoParts: boolean;
  typeSafetyEquipment: boolean;
  typeHardwareStore: boolean;
  typeHousehold: boolean;
  typeOther1: string;
  typeOther2: string;
}

export type ViewType = 'splash' | 'home' | 'scanner' | 'form' | 'clients' | 'details';

export interface ScanResult {
  nombres?: string;
  apellidos?: string;
  empresa?: string;
  cargo?: string;
  telefono?: string;
  telefono2?: string;
  correo?: string;
  web?: string;
  direccion?: string;
  codigoPostal?: string;  // añadido
  localidad?: string;     // añadido
  ciudad?: string;
  estado?: string;
  cif?: string;           // añadido
  comentarios?: string;
  photoBase64?: string;
  photoBackBase64?: string;
  scanType?: 'tarjeta' | 'qr';
}
