"use client";

import { MapPin, Phone, Instagram, Facebook, Clock, Mail } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = "56935355621";
    const text = `Hola Febeflo, soy ${formData.name}. ${formData.message}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contáctanos</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Visítanos en nuestra tienda o contáctanos por redes sociales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Información de Contacto */}
          <div className="bg-gray-50 p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-8 text-primary">Información de la Tienda</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Ubicación</h3>
                  <a 
                    href="https://maps.app.goo.gl/F8nBGqmQ7K3xFdXH6" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-600 mt-1 hover:text-primary transition-colors block"
                  >
                    Persa Teniente Cruz - Pudahuel<br />
                    2° Bandejón - 3er Pasillo<br />
                    Puestos: 784 - 786 - 797 - 799
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Teléfono / WhatsApp</h3>
                  <p className="text-gray-600 mt-1">+56 9 3535 5621</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Correos de Contacto</h3>
                  <div className="mt-1 space-y-2">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">CEO</p>
                      <a href="mailto:Agcatalans@febeflo.com" className="text-gray-600 hover:text-primary transition-colors block">Agcatalans@febeflo.com</a>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">CEO</p>
                      <a href="mailto:Ccandiae@febeflo.com" className="text-gray-600 hover:text-primary transition-colors block">Ccandiae@febeflo.com</a>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Ejecutivo De Ventas</p>
                      <a href="mailto:Fcandiac@febeflo.com" className="text-gray-600 hover:text-primary transition-colors block">Fcandiac@febeflo.com</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Horario de Atención</h3>
                  <p className="text-gray-600 mt-1">
                    Sábados, Domingos y Festivos<br />
                    09:00 AM - 18:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                  <Instagram className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Instagram</h3>
                  <a href="https://instagram.com/febeflo_" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline mt-1 block">
                    @febeflo_
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                  <Facebook className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Facebook</h3>
                  <div className="mt-1 flex flex-col">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                      Febeflo Kids
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                      Boutique Febeflo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Envíanos un Mensaje</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 px-4 py-3" 
                  placeholder="Tu nombre" 
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 px-4 py-3" 
                  placeholder="tucorreo@ejemplo.com" 
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 px-4 py-3" 
                  placeholder="¿En qué podemos ayudarte?"
                  required
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-secondary transition-colors font-bold text-lg shadow-md hover:shadow-lg">
                Enviar Mensaje por WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
