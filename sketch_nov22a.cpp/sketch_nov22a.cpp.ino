    /* Photocell simple testing sketch. 
     
    Connect one end of the photocell to 5V, the other end to Analog 0.
    Then connect one end of a 10K resistor from Analog 0 to ground 
    Connect LED from pin 11 through a resistor to ground 
    For more information see http://learn.adafruit.com/photocells */
     
    int photocellPin1 = 0;     // the cell and 10K pulldown are connected to a0
    int photocellReading1;     // the analog reading from the sensor divider
    int photocellPin2 = 2;     // the cell and 10K pulldown are connected to a0
    int photocellReading2;  
    int photocellPin3 = 4;     // the cell and 10K pulldown are connected to a0
    int photocellReading3;  
    int LEDpin = 11;          // connect Red LED to pin 11 (PWM pin)
    int LEDbrightness;        // 
    void setup(void) {
      // We'll send debugging information via the Serial monitor
      Serial.begin(9600);   
    }
     
    void loop(void) {
      photocellReading1 = analogRead(photocellPin1);  
      photocellReading2 = analogRead(photocellPin2);  
      photocellReading3 = analogRead(photocellPin3);  
     
      //Serial.print("Analog reading = ");
      Serial.print(photocellReading1); 
      Serial.print(",");// the raw analog reading
      Serial.print(photocellReading2);
      Serial.print(",");
      Serial.println(photocellReading3);
      
      // LED gets brighter the darker it is at the sensor
      // that means we have to -invert- the reading from 0-1023 back to 1023-0
      //photocellReading = 1023 - photocellReading;
      //now we have to map 0-1023 to 0-255 since thats the range analogWrite uses
      //LEDbrightness = map(photocellReading, 0, 1023, 0, 255);
      //analogWrite(LEDpin, LEDbrightness);
     
      delay(100);
    }
