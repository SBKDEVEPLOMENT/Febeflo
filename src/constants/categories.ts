export type SubcategoryGroup = {
  name: string;
  items: string[];
};

export type CategoryConfig = {
  label: string;
  groups: SubcategoryGroup[];
};

export const PRODUCT_CATEGORIES: Record<string, CategoryConfig> = {
  Mujeres: {
    label: 'Mujeres',
    groups: [
      {
        name: 'Parte Superior',
        items: ['Blusa', 'Polera', 'Top', 'Chaleco', 'Chaqueta', 'Poleron']
      },
      {
        name: 'Pantalones',
        items: ['Palazzo', 'Recto', 'Ancho', 'Cargo', 'Pitillo']
      },
      {
        name: 'Short / Falda',
        items: ['Short', 'Minifalda', 'Faldashort']
      }
    ]
  },
  Hombres: {
    label: 'Hombres',
    groups: [
      {
        name: 'Parte Superior',
        items: ['Polera', 'Poleron', 'Chaqueta']
      },
      {
        name: 'Parte Inferior',
        items: ['Pantalon Clasico', 'Recto', 'Pitillo', 'Buzo', 'Cargo']
      }
    ]
  },
  Niños: {
    label: 'Niños',
    groups: []
  },
  Accesorios: {
    label: 'Accesorios',
    groups: []
  }
};

export type CategoryKey = keyof typeof PRODUCT_CATEGORIES;
