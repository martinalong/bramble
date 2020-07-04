import express from 'express'
import knex from '../index.js'
import middleware from './Middleware.js'
 
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

/* PATIENT OR PROVIDER CALLS */

//search for a practice by name
router.get("/practices/:name", middleware.authMiddleware, async (req, res) => {
  try {
    let practices = await knex('practice')
      .where('name', 'ilike', '%' + req.params.name + '%')
      .select('id', 'name', 'logo')
    return res.status(200).send({practices})
  } catch (err) {
    console.log(err)
    res.sendStatus(422)
  }
})

//get appointment types for a given practice
router.get('/practice/appt-types/:id', middleware.authMiddleware, async (req, res) => {
  try {
    let types = await knex("appttypes")
      .where('practice', req.params.id)
      .select('id', 'name', 'descript')
    let practice = await knex("practice")
      .where('id', req.params.id)
      .first('name')
    return res.status(200).send({types, name: practice.name})
  } catch (err) {
    return res.sendStatus(422)
  }
})

router.get('/practice/details/:id', middleware.authMiddleware, async (req, res) => {
  try {
    let details = await knex("practice")
      .where('id', req.params.id)
      .first('name', 'address', 'address2', 'city', 'state', 'zip', 'insurances', 'phone', 'ext')
    return res.status(200).send({details})
  } catch (err) {
    return res.sendStatus(422)
  }
})

//get the information for a given practice and all its providers
//you need the practice info, the appt types info, the providers info and providers availability info
// router.get("/practice/:id")

/* PATIENT CALLS */

//get all of a patient's providers
router.get("/patient/practices", [middleware.authMiddleware, middleware.patientMiddleware], async (req, res) => {
  try {
    let providers = await knex('patient')
      .where('id', req.session.user)
      .first('providers')
    providers = providers.providers
    let practices = await knex('provider')
      .join('practice', 'provider.practice', '=', 'practice.id')
      .whereIn('provider.id', providers)
      .select('practice.id', 'practice.name', 'practice.logo')
    return res.status(200).send({practices})
  } catch (err) {
    console.log(err)
    return res.sendStatus(422)
  }
})

/* PROVIDER CALLS */

//search for a patient by name (only patients of the provider)
router.get("/provider/patient/:name", [middleware.authMiddleware, middleware.providerMiddleware], async (req, res) => {
  let name = req.params.name.split(" ")
  try {
    let patients = await knex('patient')
      .whereRaw('? = any (??)', [req.session.user, 'providers'])
      .where('first_name', 'ilike', '%' + name[0] + '%')
      .orWhere('last_name', 'ilike', '%' + name[1] + '%')
      .orWhere('first_name', 'ilike', '%' + name[1] + '%')
      .orWhere('last_name', 'ilike', '%' + name[0] + '%')
      .select('id', 'first_name', 'last_name', 'dob')
    return res.status(200).send({patients})
  } catch (err) {
    console.log(err)
    res.sendStatus(422)
  }
})


 
export default router;