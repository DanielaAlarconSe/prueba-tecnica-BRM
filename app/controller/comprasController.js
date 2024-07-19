"use strict";

const models = require("../models/index");
const Venta = models.venta;
const Persona = models.persona;
const DetalleVino = models.detalle_vino;
const Vino = models.vino;
const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Los meses son 0-indexados
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const seconds = d.getSeconds().toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

class ComprasController {
  // Lista de todas las compras
  async listaCompras(req, res) {
    try {
      const listaCompra = await Venta.findAll({
        include: [
          {
            model: Persona,
            attributes: ["id", "nombre", "apellido", "cedula"],
          },
          {
            model: DetalleVino,
            include: [
              {
                model: Vino,
                attributes: ["nombre"],
              },
            ],
          },
        ],
      });

      if (listaCompra.length > 0) {
        const comprasData = listaCompra.flatMap((compra) =>
          compra.detalle_vinos.map((detalle) => ({
            fecha: formatDate(compra.fecha),
            persona: `${compra.persona.nombre} ${compra.persona.apellido}`,
            producto: detalle.vino.nombre,
            cantidad: detalle.cantidad,
            total: compra.total,
          }))
        );

        console.log(comprasData, "---->>>");

        res.render("administrador", {
          titulo: "Santos Licores | Compras",
          fragmento: "fragments/frm_compras",
          listaCompra: comprasData,
        });
      } else {
        console.log("No se encontraron compras.");
        res.send("No se encontraron compras.");
      }
    } catch (error) {
      console.error("Error al obtener los datos de compras:", error);
      res.status(500).send("Error al obtener los datos de compras");
    }
  }

  // Lista de compras del usuario autenticado
  async listaComprasUsuario(req, res) {
    try {
      // Obtener el ID de la persona autenticada desde req.user
      const id_persona = req.user.id_persona; // Asegúrate de que `req.user.id_persona` esté disponible

      // Buscar la persona por el ID externo
      const persona = await Persona.findOne({
        where: { external_id: id_persona },
      });

      if (persona) {
        // Obtener todas las ventas asociadas a la persona
        const listaCompra = await Venta.findAll({
          where: { id_persona: persona.id }, // Filtrar por ID de persona, usa id_persona en lugar de personaId
          include: [
            {
              model: Persona,
              attributes: ["id", "nombre", "apellido", "cedula"],
            },
            {
              model: DetalleVino,
              include: [
                {
                  model: Vino,
                  attributes: ["nombre"],
                },
              ],
            },
          ],
        });

        if (listaCompra.length > 0) {
          // Formatear los datos para la vista
          const comprasData = listaCompra.flatMap((compra) =>
            compra.detalle_vinos.map((detalle) => ({
              fecha: formatDate(compra.fecha),
              producto: detalle.vino.nombre,
              cantidad: detalle.cantidad,
              total: compra.total,
            }))
          );

          console.log(comprasData, "---->>>");

          // Renderizar la vista con los datos de compras
          res.render("administrador", {
            titulo: "Santos Licores | Compras",
            fragmento: "fragments/frm_historial",
            listaCompra: comprasData,
          });
        } else {
          console.log("No se encontraron compras.");
          res.send("No se encontraron compras.");
        }
      } else {
        console.log("Persona no encontrada.");
        res.status(404).send("Persona no encontrada");
      }
    } catch (error) {
      console.error("Error al obtener los datos de compras:", error);
      res.status(500).send("Error al obtener los datos de compras");
    }
  }
}

module.exports = ComprasController;
