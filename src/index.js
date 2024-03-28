import puppeteer from "puppeteer";

async function openWebPage() {
  const browser = await puppeteer.launch({
    //CAMBIAR a true para no ver la pantalla
    headless: false,
    slowMo: 300, // es para que no se cierre el navegador tan rapido
  });

  const page = await browser.newPage();

  await page.goto("https://www.thefreshmarket.com.ar/search/?q=notco&mpage=2");
  await browser.close();
  //   const click = await page.click(
  //     'h1[class="text-center h2 h1-md  text-primary"]'
  //   );
}

/**
 *
 * @param {string} product
 * product es el producto que ingresarias en el buscador
 * funciona SOLO para la pagina que esta ahi, para otras paginas habria que ver la estructura
 * de la url para las busquedas.
 */
async function getData(product) {
  //declaro un browser el cual voy a ejecutar luego
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 300,
  });

  //le indico al browser que cree una instancia de page
  const page = await browser.newPage();

  /*
  navego a la pagina que quiero. Aca podrias cambiar la URL si queres probar 
  con el buscador de otra pagina. Habria que hacer uno por cada pagina
  que quieras consultar. 
  */
  await page.goto(
    `https://www.thefreshmarket.com.ar/search/?q=${product}&mpage=5`
  );

  /**
   * Vamos a obtener los textos que nos interesan
   * De momento solo TITULO del producto y PRECIO
   * la funcion EVALUATE me permite analizar los datos del html
   */

  const innerTexts = await page.evaluate(() => {
    /**
     * aca vamos a seleccionar todos los elementos con la clase .js-item-product
     * Para conocer la clase vas a habrir el inspector del buscador y en la etiqueta que queres analizar
     * ver el nobre de la clase (<item class="nombre_clase"/>) y seleccionarlo con querySelectorAll
     * de la siguiente manera document.querySelectorAll(".nombre_clase")
     * document te permite manejar el HTML
     * RESULTADO: en itemProducts tendrias CADA UNO de los contenederos de la clase que buscas
     * en este caso serian todos los resultados de la busqueda.
     */
    const itemProducts = document.querySelectorAll(".js-item-product");

    // array para almacenar los textos de los elementos con la clase .js-item-name
    const proudctsObjects = [];

    // ZICLO FOR sobre cada elemento con la clase .js-item-product
    itemProducts.forEach((itemProduct) => {
      /**
       * guardamos por cada prod los elementos con la clase .js-item-name y .js-price-display
       * dentro de cada elemento con la clase .js-item-product
       */
      //

      const title = itemProduct.querySelector(".js-item-name");
      const price = itemProduct.querySelector(".js-price-display");

      /**
       * aca obtengo la imagen para desp renderizar en el front, 
       * tiene la url en 3 tamaños de imagen, hay que arreglar para que solo guarde una
       */
      let imageUrl = itemProduct.querySelector("img.js-item-image");
      imageUrl =  imageUrl.getAttribute('data-srcset');
      /**
       * chequeamos que existan titlos y precios porque en los que no hay stock no tienen esos datos
       * y rompe la app.
       * Si tienen creamos el objeto productResult y lo guardamos en nuestro array proudctsObjects con un push
       */
      if (title && price && imageUrl) {
        const productResult = {
          title: title.innerText,
          price: price.innerText,
            imgUrl: imageUrl,
        };
        proudctsObjects.push(productResult);
      }
    });

    // devolvemos el array de objetos de los elementos con la clase .js-item-name
    return proudctsObjects;
  });

  console.log(innerTexts);
  await browser.close();
}

/**
 * cambiar carne por el producto q quieras buscar
 */
getData("television");
