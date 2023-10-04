import PDFDocument from "pdfkit-table";
import fs from "fs";
import { CreateProductosCotizacion } from "../schemas/cotizacion.schema";
import { Cotizacion } from "../models/cotizacion.model";
import { files_path } from "../server";
 
export async function generate_cotizacion_pdf(cotizacion: Cotizacion, productos: (CreateProductosCotizacion & {nombre: string})[]) { 
  // start pdf document
  const doc = new PDFDocument(/*{ margin: 30, size: 'A4' }*/);
  // to save on server
  doc.pipe(fs.createWriteStream(`${files_path}/${Cotizacion.file_route}/${cotizacion.file}`));

  console.log("cotizacion: ", cotizacion);

  console.log(productos.map(p => [
    p.nombre, 
    String(p.cantidad),
    String(p.precio_final), 
    String(p.cantidad * p.precio_final),
  ]).concat(["", "", "Total: ", "100000"]));

  let total = productos.reduce((acc, p) => acc + p.cantidad * p.precio_final, 0);
  
  const tableArray = {
    title: "Productos",
    headers: ["Producto", "Cantidad", "Precio U", "Subtotal"],
    rows: productos.map(p => [
      p.nombre, 
      String(p.cantidad),
      String(p.precio_final), 
      String(p.cantidad * p.precio_final),
    ]).concat([
      ["", "", "Total: ", String(total)],
      ["", "", "IVA 12%", String(total * 1.12)]
    ])
  };

  const table = {
    headers: ["a", "b"],
    rows: [
      ["Numero de cotizacion:", String(cotizacion.nro_cotizacion)],
      ["Fecha de creacion:", String(cotizacion.fecha_creacion.toISOString().split('T')[0])],
      ["Cliente:", cotizacion.cliente],
      ["Forma de pago: ", cotizacion.forma_pago],
      ["Tiempo de entrega: ", String(cotizacion.tiempo_entrega) + (cotizacion.tiempo_entrega > 1 ? " días" : " día") + " de haber hecho el pedido"],
    ]
  };

  const options = {
    title: "Cotizacion",
    width: 400,
    hideHeader: true,
    columnColor: "#f1f1f1"
  };

  await doc.table(table, options);
  await doc.table(tableArray, { width: 400 }); // A4 595.28 x 841.89 (portrait) (about width sizes)

  // done
  doc.end();
};