const { response } = require("express");
const db = require("../database/config");
const bcryptjs = require('bcryptjs');
const { generarJWt } = require("../helpers/GenerarJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async ( req, res=response ) => {
    
    const { pas, email } = req.body;
    const pg = await db;
    const sql = 'SELECT * FROM USERS WHERE email = $1';

    pg.query(sql, [ email], async(err, result) => {

        if(err){
            return res.status(500).json({
                code: err.code, 
                name: err.name, 
                hint: err.hint,
                detail: err.detail,
                where: err.where,
                file: err.file
            })
        }else{
            if ( result.rowCount === 1 ){
                
                if(result.rows[0].estado){
                    
                    if(pas){
                        try{
                            
                            const validarPassword = bcryptjs.compareSync(pas, result.rows[0].pas);
                            
                            if(validarPassword){
                                const token = await generarJWt(email);
                                const sql = 'UPDATE USERS SET tokens = $1 WHERE email = $2';
                                pg.query(sql, [ token, email], (err, result) => {
                                    if(err){
                                        console.log('object');
                                        return res.status(500).json({
                                            code: err.code, 
                                            name: err.name, 
                                            hint: err.hint,
                                            detail: err.detail,
                                            where: err.where,
                                            file: err.file
                                        })
                                    }else{
                                        if(result.rowCount === 1){
                                            req.user = result.rows[0];
                                            return res.status(200).json({
                                                token,
                                                msg: 'successfully logged in'
                                            })
                                        }else{
                                            return res.status(400).json({
                                                msg: 'there was an error in the query'
                                            })
                                        }
                                    }
                                })

                            }else{
                                return res.status(404).json({
                                    msg: 'password incorrect'
                                })
                            }

                        }catch(err){
                            return res.status(500).json({
                                msg: 'There was an error, talk to the administration'
                            })
                        }
                    }else{
                        const token = await generarJWt(email);

                        const sql = 'UPDATE USERS SET tokens = $1 WHERE email = $2';
                        pg.query(sql, [token, email], (err, result) => {
                            if(err){
                                return res.status({
                                    code: err.code, 
                                    name: err.name, 
                                    hint: err.hint,
                                    detail: err.detail,
                                    where: err.where,
                                    file: err.file
                                })
                            }else{
                                if(result.rowCount === 1){
                                    req.user = result.rows[0]
                                    return res.status(200).json({
                                        token,
                                        msg: 'successfully logged in'
                                    })
                                }else{
                                    return res.status(400).json({
                                        msg: 'there was and error in the query',
                                    })
                                }
                            }
                        })
                    }
                }else{
                    return res.status(404).json({
                        msg: `can't logged in, user eliminated`
                    });
                }

            }else{

                return res.status(404).json({
                    msg: `user with email ${email} not found`
                });

            }
        }
    })
}

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;
    const pg = await db;
    const sql = 'SELECT * FROM USERS WHERE email = $1 and estado = $2';
    const sql2 = 'INSERT INTO USERS(first_name, email, pas, estado, fecha, tokens) values ($1,$2,$3,$4,$5,$6)';

    if(!id_token){
        res.json({
            msg: 'token no enviado'
        })
    }
    try{
        
        const {nombre, img, correo} = await googleVerify(id_token);
        
        pg.query(sql, [ correo, true], async (err, result) => {
            if(err){
                return res.status(500).json({
                    code: err.code, 
                    name: err.name, 
                    hint: err.hint,
                    detail: err.detail,
                    where: err.where,
                    file: err.file
                })
            }else{
                if(result.rowCount === 1){
                    return res.status(200).json({
                        msg: 'Todo bien!',
                        id_token,
                        correo
                    })            
                }else{

                    try{

                        const token = await generarJWt();
                        const yy = new Date().getFullYear();
                        const mm = new Date().getMonth() +1 ;
                        const dd = new Date().getDate();
                        const salt = bcryptjs.genSaltSync();
                        const password = bcryptjs.hashSync('password', salt);

                        if((nombre.length >= 2) && (token.length >= 10 )){
                            pg.query(sql2, [nombre, correo, password, true, (yy+"/"+mm+"/"+dd),token], (err, result) => {
                                
                                if(err){
                                    return res.status(500).json({
                                        code: err.code, 
                                        name: err.name, 
                                        hint: err.hint,
                                        detail: err.detail,
                                        where: err.where,
                                        file: err.file                
                                    });
                                }else{
                                    if(result.rowCount === 1){
                                       
                                        return res.status(200).json({
                                            msg: 'everything well',
                                            correo,
                                            id_token,
                                        })
                                    }else{
                                        return res.status(400).json({
                                            msg: 'there was an error during the registration'
                                        })
                                    }
                                }

                            });
                        }else{
                            return res.status(500).json({
                                msg: 'There was inter error sorry , we working in that'
                            });
                        }

                    }catch(err){
                        console.log(err);
                        return res.status(500).json({
                            msg: 'there was an error , talk to the administrator'
                        })
                    }

                    // return res.status(404).json({
                    //     msg: 'user not found or eliminated'
                    // })
                }
            }
        });

        

    }catch(err){
        res.status(400).json({
             ok: false,
             msg: 'El token no se pudo verificar '
        })
    }
}

module.exports = {
    login, 
    googleSignIn,
}
