export interface Client {
  id: string;
  createdAt: number;

  // DATOS DE CONTACTO
  razonSocial: string;              // Razón Social
  nombres: string;                  // Nombre
  apellidos: string;
  nif: string;
  equivalenceSurcharge: boolean;    // Recargo de equivalencia
  direccion: string;
  province: string;                 // Provincia
  poblacion: string;                // Localidad
  postalCode: string;               // Código postal
  telefono: string;
  telefono2: string;
  fax: string;
  correo: string;                   // Email
  invoiceEmail: string;             // Email facturas
  isCooperativeMember: boolean;     // Asociado a cooperativa
  cooperativeNumber: string;        // Nº de socio

  // DEP. COMPRAS
  purchasingContactName: string;    // Persona de contacto
  purchasingContactEmail: string;   // Email persona de contacto
  purchasingContactPhone: string;   // Teléfono persona de contacto

  // CAMPOS GENERALES QUE YA TENÍAS
  empresa: string;                  // Puedes usarlo igual que razón social o para nombre comercial
  cargo: string;
  web: string;
  dni: string;                      // Si lo sigues usando aparte del NIF
  ciudad: string;
  estado: string;
  comentarios: string;
  mapsUrl: string;
  photoBase64: string;
  photoBackBase64?: string;
  profilePhotoBase64?: string;
  scanType: 'tarjeta' | 'qr' | 'manual';

  // INTERÉS DE COMPRA
  interestSignage: boolean;               // Señalizacion
  interestStreetPlates: boolean;          // Placas de Calle
  interestSpeedBumpsMirrors: boolean;     // Reductores y Espejos
  interestBollardsBikeRacks: boolean;     // Bolardos y Aparcabicis
  interestBalizamientoH75: boolean;       // Balizamiento (H75)
  interestProtections: boolean;           // Protecciones
  interestTripodsPosts: boolean;          // Trípodes y Postes
  interestMobileBases: boolean;           // Bases Móviles
  interestPlasticMetalFences: boolean;    // Vallas plástico y metal
  interestWorksiteBalizamiento: boolean;  // Balizamiento Obras
  interestConesAccessories: boolean;      // Conos y Accesorios
  interestSpraysTapes: boolean;           // Sprays marcaje, cintas balizamiento
  interestConstructionTools: boolean;     // Utillaje construcción
  interestVehicleSignage: boolean;        // Señalización vehículos
  interestSignageBoards: boolean;         // Cartelería
  interestNoParking: boolean;             // Vados permanentes
  interestStreetPlates2: boolean;         // Placas de calle (segunda línea si la distingues)
  interestParkingClamps: boolean;         // Cepos parking

  // TIPOLOGÍA DE CLIENTE
  typeSupplyIndustry: boolean;              // Suministro Industria
  typeIndustrialScreenPrinting: boolean;    // Serigrafía industrial
  typeConstructionSupply: boolean;          // Suministro construcción
  typeVehicleWrapping: boolean;             // Rotulación de vehículo
  typeAgriculturalSupply: boolean;          // Suministro agrícola
  typeSignage: boolean;                     // Señalizacion
  typeRental: boolean;                      // Alquilador
  typeWorkClothing: boolean;                // Ropa laboral
  typeAutoParts: boolean;                   // Recambio automoción
  typeSafetyEquipment: boolean;             // Protección laboral
  typeHardwareStore: boolean;               // Ferretería
  typeHousehold: boolean;                   // Menaje
  typeOther1: string;                       // Otros 1
  typeOther2: string;                       // Otros 2
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
  dni?: string;
  direccion?: string;
  poblacion?: string;
  ciudad?: string;
  estado?: string;
  comentarios?: string;
  photoBase64?: string;
  photoBackBase64?: string;
  scanType?: 'tarjeta' | 'qr';
}
