

#include <Wire.h>
#include <LSM303.h>

class CompassCMA
{

  private:
    LSM303 compass;

    int pos; // variable to store the servo position

    int t;

    double cma;

  public:

    static const int NORTH_VALUE = 90;

    CompassCMA();

    float rawHeading();
    float read();
};
