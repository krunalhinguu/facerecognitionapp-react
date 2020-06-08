import React,{ Component } from 'react';
import Navigation from './Components/Navigation/Navigation'
import Logo from './Components/Logo/Logo'
import Rank from './Components/Rank/Rank';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from "./Components/SignIn/SignIn";
import Register from './Components/Register/Register'
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
      imageUrl:'',
      box:{},
      route: 'signIn',
      isSignedIn : false
    }
  } 

  calculateFaceLocation = (data) => {
     const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box ;
     const image = document.getElementById('inputImg');
     const width = Number(image.width);
     const height = Number(image.height);
     console.log(width, height);
     return {
       left:clarifaiFace.left_col * width,
       top:clarifaiFace.top_row * height,
       right:width - (clarifaiFace.right_col * width),
       bottom:height - (clarifaiFace.bottom_row * height)
     }
  }

  displayfaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange =(event) => {
    this.setState({input: event.target.value})
  }

  onSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    app.models.predict(
       Clarifai.FACE_DETECT_MODEL,
       this.state.input)
       .then(response => this.displayfaceBox(this.calculateFaceLocation(response)))
       .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
    
  }

  render(){
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
          <Particles className='particles' params={ParticlesOptions}/>
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
          { route === 'home' 
            ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm 
                onInputChange={ this.onInputChange } 
                onButtonSubmit={ this.onSubmit }
              />  
              <FaceRecognition box={box} imageUrl={imageUrl}/>
              </div>
            : (
                route === 'signIn' 
                ? <SignIn onRouteChange={this.onRouteChange} />
                : <Register onRouteChange={this.onRouteChange} />
              )
          }
      </div>
    );
  }
} 

export default App;
