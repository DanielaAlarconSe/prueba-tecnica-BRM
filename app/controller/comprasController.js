'use strict';
const models = require('../models/index');
const Venta = models.venta;
const Persona = models.persona;
const DetalleVino = models.detalle_vino;
const Vino = models.vino; 

class ComprasController {

    async listaCompras(req, res) {
        try {
            const listaCompra = await Venta.findAll({
                
                include: [
                    {
                        model: Persona,
                        attributes: ['id', 'nombre', 'apellido', 'cedula']
                    },
                    {
                        model: DetalleVino,
                        include: [
                            {
                                model: Vino,
                                attributes: ['nombre']
                            }
                        ]
                    }
                ]
            });

            if (listaCompra) {
                
                const comprasData = listaCompra.flatMap(compra => 
                    compra.detalle_vinos.map(detalle => ({
                        fecha: compra.fecha,
                        persona: compra.persona.nombre + ' ' + compra.persona.apellido,
                        producto: detalle.vino.nombre,
                        cantidad: detalle.cantidad,
                        total: compra.total
                    }))
                );
                console.log(comprasData, "---->>>");

                res.render('administrador', {
                    titulo: 'Santos Licores | Compras',
                    fragmento: 'fragments/frm_compras',
                    listaCompra: comprasData
                });

                console.log(comprasData, 'AQUI LLEGA LA LISTA DE COMPRA');
            } else {
                console.log('No se encontraron compras.');
            }
        } catch (error) {
            console.error('Error al obtener los datos de compras:', error);
            res.status(500).send('Error al obtener los datos de compras');
        }
    }
}

module.exports = ComprasController;
