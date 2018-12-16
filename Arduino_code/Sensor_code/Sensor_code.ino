#include "CompassCMA.hpp"

int photocellPin1 = 0;
int photocellReading1;

int photocellPin2 = 2;
int photocellReading2;

int photocellPin3 = 1;
int photocellReading3;

// -----------------------------------------------
String deviceType = "Sensor"; // Device type (Sensor, Heliot)

// ------------------------------------------------ COMMON METHODS
void initSerialCommunication()
{
  Serial.begin(9600);
}
// -----------------------------------------------
void sendData(int data[], int dataCount)
{
  Serial.print(deviceType);
  for (int i = 0; i < dataCount; ++i)
  {
    Serial.print(",");
    Serial.print(data[i]);
  }
  Serial.println();
}
// -----------------------------------------------
int *recieveData()
{

  static int data[255];
  for (int i = 0; i < 255; ++i)
  {
    data[i] = 0;
  }

  if (Serial.available() > 0)
  {

    int i = 0;
    String valueBuffer = "";

    while (Serial.available())
    {
      char c = Serial.read();
      if (c == ',' || c == '\n')
      {
        data[i] = valueBuffer.toInt();
        i++;
        valueBuffer = "";
      }
      else
      {
        valueBuffer += c;
      }
    }
  }

  return data;
}
// -----------------------------------------------

CompassCMA *compass;

// ------------------------------------------------ INIT CODE
void setup(void)
{
  initSerialCommunication();

  compass = new CompassCMA();
}

// ------------------------------------------------ RUNNING CODE
void loop(void)
{

  float heading = compass->read();

  int photocellWest;
  int photocellEast;

  if (CompassCMA::NORTH_VALUE - 90 < heading && heading < CompassCMA::NORTH_VALUE + 90)
  {
    photocellWest = photocellPin1;
    photocellEast = photocellPin3;
  }
  else
  {
    photocellWest = photocellPin3;
    photocellEast = photocellPin1;
  }

  photocellReading1 = analogRead(photocellWest);
  photocellReading2 = analogRead(photocellPin2);
  photocellReading3 = analogRead(photocellEast);

  int outData[3] = {photocellReading1, photocellReading2, photocellReading3};
  sendData(outData, 3);

  delay(100);
}
