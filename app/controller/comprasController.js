'use strict';
var models = require('../models/index');
var Venta = models.venta;
var Persona = models.persona;
var DetalleVino = models.detalle_vino;

class ComprasController {
    listaCompras(req, res) {
        Venta.findAll({
            include: [
                {
                    model: Persona,
                    as: 'persona', // Alias utilizado en la relación
                    attributes: ['id', 'nombre', 'apellido', 'cedula'] // Atributos del cliente que deseas incluir
                },
                {
                    model: DetalleVino,
                    as: 'detalle_vino', // Alias utilizado en la relación
                    include: [
                        {
                            model: models.vino,
                            as: 'vino',
                            attributes: ['nombre']
                        }
                    ]
                }
            ]
        }).then(listaCompra => {
            if (listaCompra) {
                res.render('administrador', {
                    titulo: 'Santos Licores | Compras',
                    fragmento: 'fragments/frm_marca',
                    listaCompra: listaCompra
                });
                console.log(listaCompra, 'AQUI LLEGA LA LISTA DE COMPRA')
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
