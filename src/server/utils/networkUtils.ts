import { execSync } from 'child_process';
import * as os from 'os';

/**
 * Get IP Address from system
 * @param interfaceName - Network interface name (default: 'eth0' or first non-loopback)
 * @returns IP address string or null if not found
 */
export function getIpAddress(interfaceName?: string): string | null {
    try {
        // Method 1: Using os.networkInterfaces() - fastest and most reliable
        const networkInterfaces = os.networkInterfaces();
        
        if (interfaceName && networkInterfaces[interfaceName]) {
            // If specific interface requested, look for IPv4
            const iface = networkInterfaces[interfaceName];
            const ipv4 = iface?.find(addr => addr.family === 'IPv4');
            if (ipv4) {
                return ipv4.address;
            }
        }
        
        // If no specific interface or not found, find first non-loopback IPv4
        for (const name in networkInterfaces) {
            const iface = networkInterfaces[name];
            for (const addr of iface!) {
                // Skip loopback and non-IPv4
                if (addr.family === 'IPv4' && !addr.address.startsWith('127.')) {
                    return addr.address;
                }
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error getting IP address:', error);
        return null;
    }
}

/**
 * Get IP Address using hostname -I command (Linux)
 * Useful for getting primary IP
 */
export function getIpAddressFromCommand(): string | null {
    try {
        const output = execSync('hostname -I', { encoding: 'utf8' }).trim();
        const ips = output.split(' ');
        return ips.length > 0 ? ips[0] : null;
    } catch (error) {
        console.error('Error getting IP from command:', error);
        return null;
    }
}

/**
 * Get all IP addresses for all interfaces
 */
export function getAllIpAddresses(): { [key: string]: string[] } {
    try {
        const networkInterfaces = os.networkInterfaces();
        const result: { [key: string]: string[] } = {};
        
        for (const name in networkInterfaces) {
            const iface = networkInterfaces[name];
            result[name] = [];
            
            for (const addr of iface!) {
                if (addr.family === 'IPv4') {
                    result[name].push(addr.address);
                }
            }
        }
        
        return result;
    } catch (error) {
        console.error('Error getting all IPs:', error);
        return {};
    }
}

/**
 * Get Subnet Mask
 */
export function getSubnetMask(interfaceName?: string): string | null {
    try {
        const networkInterfaces = os.networkInterfaces();
        
        if (interfaceName && networkInterfaces[interfaceName]) {
            const iface = networkInterfaces[interfaceName];
            const ipv4 = iface?.find(addr => addr.family === 'IPv4');
            if (ipv4) {
                return ipv4.netmask;
            }
        }
        
        // Find first non-loopback
        for (const name in networkInterfaces) {
            const iface = networkInterfaces[name];
            for (const addr of iface!) {
                if (addr.family === 'IPv4' && !addr.address.startsWith('127.')) {
                    return addr.netmask;
                }
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error getting subnet mask:', error);
        return null;
    }
}

/**
 * Get Gateway (using ip route command)
 */
export function getGateway(): string | null {
    try {
        const output = execSync('ip route | grep default', { encoding: 'utf8' }).trim();
        const match = output.match(/default via (\S+)/);
        return match ? match[1] : null;
    } catch (error) {
        console.error('Error getting gateway:', error);
        return null;
    }
}

/**
 * Get DNS servers
 */
export function getDnsServers(): string[] {
    try {
        // Method 1: Try reading resolv.conf
        try {
            const fs = require('fs');
            const content = fs.readFileSync('/etc/resolv.conf', 'utf8');
            const dnsServers: string[] = [];
            
            content.split('\n').forEach((line: string) => {
                const match = line.match(/^nameserver\s+(\S+)/);
                if (match) {
                    dnsServers.push(match[1]);
                }
            });
            
            if (dnsServers.length > 0) {
                return dnsServers;
            }
        } catch (e) {
            // Continue to next method
        }
        
        // Method 2: Using nmcli command (if available)
        try {
            const output = execSync('nmcli device show | grep DNS', { encoding: 'utf8' });
            const dnsServers: string[] = [];
            
            output.split('\n').forEach((line: string) => {
                const match = line.match(/DNS\.?\d*:\s+(\S+)/);
                if (match) {
                    dnsServers.push(match[1]);
                }
            });
            
            return dnsServers;
        } catch (e) {
            // Continue
        }
        
        return [];
    } catch (error) {
        console.error('Error getting DNS servers:', error);
        return [];
    }
}

/**
 * Get MAC Address
 */
export function getMacAddress(interfaceName?: string): string | null {
    try {
        const networkInterfaces = os.networkInterfaces();
        
        if (interfaceName && networkInterfaces[interfaceName]) {
            const iface = networkInterfaces[interfaceName];
            const addr = iface?.find(addr => addr.family === 'IPv4');
            if (addr && addr.mac) {
                return addr.mac;
            }
        }
        
        // Find first non-loopback
        for (const name in networkInterfaces) {
            const iface = networkInterfaces[name];
            for (const addr of iface!) {
                if (addr.family === 'IPv4' && !addr.address.startsWith('127.') && addr.mac) {
                    return addr.mac;
                }
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error getting MAC address:', error);
        return null;
    }
}

/**
 * Get Network Information (comprehensive)
 */
export function getNetworkInfo(interfaceName?: string) {
    return {
        ipAddress: getIpAddress(interfaceName),
        subnetMask: getSubnetMask(interfaceName),
        gateway: getGateway(),
        dnsServers: getDnsServers(),
        macAddress: getMacAddress(interfaceName),
        allInterfaces: getAllIpAddresses(),
        timestamp: new Date().toISOString()
    };
}

/**
 * Check if device has internet connection
 */
export function hasInternetConnection(): boolean {
    try {
        // Check connectivity by pinging 8.8.8.8 (Google DNS)
        execSync('ping -c 1 8.8.8.8', { stdio: 'pipe', timeout: 5000 });
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Get Signal Strength (for mobile devices with modem)
 */
export function getSignalStrength(): string {
    try {
        // Try to get signal from modem using AT commands or system info
        // This is device-specific - adjust based on your modem
        const output = execSync('cat /proc/net/wireless 2>/dev/null || echo "N/A"', { encoding: 'utf8' }).trim();
        
        if (output && output !== 'N/A') {
            // Parse signal strength - device specific
            return 'Good';
        }
        
        return 'Unknown';
    } catch (error) {
        return 'Unknown';
    }
}

/**
 * Get Network Type (3G/4G/LTE)
 */
export function getNetworkType(): string {
    try {
        // Try to detect network type from system
        // This is highly device-specific and depends on modem
        // For now, return a placeholder
        
        // Check if connected via mobile interface (ppp0, rmnet0, etc)
        const networkInterfaces = os.networkInterfaces();
        
        if (networkInterfaces['ppp0'] || networkInterfaces['rmnet0']) {
            // Mobile connection detected
            return 'Mobile (4G/LTE)';
        }
        
        if (networkInterfaces['eth0'] || networkInterfaces['wlan0']) {
            return 'Ethernet/WiFi';
        }
        
        return 'Unknown';
    } catch (error) {
        return 'Unknown';
    }
}

export default {
    getIpAddress,
    getIpAddressFromCommand,
    getAllIpAddresses,
    getSubnetMask,
    getGateway,
    getDnsServers,
    getMacAddress,
    getNetworkInfo,
    hasInternetConnection,
    getSignalStrength,
    getNetworkType
};
