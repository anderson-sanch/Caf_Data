# CafData

CafData usa un backend NestJS con Prisma/PostgreSQL y un frontend React con Vite.

## Requisitos

- Node.js 22 LTS, versión 22.12 o posterior. También es compatible Node 20.19 o posterior.
- npm incluido con Node.js.
- PostgreSQL con un usuario que pueda crear tablas y habilitar la extensión `uuid-ossp` en la base de desarrollo.

Los comandos siguientes se ejecutan desde PowerShell. Use una base local o de desarrollo; no aplique estas migraciones ni el seed sobre una base productiva.

## 1. Preparar PostgreSQL

Cree una base vacía llamada `cafdata` y un usuario local con acceso a ella. La migración inicial habilita `uuid-ossp`, porque el esquema existente usa `uuid_generate_v4()`.

## 2. Preparar el backend

```powershell
cd backend
Copy-Item .env.example .env
npm ci
```

Edite `backend/.env` y reemplace los valores de ejemplo. `ADMIN_EMAIL` y `ADMIN_PASSWORD` son obligatorios para ejecutar el seed; no use credenciales personales ni confirme el archivo `.env` en Git.

Después ejecute:

```powershell
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

El backend escucha en `http://localhost:3000` cuando `PORT=3000`. La API todavía no expone un endpoint de salud; para comprobar el arranque revise que Nest indique que la aplicación inició sin errores.

El seed puede ejecutarse nuevamente: actualiza los roles `Administrador` y `Operador` por nombre, y actualiza o crea el administrador por `ADMIN_EMAIL`. La contraseña se almacena con bcrypt.

## 3. Preparar el frontend

En otra terminal:

```powershell
cd frontend
Copy-Item .env.example .env
npm ci
npm run dev
```

Con la configuración de ejemplo, Vite queda disponible normalmente en `http://localhost:5173`. Abra `http://localhost:5173/`; la ruta inicial redirige a `/login`.

`VITE_API_BASE_URL` debe coincidir con la URL del backend. `FRONTEND_ORIGIN` en el backend debe coincidir con el origen de Vite, sin una ruta final.

## Comprobación opcional de compilación

```powershell
cd backend
npm run build

cd ..\frontend
npm run build
```

El Dockerfile del backend se conserva vacío porque Docker no forma parte de esta etapa.

## Reglas del catálogo MVP

- La identidad documental de un cliente es la pareja `document_type` + `document`. El mismo número puede existir con tipos distintos, pero la misma pareja no puede repetirse. Tipo y número se envían juntos.
- El precio vigente de un producto es el registro de `product_prices` cuyo `valid_to` es `NULL`. La API lo expone como `currentPrice`; cuando cambia, el backend cierra el precio anterior y crea el nuevo dentro de una transacción.
- Clientes y productos usan borrado lógico mediante `deleted_at` y dejan de aparecer en listados y consultas operativas.

## Inventario MVP

`inventory_movements` registra `id`, `product_id`, `type`, `quantity`, `reason`, `created_by` y `created_at`. Cada movimiento está relacionado con un producto y, cuando corresponde, con el usuario responsable. La cantidad es un entero y el timestamp se genera al crear la fila.

El enum conserva `IN`, `OUT` y `ADJUSTMENT`. Durante el MVP el stock se calcula exclusivamente como `SUM(IN) - SUM(OUT)`. `ADJUSTMENT` permanece en el esquema para una definición posterior, pero no se cuenta ni se expone en la interfaz.

Los endpoints autenticados son `GET /inventory`, `POST /inventory/entries` y `GET /inventory/movements`. Las entradas reciben producto, cantidad y motivo; el responsable se toma del JWT y no del cuerpo enviado por el cliente.

## Ventas MVP

`POST /sales` recibe únicamente `clientId`, `paymentMethod` e `items` con `productId` y `quantity`. El backend obtiene el usuario del JWT, agrupa productos repetidos, consulta el precio vigente y el stock real, calcula subtotales y total, y crea la venta con estado `paid`. La venta, sus detalles y los movimientos `OUT` se guardan dentro de una sola transacción.

Para impedir sobreventa, la transacción adquiere bloqueos advisory de PostgreSQL por producto, siempre en orden de UUID. Las ventas que comparten productos se validan y escriben de forma serial; una solicitud que espera el bloqueo vuelve a calcular el stock después de obtenerlo. Los productos distintos pueden venderse en paralelo.

`GET /sales` devuelve el historial desde la venta más reciente y `GET /sales/:id` devuelve el detalle con los precios históricos almacenados en `sale_items`. `PATCH /sales/:id/cancel` bloquea la fila de la venta con `FOR UPDATE`, registra movimientos `IN` y cambia el estado a `canceled` en una sola transacción. Ese bloqueo hace que dos cancelaciones simultáneas no puedan devolver el stock dos veces.

Los métodos de pago admitidos son `cash`, `card` y `transfer`. El flujo MVP no agrega IVA ni otra regla tributaria.

## Administración de usuarios MVP

Los endpoints `GET /users`, `GET /users/:id`, `POST /users` y `PATCH /users/:id` están restringidos al rol `Administrador`. Las respuestas públicas contienen `id`, `name`, `email`, `isActive`, `role` y `createdAt`; el hash de contraseña solo se usa internamente durante la autenticación.

La creación exige un rol existente, normaliza el email, rechaza duplicados y guarda la contraseña con bcrypt. La edición admite únicamente nombre, rol y estado activo. Una cuenta inactiva no puede iniciar sesión y sus tokens existentes dejan de funcionar porque la estrategia JWT consulta el estado actual del usuario en cada solicitud.

Un administrador no puede desactivar su propia cuenta. Los cambios que desactivan o retiran el rol al último administrador activo se rechazan. Esta comprobación usa un bloqueo advisory transaccional común para impedir que cambios simultáneos dejen el sistema sin administradores activos.

## Dashboard MVP

`GET /dashboard/summary` está disponible para Administradores y Operadores autenticados. Devuelve cantidades reales de clientes y productos activos, ventas no canceladas del día, importe vendido, productos con stock menor o igual a cero y las cinco ventas más recientes.

El stock del resumen reutiliza `InventoryService`, por lo que conserva la regla `SUM(IN) - SUM(OUT)`. El día comercial usa `America/Bogota`; como las columnas existentes son `timestamp without time zone` y Prisma persiste instantes UTC, el endpoint convierte los límites diarios de Bogotá a UTC antes de consultar. Las ventas canceladas no cuentan ni en la cantidad diaria ni en su importe, aunque permanecen visibles en ventas recientes con su estado real.

La navegación del MVP expone Dashboard, Clientes, Inventario y Ventas a ambos roles. Personal aparece únicamente para Administradores. Reportes, Notificaciones y Configuración permanecen fuera del menú y sus rutas redirigen al Dashboard hasta que esos módulos se implementen.
