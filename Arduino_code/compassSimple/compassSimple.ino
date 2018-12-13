#include <Servo.h>

#include <Wire.h>
#include <LSM303.h>

LSM303 compass;
Servo myservo; // create servo object to control a servo

int pos = 0; // variable to store the servo position

double xt;
int t;

double cma;

void resetCma()
{

  t = 20;
  cma = 0;
}

void setup()
{
  Serial.begin(9600);
  Wire.begin();
  compass.init();
  compass.enableDefault();

  /*
  Calibration values; the default values of +/-32767 for each axis
  lead to an assumed magnetometer bias of 0. Use the Calibrate example
  program to determine appropriate values for your particular unit.
  */
  compass.m_min = (LSM303::vector<int16_t>){-32767, -32767, -32767};
  compass.m_max = (LSM303::vector<int16_t>){+32767, +32767, +32767};

  myservo.attach(9); // attaches the servo on pin 9 to the servo object

  resetCma();
}

void loop()
{
  compass.read();

  /*
  When given no arguments, the heading() function returns the angular
  difference in the horizontal plane between a default vector and
  north, in degrees.
  
  The default vector is chosen by the library to point along the
  surface of the PCB, in the direction of the top of the text on the
  silkscreen. This is the +X axis on the Pololu LSM303D carrier and
  the -Y axis on the Pololu LSM303DLHC, LSM303DLM, and LSM303DLH
  carriers.
  
  To use a different vector as a reference, use the version of heading()
  that takes a vector argument; for example, use
  
    compass.heading((LSM303::vector<int>){0, 0, 1});
  
  to use the +Z axis as a reference.
  */
  float heading = compass.heading();

  xt = heading;

  cma = (xt + t * cma) / (t + 1);

  Serial.print(heading);
  Serial.print(',');
  Serial.print(cma);
  Serial.println();

  myservo.write(((int(cma) - 5) % 170) + 5);
}
