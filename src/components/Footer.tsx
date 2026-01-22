import { Facebook, Instagram, Phone, MapPin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-6">
               <div className="relative h-32 w-32 bg-white rounded-full p-2 shadow-lg flex-shrink-0 border-4 border-[#D4AF37]">
                 <Image
                   src="/logo/logo.png"
                   alt="Febeflo Logo"
                   fill
                   className="object-contain"
                 />
               </div>
               <h3 className="text-3xl font-bold ml-6">Febeflo</h3>
            </div>
            <p className="mb-4">Tu tienda de ropa favorita para mujer y hombre. Estilo y calidad en un solo lugar.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                <span>Persa Teniente Cruz - Pudahuel<br />2° Bandejón - 3er Pasillo<br />Puestos: 784 - 786 - 797 - 799</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>+56 9 3535 5621</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="https://instagram.com/febeflo_" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook Febeflo Kids</span>
              </a>
            </div>
            <div className="mt-4 text-sm">
              <p>Facebook: Febeflo Kids</p>
              <p>Facebook: Boutique Febeflo</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-teal-400 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Febeflo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
