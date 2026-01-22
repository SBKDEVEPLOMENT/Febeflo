import MediaCarousel from "@/components/MediaCarousel";

const MEDIA_ITEMS = [
  { type: "image", src: "/local/WhatsApp Image 2026-01-20 at 17.29.27.jpeg" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.28.04.mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.28.08.mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.26 (1).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.26.mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.27 (1).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.27 (2).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.27.mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.28 (1).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.28 (2).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.28 (3).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.28.mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.29 (1).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.29 (2).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.29 (3).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.29.mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.30 (1).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.30 (2).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.30 (3).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.30 (4).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.30.mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.31 (1).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.31 (2).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.31 (3).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.31.mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.32 (1).mp4" },
  { type: "video", src: "/local/WhatsApp Video 2026-01-20 at 17.29.32.mp4" },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sobre Febeflo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Más que una tienda de ropa, somos tu destino de moda en Pudahuel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="h-96">
             <MediaCarousel items={MEDIA_ITEMS as any} />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Nuestra Historia</h2>
            <p className="text-gray-600 text-lg leading-relaxed text-justify">
              Febeflo nació con la misión de traer moda accesible, moderna y de calidad a la comunidad de Pudahuel. Ubicados en el corazón del Persa Teniente Cruz, nos hemos convertido en un punto de referencia para quienes buscan vestir bien sin gastar de más.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed text-justify">
              Nos especializamos en ropa para toda la familia: desde los más pequeños de la casa hasta las últimas tendencias para hombres y mujeres. Nuestro compromiso es ofrecerte siempre una atención personalizada y cercana.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                <h3 className="font-bold text-lg text-gray-900">Misión</h3>
                <p className="text-gray-600 mt-2 text-justify">Encontrar la moda para cada persona, sin importar su edad, género o estilo, a precios accesibles.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-secondary">
                <h3 className="font-bold text-lg text-gray-900">Visión</h3>
                <p className="text-gray-600 mt-2 text-justify">Ser la tienda de ropa preferida de todo Chile, reconocida por ofrecer productos de alta calidad, diseños actuales y una experiencia de compra confiable y accesible, posicionándonos como una marca referente en estilo, innovación y cercanía con nuestros clientes a nivel nacional.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
