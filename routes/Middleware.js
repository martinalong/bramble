const CORS = async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, Authorization');
    res.header('Set-Cookie', 'id=a3fWa; Max-Age=2592000');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    next();
  };

const authMiddleware = (req, res, next) => {
    console.log(req.sessionID)
    console.log(req.session.user)
    console.log(req.session.type)
    if (req.session.user) {
        return res.status(200).send({
            id: req.session.type,
        });
        return next();
    } else {
        return res.status(403).send({
            error: req.session
            // error: 'Not authenticated',
        });
    }
};

export default {
    authMiddleware,
    CORS
}