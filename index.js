import routes from './routes/index.js' 
import 'dotenv/config.js'
import bodyParser from 'body-parser'
import express from 'express'
import Knex from 'knex'
import session from 'express-session'
import knexSession from 'connect-session-knex'
import middleware from './routes/Middleware.js'

/*** APP ***/ 

const app = express();

const knex = Knex({
    client: "pg",
    connection: {
      host: "127.0.0.1",
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_NAME
    }
  });

const KnexSessionStore = knexSession(session)
const store = new KnexSessionStore({
  knex: knex,
  tablename: "sessions" // optional. Defaults to 'sessions'
});

app.use(bodyParser.urlencoded({
    extended: false,
}))
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(middleware.CORS);

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: store,
  saveUninitialized: false, //whether it saves the session at all if nothing is changed
  resave: false, //whether it saves every request even if nothing has changed (wastes space)
  cookie: {
    httpOnly: false, //client cannot see cookie
    maxAge: 86400000, //Number(process.env.SESSION_LIFETIME),
    secure: false, //process.env.NODE_ENV === "production"
    sameSite: true //true = only accept cookie if coming from same domain
  }
}))

app.use('/session', routes.session);
app.use('/user', routes.user);
app.use('/schedule', routes.schedule);
app.use('/message', routes.message);

app.listen(process.env.PORT, (err) => {
    if (err) {
      throw err;
    }
    console.log(`App listening on: http://localhost:${process.env.PORT}`);
  });

app.get('/', (req, res) => {
  res.send("YOUR EXPRESS BACKEND IS CONNECTED TO REACT");
});

export default knex