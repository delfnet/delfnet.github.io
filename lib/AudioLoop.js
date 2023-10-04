import {
    IcosahedronGeometry,
    ShaderMaterial,
    Mesh,
    DoubleSide,
    PlaneGeometry,
    MeshBasicMaterial,
    AdditiveBlending,
    Quaternion,
    Vector3
} from 'three';


function AudioLoop(loop, val, params) {

    var scene = params.scene;
    var controls = params.controls;
    var audio = params.audio;
    var uniforms = params.uniforms;

    var id = params.id;



    var geo = params.geometry;

    //print(geo);

    var mat = new ShaderMaterial({
        uniforms: {

            dT: uniforms.dT,
            time: uniforms.time,
            lightPos: uniforms.lightPos,
            t_matcap: uniforms.t_matcap,
            t_normal: uniforms.t_normal,
            t_audio: uniforms.t_audio,

            t_colormap: uniforms.t_colormap,
            t_main: {
                type: "t", value: params.texture
            },

            _NoiseSize: { type: "f", value: 1.1 },
            _NoiseSpeed: { type: "f", value: .2 },
            _NoiseOffset: { type: "f", value: .0 },
            _HueStart: { type: "f", value: val },
            _HueSize: { type: "f", value: .05 },
            _NormalDepth: { type: "f", value: .1 },
            _FFTStart: { type: "f", value: .1 },
            _FFTSize: { type: "f", value: 1.1 },
            _Saturation: { type: "f", value: 1 },
            _Lightness: { type: "f", value: 1 },
            _DiscardAmount: { type: "f", value: 0 },
            _Special: { type: "f", value: 0 }

        },
        vertexShader: params.vertex,
        fragmentShader: params.fragment,
        side: DoubleSide
    })





    mat.uniforms._Lightness.value = params.brightness;//= new Color(0x000000);
    mat.uniforms._Special.value = params.special;//= new Color(0x000000);


    /*  mat = new MeshBasicMaterial({
    map: params.texture,
        side: DoubleSide

});*/

    var main = new Mesh(geo, mat);

    main.scale.multiplyScalar(700 * params.scale);
    scene.add(main);
    main.deselect = function () {

        print("HELL0");
        this.toggleLoop();
    }.bind(main);
    main.loop = loop;
    main.loopOn = false;
    main.controls = controls;
    main.uniforms = uniforms;
    main.toggleLoop = function () {

        if (this.loopOn) {
            console.log(this);
            console.log(this.material);
            //  this.material.uniforms._Lightness.value = 1;//color = new THREE.Color(0x000000);
            this.loopOn = false;
            this.loop.gainNode.gain.setValueAtTime(0, audio.ctx.currentTime);
            this.hoverOut();
        } else {
            this.loopOn = true;
            //this.material.uniforms._Lightness.value = 10;
            this.loop.gainNode.gain.setValueAtTime(.4, audio.ctx.currentTime);
            this.hoverOver();
        }
    }



    var geo = new PlaneGeometry(1, 1, 1, 1);
    var mat = new MeshBasicMaterial({
        transparent: true,
        blending: AdditiveBlending,
        map: params.map,
        alphaTest: .5,
        depthWrite: false
    });

    main.onIndicator = new Mesh(geo, mat);
    main.onIndicator.scale.multiplyScalar(.001);

    main.add(main.onIndicator);




    main.hoverOver = function () {
        //this.material.uniforms._Lightness.value = 6;


        this.onIndicator.scale.x = .03;
        this.onIndicator.scale.y = .03;
        this.onIndicator.scale.z = .03;

    }.bind(main);

    main.hoverOut = function () {


        // this.material.uniforms._Lightness.value = 1;

        if (this.loopOn) {
            //  this.material.uniforms._Lightness.value = 10;
        } else {

            this.onIndicator.scale.x = .0001;
            this.onIndicator.scale.y = .0001;
            this.onIndicator.scale.z = .0001;

        }

    }.bind(main);
    controls.add(main);



    main.velocity = new Vector3();
    main.acceleration = new Vector3();
    main.dampening = .9;

    main.loopID = id;

    main.axis = new Vector3(
        Math.random() - .5,
        Math.random() - .5,
        Math.random() - .5
    ).normalize();

    main.tangent = new Vector3(0, 1, 0); //main.axis.clone().cross(new Vector3(0, 1, 0)).normalize();
    main.bitangent = new Vector3(1, 0, 0); //main.tangent.clone().cross(main.axis).normalize();

    main.radius = 60;
    main.speed = .13;
    main.base = val * Math.PI * 2;


    main.update = function () {

        //this.velocity.add(this.acceleration);
        //this.acceleration.multiplyScalar(this.dampening);
        //this.position.set(100, 0, 0);

        var x = new Vector3(1, 0, 0).multiplyScalar(Math.sin(this.uniforms.time.value * this.speed + this.base)).multiplyScalar(main.radius);
        var y = new Vector3(0, 1, 0).multiplyScalar(-Math.cos(this.uniforms.time.value * this.speed + this.base)).multiplyScalar(main.radius);


        //  var x = new Vector3(0,1,0)

        this.position.copy(x);
        this.position.add(y);

        this.position.y += 5;
        this.position.x *= .8;
        //this.position.x *= .8;
        //this.position.z *= .8;

        this.position.z = 50;

        var q1 = new Quaternion().copy(this.quaternion);

        this.lookAt(this.controls.scenePosition);
        var q2 = new Quaternion().copy(this.quaternion);


        this.quaternion.copy(q1);
        this.quaternion.slerp(q2, .1);

        this.onIndicator.lookAt(controls.eye.position);
    }



    main.position.copy(params.position);//.x = x;
    // main.position.y = y;
    // main.position.z = (Math.random() - .5) * 3;//;

    // main.originalPosition = main.position.clone();



    main.loop.gainNode.gain.setValueAtTime(0, audio.ctx.currentTime);
    main.update();

    return main;


}


export default AudioLoop;
