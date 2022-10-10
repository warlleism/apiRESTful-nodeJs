const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json')


//autenticação

function generateToken(...params) {
    return jwt.sign({ params }, authConfig.secret, {
        expiresIn: 86400
    })
}

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password')

    if (!user)
        return res.status(400).send({ error: 'User not found' })

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password' })

    user.password = undefined;

    res.send({ user, token: generateToken({ id: user._id }) })
});

//registro
router.post('/register', async (req, res) => {
    const { email } = req.body;
    try {

        if (await User.findOne({ email })) {
            return res.status(400).send({ erro: 'user already exists' })
        }
        const user = await User.create(req.body);
        user.password = undefined;
        return res.send({ user, token: generateToken({ id: user._id }) });

    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
})

router.get('/user', async (req, res) => {
    try {
        const user = await User.find();
        return res.send(user);
    } catch (err) {
        return res.status(400).send({ error: 'Get data failed' });
    }
})

router.get('/userId/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const user = await User.findOne({ email });
        return res.send(user);
    } catch (err) {
        return res.status(400).send({ error: 'Get user data failed' });
    }
})

//funciona com id / tentativa com email falhou
router.put('/update/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate({ _id: req.params.id }, req.body, { upsert: true })
            .then(() => {
                res.send('Update has sucess')
            }).catch((err) => {
                res.status(400).send({ error: 'update failed' })
            });
        return res.send(user);
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
})

router.delete('/delete/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const user = await User.deleteOne({ email });
        return res.send(user);
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
})


module.exports = router