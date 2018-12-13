#include "CompassCMA.hpp"

#include <Servo.h>

Servo myservo; // create servo object to control a servo

CompassCMA *compass;

void setup()
{
  compass = new CompassCMA();

  Serial.begin(9600);

  Serial.println("setup");

  myservo.attach(9); // attaches the servo on pin 9 to the servo object
}

void loop()
{

  float heading = compass->read();

  Serial.print(compass->rawHeading());
  Serial.print(',');
  Serial.print(heading);
  Serial.println();

  myservo.write(((int(heading) - 5) % 170) + 5);
}
