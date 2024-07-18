'use strict';
var models = require('../models/index');
var Venta = models.venta;
var Persona = models.persona;
var DetalleVino = models.detalle_vino;
var Vino = models.vino; // Assuming you have a model for vino

class ComprasController {
    listaCompras(req, res) {
        Venta.findAll({
            include: [
                {
                    model: Persona,
                    as: 'persona', // Alias should match the one defined in Persona's associations
                    attributes: ['id', 'nombre', 'apellido', 'cedula']
                },
                {
                    model: DetalleVino,
                    as: 'detalle_vino', // Alias should match the one defined in Venta's associations
                    include: [
                        {
                            model: Vino,
                            as: 'vino', // Ensure this alias is correct
                            attributes: ['nombre']
                        }
                    ]
                }
            ]
        }).then(listaCompra => {
            if (listaCompra) {
                res.render('usuario', {
                    titulo: 'Santos Licores | Compras',
                    fragmento: 'fragments/frm_compras',
                    listaCompra: listaCompra
                });
                console.log(listaCompra, 'AQUI LLEGA LA LISTA DE COMPRA');
            } else {
                console.log(listaCompra.errors);
            }
        }).catch(error => {
            console.error('Error al obtener los datos de compras:', error);
            res.status(500).send('Error al obtener los datos de compras');
        });
    }
}

module.exports = ComprasController;
