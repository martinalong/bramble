const CORS = async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5001');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, Authorization');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    next();
  };

const authMiddleware = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        return res.status(403).send({
            error: 'Not authenticated',
        });
    }
};

const providerMiddleware = (req, res, next) => {
    if (req.session.type === "provider") {
        next();
    } else {
        return res.status(403).send({
            error: 'You are not signed in as a provider',
        });
    }
};

const patientMiddleware = (req, res, next) => {
    if (req.session.type === "patient") {
        next();
    } else {
        return res.status(403).send({
            error: 'You are not signed in as a patient',
        });
    }
};

export default {
    authMiddleware,
    patientMiddleware,
    providerMiddleware,
    CORS
}