import React, { useState } from 'react';
import { Client } from '../types';

interface ClientDetailsViewProps {
  client: Client;
  onBack: () => void;
  onEdit: (client: Client) => void;
}

const ClientDetailsView: React.FC<ClientDetailsViewProps> = ({ client, onBack, onEdit }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<'front' | 'back'>('front');

  const ActionButton = ({
    icon,
    label,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    color: string;
  }) => (
    <button className="flex flex-col items-center gap-2 group">
      <div
        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${color} shadow-sm active:scale-90 transition-all`}
      >
        {icon}
      </div>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
        {label}
      </span>
    </button>
  );

  const InfoRow = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon: React.ReactNode | null;
  }) => (
    <div className="flex items-center justify-between py-5 border-b border-gray-50 last:border-b-0">
      <div className="space-y-1">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
          {label}
        </p>
        <p
          className={`font-bold text-sm ${
            label === 'Estado' || label === 'ESTADO'
              ? 'text-green-600 flex items-center gap-1.5'
              : 'text-gray-900'
          }`}
        >
          {(label === 'Estado' || label === 'ESTADO') && (
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          )}
          {value || 'N/A'}
        </p>
      </div>
      <div className="text-gray-300">{icon}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-white z-[90] flex flex-col h-full overflow-hidden animate-slide-up pb-24">
      {/* Top Navbar */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
        <button onClick={onBack} className="text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-black text-gray-900 tracking-tight">
          Detalle del Cliente
        </h2>
        <button onClick={() => onEdit(client)} className="text-blue-600 font-bold text-sm">
          Editar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50/30">
        {/* Profile Header */}
        <div className="p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-28 h-28 bg-white p-1 rounded-full shadow-2xl">
              {client.profilePhotoBase64 ? (
                <img
                  src={client.profilePhotoBase64}
                  alt={`${client.nombres} ${client.apellidos}`}
                  className="w-full h-full rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center font-black text-4xl text-blue-600 border-4 border-blue-100">
                  {client.nombres.charAt(0)}
                  {client.apellidos.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute bottom-1 right-1 bg-blue-600 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-white">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-black text-gray-900">
              {client.nombres} {client.apellidos}
            </h3>
            <p className="text-blue-600 font-bold text-sm mt-1">
              {client.empresa || 'Empresa N/A'}
            </p>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">
              ID Cliente: #{client.id.slice(0, 5)}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-6 pb-8">
          <ActionButton
            color="bg-blue-50 text-blue-600"
            label="Llamar"
            icon={
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            }
          />
          <ActionButton
            color="bg-blue-100 text-blue-700"
            label="Correo"
            icon={
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            }
          />
          <ActionButton
            color="bg-green-50 text-green-600"
            label="WhatsApp"
            icon={
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.94 5.86L3 21l3.22-.91C7.74 21.33 9.79 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.75 13.92c-.23.63-1.34 1.16-1.85 1.24-.46.07-.92.08-1.54-.1-1.03-.31-2.47-.92-3.83-2.13-1.13-1-1.95-2.07-2.39-2.9-.22-.44-.45-.92-.45-1.42 0-1.02.53-1.57.77-1.83.21-.24.5-.32.74-.32h.5c.16 0 .37.01.54.39.2.47.67 1.63.73 1.76.06.12.1.27.02.43-.08.16-.12.26-.25.41-.13.15-.27.34-.38.45-.13.12-.26.25-.11.51.15.26.68 1.11 1.45 1.8.99.88 1.83 1.15 2.09 1.28.26.13.41.11.56-.05.15-.17.65-.76.82-.1.17.16 1.09.51 1.27.6s.31.14.42.33c.12.19.12.89-.11 1.52z" />
              </svg>
            }
          />
        </div>

        {/* Documents */}
        <div className="px-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-gray-800 uppercase tracking-widest">
              Documentos Capturados
            </h4>
            <button className="text-blue-600 text-[10px] font-black tracking-widest uppercase">
              Ver todos
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* TARJETA FRONTAL */}
            <div
              onClick={() => {
                if (client.photoBase64) {
                  setFullScreenImage('front');
                  setIsFullScreen(true);
                }
              }}
              className="bg-gray-200 aspect-[1.4/1] rounded-[2rem] overflow-hidden relative shadow-sm group active:scale-95 transition-all"
            >
              {client.photoBase64 ? (
                <>
                  <img src={client.photoBase64} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                  <div className="absolute top-2 right-2 bg-black/40 p-2 rounded-xl text-white backdrop-blur-sm">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                    </svg>
                  </div>
                  <span className="absolute bottom-3 left-4 text-white text-[10px] font-black uppercase tracking-widest">
                    TARJETA (FRONTAL)
                  </span>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold uppercase">
                  Sin Foto
                </div>
              )}
            </div>

            {/* TARJETA REVERSO O QR */}
            {client.photoBackBase64 ? (
              <div
                onClick={() => {
                  if (client.photoBackBase64) {
                    setFullScreenImage('back');
                    setIsFullScreen(true);
                  }
                }}
                className="bg-gray-200 aspect-[1.4/1] rounded-[2rem] overflow-hidden relative shadow-sm group active:scale-95 transition-all"
              >
                <img src={client.photoBackBase64} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute top-2 right-2 bg-black/40 p-2 rounded-xl text-white backdrop-blur-sm">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                </div>
                <span className="absolute bottom-3 left-4 text-white text-[10px] font-black uppercase tracking-widest">
                  TARJETA (REVERSO)
                </span>
              </div>
            ) : (
              <div className="bg-gray-200 aspect-[1.4/1] rounded-[2rem] overflow-hidden relative shadow-sm p-4 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-xl flex items-center justify-center text-gray-800">
                  <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h2v2h-2v-2zm-3 0h2v2h-2v-2zm3 3h2v2h-2v-2zm-3 0h2v2h-2v-2zm3-3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h2v2h-2v-2zm-3 0h2v2h-2v-2z" />
                  </svg>
                </div>
                <div className="absolute top-2 right-2 bg-black/40 p-2 rounded-xl text-white backdrop-blur-sm">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                </div>
                <span className="absolute bottom-3 left-4 text-gray-800 text-[10px] font-black uppercase tracking-widest">
                  Código QR
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Información General + bloques extra */}
        <div className="p-6 mt-4 space-y-4">
          <h4 className="font-extrabold text-sm text-gray-800 uppercase tracking-widest">
            Información General
          </h4>
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 space-y-1">
            <InfoRow
              label="Cargo"
              value={client.cargo || ''}
              icon={
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="opacity-10"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-1.99.9-1.99 2L2 19c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 0h-2V4h2v2z" />
                </svg>
              }
            />

            <InfoRow
              label="Teléfono"
              value={client.telefono || ''}
              icon={
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="opacity-10"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
                </svg>
              }
            />

            <InfoRow
              label="Teléfono 2"
              value={client.telefono2 || ''}
              icon={
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="opacity-10"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
                </svg>
              }
            />

            <InfoRow
              label="Correo Electrónico"
              value={client.correo || ''}
              icon={
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="opacity-10"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                </svg>
              }
            />

            <InfoRow
              label="Web"
              value={client.web || ''}
              icon={
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="opacity-10"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2z" />
                </svg>
              }
            />

            <InfoRow
              label="DNI"
              value={client.dni || ''}
              icon={
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="opacity-10"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.81 4.47c-.08 0-.16.02-.23.06C15.6 5.27 13.49 5.67 11 5.67c-2.49 0-4.6-.4-6.58-1.14-.07-.04-.15-.06-.23-.06-.28 0-.5.22-.5.5 0 .06.02.11.04.16 1.69.77 3.51 1.16 5.51 1.4l.01.03C5.64 7.04 2.87 8.91 1.4 11.53c-.11.2-.18.41-.18.63 0 .7.56 1.27 1.27 1.27.42 0 .81-.2 1.03-.54 1.13-1.74 2.92-3.1 5.09-3.9l.01-.01c.71-.25 1.48-.41 2.37-.48v-.01c.89.07 1.66.23 2.37.48l.01.01c2.17.8 3.96 2.16 5.09 3.9.22.34.61.54 1.03.54.71 0 1.27-.57 1.27-1.27 0-.22-.07-.43-.18-.63-1.47-2.62-4.24-4.49-7.85-4.97l.01-.03c2-.24 3.82-.63 5.51-1.4.03-.05.04-.1.04-.16 0-.28-.21-.5-.49-.5z" />
                </svg>
              }
            />

            <InfoRow
              label="Dirección"
              value={client.direccion || ''}
              icon={
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="opacity-10"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                </svg>
              }
            />

            <InfoRow
              label="Población / Ciudad"
              value={`${client.poblacion || ''}${
                client.poblacion || client.ciudad ? ', ' : ''
              }${client.ciudad || ''}`}
              icon={
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="opacity-10"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              }
            />

            <InfoRow label="Estado" value="Activo" icon={null} />

            <InfoRow
              label="Comentarios"
              value={client.comentarios || ''}
              icon={
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="opacity-10"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h16v12H5.17L4 17.17V4z" />
                </svg>
              }
            />
          </div>

          {/* Datos fiscales y contacto ampliados */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 space-y-1 mt-4">
            <h5 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">
              Datos fiscales y contacto
            </h5>

            <InfoRow
              label="Razón Social"
              value={client.razonSocial || client.empresa || ''}
              icon={null}
            />
            <InfoRow
              label="NIF / CIF"
              value={client.nif || client.dni || ''}
              icon={null}
            />
            <InfoRow
              label="Email facturas"
              value={client.invoiceEmail || ''}
              icon={null}
            />
            <InfoRow
              label="Asociado cooperativa"
              value={client.isCooperativeMember ? 'Sí' : 'No'}
              icon={null}
            />
            {client.isCooperativeMember && (
              <InfoRow
                label="Nº de socio"
                value={client.cooperativeNumber || ''}
                icon={null}
              />
            )}
            <InfoRow
              label="Contacto compras"
              value={client.purchasingContactName || ''}
              icon={null}
            />
            <InfoRow
              label="Email contacto compras"
              value={client.purchasingContactEmail || ''}
              icon={null}
            />
            <InfoRow
              label="Teléfono contacto compras"
              value={client.purchasingContactPhone || ''}
              icon={null}
            />
          </div>

          {/* Interés de compra */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 space-y-3 mt-4">
            <h5 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">
              Interés de compra
            </h5>

            <div className="flex flex-wrap gap-2">
              {client.interestSignage && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Señalización
                </span>
              )}
              {client.interestStreetPlates && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Placas de calle
                </span>
              )}
              {client.interestStreetPlates2 && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Placas calle (2)
                </span>
              )}
              {client.interestSignageBoards && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Carteles señalización
                </span>
              )}
              {client.interestNoParking && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Prohibido aparcar
                </span>
              )}
              {client.interestSpeedBumpsMirrors && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Badenes / Espejos
                </span>
              )}
              {client.interestBollardsBikeRacks && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Bolardos / Aparcabicis
                </span>
              )}
              {client.interestBalizamientoH75 && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Balizamiento H75
                </span>
              )}
              {client.interestConesAccessories && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Conos / accesorios
                </span>
              )}
              {client.interestParkingClamps && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Cepos aparcamiento
                </span>
              )}
              {client.interestPlasticMetalFences && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Vallas plástico / metal
                </span>
              )}
              {client.interestWorksiteBalizamiento && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Balizamiento obra
                </span>
              )}
              {client.interestTripodsPosts && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Trípodes / postes
                </span>
              )}
              {client.interestMobileBases && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Bases móviles
                </span>
              )}
              {client.interestSpraysTapes && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Sprays / cintas
                </span>
              )}
              {client.interestConstructionTools && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Herramienta obra
                </span>
              )}
              {client.interestVehicleSignage && (
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                  Rotulación vehículo
                </span>
              )}

              {!(
                client.interestSignage ||
                client.interestStreetPlates ||
                client.interestStreetPlates2 ||
                client.interestSignageBoards ||
                client.interestNoParking ||
                client.interestSpeedBumpsMirrors ||
                client.interestBollardsBikeRacks ||
                client.interestBalizamientoH75 ||
                client.interestConesAccessories ||
                client.interestParkingClamps ||
                client.interestPlasticMetalFences ||
                client.interestWorksiteBalizamiento ||
                client.interestTripodsPosts ||
                client.interestMobileBases ||
                client.interestSpraysTapes ||
                client.interestConstructionTools ||
                client.interestVehicleSignage
              ) && (
                <span className="text-[11px] text-gray-400 font-medium">
                  Sin intereses marcados.
                </span>
              )}
            </div>
          </div>

          {/* Tipología de cliente */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 space-y-3 mt-4 mb-6">
            <h5 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">
              Tipología de cliente
            </h5>

            <div className="flex flex-wrap gap-2">
              {client.typeSupplyIndustry && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                  Suministro industrial
                </span>
              )}
              {client.typeIndustrialScreenPrinting && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                  Serigrafía industrial
                </span>
              )}
              {client.typeConstructionSupply && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                  Suministro construcción
                </span>
              )}
              {client.typeVehicleWrapping && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                  Rotulación vehículos
                </span>
              )}
              {client.typeAgriculturalSupply && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                  Suministro agrícola
                </span>
              )}
              {client.typeSignage && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                  Señalización
                </span>
              )}
              {client.typeRental && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                  Alquiler
                </span>
              )}
              {client.typeWorkClothing && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                  Ropa laboral
                </span>
              )}
              {client.typeAutoParts && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                  Recambios auto
                </span>
              )}
              {client.typeSafetyEquipment && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                  EPIs / seguridad
                </span>
              )}
              {client.typeHardwareStore && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                  Ferretería
                </span>
              )}
              {client.typeHousehold && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                  Hogar / bazar
                </span>
              )}
              {client.typeOther1 && (
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-widest">
                  {client.typeOther1}
                </span>
              )}
              {client.typeOther2 && (
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-widest">
                  {client.typeOther2}
                </span>
              )}

              {!(
                client.typeSupplyIndustry ||
                client.typeIndustrialScreenPrinting ||
                client.typeConstructionSupply ||
                client.typeVehicleWrapping ||
                client.typeAgriculturalSupply ||
                client.typeSignage ||
                client.typeRental ||
                client.typeWorkClothing ||
                client.typeAutoParts ||
                client.typeSafetyEquipment ||
                client.typeHardwareStore ||
                client.typeHousehold ||
                client.typeOther1 ||
                client.typeOther2
              ) && (
                <span className="text-[11px] text-gray-400 font-medium">
                  Sin tipología asignada.
                </span>
              )}
            </div>
          </div>

          {/* Enlace a Google Maps */}
          {client.mapsUrl && (
            <a
              href={client.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest"
            >
              Ver en Google Maps
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
                <path d="M5 5h5V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5h-2v5H5V5z" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Full Screen Modal */}
      {isFullScreen && (
        <div
          className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6"
          onClick={() => setIsFullScreen(false)}
        >
          <button className="absolute top-10 right-10 p-4 bg-white/10 rounded-full text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <img
            src={
              fullScreenImage === 'front'
                ? client.photoBase64
                : client.photoBackBase64 || client.photoBase64
            }
            className="max-w-full max-h-[70vh] object-contain rounded-3xl shadow-2xl border-4 border-white/20"
            alt="Pantalla completa"
          />
          <div className="mt-8 text-center space-y-2">
            <h4 className="text-white text-2xl font-black">
              {client.nombres} {client.apellidos}
            </h4>
            <p className="text-blue-400 font-bold tracking-widest uppercase text-xs">
              Documento de Identidad Oficial
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetailsView;
