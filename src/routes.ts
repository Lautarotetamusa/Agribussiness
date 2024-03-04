import {Router} from "express"
export const router = Router();

import PersonaRouter from "./routes/persona.routes";
import ProductoRouter from "./routes/producto.routes";
import DeptoRouter from "./routes/departamento.routes";
import CargoRouter from "./routes/cargo.routes";
import ProveedorRouter from "./routes/proveedor.routes";
import LineaNegocioRouter from "./routes/linea_negocio.routes";
import EventoRouter from "./routes/evento.routes";
import ArticuloTecnicoRouter from "./routes/articulo_tecnico.routes";
import SolicitudRouter from "./routes/solicitud.routes";
import CotizacionRouter from "./routes/cotizacion.routes";
import NotificationRouter from "./routes/notification.routes";
import ChatRouter from "./routes/chat.routes";
import ListaPreciosRouter from "./routes/lista_precios.routes";

router.use('/persona/', PersonaRouter);
router.use('/producto/', ProductoRouter);
router.use('/departamento/', DeptoRouter);
router.use('/proveedor/', ProveedorRouter);
router.use('/cargo', CargoRouter);
router.use('/linea', LineaNegocioRouter);
router.use('/evento', EventoRouter);
router.use('/articulo', ArticuloTecnicoRouter);
router.use('/solicitud', SolicitudRouter);
router.use('/cotizacion', CotizacionRouter);
router.use('/notificacion', NotificationRouter);
router.use('/chat', ChatRouter);
router.use('/lista_precios', ListaPreciosRouter);
