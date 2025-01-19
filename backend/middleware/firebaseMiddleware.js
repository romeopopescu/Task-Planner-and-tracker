const admin = require('firebase-admin');

const verifyFirebaseToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer', '');

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        //firebase method
        const decodedUser = await admin.auth().verifyIdToken(token);

        req.User = decodedUser;

        next();
    }catch (error) {
        return res.status(401).json({ error: 'invalid token'});
    }
};

module.exports = verifyFirebaseToken;