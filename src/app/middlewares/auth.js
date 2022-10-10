const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).send({ error: 'No token provided' })

    const parts = authHeader.split(' ')

    if (!parts.length === 2)
        return res.status(401).send({ error: 'Token Error' })

    const [scheme, token] = parts;

    //if (!scheme.includes('Bearer')) também funcionaria
    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token malformatted' })

    //verifica se o token bate com o secret
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token invalid' });

        const dataDecoded = decoded.params.map((e) => { return e.id })

        req.userId = dataDecoded[0];

        return next()
    })

}