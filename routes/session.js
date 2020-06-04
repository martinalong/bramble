import 'dotenv/config.js'
import express from 'express'
import bcrypt from 'bcrypt'
import knex from '../index.js'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = express.Router();
 
router.get('/', (req, res) => {
    res.send("YOUR EXPRESS BACKEND IS CONNECTED TO REACT on page session");
  });

//rate limit on server and client side as well. express library for the server side one
router.post('/login', (req, res) => {
    const {email, password} = req.body
    if (email && email.length && password && password.length) { 
        knex("login").where("email", email).first("id", "password", "type").then(user => {
            if (!user.id) {
                return res.status(404).send({error: "Those account details don't match our records"})
            } else {
                bcrypt.compare(password, user.password).then(result => {
                    if (result) {
                        req.session.user = user.id
                        req.session.type = user.type
                        req.session.save()
                        return res.status(200).send({type: user.type})
                    }
                    return res.status(401).send({error: "Those account details don't match our records"})
                })
            }
        }).catch((err) => {
            return res.status(500).send({error: "We're currently experiencing issues. Please try again later"})
        })
    } else {
        return res.status(411).send({error: "Incomplete email or password"});
    } 
});

router.post('/register', (req, res) => {
    res.setHeader('content-type', 'application/json');
    const {email, password, type} = req.body
    if (email && email.length && password && password.length && (type === "patient" || type === "provider")) {
        knex("login").where({"email": email}).first("email").then(existingUser => {
            if (existingUser) {
                return res.status(409).send({error: "An account with that email already exists"})
            } else {
                bcrypt.hash(password, 10).then(hash => {
                    knex("login").returning("id").insert({
                        email: email,
                        password: hash,
                        type: type
                    }).then((id) => {
                        req.session.user = id[0] //logging in. is this all there is to logging in?
                        req.session.type = type
                        req.session.save()
                        // return res.status(200).send({user: req.session.user, type: req.session.type})
                        return res.sendStatus(200)
                        // const msg = {
                        //     to: email,
                        //     from: 'test@example.com',
                        //     subject: 'Please Verify Your Email to get Started with Bramble',
                        //     text: 'Click on the link below to verify your email',
                        //     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                        //   };
                        // sgMail.send(msg).then(() => {
                        //     return res.sendStatus(200)
                        // }).catch(() => {
                        //     res.status(424).send({error: "The email you've entered appears to be invalid"})
                        //     //drop it from the database
                        // })
                    })
                    .catch((err) => {
                        return res.status(422).send({error: "1 We're currently experiencing issues. Please try again later"})
                    })
                })
            }
        }).catch((err) => {
            return res.status(500).send({error: "2 We're currently experiencing issues. Please try again later"})
        })
    } else {
        return res.status(411).send({error: "Please make sure all fields are filled out correctly"})
    }
});

router.post('/onboard/provider', (req, res) => {
    //later, account for adding existing practice instead of new one
    //add logo later
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
    res.setHeader("Access-Control-Allow-Credentials", true)
    if (!req.session.user) {
        //"It looks like you aren't currently logged in. Please log in to fill out this form"
        return res.status(400).send({error: req.session.user})
    } else if (req.session.type !== "provider") {
        return res.status(400).send({error: "You are currently signed in as a patient. Please sign up at bramble.care/onboarding/patient instead"})
    }
    let insuranceData = []
    Object.entries(req.body).forEach(entry => {
        if (insuranceData != null && entry[0].includes("insuranceProvider")) {
            if (entry[1] === "No Insurance Accepted") {
                insuranceData = null
            } else if (entry[1] !== "DEFAULT") {
                insuranceData.push(entry[1])
            }
        }
    })
    knex("practice").returning("id").insert({
        admins: [],
        name: req.body.practiceName,
        phone: req.body.practicePhoneNumber,
        ext: req.body.practiceExtension,
        address: req.body.practiceAddress,
        address2: req.body.practiceAddress2,
        city: req.body.practiceCity,
        state: req.body.practiceState,
        zip: req.body.practiceZip,
        insurances: insuranceData
    }).then((practice_id) => {
        knex("provider").returning(["practice", "id"]).insert({
            id: req.session.user,
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            specialty: req.body.specialty,
            practicing_since: req.body.practicingSince,
            gender: req.body.sex,
            phone: req.body.phoneNumber,
            ext: req.body.extension,
            practice: practice_id
        }).then((practice_id, provider_id) => {
            knex("practice")
            .where("id", practice_id)
            .update({
                admins: [...admins, provider_id]
            }).catch(() => {return res.status(422).send({error: "1 We're currently experiencing issues. Please try again later"})})
        }).catch(() => {return res.status(422).send({error: "2 We're currently experiencing issues. Please try again later"})})
    }).catch(() => {return res.status(422).send({error: "3 We're currently experiencing issues. Please try again later"})})
});

router.post('/onboard/patient', (req, res) => {
    const {email, password} = req.body
   
});

router.post('/changepw', (req, res) => {
    const {email, oldPassword, newPassword} = req.body
    if (email && email.length && oldPassword && oldPassword.length && newPassword && newPassword.length) { 
        let hash = knex('login').where('email', email).first("password")
        if (!hash) {
            return res.status(404).send({error: "User not found"})
        }
        bcrypt.compare(oldPassword, hash).then(result => {
            if (result) {
                //check validity of new password 
                bcrypt.hash(newPassword, 10).then(hash => {
                    knex('login').insert({
                        email: email,
                        password: hash
                    })
                    res.sendStatus(200)
                }).catch(err => {
                    return res.status(500).send({error: err})
                })
            }
            return res.status(401).send({error: "Incorrect password"})
        }).catch(err => {
            return res.status(500).send({error: err})
        })
    }
    return res.status(401).send({error: "Incomplete email or passwords"});
});

// router.post('/resetrequest', (req, res) => {
//     const {newPassword} = req.body
//     if (name && email && password) {
//         const existingUser = users.find(
//             user => user.email === email
//         )
//         if (existingUser) {
//             return 
//         } else {
//             let user = {
//                 id: uuidv4(), 
//                 name, 
//                 email, 
//                 password
//             }
//             users.push(user)
//             req.session.userId = user.id
//             return res.sendStatus(200)
//         }
//     }
// });

// router.post('/resetpw', (req, res) => {
//     const {newPassword} = req.body
//     if (name && email && password) {
//         const existingUser = users.find(
//             user => user.email === email
//         )
//         if (existingUser) {
//             return 
//         } else {
//             let user = {
//                 id: uuidv4(), 
//                 name, 
//                 email, 
//                 password
//             }
//             users.push(user)
//             req.session.userId = user.id
//             return res.sendStatus(200)
//         }
//     }
// });

router.post('/logout', (req, res) => {
    if (req.session.user) {
        req.session.destroy(() => {
            return res.sendStatus(200)
        }).catch(err => {
            return res.status(500).send({error: "We weren't able to log you out. Please try again later"})
        })
    } else {
        return res.status(400).send({error: "You don't seem to be currently logged in."})
    }
    // res.clearCookie(process.env.SESSION_NAME)
});

export default router;