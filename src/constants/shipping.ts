
import { MapPin, Truck, Store, Clock } from 'lucide-react';

export const STARKEN_BRANCHES = [
  // Arica y Parinacota
  { region: "Arica y Parinacota", commune: "Arica", name: "Arica - Centro", address: "21 de Mayo 439", type: "Agencia" },
  { region: "Arica y Parinacota", commune: "Arica", name: "Arica - Santa María", address: "Santa María 2066", type: "Agencia" },

  // Tarapacá
  { region: "Tarapacá", commune: "Iquique", name: "Iquique - Centro", address: "Patricio Lynch 548", type: "Agencia" },
  { region: "Tarapacá", commune: "Iquique", name: "Iquique - Zofri", address: "Av. Salitrera Victoria, Galpón 4", type: "Agencia" },
  { region: "Tarapacá", commune: "Alto Hospicio", name: "Alto Hospicio", address: "Av. Los Alamos 3163", type: "Agencia" },

  // Antofagasta
  { region: "Antofagasta", commune: "Antofagasta", name: "Antofagasta - Centro", address: "Washington 2562", type: "Agencia" },
  { region: "Antofagasta", commune: "Antofagasta", name: "Antofagasta - Norte", address: "Pedro Aguirre Cerda 5678", type: "Agencia" },
  { region: "Antofagasta", commune: "Calama", name: "Calama - Centro", address: "Latorre 1928", type: "Agencia" },
  { region: "Antofagasta", commune: "Tocopilla", name: "Tocopilla", address: "21 de Mayo 1234", type: "Agencia" },

  // Atacama
  { region: "Atacama", commune: "Copiapó", name: "Copiapó - Centro", address: "Colipí 484", type: "Agencia" },
  { region: "Atacama", commune: "Vallenar", name: "Vallenar", address: "Serrano 850", type: "Agencia" },
  { region: "Atacama", commune: "Caldera", name: "Caldera", address: "Gana 234", type: "Agencia" },

  // Coquimbo
  { region: "Coquimbo", commune: "La Serena", name: "La Serena - Centro", address: "Balmaceda 480", type: "Agencia" },
  { region: "Coquimbo", commune: "La Serena", name: "La Serena - Balmaceda", address: "Av. Balmaceda 2885", type: "Agencia" },
  { region: "Coquimbo", commune: "Coquimbo", name: "Coquimbo - Centro", address: "Aldunate 1621", type: "Agencia" },
  { region: "Coquimbo", commune: "Ovalle", name: "Ovalle", address: "Vicuña Mackenna 151", type: "Agencia" },
  { region: "Coquimbo", commune: "Illapel", name: "Illapel", address: "Constitución 250", type: "Agencia" },

  // Valparaíso
  { region: "Valparaíso", commune: "Valparaíso", name: "Valparaíso - Centro", address: "Brasil 1538", type: "Agencia" },
  { region: "Valparaíso", commune: "Viña del Mar", name: "Viña del Mar - Centro", address: "Arlegui 234", type: "Agencia" },
  { region: "Valparaíso", commune: "Viña del Mar", name: "Viña del Mar - 15 Norte", address: "15 Norte 980", type: "Agencia" },
  { region: "Valparaíso", commune: "Quilpué", name: "Quilpué - Centro", address: "Andrés Bello 568", type: "Agencia" },
  { region: "Valparaíso", commune: "Villa Alemana", name: "Villa Alemana", address: "Valparaíso 450", type: "Agencia" },
  { region: "Valparaíso", commune: "San Antonio", name: "San Antonio", address: "Barros Luco 1670", type: "Agencia" },
  { region: "Valparaíso", commune: "Los Andes", name: "Los Andes", address: "Santa Rosa 451", type: "Agencia" },
  { region: "Valparaíso", commune: "San Felipe", name: "San Felipe", address: "Merced 150", type: "Agencia" },
  { region: "Valparaíso", commune: "Quillota", name: "Quillota", address: "O'Higgins 120", type: "Agencia" },
  { region: "Valparaíso", commune: "La Calera", name: "La Calera", address: "J.J. Pérez 230", type: "Agencia" },

  // Metropolitana
  { region: "Metropolitana", commune: "Santiago", name: "Santiago Centro - Moneda", address: "Moneda 970, Local 1", type: "Agencia" },
  { region: "Metropolitana", commune: "Santiago", name: "Santiago Centro - San Diego", address: "San Diego 201", type: "Agencia" },
  { region: "Metropolitana", commune: "Providencia", name: "Providencia - Manuel Montt", address: "Av. Manuel Montt 427", type: "Agencia" },
  { region: "Metropolitana", commune: "Providencia", name: "Providencia - Los Leones", address: "Av. Nueva Providencia 2250", type: "Agencia" },
  { region: "Metropolitana", commune: "Las Condes", name: "Las Condes - Apoquindo", address: "Av. Apoquindo 6415", type: "Agencia" },
  { region: "Metropolitana", commune: "Las Condes", name: "Las Condes - Manquehue", address: "Av. Manquehue Sur 329", type: "Agencia" },
  { region: "Metropolitana", commune: "Vitacura", name: "Vitacura", address: "Av. Vitacura 5480", type: "Agencia" },
  { region: "Metropolitana", commune: "Lo Barnechea", name: "Lo Barnechea", address: "Av. La Dehesa 1201", type: "Agencia" },
  { region: "Metropolitana", commune: "Ñuñoa", name: "Ñuñoa - Irarrázaval", address: "Av. Irarrázaval 2800", type: "Agencia" },
  { region: "Metropolitana", commune: "La Reina", name: "La Reina", address: "Av. Ossa 235", type: "Agencia" },
  { region: "Metropolitana", commune: "Peñalolén", name: "Peñalolén", address: "Av. Grecia 8500", type: "Agencia" },
  { region: "Metropolitana", commune: "Macul", name: "Macul", address: "Av. Macul 2300", type: "Agencia" },
  { region: "Metropolitana", commune: "La Florida", name: "La Florida - Vicuña Mackenna", address: "Av. Vicuña Mackenna Ote 7340", type: "Agencia" },
  { region: "Metropolitana", commune: "Puente Alto", name: "Puente Alto - Concha y Toro", address: "Av. Concha y Toro 107", type: "Agencia" },
  { region: "Metropolitana", commune: "San Bernardo", name: "San Bernardo", address: "Freire 540", type: "Agencia" },
  { region: "Metropolitana", commune: "Maipú", name: "Maipú - Pajaritos", address: "Av. Pajaritos 2624", type: "Agencia" },
  { region: "Metropolitana", commune: "Estación Central", name: "Estación Central", address: "San Borja 120", type: "Agencia" },
  { region: "Metropolitana", commune: "Quilicura", name: "Quilicura", address: "Av. O'Higgins 450", type: "Agencia" },
  { region: "Metropolitana", commune: "Independencia", name: "Independencia", address: "Av. Independencia 1240", type: "Agencia" },
  { region: "Metropolitana", commune: "Recoleta", name: "Recoleta", address: "Av. Recoleta 890", type: "Agencia" },
  { region: "Metropolitana", commune: "Colina", name: "Colina", address: "La Inmaculada 45", type: "Agencia" },

  // O'Higgins
  { region: "O'Higgins", commune: "Rancagua", name: "Rancagua - Centro", address: "O'Carrol 450", type: "Agencia" },
  { region: "O'Higgins", commune: "Rancagua", name: "Rancagua - Brasil", address: "Av. Brasil 890", type: "Agencia" },
  { region: "O'Higgins", commune: "San Fernando", name: "San Fernando", address: "Chillán 560", type: "Agencia" },
  { region: "O'Higgins", commune: "Rengo", name: "Rengo", address: "Arturo Prat 230", type: "Agencia" },
  { region: "O'Higgins", commune: "Santa Cruz", name: "Santa Cruz", address: "Claudio Cancino 80", type: "Agencia" },

  // Maule
  { region: "Maule", commune: "Talca", name: "Talca - Centro", address: "1 Sur 1560", type: "Agencia" },
  { region: "Maule", commune: "Curicó", name: "Curicó - Centro", address: "Peña 650", type: "Agencia" },
  { region: "Maule", commune: "Linares", name: "Linares", address: "Independencia 450", type: "Agencia" },
  { region: "Maule", commune: "Constitución", name: "Constitución", address: "Freire 340", type: "Agencia" },
  { region: "Maule", commune: "Cauquenes", name: "Cauquenes", address: "Victoria 450", type: "Agencia" },

  // Ñuble
  { region: "Ñuble", commune: "Chillán", name: "Chillán - Centro", address: "18 de Septiembre 560", type: "Agencia" },
  { region: "Ñuble", commune: "San Carlos", name: "San Carlos", address: "Serrano 340", type: "Agencia" },

  // Biobío
  { region: "Biobío", commune: "Concepción", name: "Concepción - Centro", address: "Tucapel 452", type: "Agencia" },
  { region: "Biobío", commune: "Concepción", name: "Concepción - Collao", address: "Av. Collao 1200", type: "Agencia" },
  { region: "Biobío", commune: "Talcahuano", name: "Talcahuano - Centro", address: "Colón 568", type: "Agencia" },
  { region: "Biobío", commune: "Los Ángeles", name: "Los Ángeles - Centro", address: "Valdivia 440", type: "Agencia" },
  { region: "Biobío", commune: "San Pedro de la Paz", name: "San Pedro de la Paz", address: "Michimalonco 980", type: "Agencia" },
  { region: "Biobío", commune: "Coronel", name: "Coronel", address: "Manuel Montt 450", type: "Agencia" },

  // Araucanía
  { region: "Araucanía", commune: "Temuco", name: "Temuco - Centro", address: "Manuel Montt 850", type: "Agencia" },
  { region: "Araucanía", commune: "Temuco", name: "Temuco - Alemania", address: "Av. Alemania 0450", type: "Agencia" },
  { region: "Araucanía", commune: "Villarrica", name: "Villarrica", address: "Pedro de Valdivia 780", type: "Agencia" },
  { region: "Araucanía", commune: "Pucón", name: "Pucón", address: "O'Higgins 340", type: "Agencia" },
  { region: "Araucanía", commune: "Angol", name: "Angol", address: "Lautaro 230", type: "Agencia" },

  // Los Ríos
  { region: "Los Ríos", commune: "Valdivia", name: "Valdivia - Centro", address: "Picarte 450", type: "Agencia" },
  { region: "Los Ríos", commune: "La Unión", name: "La Unión", address: "Esmeralda 340", type: "Agencia" },

  // Los Lagos
  { region: "Los Lagos", commune: "Puerto Montt", name: "Puerto Montt - Centro", address: "Benavente 450", type: "Agencia" },
  { region: "Los Lagos", commune: "Puerto Varas", name: "Puerto Varas", address: "San Francisco 340", type: "Agencia" },
  { region: "Los Lagos", commune: "Osorno", name: "Osorno - Centro", address: "Eleuterio Ramírez 959", type: "Agencia" },
  { region: "Los Lagos", commune: "Castro", name: "Castro", address: "San Martín 450", type: "Agencia" },
  { region: "Los Lagos", commune: "Ancud", name: "Ancud", address: "Pudeto 230", type: "Agencia" },

  // Aysén
  { region: "Aysén", commune: "Coyhaique", name: "Coyhaique - Centro", address: "Prat 340", type: "Agencia" },
  { region: "Aysén", commune: "Puerto Aysén", name: "Puerto Aysén", address: "Sargento Aldea 450", type: "Agencia" },

  // Magallanes
  { region: "Magallanes", commune: "Punta Arenas", name: "Punta Arenas - Centro", address: "Bories 450", type: "Agencia" },
  { region: "Magallanes", commune: "Puerto Natales", name: "Puerto Natales", address: "Manuel Bulnes 450", type: "Agencia" }
];

export const SHOP_LOCATION = {
  address: "Persa Teniente Cruz - Pudahuel 2° Bandejón - 3er Pasillo, Puestos: 784 - 786 - 797 - 799, Santiago",
  schedule: "Lunes a Viernes: Cerrado | Sábados: 10:00 - 19:00 hrs | Domingos: 11:00 - 20:00 hrs",
  googleMapsUrl: "https://maps.app.goo.gl/F8nBGqmQ7K3xFdXH6"
};
