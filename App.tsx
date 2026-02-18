import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ScannerView from './components/ScannerView';
import ClientsView from './components/ClientsView';
import ClientForm from './components/ClientForm';
import ClientDetailsView from './components/ClientDetailsView';
import SplashScreen from './components/SplashScreen';
import { Home } from './components/Home';
import { Client, ViewType, ScanResult } from './types';
import { addClient, updateClient, deleteClient } from './services/clientsService';

// 🔹 IMPORTS NUEVOS PARA TIEMPO REAL
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';

// Config Firebase (misma que en services/clientsService)
const firebaseConfig = {
  apiKey: 'AIzaSyDu5SnGIf49M-oDkA64gXGM-6SgIJjWZfY',
  authDomain: 'cliente-qr.firebaseapp.com',
  databaseURL: 'https://cliente-qr-default-rtdb.firebaseio.com',
  projectId: 'cliente-qr',
  storageBucket: 'cliente-qr.firebasestorage.app',
  messagingSenderId: '122423317855',
  appId: '1:122423317855:android:9be6df7917d0b7e5ad12ea',
};

// Evitar inicializar Firebase más de una vez en App
let appInitialized = false;
const ensureFirebaseApp = () => {
  if (!appInitialized) {
    initializeApp(firebaseConfig);
    appInitialized = true;
  }
};

// Conversión segura de ArrayBuffer a base64 (por chunks)
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  const chunkSize = 8192;

  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
};

// Config caché PDFs (lógica de expiración en localStorage)
const PDF_CACHE_HOURS = 12;
const PDF_CACHE_MS = PDF_CACHE_HOURS * 60 * 60 * 1000;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewType>('splash');
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | ScanResult | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [scannerMode, setScannerMode] = useState<'tarjeta' | 'qr'>('tarjeta');

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTab('home');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // 🔹 Suscripción en tiempo real a clientesJG
  useEffect(() => {
    ensureFirebaseApp();
    const db = getDatabase();
    const clientsRef = ref(db, 'clientesJG');

    const unsubscribe = onValue(
      clientsRef,
      snapshot => {
        if (!snapshot.exists()) {
          setClients([]);
          return;
        }

        const data = snapshot.val() as Record<string, any>;

        const lista: Client[] = Object.entries(data).map(([id, value]) => {
          const v = value as any;

          return {
            id,
            createdAt: v.createdAt || 0,

            // DATOS DE CONTACTO
            razonSocial: v.razonSocial || '',
            nombres: v.nombres || '',
            apellidos: v.apellidos || '',
            nif: v.nif || '',
            equivalenceSurcharge: !!v.equivalenceSurcharge,
            direccion: v.direccion || '',
            province: v.province || '',
            poblacion: v.poblacion || '',
            postalCode: v.postalCode || '',
            telefono: v.telefono || '',
            telefono2: v.telefono2 || '',
            fax: v.fax || '',
            correo: v.correo || '',
            invoiceEmail: v.invoiceEmail || '',
            isCooperativeMember: v.isCooperativeMember ?? '',
            cooperativeNumber: v.cooperativeNumber || '',

            purchasingContactName: v.purchasingContactName || '',
            purchasingContactEmail: v.purchasingContactEmail || '',
            purchasingContactPhone: v.purchasingContactPhone || '',

            // CAMPOS GENERALES
            empresa: v.empresa || '',
            cargo: v.cargo || '',
            web: v.web || '',
            dni: v.dni || '',
            ciudad: v.ciudad || '',
            estado: v.estado || '',
            comentarios: v.comentarios || '',
            mapsUrl: v.mapsUrl || '',
            photoBase64: v.photoBase64 || '',
            photoBackBase64: v.photoBackBase64 || '',
            profilePhotoBase64: v.profilePhotoBase64 || '',
            scanType: v.scanType || 'manual',

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
            typeOther1: v.typeOther1 || '',
            typeOther2: v.typeOther2 || '',
          };
        });

        lista.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setClients(lista);

        setSelectedClient(prev => {
          if (!prev) return prev;
          const refreshed = lista.find(c => c.id === prev.id);
          return refreshed || prev;
        });
      },
      error => {
        console.error('Error escuchando clientes en tiempo real:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDataExtracted = (data: ScanResult) => {
    setEditingClient(data);
    setActiveTab('form');
  };

  // --- FUNCIÓN OPTIMIZADA: GUARDADO EN SEGUNDO PLANO ---
  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const isEditing = !!((editingClient as Client)?.id);

    // Normalizamos razonSocial para que siempre tenga valor coherente
    const normalizedData: Omit<Client, 'id' | 'createdAt'> = {
      ...clientData,
      razonSocial: clientData.razonSocial || clientData.empresa || '',
    };

    const targetClient: Client = isEditing
      ? { ...(editingClient as Client), ...normalizedData }
      : {
          ...normalizedData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: Date.now(),
          photoBase64: (editingClient as ScanResult)?.photoBase64,
          scanType: (editingClient as ScanResult)?.scanType || 'manual',
        };

    // Actualizamos estado local rápido
    if (isEditing) {
      setClients(prev => prev.map(c => (c.id === targetClient.id ? targetClient : c)));
      setSelectedClient(targetClient); // detalle verá la razón social actualizada
      setActiveTab('details');
    } else {
      setClients(prev => [targetClient, ...prev]);
      setActiveTab('clients');
    }

    setEditingClient(null);

    const saveInBackground = async () => {
      try {
        if (isEditing) {
          await updateClient(targetClient);
        } else {
          await addClient(targetClient);
        }
      } catch (error) {
        console.error('❌ Error en guardado de segundo plano:', error);
        alert('Hubo un error al sincronizar con la nube. Revisa la consola para más detalles.');
      }
    };

    saveInBackground();
  };

  // 🔹 Actualizar cliente desde la vista de detalles (para la X de la foto de perfil)
  const handleUpdateClientFromDetails = (updated: Client) => {
    // actualizar lista local
    setClients(prev => prev.map(c => (c.id === updated.id ? updated : c)));
    // actualizar seleccionado
    setSelectedClient(updated);

    // sincronizar con Firebase
    const save = async () => {
      try {
        await updateClient(updated);
      } catch (error) {
        console.error('Error actualizando cliente desde detalles:', error);
        alert('No se ha podido actualizar el cliente en la nube.');
      }
    };
    save();
  };

  const handleDeleteClient = async (id: string) => {
    if (window.confirm('¿Deseas eliminar permanentemente este cliente?')) {
      setClients(prev => prev.filter(c => c.id !== id));
      if (selectedClient?.id === id) setSelectedClient(null);
      setActiveTab('clients');

      try {
        await deleteClient(id);
      } catch (error) {
        console.error('Error eliminando cliente:', error);
      }
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setActiveTab('form');
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setActiveTab('details');
  };

  const handleAddNewManual = () => {
    setEditingClient(null);
    setSelectedClient(null);
    setActiveTab('form');
  };

  const handleOpenScanner = (type: 'tarjeta' | 'qr') => {
    setScannerMode(type);
    setActiveTab('scanner');
  };

  // Versión solo WEB de openEmbeddedPdf, manteniendo caché en localStorage
  const openEmbeddedPdf = async (webPath: string, fileName: string) => {
    try {
      const cacheKey = `pdf_cached_${fileName}`;
      const cacheMetaKey = `pdf_cached_meta_${fileName}`;

      const metaRaw = localStorage.getItem(cacheMetaKey);
      let isCachedValid = false;

      if (metaRaw) {
        try {
          const meta = JSON.parse(metaRaw) as { cachedAt: number };
          const now = Date.now();
          if (now - meta.cachedAt < PDF_CACHE_MS) {
            isCachedValid = true;
          } else {
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheMetaKey);
          }
        } catch {
          localStorage.removeItem(cacheMetaKey);
        }
      }

      if (isCachedValid && localStorage.getItem(cacheKey) === '1') {
        window.open(webPath, '_blank', 'noopener,noreferrer');
        return;
      }

      const response = await fetch(webPath, { method: 'HEAD' });

      if (!response.ok) {
        throw new Error(`No se pudo acceder a ${webPath}: status ${response.status}`);
      }

      localStorage.setItem(cacheKey, '1');
      localStorage.setItem(cacheMetaKey, JSON.stringify({ cachedAt: Date.now() }));

      window.open(webPath, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.error('Error abriendo PDF (web)', e);
      alert('No se ha podido abrir el PDF. Revisa la consola para más detalles.');
    }
  };

  const handleOpenCatalogoPdf = () => {
    openEmbeddedPdf('/pdf/cat2026.pdf', 'cat2026.pdf');
  };

  const handleOpenAnexoPdf = () => {
    openEmbeddedPdf('/pdf/anexo2026.pdf', 'anexo2026.pdf');
  };

  const handleOpenTarifaPdf = () => {
    openEmbeddedPdf('/pdf/tarifa2025.pdf', 'tarifa2025.pdf');
  };

  return (
    <Layout
      activeTab={activeTab === 'details' ? 'clients' : activeTab}
      setActiveTab={tab => {
        if (tab === 'form') handleAddNewManual();
        else {
          setSelectedClient(null);
          setEditingClient(null);
          setActiveTab(tab);
        }
      }}
    >
      {activeTab === 'splash' && <SplashScreen />}

      {activeTab === 'home' && (
        <Home
          onOpenCatalogo={handleOpenCatalogoPdf}
          onOpenAnexo={handleOpenAnexoPdf}
          onOpenTarifa={handleOpenTarifaPdf}
          onOpenScanner={() => setActiveTab('scanner')}
        />
      )}

      {activeTab === 'scanner' && (
        <ScannerView
          onDataExtracted={handleDataExtracted}
          onCancel={() => setActiveTab('clients')}
          initialType={scannerMode}
        />
      )}

      {activeTab === 'clients' && (
        <ClientsView
          clients={clients}
          onDelete={handleDeleteClient}
          onEdit={handleEditClient}
          onViewDetails={handleViewDetails}
          onAddNew={handleAddNewManual}
        />
      )}

      {activeTab === 'details' && selectedClient && (
        <ClientDetailsView
          client={selectedClient}
          onBack={() => setActiveTab('clients')}
          onEdit={handleEditClient}
          onUpdateClient={handleUpdateClientFromDetails}
        />
      )}

      {activeTab === 'form' && (
        <ClientForm
          initialData={editingClient}
          onSave={handleSaveClient}
          onCancel={() => {
            setEditingClient(null);
            if (selectedClient) setActiveTab('details');
            else setActiveTab('clients');
          }}
        />
      )}
    </Layout>
  );
};

export default App;
