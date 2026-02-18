import React, { useState, useEffect } from 'react';
import { Client, ScanResult } from '../types';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface ClientFormProps {
  initialData?: Client | ScanResult | null;
  onSave: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const buildMapsUrl = (direccion?: string) => {
  if (!direccion) return undefined;
  const query = encodeURIComponent(direccion.trim());
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSave, onCancel }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState<Omit<Client, 'id' | 'createdAt'>>({
    razonSocial: '',
    nombres: '',
    apellidos: '',
    nif: '',
    equivalenceSurcharge: false,
    direccion: '',
    province: '',
    poblacion: '',
    postalCode: '',
    telefono: '',
    telefono2: '',
    fax: '',
    correo: '',
    invoiceEmail: '',
    isCooperativeMember: false,
    cooperativeNumber: '',
    purchasingContactName: '',
    purchasingContactEmail: '',
    purchasingContactPhone: '',

    // CAMPOS GENERALES
    empresa: '',
    cargo: '',
    web: '',
    dni: '',
    ciudad: '',
    estado: '',
    comentarios: '',
    mapsUrl: '',
    photoBase64: '',
    photoBackBase64: '',
    profilePhotoBase64: '',
    scanType: 'manual',

    // INTERÉS DE COMPRA
    interestSignage: false,
    interestStreetPlates: false,
    interestSpeedBumpsMirrors: false,
    interestBollardsBikeRacks: false,
    interestBalizamientoH75: false,
    interestProtections: false,
    interestTripodsPosts: false,
    interestMobileBases: false,
    interestPlasticMetalFences: false,
    interestWorksiteBalizamiento: false,
    interestConesAccessories: false,
    interestSpraysTapes: false,
    interestConstructionTools: false,
    interestVehicleSignage: false,
    interestSignageBoards: false,
    interestNoParking: false,
    interestStreetPlates2: false,
    interestParkingClamps: false,

    // TIPOLOGÍA
    typeSupplyIndustry: false,
    typeIndustrialScreenPrinting: false,
    typeConstructionSupply: false,
    typeVehicleWrapping: false,
    typeAgriculturalSupply: false,
    typeSignage: false,
    typeRental: false,
    typeWorkClothing: false,
    typeAutoParts: false,
    typeSafetyEquipment: false,
    typeHardwareStore: false,
    typeHousehold: false,
    typeOther1: '',
    typeOther2: '',
  });

  // Aplicar initialData SIEMPRE que cambie (escáner o editar)
  useEffect(() => {
    console.log('ClientForm initialData >>>', initialData);
    if (!initialData) return;

    const d = initialData as any;

    setFormData(prev => ({
      ...prev,
      // DATOS DE CONTACTO
      razonSocial: d.razonSocial || d.empresa || '',
      nombres: d.nombres || '',
      apellidos: d.apellidos || '',
      nif: d.nif || d.dni || '',
      equivalenceSurcharge: !!d.equivalenceSurcharge,
      direccion: d.direccion || '',
      province: d.province || '',
      poblacion: d.poblacion || '',
      postalCode: d.postalCode || '',
      telefono: d.telefono || '',
      telefono2: d.telefono2 || '',
      fax: d.fax || '',
      correo: d.correo || '',
      invoiceEmail: d.invoiceEmail || '',
      isCooperativeMember: !!d.isCooperativeMember,
      cooperativeNumber: d.cooperativeNumber || '',
      purchasingContactName: d.purchasingContactName || '',
      purchasingContactEmail: d.purchasingContactEmail || '',
      purchasingContactPhone: d.purchasingContactPhone || '',

      // GENERALES
      empresa: d.empresa || '',
      cargo: d.cargo || '',
      web: d.web || '',
      dni: d.dni || '',
      ciudad: d.ciudad || '',
      estado: d.estado || '',
      comentarios: d.comentarios || '',
      mapsUrl: d.mapsUrl || '',
      photoBase64: d.photoBase64 || '',
      photoBackBase64: d.photoBackBase64 || '',
      profilePhotoBase64: d.profilePhotoBase64 || '',
      scanType: d.scanType || 'manual',

      // INTERÉS DE COMPRA
      interestSignage: !!d.interestSignage,
      interestStreetPlates: !!d.interestStreetPlates,
      interestSpeedBumpsMirrors: !!d.interestSpeedBumpsMirrors,
      interestBollardsBikeRacks: !!d.interestBollardsBikeRacks,
      interestBalizamientoH75: !!d.interestBalizamientoH75,
      interestProtections: !!d.interestProtections,
      interestTripodsPosts: !!d.interestTripodsPosts,
      interestMobileBases: !!d.interestMobileBases,
      interestPlasticMetalFences: !!d.interestPlasticMetalFences,
      interestWorksiteBalizamiento: !!d.interestWorksiteBalizamiento,
      interestConesAccessories: !!d.interestConesAccessories,
      interestSpraysTapes: !!d.interestSpraysTapes,
      interestConstructionTools: !!d.interestConstructionTools,
      interestVehicleSignage: !!d.interestVehicleSignage,
      interestSignageBoards: !!d.interestSignageBoards,
      interestNoParking: !!d.interestNoParking,
      interestStreetPlates2: !!d.interestStreetPlates2,
      interestParkingClamps: !!d.interestParkingClamps,

      // TIPOLOGÍA
      typeSupplyIndustry: !!d.typeSupplyIndustry,
      typeIndustrialScreenPrinting: !!d.typeIndustrialScreenPrinting,
      typeConstructionSupply: !!d.typeConstructionSupply,
      typeVehicleWrapping: !!d.typeVehicleWrapping,
      typeAgriculturalSupply: !!d.typeAgriculturalSupply,
      typeSignage: !!d.typeSignage,
      typeRental: !!d.typeRental,
      typeWorkClothing: !!d.typeWorkClothing,
      typeAutoParts: !!d.typeAutoParts,
      typeSafetyEquipment: !!d.typeSafetyEquipment,
      typeHardwareStore: !!d.typeHardwareStore,
      typeHousehold: !!d.typeHousehold,
      typeOther1: d.typeOther1 || '',
      typeOther2: d.typeOther2 || '',
    }));

    // cada vez que llega un escaneo/cliente nuevo, empezamos en el paso 1
    setStep(1);
  }, [initialData]);

  const handleCheckboxChange = (name: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] as any }));
  };

  const handleNext = () => {
    setStep(prev => (prev < 3 ? (prev + 1) as 1 | 2 | 3 : prev));
  };

  const handlePrev = () => {
    setStep(prev => (prev > 1 ? (prev - 1) as 1 | 2 | 3 : prev));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Si ya hay foto de perfil, guardar directamente
    if (formData.profilePhotoBase64) {
      const dataToSave = {
        ...formData,
        mapsUrl: buildMapsUrl(formData.direccion) || '',
      };
      onSave(dataToSave);
      return;
    }

    const wantsPhoto = window.confirm('¿Deseas una foto para tu perfil?');

    if (!wantsPhoto) {
      const dataToSave = {
        ...formData,
        mapsUrl: buildMapsUrl(formData.direccion) || '',
        profilePhotoBase64: '',
      };
      onSave(dataToSave);
      return;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      const base64 = `data:image/jpeg;base64,${image.base64String}`;

      const dataToSave = {
        ...formData,
        profilePhotoBase64: base64,
        mapsUrl: buildMapsUrl(formData.direccion) || '',
      };

      onSave(dataToSave);
    } catch (err) {
      console.error('Error al tomar la foto', err);
      const dataToSave = {
        ...formData,
        mapsUrl: buildMapsUrl(formData.direccion) || '',
        profilePhotoBase64: '',
      };
      onSave(dataToSave);
    }
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="bg-gray-100/50 px-6 py-3">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
        {title}
      </h3>
    </div>
  );

  const ToggleField = ({
    label,
    name,
  }: {
    label: string;
    name: keyof typeof formData;
  }) => (
    <button
      type="button"
      onClick={() => handleCheckboxChange(name)}
      className="w-full flex items-center justify-between px-6 py-3 bg-white border-b border-gray-50"
    >
      <span className="text-[11px] font-semibold text-gray-700">
        {label}
      </span>
      <span
        className={`w-10 h-5 flex items-center rounded-full px-1 ${
          (formData as any)[name] ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
            (formData as any)[name] ? 'translate-x-4' : ''
          }`}
        />
      </span>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-white z-[80] absolute inset-0 animate-slide-up pb-24 overflow-x-hidden">
      {/* Navbar */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
        <button onClick={onCancel} className="text-blue-600 font-bold text-sm">
          Cancelar
        </button>
        <h2 className="text-lg font-black text-gray-900 tracking-tight">
          Nuevo Cliente
        </h2>
        <button
          type="button"
          onClick={() =>
            setFormData(prev => ({
              ...prev,
              razonSocial: '',
              nombres: '',
              apellidos: '',
              nif: '',
              equivalenceSurcharge: false,
              direccion: '',
              province: '',
              poblacion: '',
              postalCode: '',
              telefono: '',
              telefono2: '',
              fax: '',
              correo: '',
              invoiceEmail: '',
              isCooperativeMember: false,
              cooperativeNumber: '',
              purchasingContactName: '',
              purchasingContactEmail: '',
              purchasingContactPhone: '',
              comentarios: '',
            }))
          }
          className="text-blue-600 font-bold text-sm"
        >
          Limpiar
        </button>
      </div>

      {/* Indicador de pasos */}
      <div className="px-6 py-3 flex items-center gap-2">
        {[1, 2, 3].map(n => (
          <div
            key={n}
            className={`flex-1 h-1.5 rounded-full ${
              step >= n ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        onSubmitCapture={e => e.preventDefault()}
        className="flex-1 overflow-y-auto no-scrollbar pb-24 overflow-x-hidden"
      >
        {/* Paso 1: Datos de contacto */}
        {step === 1 && (
          <>
            <SectionHeader title="Identificación / Fiscal" />

            {/* Razón Social */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Razón Social
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="razonSocial"
                  autoComplete="off"
                  value={formData.razonSocial}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, razonSocial: e.target.value }))
                  }
                  placeholder="Nombre fiscal"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* NIF / CIF */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                NIF / CIF
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="nif"
                  autoComplete="off"
                  value={formData.nif}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, nif: e.target.value }))
                  }
                  placeholder="Documento fiscal"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
                <div className="text-blue-500 opacity-60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4zm6 9l-4 5h12l-3-4-2.03 2.71L10 13zm7-11h-4v2h4v7h2V4c0-1.1-.9-2-2-2zM4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7zm13 7h-4v2h4c1.1 0 2-.9 2-2v-7h-2v7z" />
                  </svg>
                </div>
              </div>
            </div>

            <SectionHeader title="Datos de contacto" />

            {/* Nombre */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Nombre
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="nombres"
                  autoComplete="off"
                  value={formData.nombres}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, nombres: e.target.value }))
                  }
                  placeholder="Ej: Juan"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Apellidos */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Apellidos
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="apellidos"
                  autoComplete="off"
                  value={formData.apellidos}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, apellidos: e.target.value }))
                  }
                  placeholder="Ej: Pérez"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Teléfono
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="tel"
                  name="telefono"
                  autoComplete="off"
                  value={formData.telefono}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, telefono: e.target.value }))
                  }
                  placeholder="+34 000 000 000"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Teléfono 2 */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Teléfono 2
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="tel"
                  name="telefono2"
                  autoComplete="off"
                  value={formData.telefono2}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, telefono2: e.target.value }))
                  }
                  placeholder="+34 000 000 000 (opcional)"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Fax */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Fax
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="tel"
                  name="fax"
                  autoComplete="off"
                  value={formData.fax}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, fax: e.target.value }))
                  }
                  placeholder="Número de fax (opcional)"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Email */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Email
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  name="correo"
                  autoComplete="off"
                  value={formData.correo}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, correo: e.target.value }))
                  }
                  placeholder="correo@ejemplo.com"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Email facturas */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Email facturas
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  name="invoiceEmail"
                  autoComplete="off"
                  value={formData.invoiceEmail}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, invoiceEmail: e.target.value }))
                  }
                  placeholder="facturas@ejemplo.com"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            <SectionHeader title="Dirección" />

            {/* Dirección */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Dirección
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="direccion"
                  autoComplete="off"
                  value={formData.direccion}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, direccion: e.target.value }))
                  }
                  placeholder="Calle, número, polígono..."
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Provincia */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Provincia
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="province"
                  autoComplete="off"
                  value={formData.province}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, province: e.target.value }))
                  }
                  placeholder="Provincia"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Localidad */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Localidad
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="poblacion"
                  autoComplete="off"
                  value={formData.poblacion}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, poblacion: e.target.value }))
                  }
                  placeholder="Localidad"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Código Postal */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Código Postal
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="postalCode"
                  autoComplete="off"
                  value={formData.postalCode}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, postalCode: e.target.value }))
                  }
                  placeholder="CP"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            <SectionHeader title="Cooperativa y compras" />

           {/* Cooperativa - Asociado a cooperativa */}
          <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
            <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
              Asociado a cooperativa
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                name="isCooperativeMember"
                autoComplete="off"
                // si quieres seguir usando string, cambia el tipo en Client a string
                value={formData.isCooperativeMember ? String(formData.isCooperativeMember) : ''}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    // si lo cambias a string en el tipo, pon directamente e.target.value
                    isCooperativeMember: e.target.value as any,
                  }))
                }
                placeholder="Nombre o referencia de la cooperativa"
                className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
              />
            </div>
          </div>

            {/* Nº de socio */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Nº de socio
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="cooperativeNumber"
                  autoComplete="off"
                  value={formData.cooperativeNumber}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, cooperativeNumber: e.target.value }))
                  }
                  placeholder="Número de socio (si aplica)"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Persona de contacto (Compras) */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Persona de contacto (Compras)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="purchasingContactName"
                  autoComplete="off"
                  value={formData.purchasingContactName}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      purchasingContactName: e.target.value,
                    }))
                  }
                  placeholder="Nombre y apellidos"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Email persona contacto */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Email persona contacto
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  name="purchasingContactEmail"
                  autoComplete="off"
                  value={formData.purchasingContactEmail}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      purchasingContactEmail: e.target.value,
                    }))
                  }
                  placeholder="compras@ejemplo.com"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Teléfono persona contacto */}
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Teléfono persona contacto
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="tel"
                  name="purchasingContactPhone"
                  autoComplete="off"
                  value={formData.purchasingContactPhone}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      purchasingContactPhone: e.target.value,
                    }))
                  }
                  placeholder="+34 000 000 000"
                  className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            <SectionHeader title="Comentarios" />
            <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50">
              <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                Comentarios
              </label>
              <textarea
                name="comentarios"
                value={formData.comentarios}
                onChange={e =>
                  setFormData(prev => ({ ...prev, comentarios: e.target.value }))
                }
                placeholder="Notas adicionales sobre el cliente (opcional)"
                className="w-full text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal min-h-[80px] resize-none"
              />
            </div>
          </>
        )}

        {/* Paso 2: Interés de compra */}
        {step === 2 && (
          <>
            <SectionHeader title="Interés de compra" />

            <div className="bg-white mt-1 border-t border-gray-50">
              <ToggleField
                label="Señalización en general"
                name="interestSignage"
              />
              <ToggleField
                label="Placas de calle"
                name="interestStreetPlates"
              />
              <ToggleField
                label="Placas de calle (otra gama)"
                name="interestStreetPlates2"
              />
              <ToggleField
                label="Carteles de señalización"
                name="interestSignageBoards"
              />
              <ToggleField
                label="Señales de 'Prohibido aparcar'"
                name="interestNoParking"
              />
            </div>

            <SectionHeader title="Tráfico y seguridad vial" />
            <div className="bg-white border-t border-gray-50">
              <ToggleField
                label="Badenes y espejos"
                name="interestSpeedBumpsMirrors"
              />
              <ToggleField
                label="Bolardos y aparcabicis"
                name="interestBollardsBikeRacks"
              />
              <ToggleField
                label="Balizamiento H75"
                name="interestBalizamientoH75"
              />
              <ToggleField
                label="Conos y accesorios"
                name="interestConesAccessories"
              />
              <ToggleField
                label="Cepos de aparcamiento"
                name="interestParkingClamps"
              />
            </div>

            <SectionHeader title="Obra y balizamiento" />
            <div className="bg-white border-t border-gray-50">
              <ToggleField
                label="Vallas plásticas / metálicas"
                name="interestPlasticMetalFences"
              />
              <ToggleField
                label="Balizamiento de obra"
                name="interestWorksiteBalizamiento"
              />
              <ToggleField
                label="Trípodes y postes"
                name="interestTripodsPosts"
              />
              <ToggleField
                label="Bases móviles"
                name="interestMobileBases"
              />
              <ToggleField
                label="Sprays de marcaje y cintas"
                name="interestSpraysTapes"
              />
              <ToggleField
                label="Herramienta de construcción"
                name="interestConstructionTools"
              />
            </div>

            <SectionHeader title="Protecciones y vehículos" />
            <div className="bg-white border-t border-gray-50">
              <ToggleField
                label="Protecciones (columnas, esquinas, etc.)"
                name="interestProtections"
              />
              <ToggleField
                label="Rotulación / señalización de vehículos"
                name="interestVehicleSignage"
              />
            </div>
          </>
        )}

        {/* Paso 3: Tipología de cliente */}
        {step === 3 && (
          <>
            <SectionHeader title="Tipología del cliente" />

            <div className="bg-white mt-1 border-t border-gray-50">
              <ToggleField
                label="Suministro industrial"
                name="typeSupplyIndustry"
              />
              <ToggleField
                label="Serigrafía / rotulación industrial"
                name="typeIndustrialScreenPrinting"
              />
              <ToggleField
                label="Suministro para construcción"
                name="typeConstructionSupply"
              />
              <ToggleField
                label="Rotulación de vehículos"
                name="typeVehicleWrapping"
              />
              <ToggleField
                label="Suministro agrícola"
                name="typeAgriculturalSupply"
              />
              <ToggleField
                label="Empresa de señalización"
                name="typeSignage"
              />
              <ToggleField
                label="Empresa de alquiler"
                name="typeRental"
              />
              <ToggleField
                label="Ropa laboral / EPIs"
                name="typeWorkClothing"
              />
              <ToggleField
                label="Recambios de automóvil"
                name="typeAutoParts"
              />
              <ToggleField
                label="Equipos de seguridad / EPIs"
                name="typeSafetyEquipment"
              />
              <ToggleField
                label="Ferretería"
                name="typeHardwareStore"
              />
              <ToggleField
                label="Hogar / bazar"
                name="typeHousehold"
              />
            </div>

            <SectionHeader title="Otros tipos" />
            <div className="bg-white border-t border-gray-50">
              <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
                <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                  Otro tipo 1
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    name="typeOther1"
                    autoComplete="off"
                    value={formData.typeOther1}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, typeOther1: e.target.value }))
                    }
                    placeholder="Especificar otra tipología (opcional)"
                    className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                  />
                </div>
              </div>

              <div className="bg-white px-6 py-4 flex flex-col border-b border-gray-50 last:border-b-0">
                <label className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                  Otro tipo 2
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    name="typeOther2"
                    autoComplete="off"
                    value={formData.typeOther2}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, typeOther2: e.target.value }))
                    }
                    placeholder="Especificar otra tipología (opcional)"
                    className="flex-1 text-gray-800 font-semibold focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </form>

      {/* Footer navegación */}
      <div className="border-t px-6 py-3 flex justify-between gap-2 bg-white sticky bottom-0 z-30">
        {step === 1 ? (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold"
          >
            Cancelar
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePrev}
            className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold"
          >
            Anterior
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold"
          >
            Siguiente
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="px-4 py-2 rounded-full bg-green-600 text-white text-sm font-semibold"
          >
            Guardar
          </button>
        )}
      </div>
    </div>
  );
};

export default ClientForm;
