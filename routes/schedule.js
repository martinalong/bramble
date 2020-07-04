import 'dotenv/config.js'
import express from 'express'
import knex from '../index.js'
import middleware from './Middleware.js'
import moment from 'moment'
 
const router = express.Router();
 
router.get('/', (req, res) => {
  res.send("YOUR EXPRESS BACKEND IS CONNECTED TO REACT on page /schedule");
});

/* PATIENT OR PROVIDER CALLS */

//get all providers who provide that appointment type
router.get('/appt-providers/:appttype', middleware.authMiddleware, async (req, res) => {
  try {
    let providers = await knex('provider')
      .whereRaw('? = any (??)', [req.params.appttype, 'appttypes'])
      .select('id', 'first_name', 'last_name', 'buffer', 'minimize_gaps', 'image', 'prefix', 'suffix')
    return res.status(200).send({providers})
  } catch (err) {
    console.log(err)
    return res.sendStatus(422)
  }
})

//get the availability for a provider on a given day (moment)
let getAvail = async(id, date) => {
  let weekday = moment(date).day()
  try {
    let avail = await knex('availability')
      .where('provider', id)
      .whereRaw('? = any (??)', [weekday, 'weekdays'])
      .select('start_time', 'end_time')
    return avail
  } catch (err) {
    console.log(err)
    return
  }
}

//get the taken appointment times for a provider on a given day (moment)
let getAppts = async(id, day) => {
  try {
    let appts = await knex('appointments')
      .where('provider', id)
      .andWhere('start_time', '>=', moment(day).hour(0).minute(0).second(0))
      .andWhere('start_time', '<', moment(day).hour(24).minute(0).second(0))
      .select('start_time', 'end_time')
    return appts
  } catch (err) {
    console.log(err)
    return
  }
}

//provider id, day, appt_id, + gcd
//get availability for a provider for a given day
router.post('/appt-avail', middleware.authMiddleware, async (req, res) => {
  //turn len into minutes
  //remove buffer and minimize gaps
  //offer appointments in __ minute intervals. recommend you select something appropriate to your appt lengths
  //offer a suggested number, but allow them to change it
  //if you have 30 minute and 1 hr appts, suggest 30 min offer
  //if you have 20 and 40 minute, suggest 30 min offer
  //add in "minimize gaps" handling
  let obj = {}
  try {
    let len = await knex("appttypes")
      .where('id', req.body.type_id)
      .first('len')
    len = len.len
    console.log(len.hours)
    for (let provider of req.body.providers) {
      let avail = await getAvail(provider.id, req.body.day)
      let appts = await getAppts(provider.id, req.body.day)
      let free = []
      let busy = []
      for (let segment of avail) {
        let start = moment(req.body.day).hours(segment.start_time.substring(0,2)).minutes(segment.start_time.substring(3,5))
        let end = moment(req.body.day).hours(segment.end_time.substring(0,2)).minutes(segment.end_time.substring(3,5))
        free.push([start, end])
      }
      for (let segment of appts) {
        busy.push([moment(segment.start_time), moment(segment.end_time)])
      }
      free.sort((a, b) => {return a[0].isBefore(b[0])})
      busy.sort((a, b) => {return a[0].isBefore(b[0])})
      let times = []
      let i = 0
      while (i < busy.length && busy[i][0].isBefore(free[0][0])) {
        i += 1
      }
      for (let j = 0; j < free.length; j++) {
        let start = moment(free[j][0])
        let end = moment(free[j][0]).add(len.hours || 0, "hours").add(len.minutes || 0, "minutes")
        while (end.isSameOrBefore(free[j][1], "minute")) {
          if (i < busy.length && end.isAfter(busy[i][0], "minute")) {
            start = moment(busy[i][1])
            end = moment(busy[i][1]).add(len.hours || 0, "hours").add(len.minues || 0, "minutes")
            i += 1
          } else {
            times.push(moment(start))
            start.add(30, "minutes") //change this to be the gcd of the appts, or some time period they choose
            end.add(30, "minutes")
          }
        }
      }
      if (times) {
        obj[provider.id] = times
      }
    }
    return res.status(200).send({obj, len})
  } catch (err) {
    console.log(err)
    res.sendStatus(422)
  }
})

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
      .select('provider.first_name', 'provider.last_name', knex.ref('provider.id').as('provider_id'), knex.ref('practice.id').as('practice_id'), knex.ref('practice.name').as('practice'), knex.ref('appttypes.name').as('appttype'), 'appointments.start_time', 'appointments.id')
    let upcoming = await knex('appointments')
      .where('patient', req.session.user)
      .andWhere('appointments.start_time', '>=', moment())
      .join('appttypes', 'appointments.appt_type', '=', 'appttypes.id')
      .join('provider', 'appointments.provider', '=', 'provider.id')
      .join('practice', 'provider.practice', '=', 'practice.id')
      .select('provider.first_name', 'provider.last_name', knex.ref('provider.id').as('provider_id'), knex.ref('practice.id').as('practice_id'), knex.ref('practice.name').as('practice'), knex.ref('appttypes.name').as('appttype'), 'appointments.start_time', 'appointments.id')
    return res.status(200).send({past, upcoming})
  } catch (err) {
    console.log(err)
    res.sendStatus(404)
  }
})

/* PROVIDER CALLS */

//get the provider's appointments for a given time period
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

//get all the appointment types for the provider
router.get("/provider/appt-types", [middleware.authMiddleware, middleware.providerMiddleware], async (req, res) => {
  try {
    let typeIds = await knex('provider')
      .where('id', req.session.user)
      .first('appttypes')
    let apptTypes = await knex('appttypes')
      .whereIn('id', typeIds.appttypes)
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