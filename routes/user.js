import express from 'express'
import knex from '../index.js'
 
const router = express.Router();

router.get('/', (req, res) => {
  res.send("YOUR EXPRESS BACKEND IS CONNECTED TO REACT on page /user");
});
 
router.get('/', (req, res) => {
  return res.send(Object.values(req.context.models.users));
});
 
router.get('/:userId', (req, res) => {
  return res.send(req.context.models.users[req.params.userId]);
});

router.post('/onboard', (req, res) => {
  //set session.type as well
  //and set type in login as well as setting info in patients/providers
});
 
export default router;