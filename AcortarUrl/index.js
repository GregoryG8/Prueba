//const cache = require("memory-cache");
const urlMap = {}; // Almacena las asociaciones entre URL acortadas y originales

module.exports = async function (context, req) {
  // Obtener la URL

  const originalUrl = req.query.url;
  const shortUrl = generarUrl(); // almacena la URL acortada a la const
  const shortUrlCode = context.bindingData.shortUrlCode;

  if (originalUrl) {
    context.res = {
      status: 200,
      body: `La URL recibida es: ${originalUrl}, URL acortada: http://localhost:7071/api/AcortarUrl/${shortUrl}`,
    };

    urlMap[shortUrl] = originalUrl;

    // Almacenar en caché la asociación entre la URL acortada y la original
    //cache.put(shortUrl, originalUrl, 36000);
  } else {
    context.res = {
      status: 400,
      body: "No recibió ninguna URL",
    };

    console.log(urlMap);
  }

  //console.log(obtenerUrlOriginal(shortUrl));
  console.log(urlMap);
  console.log(shortUrlCode);
};

//recuperar de cache
//function obtenerUrlOriginal(shortCode) {
  //return cache.get(shortCode); // Esto devuelve la URL original asociada al código
//}

// Función que genera un codigo unico abreviando la URL
function generarUrl() {
  const uuid = require("uuid");
  const codigoId = uuid.v4().substring(0, 7);
  return codigoId;
}

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
