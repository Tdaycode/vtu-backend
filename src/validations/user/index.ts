import { SetupPinValidation } from './pin.validation';
import { UpdateProfileValidation } from '../user/updateProfile.validation';
import { VerifyIdentityValidation } from './verifyIdentity.validation';
import { VerifyCodeValidation } from './verify-code.validation';
import { UpdateKYCValidation, UpdateKYCParamsValidation,
     GetKYCRequestsValidation, UpdateKYCLimitsValidation } from './updateKYC.validation';

export { 
    UpdateProfileValidation,
    VerifyIdentityValidation,
    SetupPinValidation,
    UpdateKYCLimitsValidation,
    VerifyCodeValidation,
    UpdateKYCValidation,
    GetKYCRequestsValidation,
    UpdateKYCParamsValidation
};
