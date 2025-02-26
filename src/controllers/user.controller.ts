import { Request } from 'express';
import { Service } from 'typedi';

import UserService from '../services/user.service';
import KycService from '../services/kyc.service';

import { asyncWrapper } from '../utils/asyncWrapper';
import { SuccessResponse } from '../utils/SuccessResponse';
import { BadRequestError } from '../utils/ApiError';
import { KYCLevels } from '../interfaces/kyc.interface';

@Service()
export default class AuthController {
  constructor(
    public userService: UserService, 
    public kycService: KycService
  ) {}

  public getUserProfile = asyncWrapper(async (req: Request) => {
    const user = await this.userService.getUserProfile(req.user._id);
    return new SuccessResponse(user, "Current User Profile Fetched");
  });

  public getUsers = asyncWrapper(async (req: Request) => {
    const { page, limit, searchTerm } = req.query as { page: string,  limit: string, searchTerm: string};
    const user = await this.userService.getAllUsers(page, limit, searchTerm);
    return new SuccessResponse(user, "Users Fetched");
  });

  public updateUserProfile = asyncWrapper(async (req: Request) => {
    const { firstName, lastName, userName } = req.body;
    const data  = { firstName, lastName, userName };
    const user = await this.userService.updateUserProfile(req.user._id, data);
    return new SuccessResponse(user, "User Profile Updated Successfully");
  });

  public getAllUsers = asyncWrapper(async (req: Request) => {
    const { page, limit, searchTerm } = req.query as { page: string,  limit: string, searchTerm: string};
    const orders = await this.userService.getAllUsers(page, limit, searchTerm);
    return new SuccessResponse(orders, "Users Fetched Successfully");
  });

  public setupNewPin = asyncWrapper(async (req: Request) => {
    const { pin } = req.body;
    await this.userService.setupPin(req.user._id, pin);
    return new SuccessResponse(null, "Pin setup successfully");
  });

  public verifyPin = asyncWrapper(async (req: Request) => {
    const { pin } = req.body;
    await this.userService.verifyPin(req.user, pin);
    return new SuccessResponse(null, "Pin verified successfully");
  });

  public updatePin = asyncWrapper(async (req: Request) => {
    const { pin } = req.body;
    await this.userService.setupPin(req.user._id, pin);
    return new SuccessResponse(null, "Pin updated successfully");
  });

  public initiateCodeVerification = asyncWrapper(async (req: Request) => {
    const user = req.user;
    if(!user?.twoFA?.enabled)throw new BadRequestError("2FA Not enabled")
    const twoFA = await this.userService.trigger2FA(user, user.twoFA.type, true);
    return new SuccessResponse(twoFA, "Code verification initiated successfully");
  });

  public verifyUserIdentity = asyncWrapper(async (req: Request) => {
    const identity = req.identity;
    const { status, response_code, face_data, user_info } = req.body;
    if(!status || response_code !== "00" || face_data.response_code !== "00")
      throw new BadRequestError("Identity Verification Failed");

    const userID = user_info.user_ref;
    await this.userService.checkIdentityVerificationStatus(userID)
    await this.userService.upgradeKYCLevel(userID, KYCLevels.Level_2);
    await this.userService.updateUser({ _id: userID }, { ...identity, isIdentityVerified: true });

    return new SuccessResponse("user", "User Identity Updated Successfully");
  });
}
