'use strict';

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config({ silent: true });

var PORT = process.env.PORT || 8080;
var HOST = process.env.VCAP_APP_HOST || "0.0.0.0";

var app = (0, _express2.default)().use((0, _compression2.default)()).use((0, _cookieParser2.default)()).use((0, _morgan2.default)('dev'))
// .use(morgan('tiny'))
.use(_bodyParser2.default.json());

// REST API
app.use('/api', _api2.default);

// UI
app.use('/', _express2.default.static(_path2.default.join(__dirname, '/../dist')));
app.get('/*', function (req, res) {
  res.sendFile(_path2.default.resolve(_path2.default.join(__dirname, '/../dist/index.html')));
});

var server = _http2.default.createServer(app);
server.listen(PORT, HOST);

console.log('Server started, listening at: http://' + HOST + ':' + PORT + '/');
//# sourceMappingURL=server.js.map