import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ScannerView from './components/ScannerView';
import ClientsView from './components/ClientsView';
import ClientForm from './components/ClientForm';
import ClientDetailsView from './components/ClientDetailsView';
import SplashScreen from './components/SplashScreen';
import { Home } from './components/Home';
import { Client, ViewType, ScanResult } from './types';
import { getClients, addClient, updateClient, deleteClient } from './services/clientsService';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';

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

// Config caché PDFs
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

  useEffect(() => {
    const loadClients = async () => {
      try {
        const lista = await getClients();
        setClients(lista);
      } catch (error) {
        console.error('Error al cargar clientes desde Firebase:', error);
      }
    };
    loadClients();
  }, []);

  const handleDataExtracted = (data: ScanResult) => {
    setEditingClient(data);
    setActiveTab('form');
  };

  // --- FUNCIÓN OPTIMIZADA: GUARDADO EN SEGUNDO PLANO ---
  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const isEditing = !!((editingClient as Client)?.id);

    const targetClient: Client = isEditing
      ? { ...(editingClient as Client), ...clientData }
      : {
          ...clientData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: Date.now(),
          photoBase64: (editingClient as ScanResult)?.photoBase64,
          scanType: (editingClient as ScanResult)?.scanType || 'manual',
        };

    if (isEditing) {
      setClients(prev => prev.map(c => (c.id === targetClient.id ? targetClient : c)));
      setSelectedClient(targetClient);
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
            // Expirado: limpiamos marcas
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheMetaKey);
          }
        } catch {
          localStorage.removeItem(cacheMetaKey);
        }
      }

      if (isCachedValid && localStorage.getItem(cacheKey) === '1') {
        console.log('>>> PDF cacheado vigente, abriendo desde Filesystem:', fileName);

        const uriResult = await Filesystem.getUri({
          path: fileName,
          directory: Directory.Data,
        });

        await FileOpener.openFile({
          path: uriResult.uri,
        });

        console.log('>>> PDF abierto desde caché OK');
        return;
      }

      console.log('>>> PDF no cacheado o caducado, descargando desde', webPath);

      const response = await fetch(webPath);
      console.log('>>> Status fetch', response.status);

      if (!response.ok) {
        throw new Error(`No se pudo descargar ${webPath}: status ${response.status}`);
      }

      const blob = await response.blob();
      console.log('>>> Tamaño blob', blob.size);

      const buffer = await blob.arrayBuffer();
      const base64Data = arrayBufferToBase64(buffer);

      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
      });
      console.log('>>> PDF guardado en Data como', fileName);

      // Guardar metadata de caché
      localStorage.setItem(cacheKey, '1');
      localStorage.setItem(
        cacheMetaKey,
        JSON.stringify({ cachedAt: Date.now() }),
      );

      const uriResult = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Data,
      });
      console.log('>>> URI nativo', uriResult.uri);

      await FileOpener.openFile({
        path: uriResult.uri,
      });

      console.log('>>> PDF abierto OK (descargado y cacheado)');
    } catch (e) {
      console.error('Error abriendo PDF interno', e);
      alert('No se ha podido abrir el PDF. Revisa la consola para más detalles.');
    }
  };

  const handleOpenCatalogoPdf = () => {
    openEmbeddedPdf('/pdf/cat2026.pdf', 'cat2026.pdf');
  };

  const handleOpenAnexoPdf = () => {
    openEmbeddedPdf('/pdf/anexo2026.pdf', 'anexo2026.pdf');
  };

  // NUEVO: Tarifa 2025
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
