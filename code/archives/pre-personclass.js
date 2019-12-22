'use strict';

function intersectsBoxButSide(box1, box2) {
  return box1.max.x <= box2.min.x || box1.min.x >= box2.max.x ||
         box1.max.y <= box2.min.y || box1.min.y >= box2.max.y ||
         box1.max.z <= box2.min.z || box1.min.z >= box2.max.z ? false : true;
}
function updateBoundingBox(target) {
  target.updateMatrixWorld(true);
  target.boundingBox.copy(target.geometry.boundingBox).applyMatrix4(target.matrixWorld);
}

// THE FOLLOWING IS COPYRIGHTED AND IS NOT TO BE STOLEN WITHOUT PERMISSION, I PUT WAY TOO MUCH TIME INTO THIS.
// PLESAE CONTACT ME AT https://gamepro5.github.io/contact IF YOU WISH TO USE IT.
// (thanks to sean for helping me sometimes with syntax errors and debugging)

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// #PLAYER CODE!
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class PLAYER {
  constructor() {

    this.camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 99999);

    this.collisionBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshPhongMaterial({color: 0x754c1c, side: THREE.DoubleSide})   //{color: 0xff00fb}new THREE.Material().visible = false
    );

    this.model = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshPhongMaterial({color: 0xFF0000})
    );

    this.model.rotation.order = 'YXZ';
    // keys default values
    this.wPressed = false;
    this.aPressed = false;
    this.uPressed = false;
    this.sPressed = false;
    this.dPressed = false;
    this.useThirdPerson = false;
    this.spacePressed = false;
    this.onePressed = false;

    scene.add(this.collisionBox, this.model);

    this.collisionBox.add(this.model);
    this.model.add(this.camera);

    this.collisionBox.geometry.computeBoundingBox();
    this.collisionBox.boundingBox = this.collisionBox.geometry.boundingBox.clone();

    this.pistol = new PISTOL(this); // `this` refers to the player instance while...
    //  this.weaponB = new somethingElse(); // (*￣3￣)╭
    this.currentWeapon;

    document.addEventListener('keydown', (event) => {

        switch (event.key) {
            case 'w':
            case 'W':
                this.wPressed = true;
            break;
            case 'a':
            case 'A':
                this.aPressed = true;
            break;
            case 's':
            case 'S':
                this.sPressed = true;
            break;
            case 'd':
            case 'D':
                this.dPressed = true;
            break;
            case ' ':
                this.spacePressed = true;
            break;
            case '1':
            case '!':
                this.onePressed = true; // RIP naming convention and area 51 raid
                this.pistolOut = !this.pistolOut;
            break;
            case 'o':
            case 'O':
                this.useThirdPerson = !this.useThirdPerson;
            break;
            case 'i':
            case 'I':
                this.acceleration = 5; //for testing world end :D
                this.maxSpeed = 10;
            break;
            case 'm':
            case 'M':
                this.developerView = !this.developerView
            break;
        }
    })

    document.addEventListener('keyup', (event) => {

        switch (event.key) {
            case 'w':
            case 'W':
                this.wPressed = false;
            break;
            case 'a':
            case 'A':
                this.aPressed = false;
            break;
            case 's':
            case 'S':
                this.sPressed = false;
            break;
            case 'd':
            case 'D':
                this.dPressed = false;
            break;
            case ' ':
                this.spacePressed = false;
            break;
            case '1':
                this.onePressed = false;
            break;
            case 'i':
            case 'I':
                this.acceleration = 0.01; //for testing world end :D
                this.maxSpeed = 0.04;
            break;
        }
    });

    canvas.onclick = () => {

        canvas.requestPointerLock();

    }

    document.addEventListener('mousemove', (event) => {

      if (document.pointerLockElement) {
      this.model.rotation.y -= event.movementX / 700;
      this.model.rotation.x -= event.movementY / 700;
      if (this.model.rotation.x > Math.PI / 2) this.model.rotation.x = Math.PI / 2;
      else if (this.model.rotation.x < -Math.PI / 2) this.model.rotation.x = -Math.PI / 2;
      }
  });

  // TO RUN LOCALLY
  // 1. Copy path of gamepro5.github.io folder in Windows Explorer
  // 2. In the terminal thingy, do http-server C:\Users\gamep\Documents\GitHub\gamepro5.github.io
  // 3. ???
  // 4. Profit

    this.acceleration;
    this.acceleration = 0.01; //default: 0.01
    this.maxSpeed = 0.04; //default: 0.04
    this.midAir = false;
    this.yVelocity = 0;
    this.xVelocity = 0;
    this.zVelocity = 0;
    this.oldPositionY;
    this.oldPositionX;
    this.oldPositionZ;
    this.gravity = 0.0000098;
    this.gravityOrientation = 'top to bottom';
    this.onTopOf;

  }

gameLoop() {

if (this.developerView) {
  this.collisionBox.material.visible = true;
  this.collisionBox.material.transparent = true;
  this.collisionBox.material.opacity = 0.25;
  document.getElementById("dev_tools").innerHTML = `<p>Developer Info:</p>
  <p>Coordinates (XYZ): ` + this.collisionBox.position.x +  ` / ` + this.collisionBox.position.y +  ` / ` + this.collisionBox.position.z + `</p>
  <p>Velocities (XYZ): ` + this.xVelocity + ` / ` + this.yVelocity + ` / ` + this.zVelocity + `</p>
  <p>Selected Weapon: ` + this.currentWeapon + `</p>`
  ;
} else if (!this.developerView) {                 //convert into a promise latter
  this.collisionBox.material.visible = false;
  this.collisionBox.material.transparent = undefined;
  this.collisionBox.material.opacity = undefined;
  document.getElementById("dev_tools").innerHTML = null;
}

// F R  I  CK  T I O N

if (!this.midAir) {
  // only if not in the air, apply friction
  this.zVelocity *= 0.9;
  this.xVelocity *= 0.9;
}


// Weapon Selection Algorythm

    if (this.onePressed && this.pistolOut) {
      this.currentWeapon = this.pistol;
      this.model.add(this.pistol.model);
    } else if (this.onePressed && this.pistolOut === false) {
      this.currentWeapon = undefined;
      this.model.remove(this.pistol.model);
    }
    if (this.currentWeapon !== undefined) {
      this.currentWeapon.gameLoop();
    }

    // create a right triangle with the two velocities as its legs
    let velocityVector = new THREE.Vector3(this.xVelocity, 0, this.zVelocity);
    // if the hypotenuse of the right triangle (overall velocity) is too long
    if (velocityVector.length() > this.maxSpeed) {
      // shrink the triangle so that its hypotenuse is the max speed
      velocityVector.setLength(this.maxSpeed);
      // set the velocities to the new legs of the triangle
      this.xVelocity = velocityVector.x;
      this.zVelocity = velocityVector.z;
    }
    if (Math.abs(this.xVelocity) < 0.001) { //changed the specificness from 0.00001 to 0.001 lol
      this.xVelocity = 0;
    }
    if (Math.abs(this.zVelocity) < 0.001) {
      this.zVelocity = 0;
    }

    let acceleration;
    if (this.midAir) {
      acceleration = this.acceleration * 0.15;
    } else {
      acceleration = this.acceleration;
    }

      if (this.wPressed) {
          this.xVelocity -= Math.sin(this.model.rotation.y) * acceleration;
          this.zVelocity -= Math.cos(this.model.rotation.y) * acceleration;
      }
      if (this.aPressed) {
          this.xVelocity -= Math.cos(this.model.rotation.y) * acceleration;
          this.zVelocity += Math.sin(this.model.rotation.y) * acceleration;
      }
      if (this.sPressed) {
          this.xVelocity += Math.sin(this.model.rotation.y) * acceleration;
          this.zVelocity += Math.cos(this.model.rotation.y) * acceleration;
      }
      if (this.dPressed) {
          this.xVelocity += Math.cos(this.model.rotation.y) * acceleration;
          this.zVelocity -= Math.sin(this.model.rotation.y) * acceleration;
      }

      // start jumping when space is pressed
      if (this.spacePressed && !this.midAir) {
        this.midAir = true;
        this.yVelocity = 0.0044;
      }
      // when jumping
      if (this.midAir) {
          this.yVelocity = this.yVelocity - (changeInTime * this.gravity)
          this.collisionBox.position.y = this.oldPositionY + (changeInTime * this.yVelocity);
      }

      updateBoundingBox(this.collisionBox);
      if (this.gravityOrientation === 'top to bottom') {
        for (let i=0; i < collisionMap.length; i++) {
          //update the player's colision box all the time. this should maybe move to if the player moved.
          //if on top of the colision thing, stop falling.
          if ((this.collisionBox.position.y === collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2 + 0.0000000000000001) && (collisionMap[i] === this.onTopOf)) {
            this.midAir = false;
            this.yVelocity = 0;
            //checks if the player has moved since last calculation, if he has, fall and check if you colidie with anything.
            if (this.xVelocity || this.zVelocity) {
              this.collisionBox.position.y -= 0.001;
              updateBoundingBox(this.collisionBox);
              if (!this.collisionBox.boundingBox.intersectsBox(collisionMap[i].boundingBox)) { //used to be (this.collisionBox.position.y !== collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2) || (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox) === false)
                this.yVelocity = 0;
                this.midAir = true;
              }
              this.collisionBox.position.y += 0.001;
              updateBoundingBox(this.collisionBox);
            }
          //if not on top of the colision box, then check if you are coliding with the colision box, if you are, put yourself on top of the colision box and stop falling.
          } else if (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox)) {
            if (Math.sign(this.yVelocity) <= 0) {
              this.collisionBox.position.y = collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2 + 0.0000000000000001;
              console.log('position corrected, phongies y coordinate is now ' + this.collisionBox.position.y);
              updateBoundingBox(this.collisionBox);
              this.midAir = false;
              this.yVelocity = 0;
              this.onTopOf = collisionMap[i];
            } else if (Math.sign(this.yVelocity) > 0) {
              this.collisionBox.position.y = collisionMap[i].boundingBox.min.y - this.collisionBox.geometry.parameters.height/2 - 0.0000000000000001;
              console.log('position corrected, phongies y coordinate is now ' + this.collisionBox.position.y);
              updateBoundingBox(this.collisionBox);
              this.yVelocity = 0;
            }
          }
        }
      } else if (this.graivtyOrientation === 'bottom to top') {
        if ((this.collisionBox.position.y === collisionMap[i].boundingBox.min.y - this.collisionBox.geometry.parameters.height/2 - 0.0000000000000001) && (collisionMap[i] === this.onTopOf)) {
          this.midAir = false;
          this.yVelocity = 0;
          //checks if the player has moved since last calculation, if he has, fall and check if you colidie with anything.
          if (this.xVelocity || this.zVelocity) {
            this.collisionBox.position.y += 0.001;
            updateBoundingBox(this.collisionBox);
            if (!this.collisionBox.boundingBox.intersectsBox(collisionMap[i].boundingBox)) { //used to be (this.collisionBox.position.y !== collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2) || (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox) === false)
              this.yVelocity = 0;
              this.midAir = true;
            }
            this.collisionBox.position.y -= 0.001;
            updateBoundingBox(this.collisionBox);
          }
        //if not on top of the colision box, then check if you are coliding with the colision box, if you are, put yourself on top of the colision box and stop falling.
        } else if (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox)) {
          if (Math.sign(this.yVelocity) >= 0) {
            this.collisionBox.position.y = collisionMap[i].boundingBox.min.y - this.collisionBox.geometry.parameters.height/2 - 0.0000000000000001;
            console.log('position corrected, phongies y coordinate is now ' + this.collisionBox.position.y);
            updateBoundingBox(this.collisionBox);
            this.midAir = false;
            this.yVelocity = 0;
            this.onTopOf = collisionMap[i];
          } else if (Math.sign(this.yVelocity) < 0) {
            this.collisionBox.position.y = collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2 + 0.0000000000000001;
            console.log('position corrected, phongies y coordinate is now ' + this.collisionBox.position.y);
            updateBoundingBox(this.collisionBox);
            this.yVelocity = 0;
          }
        }
      };
//for sean debugging
      for (let {boundingBox} of collisionMap) if (intersectsBoxButSide(this.collisionBox.boundingBox, boundingBox)) {
              console.log('!!!', boundingBox.min, boundingBox.max, this.collisionBox.boundingBox.min, this.collisionBox.boundingBox.max);
              throw new Error('!!!');
            }

  this.collisionBox.position.x += this.xVelocity;
  updateBoundingBox(this.collisionBox);
  //allways be moving!

  for (let i=0; i < collisionMap.length; i++) {
    //update the player's colision box all the time. this should maybe move to if the player moved
    //if on top of the colision thing, stop falling.
    if ((this.collisionBox.position.x === collisionMap[i].boundingBox.max.x + this.collisionBox.geometry.parameters.width/2 + 0.0000000000000001) || (this.collisionBox.position.x === collisionMap[i].boundingBox.min.x - this.collisionBox.geometry.parameters.width/2 - 0.0000000000000001)) {
      this.xVelocity = 0;
    //if not on top of the colision box, then check if you are coliding with the colision box, if you are, put yourself on top of the colision box and stop falling.
    } else if (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox)) {
      if (Math.sign(this.xVelocity) === -1) {
        this.collisionBox.position.x = collisionMap[i].boundingBox.max.x + this.collisionBox.geometry.parameters.width/2 + 0.0000000000000001;
        this.xVelocity = 0;
      } else if (Math.sign(this.xVelocity) === 1) {
        this.collisionBox.position.x = collisionMap[i].boundingBox.min.x - this.collisionBox.geometry.parameters.width/2 - 0.0000000000000001;
        this.xVelocity = 0;
      }
      updateBoundingBox(this.collisionBox);
      console.log('position corrected, phongies x coordinate is now ' + this.collisionBox.position.x);
    }
  };

  this.collisionBox.position.z += this.zVelocity;
  updateBoundingBox(this.collisionBox);
  //allways be moving!

  for (let i=0; i < collisionMap.length; i++) {
    //update the player's colision box all the time. this should maybe move to if the player moved.
    //if on top of the colision thing, stop falling.
    if ((this.collisionBox.position.z === collisionMap[i].boundingBox.max.z + this.collisionBox.geometry.parameters.depth/2) || (this.collisionBox.position.z === collisionMap[i].boundingBox.min.z - this.collisionBox.geometry.parameters.depth/2 - 0.0000000000000001)) {
    this.zVelocity = 0;
    //if not on top of the colision box, then check if you are coliding with the colision box, if you are, put yourself on top of the colision box and stop falling.
    } else if (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox)) {
      if (Math.sign(this.zVelocity) === -1) {
        this.collisionBox.position.z = collisionMap[i].boundingBox.max.z + this.collisionBox.geometry.parameters.depth/2 + 0.0000000000000001;
        this.zVelocity = 0;
      } else if (Math.sign(this.zVelocity) === 1) {
        this.collisionBox.position.z = collisionMap[i].boundingBox.min.z - this.collisionBox.geometry.parameters.depth/2 - 0.0000000000000001;
        this.zVelocity = 0;
      }
      updateBoundingBox(this.collisionBox);
      console.log('position corrected, phongies z coordinate is now ' + this.collisionBox.position.z);
    }
  };

    this.oldPositionY = this.collisionBox.position.y;
    this.oldPositionX = this.collisionBox.position.x;
    this.oldPositionZ = this.collisionBox.position.z;


  }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// #AI CODE!
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class AI_BOT {
  constructor() {

    this.camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 99999);
    this.camera.rotation.y = Math.PI;

    this.collisionBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshPhongMaterial({color: 0x754c1c, side: THREE.DoubleSide})   //{color: 0xff00fb}new THREE.Material().visible = false
    );

    this.model = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshPhongMaterial({color: 0x00FF00})
    );

    this.model.rotation.order = 'YXZ';
    // keys default values

    this.wPressed = false;
    this.aPressed = false;
    this.uPressed = false;
    this.sPressed = false;
    this.dPressed = false;
    this.spacePressed = false;
    this.onePressed = false;

    scene.add(this.collisionBox, this.model);

    this.collisionBox.add(this.model);
    this.model.add(this.camera);

    this.collisionBox.geometry.computeBoundingBox();
    this.collisionBox.boundingBox = this.collisionBox.geometry.boundingBox.clone();

    this.pistol = new PISTOL(this); // `this` refers to the player instance while...
    //  this.weaponB = new somethingElse(); // (*￣3￣)╭
    this.currentWeapon;

    document.addEventListener('keydown', (event) => {

        switch (event.key) {
            case 'b':
            case 'B':
                this.botRun = !this.botRun;
            break;
          }
    })


  // TO RUN LOCALLY
  // 1. Copy path of gamepro5.github.io folder in Windows Explorer
  // 2. In the terminal thingy, do http-server C:\Users\gamep\Documents\GitHub\gamepro5.github.io
  // 3. ???
  // 4. Profit

    this.acceleration;
    this.acceleration = 0.01; //default: 0.01
    this.maxSpeed = 0.02; //default: 0.04
    this.midAir = false;
    this.yVelocity = 0;
    this.xVelocity = 0;
    this.zVelocity = 0;
    this.oldPositionY;
    this.oldPositionX;
    this.oldPositionZ;
    this.gravity = 0.0000098;
    this.gravityOrientation = 'top to bottom';
    this.onTopOf;

  }

gameLoop() {

//BOTTY THINGS
  if (this.botRun) {
    this.model.lookAt(phongie.collisionBox.position);
    if (this.collisionBox.position.distanceTo(phongie.collisionBox.position) > 1) {
      this.sPressed = true;
    } else if (this.collisionBox.position.distanceTo(phongie.collisionBox.position) <= 1) {
      //this.sPressed = false;
      if (phongie.collisionBox.position.y > this.collisionBox.position.y) {
        this.spacePressed = true;
        this.sPressed = true;
      } else {
        this.spacePressed = false;
        this.sPressed = false;
      }
    }
    this.onePressed = true;
  } else {
    this.wPressed = false;
    this.aPressed = false;
    this.uPressed = false;
    this.sPressed = false;
    this.dPressed = false;
    this.spacePressed = false;
    this.onePressed = false;
  }

  if (phongie.developerView) {
  this.collisionBox.material.visible = true;
  this.collisionBox.material.transparent = true;
  this.collisionBox.material.opacity = 0.25;
} else if (!phongie.developerView) {                 //convert into a promise latter
  this.collisionBox.material.visible = false;
  this.collisionBox.material.transparent = undefined;
  this.collisionBox.material.opacity = undefined;
}
//END OF BOTTY THINGS

  if (this.onePressed) {
    this.pistolOut = true;
  } else {
    this.pistolOut = false;
  }

// F R  I  CK  T I O N

if (!this.midAir) {
  // only if not in the air, apply friction
  this.zVelocity *= 0.9;
  this.xVelocity *= 0.9;
}

// Weapon Selection Algorythm

    if (this.onePressed && this.pistolOut) {
      this.currentWeapon = this.pistol;
      this.model.add(this.pistol.model);
    } else if (this.onePressed && this.pistolOut === false) {
      this.currentWeapon = undefined;
      this.model.remove(this.pistol.model);
    }
    if (this.currentWeapon !== undefined) {
      this.currentWeapon.gameLoop();
    }

    // create a right triangle with the two velocities as its legs
    let velocityVector = new THREE.Vector3(this.xVelocity, 0, this.zVelocity);
    // if the hypotenuse of the right triangle (overall velocity) is too long
    if (velocityVector.length() > this.maxSpeed) {
      // shrink the triangle so that its hypotenuse is the max speed
      velocityVector.setLength(this.maxSpeed);
      // set the velocities to the new legs of the triangle
      this.xVelocity = velocityVector.x;
      this.zVelocity = velocityVector.z;
    }
    if (Math.abs(this.xVelocity) < 0.001) { //changed the specificness from 0.00001 to 0.001 lol
      this.xVelocity = 0;
    }
    if (Math.abs(this.zVelocity) < 0.001) {
      this.zVelocity = 0;
    }

    let acceleration;
    if (this.midAir) {
      acceleration = this.acceleration * 0.15;
    } else {
      acceleration = this.acceleration;
    }

      if (this.wPressed) {
          this.xVelocity -= Math.sin(this.model.rotation.y) * acceleration;
          this.zVelocity -= Math.cos(this.model.rotation.y) * acceleration;
      }
      if (this.aPressed) {
          this.xVelocity -= Math.cos(this.model.rotation.y) * acceleration;
          this.zVelocity += Math.sin(this.model.rotation.y) * acceleration;
      }
      if (this.sPressed) {
          this.xVelocity += Math.sin(this.model.rotation.y) * acceleration;
          this.zVelocity += Math.cos(this.model.rotation.y) * acceleration;
      }
      if (this.dPressed) {
          this.xVelocity += Math.cos(this.model.rotation.y) * acceleration;
          this.zVelocity -= Math.sin(this.model.rotation.y) * acceleration;
      }

      // start jumping when space is pressed
      if (this.spacePressed && !this.midAir) {
        this.midAir = true;
        this.yVelocity = 0.0044;
      }
      // when jumping
      if (this.midAir) {
          this.yVelocity = this.yVelocity - (changeInTime * this.gravity)
          this.collisionBox.position.y = this.oldPositionY + (changeInTime * this.yVelocity);
      }

      updateBoundingBox(this.collisionBox);
      if (this.gravityOrientation === 'top to bottom') {
        for (let i=0; i < collisionMap.length; i++) {
          //update the player's colision box all the time. this should maybe move to if the player moved.
          //if on top of the colision thing, stop falling.
          if ((this.collisionBox.position.y === collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2 + 0.0000000000000001) && (collisionMap[i] === this.onTopOf)) {
            this.midAir = false;
            this.yVelocity = 0;
            //checks if the player has moved since last calculation, if he has, fall and check if you colidie with anything.
            if (this.xVelocity || this.zVelocity) {
              this.collisionBox.position.y -= 0.001;
              updateBoundingBox(this.collisionBox);
              if (!this.collisionBox.boundingBox.intersectsBox(collisionMap[i].boundingBox)) { //used to be (this.collisionBox.position.y !== collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2) || (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox) === false)
                this.yVelocity = 0;
                this.midAir = true;
              }
              this.collisionBox.position.y += 0.001;
              updateBoundingBox(this.collisionBox);
            }
          //if not on top of the colision box, then check if you are coliding with the colision box, if you are, put yourself on top of the colision box and stop falling.
          } else if (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox)) {
            if (Math.sign(this.yVelocity) <= 0) {
              this.collisionBox.position.y = collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2 + 0.0000000000000001;
              console.log('position corrected, phongies y coordinate is now ' + this.collisionBox.position.y);
              updateBoundingBox(this.collisionBox);
              this.midAir = false;
              this.yVelocity = 0;
              this.onTopOf = collisionMap[i];
            } else if (Math.sign(this.yVelocity) > 0) {
              this.collisionBox.position.y = collisionMap[i].boundingBox.min.y - this.collisionBox.geometry.parameters.height/2 - 0.0000000000000001;
              console.log('position corrected, phongies y coordinate is now ' + this.collisionBox.position.y);
              updateBoundingBox(this.collisionBox);
              this.yVelocity = 0;
            }
          }
        }
      } else if (this.graivtyOrientation === 'bottom to top') {
        if ((this.collisionBox.position.y === collisionMap[i].boundingBox.min.y - this.collisionBox.geometry.parameters.height/2 - 0.0000000000000001) && (collisionMap[i] === this.onTopOf)) {
          this.midAir = false;
          this.yVelocity = 0;
          //checks if the player has moved since last calculation, if he has, fall and check if you colidie with anything.
          if (this.xVelocity || this.zVelocity) {
            this.collisionBox.position.y += 0.001;
            updateBoundingBox(this.collisionBox);
            if (!this.collisionBox.boundingBox.intersectsBox(collisionMap[i].boundingBox)) { //used to be (this.collisionBox.position.y !== collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2) || (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox) === false)
              this.yVelocity = 0;
              this.midAir = true;
            }
            this.collisionBox.position.y -= 0.001;
            updateBoundingBox(this.collisionBox);
          }
        //if not on top of the colision box, then check if you are coliding with the colision box, if you are, put yourself on top of the colision box and stop falling.
        } else if (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox)) {
          if (Math.sign(this.yVelocity) >= 0) {
            this.collisionBox.position.y = collisionMap[i].boundingBox.min.y - this.collisionBox.geometry.parameters.height/2 - 0.0000000000000001;
            console.log('position corrected, phongies y coordinate is now ' + this.collisionBox.position.y);
            updateBoundingBox(this.collisionBox);
            this.midAir = false;
            this.yVelocity = 0;
            this.onTopOf = collisionMap[i];
          } else if (Math.sign(this.yVelocity) < 0) {
            this.collisionBox.position.y = collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2 + 0.0000000000000001;
            console.log('position corrected, phongies y coordinate is now ' + this.collisionBox.position.y);
            updateBoundingBox(this.collisionBox);
            this.yVelocity = 0;
          }
        }
      };
//for sean debugging
      for (let {boundingBox} of collisionMap) if (intersectsBoxButSide(this.collisionBox.boundingBox, boundingBox)) {
              console.log('!!!', boundingBox.min, boundingBox.max, this.collisionBox.boundingBox.min, this.collisionBox.boundingBox.max);
              throw new Error('!!!');
            }

  this.collisionBox.position.x += this.xVelocity;
  updateBoundingBox(this.collisionBox);
  //allways be moving!

  for (let i=0; i < collisionMap.length; i++) {
    //update the player's colision box all the time. this should maybe move to if the player moved
    //if on top of the colision thing, stop falling.
    if ((this.collisionBox.position.x === collisionMap[i].boundingBox.max.x + this.collisionBox.geometry.parameters.width/2 + 0.0000000000000001) || (this.collisionBox.position.x === collisionMap[i].boundingBox.min.x - this.collisionBox.geometry.parameters.width/2 - 0.0000000000000001)) {
      this.xVelocity = 0;
    //if not on top of the colision box, then check if you are coliding with the colision box, if you are, put yourself on top of the colision box and stop falling.
    } else if (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox)) {
      if (Math.sign(this.xVelocity) === -1) {
        this.collisionBox.position.x = collisionMap[i].boundingBox.max.x + this.collisionBox.geometry.parameters.width/2 + 0.0000000000000001;
        this.xVelocity = 0;
      } else if (Math.sign(this.xVelocity) === 1) {
        this.collisionBox.position.x = collisionMap[i].boundingBox.min.x - this.collisionBox.geometry.parameters.width/2 - 0.0000000000000001;
        this.xVelocity = 0;
      }
      updateBoundingBox(this.collisionBox);
      console.log('position corrected, phongies x coordinate is now ' + this.collisionBox.position.x);
    }
  };

  this.collisionBox.position.z += this.zVelocity;
  updateBoundingBox(this.collisionBox);
  //allways be moving!

  for (let i=0; i < collisionMap.length; i++) {
    //update the player's colision box all the time. this should maybe move to if the player moved.
    //if on top of the colision thing, stop falling.
    if ((this.collisionBox.position.z === collisionMap[i].boundingBox.max.z + this.collisionBox.geometry.parameters.depth/2) || (this.collisionBox.position.z === collisionMap[i].boundingBox.min.z - this.collisionBox.geometry.parameters.depth/2 - 0.0000000000000001)) {
    this.zVelocity = 0;
    //if not on top of the colision box, then check if you are coliding with the colision box, if you are, put yourself on top of the colision box and stop falling.
    } else if (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox)) {
      if (Math.sign(this.zVelocity) === -1) {
        this.collisionBox.position.z = collisionMap[i].boundingBox.max.z + this.collisionBox.geometry.parameters.depth/2 + 0.0000000000000001;
        this.zVelocity = 0;
      } else if (Math.sign(this.zVelocity) === 1) {
        this.collisionBox.position.z = collisionMap[i].boundingBox.min.z - this.collisionBox.geometry.parameters.depth/2 - 0.0000000000000001;
        this.zVelocity = 0;
      }
      updateBoundingBox(this.collisionBox);
      console.log('position corrected,' + this.name + 's z coordinate is now ' + this.collisionBox.position.z);
    }
  };

    this.oldPositionY = this.collisionBox.position.y;
    this.oldPositionX = this.collisionBox.position.x;
    this.oldPositionZ = this.collisionBox.position.z;


  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// #PISTOL CODE!
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// giigle fleunk
class PISTOL {
  constructor(player) {
    // store player in PISTOL instance
    // ...`this` refers to the PISTOL instance

    // inside the constructor, you can use `player`, but gameLoop doesn't have access to it
    // unless you do this.player (reason the stuff bellow makes sense)
    this.player = player; // i dont get this...
    this.model = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.2, 0.3),
        new THREE.MeshPhongMaterial({color: 0x363330})
    );
     // NOTE: gamepro5, you don't actually need to declare this. properties

    // set the offset position
    this.model.position.set(1, -0.3, -0.8);

    document.addEventListener('keydown', (event) => {

        switch (event.key) {
            case 'f':
                this.fPressed = true;
            break;
        }
    });
    document.addEventListener('keyup', (event) => {

        switch (event.key) {
            case 'f':
                this.fPressed = false;
            break;
        }
    });

    document.addEventListener('mousedown', (event) => {

      // event.which is 1 then its the left mouse btn
      // 2 - middle, 3 - RMB, 4 is abstract, etc.

        switch (event.which) {
            case 1:
                this.LmousePressed = true;
            break;
            case 3:
                this.RmousePressed = true;
            break;
            case 'f':
                this.fPressed = true;
            break;
        }
    });

    document.addEventListener('mouseup', (event) => {

      switch (event.which) {
          case 1:
              this.LmousePressed = false;
          break;
          case 3:
              this.RmousePressed = false;
          break;
          case 'f':
                this.fPressed = false;
          break;
        }
    });


    this.shooting = false;

  }

  gameLoop() {

  if (this.LmousePressed) {
    this.shooting = true;
  } else {
    this.shooting = false;
  }
  if (this.fPressed) {
    this.model.rotation.y += 0.5;
  }

    if (this.shooting) {
      let bullet = new BULLET(this.pistol);
      bullet.pistol = this; // inside BULLET, this.pistol will reference this PISTOL instance
      // inside BULLET, it can do this.pistol.etc
      bullet.model.position.copy(this.model.getWorldPosition(new THREE.Vector3()));
      bullet.model.quaternion.copy(this.model.getWorldQuaternion(new THREE.Quaternion()));
      //bullet.model.quaternion.copy(this.player.camera.getWorldQuaternion(new THREE.Quaternion())); // good for aim, not realistic.
      allBullets.push(bullet);

  }

  }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// #PISTOL BULLET CODE!
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


class BULLET {

  constructor(pistol) {
    this.pistol = null;
    this.speed = 0.004; // units per millisecond (0.4 is probably too fast)
    scene.add(this.model = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.05, 0.3),
        new THREE.MeshPhongMaterial({color: 0x595959})
    ));
  }

  gameLoop() {
    this.model.translateZ(-this.speed * changeInTime);
    //bullet.position++
  }

  remove() {
    scene.remove(this.model);
    allBullets.splice(allBullets.indexOf(this), 1); // remove `this` bullet from the array
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// #INITIAL CODE!
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const canvas = document.querySelector('#c'); // what id the canvas tag needs to have for it to append it to
const renderer = new THREE.WebGLRenderer({canvas}); // attaches rendering to display inside the canvas tag
let rect = canvas.getBoundingClientRect();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(rect.width, rect.height, false);
const scene = new THREE.Scene(); // creates the scene
scene.background = new THREE.Color(0x00c0f5);

let thirdPersonCamera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 99999);
thirdPersonCamera.position.z = 3;

let oldTime;
let changeInTime;

let allBullets = [];
let collisionMap = [];

window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){

    rect = canvas.getBoundingClientRect();

    phongie.camera.aspect = rect.width / rect.height;
    phongie.camera.updateProjectionMatrix();

    renderer.setSize(rect.width, rect.height, false);

}

/*let floor;
scene.add(floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshPhongMaterial({color: 0xffff00, side: THREE.DoubleSide})
));*/

//~~~~~~~
let floor;
scene.add(floor = new THREE.Mesh(
    new THREE.BoxGeometry(1000, 0.2, 1000), //y used to be 0.2
    new THREE.MeshPhongMaterial({color: 0x00cc0a, side: THREE.DoubleSide})
));
  floor.geometry.computeBoundingBox();
  floor.boundingBox = floor.geometry.boundingBox.clone();

  floor.position.y = -floor.geometry.parameters.height/2; //-0.5
  updateBoundingBox(floor);

  collisionMap.push(floor);
//~~~~~~~
let referenceBox;
scene.add(referenceBox = new THREE.Mesh(
    new THREE.BoxGeometry(1, 50, 1),
    new THREE.MeshPhongMaterial({color: 0x754c1c, side: THREE.DoubleSide})
));
  referenceBox.geometry.computeBoundingBox();
  referenceBox.boundingBox = referenceBox.geometry.boundingBox.clone();

  referenceBox.position.y = 0 + referenceBox.geometry.parameters.height/2; //-0.5
  updateBoundingBox(referenceBox);

  collisionMap.push(referenceBox);
//~~~~~~~
let smallBox;
scene.add(smallBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshPhongMaterial({color: 0x754c1c, side: THREE.DoubleSide})
));
  smallBox.geometry.computeBoundingBox();
  smallBox.boundingBox = smallBox.geometry.boundingBox.clone();

  smallBox.position.y = 0 + smallBox.geometry.parameters.height/2; //-0.5
  smallBox.position.x = 2.4;
  smallBox.position.z = 1.3;
  updateBoundingBox(smallBox);

  collisionMap.push(smallBox);
//~~~~~~~
let ceiling;
scene.add(ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.2, 5),
    new THREE.MeshPhongMaterial({color: 0xFF0000, side: THREE.DoubleSide})
));
    ceiling.geometry.computeBoundingBox();
    ceiling.boundingBox = ceiling.geometry.boundingBox.clone();

    ceiling.position.y = 0 + ceiling.geometry.parameters.height/2 + 0.8; //-0.5
    ceiling.position.x = -2.6;
    ceiling.position.z = 3.7;
    updateBoundingBox(ceiling);

    collisionMap.push(ceiling);
//~~~~~~~
    let box2;
    scene.add(box2 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshPhongMaterial({color: 0xFF0000, side: THREE.DoubleSide})
    ));
        box2.geometry.computeBoundingBox();
        box2.boundingBox = box2.geometry.boundingBox.clone();

        box2.position.y = 0 + box2.geometry.parameters.height/2; //-0.5
        box2.position.x = 2;
        box2.position.z = 3.7;
        updateBoundingBox(box2);

        collisionMap.push(box2);

//~~~~~~~
let refrenceBox2;
scene.add(refrenceBox2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhongMaterial({color: 0x0000FF, side: THREE.DoubleSide})
));
    refrenceBox2.geometry.computeBoundingBox();
    refrenceBox2.boundingBox = refrenceBox2.geometry.boundingBox.clone();

    refrenceBox2.position.y = 0 + refrenceBox2.geometry.parameters.height/2; //-0.5
    refrenceBox2.position.x = 2;
    refrenceBox2.position.z = 4.75;
    updateBoundingBox(refrenceBox2);

    collisionMap.push(refrenceBox2);
//~~~~~~~
    let flatPane;
    scene.add(flatPane = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.2, 1),
        new THREE.MeshPhongMaterial({color: 0x0000FF, side: THREE.DoubleSide})
    ));
        flatPane.geometry.computeBoundingBox();
        flatPane.boundingBox = flatPane.geometry.boundingBox.clone();

        flatPane.position.y = 0 + flatPane.geometry.parameters.height/2; flatPane.position.x = 2;
        flatPane.position.x = 4;
        flatPane.position.z = 3;
        updateBoundingBox(flatPane);

        collisionMap.push(flatPane);
//~~~~~~~
let rotatedBox;
scene.add(rotatedBox = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhongMaterial({color: 0x0000FF, side: THREE.DoubleSide})
));
    rotatedBox.geometry.computeBoundingBox();
    rotatedBox.boundingBox = rotatedBox.geometry.boundingBox.clone();

    rotatedBox.position.y = 0.5 + rotatedBox.geometry.parameters.height/2; rotatedBox.position.x = 2;
    rotatedBox.position.x = 6;
    rotatedBox.position.z = 8;
    rotatedBox.rotation.x = 45 * Math.PI/180;
    rotatedBox.rotation.y = 45 * Math.PI/180;

    updateBoundingBox(rotatedBox);

    collisionMap.push(rotatedBox);
//~~~~~~~
let light;
scene.add(light = new THREE.AmbientLight(0xFFFFFF, 0.3));
//~~~~~~~
let pointLight;
scene.add(pointLight = new THREE.PointLight(0xFFFFFF, 1));
pointLight.position.set(-1, 2, 4);
//~~~~~~~

//          ,ww
//    wWWWWWWW_)
//    `WWWWWW'
//     II  II
//
// by pb from http://ascii.co.uk/art/sheep

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// #MAIN CODE!
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let phongie = new PLAYER();
let bot = new AI_BOT();

function render(time) { // the game run loop, stuff that happens every game frame. hi!

    changeInTime = Date.now() - oldTime;
    //console.log('Frame Time Diffrence: ' + changeInTime + ' ms');

    phongie.gameLoop(); // stuff related to the player instance
    bot.gameLoop(); //stuff related to the bot instance

    for (let i = 0; i < allBullets.length; i++) {
      allBullets[i].gameLoop();
      if ((Math.abs(allBullets[i].model.position.x) > 5) || (Math.abs(allBullets[i].model.position.y) > 5) || (Math.abs(allBullets[i].model.position.z) > 5)) {
        scene.remove(allBullets[i].model)//move to bullet class
        allBullets.splice(i, 1);
      }
  }

    renderer.render(scene, phongie.useThirdPerson ? bot.camera : phongie.camera);

    oldTime = Date.now();

    requestAnimationFrame(render);
}
requestAnimationFrame(render);
