# Guia completa del proyecto DEV001

Fecha de esta version: 2026-06-30

Este documento explica como esta armado actualmente el proyecto `DEV001`, que archivos son importantes, como fluye una peticion desde el navegador hasta una vista, como funciona el login, el dashboard, las pantallas de configuracion y que debes tocar cuando quieras modificar la plantilla.

La idea es que este archivo sea el manual vivo del proyecto. Si el codigo cambia, este documento tambien debe actualizarse.

## 1. Resumen rapido

Este proyecto es una aplicacion Laravel basada en el starter kit oficial de Livewire.

Tecnologias principales:

- Laravel 13.17
- PHP 8.4.22 en Laragon
- Laravel Fortify para autenticacion
- Livewire 4 para componentes interactivos del lado servidor
- Flux 2 para componentes visuales Blade
- Tailwind CSS 4 para estilos
- Vite 8 para compilar CSS, JS y fuentes
- MySQL/MariaDB local con base de datos `dev001`

La pantalla que estas viendo despues de iniciar sesion es el dashboard base del starter kit. Los cuadros grandes con patron diagonal son placeholders. Estan hechos para que reemplaces cada bloque por tarjetas, tablas, graficas, indicadores, formularios o modulos reales.

## 2. Como pensar este proyecto

Laravel organiza la aplicacion por responsabilidades.

El navegador entra por una ruta. La ruta decide que vista o componente se muestra. La vista usa layouts y componentes. Los estilos se compilan con Vite. La autenticacion la maneja Fortify. Las pantallas dinamicas de configuracion usan Livewire.

Flujo simplificado:

```text
Navegador
  -> public/index.php
  -> Laravel
  -> routes/web.php o routes/settings.php
  -> Vista Blade o componente Livewire
  -> Layout principal
  -> Componentes Flux / Blade
  -> CSS y JS compilados por Vite
```

## 3. Archivos y carpetas importantes

```text
app/
  Concerns/
    PasswordValidationRules.php
    ProfileValidationRules.php
  Livewire/
    Settings/
      Appearance.php
      Profile.php
      Security.php
  Models/
    User.php
  Providers/
    FortifyServiceProvider.php

bootstrap/
  app.php
  providers.php

config/
  app.php
  auth.php
  database.php
  fortify.php
  session.php

database/
  migrations/
  factories/
  seeders/

public/
  index.php
  build/
    manifest.json

resources/
  css/app.css
  js/app.js
  views/
    dashboard.blade.php
    welcome.blade.php
    layouts/
    livewire/
    components/
    partials/

routes/
  web.php
  settings.php

docs/
  GUIA_COMPLETA_DEL_PROYECTO.md
```

## 4. Configuracion actual del entorno

El archivo `.env` contiene la configuracion local.

Valores importantes actuales:

```env
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost/DEV001

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=dev001
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

Puntos importantes:

- `APP_DEBUG=true` permite ver errores detallados mientras desarrollas.
- `APP_URL=http://localhost/DEV001` indica que estas corriendo el proyecto dentro de Laragon con la ruta `/DEV001`.
- `SESSION_DRIVER=database` significa que las sesiones se guardan en la tabla `sessions`.
- `CACHE_STORE=database` y `QUEUE_CONNECTION=database` usan tablas de base de datos.

## 5. Entrada de la aplicacion

La entrada real del proyecto web es:

```text
public/index.php
```

No se trabaja casi nunca directamente ahi. Laravel lo usa como punto inicial. Desde ahi carga el framework, el archivo `.env`, rutas, proveedores y middleware.

En Laragon estas entrando por:

```text
http://localhost/DEV001/public/login
```

Idealmente, mas adelante se puede configurar Laragon para que el Document Root apunte directamente a `public`, y asi entrar con una URL mas limpia:

```text
http://dev001.test/login
```

Eso no es obligatorio para empezar, pero es una mejora buena cuando el proyecto avance.

## 6. Rutas principales

Las rutas publicas y del dashboard estan en:

```text
routes/web.php
```

Contenido clave:

```php
Route::view('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::view('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
```

Esto significa:

- `/` carga la vista `resources/views/welcome.blade.php`.
- `/dashboard` carga `resources/views/dashboard.blade.php`.
- `/dashboard` requiere usuario autenticado y correo verificado.
- Las rutas de configuracion se separan en `routes/settings.php`.

Las rutas de configuracion estan en:

```text
routes/settings.php
```

Rutas actuales:

```text
GET settings              -> redirige a settings/profile
GET settings/profile      -> componente Livewire Profile
GET settings/appearance   -> componente Livewire Appearance
GET settings/security     -> componente Livewire Security
```

## 7. Autenticacion con Fortify

El proyecto usa Laravel Fortify. Fortify registra rutas como:

```text
GET  /login
POST /login
POST /logout
GET  /forgot-password
GET  /reset-password/{token}
GET  /email/verify
```

El archivo principal de configuracion es:

```text
config/fortify.php
```

Puntos importantes:

- El campo de login es `email`.
- Cuando un usuario entra correctamente, Fortify lo manda a `/dashboard`.
- Estan activas las funciones de reset de password y verificacion de email.

El provider que conecta Fortify con tus vistas esta en:

```text
app/Providers/FortifyServiceProvider.php
```

Ese archivo indica que:

```php
Fortify::loginView(fn () => view('livewire.auth.login'));
Fortify::verifyEmailView(fn () => view('livewire.auth.verify-email'));
Fortify::resetPasswordView(fn () => view('livewire.auth.reset-password'));
Fortify::requestPasswordResetLinkView(fn () => view('livewire.auth.forgot-password'));
```

Traduccion simple:

- Si visitas `/login`, Laravel muestra `resources/views/livewire/auth/login.blade.php`.
- Si pides recuperar contrasena, usa las vistas dentro de `resources/views/livewire/auth/`.
- Fortify maneja la logica interna de login, logout y reset.

## 8. Pantalla de login

Archivo:

```text
resources/views/livewire/auth/login.blade.php
```

Esta pantalla usa:

- `<x-layouts::auth>` como layout.
- `<x-auth-header>` para el titulo y descripcion.
- `<x-auth-session-status>` para mensajes de sesion.
- `<flux:input>` para email y password.
- `<flux:checkbox>` para recordar sesion.
- `<flux:button>` para enviar.

El formulario manda a:

```php
route('login.store')
```

Ese nombre de ruta lo registra Fortify. Tu no ves un controlador propio porque Fortify trae internamente los controladores de autenticacion.

Si quieres cambiar textos del login:

```text
resources/views/livewire/auth/login.blade.php
```

Si quieres cambiar el contenedor visual del login:

```text
resources/views/layouts/auth/simple.blade.php
resources/views/layouts/auth.blade.php
```

## 9. Layout de autenticacion

Archivo principal:

```text
resources/views/layouts/auth.blade.php
```

Este archivo solamente envuelve otro layout:

```php
<x-layouts::auth.simple :title="$title ?? null">
    {{ $slot }}
</x-layouts::auth.simple>
```

El layout real esta en:

```text
resources/views/layouts/auth/simple.blade.php
```

Ese archivo:

- Define el HTML base.
- Incluye `partials.head`.
- Aplica modo oscuro con `class="dark"`.
- Centra el formulario en pantalla.
- Muestra el logo arriba.
- Carga scripts de Flux al final con `@fluxScripts`.

## 10. Head compartido

Archivo:

```text
resources/views/partials/head.blade.php
```

Este archivo se incluye en varias paginas y contiene:

- Charset.
- Viewport.
- Titulo de la pagina.
- Favicons.
- Fuentes con `@fonts`.
- Assets compilados con `@vite`.
- Apariencia de Flux con `@fluxAppearance`.

Linea clave:

```php
@vite(['resources/css/app.css', 'resources/js/app.js'])
```

Esto le dice a Laravel que cargue el CSS y JS de Vite.

Si no existe `public/build/manifest.json`, aparece el error:

```text
Vite manifest not found
```

Solucion:

```bash
npm install
npm run build
```

O en desarrollo:

```bash
npm run dev
```

## 11. Dashboard

Archivo:

```text
resources/views/dashboard.blade.php
```

Contenido actual resumido:

```php
<x-layouts::app :title="__('Dashboard')">
    <div class="flex h-full w-full flex-1 flex-col gap-4 rounded-xl">
        <div class="grid auto-rows-min gap-4 md:grid-cols-3">
            <div class="relative aspect-video ...">
                <x-placeholder-pattern ... />
            </div>
            ...
        </div>
        <div class="relative h-full flex-1 ...">
            <x-placeholder-pattern ... />
        </div>
    </div>
</x-layouts::app>
```

La captura que mostraste viene de esta vista.

Que significa:

- `<x-layouts::app>` carga el layout principal de usuario autenticado.
- La primera fila tiene 3 tarjetas en escritorio gracias a `md:grid-cols-3`.
- Cada tarjeta usa `aspect-video`, por eso tienen proporcion 16:9.
- El bloque grande inferior ocupa el espacio restante.
- `<x-placeholder-pattern>` solo dibuja el patron diagonal temporal.

Para convertir el dashboard en algo real, este es el primer archivo que normalmente tocaras:

```text
resources/views/dashboard.blade.php
```

Ejemplos de reemplazo:

- Tarjeta 1: total de usuarios.
- Tarjeta 2: ventas del mes.
- Tarjeta 3: pendientes.
- Bloque grande: tabla, grafica, calendario o panel principal.

## 12. Layout principal de la app

Archivo:

```text
resources/views/layouts/app.blade.php
```

Este layout usa:

```php
<x-layouts::app.sidebar :title="$title ?? null">
    <flux:main>
        {{ $slot }}
    </flux:main>
</x-layouts::app.sidebar>
```

Esto significa:

- Toda pagina que use `<x-layouts::app>` se renderiza dentro del layout con sidebar.
- El contenido propio de cada pagina se inserta en `{{ $slot }}`.
- `<flux:main>` define el area principal de contenido.

El layout con sidebar esta en:

```text
resources/views/layouts/app/sidebar.blade.php
```

Ese archivo controla casi todo lo que ves cuando ya estas logueado:

- HTML base.
- Sidebar izquierdo.
- Logo.
- Menu principal.
- Links a Repository y Documentation.
- Menu de usuario.
- Header movil.
- Toasts.
- Scripts Flux.

## 13. Sidebar

Archivo:

```text
resources/views/layouts/app/sidebar.blade.php
```

Partes principales:

```php
<flux:sidebar sticky collapsible="mobile" ...>
```

El sidebar:

- Es fijo/sticky.
- Se puede colapsar en movil.
- Usa estilos claros y oscuros.

Logo:

```php
<x-app-logo :sidebar="true" href="{{ route('dashboard') }}" wire:navigate />
```

Menu principal:

```php
<flux:sidebar.group :heading="__('Platform')" class="grid">
    <flux:sidebar.item icon="home" :href="route('dashboard')" :current="request()->routeIs('dashboard')" wire:navigate>
        {{ __('Dashboard') }}
    </flux:sidebar.item>
</flux:sidebar.group>
```

Links inferiores:

```php
Repository
Documentation
```

Usuario:

```php
<x-desktop-user-menu class="hidden lg:block" :name="auth()->user()->name" />
```

Si quieres agregar una nueva opcion al menu lateral, normalmente agregas otro `<flux:sidebar.item>` dentro del grupo `Platform`.

Ejemplo:

```php
<flux:sidebar.item icon="users" :href="route('clientes.index')" :current="request()->routeIs('clientes.*')" wire:navigate>
    {{ __('Clientes') }}
</flux:sidebar.item>
```

## 14. Logo y nombre de la app

Archivo:

```text
resources/views/components/app-logo.blade.php
```

Ahora el nombre visible es:

```text
Laravel Starter Kit
```

Se muestra tanto en sidebar como en header.

Si quieres cambiarlo por el nombre de tu proyecto, cambia:

```php
<flux:sidebar.brand name="Laravel Starter Kit" ...>
```

y:

```php
<flux:brand name="Laravel Starter Kit" ...>
```

El icono esta en:

```text
resources/views/components/app-logo-icon.blade.php
```

Si quieres cambiar el logo, ese es el archivo principal.

## 15. Menu de usuario

Archivo:

```text
resources/views/components/desktop-user-menu.blade.php
```

Ese menu muestra:

- Avatar o iniciales del usuario.
- Nombre.
- Email.
- Link a Settings.
- Boton Log out.

El nombre y email vienen de:

```php
auth()->user()->name
auth()->user()->email
```

Las iniciales vienen del metodo `initials()` del modelo `User`.

## 16. Modelo User

Archivo:

```text
app/Models/User.php
```

Este modelo representa a los usuarios de la tabla `users`.

Campos llenables:

```php
#[Fillable(['name', 'email', 'password'])]
```

Campos ocultos cuando el usuario se convierte a array/json:

```php
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
```

Casts:

```php
'email_verified_at' => 'datetime',
'password' => 'hashed',
```

Punto importante: si asignas un password al usuario, Laravel lo hashea automaticamente por el cast `hashed`.

Metodo util:

```php
public function initials(): string
```

Ese metodo calcula iniciales para el avatar del usuario.

## 17. Base de datos

Migracion principal:

```text
database/migrations/0001_01_01_000000_create_users_table.php
```

Tablas que crea:

- `users`
- `password_reset_tokens`
- `sessions`

Tabla `users`:

```text
id
name
email
email_verified_at
password
remember_token
created_at
updated_at
```

Tabla `sessions`:

```text
id
user_id
ip_address
user_agent
payload
last_activity
```

Como `.env` usa `SESSION_DRIVER=database`, Laravel necesita esta tabla para guardar sesiones.

## 18. Pantallas de Settings

Las rutas estan en:

```text
routes/settings.php
```

Las clases Livewire estan en:

```text
app/Livewire/Settings/
```

Las vistas estan en:

```text
resources/views/livewire/settings/
```

### Profile

Clase:

```text
app/Livewire/Settings/Profile.php
```

Vista:

```text
resources/views/livewire/settings/profile.blade.php
```

Sirve para:

- Mostrar nombre y email actual.
- Actualizar nombre.
- Actualizar email.
- Marcar email como no verificado si cambia.
- Enviar toast de exito.
- Mostrar formulario de borrar usuario si aplica.

Validaciones:

```text
app/Concerns/ProfileValidationRules.php
```

Reglas:

- `name`: requerido, string, maximo 255.
- `email`: requerido, formato email, maximo 255, unico en users ignorando el usuario actual.

### Security

Clase:

```text
app/Livewire/Settings/Security.php
```

Vista:

```text
resources/views/livewire/settings/security.blade.php
```

Sirve para cambiar password.

Campos:

- `current_password`
- `password`
- `password_confirmation`

Validaciones:

```text
app/Concerns/PasswordValidationRules.php
```

Reglas:

- Password actual requerido y correcto.
- Nuevo password requerido.
- Debe cumplir las reglas default de Laravel.
- Debe venir confirmado.

### Appearance

Clase:

```text
app/Livewire/Settings/Appearance.php
```

Vista:

```text
resources/views/livewire/settings/appearance.blade.php
```

Permite elegir:

- Light.
- Dark.
- System.

Usa Flux y Alpine internamente:

```php
<flux:radio.group x-data variant="segmented" x-model="$flux.appearance">
```

## 19. Layout interno de Settings

Archivo:

```text
resources/views/components/settings/layout.blade.php
```

Este componente divide la pagina en:

- Menu lateral de settings.
- Area de contenido.

Links actuales:

```php
Profile
Security
Appearance
```

Si agregas una nueva pagina de settings, debes tocar:

- `routes/settings.php`
- `app/Livewire/Settings/NuevaPantalla.php`
- `resources/views/livewire/settings/nueva-pantalla.blade.php`
- `resources/views/components/settings/layout.blade.php`

## 20. Blade, componentes y slots

Blade es el motor de vistas de Laravel.

Ejemplo:

```php
<x-layouts::app :title="__('Dashboard')">
    Contenido de la pagina
</x-layouts::app>
```

Ese contenido entra en el `{{ $slot }}` del layout.

Un componente Blade con prefijo `x-` normalmente vive en:

```text
resources/views/components/
```

Ejemplos:

```text
x-app-logo
x-app-logo-icon
x-desktop-user-menu
x-placeholder-pattern
x-settings.layout
```

Los componentes con prefijo `flux:` vienen de la libreria Flux, no estan todos definidos en tu carpeta `resources`.

Ejemplos:

```text
flux:sidebar
flux:button
flux:input
flux:dropdown
flux:menu
flux:toast
```

## 21. Livewire

Livewire permite crear componentes dinamicos usando PHP y Blade sin escribir mucho JavaScript.

Ejemplo real:

```php
Route::livewire('settings/profile', Profile::class)->name('profile.edit');
```

Eso conecta la URL:

```text
/settings/profile
```

con la clase:

```text
app/Livewire/Settings/Profile.php
```

y su vista:

```text
resources/views/livewire/settings/profile.blade.php
```

En la vista se usan propiedades de la clase con `wire:model`:

```php
<flux:input wire:model="name" ... />
```

Y se ejecutan metodos con `wire:submit`:

```php
<form wire:submit="updateProfileInformation">
```

## 22. Flux

Flux es la libreria de componentes visuales usada por este starter kit.

Ventaja:

- Te da inputs, botones, menus, sidebars, radios, avatars y toasts ya estilizados.
- Mantiene consistencia visual.
- Reduce HTML repetitivo.

Ejemplos:

```php
<flux:button variant="primary">Save</flux:button>
<flux:input wire:model="email" :label="__('Email')" />
<flux:sidebar.item icon="home">Dashboard</flux:sidebar.item>
```

Cuando trabajes esta plantilla, lo ideal es mantener Flux en lugar de reemplazar todo por HTML manual. Asi el estilo sigue consistente.

## 23. Tailwind CSS

Archivo:

```text
resources/css/app.css
```

Ese archivo:

- Importa Tailwind.
- Importa estilos de Flux.
- Define fuentes.
- Define colores `zinc` y `accent`.
- Configura modo oscuro.
- Ajusta estilos base para inputs.

Linea importante:

```css
@import 'tailwindcss';
@import '../../vendor/livewire/flux/dist/flux.css';
```

Modo oscuro:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

La app actualmente fuerza modo oscuro porque varios layouts tienen:

```html
<html class="dark">
```

Si algun dia quieres que la app respete siempre claro/oscuro/sistema, habria que revisar esa clase fija junto con `@fluxAppearance`.

## 24. Vite

Archivos:

```text
vite.config.js
package.json
resources/css/app.css
resources/js/app.js
```

`package.json` tiene:

```json
"scripts": {
  "build": "vite build",
  "dev": "vite"
}
```

`vite.config.js` define:

```js
laravel({
    input: [
        'resources/css/app.css',
        'resources/js/app.js',
    ],
    refresh: true,
    fonts: [
        bunny('Instrument Sans', {
            weights: [400, 500, 600],
        }),
    ],
})
```

Esto significa:

- Vite compila `app.css` y `app.js`.
- Laravel sabe como cargar los assets generados.
- Se usa la fuente Instrument Sans desde Bunny Fonts.
- `refresh: true` ayuda a refrescar cambios en desarrollo.

Build de produccion:

```bash
npm run build
```

Modo desarrollo:

```bash
npm run dev
```

El build genera:

```text
public/build/manifest.json
public/build/assets/
public/build/fonts-manifest.json
```

## 25. Error comun: Vite manifest not found

Error:

```text
Illuminate\Foundation\ViteManifestNotFoundException
Vite manifest not found at public/build/manifest.json
```

Por que pasa:

- Laravel encontro `@vite(...)`.
- Laravel busco `public/build/manifest.json`.
- El archivo no existia.
- Entonces no sabia que CSS/JS cargar.

Causas comunes:

- Nunca se corrio `npm run build`.
- Se borro `public/build`.
- `node_modules` estaba incompleto.
- Falto correr `npm install`.
- En desarrollo se esperaba `npm run dev`, pero no estaba activo.

En este proyecto paso ademas que faltaba:

```text
@rolldown/binding-win32-x64-msvc
```

Solucion aplicada:

```bash
npm install
npm run build
```

## 26. Comandos utiles

Como en esta terminal `php` no esta en el PATH, puedes usar PHP de Laragon asi:

```bash
D:\laragon\bin\php\php-8.4.22\php.exe artisan route:list
```

Comandos Laravel:

```bash
D:\laragon\bin\php\php-8.4.22\php.exe artisan route:list
D:\laragon\bin\php\php-8.4.22\php.exe artisan migrate
D:\laragon\bin\php\php-8.4.22\php.exe artisan cache:clear
D:\laragon\bin\php\php-8.4.22\php.exe artisan config:clear
D:\laragon\bin\php\php-8.4.22\php.exe artisan view:clear
```

Comandos frontend:

```bash
npm install
npm run dev
npm run build
```

Comandos de calidad definidos en Composer:

```bash
composer lint
composer lint:check
composer types:check
composer test
```

## 27. Como crear una nueva pagina normal

Ejemplo: crear pagina `Clientes`.

Paso 1: crear vista:

```text
resources/views/clientes/index.blade.php
```

Contenido base:

```php
<x-layouts::app :title="__('Clientes')">
    <div class="space-y-4">
        <flux:heading>{{ __('Clientes') }}</flux:heading>
        <flux:text>{{ __('Listado de clientes') }}</flux:text>
    </div>
</x-layouts::app>
```

Paso 2: agregar ruta en `routes/web.php`:

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::view('dashboard', 'dashboard')->name('dashboard');
    Route::view('clientes', 'clientes.index')->name('clientes.index');
});
```

Paso 3: agregar item en sidebar:

```text
resources/views/layouts/app/sidebar.blade.php
```

Dentro del grupo `Platform`:

```php
<flux:sidebar.item icon="users" :href="route('clientes.index')" :current="request()->routeIs('clientes.*')" wire:navigate>
    {{ __('Clientes') }}
</flux:sidebar.item>
```

## 28. Como crear una pagina con Livewire

Usa Livewire cuando necesites interaccion:

- Formularios dinamicos.
- Filtros.
- Busquedas.
- Tablas con acciones.
- Modales.
- Guardar sin recargar manualmente toda la pagina.

Flujo recomendado:

1. Crear clase en `app/Livewire`.
2. Crear vista en `resources/views/livewire`.
3. Registrar ruta con `Route::livewire`.
4. Agregar link en sidebar si aplica.

Ejemplo conceptual:

```php
use App\Livewire\Clientes\Index;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::livewire('clientes', Index::class)->name('clientes.index');
});
```

## 29. Donde tocar segun lo que quieras cambiar

Cambiar el dashboard:

```text
resources/views/dashboard.blade.php
```

Cambiar menu lateral:

```text
resources/views/layouts/app/sidebar.blade.php
```

Cambiar nombre visible de la app:

```text
resources/views/components/app-logo.blade.php
```

Cambiar icono/logo:

```text
resources/views/components/app-logo-icon.blade.php
```

Cambiar login:

```text
resources/views/livewire/auth/login.blade.php
```

Cambiar layout del login:

```text
resources/views/layouts/auth/simple.blade.php
```

Cambiar estilos globales:

```text
resources/css/app.css
```

Cambiar rutas:

```text
routes/web.php
routes/settings.php
```

Cambiar validacion de perfil:

```text
app/Concerns/ProfileValidationRules.php
```

Cambiar validacion de password:

```text
app/Concerns/PasswordValidationRules.php
```

Cambiar comportamiento de login/reset/verificacion:

```text
app/Providers/FortifyServiceProvider.php
config/fortify.php
```

Cambiar campos del usuario:

```text
database/migrations/
app/Models/User.php
resources/views/livewire/settings/profile.blade.php
app/Livewire/Settings/Profile.php
```

## 30. Recomendaciones para trabajar la plantilla

1. No borres el layout principal todavia. Primero aprende a reemplazar contenido dentro del dashboard.
2. Mantén Flux para botones, inputs y menus mientras el proyecto este creciendo.
3. Crea rutas pequenas y claras.
4. Si una pagina solo muestra informacion, usa `Route::view`.
5. Si una pagina tiene interaccion, usa Livewire.
6. Antes de cambiar estilos globales, intenta resolverlo con clases Tailwind en la vista.
7. Despues de tocar CSS o JS, corre `npm run build` si no estas usando `npm run dev`.
8. Si aparece un error raro de assets, revisa primero `public/build/manifest.json`.
9. Documenta cada modulo nuevo dentro de `docs/`.

## 31. Plan sugerido para evolucionar el proyecto

Etapa 1: limpieza de identidad

- Cambiar `Laravel Starter Kit` por el nombre real del proyecto.
- Cambiar logo.
- Cambiar `APP_NAME` en `.env`.
- Ajustar links de Repository y Documentation del sidebar.

Etapa 2: dashboard real

- Reemplazar los tres placeholders superiores por tarjetas reales.
- Reemplazar el bloque grande por una tabla o modulo principal.
- Definir que datos necesita mostrar el sistema.

Etapa 3: modulos

- Crear el primer modulo real.
- Agregar ruta.
- Agregar item en sidebar.
- Crear vistas o componentes Livewire.
- Crear migraciones si necesita base de datos.

Etapa 4: permisos y usuarios

- Decidir roles: admin, operador, cliente, etc.
- Definir que ve cada rol.
- Proteger rutas segun permisos.

Etapa 5: documentacion madura

- Dividir esta guia en documentos mas pequenos si crece mucho.
- Generar PDF.
- Crear checklist de instalacion.
- Crear guia de despliegue.

## 32. Glosario rapido

Laravel:
Framework PHP que organiza rutas, vistas, base de datos, seguridad y logica del servidor.

Blade:
Motor de plantillas de Laravel. Los archivos terminan en `.blade.php`.

Livewire:
Herramienta para crear interfaces dinamicas usando PHP y Blade.

Flux:
Biblioteca de componentes visuales para Livewire/Blade.

Fortify:
Sistema backend de autenticacion de Laravel.

Vite:
Herramienta que compila CSS, JS y fuentes.

Tailwind:
Framework CSS basado en clases utilitarias.

Migration:
Archivo PHP que crea o modifica tablas de base de datos.

Model:
Clase PHP que representa una tabla o entidad.

Route:
Definicion que conecta una URL con una vista, componente o controlador.

Layout:
Plantilla base que envuelve paginas. Ejemplo: sidebar, header, login.

Slot:
Espacio donde un componente recibe contenido.

## 33. Estado actual de esta documentacion

Esta es la primera version del manual del proyecto. Cubre la estructura existente y explica como trabajar la plantilla actual.

Pendientes recomendados para futuras versiones:

- Agregar capturas de pantalla.
- Agregar diagrama visual de flujo login -> dashboard.
- Documentar el primer modulo real cuando lo creemos.
- Generar una version PDF.
- Crear guias separadas por tema si el documento crece demasiado.
