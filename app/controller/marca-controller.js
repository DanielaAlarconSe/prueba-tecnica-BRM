'use strict';
var models = require('../models/index');
var Marca = models.marca;
var uuidv4 = require('uuid/v4');

class MarcaController {
    cargarVista(req, res) {
        Marca.findAll().then(listaMarca => {
            if (listaMarca) {
                res.render('administrador', {titulo: 'Santos Licores | Marcas', fragmento: 'fragments/frm_marca',
                    listaMarca: listaMarca});
            } else {
                console.log(listaMarca.errors);
            }
        });
    }

    guardar(req, res) {
        Marca.findOne({where: {nombre: req.body.nombreMarca}}).then(marca => {
            if (marca) {
                req.flash('info', 'La marca ya está ingresada.', false);
                res.redirect('/administracion/marca');
            } else {
                var modeloMarca = {
                    nombre: req.body.nombreMarca,
                    external_id: uuidv4()
                };
                Marca.create(modeloMarca).then(newMarca => {
                    if (!newMarca) {
                        req.flash('info', 'Ocurrió un error al registrar la marca.', false);
                    } else if (newMarca) {
                        req.flash('info', 'Se registró la marca con éxito.', false);
                    }
                    res.redirect('/administracion/marca');
                });
            }
        });
    }

    modificar(req, res) {
        var modeloMarca = {
            nombre: req.body.nombreMarca,
            estado: req.body.estado
        };
        Marca.update(modeloMarca, {where: {external_id: req.body.external}}).then(newMarca => {
            if (newMarca == 0) {
                req.flash('info', 'No se ha realizado ninguna Modificación.', false);
            } else {
                req.flash('info', 'Se modificó la marca con éxito.', false);
            }
            res.redirect('/administracion/marca');
        });
    }

    //Eliminar Marca --- Se crea método para completar CRUD pero es mala practica eliminar sin tener tabla auditoría y disparadores

    eliminar(req, res) {
        Marca.destroy({where: {external_id: req.body.external}}).then(deleted => {
            if (deleted == 0) {
                req.flash('info', 'No se encontró la marca a eliminar.', false);
            } else {
                req.flash('info', 'Se eliminó la marca con éxito.', false);
            }
            res.redirect('/administracion/marca');
        }).catch(error => {
            console.log(error);
            req.flash('info', 'Ocurrió un error al intentar eliminar la marca.', false);
            res.redirect('/administracion/marca');
        });
    }
    
}

module.exports = MarcaController;