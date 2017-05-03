import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import Layer from 'grommet/components/Layer';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import Form from 'grommet/components/Form';
import Box from 'grommet/components/Box';
import TextInput from 'grommet/components/TextInput';
import Split from 'grommet/components/Split';
import Paragraph from 'grommet/components/Paragraph';
import UpdateIcon from 'grommet/components/icons/base/Update';
import GoogleMap, { Marker } from './GoogleMap';
import uuid from 'uuid';

export default class SetSensorForm extends Component {

  constructor (props) {
    super(props);

    this._onSubmit = this._onSubmit.bind(this);
    this._onSensorIdChange = this._onSensorIdChange.bind(this);
    this._onSensorIdGenerate = this._onSensorIdGenerate.bind(this);
    this._onMapChange = this._onMapChange.bind(this);
    this._onMapClick = this._onMapClick.bind(this);


    // sensorType:
    //   ParkingSensor: f0f4371a-9b18-4755-aa89-d5a7152e6525

    this.state = {
      sensorId: this.props.sensorId,
      sensorType: 'f0f4371a-9b18-4755-aa89-d5a7152e6525',
      sensorLat: this.props.sensorLat,
      sensorLng: this.props.sensorLng
    };


    if (this.props.sensorId == '<sensor not registered>') {
      this.state.sensorId = uuid.v4();
    } else {
      this.state.sensorId = this.props.sensorId;
    }
  }

  _onSubmit (e) {
    e.preventDefault();
    if (this.state.sensorId) {
      this.props.onSubmit({
        sensorId: this.state.sensorId,
        sensorLat: this.state.sensorLat,
        sensorLng: this.state.sensorLng
      });
    }
  }

  _onSensorIdChange (e) {
    this.setState({ sensorId: e.target.value });
  }

  _onSensorIdGenerate () {
    this.setState({ sensorId: uuid.v4() });
  }

  _onMapChange (e) {
    this.setState({ sensorLat: e.center.lat, sensorLng: e.center.lng });
  }

  _onMapClick (e) {
    this.setState({ sensorLat: e.lat, sensorLng: e.lng });
  }

  render () {
    return (
      <Layer align="right" closer={true} onClose={this.props.onClose}>
        <Form onSubmit={this._onSubmit}>
          <Header pad={{horizontal: 'none', vertical: 'none'}}>Sensor Settings</Header>
          <FormFields pad={{horizontal: 'none', vertical: 'none'}}>
            <Box direction='row' responsive={false} align='center' pad={{horizontal: 'none', vertical: 'small'}} size={{width: 'full'}}>
              <FormField label="Sensor ID" htmlFor="sensorId" pad={{horizontal: 'none', vertical: 'none'}}>
                <TextInput id="sensorId" value={this.state.sensorId} onChange={this._onSensorIdChange} />
              </FormField>
              <Box>
                <Button icon={<UpdateIcon />} plain={true} onClick={this._onSensorIdGenerate} />
              </Box>
            </Box>
            <Box align='center' pad={{horizontal: 'none', vertical: 'small'}} size={{height: 'medium', width: 'full'}}>
              <GoogleMap center={{lat: this.state.sensorLat, lng: this.state.sensorLng}} zoom={18} options={{panControl: false, mapTypeControl: false }} onClick={this._onMapClick}>
              </GoogleMap>
            </Box>
            <Box align='end' pad={{horizontal: 'none', vertical: 'none'}} size={{width: 'full'}}>
              <Paragraph margin='none' size='medium'>
                lat: {this.state.sensorLat} lng: {this.state.sensorLng}
              </Paragraph>
            </Box>
          </FormFields>
          <Footer pad={{horizontal: 'none', vertical: 'small'}} justify="end">
            <Box pad={{horizontal: 'small'}}>
              <Button label='Set' type='submit' primary={true} onClick={this._onSubmit} />
            </Box>
            <Box>
              <Button label='Cancel' type='reset' onClick={this.props.onClose} />
            </Box>
          </Footer>
        </Form>
      </Layer>
    );
  }
}

SetSensorForm.propTypes = {
  sensorId: PropTypes.string.isRequired,
  sensorLat: PropTypes.number.isRequired,
  sensorLng: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};
