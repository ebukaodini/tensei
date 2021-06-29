"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("../utils");
function handleSignup(request, response) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const apiResponse = yield utils_1.tensei.auth().register({
            skipAuthentication: true,
            object: Object.assign({ email: request.body.email, password: request.body.password }, request.body),
        });
        request.session.set('auth', {
            refresh_token: apiResponse.data.data.refresh_token,
            access_token_expires_at: utils_1.getAccessTokenExpiryTimeStamp(apiResponse.data.data.expires_in),
        });
        yield request.session.save();
        return response.status(200).json(utils_1.prepareAuthData(apiResponse.data.data));
    });
}
exports.default = handleSignup;
//# sourceMappingURL=signup.js.map