

import {
  Raycaster,
  Vector3
} from 'three';


// TODO Make it so you can pass in renderer w / h
var ObjectControls = function (eye, params) {

  this.intersected;
  this.selected;

  this.eye = eye;

  this.mouse = new Vector3();
  this.unprojectedMouse = new Vector3();

  this.objects = [];

  var params = params || {};
  var p = params;

  this.sceneDistance = 100;
  this.touchDown = false;

  this.domElement = p.domElement || document;

  // Recursively check descendants of objects in this.objects for intersections.
  this.recursive = p.recursive || false;

  this.raycaster = new Raycaster();

  this.raycaster.near = this.eye.near;
  this.raycaster.far = this.eye.far;

  this.scenePosition = new Vector3();


  var addListener = this.domElement.addEventListener;

  var cb1 = this.mouseDown.bind(this);
  var cb2 = this.mouseUp.bind(this);
  var cb3 = this.mouseMove.bind(this);



  var tb1 = this.touchStart.bind(this);
  var tb2 = this.touchEnd.bind(this);
  var tb3 = this.touchMove.bind(this);



  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);

  this.mobile = check;

  if (check == false) {
    print("nonmobile")
    this.domElement.addEventListener('mousedown', cb1, false)
    this.domElement.addEventListener('mouseup', cb2, false)
    this.domElement.addEventListener('mousemove', cb3, false)
  } else {

    print("mobile")
    this.domElement.addEventListener('touchstart', tb1, false)
    this.domElement.addEventListener('touchend', tb2, false)
    this.domElement.addEventListener('touchmove', tb3, false)
  }

  this.unprojectMouse();
  this.update();

}




/*
 
   EVENTS

*/


// You can think of _up and _down as mouseup and mouse down
ObjectControls.prototype._down = function () {

  print("DOWN");
  print("downnn");
  this.unprojectMouse();
  this.checkForIntersections(this.unprojectedMouse);

  if (this.intersected) {

    print("SELECTING");
    this._select(this.intersected);

  }
  this.down();
  this.isDown = true;

}

ObjectControls.prototype.down = function () { }



ObjectControls.prototype._up = function () {



  print("UYP");

  this.checkForIntersections(this.unprojectedMouse);
  print(this.selected);



  if (this.selected) {


    var ts = this.selected;
    this._deselect(this.selected);
    if (this.mobile) {
      print("fakinghoverout");
      this._hoverOut(ts);
    }

  }

  this.up();
  this.isDown = false;

}

ObjectControls.prototype.up = function () { }



ObjectControls.prototype._hoverOut = function (object) {

  this.hoverOut();

  this.objectHovered = false;

  if (object.hoverOut) {
    object.hoverOut(this);
  }

};

ObjectControls.prototype.hoverOut = function () { };



ObjectControls.prototype._hoverOver = function (object) {


  this.hoverOver();

  this.objectHovered = true;

  if (object.hoverOver) {
    object.hoverOver(this);
  }

};

ObjectControls.prototype.hoverOver = function () { }



ObjectControls.prototype._select = function (object) {

  this.select();

  var intersectionPoint = this.getIntersectionPoint(this.intersected);

  this.selected = object;
  this.intersectionPoint = intersectionPoint;

  if (object.select) {
    object.select(this);
  }

};

ObjectControls.prototype.select = function () { }



ObjectControls.prototype._deselect = function (object) {

  console.log('DESELECT');
  print(object);
  print(object.deselect);


  this.selected = undefined;
  this.intersectionPoint = undefined;

  if (object.deselect) {
    object.deselect(this);
  }

  this.deselect();

};

ObjectControls.prototype.deselect = function () { }




/*

  Changing what objects we are controlling

*/

ObjectControls.prototype.add = function (object) {

  this.objects.push(object);

};

ObjectControls.prototype.remove = function (object) {

  for (var i = 0; i < this.objects.length; i++) {

    if (this.objects[i] == object) {

      this.objects.splice(i, 1);

    }

  }

};




/*
 
   Update Loop

*/

ObjectControls.prototype.update = function () {

  //print(this.unprojectedMouse);

  this.setRaycaster(this.unprojectedMouse);
  this.setScenePosition();
  if (!this.selected) {

    this.checkForIntersections(this.unprojectedMouse);

  } else {

    this._updateSelected(this.unprojectedMouse);

  }


};

ObjectControls.prototype._updateSelected = function () {

  if (this.selected.update) {

    this.selected.update(this);

  }

}

ObjectControls.prototype.updateSelected = function () { };




ObjectControls.prototype.setRaycaster = function (position) {

  //print(position);

  var origin = position;
  var direction = origin.clone()

  direction.sub(this.eye.position);
  direction.normalize();

  this.raycaster.set(this.eye.position, direction);

}


ObjectControls.prototype.setScenePosition = function () {




  this.scenePosition.copy(this.raycaster.ray.origin.clone().add(this.raycaster.ray.direction.clone().multiplyScalar(this.sceneDistance)));

}


/*
 
  Checks

*/

ObjectControls.prototype.checkForIntersections = function (position) {

  var intersected = this.raycaster.intersectObjects(this.objects, this.recursive);


  if (intersected.length > 0) {

    for (var n = 0; n < intersected.length; n++) {



      if (this.recursive) {

        var topLevelObj = this._findTopLevelAncestor(intersected[n].object);
        if (topLevelObj) {

          // Reset intersected.object, leave intersected.point etc. unchanged.
          // This works since in the two most common use cases the ancestor:
          // (1) contains the child object (and the intersection point)
          // (2) is not a THREE.Mesh and thus doesn't appear in the scene, 
          //     e.g. an Object3D used for grouping other related objects.
          intersected[n].object = topLevelObj;

        }

      }

    }

    this._objectIntersected(intersected);

  } else {

    this._noObjectIntersected();

  }

};






ObjectControls.prototype.getIntersectionPoint = function (i) {

  var intersected = this.raycaster.intersectObjects(this.objects, this.recursive);

  return intersected[0].point.sub(i.position);

}

ObjectControls.prototype._findTopLevelAncestor = function (object) {

  // Traverse back up until we find the first ancestor that is a top-level
  // object then return it (or null), since only top-level objects (which
  // were passed to objectControls.add) handle events, even if their child
  // objects are the ones intersected.

  while (this.objects.indexOf(object) === -1) {

    if (!object.parent) {

      return null;

    }

    object = object.parent;

  }

  return object;

}



/*
 
   Raycast Events

*/

ObjectControls.prototype._objectIntersected = function (intersected) {

  // Assigning out first intersected object
  // so we don't get changes everytime we hit 
  // a new face
  var firstIntersection = intersected[0].object;

  if (!this.intersected) {

    this.intersected = firstIntersection;

    this._hoverOver(this.intersected);

    print(this.touchDown);

    if (this.touchDown) {
      this._down();
    }


  } else {

    if (this.intersected != firstIntersection) {

      this._hoverOut(this.intersected);

      this.intersected = firstIntersection;

      this._hoverOver(this.intersected);

    }

  }

  this.objectIntersected();

};

ObjectControls.prototype.objectIntersected = function () { }

ObjectControls.prototype._noObjectIntersected = function () {

  if (this.intersected) {

    this._hoverOut(this.intersected);
    this.intersected = undefined;

  }

  this.noObjectIntersected();

};

ObjectControls.prototype.noObjectIntersected = function () { }

ObjectControls.prototype.unprojectMouse = function () {

  // print(this.mouse);
  // print(this.eye);

  this.unprojectedMouse.copy(this.mouse);
  this.unprojectedMouse.unproject(this.eye);

}


ObjectControls.prototype.mouseMove = function (event) {
  //p print("mousemove");

  this.mouseMoved = true;


  this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  this.mouse.z = 1;

  this.unprojectMouse();
  this.update();

}



ObjectControls.prototype.mouseDown = function (event) {

  // print("mouseDown");
  this.mouseMove(event);
  this._down();
}

ObjectControls.prototype.mouseUp = function () {
  //print("mouseup");
  this.mouseMove(event);
  this._up();
}


ObjectControls.prototype.touchStart = function (event) {
  // print("toucstars");
  // print(event);
  // print(event.touches[0].pageX);
  //print(event);



  this.mouseMoved = true;

  this.mouse.x = (event.changedTouches[0].pageX / window.innerWidth) * 2 - 1;
  this.mouse.y = -(event.changedTouches[0].pageY / window.innerHeight) * 2 + 1;
  this.mouse.z = 1;

  this.unprojectMouse();
  this.touchDown = true;

  this.update();
  this._down();

  //  event.preventDefault();
  // this.zeroPosition();
}


// Move off page
ObjectControls.prototype.touchEnd = function (event) {
  // this.touchMove(event);
  print("touchEnd");
  print(event);

  this.touchDown = false;

  this.mouseMoved = true;

  this.mouse.x = (event.changedTouches[0].pageX / window.innerWidth) * 2 - 1;
  this.mouse.y = -(event.changedTouches[0].pageY / window.innerHeight) * 2 + 1;
  this.mouse.z = 1;

  this.unprojectMouse();

  this.update();

  this._up();

  event.preventDefault();

  // this.zeroPosition();
  // this.zeroPosition();
}

ObjectControls.prototype.touchMove = function (event) {

  this.mouseMoved = true;

  //print(event.touches[0].pageX);
  //print(event.touches[0].pageY);

  this.mouse.x = (event.touches[0].pageX / window.innerWidth) * 2 - 1;
  this.mouse.y = -(event.touches[0].pageY / window.innerHeight) * 2 + 1;
  this.mouse.z = 1;

  this.unprojectMouse();
  this.checkForIntersections(this.unprojectedMouse);
  this.update();

  this.upTime = Date.now();
  event.preventDefault();

}




ObjectControls.prototype.zeroPosition = function () {
  // print("zerod");

  this.mouseMoved = true;

  this.mouse.x = -10;
  this.mouse.y = -10;
  this.mouse.z = 1;

  this.unprojectMouse();
}


export default ObjectControls;