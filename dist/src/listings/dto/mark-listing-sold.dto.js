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
exports.MarkListingSoldDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const libphonenumber_js_1 = require("libphonenumber-js");
let IsNotFutureIsoDateConstraint = class IsNotFutureIsoDateConstraint {
    validate(value) {
        const date = new Date(value);
        return Number.isFinite(date.getTime()) && date.getTime() <= Date.now();
    }
    defaultMessage() {
        return 'saleDate must not be in the future';
    }
};
IsNotFutureIsoDateConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isNotFutureIsoDate', async: false })
], IsNotFutureIsoDateConstraint);
function normalizePhone(value) {
    if (typeof value !== 'string')
        return value;
    const parsed = (0, libphonenumber_js_1.parsePhoneNumberFromString)(value, 'SO');
    return parsed?.isValid() ? parsed.number : value.trim();
}
class MarkListingSoldDto {
}
exports.MarkListingSoldDto = MarkListingSoldDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], MarkListingSoldDto.prototype, "salePrice", void 0);
__decorate([
    (0, class_validator_1.IsISO8601)({ strict: true }),
    (0, class_validator_1.Validate)(IsNotFutureIsoDateConstraint),
    __metadata("design:type", String)
], MarkListingSoldDto.prototype, "saleDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], MarkListingSoldDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MarkListingSoldDto.prototype, "documentReference", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], MarkListingSoldDto.prototype, "buyerName", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => normalizePhone(value)),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], MarkListingSoldDto.prototype, "buyerPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], MarkListingSoldDto.prototype, "buyerEmail", void 0);
//# sourceMappingURL=mark-listing-sold.dto.js.map