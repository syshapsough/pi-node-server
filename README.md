# Setup
The following sections explain the required steps to prepare the PC/Mac and the Raspberry Pi
# PC/MAC
## CouchDB
Install the latest version of CouchDB version 1 or 2 from http://couchdb.apache.org/#download
### NodeJS
Install the latest NodeJS from https://nodejs.org/en/download/current/
## Wireshark
Install the latest version of Wireshark from https://www.wireshark.org/download.html
 
# RPi
Preparing the Raspberry Pi
1.	Download Raspbian and copy it to the SD card
2.	Connect the RPi to a monitor, mouse, keyboard
3.	Connect to a WiFi network
4.	Open terminal
5.	Run ifconfig to find the RPi’s IP address
6.	Type in sudo apt-get update
7.	Type in sudo apt-get upgrade

## Running Raspberry Pi Headless
### Setting up static IPs
If you already found the IP address through the previous section, jump to step 6
P.s. steps (1-4) will only work if you burned Raspbian onto the SD card, and may not work if you started with Noobs
1.	Plug the SD card reader into your computer
2.	Open the cmdline.txt file and append the following
`ip=192.168.1.200::192.168.1.1:255.255.255.0:rpi:eth0:off`
3.	Plug the SD card back into the RPi, then connect the RPi to your computer using an ethernet cable
4.	From the network settings on your computer, set you ethernet IP to `192.168.1.201` (or any IP that falls within the same network). Set the network mask to `255.255.255.0` and the gateway to `192.168.1.1`
5.	From your computer’s terminal, try `ping 192.168.1.200`

### Connecting through SSH
The follwoing commands will work on Mac machines only. To SSH from Windows, use PuTTY (http://www.putty.org/)
6.	Type in `ssh pi@x.x.x.x where x.x.x.x` is the IP address of your Pi
7.	Enter raspberry when asked for the password
8.	You now have access to the Pi through its terminal

## Installing NodeJS
1.	In the RPi’s terminal, type in uname -m to find the RPi’s circuit board model. If the board is ARM7 or higher, you can proceed.
2.	Run curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash – to grab the latest NodeJS distribution (current one is 9.3)
3.	Next, run sudo apt install nodejs to proceed with installing the new NodeJS
4.	To verify your installation, run node -v

## Installing NMON
NMON is a system performance tool for Linux-based systems.
It can be installed using apt-get:
`sudo apt-get install nmon`
Test if it was installed correctly by typing nmon in terminal.
Visit http://nmon.sourceforge.net/pmwiki.php?n=Site.Documentation for options.
Resulting nmon files can be viewed using several tools, we recommend NMONVisualizer https://nmonvisualizer.github.io/nmonvisualizer/
 
 
# VNC
## Raspberry Pi
### Download realVNC
From terminal, run the following commands
```
sudo apt-get update
sudo apt-get install realvnc-vnc-server realvnc-vnc-viewer
```
### Enable VNC
From terminal, run the following command
`sudo raspi-config`
Navigate to **Interfacing Options**, then scroll down and select **VNC > Yes**.
Restart
`sudo reboot`

## PC/Mac
Install VNC viewer from https://www.realvnc.com/en/connect/download/viewer/

## Usage
Open VNCViewer on your computer, and type the IP address of the Raspberry Pi followed by port **5900** e.g. **x.x.x.x:5900**, then enter the Raspberry Pi’s username and password
![Screenshot](/images/vnc.png?raw=true "Connect to your RPi")
![Screenshot](/images/vnc2.png?raw=true "Login")
