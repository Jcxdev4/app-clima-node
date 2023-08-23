import fs from "fs";
import axios from "axios";
import capitalize from "capitalize";

export class Busquedas {

    historial = [];
    dbPath  = './db/database.json';

    constructor() {
        // TODO: Leer DB si existe.
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map(lugar => {
            return capitalize.words(lugar);
        })
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'language': 'es'
        }
    }

    get paramsWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async ciudad(lugar = ''){
        try {
            // Peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })

            // Todas las ciudades que coincidan con el lugar
            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))
            
        } catch (error) {
            return [];
        }
    }

    async climaCiudad(lat, lon){
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsWeather, lat, lon}
            })
    
            const response = await instance.get()
            const { weather, main } = response.data;

            return {
                desc: weather[0].description,
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max
            }

            
        } catch (error) {
            console.log(error)
        }
    }

    agregarHistorial(lugar = '') {

        if(this.historial.includes(lugar.toLowerCase())){
            return;
        }
        this.historial = this.historial.splice(0, 5);

        this.historial.unshift(lugar.toLowerCase());

        // Guardar DB
        this.guardarDB();
    }

    guardarDB() {
        // Se crea este objeto por si hay varias cosas que agregar
        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() {
        
        if(!fs.existsSync(this.dbPath)) {
            return null;
        }

        const informacion = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});

        if (!informacion) {
            return;
        }

        const data = JSON.parse(informacion);
        this.historial = data.historial;
    }
}