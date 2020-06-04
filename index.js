import cors from 'cors';
import routes from './routes/index.js' 
import 'dotenv/config.js'
import bodyParser from 'body-parser'
import express from 'express'
import Knex from 'knex'
import session from 'express-session'
import knexSession from 'connect-session-knex'

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

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: store,
  saveUninitialized: true,
  resave: false,
  cookie: {
    httpOnly: true,
    maxAge: Number(process.env.SESSION_LIFETIME),
    sameSite: true,
    secure: process.env.NODE_ENV === "production",
  }
}))

app.use(cors());

app.use(bodyParser.urlencoded({
  extended: false,
}))
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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