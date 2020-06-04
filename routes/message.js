import { v4 as uuidv4 } from 'uuid';
import express from 'express'
import knex from '../index.js'
 
const router = express.Router();

var sessionChecker = (req, res, next) => {
  if (req.session && req.session.user) {
    next()
  } else {
    return res.redirect('/login')
  }    
};

var doctorChecker = (req, res, next) => {
  if (req.session && req.session.user && req.session.type === "provider") {
    next()
  } else {
    return res.status(401).send("Access denied")
  }    
};

var patientChecker = (req, res, next) => {
  if (req.session && req.session.user && req.session.type === "patient") {
    next()
  } else {
    return res.status(401).send("Access denied")
  }    
};
 
router.get('/', (req, res) => {
  return res.send("YOUR EXPRESS BACKEND IS CONNECTED TO REACT on page /message");
});

router.get('/:userId', (req, res) => {
  return res.send("Got message from userId")
  //return res.send(Object.values(req.context.models.messages));
});
 
router.get('/:messageId', (req, res) => {
  return res.send("Got message from messageId")
  //return res.send(req.context.models.messages[req.params.messageId]);
});
 
router.post('/', (req, res) => {
  const id = uuidv4();
  const message = {
    id,
    text: req.body.text,
    userId: req.session.userId,
  };
 
  //req.context.models.messages[id] = message;
 
  return res.send(message);
});
 
router.delete('/:messageId', (req, res) => {
  const {
    [req.params.messageId]: message,
    ...otherMessages
  } = req.context.models.messages;
 
  req.context.models.messages = otherMessages;
 
  return res.send(message);
});
 
export default router;