const { Router } = require('express');

const router = Router();

router.get('*',(req, res)=>{
    // console.log(__dirname.substring( 0, __dirname.search('router'))+'/public/err.html');
    res.sendFile(__dirname.substring( 0, __dirname.search('router'))+'/public/404.html');
})

router.post('*', (req, res) => {
    return res.status(404).json({
        msg: 'POST: la ruta no es correcta, revisalo'
    })
})
router.put('*', (req, res ) => {
    return res.status(404).json({
        msg: 'PUT: la ruta no es correcta, revisalo'
    })
})
router.delete('*', (req, res) => {
    return res.status(404).json({
        msg: 'DELETE: La ruta no es correcta, revisalo'
    })
})

module.exports = router
