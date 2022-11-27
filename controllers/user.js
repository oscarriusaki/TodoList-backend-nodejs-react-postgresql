const { response } = require("express");
const db = require("../database/config");
const bcryptjs = require('bcryptjs');
const { generarJWt } = require("../helpers/GenerarJWT");

const getUsers = async (req, res = response) =>{
    
    const pg = await db;
    const sql = 'SELECT * FROM users where estado = $1 order by id_user desc';

    pg.query(sql, [true], async (err, result) => {

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
            return res.json({
                msg: result.rows
            });
        }

    })
}

const getUser = async (req, res = response) =>{

    const pg = await db;
    const { id } = req.params;
    const sql = 'SELECT * FROM users WHERE estado = $1 and id_user = $2';

    pg.query(sql, [ true, id] , (err, result) => {

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
                return res.status(200).json(
                    result.rows
                )
            }else{
                return res.status(404).json({
                    msg: `Error no se encontro al usuario con el id ${id}`
                })
            }
        }

    })

}
const postUsers = async(req, res = response) =>{
    const pg = await db;
    const { id_user, ... resto} = req.body;

    const yy = new Date().getFullYear();
    const mm = new Date().getMonth() +1;
    const dd = new Date().getDate();

    const sql = 'SELECT * FROM USERS WHERE email= $1'
    const sql2 = 'INSERT INTO USERS (first_name, email, pas, estado, fecha, tokens) values ($1,$2,$3,$4,$5,$6)';

    pg.query(sql, [ resto.email] , async (err, result) => {
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
            
            if(result.rowCount === 0){

                try{

                    const salt = bcryptjs.genSaltSync();
                    resto.pas = bcryptjs.hashSync(resto.pas, salt);

                    const token = await generarJWt(resto.email);
                    
                    pg.query(sql2, [ resto.first_name, resto.email, resto.pas, true, (yy+"/"+mm+"/"+dd), token], (err, result) => {
                    
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
                                msg: 'succefully registered'
                            })
                        }else{
                            return res.status(400).json({
                                msg: "there was a err durin the registration"
                            })
                        }
                    }
                    })
                }catch(err){
                    
                    return res.status(400).json({
                        msg: "there's an error, talk to the administration"
                    })

                }

            }else{
                return res.status(400).json({
                    msg: `The email ${resto.email} already exist`
                })
            }
        }
    })
}
const putUsers = async (req, res = response) =>{
    // ojo  AQUI FALTA MANDAR TOKEN CON ESO TENEMOS QUE ACTUALIZARLO
    const pg = await db;
    const { id_user, ...resto} = req.body;

    const userEmailLogged = req.user.email;

    const sql = 'SELECT * FROM USERS WHERE email = $1';
    const sql2 = 'UPDATE USERS SET first_name = $1, email = $2, pas = $3, fecha = $4 WHERE email = $5 and estado = $6';

    pg.query(sql, [ resto.email], (err, result) =>{

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
                
                if(result.rows[0].email === userEmailLogged){
                    
                    if(result.rows[0].estado === true ){
                        
                        try{
                            
                            const yy = new Date().getFullYear();
                            const mm = new Date().getMonth()+1;
                            const dd = new Date().getDate();
                            
                            const salt = bcryptjs.genSaltSync();
                            resto.pas = bcryptjs.hashSync(resto.pas, salt);
                            
                            pg.query(sql2, [ resto.first_name, resto.email, resto.pas, (yy+"/"+mm+"/"+dd) , userEmailLogged, true], (err, result) => {
                                
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
                                            msg: 'succesfully updated'
                                        })
                                    }else{
                                        return res.status(400).json({
                                            msg: "there's an error during the updating"
                                        })
                                    }
                                }
                            })
                            
                        }catch(err){
                            return res.status(500).json({
                                msg: "there's an error, talk to the administration"
                            })
                        }
                        
                    }else{
                        
                        return res.status(400).json({
                            msg: 'No updated the user is eliminated'
                        })
                        
                    }
                }else{
                    return res.status(400).json({
                        msg: 'the email already exist'
                    })
                }
                    
            }else{
                return res.status(404).json({
                    msg: `The email ${resto.email} doens't exist`
                })
            }
        }
    })
}
const deleteUsers = async (req, res = response) =>{
    // USAR TOKEN PARA ELIMINAR 
    const pg = await db;
    const user = req.user;
    
    // traer el correo del usuario arreglar esto conel token
    const sql = 'SELECT * FROM USERS WHERE email = $1 and estado = $2';
    const sql2 = 'UPDATE USERS SET estado = $1 WHERE email = $2 and estado = $3';

    pg.query(sql, [ user.email, true], (err, result) => {
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
                pg.query(sql2, [false, user.email, true], (err, result) => {
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
                                msg: 'successfully eliminated'
                            })
                        }else{
                            return res.status(400).json({
                                msg: 'there was an error during the elimination'
                            })
                        }
                    }
                });
            }else{
                return res.status(404).json({
                    msg: `didn't find the user with email ${user.email} or eliminated`
                })
            }
        }
    })

}

module.exports = {
    getUsers,
    getUser,
    postUsers,
    putUsers,
    deleteUsers,
}