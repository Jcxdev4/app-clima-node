import 'dotenv/config'

import { inquirerMenu, leerInput, pausa, listarLugares } from "./helpers/inquirer.js"
import { Busquedas } from "./models/busquedas.js";


const main = async() => {
    let opt;

    let busquedas = new Busquedas();

    do {
        opt = await inquirerMenu();

        switch(opt){
            case 1:
                // Mostrar mensaje para que la persona escriba
                const termino = await leerInput('Ciudad: ');

                // Buscar los lugares
                const lugares = await busquedas.ciudad(termino);

                if(lugares.length === 0) { 
                    console.log('Ciudad no encontrada!!');
                } else {
                    
                    // Seleccionar uno de los lugares encontrados
                    const id = await listarLugares(lugares);
                    if(id === '0') continue;
                    const lugarSel = await lugares.find(l => l.id === id);
                    const {nombre, lng, lat} = lugarSel;

                    // Guardar en DB
                    busquedas.agregarHistorial(nombre);

                    // Clima
                    const clima = await busquedas.climaCiudad(lat, lng);

                    // Mostrar resultados
                    console.log('\nInformacion de la ciudad\n'.green);
                    console.log('Ciudad:', `${nombre}`.blue);
                    console.log('Lat:', lat);
                    console.log('Lng:', lng);
                    console.log('Temperatura:', clima.temp);
                    console.log('Minima:', clima.min);
                    console.log('Maxima:', clima.max);
                    console.log(`Condiciones:`, `${clima.desc}`.blue);
                }
            break;

            case 2:
                // Imprimir el historial
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                })

                // console.log(busquedas.leerDB().historial)
            break;
        }

        if(opt !== 0) await pausa();

    } while (opt !== 0);
}

main();



