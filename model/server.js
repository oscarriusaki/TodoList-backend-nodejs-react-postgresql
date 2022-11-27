const express = require('express');
const cors = require('cors');
const db = require('../database/config');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.path = {
            user: '/user',
            login: '/login',
            hero: '/list',
            err: '/'
        }

        // base de datos
        this.database();
        // middlewares
        this.middlewares();
        // route
        this.route();

    }
    async database (){
        try{
            const pg = await db;
            pg.connect((err, client, release) => {
                if(err){
                    // console.log(err);
                    console.error(err);
                }else{
                    // console.log(client);
                    console.log('Database Connected')
                }
            })
        }catch(err){
            // console.log(err,'////////')
            throw new Error('Error al conectar con la base de datos');
        }
    }
    middlewares(){
        // para las rutas permitidas o restringir rutas
        this.app.use(cors());
        // para recibir datos tipo json
        this.app.use(express.json());
        // directorio publico
        this.app.use(express.static('public'));
    }
    route(){
        this.app.use(this.path.user, require('../router/user'));
        this.app.use(this.path.login, require('../router/login'));
        this.app.use(this.path.hero, require('../router/list'));
        // si no se encotro alguna ruta correcta mostraremos el mensaje de error
        this.app.use(this.path.err, require('../router/err'));
    }
    listen(){
        this.app.listen(this.port, () => {
            console.log(`port running at ${this.port}`)
        });
    }

}

module.exports = Server;
