"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let ClubsService = class ClubsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(super_admin_id, dto) {
        return this.prisma.$transaction(async (tx) => {
            const club = await tx.club.create({
                data: {
                    super_admin_id,
                    club_name: dto.club_name,
                    address: dto.address,
                    sport: dto.sport,
                },
            });
            const password_hash = await bcrypt.hash(dto.admin_password, 10);
            await tx.clubAdmin.create({
                data: {
                    club_id: club.club_id,
                    name: dto.admin_name,
                    email: dto.admin_email,
                    phone: dto.admin_phone,
                    password_hash,
                },
            });
            if (Array.isArray(dto.pod_holder_ids) && dto.pod_holder_ids.length > 0) {
                await tx.podHolder.updateMany({
                    where: {
                        pod_holder_id: { in: dto.pod_holder_ids },
                        club_id: null,
                    },
                    data: {
                        club_id: club.club_id,
                    },
                });
            }
            return {
                message: 'Club & Admin created successfully',
                club: await tx.club.findUnique({
                    where: { club_id: club.club_id },
                    include: { pod_holders: true },
                }),
            };
        });
    }
    async delete(club_id) {
        return this.prisma.$transaction(async (tx) => {
            await tx.podHolder.updateMany({
                where: { club_id },
                data: { club_id: null },
            });
            await tx.clubAdmin.deleteMany({
                where: { club_id },
            });
            return tx.club.delete({
                where: { club_id },
            });
        });
    }
    async update(club_id, dto) {
        return this.prisma.club.update({
            where: { club_id },
            data: {
                club_name: dto.club_name,
                address: dto.address,
                sport: dto.sport,
                status: dto.status,
            },
        });
    }
    async findAll() {
        const clubs = await this.prisma.club.findMany({
            include: {
                pod_holders: {
                    select: {
                        pod_holder_id: true,
                        serial_number: true,
                        model: true,
                    },
                },
                club_admins: true,
            },
        });
        return clubs.map(club => ({
            club_id: club.club_id,
            club_name: club.club_name,
            address: club.address,
            sport: club.sport,
            status: club.status,
            pod_holders: club.pod_holders,
            admin: club.club_admins.length > 0
                ? {
                    admin_id: club.club_admins[0].admin_id,
                    name: club.club_admins[0].name,
                    email: club.club_admins[0].email,
                    phone: club.club_admins[0].phone,
                }
                : null,
        }));
    }
    async findOne(id) {
        const club = await this.prisma.club.findUnique({
            where: { club_id: id },
            include: {
                pod_holders: {
                    select: {
                        pod_holder_id: true,
                        serial_number: true,
                        model: true,
                    },
                },
                club_admins: true,
            },
        });
        if (!club)
            return null;
        return {
            club_id: club.club_id,
            club_name: club.club_name,
            address: club.address,
            sport: club.sport,
            status: club.status,
            pod_holders: club.pod_holders,
            admin: club.club_admins.length > 0
                ? {
                    admin_id: club.club_admins[0].admin_id,
                    name: club.club_admins[0].name,
                    email: club.club_admins[0].email,
                    phone: club.club_admins[0].phone,
                }
                : null,
        };
    }
};
exports.ClubsService = ClubsService;
exports.ClubsService = ClubsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClubsService);
//# sourceMappingURL=clubs.service.js.map