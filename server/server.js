import compression from 'compression';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
import api from './api';

dotenv.config({silent: true});

const PORT = process.env.PORT || 8102;
const HOST = process.env.VCAP_APP_HOST || "0.0.0.0";

const app = express()
  .use(compression())
  .use(cookieParser())
  .use(morgan('dev'))
  // .use(morgan('tiny'))
  .use(bodyParser.json());

// REST API
app.use('/api', api);

// UI
app.use('/', express.static(path.join(__dirname, '/../dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(path.join(__dirname, '/../dist/index.html')));
});

const server = http.createServer(app);
server.listen(PORT, HOST);

console.log('Server started, listening at: http://' + HOST + ':' + PORT + '/');
