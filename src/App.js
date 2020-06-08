import React,{ Component } from 'react';
import Navigation from './Components/Navigation/Navigation'
import Logo from './Components/Logo/Logo'
import Rank from './Components/Rank/Rank';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import 'tachyons';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import './App.css';

const app = new Clarifai.App({
  apiKey: '8116aa3fd2ab4c8ab0f72679c10052c3'
 });

const ParticlesOptions = {
  particles: {
    number : {
      value: 100,
      density: {
        enable: true,
        value_area:800
      }
    }
  } 
}
class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl:''
    }
  } 

  onInputChange =(event) => {
    console.log(event.target.value);
    this.setState({input: event.target.value})
  }

  onSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    console.log('click');
    app.models.predict(
       Clarifai.FACE_DETECT_MODEL,
       this.state.input)
       .then(function(response) {
          console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        },
      function(err) {
        // there was an error
      }
  );
  }

  render(){
    return (
      <div className="App">
          <Particles className='particles' params={ParticlesOptions}/>
          <Navigation />
          <Logo />
          <Rank />
          <ImageLinkForm 
            onInputChange={ this.onInputChange } 
            onButtonSubmit={ this.onSubmit }
          />
          <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
} 

export default App;
