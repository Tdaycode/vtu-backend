interface IdentityPassBaseResponse {
  status: boolean;
  response_code: string;
  detail: string;
  face_data: FaceData;
  widget_info: UserInfo;
}

export interface IdentityPassBVNResponse extends IdentityPassBaseResponse {
  data: BvnData,
}

export interface IdentityPassGeneralResponse extends IdentityPassBaseResponse {
  data: GeneralIdentityData,
  request_data: GeneralRequestData
}

export interface BvnData {
  bvn: string
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  registrationDate: string
  enrollmentBank: string
  enrollmentBranch: string
  email: string
  gender: string
  levelOfAccount: string
  lgaOfOrigin: string
  lgaOfResidence: string
  maritalStatus: string
  nin: string
  nameOnCard: string
  nationality: string
  phoneNumber1: string
  phoneNumber2: string
  residentialAddress: string
  stateOfOrigin: string
  stateOfResidence: string
  title: string
  watchListed: string
  base64Image: string
}

export interface FaceData {
  status: boolean
  response_code: string
  message: string
  confidence: number,
  liveliness_confidence: number
}

export interface UserInfo {
  first_name: string
  last_name: string
  email: string
  user_ref: string
}

export interface BVNRequestData {
  number: string
  image: string
}

export interface GeneralRequestData {
  doc_country: string
  doc_type: string,
  doc_image: string,
  image: string
}

export interface GeneralIdentityData {
  fullName: string
  first_name: string
  last_name: string
  gender: string
  dob: string
  address: any
  document_name: any
  documentNumber: string
  documentType: string
  documentCountry: string
  nationality: string
  issuer: string
  place_of_issue: any
  date_of_issue: string
  age: string
  expirationDate: string
  device: {}
}

