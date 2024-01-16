import PDFDocument from "pdfkit-table";
import fs from "fs";
import { CreateProductosCotizacion } from "../schemas/cotizacion.schema";
import { Cotizacion } from "../models/cotizacion.model";
import { files_path } from "../server";
 
type Prods = CreateProductosCotizacion & {nombre: string, precio_final: number, iva: number};

export async function generate_cotizacion_pdf(cotizacion: Cotizacion, productos: Prods[]) { 
  // start pdf document

  const font = "Times-Roman" as const;
  const bold_font = "Times-Bold" as const;
  const font_size = 11 as const;

  const doc = new PDFDocument({
    margins: {
      top: 30,
      bottom: 30,
      left: 90,
      right: 90
    }
  });
  // to save on server
  const folder_path = `${files_path}/${Cotizacion.file_route}/`;
  //Creamos la carpeta si no existe
  fs.mkdirSync(folder_path, { recursive: true });
  doc.pipe(fs.createWriteStream(folder_path+cotizacion.file));

  //console.log("cotizacion: ", cotizacion);

  let subtotal = productos.reduce((acc, p) => acc + p.cantidad * p.precio_final, 0);

  const total_iva = productos.reduce((acc, p) => 
    acc + p.cantidad * p.precio_final * (p.iva/100), 0
  );

  const tableArray = {
    headers: [
      {label: "PRODUCTO", property: "producto"}, 
      {label: "CANTIDAD", property: "cantidad", align: "center", valign: "center"}, 
      {label: "PRECIO U", property: "precio_final", align: "center"}, 
      {label: "TOTAL", property: "total", align: "center"}
    ],
    datas: productos.map(p => {return {
      producto: p.nombre, 
      cantidad: String(p.cantidad),
      precio_final: {label: "$ " + String(p.precio_final.toFixed(2)), align: "center", font: font}, 
      total: "$ " + String((p.cantidad * p.precio_final).toFixed(2)),
    }}).concat([
      {
        producto: "",
        cantidad: "",
        precio_final: {label: "bold:SUBTOTAL: ", align: "left", font: font},
        total: "$ " + String(subtotal.toFixed(2))
      },
      {
        producto: "",
        cantidad: "",
        precio_final: {label: "bold:IVA 12%", align: "left", font: font},
        total: "$ " + String(total_iva.toFixed(2))
      },
      {
        producto: "",
        cantidad: "",
        precio_final: {label: "bold:TOTAL", align: "left", font: font},
        total: "$ " + String((subtotal + total_iva).toFixed(2))
      }
    ])
  };

  doc.font(font, font_size);

  doc.image(files_path + '/logo.png', {
    //scale: 0.6,
    width: 140,
    height: 30,
    align: 'right',
    valign: 'center'
  }).moveDown().moveDown();

  // YYYY-MM-ID
  const id_cotizacion = 
    String(cotizacion.fecha_creacion.getFullYear()) + "-" + 
    String(cotizacion.fecha_creacion.getMonth()).padStart(2, "0") + "-" + 
    String(cotizacion.nro_cotizacion).padStart(2, "0");

  doc
    .font(bold_font)
    .text(`COTIZACIÓN N° ${id_cotizacion}`, {align: 'right', characterSpacing: 0.3});

  doc
    .font(bold_font)
    .text("Fecha:   ", {continued: true, characterSpacing: 0.3})
    .font(font)
    .text(String(cotizacion.fecha_creacion.toISOString().split('T')[0]));
  doc
    .font(bold_font)
    .text("Cliente:   ", {continued: true, characterSpacing: 0.3})
    .font(font)
    .text(cotizacion.cliente?.nombre || "");

  doc
    .font(bold_font)
    .text("Atencion:   ", {continued: true, characterSpacing: 0.3})
    .font(font)
    .text("Lautaro Teta ")
    .moveDown()
    .moveDown();

  doc.text("De acuerdo con lo solicitado adjuntamos la siguiente cotización: ", {characterSpacing: 0.3});
  doc.moveDown();

  doc.font(font).table(tableArray, {
    padding: [7, 5, 7, 5], // top right bottom left
    //columnsSize: [140, 82, 140, 70], //total = 612 - 90 * 2 = 432
    prepareHeader: () => doc.font(bold_font, font_size),
    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
      const {x, y, width, height} = rectCell || {x: 0, y: 0, width: 0, height: 0};

      // first line 
      if(indexColumn === 0){
        doc
          .lineWidth(.5)
          .moveTo(x, y)
          .lineTo(x, y + height)
          .stroke();  
      }

      doc
        .lineWidth(.5)
        .moveTo(x + width, y)
        .lineTo(x + width, y + height)
        .stroke();

      return doc.font(font, font_size)
    }
  }); 
  doc.moveDown();

  doc.font(bold_font).text("Disposiciones adicionales:");
  doc.font(font).text(cotizacion.disposiciones).moveDown();
  
  doc.font(bold_font).text("Forma de pago:", {characterSpacing: 0.3}).moveDown();
  doc.font(font).text(cotizacion.forma_pago, {characterSpacing: 0.3}).moveDown();
  doc.font(bold_font).text("Tiempo de entrega:", {characterSpacing: 0.3}).moveDown();
  doc.font(font).text(String(cotizacion.tiempo_entrega) + (cotizacion.tiempo_entrega > 1 ? " días" : " día") + " de haber hecho el pedido", {characterSpacing: 0.3}).moveDown();
  doc.moveDown().moveDown();

  doc
    .text("Atentamente", {characterSpacing: 0.3})
    .text(cotizacion.colaborador?.nombre || "", {characterSpacing: 0.3})
    .text("Agribusiness Ecuador Cía. Ltda.", {characterSpacing: 0.3})

  doc
    .fillColor('#5991d5')
    .text("Galo Plaza Lasso N67-103 y de los Ciruelos", 20, doc.page.height - 73, {
      //lineBreak: false,
      align: "center",
      characterSpacing: 0.3
    })
    .text("Tel: (+593) 2 346 4830 / (+593) 98 357 1889", {align: "center", characterSpacing: 0.3})
    .text("Email: carolina.cuenca@agrytec.com - Web: www.agriecuador.com", {align: "center", characterSpacing: 0.3})

  // done
  doc.end();
};
