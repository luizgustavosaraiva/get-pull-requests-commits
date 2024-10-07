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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { eventName, payload: { repository, pull_request } } = github_1.default.context;
            const isValidEventName = Object.values(github_1.default.context.eventName).includes(eventName);
            if (!isValidEventName) {
                core_1.default.setFailed("This action only works on pull requests");
                return;
            }
            const token = core_1.default.getInput("token");
            const filterOutPattern = core_1.default.getInput('filter_out_pattern');
            const filterOutFlags = core_1.default.getInput('filter_out_flags');
            const octokit = github_1.default.getOctokit(token);
            const commits = yield octokit.rest.pulls.listCommits({
                owner: repository === null || repository === void 0 ? void 0 : repository.owner.login,
                repo: repository === null || repository === void 0 ? void 0 : repository.name,
                pull_number: pull_request === null || pull_request === void 0 ? void 0 : pull_request.number,
            });
            const filteredCommits = commits.data.filter((commit) => {
                const message = commit.commit.message;
                if (!filterOutPattern) {
                    return true;
                }
                const regex = new RegExp(filterOutPattern, filterOutFlags);
                return !regex.test(message);
            });
            core_1.default.setOutput("commits", JSON.stringify(filteredCommits));
        }
        catch (error) {
            core_1.default.setFailed(error);
        }
    });
}
;
run();
//# sourceMappingURL=index.js.map