import 'dotenv/config.js'
import { v4 as uuidv4 } from 'uuid';
import express from 'express'
import knex from '../index.js'
import middleware from './Middleware.js'
 
const router = express.Router();
 
router.get('/', (req, res) => {
  res.send("YOUR EXPRESS BACKEND IS CONNECTED TO REACT on page /schedule");
});

/* PATIENT OR PROVIDER CALLS */

router.post('/create-appointment', middleware.authMiddleware, async (req, res) => {
  //if there's another appointment with that doctor overlapping, say that spot is no longer available
  let provider
  let patient
  if (req.session.type === "provider") {
    provider = req.session.user
    patient = req.body.patient
  } else {
    provider = req.body.provider
    patient = req.session.user
  }
  try {
    await knex("appointments").insert({
      provider: req.session.user,
      patient: req.body.patient,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      appt_type: req.body.appt_type,
    })
    res.sendStatus(200)
  } catch (err) {
    res.status(400).send({error: "We're having trouble making that appointment right now"})
  }
})

//create a new appointment
router.post('/appt', middleware.authMiddleware, async (req, res) => {
  let appt = req.body
  if (req.session.type === "provider") {
    appt.provider = req.session.user
  } else if (req.session.type === "patient") {
    appt.patient = req.session.user
  }
  try { 
    await knex("appointments").insert(appt)
    return res.sendStatus(200)
  } catch (err) {
      console.log(err)
      return res.status(400).send({error: "Please make sure all fields are filled out correctly"})
  };
})

//update an existing appointment
router.put('/appt', middleware.authMiddleware, async (req, res) => {
  let appt = req.body
  let appt_id = appt.id
  delete appt["id"]
  try {
    if (req.session.type === "provider") {
      await knex('appointments')
      .where('id', appt_id)
      .andWhere('provider', req.session.user)
      .update(appt)
    } else if (req.session.type === "patient") {
      await knex('appointments')
      .where('id', appt_id)
      .andWhere('patient', req.session.user)
      .update(appt)
    }
    return res.sendStatus(200)
  } catch (err) {
    console.log(err)
    return res.status(400).send({error: "Please make sure all fields are filled out correctly"})
  }
})

//delete appointment by id
router.delete('/appt', middleware.authMiddleware, async (req, res) => {
  let appt = req.body
  let appt_id = appt.id
  delete appt["id"]
  try {
    if (req.session.type === "provider") {
      await knex('appointments')
      .where('id', appt_id)
      .andWhere('provider', req.session.user)
      .del()
    } else if (req.session.type === "patient") {
      await knex('appointments')
      .where('id', appt_id)
      .andWhere('patient', req.session.user)
      .del()
    }
    return res.sendStatus(200)
  } catch (err) {
    console.log(err)
    return res.status(400).send({error: "Please make sure all fields are filled out correctly"})
  }
})

/* PATIENT CALLS */

router.get('/patient/appt-times', [middleware.authMiddleware, middleware.patientMiddleware], async (req, res) => {
  try {
    let appts = await knex('appointments')
      .where('patient', req.session.user)
      .join('appttypes', 'appointments.appt_type', '=', 'appttypes.id')
      .join('provider', 'appointments.provider', '=', 'provider.id')
      .join('practice', 'provider.practice', '=', 'practice.id')
      .select('provider.first_name', 'provider.last_name', 'provider.id', 'practice.id', 'practice.name', 'appttypes.name', 'appointments.start_time', 'appointments.end_time')
    return res.status(200).send({
      appts
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(404)
  }
})

/* PROVIDER CALLS */

// knex('table_name')
//   .update('column_name', value)
//   .whereRaw('? = any (??)', ['some_string', 'array_type_column'])

router.post('/provider/appt-times', [middleware.authMiddleware, middleware.providerMiddleware], async (req, res) => {
  try {
    // let breaks = await knex('appointments')
    //   .where('provider', req.session.user)
    //   .andWhere('start_time', '>=', req.body.start_date)
    //   .andWhere('start_time', '<=', req.body.end_date)
    //   .whereNull('patient')
    //   .select('appointments.start_time', 'appointments.end_time')
    let appts = await knex('appointments')
      .where('appointments.provider', req.session.user)
      .andWhere('appointments.start_time', '>=', req.body.start_date)
      .andWhere('appointments.start_time', '<=', req.body.end_date)
      .whereNotNull('patient')
      .join('patient', 'appointments.patient', '=', 'patient.id')
      .join('appttypes', 'appointments.appt_type', '=', 'appttypes.id')
      .select('patient.first_name', 'patient.last_name', knex.ref('patient.id').as('patient_id'), 'appttypes.name', 'appttypes.len', knex.ref('appttypes.id').as('appt_id'), 'appttypes.color', 'appointments.id', 'appointments.start_time', 'appointments.end_time', 'appointments.notes')
    return res.status(200).send({appts})
  } catch (err) {
    console.log(err)
    res.sendStatus(422)
  }
})

//get all the appointment types for the provider
router.get("/provider/appt-types", [middleware.authMiddleware, middleware.providerMiddleware], async (req, res) => {
  try {
    let apptTypes = await knex('appttypes')
      .where('provider', req.session.user)
      .select('color', 'name', 'id', 'len')
    return res.status(200).send({apptTypes})
  } catch (err) {
    console.log(err)
    res.sendStatus(422)
  }
})

//search for a patient by name (only patients of the provider)
router.get("/provider/patient/:name", [middleware.authMiddleware, middleware.providerMiddleware], async (req, res) => {
  let name = req.params.name.split(" ")
  try {
    let patients = await knex('patient')
      .whereRaw('? = any (??)', [60, 'providers'])
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

router.post('/set-schedule', [middleware.authMiddleware, middleware.providerMiddleware], async (req, res) => {
  let practiceId = await knex("provider").where("id", req.session.user).first("practice")
  practiceId = Number(practiceId.practice)
  //if no practiceId, return error ask to onboard first
  knex.transaction(async (trx) => {
    try { 
      for (let range of req.body.timeSlots) {
        await trx("availability").insert({
          provider: req.session.user,
          weekdays: range[0],
          start_time: range[1],
          end_time: range[2]
        })
      }
      for (let num of req.body.appointments) {
        await trx("appttypes").insert({
          provider: req.session.user,
          practice: practiceId,
          name: req.body["apptType" + num],
          descript: req.body["apptDescript" + num],
          len: (req.body["hrs" + num] || "0") + "H" + (req.body["mins" + num] || "0") + "M",
          buffer: (req.body["buffer"] || "0") + "M",
          minimize_gaps: req.body["minimizeGaps"]
        })
      }
      return res.sendStatus(200)
    } catch (err) {
        console.log(err)
        return res.status(400).send({error: "Please make sure all fields are filled out correctly"})
    };
  })
})
 
export default router;