export const filePaths = {
    cotizaciones: 'cotizaciones',
    eventos: 'eventos',
    fichasTecnicas: 'fichas_tecnicas',
    imagenes: 'imagenes',
    lineasNegocio: 'lineas_negocio',
    articulosTecnicos: 'articulos_tecnicos',
    priceLists: 'price_lists',
    proveedores: 'proveedores'
} as const;
export type FilePath = typeof filePaths[keyof typeof filePaths];
