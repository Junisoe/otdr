// SOR Generator

function generateSOR(formData) {
    try {
        // Validate data
        if (!validateFormData(formData)) {
            alert('Data tidak valid!');
            return;
        }
        
        // Generate binary data
        const sorBuffer = createSORBinary(formData);
        
        // Download file
        downloadFile(sorBuffer, formData);
    } catch (error) {
        console.error('Error generating SOR:', error);
        alert('Error: ' + error.message);
    }
}

function createSORBinary(data) {
    // Create a simple binary structure
    // This is a simplified SOR format for demonstration
    
    const header = createSORHeader(data);
    const metadata = createSORMetadata(data);
    const dataPoints = generateDataPoints(data);
    const dataSection = createDataSection(dataPoints);
    
    // Combine all sections
    return combineBuffers([header, metadata, dataSection]);
}

function createSORHeader(data) {
    // SOR Magic number and version
    const magic = new Uint8Array([0xA5, 0xA5, 0xA5, 0xA5]); // Magic
    const version = new Uint8Array([0x01, 0x00]); // Version 1.0
    const revision = new Uint8Array([0x02, 0x00]); // Revision 2
    
    return combineBuffers([magic, version, revision]);
}

function createSORMetadata(data) {
    const metadata = {};
    
    // General Parameters
    metadata.language = 'EN';
    metadata.cableId = data.cableId || '';
    metadata.fiberId = data.fiberId || '';
    metadata.wavelength = parseInt(data.wavelength) || 1310;
    metadata.orgLocation = data.orgLocation || '';
    metadata.termLocation = data.termLocation || '';
    metadata.cableCode = data.cableCode || '';
    metadata.condition = data.condition || 'OT';
    metadata.operator = data.operator || '';
    metadata.comment = data.comment || '';
    
    // Supplier Parameters
    metadata.supplier = 'ANRITSU';
    metadata.otdrModel = data.otdrModel || 'MT9090A';
    metadata.otdrSN = data.otdrSN || '';
    metadata.opticsModule = data.opticsModuleSN || 'MU9090 14C-057';
    metadata.swVersion = data.swVersion || '3.00';
    
    // Fixed Parameters
    metadata.fiberType = data.fiberType || 'SMF';
    metadata.pulseWidth = parseFloat(data.pulseWidth) || 10;
    metadata.range = parseInt(data.range) || 50;
    metadata.resolution = parseFloat(data.resolution) || 1;
    metadata.attenuationRate = parseFloat(data.attenuationRate) || 0.35;
    metadata.numDataPoints = parseInt(data.numDataPoints) || 5000;
    metadata.timestamp = new Date().toISOString();
    
    // Convert to binary
    return stringToBytes(JSON.stringify(metadata));
}

function generateDataPoints(data) {
    const dataPoints = [];
    const numPoints = parseInt(data.numDataPoints) || 5000;
    const range = parseFloat(data.range) || 50;
    const attRate = parseFloat(data.attenuationRate) || 0.35;
    const pulseWidth = parseFloat(data.pulseWidth) || 10;
    
    // Generate OTDR curve with realistic characteristics
    for (let i = 0; i < numPoints; i++) {
        const distance = (i / numPoints) * range;
        
        // Generate power with attenuation and noise
        let power = -40; // Starting power in dBm
        power -= distance * attRate; // Apply attenuation
        
        // Add some realistic noise
        power += (Math.random() - 0.5) * 0.5;
        
        // Add events randomly
        if (Math.random() < 0.001 && data.numSplice > 0) {
            power -= 0.3; // Splice loss
        }
        if (Math.random() < 0.0005 && data.numConnector > 0) {
            power -= 0.5; // Connector loss
        }
        
        // Calculate reflectance (simplified)
        const reflectance = -60 + (Math.random() - 0.5) * 2;
        
        dataPoints.push({
            index: i,
            distance: distance,
            power: power,
            reflectance: reflectance,
            status: 'OK'
        });
    }
    
    return dataPoints;
}

function createDataSection(dataPoints) {
    const dataBuffer = [];
    
    // Data point header
    dataBuffer.push(stringToBytes('DataPts'));
    dataBuffer.push(uint32ToBytes(dataPoints.length));
    
    // Data points
    dataPoints.forEach(point => {
        dataBuffer.push(floatToBytes(point.distance));
        dataBuffer.push(floatToBytes(point.power));
        dataBuffer.push(floatToBytes(point.reflectance));
    });
    
    return combineBuffers(dataBuffer);
}

function validateFormData(data) {
    if (!data.cableId) {
        alert('Cable ID harus diisi!');
        return false;
    }
    if (!data.wavelength) {
        alert('Wavelength harus dipilih!');
        return false;
    }
    if (!data.operator) {
        alert('Operator Name harus diisi!');
        return false;
    }
    return true;
}

function downloadFile(buffer, data) {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${data.cableId}_${timestamp}.sor`;
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`File SOR berhasil dibuat: ${filename}`);
}

function downloadSOR(data) {
    generateSOR(data);
}

// Utility functions for buffer operations
function combineBuffers(buffers) {
    let totalLength = 0;
    buffers.forEach(buf => totalLength += buf.byteLength || buf.length);
    
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    
    buffers.forEach(buf => {
        if (buf instanceof ArrayBuffer) {
            combined.set(new Uint8Array(buf), offset);
            offset += buf.byteLength;
        } else if (buf instanceof Uint8Array) {
            combined.set(buf, offset);
            offset += buf.length;
        } else {
            combined.set(buf, offset);
            offset += buf.length;
        }
    });
    
    return combined.buffer;
}

function stringToBytes(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i));
    }
    return new Uint8Array(bytes);
}

function uint32ToBytes(num) {
    const bytes = new Uint8Array(4);
    bytes[0] = num & 0xFF;
    bytes[1] = (num >> 8) & 0xFF;
    bytes[2] = (num >> 16) & 0xFF;
    bytes[3] = (num >> 24) & 0xFF;
    return bytes;
}

function floatToBytes(num) {
    const bytes = new ArrayBuffer(4);
    new DataView(bytes).setFloat32(0, num, true);
    return new Uint8Array(bytes);
}

function bytesToString(bytes) {
    let str = '';
    for (let i = 0; i < bytes.length; i++) {
        str += String.fromCharCode(bytes[i]);
    }
    return str;
}