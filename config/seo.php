<?php

/*
| SEO Y VISTA PREVIA AL COMPARTIR
| Lo leen Google, WhatsApp, Facebook y demás en el HTML que manda el servidor (resources/views/partials/seo.blade.php).
| Esos robots no ejecutan React: lo que se ponga con <Head> en las páginas no les llega.
|
| image: imagen de 1200x630. Cambiarla si cambia el nombre del sistema.
| indexable_routes: rutas que pueden aparecer en Google. Las demás llevan noindex.
*/

return [

    'name' => 'Panel Admin',

    // Título de Google y de la vista previa: hasta unos 60 caracteres
    'title' => 'Panel Admin | Sistema de gestión administrativa',

    // Descripción de Google y de la vista previa: hasta unos 160 caracteres
    'description' => 'Sistema de gestión administrativa con panel de métricas, usuarios, roles y permisos. Desarrollado por soluciondigital.dev.',

    'image' => 'images/og-image.jpg',

    'image_alt' => 'Panel Admin: logo y nombre del sistema',

    // Color de la barra del navegador en el celular
    'theme_color' => '#0B1B33',

    'locale' => 'es_BO',

    'indexable_routes' => ['home', 'login'],

];
