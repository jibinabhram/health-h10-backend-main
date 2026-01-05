"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PodsService = class PodsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const lastBatch = await this.prisma.pod.findFirst({
            where: { batch_id: { startsWith: 'BATCH_' } },
            orderBy: { batch_id: 'desc' },
            select: { batch_id: true },
        });
        const lastBatchNumber = lastBatch
            ? Number(lastBatch.batch_id.replace('BATCH_', ''))
            : 0;
        const batch_id = `BATCH_${String(lastBatchNumber + 1).padStart(6, '0')}`;
        const lastPod = await this.prisma.pod.findFirst({
            orderBy: { serial_number: 'desc' },
            select: { serial_number: true },
        });
        const lastNumber = lastPod?.serial_number
            ? Number(lastPod.serial_number.replace('PD', ''))
            : 0;
        return this.prisma.pod.create({
            data: {
                batch_id,
                serial_number: this.generateSerialNumber(lastNumber + 1),
                device_id: this.generateDeviceId(),
                model: dto.model ?? null,
                lifecycle_status: 'ACTIVE',
            },
        });
    }
    async createMany(count, model) {
        if (!count || count <= 0) {
            throw new common_1.BadRequestException('Count must be greater than 0');
        }
        const lastBatch = await this.prisma.pod.findFirst({
            where: { batch_id: { startsWith: 'BATCH_' } },
            orderBy: { batch_id: 'desc' },
            select: { batch_id: true },
        });
        const lastBatchNumber = lastBatch
            ? Number(lastBatch.batch_id.replace('BATCH_', ''))
            : 0;
        const batch_id = `BATCH_${String(lastBatchNumber + 1).padStart(6, '0')}`;
        const lastPod = await this.prisma.pod.findFirst({
            orderBy: { serial_number: 'desc' },
            select: { serial_number: true },
        });
        let lastNumber = lastPod?.serial_number
            ? Number(lastPod.serial_number.replace('PD', ''))
            : 0;
        const pods = [];
        for (let i = 0; i < count; i++) {
            lastNumber++;
            pods.push({
                batch_id,
                serial_number: this.generateSerialNumber(lastNumber),
                device_id: this.generateDeviceId(),
                model: model ?? null,
                lifecycle_status: 'ACTIVE',
            });
        }
        await this.prisma.pod.createMany({ data: pods });
        return {
            batch_id,
            created: pods.length,
        };
    }
    async findAll() {
        return this.prisma.pod.findMany({
            orderBy: { created_at: 'asc' },
        });
    }
    async findByBatch(batch_id) {
        return this.prisma.pod.findMany({
            where: { batch_id },
            orderBy: { created_at: 'asc' },
        });
    }
    async updateStatus(podId, status) {
        const pod = await this.prisma.pod.findUnique({
            where: { pod_id: podId },
        });
        if (!pod) {
            throw new common_1.BadRequestException('Pod not found');
        }
        return this.prisma.pod.update({
            where: { pod_id: podId },
            data: {
                lifecycle_status: status,
                updated_at: new Date(),
            },
        });
    }
    generateSerialNumber(num) {
        return `PD${String(num).padStart(6, '0')}`;
    }
    generateDeviceId(length = 16) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
};
exports.PodsService = PodsService;
exports.PodsService = PodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PodsService);
//# sourceMappingURL=pods.service.js.map