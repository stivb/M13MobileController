#define ledPin 13
int state = 0;
String s;
char C;
bool lightOn=false;

void toggleLight()
{
  if (lightOn) {digitalWrite(ledPin, LOW);lightOn=false;}
  else {digitalWrite(ledPin, HIGH);lightOn=true;}
}

int getStringSizeFromPtr(char *ptr)
{
    //variable used to access the subsequent array elements.
    int offset = 0;
    //variable that counts the number of elements in your array
    int count = 0;

    //While loop that tests whether the end of the array has been reached
    while (*(ptr + offset) != '\0')
    {
        //increment the count variable
        ++count;
        //advance to the next element of the array
        ++offset;
    }
    //return the size of the array
    return count;
}
void setup() {
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
  Serial.begin(38400); // Default communication rate of the Bluetooth module
}
void loop() {
  if(Serial.available() > 0){ // Checks whether data is comming from the serial port
    s = Serial.readString(); // Reads the data from the serial port
    if (s.indexOf(':')==-1) return;
    char buf[s.length()+1];
    s.toCharArray(buf, sizeof(buf));
    char *p = buf;
    char *str;
    int ct;
    ct =0;
    while ((str = strtok_r(p, ":", &p)) != NULL) // delimiter is the colon
    {
      Serial.println(str);
      if (ct==1)
      {
        int i;
        int limit = getStringSizeFromPtr(str);
        for (i=0;i<limit;i++)
          {
            C = str[i];
            int num = strtol (&C ,NULL,16); 
            Serial.println(num);
          }
      }
      ct++;
    }
      
 toggleLight(); 
 s = "";
 }
}
