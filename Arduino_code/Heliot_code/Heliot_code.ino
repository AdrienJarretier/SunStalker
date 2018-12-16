#include "CompassCMA.hpp"

#include <Servo.h>

int servo_pin = 10;
int presence_pin = 11;
int SOLAR_CELL_ANALOG_PIN = 0;

Servo servo;

// -----------------------------------------------
String deviceType = "Heliot"; // Device type (Sensor, Heliot)

// ------------------------------------------------ COMMON METHODS
void initSerialCommunication()
{
  Serial.begin(9600);
}
// -----------------------------------------------
void sendData(float data[], int dataCount)
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
int *receiveData()
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

void moveToPosition(int panPosition)
{
  if (panPosition > 180)
  {
    panPosition = 180;
  }
  servo.write(panPosition);
}

CompassCMA *compass;

// ------------------------------------------------ INIT CODE
void setup(void)
{
  initSerialCommunication();

  compass = new CompassCMA();

  moveToPosition(0);
  servo.attach(servo_pin);
}

// ------------------------------------------------ RUNNING CODE
void loop(void)
{

  int *data = receiveData();
  if (data[0] == 1)
  {
    int panPosition;

    float heading = compass->read();
    if (CompassCMA::NORTH_VALUE - 90 < heading && heading < CompassCMA::NORTH_VALUE + 90)
    {
      panPosition = data[1];
    }
    else
    {
      panPosition = 180 - data[1];
    }

    moveToPosition(panPosition);
  }

  float servoPosition = servo.read();
  float solarCellVoltage = float(analogRead(SOLAR_CELL_ANALOG_PIN)) / 204.8;
  float presenceData = 0;
  float outData[3] = {servoPosition, solarCellVoltage, presenceData};

  sendData(outData, 3);

  delay(50);
}
