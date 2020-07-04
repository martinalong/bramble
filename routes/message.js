import 'dotenv/config.js'
import express from 'express'
import knex from '../index.js'
import middleware from './Middleware.js'
import moment from 'moment'
 
const router = express.Router();
 
router.get('/', (req, res) => {
  res.send("YOUR EXPRESS BACKEND IS CONNECTED TO REACT on page /message");
});

/* PATIENT OR PROVIDER CALLS */

router.post('/send/:id', middleware.authMiddleware, async (req, res) => {
  try {
    await knex('message')
      .insert({
        sent_by: req.session.user,
        sent_to: req.params.id,
        message: req.body.message
      })
    return res.sendStatus(200)
  } catch (err) {
    return res.sendStatus(422)
  }
})

//get the messages from the chat between the user and another user
router.get('/get-chat/:id', middleware.authMiddleware, async (req, res) => {
  try {
    let chat = await knex('message')
      .where('sent_by', req.session.user)
      .andWhere('sent_to', req.params.id)
      .orWhere('sent_to', req.session.user)
      .andWhere('sent_by', req.params.id)
      .orderBy('time_sent')
      .select('message', 'time_sent', 'sent_by', 'sent_to', 'id')
    return res.status(200).send({chat: chat, id: req.session.user})
  } catch (err) {
    return res.sendStatus(422)
  }
})

//get order of chats
router.get('/chat-order', middleware.authMiddleware, async (req, res) => {
  try {
    let details
    if (req.session.type === "patient") {
      let people = await knex('patient')
        .where('id', req.session.user)
        .first('providers')
      people = people.providers
      details = await knex('provider')
        .whereIn('provider.id', people)
        .join('practice', 'provider.practice', '=', 'practice.id')
        .select('provider.prefix', 'provider.first_name', 'provider.last_name', 'provider.suffix', 'provider.id', 'practice.name')
    } else {
      let people = await knex('patient')
        .whereRaw('? = any (??)', [req.session.user, 'providers'])
        .select('id')
      people = people.map(p => p.id)
      details = await knex('patient')
        .whereIn('id', people)
        .select('first_name', 'last_name', 'id')
    }
    let sent = await knex('message')
      .where('sent_by', req.session.user)
      .orderByRaw('sent_to, time_sent DESC')
      .distinctOn('sent_to')
      .select('time_sent', 'sent_to', 'message', 'seen')
    let received = await knex('message')
      .where('sent_to', req.session.user)
      .orderByRaw('sent_by, time_sent DESC')
      .distinctOn('sent_by')
      .select('time_sent', 'sent_by', 'message', 'seen')
    //maybe rearchitect database to save a "convo_id" for each convo? then can easily check

    // console.log(sent)
    // console.log(received)
    // for (let p of people) {
    //   let ts = await knex('message')
    //     .where('sent_by', p)
    //     .andWhere('sent_to', req.session.user)
    //     .orWhere('sent_to', p)
    //     .andWhere('sent_by', req.session.user)
    //     .max('time_sent')
    //   ordering.push([ts[0].max, p])
    // }
    // for (let o of ordering) {
    //   if (o[0]) {
    //     let s = await knex('message')
    //       .where('sent_to', req.session.user)
    //       .andWhere('sent_by', o[1])
    //       .select('seen', 'time_sent')
    //     if (s.length === 0) {
    //       o.push(true)
    //     } else {
    //       o.push(s[0].seen)
    //     }
    //   } 
    // }
    
    let ordering = {}
    for (let d of details) {
      ordering[d.id] = {
        details: d
      }
    }
    for (let c of sent) {
      ordering[c.sent_to].message = c
    } 
    for (let c of received) { //if there's a conflict, compare times. the later time stays
      if (ordering[c.sent_by].message) {
        let otherT = moment(ordering[c.sent_by].message.time_sent)
        let thisT = moment(c.time_sent)
        if (thisT.isAfter(otherT)) {
          ordering[c.sent_by].message = c
        }
      }
    }
    return res.status(200).send({
      order: ordering
    })
  }
  catch (err) {
    console.log(err)
    return res.sendStatus(422)
  }
})

//mark a chat as seen
router.put('/mark-seen/:id', middleware.authMiddleware, async (req, res) => {
  try {
    console.log(req.params.id)
    await knex('message')
      .where('sent_to', req.session.user)
      .andWhere('sent_by', req.params.id)
      .update('seen', true)
    return res.sendStatus(200)
  } catch (err) {
    console.log(err)
    return res.sendStatus(422)
  }
})

router.delete('/unsend')

//get messages for a given user id
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
 
export default router;