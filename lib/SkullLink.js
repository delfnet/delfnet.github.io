

import {
    IcosahedronGeometry,
    Mesh,
    DoubleSide,
    ShaderMaterial,
    MeshNormalMaterial,
    MeshBasicMaterial
} from 'three';

function SkullLink(params) {


    var vs1 = params.vertexShader;
    var fs1 = params.fragmentShader;
    var geo = params.geometry;
    var shield = params.shield;
    var linkInfo = params.linkInfo;
    var scale = params.scale;
    var controls = params.controls;
    var scene = params.scene;
    var uniforms = params.uniforms;
    var link = params.link;



    var uniforms2 = {
        dT: uniforms.dT,
        time: uniforms.time,
        lightPos: uniforms.lightPos,
        t_matcap: uniforms.t_matcap,
        t_normal: uniforms.t_normal,

        t_audio: uniforms.t_audio,
        t_colormap: uniforms.t_colormap,

        _NoiseSize: { type: "f", value: 1 },
        _NoiseSpeed: { type: "f", value: 1 },
        _NoiseOffset: { type: "f", value: 1 },
        _HueStart: { type: "f", value: 1 },
        _HueSize: { type: "f", value: 1 },
        _NormalDepth: { type: "f", value: 0 },
        _FFTStart: { type: "f", value: 0 },
        _FFTSize: { type: "f", value: .5 },
        _Saturation: { type: "f", value: 1 },
        _Lightness: { type: "f", value: 1 },
        _DiscardAmount: { type: "f", value: 0 }


    }

    var sphereMaterial = new ShaderMaterial({
        uniforms: uniforms2,
        vertexShader: vs1,
        fragmentShader: fs1,
        side: DoubleSide
    })

    sphereMaterial.extensions.derivatives = true;

    var mat = new MeshNormalMaterial();

    var main = new Mesh(geo, sphereMaterial);
    scene.add(main);
    main.linkInfo = linkInfo;
    main.link = link;
    main.scale.x = scale;
    main.scale.y = scale;
    main.scale.z = scale;
    main.clickLink = params.clickLink;
    main.baseScale = scale;

    controls.add(main);

    var transparentMaterial = new MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
    });

    var shield = new Mesh(shield, transparentMaterial);
    main.add(shield);
    shield.scale.x = 1.1;
    shield.scale.y = 1.1;
    shield.scale.z = 1.1;
    shield.shieldedMesh = main;
    shield.linkInfo = linkInfo;
    shield.linkMat = mat;
    shield.uniforms = uniforms2;
    shield.main = main;

    shield.baseUniforms = params.baseUniforms;
    shield.selectedUniforms = params.selectedUniforms;
    shield.hoveredUniforms = params.hoveredUniforms;

    //print(params.baseUniforms);
    shield.clickLink = params.clickLink;
    shield.link = link;

    shield.select = function () {

        this.uniforms._HueStart.value = this.selectedUniforms.hueStart;
        this.uniforms._HueSize.value = this.selectedUniforms.hueSize;
        this.uniforms._NoiseOffset.value = this.selectedUniforms.noiseOffset;
        this.uniforms._Lightness.value = this.selectedUniforms.lightness;
        this.uniforms._NoiseSpeed.value = this.selectedUniforms.noiseSpeed;
        this.uniforms._NoiseSize.value = this.selectedUniforms.noiseSize;
        this.uniforms._Saturation.value = this.selectedUniforms.saturation;
        //print(this.link);


        // if (!mobileCheck()) {
        this.clickLink(this.link);
        //   }


        this.main.scale.x = this.main.baseScale * 1;
        this.main.scale.y = this.main.baseScale * 1;
        this.main.scale.z = this.main.baseScale * 1;

    }
    shield.hoverOver = function () {

        this.uniforms._HueStart.value = this.hoveredUniforms.hueStart;
        this.uniforms._HueSize.value = this.hoveredUniforms.hueSize;
        this.uniforms._NoiseOffset.value = this.hoveredUniforms.noiseOffset;
        this.uniforms._Lightness.value = this.hoveredUniforms.lightness;
        this.uniforms._NoiseSpeed.value = this.hoveredUniforms.noiseSpeed;
        this.uniforms._NoiseSize.value = this.hoveredUniforms.noiseSize;
        this.uniforms._Saturation.value = this.hoveredUniforms.saturation;

        this.main.scale.x = this.main.baseScale * 1;
        this.main.scale.y = this.main.baseScale * 1;
        this.main.scale.z = this.main.baseScale * 1;


        //print(this.link);
        // if (mobileCheck()) {
        //     this.clickLink(this.link);
        // }

    }

    shield.hoverOut = function () {

        this.uniforms._HueStart.value = this.baseUniforms.hueStart;
        this.uniforms._HueSize.value = this.baseUniforms.hueSize;
        this.uniforms._NoiseOffset.value = this.baseUniforms.noiseOffset;
        this.uniforms._Lightness.value = this.baseUniforms.lightness;
        this.uniforms._NoiseSpeed.value = this.baseUniforms.noiseSpeed;
        this.uniforms._NoiseSize.value = this.baseUniforms.noiseSize;
        this.uniforms._Saturation.value = this.baseUniforms.saturation;


        this.main.scale.x = this.main.baseScale * 1;
        this.main.scale.y = this.main.baseScale * 1;
        this.main.scale.z = this.main.baseScale * 1;
    }

    shield.hoverOut();

    controls.add(shield);


    var link = {
        main: main,
        shield: shield
    }

    return link;


}



export default SkullLink;