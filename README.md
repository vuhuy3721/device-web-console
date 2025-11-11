# Device Web Console

## Overview
The Device Web Console is a web-based interface designed to provide comprehensive information and control over device functionalities. It includes sections for Connection, Settings, Media, Player, Status, 3G/4G network information, Admin functionalities, and an About section.

## Features
- **Connection**: View and manage connection details.
- **Settings**: Access and modify device settings.
- **Media**: Control media playback and settings.
- **Player**: Manage player controls and functionalities.
- **Status**: Retrieve and display device status information.
- **3G/4G**: Access network information and settings.
- **Admin**: Configure device access, including password management.
- **About**: Information about the device and application.

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd device-web-console
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage
1. Start the server:
   ```
   npm start
   ```
2. Open your web browser and navigate to `http://localhost:3000` to access the web console.

## Configuration
The application settings can be modified in the `src/server/config/settings.json` file. Ensure that the MQTT server and other parameters are correctly set according to your environment.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.