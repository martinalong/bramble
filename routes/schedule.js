import 'dotenv/config.js'
import { v4 as uuidv4 } from 'uuid';
import express from 'express'
import knex from '../index.js'
import middleware from './Middleware.js'
import moment from 'moment'
 
const router = express.Router();
 
router.get('/', (req, res) => {
  res.send("YOUR EXPRESS BACKEND IS CONNECTED TO REACT on page /schedule");
});

/* PATIENT OR PROVIDER CALLS */

//create a new appointment
router.post('/appt', middleware.authMiddleware, async (req, res) => {
  //if there's another appointment with that doctor overlapping, say that spot is no longer available
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
    appt.last_updated = moment()
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
    let past = await knex('appointments')
      .where('patient', req.session.user)
      .andWhere('appointments.start_time', '<', moment())
      .join('appttypes', 'appointments.appt_type', '=', 'appttypes.id')
      .join('provider', 'appointments.provider', '=', 'provider.id')
      .join('practice', 'provider.practice', '=', 'practice.id')
      .select('provider.first_name', 'provider.last_name', knex.ref('provider.id').as('provider_id'), knex.ref('practice.id').as('practice_id'), knex.ref('practice.name').as('practice'), knex.ref('appttypes.name').as('appttype'), 'appointments.start_time')
    let upcoming = await knex('appointments')
      .where('patient', req.session.user)
      .andWhere('appointments.start_time', '>=', moment())
      .join('appttypes', 'appointments.appt_type', '=', 'appttypes.id')
      .join('provider', 'appointments.provider', '=', 'provider.id')
      .join('practice', 'provider.practice', '=', 'practice.id')
      .select('provider.first_name', 'provider.last_name', knex.ref('provider.id').as('provider_id'), knex.ref('practice.id').as('practice_id'), knex.ref('practice.name').as('practice'), knex.ref('appttypes.name').as('appttype'), 'appointments.start_time')
    return res.status(200).send({past, upcoming})
  } catch (err) {
    console.log(err)
    res.sendStatus(404)
  }
})

/* PROVIDER CALLS */

router.post('/provider/appt-times', [middleware.authMiddleware, middleware.providerMiddleware], async (req, res) => {
  let changed = false
  try {
    if (req.body.check) {
      let updateTimes = await knex('appointments')
        .where('appointments.provider', req.session.user)
        .andWhere('appointments.start_time', '>=', req.body.start_date)
        .andWhere('appointments.start_time', '<=', req.body.end_date)
        .whereNotNull('patient')
        .select('last_updated')
      if (updateTimes.length !== req.body.len) {
        changed = true
      } else {
        for (let row of updateTimes) {
          if (moment(row.last_updated).isAfter(moment(req.body.timeRetrieved))) {
            changed = true
            break
          }
        }
      }
      if (!changed) {
        return res.sendStatus(200)
      }
    }
    let timeRetrieved = moment()
    let appts = await knex('appointments')
      .where('appointments.provider', req.session.user)
      .andWhere('appointments.start_time', '>=', req.body.start_date)
      .andWhere('appointments.start_time', '<=', req.body.end_date)
      .whereNotNull('patient')
      .join('patient', 'appointments.patient', '=', 'patient.id')
      .join('appttypes', 'appointments.appt_type', '=', 'appttypes.id')
      .select('patient.first_name', 'patient.last_name', knex.ref('patient.id').as('patient_id'), 'appttypes.name', 'appttypes.len', knex.ref('appttypes.id').as('appt_id'), 'appttypes.color', 'appointments.id', 'appointments.start_time', 'appointments.end_time', 'appointments.notes')
    return res.status(200).send({appts, timeRetrieved})
  } catch (err) {
    console.log(err)
    res.sendStatus(422)
  }
})

   // let breaks = await knex('appointments')
    //   .where('provider', req.session.user)
    //   .andWhere('start_time', '>=', req.body.start_date)
    //   .andWhere('start_time', '<=', req.body.end_date)
    //   .whereNull('patient')
    //   .select('appointments.start_time', 'appointments.end_time')

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