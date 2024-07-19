Aplicación de administración de licores realizada en NodeJS y Mysql

# API REST de Inventario
Este proyecto es una API REST desarrollada con Node.js, Sequelize ORM y una base de datos PostgreSQL o MySQL. La API permite gestionar un inventario de productos y realizar operaciones de compra para diferentes tipos de usuarios.

## Requisitos
- Node.js
- PostgreSQL o MySQL
- Sequelize ORM

### Funcionalidades

- **Registro y Login de Usuarios:** Los usuarios pueden registrarse y autenticar sus credenciales. Los roles de usuario disponibles son **Administrador** y **Cliente**.

- **Administradores:**
  - **CRUD de Productos:** Los administradores pueden crear, leer, actualizar y eliminar productos en el inventario. Cada producto incluye detalles como número de lote, nombre, precio, cantidad disponible y fecha de ingreso.
  - **Visualización de Compras:** Los administradores pueden ver un historial de compras realizadas por los clientes, incluyendo la fecha de la compra, el cliente, los productos comprados, la cantidad de cada producto y el precio total de la compra.

- **Clientes:**
  - **Módulo de Compras:** Los clientes pueden realizar compras agregando uno o varios productos y especificando la cantidad de cada uno.
  - **Visualización de Factura:** Los clientes pueden ver una factura con la información completa de la transacción.
  - **Historial de Productos Comprados:** Los clientes pueden acceder a un historial de sus compras anteriores.
