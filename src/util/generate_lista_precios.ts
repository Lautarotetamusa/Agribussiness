import PDFDocument from "pdfkit-table";
import fs from "fs";
import { files_path, files_url } from "../server";
import { ListProducto } from "../schemas/producto.schema";

export function generateListaPreciosPDF(productos: ListProducto[]) { 
    const font = "Times-Roman" as const;
    const bold_font = "Times-Bold" as const;
    const font_size = 11 as const;

    const doc = new PDFDocument({
        margins: {
            top: 30,
            bottom: 30,
            left: 50,
            right: 50
        }
    });
    // to save on server
    const fileName = "lista_precios.pdf";
    const filePath = `${files_path}/${fileName}`;
    doc.pipe(fs.createWriteStream(filePath));

    const tableArray = {
        headers: [
            {label: "PRODUCTO", property: "producto"}, 
            {label: "PROVEEDOR", property: "proveedor"}, 
            {label: "PRESENTACION", property: "presentacion"}, 
            {label: "PRECIO U", property: "precio", align: "center"}, 
            {label: "IVA", property: "iva", align: "center"}
        ],
        datas: productos.map(p => {return {
            producto: p.nombre,
            proveedor: p.nombre_proveedor,
            presentacion: p.presentacion,
            precio: {label: "$ " + String(p.precio), align: "right", font: font}, 
            iva: {label: "% " + String(p.iva.toFixed(2)), align: "right", font: font}, 
        }})
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
    const date = new Date().toISOString().split('T')[0] ?? '';

    doc
    .font(bold_font)
    .text(`FECHA: ${date}`, {align: 'right', characterSpacing: 0.3});

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

    return `${files_url}/${fileName}`;
};
