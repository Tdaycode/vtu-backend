"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const ApiError_1 = require("./utils/ApiError");
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const Config_1 = __importDefault(require("./config/Config"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const app = (0, express_1.default)();
const PORT = Config_1.default.port || 4000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/api/v1', routes_1.default);
app.use((req, res, next) => next(new ApiError_1.NotFoundError(req.path)));
app.use(error_middleware_1.default.handle());
let server;
const startServer = async () => {
    const database = new database_1.default();
    try {
        await database.initDatabase();
        server = app.listen(PORT, () => {
            console.log(`Connected successfully on port ${PORT}`);
        });
    }
    catch (error) {
        console.error(`Error occurred: ${error.message}`);
    }
};
startServer();
error_middleware_1.default.initializeUnhandledException();
process.on('SIGTERM', () => {
    console.info('SIGTERM received');
    if (server)
        server.close();
});
