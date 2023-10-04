

import {
  DataTexture,
  RGBAFormat,
  FloatType,
  LinearFilter,
  RepeatWrapping
} from 'three';


var AudioController = function () {




  this.ctx = new AudioContext();

  this.mute = this.ctx.createGain();
  this.analyser = this.ctx.createAnalyser();
  this.gain = this.ctx.createGain();

  this.gain.connect(this.analyser);
  this.analyser.connect(this.mute);

  // If you sound to come out, connect it to the destination
  this.mute.connect(this.ctx.destination);

  this.analyser.fftSize = 1024;
  this.analyser.array = new Uint8Array(this.analyser.frequencyBinCount);


  var data = this.processAudioController();

  this.texture = new DataTexture(
    data,
    data.length / 16,
    1,
    RGBAFormat,
    FloatType
  );

  this.texture.magFilter = LinearFilter;
  this.texture.minFilter = LinearFilter;
  this.texture.wrapS = RepeatWrapping;
  this.texture.wrapT = RepeatWrapping;
  //this.texture.mipmaps = true;


  this.texture.needsUpdate = true;


}

AudioController.prototype.update = function () {

  this.analyser.getByteFrequencyData(this.analyser.array);

  this.audioData = this.processAudioController();

  this.texture.image.data = this.processAudioController();
  this.texture.needsUpdate = true;


}


AudioController.prototype.processAudioController = function () {


  var width = this.analyser.frequencyBinCount

  var audioTextureData = new Float32Array(width);

  for (var i = 0; i < width; i += 4) {

    //console.log( this.analyser.array[ i / 4 ] ); 
    audioTextureData[i + 0] = this.analyser.array[(i / 4) + 0] / 256;
    audioTextureData[i + 1] = this.analyser.array[(i / 4) + 1] / 256;
    audioTextureData[i + 2] = this.analyser.array[(i / 4) + 2] / 256;
    audioTextureData[i + 3] = this.analyser.array[(i / 4) + 3] / 256;

  }

  return audioTextureData;

}


export default AudioController;