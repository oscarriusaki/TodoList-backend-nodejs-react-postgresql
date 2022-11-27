const jwt = require('jsonwebtoken');

const generarJWt = (email = '') => {
    
    return new Promise((resolve, reject) => {
        
        const payload = {email};
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY,{
            expiresIn: '320s'
        }, (err, token) => {
            if(err){
                console.log(err);
                reject('No se pudo generar el token')
            }else{
                resolve(token);
            }
        })

    });

}
module.exports = {
    generarJWt,
}