//const cache = require("memory-cache");
const urlMap = {}; // Almacena las asociaciones entre URL acortadas y originales

module.exports = async function (context, req) {
  // Obtiene la URL por query
  const originalUrl = req.query.url;
  const shortUrl = generarUrl(); // almacena la URL acortada a la const
  //const shortUrlCode = context.bindingData.shortUrlCode;

  if (originalUrl) {
    urlMap[shortUrl] = originalUrl; // Guarda en un objeto la relacion de la url cortada y original

    // Crear un objeto JSON para la respuesta
    const responseUrlJson = {
      originalUrl: originalUrl,
      shortUrl: `http://localhost:7071/api/AcortarUrl/${shortUrl}`,
    };

    context.res = {
      status: 200,
      body: responseUrlJson,
      headers: {
        "Content-Type": "application/json", // Establecer el tipo de contenido como JSON
      },
    };

    // Almacenar en caché la asociación entre la URL acortada y la original
    //cache.put(shortUrl, originalUrl, 36000);
  } else {
    context.res = {
      status: 400,
      body: { error: "No recibió ninguna URL" }, // Devuelve un objeto JSON de error 
      headers: {
        "Content-Type": "application/json", // Establecer el tipo de contenido como JSON
      },
    };
  }

  // En el Body se mostrara en un objeto JSON las dos urls y en consola la relacion de las mismas
  console.log(urlMap);

  //console.log(obtenerUrlOriginal(shortUrl));
  //console.log(urlMap);
  //console.log(shortUrlCode);
};

/* Esta funcion era un complemento para guardar las urls en cache para acceder a ellas

recuperar de cache
function obtenerUrlOriginal(shortCode) {
  return cache.get(shortCode); // Esto devuelve la URL original asociada al código
}
*/

// Función que genera un codigo unico abreviando la URL
function generarUrl() {
  const uuid = require("uuid");
  const codigoId = uuid.v1();
  return codigoId;
}

//Esto es un codigo alterno que quise probar con una tabla de servicio y azure storage ---------------------------

/*const { v4: uuidv4 } = require('uuid');
const azure = require('azure-storage');

module.exports = async function (context, req) {
    const shortUrlCode = context.bindingData.shortUrlCode;
    const originalUrl = req.query.url;

    if (shortUrlCode) {
        const tableService = azure.createTableService('UseDevelopmentStorage=true');

        tableService.retrieveEntity('urltable', 'urls', shortUrlCode, (error, result) => {
            if (!error && result) {
                const redirectUrl = result.OriginalUrl._;
                context.res = {
                    status: 302, // Redirección temporal
                    headers: {
                        Location: redirectUrl
                    }
                };
            } else {
                context.res = {
                    status: 404,
                    body: "Acortada URL not found"
                };
            }

            context.done();
        });
    } else if (originalUrl) {
        const shortenedId = uuidv4().replace(/-/g, '').substring(0, 7);
        const shortenedUrl = `http://localhost:7071/api/AcortarUrl/${shortenedId}`;

        const tableService = azure.createTableService('UseDevelopmentStorage=true');
        const shortenedEntity = {
            PartitionKey: 'urls',
            RowKey: shortenedId,
            OriginalUrl: `https://${originalUrl}`
        };

        tableService.insertEntity('urltable', shortenedEntity, (error) => {
            if (error) {
                context.log.error('Error insertando:', error);
            }
        });

        context.res = {
            status: 200,
            body: shortenedUrl
        };

        console.log(shortenedEntity);
    } else {
        context.res = {
            status: 400,
            body: "Ingresar otra 'url' acortada para redireccionar"
        };
        context.done();
    }
};"azure-storage": "^2.10.7
azurite en otro terminal
"memory-cache": "^0.2.0",
*/
