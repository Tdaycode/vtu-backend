import { Request } from 'express';
import { Service } from 'typedi';

import UserService from '../services/user.service';
import KycService from '../services/kyc.service';

import { asyncWrapper } from '../utils/asyncWrapper';
import { SuccessResponse } from '../utils/SuccessResponse';
import { BadRequestError } from '../utils/ApiError';
import { KYCStatus } from '../interfaces/kyc-upload.interface';

@Service()
export default class AuthController {
  constructor(
    public userService: UserService, 
    public kycService: KycService
  ) {}

  public getUserProfile = asyncWrapper(async (req: Request) => {
    const user = await this.userService.getProfile(req.user._id);
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
    if(userName) {
      const user = await this.userService.getCurrentUser({ userName });
      if(user) throw new BadRequestError("Username already in use");
    }
    const user = await this.userService.updateUserProfile(req.user._id, data);
    return new SuccessResponse(user, "User Profile Updated Successfully");
  });

  public getAllUsers = asyncWrapper(async (req: Request) => {
    const { page, limit, searchTerm } = req.query as { page: string,  limit: string, searchTerm: string};
    const orders = await this.userService.getAllUsers(page, limit, searchTerm);
    return new SuccessResponse(orders, "Users Fetched Successfully");
  });

  public getSingleUser = asyncWrapper(async (req: Request) => {
    const products = await this.userService.getUserProfile(req.params.id); 
    return new SuccessResponse(products, "User Fetched Successfully");
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

  public uploadKYCDocument = asyncWrapper(async (req: Request) => {
    const files = req.files;
    const kyc = await this.kycService.uploadKYCDocuments(req.user._id, files);
    return new SuccessResponse(kyc, "KYC documents uploaded successfully");
  });

  public getKYCLevels = asyncWrapper(async (req: Request) => {
    const kyc = await this.kycService.getAllKYC();
    return new SuccessResponse(kyc, "KYC Levels fetched successfully");
  });

  public getAllKYCRequests = asyncWrapper(async (req: Request) => {
    const { page, limit, status } = req.query as { page: string,  limit: string, status: KYCStatus };    
    const kyc = await this.kycService.getAllKYCRequests(page, limit, status);
    return new SuccessResponse(kyc, "KYC documents fetched successfully");
  });

  public getSingleKYCRequest = asyncWrapper(async (req: Request) => {
    const { id } = req.params;
    const kyc = await this.kycService.getSingleKYCRequest(id);
    return new SuccessResponse(kyc, "KYC document fetched successfully");
  });
  
  public getKYCDocument = asyncWrapper(async (req: Request) => {
    const kyc = await this.kycService.getUserKYCDocument(req.user._id);
    return new SuccessResponse(kyc, "KYC documents fetched successfully");
  });

  public updateKYCDocument = asyncWrapper(async (req: Request) => {
    const { action, rejectionReason } = req.body; 
    const kyc = await this.kycService.updateKYCDocument(req.params.id, action, rejectionReason);
    return new SuccessResponse(kyc, "KYC documents updated successfully");
  });

  public updateKYCLimits = asyncWrapper(async (req: Request) => {
    const { limits } = req.body; 
    const kyc = await this.kycService.updateKYCLimits(limits);
    return new SuccessResponse(kyc, "KYC limits updated successfully");
  });

  public disableAccount = asyncWrapper(async (req: Request) => {
    const { id } = req.params;
    await this.userService.toggleAccountStatus(id);
    return new SuccessResponse("Account Status toggled successfully");
  });
 
  public disableSpend = asyncWrapper(async (req: Request) => {
    const { id } = req.params;
    await this.userService.toggleUserSpend(id);
    return new SuccessResponse("User Spend toggled successfully");
  });

  public uploadFile = asyncWrapper(async (req: Request) => {
    const file = req.file;
    const fileLink = await this.userService.uploadFile(file);
    return new SuccessResponse(fileLink, "Document uploaded successfully");
  });
}
