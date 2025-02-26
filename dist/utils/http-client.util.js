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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const typedi_1 = require("typedi");
let HttpClient = class HttpClient {
    constructor(baseURL = '', config = {}) {
        this.baseURL = baseURL;
        this.config = config;
    }
    async base(method, url, body = {}, methodHeaders = {}) {
        this.config = {
            baseURL: this.baseURL,
            headers: { 'Content-Type': 'application/json', ...methodHeaders }
        };
        try {
            let response = {};
            switch (method) {
                case 'POST':
                    body = JSON.stringify(body);
                    response = await axios_1.default.post(`${url}`, body, this.config);
                    break;
                case 'PUT':
                    body = JSON.stringify(body);
                    response = await axios_1.default.put(`${url}`, body, this.config);
                    break;
                case 'PATCH':
                    body = JSON.stringify(body);
                    response = await axios_1.default.put(`${url}`, body, this.config);
                    break;
                case 'DELETE':
                    response = await axios_1.default.delete(`${url}`, this.config);
                    break;
                default:
                    // GET
                    response = await axios_1.default.get(`${url}`, this.config);
                    break;
            }
            return response.data;
        }
        catch (error) {
            console.log('HttpClient Error', error);
            throw Error(error.message);
        }
    }
    async get(url, header = {}) {
        const response = await this.base('GET', url, {}, header);
        return response;
    }
    async post(url, data, header = {}) {
        const response = await this.base('POST', url, data, header);
        return response;
    }
    async put(url, data, header = {}) {
        const response = await this.base('PUT', url, data, header);
        return response;
    }
    async patch(url, data, header = {}) {
        const response = await this.base('PATCH', url, data, header);
        return response;
    }
    async delete(url, data, header = {}) {
        const response = await this.base('DELETE', url, data, header);
        return response;
    }
};
HttpClient = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object, Object])
], HttpClient);
exports.HttpClient = HttpClient;
