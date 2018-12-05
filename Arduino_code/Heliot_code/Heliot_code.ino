    #include <Servo.h>
    
    int servo_pin = 10;
    int presence_pin = 11;
    int battery_data_pin = 12;
    
    Servo servo;

    // -----------------------------------------------
    String deviceType = "Heliot"; // Device type (Sensor, Heliot)

    // ------------------------------------------------ COMMON METHODS
    void initSerialCommunication() {
      Serial.begin(9600);
    }
    // -----------------------------------------------
    void sendData(int data[], int dataCount) {
      Serial.print(deviceType);
      for(int i=0;i<dataCount;++i) {
        Serial.print(",");
        Serial.print(data[i]);
      }
      Serial.println();
    }
    // -----------------------------------------------
    int* recieveData() {
      
      static int data[255];
      for(int i=0;i<255;++i) {
        data[i] = 0;
      }

      if(Serial.available() > 0) {

        int i = 0;
        String valueBuffer = "";
        
        while(Serial.available()) {
          char c = Serial.read();
          if(c == ',' || c == '\n') {
            data[i] = valueBuffer.toInt();
            i++;
            valueBuffer = "";
          } else {
            valueBuffer += c;
          }
        }
        
      }
      
      return data;
    }
    // -----------------------------------------------

    void moveToPosition(int panPosition) {
      if(panPosition > 180) {
        panPosition = 180;
      }
      servo.write(panPosition);
    }
    
    // ------------------------------------------------ INIT CODE
    void setup(void) {
      initSerialCommunication();
      moveToPosition(0);
      servo.attach(servo_pin);
    }
    
    // ------------------------------------------------ RUNNING CODE
    void loop(void) {

      int* data = recieveData();
      if( data[0] == 1 ) {
        int panPosition = data[1];
        moveToPosition(panPosition);
      }

      int servoPosition = servo.read();
      int presenceData = 0;
      int batteryData = 0;
      int outData[3] = {servoPosition,presenceData,batteryData};

      sendData(outData,3);
     
      delay(100);
    }
