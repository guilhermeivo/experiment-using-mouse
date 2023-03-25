"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const GetByIdMazeQuery_1 = require("@Application/Maze/queries/GetByIdMazeQuery");
const GetAllMazeQuery_1 = require("@Application/Maze/queries/GetAllMazeQuery");
const CreateMazeCommand_1 = require("@Application/Maze/commands/CreateMazeCommand");
const AddLikeMazeCommand_1 = require("@Application/Maze/commands/AddLikeMazeCommand");
const AddViewMazeCommand_1 = require("@Application/Maze/commands/AddViewMazeCommand");
class MazeController {
    GetAll(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield GetAllMazeQuery_1.GetAllMazeQueryHadler.handle(request);
            if (response.Succeeded) {
                return response;
            }
            return response;
        });
    }
    GetById(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield GetByIdMazeQuery_1.GetByIdMazeQueryHadler.handle(request);
            if (response.Succeeded) {
                return response;
            }
            return response;
        });
    }
    Create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield CreateMazeCommand_1.CreateMazeCommandHandler.handle(request);
            if (response.Succeeded) {
                return response;
            }
            return response;
        });
    }
    AddLikes(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield AddLikeMazeCommand_1.AddLikeMazeCommandHandler.handle(request);
            if (response.Succeeded) {
                return response;
            }
            return response;
        });
    }
    AddViews(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield AddViewMazeCommand_1.AddViewMazeCommandHandler.handle(request);
            if (response.Succeeded) {
                return response;
            }
            return response;
        });
    }
}
exports.default = MazeController;
//# sourceMappingURL=MazeController.js.map