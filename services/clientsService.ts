import { initializeApp } from "firebase/app";
import type { Client } from "../types";
import { getDatabase, ref, get, child, update, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDu5SnGIf49M-oDkA64gXGM-6SgIJjWZfY",
  authDomain: "cliente-qr.firebaseapp.com",
  databaseURL: "https://cliente-qr-default-rtdb.firebaseio.com",
  projectId: "cliente-qr",
  storageBucket: "cliente-qr.firebasestorage.app",
  messagingSenderId: "122423317855",
  appId: "1:122423317855:android:9be6df7917d0b7e5ad12ea",
};

// Evitar inicializar Firebase más de una vez
let appInitialized = false;

const getFirebaseApp = () => {
  if (!appInitialized) {
    initializeApp(firebaseConfig);
    appInitialized = true;
  }
};

export const getClients = async (): Promise<Client[]> => {
  getFirebaseApp();

  const db = getDatabase();
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, "clientesJG"));

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val() as Record<string, any>;

  const lista: Client[] = Object.entries(data).map(([id, value]) => {
    const v = value as any;

    return {
      id,
      createdAt: v.createdAt || 0,

      // DATOS DE CONTACTO
      razonSocial: v.razonSocial || "",
      nombres: v.nombres || "",
      apellidos: v.apellidos || "",
      nif: v.nif || "",
      equivalenceSurcharge: !!v.equivalenceSurcharge,
      direccion: v.direccion || "",
      province: v.province || "",
      poblacion: v.poblacion || "",
      postalCode: v.postalCode || "",
      telefono: v.telefono || "",
      telefono2: v.telefono2 || "",
      fax: v.fax || "",
      correo: v.correo || "",
      invoiceEmail: v.invoiceEmail || "",
      isCooperativeMember: !!v.isCooperativeMember,
      cooperativeNumber: v.cooperativeNumber || "",

      purchasingContactName: v.purchasingContactName || "",
      purchasingContactEmail: v.purchasingContactEmail || "",
      purchasingContactPhone: v.purchasingContactPhone || "",

      // CAMPOS GENERALES
      empresa: v.empresa || "",
      cargo: v.cargo || "",
      web: v.web || "",
      dni: v.dni || "",
      ciudad: v.ciudad || "",
      estado: v.estado || "",
      comentarios: v.comentarios || "",
      mapsUrl: v.mapsUrl || "",
      photoBase64: v.photoBase64 || "",
      scanType: v.scanType || "manual",

      // INTERÉS DE COMPRA
      interestSignage: !!v.interestSignage,
      interestStreetPlates: !!v.interestStreetPlates,
      interestSpeedBumpsMirrors: !!v.interestSpeedBumpsMirrors,
      interestBollardsBikeRacks: !!v.interestBollardsBikeRacks,
      interestBalizamientoH75: !!v.interestBalizamientoH75,
      interestProtections: !!v.interestProtections,
      interestTripodsPosts: !!v.interestTripodsPosts,
      interestMobileBases: !!v.interestMobileBases,
      interestPlasticMetalFences: !!v.interestPlasticMetalFences,
      interestWorksiteBalizamiento: !!v.interestWorksiteBalizamiento,
      interestConesAccessories: !!v.interestConesAccessories,
      interestSpraysTapes: !!v.interestSpraysTapes,
      interestConstructionTools: !!v.interestConstructionTools,
      interestVehicleSignage: !!v.interestVehicleSignage,
      interestSignageBoards: !!v.interestSignageBoards,
      interestNoParking: !!v.interestNoParking,
      interestStreetPlates2: !!v.interestStreetPlates2,
      interestParkingClamps: !!v.interestParkingClamps,

      // TIPOLOGÍA DE CLIENTE
      typeSupplyIndustry: !!v.typeSupplyIndustry,
      typeIndustrialScreenPrinting: !!v.typeIndustrialScreenPrinting,
      typeConstructionSupply: !!v.typeConstructionSupply,
      typeVehicleWrapping: !!v.typeVehicleWrapping,
      typeAgriculturalSupply: !!v.typeAgriculturalSupply,
      typeSignage: !!v.typeSignage,
      typeRental: !!v.typeRental,
      typeWorkClothing: !!v.typeWorkClothing,
      typeAutoParts: !!v.typeAutoParts,
      typeSafetyEquipment: !!v.typeSafetyEquipment,
      typeHardwareStore: !!v.typeHardwareStore,
      typeHousehold: !!v.typeHousehold,
      typeOther1: v.typeOther1 || "",
      typeOther2: v.typeOther2 || "",
    };
  });

  // Ordenar por fecha de creación (más recientes primero)
  lista.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return lista;
};

// Añadir un nuevo cliente
export const addClient = async (client: Client): Promise<void> => {
  getFirebaseApp();
  const db = getDatabase();
  const clientRef = ref(db, `clientesJG/${client.id}`);
  await update(clientRef, client);
};

// Actualizar un cliente existente
export const updateClient = async (client: Client): Promise<void> => {
  getFirebaseApp();
  const db = getDatabase();
  const clientRef = ref(db, `clientesJG/${client.id}`);
  await update(clientRef, client);
};

// Borrar un cliente por id
export const deleteClient = async (id: string): Promise<void> => {
  getFirebaseApp();
  const db = getDatabase();
  const clientRef = ref(db, `clientesJG/${id}`);
  await remove(clientRef);
};
