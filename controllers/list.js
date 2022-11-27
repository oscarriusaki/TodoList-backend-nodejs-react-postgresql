const { response } = require("express");
const db = require("../database/config");

const getLists = async (req, res = response) => {

    const pg = await db;
    const sql = 'SELECT * FROM LIST WHERE estado = $1 order by id_list desc';
    
    pg.query( sql, [ true], ( err, result) => {
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
            if(result.rows.length > 0){ 
                return res.status(200).json(
                    result.rows,
                )
            }else{
                return res.status(404).json({
                    msg: 'no list found'
                })
            }
        }
    })
}

const getList = async (req, res = response) => {
    
    const pg = await db;
    const { id} = req.params;
    const sql = 'SELECT * FROM LIST WHERE id_list = $1 and estado = $2';
    pg.query(sql, [ id, true], (err, result) => {

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
                return res.status(200).json(result.rows);
            }else{
                return res.status(404).json({
                    msg: 'list not found o eliminated'
                })
            }

        }

    })


}
const postList = async (req, res = response) => {
    const pg = await db;
    const user = req.user;
    const { ...resto } = req.body;
    const sql = 'INSERT INTO LIST (id_user, title, description, fecha, estado, done) values ($1,$2,$3,$4,$5,$6)';
    const yy = new Date().getFullYear();
    const mm = new Date().getMonth() + 1;
    const dd = new Date().getDate();

    pg.query(sql, [ user.id_user, resto.title, resto.description, (yy+'/'+mm+'/'+dd), true, false], (err, result) => {
        
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
                    msg: 'successfully registered'
                })

            }else{
                return res.status(400).json({
                    msg: 'there was an error during the registration'
                })
            }
        }

    });

}
const putList = async (req, res = response) => {
    
    const pg = await db;
    
    const { id } = req.params;
    const { ... rest } = req.body;
    const sql = 'UPDATE list SET title = $1 , description = $2 WHERE id_list = $3 AND estado = $4';

    pg.query(sql, [ rest.title, rest.description, id, true], (err, result) => {
        
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
                    msg: 'update successfully'
                })
            }else{
                return res.status(400).json({
                    msg: `the list dosen't exist or is eliminated`
                })
            }
        }
    });
}
const deleteList = async (req, res = response) => {
    
    const pg = await db;
    const { id } = req.params;

    const sql = 'UPDATE LIST SET estado = $1 WHERE id_list = $2 and estado = $3';
    
    pg.query(sql, [ false, id, true], ( err, result) => {

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
                console.log(result);
                return res.status(400).json({
                    msg: `the list dosen't exist or is eliminated`,
                })
            }
        }
    })
}

module.exports = {
    getLists,
    getList,
    postList,
    putList,
    deleteList,
}
