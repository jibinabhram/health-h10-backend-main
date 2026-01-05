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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodsController = void 0;
const common_1 = require("@nestjs/common");
const pods_service_1 = require("./pods.service");
const create_pod_dto_1 = require("./dto/create-pod.dto");
let PodsController = class PodsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    async create(dto) {
        const pod = await this.svc.create(dto);
        return { data: pod };
    }
    async createBatch(body) {
        if (!body.count || body.count <= 0) {
            throw new common_1.BadRequestException('count must be greater than 0');
        }
        const result = await this.svc.createMany(body.count, body.model);
        return { data: result };
    }
    async findAll() {
        const pods = await this.svc.findAll();
        return { data: pods };
    }
    async findByBatch(batch_id) {
        if (!batch_id) {
            throw new common_1.BadRequestException('batch_id is required');
        }
        const pods = await this.svc.findByBatch(batch_id);
        return { data: pods };
    }
    async updateStatus(id, body) {
        if (!body.status) {
            throw new common_1.BadRequestException('status is required');
        }
        const pod = await this.svc.updateStatus(id, body.status);
        return { data: pod };
    }
};
exports.PodsController = PodsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pod_dto_1.CreatePodDto]),
    __metadata("design:returntype", Promise)
], PodsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('batch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PodsController.prototype, "createBatch", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PodsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-batch'),
    __param(0, (0, common_1.Query)('batch_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PodsController.prototype, "findByBatch", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PodsController.prototype, "updateStatus", null);
exports.PodsController = PodsController = __decorate([
    (0, common_1.Controller)('pods'),
    __metadata("design:paramtypes", [pods_service_1.PodsService])
], PodsController);
//# sourceMappingURL=pods.controller.js.map