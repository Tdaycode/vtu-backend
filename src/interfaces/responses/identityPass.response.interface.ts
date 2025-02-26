export interface IdentityPassKYCProviderResponse {
  status: boolean;
  detail: string;
  response_code: string;
  face_data: FaceData;
  bvn_data: BvnData;
  verification: Verification;
}

interface FaceData {
  status: boolean;
  message: string;
}

interface BvnData {
  title: string;
  gender: string;
  maritalStatus: string;
  watchListed: string;
  levelOfAccount: string;
  bvn: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber1: string;
  phoneNumber2: string;
  registrationDate: string;
  enrollmentBank: string;
  enrollmentBranch: string;
  email: string;
  lgaOfOrigin: string;
  lgaOfResidence: string;
  nin: string;
  nameOnCard: string;
  nationality: string;
  residentialAddress: string;
  stateOfOrigin: string;
  stateOfResidence: string;
  base64Image: string;
}

interface Verification {
  status: string;
  reference: string;
}