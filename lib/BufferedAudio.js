var BufferedAudio = function (buffer, ctx, output, looping) {

  this.buffer = buffer;
  this.ctx = ctx;
  this.output = output;
  this.looping = looping;

  this.playing = false;


  
  this.gainNode = this.ctx.createGain()
  this.gainNode.gain.value = 1 // 10 %
  
  this.gainNode.connect(this.output)


  this.createSource();


}

BufferedAudio.prototype.createSource = function () {

  this.source = this.ctx.createBufferSource();
  this.source.buffer = this.buffer;
  this.source.loop = this.looping || false;


  this.source.connect(this.gainNode)
  


};


BufferedAudio.prototype.play = function () {
  // Recreates source for next time we play;
  this.createSource();
  this.playing = true;

  this.source.start(0);



}

BufferedAudio.prototype.playAtSpeed = function (speed) {
  this.source.playbackRate = speed
  this.play();
}
BufferedAudio.prototype.stop = function () {

  this.playing = false;

  this.source.stop();

}



export default BufferedAudio;





