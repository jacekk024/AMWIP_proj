# AMWIP_proj

Web application to control LED display and get data from SenseHat. 
In this project we communicate with Raspberry PI which is connect with sensors in SenseHat. 
From server we get information about temperature, humidity, pressure and position of joystick.
We send to server RGB matrix which is set on display.
Pc and raspberry are in the same network, and they are connect by SSH to send data.
Information from sensors are collect and tranceive in JSON to client.
Data from SenseHat are plot in charts. 
