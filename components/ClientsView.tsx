import React, { useState } from 'react';
import { Client } from '../types';

interface ClientsViewProps {
  clients: Client[];
  onDelete: (id: string) => void;
  onEdit: (client: Client) => void;
  onViewDetails: (client: Client) => void;
  onAddNew: () => void;
}

const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  onDelete,
  onEdit,
  onViewDetails,
  onAddNew,
}) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredClients = clients.filter(c =>
    `${c.nombres} ${c.apellidos} ${c.empresa} ${c.dni}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-fade-in relative">
      <div className="p-6 space-y-6 shrink-0 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-gray-900">Lista de Clientes</h2>
          <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
            </svg>
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar cliente..."
            className="w-full pl-12 pr-4 py-4 bg-gray-100 border-none rounded-[1.5rem] text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['Todos', 'Recientes', 'Empresas'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-gray-500 border border-gray-100'
              }`}
            >
              {filter}
              {filter === 'Todos' ? ` (${clients.length})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Contenedor scrollable */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 space-y-4 pb-24">
        {filteredClients.length > 0 ? (
          filteredClients.map(client => (
            <div
              key={client.id}
              onClick={() => onViewDetails(client)}
              className="bg-white border border-gray-50 p-5 rounded-[2rem] shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                {client.profilePhotoBase64 ? (
                  <img
                    src={client.profilePhotoBase64}
                    alt={`${client.nombres} ${client.apellidos}`}
                    className="w-14 h-14 rounded-[1.25rem] object-cover"
                  />
                ) : (
                  <div
                    className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center font-black text-lg ${
                      client.id.charCodeAt(0) % 2 === 0
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {client.nombres.charAt(0)}
                    {client.apellidos.charAt(0)}
                  </div>
                )}

                <div>
                  <h4 className="font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {client.nombres} {client.apellidos}
                  </h4>
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <svg
                        width="10"
                        height="10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                      </svg>
                      {client.empresa || 'Empresa N/A'}
                    </p>
                    <p className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                      <svg
                        width="10"
                        height="10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.43-3.9-6.63-6.48l2.43-1.62c.41-.27.53-.82.33-1.29a14.54 14.54 0 0 1-.72-4.14c0-.55-.45-1-1-1H4.01c-.55 0-1 .45-1 1 0 9.39 7.62 17 17 17 .55 0 1-.45 1-1v-3.51c0-.55-.45-1-1-1z" />
                      </svg>
                      {client.telefono || 'Sin teléfono'}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400">
                      {(client.poblacion || client.ciudad || 'Sin localidad')}{' '}
                      {client.province ? `· ${client.province}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onEdit(client);
                  }}
                  className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onDelete(client.id);
                  }}
                  className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              fill="currentColor"
              className="opacity-10 mb-4"
              viewBox="0 0 24 24"
            >
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <p className="font-bold text-sm tracking-widest uppercase">
              No hay clientes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsView;
