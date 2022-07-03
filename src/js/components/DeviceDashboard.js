import React, { Component } from 'react';
import App from 'grommet/components/App';
import Title from 'grommet/components/Title';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Label from 'grommet/components/Label';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import MenuIcon from 'grommet/components/icons/base/Menu';
import Menu from 'grommet/components/Menu';
import CheckBox from 'grommet/components/CheckBox';
import Paragraph from 'grommet/components/Paragraph';
import { headers, buildQuery, processStatus } from 'grommet/utils/Rest';
import cookie from 'react-cookie';
import 'whatwg-fetch';
import SetSensorForm from './SetSensor';
import GoogleMap from './GoogleMap';

export default class DeviceDashboard extends Component {
  constructor () {
    super();

    this._onSensorSettings = this._onSensorSettings.bind(this);
    this._onSetSensorCancel = this._onSetSensorCancel.bind(this);
    this._onSetSensor = this._onSetSensor.bind(this);
    this._onSensorStateChange = this._onSensorStateChange.bind(this);

    this.state = {
      setSensorSettings: false,
      sensorId: '<sensor not registered>',
      sensorType: 'f0f4371a-9b18-4755-aa89-d5a7152e6525',
      sensorKey: '',
      sensorState: false,
      sensorLat: 52.1698721,
      sensorLng: 21.0151143
    };
  }

  componentWillMount() {
    this.state.sensorId = cookie.load('sensorId');
    if (!this.state.sensorId || this.state.sensorId == '') {
      this.setState({sensorId: '<sensor not registered>', setSensorSettings: true});
    } else {
      // get device
      const options = {method: 'GET', headers: {...headers}};
      fetch(`/api/device/${this.state.sensorId}`, options)
      .then(processStatus)
      .then(response => response.json())
      .then(result => this.setState({ sensorId: result.deviceId, sensorKey: result.authentication.symmetricKey.primaryKey }))
      .catch(error => this.setState({sensorId: '<sensor not registered>', sensorKey: ''}));
    }
    var sensorState = cookie.load('sensorState');
    if (sensorState == '0' || sensorState == '') this.setState({sensorState: false});
    if (sensorState == '1') this.setState({sensorState: true});

    var sensorLat = cookie.load('sensorLat');
    var sensorLng = cookie.load('sensorLng');

    sensorLat ? this.setState({sensorLat: parseFloat(sensorLat)}) : this.setState({sensorLat: 52.1698721});
    sensorLng ? this.setState({sensorLng: parseFloat(sensorLng)}) : this.setState({sensorLng: 21.0151143});
  }

  _onSensorSettings () {
    this.setState({setSensorSettings: true});
  }

  _onSetSensor (e) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 31);

    if (this.state.sensorId != e.sensorId) {
      this.setState({sensorId: e.sensorId});
      cookie.save('sensorId', e.sensorId, {path: '/', expires: expireDate});

      // register device
      const options = {method: 'PUT', headers: {...headers}};
      fetch(`/api/device/${e.sensorId}`, options)
      .then(processStatus)
      .then(response => response.json())
      .then(result => this.setState({ sensorId: result.deviceId, sensorKey: result.authentication.symmetricKey.primaryKey }))
      .catch(error => this.setState({sensorId: '<sensor not registered>', sensorKey: ''}));
    }
    this.setState({setSensorSettings: false, sensorLat: e.sensorLat, sensorLng: e.sensorLng});
    cookie.save('sensorLat', e.sensorLat, {path: '/', expires: expireDate});
    cookie.save('sensorLng', e.sensorLng, {path: '/', expires: expireDate});
  }

  _onSensorStateChange () {
    this.state.sensorState = !this.state.sensorState;
    this.setState({sensorState: this.state.sensorState});

    var sensorState = 0;
    if (this.state.sensorState) sensorState = 1;

    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 31);
    cookie.save('sensorState', sensorState, {path: '/', expires: expireDate});

    // send event
    const query = buildQuery({sensorId: this.state.sensorId, sensorKey: this.state.sensorKey, sensorType: this.state.sensorType, sensorState: sensorState, sensorLat: this.state.sensorLat, sensorLng: this.state.sensorLng});
    const options = {method: 'PUT', headers: {...headers}};
    fetch(`/api/event${query}`, options)
    .then(processStatus)
    .then(response => response.json())
    .catch(error => console.error(error));
  }


  _onSetSensorCancel () {
    this.setState({setSensorSettings: false});
  }

  render () {

    let setSensorLayer;
    if (this.state.setSensorSettings) {
      setSensorLayer = (
        <SetSensorForm sensorId={this.state.sensorId} sensorLat={this.state.sensorLat} sensorLng={this.state.sensorLng} onClose={this._onSetSensorCancel} onSubmit={this._onSetSensor} />
      );
    }

    return (
      <App centered={false} inline={true}>
      {setSensorLayer}
      <Header direction='row' justify='between' pad={{horizontal: 'small'}} colorIndex='neutral-1'>
        <Title>HPE IoT Demo - Device</Title>
        <Menu direction="column" justify="end" align="center">
          <Button icon={<MenuIcon />} onClick={this._onSensorSettings} />
        </Menu>
      </Header>
      <Section flex={true} primary={true} pad={{horizontal: 'small', vertical: 'small'}}>
        <Tiles fill={true} flush={true} pad={{horizontal: 'none'}} align='start'>
          <Tile fill={true} flush={true} pad={{horizontal: 'none', vertical: 'none'}} align='start'>
            <Label align='start' size='medium' margin='small'>Sensor ID: {this.state.sensorId}</Label>
            <Box align='start' pad={{horizontal: 'none', vertical: 'none'}} size={{height: 'medium', width: 'large'}}>
              <GoogleMap center={{lat: this.state.sensorLat, lng: this.state.sensorLng}} zoom={18} options={{panControl: false, mapTypeControl: false, draggable: false, disableDoubleClickZoom: true, scrollwheel: false }} />
            </Box>
            <Box align='start' pad={{horizontal: 'none', vertical: 'none'}}>
              <Paragraph margin='none' size='medium'>
                lat: {this.state.sensorLat} lng: {this.state.sensorLng}
              </Paragraph>
            </Box>
            <Box align='start' pad={{horizontal: 'none', vertical: 'small'}}>
              <CheckBox id='parkingBusy' checked={this.state.sensorState} toggle={true} label='Parking Space Busy' onChange={this._onSensorStateChange} />
            </Box>
          </Tile>
        </Tiles>
      </Section>
      <Footer direction='row' justify='between' pad={{horizontal: 'small', vertical: 'small'}} colorIndex='neutral-1'>
        <img src="img/HPE_log_left_wht.png" width="8%" height="8%" />IoT&nbsp;|&nbsp;Device&nbsp;|&nbsp;&copy; 2017 HPE Damian Janiszewski
      </Footer>
      </App>
    );
  }
};
