const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, getUser, postUsers, putUsers, deleteUsers } = require('../controllers/user');
const { validar } = require('../middlewares/validar');
const { validarJWT } = require('../middlewares/validarJWT');

const router = Router();

router.get('/', getUsers);
router.get('/:id',[
    check('id', "the id isen't valid").isNumeric(),
    validar
], getUser);
router.post('/',[
    check('first_name', 'The name is required').not().isEmpty(),
    check('email', "The email is invalid").isEmail(),
    check('pas', "The password is invalid and must contain more than 5 letters").isLength({min: 5}),
    validar
], postUsers);
router.put('/',[
    validarJWT,
    check('first_name', 'The name is required').not().isEmpty(),
    check('email', 'The email is invalid').isEmail(),
    check('pas', "the password is invalid and must contain more than 5 letters").isLength({min: 5}),
    validar
], putUsers);
router.delete('/',[
    validarJWT,
    validar
], deleteUsers);

module.exports = router;
