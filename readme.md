# PNSMN - Pose ta Node Sur Mon Network

## /!\ This version might be deprecated.. A new UI is being developed. New features include:
-Network topology
-Range scanning
-iface selection
-attack plugins integration and stuff

## Introduction
This is a quick project I made to learn NodeJS, therefore, some part of the code might be a bit sh**ty, any tips and advices are welcomed :) ! PNSMN is a NodeJS based live JavaScript injection tool. Able to discover clients on the network, PNSMN allows to inject a hooking script into any machine found on the network.
This script will then allow attacks to be triggered in real time from the UI to the client such as live text modification, live input scanning (keylogger), live redirection and a lot more.

## Installing PNMSN
PNSMN was originally designed to be installed on raspberry pi running kali linux in order to be used as a mobile "penetration testing ;)" platform but can of course be installed on any debian os.

### Prerequisite
-NodeJS V6 or higher<br />
-nmap (network scanning tool)<br />
-MITMf (powerful man in the middle tool)<br />
-Dickbutt (illustration of an anthropomorphic phallus with a pair of testicles and a penis protruding from its backside)<br />

### Step - 1
Clone the git repository in the folder of yout choice
```
cd <path to install>
git clone https://github.com/MIDMX/PNSMN
```

### Step - 2
Install node packages from "packages.json" file
```
cd <installation path>/PNSMN_UI
npm install
```
No error ? Installation was successfull :) <br/>
An error ? Please comment below and I will do my best to solve it for ya mate !

## Utilisation
### Logging In
Start the node server form your terminal:
```
cd <installation path>/PNSMN_UI
node index.js
```
The server is now up and running. Open your favorite browser and type in "localhost:5001" in your address bar. A PNSMN login form should be displayed on your screen.<br/>
username: PNSMN<br/>
password: PNSMN

![Alt text](images/login.png?raw=true "Logging in into the system")

### Using the UI
Once logged in, the UI will start a network scan (THis might take up to a minute). At the end of the scan, found clients are displayed on the screen. In order to hook one of these clients, click on the "Hook" button. The client's Icon should be replaced with a loading animation and information about the client's web usage should be displayed in the terminal underneath. Once a hook is successfully injected, the "attack" section will be displayed and th client icon will be replaced with a "link" icon, informing that the client is currently hooked. As a last step, choose an attack in the  "attack" section and it will be instantaneously sent to the hooked client. Have fun pen-testing your "OWN NETWORK ;)" (not too much though)

![Alt text](images/ui.png?raw=true "Utilisation of the interface")
