// SOR Parser - untuk membaca dan parse file SOR

function parseSOR(arrayBuffer) {
    try {
        const data = new DataView(arrayBuffer);
        const bytes = new Uint8Array(arrayBuffer);
        
        const sorData = {
            header: null,
            metadata: null,
            dataPoints: [],
            checksum: null
        };
        
        // Parse header
        sorData.header = parseSORHeader(data);
        
        // Parse metadata section
        const metadataStart = findSection(bytes, 'GenParams');
        if (metadataStart !== -1) {
            sorData.metadata = parseMetadataSection(data, metadataStart, bytes);
        }
        
        // Parse data points
        const dataStart = findSection(bytes, 'DataPts');
        if (dataStart !== -1) {
            sorData.dataPoints = parseDataPoints(data, dataStart);
        }
        
        return sorData;
    } catch (error) {
        console.error('Error parsing SOR:', error);
        throw error;
    }
}

function parseSORHeader(dataView) {
    return {
        magic: dataView.getUint32(0, true),
        version: dataView.getUint16(4, true),
        revision: dataView.getUint16(6, true)
    };
}

function findSection(bytes, sectionName) {
    const searchStr = sectionName;
    for (let i = 0; i < bytes.length - searchStr.length; i++) {
        let found = true;
        for (let j = 0; j < searchStr.length; j++) {
            if (bytes[i + j] !== searchStr.charCodeAt(j)) {
                found = false;
                break;
            }
        }
        if (found) return i;
    }
    return -1;
}

function parseMetadataSection(dataView, startOffset, bytes) {
    const metadata = {};
    
    try {
        // Extract text content from the binary data
        let offset = startOffset + 10; // Skip section header
        let textContent = '';
        
        // Try to extract readable strings
        for (let i = offset; i < Math.min(offset + 2000, bytes.length); i++) {
            const byte = bytes[i];
            if (byte >= 32 && byte <= 126) { // Printable ASCII
                textContent += String.fromCharCode(byte);
            } else if (byte === 0) {
                if (textContent.length > 0) break;
            }
        }
        
        // Parse common fields from text
        const lines = textContent.split(/[\x00\n]/);
        
        metadata.cableId = extractField(textContent, 'Cable ID:', 'Fiber ID:') || 'Unknown';
        metadata.fiberId = extractField(textContent, 'Fiber ID:', 'Wavelength:') || '';
        metadata.wavelength = extractField(textContent, 'Wavelength:', 'Org. Loc:') || '1310';
        metadata.orgLocation = extractField(textContent, 'Org. Loc:', 'Term. Loc:') || '';
        metadata.termLocation = extractField(textContent, 'Term. Loc:', 'Cable Code:') || '';
        metadata.operator = extractField(textContent, 'Operator:', 'Comment:') || '';
        metadata.comment = extractField(textContent, 'Comment:', 'Supplier:') || '';
        metadata.supplier = extractField(textContent, 'Supplier:', 'OTDR Model:') || 'ANRITSU';
        metadata.otdrModel = extractField(textContent, 'OTDR Model:', 'S/N:') || 'MT9090A';
        metadata.swVersion = extractField(textContent, 'S/W Rev.:', 'Other:') || '3.00';
        
    } catch (error) {
        console.warn('Warning parsing metadata:', error);
    }
    
    return metadata;
}

function extractField(text, startMarker, endMarker) {
    try {
        const startIdx = text.indexOf(startMarker);
        if (startIdx === -1) return '';
        
        const contentStart = startIdx + startMarker.length;
        const endIdx = text.indexOf(endMarker, contentStart);
        
        if (endIdx === -1) {
            return text.substring(contentStart, contentStart + 50).trim();
        }
        
        return text.substring(contentStart, endIdx).trim();
    } catch (e) {
        return '';
    }
}

function parseDataPoints(dataView, startOffset) {
    const dataPoints = [];
    
    try {
        // Try to extract data points
        // This is simplified - real SOR format is more complex
        let offset = startOffset + 10;
        let pointCount = 0;
        const maxPoints = Math.min(100, (dataView.byteLength - offset) / 12); // Estimate
        
        for (let i = 0; i < maxPoints && offset + 12 <= dataView.byteLength; i++) {
            try {
                const distance = dataView.getFloat32(offset, true);
                const power = dataView.getFloat32(offset + 4, true);
                const reflectance = dataView.getFloat32(offset + 8, true);
                
                if (!isNaN(distance) && !isNaN(power)) {
                    dataPoints.push({
                        index: pointCount++,
                        distance: distance,
                        power: power,
                        reflectance: reflectance
                    });
                    offset += 12;
                } else {
                    break;
                }
            } catch (e) {
                break;
            }
        }
    } catch (error) {
        console.warn('Warning parsing data points:', error);
    }
    
    return dataPoints;
}

function validateSORFile(arrayBuffer) {
    if (arrayBuffer.byteLength < 100) {
        throw new Error('File terlalu kecil untuk SOR');
    }
    
    const bytes = new Uint8Array(arrayBuffer);
    // Check for common SOR markers
    const hasGenParams = findSection(bytes, 'GenParams') !== -1;
    const hasDataPts = findSection(bytes, 'DataPts') !== -1;
    
    if (!hasGenParams && !hasDataPts) {
        console.warn('File mungkin bukan SOR format standar, namun akan dicoba diparsing');
    }
    
    return true;
}

// Statistics calculations
function calculateSORStatistics(sorData) {
    const stats = {};
    
    if (sorData.dataPoints && sorData.dataPoints.length > 0) {
        const powers = sorData.dataPoints.map(p => p.power);
        
        stats.totalDistance = sorData.dataPoints[sorData.dataPoints.length - 1].distance;
        stats.numDataPoints = sorData.dataPoints.length;
        stats.maxPower = Math.max(...powers);
        stats.minPower = Math.min(...powers);
        stats.avgPower = powers.reduce((a, b) => a + b) / powers.length;
        stats.totalAttenuation = Math.abs(powers[0] - powers[powers.length - 1]);
    }
    
    return stats;
}