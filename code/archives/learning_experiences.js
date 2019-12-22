//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//#THE CODE THAT DIDN'T WORK
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

if ((Math.sign(this.yVelocity) === 1) || (Math.sign(this.yVelocity) === 0)) {
  this.verticalCheckDirection === 'upwards';
} else if ((Math.sign(this.yVelocity) === -1) || (Math.sign(this.yVelocity) === 0)) {
  this.verticalCheckDirection === 'downwards';
}

for (let i=0; i < collisionMap.length; i++) {
  //update the player's colision box all the time. this should maybe move to if the player moved
  //if on top of the colision thing, stop falling.
  if ((this.collisionBox.position.y === collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2) || (this.collisionBox.position.y === collisionMap[i].boundingBox.min.y - this.collisionBox.geometry.parameters.height/2)) {
    this.xVelocity = 0;
    if (this.xVelocity || this.zVelocity) {
      if (this.verticalCheckDirection === 'downwards') {
        this.collisionBox.position.y -= 0.001;
        updateBoundingBox(this.collisionBox);
        if (!this.collisionBox.boundingBox.intersectsBox(collisionMap[i].boundingBox)) { //used to be (this.collisionBox.position.y !== collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2) || (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox) === false)
          this.yVelocity = 0;
          this.midAir = true;
          console.log('LOOOL NERD! midair is ' + this.midAir);
        }
        this.collisionBox.position.y += 0.001;
        updateBoundingBox(this.collisionBox);
      } else if (this.verticalCheckDirection === 'upwards') {
        this.collisionBox.position.y += 0.001;
        updateBoundingBox(this.collisionBox); //probably useless
        if (!this.collisionBox.boundingBox.intersectsBox(collisionMap[i].boundingBox)) { //used to be (this.collisionBox.position.y !== collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2) || (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox) === false)
          this.yVelocity = 0;
        }
        this.collisionBox.position.y -= 0.001;
        updateBoundingBox(this.collisionBox);
      }
    }
  //if not on top of the colision box, then check if you are coliding with the colision box, if you are, put yourself on top of the colision box and stop falling.
  } else if (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox)) {
    if ((this.verticalCheckDirection === 'downwards')) {
      this.collisionBox.position.y = collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2;
      this.yVelocity = 0;
    } else if (this.verticalCheckDirection === 'upwards') {
      this.collisionBox.position.y = collisionMap[i].boundingBox.min.y - this.collisionBox.geometry.parameters.width/2;
      this.yVelocity = 0;
    }
    updateBoundingBox(this.collisionBox);
    console.log('position corrected, phongies y coordinate is now ' + this.collisionBox.position.y);
  }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~idk why im keeping this

updateBoundingBox(this.collisionBox);
//for loop goes though each thing the player can colide with.
for (let i=0; i < collisionMap.length; i++) {
  //update the player's colision box all the time. this should maybe move to if the player moved.
  //if on top of the colision thing, stop falling.
  if (this.collisionBox.position.y === collisionMap[i].boundingBox.min.y - this.collisionBox.geometry.parameters.height/2) {
    this.yVelocity = 0;
    //checks if the player has moved since last calculation, if he has, fall and check if you colidie with anything.
    if (this.xVelocity || this.zVelocity) {
      this.collisionBox.position.y += 0.001;
      updateBoundingBox(this.collisionBox);
      if (!this.collisionBox.boundingBox.intersectsBox(collisionMap[i].boundingBox)) { //used to be (this.collisionBox.position.y !== collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2) || (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox) === false)
        this.yVelocity = 0;
        console.log('LOOOL NERD! midair is ' + this.midAir);
      }
      this.collisionBox.position.y -= 0.001;
      updateBoundingBox(this.collisionBox);
    }
  //if not on top of the colision box, then check if you are coliding with the colision box, if you are, put yourself on top of the colision box and stop falling.
  } else if (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox)) {
    this.collisionBox.position.y = collisionMap[i].boundingBox.min.y - this.collisionBox.geometry.parameters.height/2;
    console.log('position corrected, phongies y coordinate is now ' + this.collisionBox.position.y);
    updateBoundingBox(this.collisionBox);
    this.yVelocity = 0;
  }
};

updateBoundingBox(this.collisionBox);
//for loop goes though each thing the player can colide with.
for (let i=0; i < collisionMap.length; i++) {
  //update the player's colision box all the time. this should maybe move to if the player moved.
  //if on top of the colision thing, stop falling.
  if (this.collisionBox.position.y === collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2) {
    this.midAir = false;
    this.yVelocity = 0;
    //checks if the player has moved since last calculation, if he has, fall and check if you colidie with anything.
    if (this.xVelocity || this.zVelocity) {
      this.collisionBox.position.y -= 0.001;
      updateBoundingBox(this.collisionBox);
      if (!this.collisionBox.boundingBox.intersectsBox(collisionMap[i].boundingBox)) { //used to be (this.collisionBox.position.y !== collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2) || (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox) === false)
        this.yVelocity = 0;
        this.midAir = true;
        console.log('LOOOL NERD! midair is ' + this.midAir);
      }
      this.collisionBox.position.y += 0.001;
      updateBoundingBox(this.collisionBox);
    }
  //if not on top of the colision box, then check if you are coliding with the colision box, if you are, put yourself on top of the colision box and stop falling.
  } else if (intersectsBoxButSide(this.collisionBox.boundingBox, collisionMap[i].boundingBox)) {
    this.collisionBox.position.y = collisionMap[i].boundingBox.max.y + this.collisionBox.geometry.parameters.height/2;
    console.log('position corrected, phongies y coordinate is now ' + this.collisionBox.position.y);
    updateBoundingBox(this.collisionBox);
    this.midAir = false;
    this.yVelocity = 0;
  }
};



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//#THE PYTHAGOREAN THEOREM PROBLEM
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// if (this.speed > this.maxSpeed || this.speed < -this.maxSpeed) {
//   this.speed = this.maxSpeed
// }
/*if (this.xVelocity > this.maxSpeed) {
  this.xVelocity = this.maxSpeed;
} else if (this.xVelocity < -this.maxSpeed) {
  this.xVelocity = -this.maxSpeed;
} else if (Math.abs(this.xVelocity) < 0.001) {
  this.xVelocity = 0;
}
if (this.zVelocity > this.maxSpeed) {
  this.zVelocity = this.maxSpeed;
} else if (this.zVelocity < -this.maxSpeed) {
  this.zVelocity = -this.maxSpeed;
} else if (Math.abs(this.zVelocity) < 0.001) {
  this.zVelocity = 0;
}*/
// the following avoids a dumb problem. if you were pointing in some direction,
// the old system (above) would max out a velocity in one direction, then the other,
// and in the end it'd be travelling at 45°
// https://www.desmos.com/calculator/tdjboxtorw

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
// if ((xVelocity || zVelocity) < )
