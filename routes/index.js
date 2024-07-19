var express = require('express');
var autentificacion = require('../app/controller/AutentificacionControllers');
var passport = require('passport');
var router = express.Router();

// controllers utilizados
var marca = require('../app/controller/marca-controller');
var marcaController = new marca();
var vino = require('../app/controller/vino-controller');
var vinoController = new vino();
var pago = require('../app/controller/pago-controller');
var pagoController = new pago();
var carrito = require('../app/controller/carrito-controller');
var carritoController = new carrito();
var venta = require('../app/controller/ventaController');
var ventaController = new venta();
var compras = require('../app/controller/comprasController');
var comprasController = new compras();

// Middleware de Autorización
var auth = function middleware(req, res, next) {
    if (req.isAuthenticated()) {
        //Se debe realizar la validación de los roles en cada url, se puede hacer mediante un arreglo.
        next();
    } else {
        req.flash('info', 'Se necesita primeramente iniciar sesión.', false);
        res.redirect('/ingresar');
    }
};

function authorizeRoles(allowedRoles) {
    return (req, res, next) => {
        if (req.isAuthenticated()) {
            const userRole = req.user.rol;
            if (allowedRoles.includes(userRole)) {
                return next();
            } else {
                 // Asegúrate de que solo se envíe una respuesta
                 if (!res.headersSent) {
                    return res.redirect('/error');
                }
            }
        } else {
            req.flash('info', 'Se necesita primeramente iniciar sesión.');
            return res.redirect('/ingresar');
        }
    };
}

// Página Principal
/* GET Página Principal */
router.get('/', function (req, res, next) {
    res.render('index', {titulo: 'Santos Licores', login: req.isAuthenticated()});
});

// Página de Inicio de Sesión
/* GET Página Inicio de Sesión */
router.get('/ingresar', autentificacion.signin);

/* POST Página Inicio de Sesión */
router.post('/ingresar', passport.authenticate('local-signin', {
    successRedirect: '/administracion',
    failureRedirect: '/ingresar',
    failureFlash: true
}));

// Página de Registro
/* GET Página Registro */
router.get('/registro', autentificacion.signup);

/* POST Página Registro */
router.post('/registro', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/registro',
    failureFlash: true
}));

// Página Administración
/* GET Página Administracion */
router.get('/administracion', vinoController.cargarPrincipal);

/* GET Página Marca */
router.get('/administracion/marca', auth, authorizeRoles(['Administrador']), marcaController.cargarVista);

/* POST Guardar Marca */
router.post('/administracion/marca', auth, authorizeRoles(['Administrador']), marcaController.guardar);

/* POST Modificar Marca */
router.post('/administracion/marcaModificar', marcaController.modificar);

/* POST Eliminar Marca */
router.post('/administracion/marcaEliminar', marcaController.eliminar);

/* GET Página Foto */
router.get('/administracion/vino/foto/:external', vinoController.verFoto);

/* POST Guardar Foto */
router.post('/administracion/vino/foto/guardar', vinoController.guardarImagen);

/* GET Página Vino */
router.get('/administracion/vino', auth, authorizeRoles(['Administrador']), vinoController.cargarVista);
router.get('/administracion/ver_vino', vinoController.cargarVino);

/* POST Guardar Vino */
router.post('/administracion/vino', auth, authorizeRoles(['Administrador']), vinoController.guardar);

/* POST Modificar Vino */
router.post('/administracion/vinoModificar', auth, authorizeRoles(['Administrador']), vinoController.modificar);

/* POST Eliminar Vino */
router.post('/administracion/vinoEliminar', auth, authorizeRoles(['Administrador']), vinoController.eliminar);

/* GET Agregar item al Carrito */
router.get('/agregar:external_id', auth, authorizeRoles(['Usuario']), carritoController.cargarItem);

/* GET Quitar Item del Carrito */
router.get('/quitar:external_id', auth, authorizeRoles(['Usuario']), carritoController.quitarItem);

/* GET Mostrar Carrito*/
router.get('/listarCarrito', carritoController.mostrarCarro);

/* GET Cerrar Sesión*/
router.get('/salir', autentificacion.logout);

/* GET Comprar*/
router.get('/comprar', auth, authorizeRoles(['Usuario']), pagoController.cargarVista);

/* POST Comprar*/
router.post('/comprar', auth, authorizeRoles(['Usuario']), ventaController.guardar);

/* POST Checkout*/
router.post('/pagar', auth, authorizeRoles(['Usuario']), pagoController.cargarCheckOut);

/* GET Payment Status*/
router.get('/resultado', auth, authorizeRoles(['Usuario']), pagoController.obtenerResultado);

/* GET Lista Compras*/
router.get('/listarCompras', auth, authorizeRoles(['Administrador']), comprasController.listaCompras);

/* GET Historial Compras Usuario*/
router.get('/listarComprasUsuario', auth, authorizeRoles(['Usuario']), comprasController.listaComprasUsuario);

router.get('/error');

module.exports = router;