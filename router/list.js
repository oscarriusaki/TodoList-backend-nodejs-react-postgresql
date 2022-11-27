
const { Router } = require('express');
const { check } = require('express-validator');
const { getLists, getList, postList, putList, deleteList } = require('../controllers/list');
const { validar } = require('../middlewares/validar');
const { validarJWT } = require('../middlewares/validarJWT');

const router = Router();

router.get('/', getLists);
router.get('/:id', [
    check('id', 'The id is invalid').isNumeric(),
    validar
], getList);
router.post('/', [
    validarJWT,
    check('title', 'The title is required').not().isEmpty(),
    check('description', 'The description es required').not().isEmpty(),
    validar
], postList);
router.put('/:id', [
    check('id', 'The id is invalid').isNumeric(),
    validar
], putList);
router.delete('/:id',[
    check('id').isNumeric(),
    validar
], deleteList);

module.exports = router;
