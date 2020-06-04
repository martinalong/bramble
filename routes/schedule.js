import { v4 as uuidv4 } from 'uuid';
import express from 'express'
import knex from '../index.js'
 
const router = express.Router();
 
router.get('/', (req, res) => {
  res.send("YOUR EXPRESS BACKEND IS CONNECTED TO REACT on page /schedule");
});
 
export default router;