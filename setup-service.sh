#!/bin/bash

# Setup script to run on embedded device after deploy
# This enables auto-start via systemd

DEVICE_CONSOLE_PATH="/opt/device-console"

echo "🔧 Setting up Device Web Console service..."

# Copy systemd service file
cp $DEVICE_CONSOLE_PATH/device-console.service /etc/systemd/system/

# Enable and start service
systemctl daemon-reload
systemctl enable device-console
systemctl start device-console

# Check status
echo ""
echo "Service status:"
systemctl status device-console

echo ""
echo "✅ Setup complete!"
echo ""
echo "The service is now enabled and will start on boot."
echo ""
echo "Available commands:"
echo "  systemctl status device-console    - Check status"
echo "  systemctl restart device-console   - Restart service"
echo "  systemctl stop device-console      - Stop service"
echo "  journalctl -u device-console -f    - View logs"
