// SOR Utilities - Helper functions

const SORUtils = {
    // Fiber types
    fiberTypes: {
        'SMF': 'Single Mode Fiber',
        'MMF': 'Multi Mode Fiber',
        'OM1': 'Multi Mode Fiber OM1',
        'OM2': 'Multi Mode Fiber OM2',
        'OM3': 'Multi Mode Fiber OM3',
        'OM4': 'Multi Mode Fiber OM4'
    },

    // Conditions
    conditions: [
        { value: 'OT', label: 'OT (Operational Test)' },
        { value: 'ER', label: 'ER (Emergency Repair)' },
        { value: 'PR', label: 'PR (Pre-Installation Repair)' }
    ],

    // Wavelengths
    wavelengths: [
        { value: '1310', label: '1310 nm (Short/Medium Distance)' },
        { value: '1550', label: '1550 nm (Long Distance)' },
        { value: '1625', label: '1625 nm (Extended)' }
    ],

    // Attenuation rates (dB/km) at 20°C
    attenuationRates: {
        'SMF-1310': 0.35,
        'SMF-1550': 0.20,
        'MMF-850': 2.5,
        'MMF-1310': 1.0
    },

    // Pulse width recommendations based on range
    pulseWidthRecommendations: [
        { range: { min: 0, max: 10 }, recommended: 0.3 },
        { range: { min: 10, max: 25 }, recommended: 1 },
        { range: { min: 25, max: 50 }, recommended: 5 },
        { range: { min: 50, max: 100 }, recommended: 10 },
        { range: { min: 100, max: 200 }, recommended: 30 }
    ],

    // Get recommended pulse width
    getRecommendedPulseWidth(range) {
        for (let rec of this.pulseWidthRecommendations) {
            if (range >= rec.range.min && range <= rec.range.max) {
                return rec.recommended;
            }
        }
        return 10;
    },

    // Get attenuation rate
    getAttenuationRate(fiberType, wavelength) {
        const key = `${fiberType}-${wavelength}`;
        return this.attenuationRates[key] || 0.35;
    },

    // Format distance
    formatDistance(km) {
        if (km < 1) {
            return (km * 1000).toFixed(0) + ' m';
        }
        return km.toFixed(2) + ' km';
    },

    // Format power
    formatPower(dbm) {
        return dbm.toFixed(2) + ' dBm';
    },

    // Validate Cable ID
    isValidCableId(id) {
        return id && id.length > 0 && id.length <= 50;
    },

    // Validate distance
    isValidDistance(distance) {
        return !isNaN(distance) && distance > 0 && distance <= 200;
    },

    // Generate file name
    generateFileName(cableId) {
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0];
        const safeId = cableId.replace(/[^a-zA-Z0-9-]/g, '_');
        return `${safeId}_${dateStr}.sor`;
    },

    // Calculate expected loss
    calculateExpectedLoss(distance, attenuationRate) {
        return distance * attenuationRate;
    },

    // Validate reflection coefficient
    isValidReflection(reflectance) {
        return !isNaN(reflectance) && reflectance >= -80 && reflectance <= 0;
    },

    // Format reflection
    formatReflectance(db) {
        return db.toFixed(2) + ' dB';
    },

    // Get device info
    getDeviceInfo(model) {
        const devices = {
            'ANRITSU MT9090A': {
                name: 'ANRITSU MT9090A',
                maxRange: 100,
                wavelengths: [1310, 1550],
                minPulseWidth: 0.3,
                maxPulseWidth: 100
            },
            'ANRITSU MT9082A': {
                name: 'ANRITSU MT9082A',
                maxRange: 80,
                wavelengths: [1310, 1550],
                minPulseWidth: 0.5,
                maxPulseWidth: 50
            }
        };
        return devices[model] || null;
    },

    // Estimate measurement time
    estimateMeasurementTime(distance, pulseWidth) {
        // Simplified estimate in seconds
        return (distance * 10) / (Math.log2(pulseWidth + 1) || 1);
    },

    // Generate random event locations
    generateEventLocations(distance, eventCount) {
        const events = [];
        for (let i = 0; i < eventCount; i++) {
            events.push(Math.random() * distance);
        }
        return events.sort((a, b) => a - b);
    },

    // Calculate splice loss (typical 0.1-0.3 dB)
    getTypicalSpliceLoss() {
        return 0.1 + Math.random() * 0.2;
    },

    // Calculate connector loss (typical 0.3-0.5 dB)
    getTypicalConnectorLoss() {
        return 0.3 + Math.random() * 0.2;
    },

    // Format timestamp
    formatTimestamp(date) {
        return date.toISOString().replace('T', ' ').substring(0, 19);
    },

    // Parse resolution based on range
    getRecommendedResolution(range) {
        if (range <= 10) return 0.1;
        if (range <= 50) return 0.5;
        if (range <= 100) return 1;
        return 2;
    },

    // Validate numeric input
    isValidNumber(value, min, max) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    },

    // Format large numbers
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SORUtils;
}