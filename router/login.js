const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/login');
const { validar } = require('../middlewares/validar');

const router = Router();

router.post('/',[
    check('email', 'The email is invalid').isEmail(),
    // check('password', ''),
    validar
], login);

router.post('/google', [
    check('id_token', 'google token is required').not().isEmpty(),
    validar
], googleSignIn)

module.exports = router;
