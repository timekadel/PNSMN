#!/bin/bash

zenity  --list  --text "Select the packages you want to install" --checklist  --column "Pick" --column "Package" TRUE "NodeJS V6.0" TRUE "NMAP" TRUE "MITMf" --separator=":"
(
echo "10" ; sleep 1
echo "# Installing NodeJS" ; sleep 1
echo "20" ; sleep 1
echo "# Installing Nmap" ; sleep 1
echo "50" ; sleep 1
echo "# Installing MITMf" ; sleep 1
echo "75" ; sleep 1
echo "# Copying PNSMN files" ; sleep 1
echo "100" ; sleep 1
echo "# Installation complete" ; sleep 1
) |
zenity --progress \
  --title="Installing Packages" \
  --text="Installation in progress..." \
  --percentage=0

if [ "$?" = -1 ] ; then
        zenity --error \
          --text="Update canceled."
fi