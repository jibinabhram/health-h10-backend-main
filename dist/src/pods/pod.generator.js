"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSerialNumber = generateSerialNumber;
exports.generateDeviceId = generateDeviceId;
function generateSerialNumber(last) {
    const next = (last ?? 0) + 1;
    return `PD${String(next).padStart(6, '0')}`;
}
function generateDeviceId(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
//# sourceMappingURL=pod.generator.js.map