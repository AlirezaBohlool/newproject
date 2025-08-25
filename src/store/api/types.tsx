export interface MenuRequestBody {
    page: number;
    limit: number;
    filter: Record<string, any>;
    sort: Record<string, number>;
  }
  
  export interface InfoFront {
    frontId: string;
    slug: string;
    template: string;
    route: string;
  }
  
  export interface InfoRoleDto {
    roleId: string;
    slug: string;
  }
  
  export interface MenuItem {
    createdAt: string;
    menuId: string;
    slug: string;
    icon: string;
    infoFront: InfoFront;
    status: string;
  }
  
  // User information interface
  export interface GetUserGM {
    createdAt: string;
    userId: string;
    infoMail?: {
      isVerify: boolean;
      createdAtVerify: string;
      email: string;
      enableOAuth: boolean;
      createdAtEnable: string;
    };
    infoMobile?: {
      isVerify: boolean;
      iso3: string;
      phone: string;
    };
    infoWallet?: {
      isVerify: boolean;
      createdAtVerify: string;
      email: string;
      enableOAuth: boolean;
      createdAtEnable: string;
    };
    status: "ACTIVE" | "SUSPEND" | "BLOCK";
    updatedAt: string;
  }
  
  export interface GetMenuGM {
    createdAt: string;
    menuId: string;
    slug: string;
    icon: string;
    infoFront: InfoFront;
    infoRole: InfoRoleDto;
    status: "SUSPENDED" | "ACTIVE" | "DEACTIVE";
  }
  
  export interface PaginationMenuPM {
    createdAt: string;
    menuId: string;
    slug: string;
    icon: string;
    infoFront: InfoFront;
    status: "SUSPENDED" | "ACTIVE" | "DEACTIVE";
  }
  
  // Update these interfaces to include the pagination structure
  export interface MenuResponse {
    statusCode: number;
    result: {
      data: MenuItem[];
      metaData: PaginationMetaData;
    };
    timestamp: string;
  }
  
  // Update or add this interface for submenu items
  export interface SubMenuItem {
    subMenuId: string;
    menuId: string;
    slug: string;
    icon: string;
    infoFront: InfoFront;
    status: "SUSPENDED" | "ACTIVE" | "DEACTIVE";
    createdAt: string;
  }
  
  // Update the SubMenuResponse interface to use SubMenuItem
  export interface SubMenuResponse {
    statusCode: number;
    result: {
      data: SubMenuItem[];
      metaData: PaginationMetaData;
    };
    timestamp: string;
  }
  
  export interface GetMenuByIdResponse {
    statusCode: number;
    result: GetMenuGM;
    timestamp: string;
  }
  
  // Role interfaces
  export interface RoleItem {
    createdAt: string;
    roleId: string;
    slug: string;
    description: string;
    isDefault: boolean;
    status: string;
  }
  
  // Pagination metadata interface
  export interface PaginationMetaData {
    page: number;
    limit: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }
  
  // Paginated result structure
  export interface PaginatedResult<T> {
    data: T[];
    metaData: PaginationMetaData;
  }
  
  // Update the RoleResponse interface
  export interface RoleResponse {
    statusCode: number;
    result: PaginatedResult<RoleItem>;
    timestamp: string;
  }
  export interface CreateRoleRequest {
    slug: string;
    description: string;
    isDefault?: boolean;
  }
  
  export interface UpdateRoleRequest {
    slug: string;
    description: string;
    isDefault?: boolean;
    status: string;
  }
  
  // Interface for creating a submenu
  export interface CreateSubMenuRequest {
    menuId: string;
    slug: string;
    icon: string; // One of the predefined icon names
    frontId: string;
  }
  
  // Response when creating a submenu
  export interface CreateSubMenuResponse {
    statusCode: number;
    result: {
      createdAt: string;
      subMenuId: string;
      menuId: string;
      slug: string;
      icon: string;
      infoFront: InfoFront;
      status: "SUSPENDED" | "ACTIVE" | "DEACTIVE";
    };
    timestamp: string;
  }
  
  // Response when deleting a submenu
  export interface DeleteSubMenuResponse {
    statusCode: number;
    timestamp: string;
  }
  
  // Interface for updating a submenu
  export interface UpdateSubMenuRequest {
    menuId: string;
    slug: string;
    icon: string;
    frontId: string;
    status: "SUSPENDED" | "ACTIVE" | "DEACTIVE";
  }
  
  // Response when updating a submenu
  export interface UpdateSubMenuResponse {
    statusCode: number;
    result: {
      createdAt: string;
      subMenuId: string;
      menuId: string;
      slug: string;
      icon: string;
      infoFront: InfoFront;
      status: "SUSPENDED" | "ACTIVE" | "DEACTIVE";
    };
    timestamp: string;
  }
  // Action API Types
  export type PositionRoleType = "BACKEND" | "FRONT" | "MOBILE" | "UNKNOWN";
  export type ActionStatusType = "SUSPENDED" | "ACTIVE" | "DEACTIVE";
  
  export interface CreateActionDto {
    slug: string;
    positionRole: PositionRoleType;
    description?: string;
    permissions: string[];
  }
  
  export interface UpdateActionDto {
    slug: string;
    positionRole: PositionRoleType;
    description?: string;
    permissions: string[];
    status: ActionStatusType;
  }
  
  export interface PaginationActionPM {
    createdAt: string;
    actionId: string;
    slug: string;
    positionRole: PositionRoleType;
    description?: string;
    permissions: string[];
    status: ActionStatusType;
  }
  
  export interface GetActionGM {
    actionId: string;
    slug: string;
    positionRole: PositionRoleType;
    description?: string;
    permissions: string[];
    status: ActionStatusType;
  }
  
  export interface ActionResponse {
    statusCode: number;
    result: PaginationActionPM;
    timestamp: string;
  }
  
  export interface ActionDeleteResponse {
    statusCode: number;
    timestamp: string;
  }
  
  export interface GetActionResponse {
    statusCode: number;
    result: GetActionGM;
    timestamp: string;
  }
  
  export interface PaginatedActionResponse {
    statusCode: number;
    result: PaginatedResult<PaginationActionPM>;
    timestamp: string;
  }
  
  export interface FilterAction {
    // Add specific filter fields for action if needed
  }
  
  export interface FilterActionDto {
    page: number;
    limit: number;
    filter?: FilterAction;
    sort?: {
      createdAt?: 1 | -1;
    };
  }
  // Interface for InfoPolicyAction
  
  export interface InfoPolicyAction {
    createdAt: number;
    statusAction: "ACCEPTED" | "REJECTED" | "SUSPEND" | "UNKNOWN";
  }
  
  // Interface for Provider Operation
  export interface PaginationOperationProviderPM {
    operationId: string;
    infoPolicyAction: InfoPolicyAction;
    status: "SUSPENDED" | "ACTIVE" | "DEACTIVE";
  }
  
  // Interface for Provider Operators Pagination Response
  export interface ProviderOperatorsPaginationResponse {
    statusCode: number;
    result: {
      data: PaginationOperationProviderPM[];
      metaData: PaginationMetaData;
    };
    timestamp: string;
  }
  
  export type StatusType = "SUSPENDED" | "ACTIVE" | "DEACTIVE";
  
  export interface GetProviderInfoGM {
    providerInfoId: string;
    infoUser: GetUserGM;
    licenseType: "HOME" | "CAR";
    applicantFirstName: string;
    applicantLastName: string;
    phoneNumberApplicant: string;
    businessName: string;
    iso3Company: string;
    companyCEOFirstName: string;
    companyCEOLastName: string;
    companyName: string;
    companyWebsite: string;
    companyEmail: string;
    companyAddress: string;
    telegramIds: string[];
    whatsAppIds: string[];
    linkdinIds: string[];
    twitters: string[];
    attachments: string[];
    status: StatusType;
  }
  
  // Contract related interfaces
  export type NetType = "MAIN" | "TEST" | "UNKNOWN";
  export type ChainType = "POLYGON" | "ETHER" | "BSC" | "UNKNOWN";
  export type ActionType = "ACCEPTED" | "REJECTED" | "SUSPEND" | "UNKNOWN";
  
  export interface InfoSmartContractDto {
    smartId: string;
    net: NetType;
    chain: ChainType;
    action: ActionType;
  }
  
  export interface InfoPolicyActionContractDto {
    createdAt: number;
    action: ActionType;
  }
  
  export interface PaginationContractPM {
    createdAt: string;
    contractId: string;
    infoProvider: GetProviderInfoGM;
    slug: string;
    providerType: "HOME" | "CAR";
    description?: string;
    income: number;
    percentCompany: number;
    percentProvider: number;
    infoSmartContract?: InfoSmartContractDto;
    infoPolicyAction?: InfoPolicyActionContractDto;
    status: StatusType;
  }
  
  export interface CreateContractProviderDto {
    providerSectionId: string;
    slug: string;
    description?: string;
    income: number;
    percentProvider: number;
    percentCompany: number;
  }
  
  export interface UpdateContractProviderDto {
    providerSectionId: string;
    slug: string;
    description?: string;
    income: number;
    percentProvider: number;
    percentCompany: number;
  }
  
  export interface CreateSmartContractInContractDto {
    smartId: string;
    net: NetType;
    chain: ChainType;
  }
  
  export interface FilterContractProvider {
    // Define filter properties as needed
  }
  
  export interface FilterContractProviderDto {
    page: number;
    limit: number;
    filter?: FilterContractProvider;
    sort?: FilterContractProvider;
  }
  
  export interface FilterContractCompany {
    // Define filter properties as needed
  }
  
  export interface FilterContractCompanyDto {
    page: number;
    limit: number;
    filter?: FilterContractCompany;
    sort?: FilterContractCompany;
  }
  
  export interface ContractResponse {
    statusCode: number;
    result: PaginationContractPM;
    timestamp: string;
  }
  
  export interface PaginatedContractResponse {
    statusCode: number;
    result: {
      data: PaginationContractPM[];
      metaData: PaginationMetaData;
    };
    timestamp: string;
  }
  
  // Provider info without company filter
  export interface FilterProviderInfoWithoutCompany {
    // Filter properties for provider info without company details
    // This can be expanded with specific filter fields as needed
  }
  
  // Provider info without company filter DTO with pagination
  export interface FilterProviderInfoWithoutCompanyDto {
    page: number;
    limit: number;
    filter?: FilterProviderInfoWithoutCompany;
    sort?: FilterProviderInfoWithoutCompany;
  }
  
  export type TypeAuthEnum = 'BEARER' | 'APIKEY' | 'UNKNOWN';
  export type MethodEnum = 'GET' | 'POST' | 'UNKNOWN';
  
  export interface LinkForwardDto {
    link: string;
    filedToken: string;
    filedTokenPayment: string;
    fieldOrderId: string;
    fieldPrice: string;
  }
  
  export interface LinkVerifyDto {
    link: string;
    typeAuth: TypeAuthEnum;
    method: MethodEnum;
    apikeyOrBearer: string;
  }
  
  export interface CreateProviderIpgDto {
    providerId: string;
    slug: string;
    terminalId: string;
    token: string;
    linkForward: LinkForwardDto;
    linkVerify: LinkVerifyDto;
  }
  
  export interface ProviderIpgResponse {
    statusCode: number;
    result: {
      providerId: string;
      createdAt: string;
      ipgId: string;
      infoProvider: any;
      slug: string;
      terminalId: string;
      token: string;
      linkForward: LinkForwardDto;
      linkVerify: LinkVerifyDto;
      status: string;
    };
    timestamp: string;
  }
  
  // Profile API Types
  export type SexType = "MEN" | "WOMEN" | "UNKNOWN";
  
  export interface InfoReferral {
    referralCode: string;
    infoReferral: boolean;
    description?: string;
  }
  
  export interface CreateProfileDto {
    nationalCode: string;
    firstName: string;
    lastName: string;
    father: string;
    birthDate: string;
    sex: SexType;
    phoneNumber: string;
    iso2Country: string;
    city: string;
    address: string;
    infoReferral: boolean;
    description?: string;
  }
  
  export interface UpdateProfileDto {
    nationalCode: string;
    firstName: string;
    lastName: string;
    father: string;
    birthDate: string;
    sex: SexType;
    phoneNumber: string;
    iso2Country: string;
    city: string;
    address: string;
    infoReferral: boolean;
    description?: string;
    status: StatusType;
  }
  
  export interface PaginationProfilePM {
    createdAt: string;
    profileId: string;
    nationalCode: string;
    firstName: string;
    lastName: string;
    father: string;
    birthDate: string;
    sex: SexType;
    iso2Country: string;
    phoneNumber: string;
    city: string;
    address?: string;
    infoReferral: InfoReferral;
    status: StatusType;
  }
  
  export interface GetProfileGM {
    createdAt: string;
    profileId: string;
    nationalCode: string;
    firstName: string;
    lastName: string;
    father: string;
    birthDate: string;
    sex: SexType;
    iso2Country: string;
    phoneNumber: string;
    city: string;
    address?: string;
    infoReferral: InfoReferral;
    status: StatusType;
  }
  
  export interface CreateProfileResponse {
    statusCode: number;
    result: PaginationProfilePM;
    timestamp: string;
  }
  
  export interface GetProfileResponse {
    statusCode: number;
    result: GetProfileGM;
    timestamp: string;
  }
  
  export interface UpdateProfileResponse {
    statusCode: number;
    result: PaginationProfilePM;
    timestamp: string;
  }
  
  export interface DeleteProfileResponse {
    statusCode: number;
    timestamp: string;
  }
  
  // Role Action interfaces
  export interface CreateRoleActionRequest {
    roleId: string;
    actionId: string;
    permission: string;
    typeAction: 'ACTIVE' | 'DEACTIVE' | 'UNKNOWN';
  }
  
  export interface UpdateRoleActionRequest {
    roleId?: string;
    actionId: string;
    permission: string;
    typeAction: 'ACTIVE' | 'DEACTIVE' | 'UNKNOWN';
    status: 'SUSPENDED' | 'ACTIVE' | 'DEACTIVE';
  }
  
  export interface GetActionGM {
    actionId: string;
    slug: string;
    positionRole: 'BACKEND' | 'FRONT' | 'MOBILE' | 'UNKNOWN';
    description?: string;
    permissions: string[];
    status: 'SUSPENDED' | 'ACTIVE' | 'DEACTIVE';
  }
  
  export interface GetRoleActionGM {
    createdAt: string;
    roleActionId: string;
    actionId: string;
    permission: string;
    typeAction: 'ACTIVE' | 'DEACTIVE' | 'UNKNOWN';
    infoAction: GetActionGM;
    status: 'SUSPENDED' | 'ACTIVE' | 'DEACTIVE';
  }
  
  export interface RoleActionResponse {
    statusCode: number;
    result: GetRoleActionGM;
    timestamp: string;
  }
  
  export interface RoleActionPaginationResponse {
    statusCode: number;
    result: PaginatedResult<GetRoleActionGM>;
    timestamp: string;
  }
  
  export interface DeleteRoleActionResponse {
    statusCode: number;
    timestamp: string;
  }
  
  // Contract Dapp API Types
  export interface CreateContractDappDto {
    orderId: string;
  }
  
  export interface CreateContractDappResponse {
    statusCode: number;
    timestamp: string;
  }
  
  // Error response interfaces
  export interface ErrorMessage {
    msg: string;
    code: number;
  }
  
  export interface BadRequestResponse {
    statusCode: 400;
    message: ErrorMessage[];
    timestamp: string;
  }
  
  export interface ForbiddenResponse {
    statusCode: 403;
    message: ErrorMessage;
    timestamp: string;
  }
  
  export interface NotFoundResponse {
    statusCode: 404;
    message: ErrorMessage;
    timestamp: string;
  }
  
  export interface ConflictResponse {
    statusCode: 409;
    message: ErrorMessage;
    timestamp: string;
  }
  
  export interface InfoMail {
    isVerify: boolean;
    createdAtVerify: string;
    email: string;
    enableOAuth: boolean;
    createdAtEnable: string;
  }
  
  export interface InfoMobile {
    isVerify: boolean;
    iso3: string;
    phone: string;
  }
  
  export interface PaginationRequestHeaderPM {
    requestId: string;
    advertiseId: string;
    infoProvider: GetProviderInfoGM;
    infoBuyer: GetUserGM;
    infoSeller: GetUserGM;
    providerType: "HOME" | "CAR";
    firstDate: string;
    lastDate: string;
    status: "OPEN" | "UNDER_CONTRACT" | "CLOSE" | "UNKNOWN";
  }
  
  export interface FilterRequestHeader {
    // Add specific filter fields as needed
  }
  
  export interface SortRequestHeader {
    createdAt?: 1 | -1;
  }
  
  export interface FilterRequestHeaderDto {
    page: number;
    limit: number;
    filter?: FilterRequestHeader;
    sort?: SortRequestHeader;
  }
  
  export interface PaginationRequestHeaderResponse {
    statusCode: number;
    result: {
      data: PaginationRequestHeaderPM[];
      metaData: PaginationMetaData;
    };
    timestamp: string;
  }
  
  export interface PaginationRequestOfferPM {
    createdAt: string;
    updatedAt: string;
    status: "SUSPENDED" | "ACTIVE" | "DEACTIVE";
    requestTradeId: string;
    traceNumber: number;
    advertiseId: string;
    buyerId: string;
    infoBuyer: GetUserGM;
    committeeId?: string;
    providerType: "HOME" | "CAR";
  }
  
  export interface FilterRequestOffer {
    // Add specific filter fields as needed
  }
  
  export interface SortRequestOffer {
    createdAt?: 1 | -1;
  }
  
  export interface FilterRequestOfferDto {
    page: number;
    limit: number;
    filter?: FilterRequestOffer;
    sort?: SortRequestOffer;
  }
  
  export interface PaginationRequestOfferResponse {
    statusCode: number;
    result: {
      data: PaginationRequestOfferPM[];
      metaData: PaginationMetaData;
    };
    timestamp: string;
  }
  
  // Type Contract API Types
  export type ProviderType = "HOME" | "CAR";
  export type TypeContractStatusType = "SUSPENDED" | "ACTIVE" | "DEACTIVE";
  
  export interface CreateTypeContractDto {
    iso2Country: string;
    providerType: ProviderType;
    slugContract: string;
  }
  
  export interface UpdateTypeContractDto {
    iso2Country: string;
    providerType: ProviderType;
    slugContract: string;
    status: TypeContractStatusType;
  }
  
  export interface PaginationTypeContractPM {
    typeContractId: string;
    iso2County: string;
    slug: string;
    providerType: ProviderType;
    status: TypeContractStatusType;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface GetTypeContractGM {
    typeContractId: string;
    iso2County: string;
    slug: string;
    providerType: ProviderType;
    status: TypeContractStatusType;
  }
  
  export interface TypeContractResponse {
    statusCode: number;
    result: PaginationTypeContractPM;
    timestamp: string;
  }
  
  export interface GetTypeContractResponse {
    statusCode: number;
    result: GetTypeContractGM;
    timestamp: string;
  }
  
  export interface PaginatedTypeContractResponse {
    statusCode: number;
    result: PaginatedResult<PaginationTypeContractPM>;
    timestamp: string;
  }
  
  export interface DeleteTypeContractResponse {
    statusCode: number;
    timestamp: string;
  }
  
  export interface FilterTypeContract {
    // Add specific filter fields for type contract if needed
  }
  
  export interface SortTypeContract {
    createdAt?: 1 | -1;
  }
  
  export interface FilterTypeContractDto {
    page: number;
    limit: number;
    filter?: FilterTypeContract;
    sort?: SortTypeContract;
  }
  
  // Chain API Types
  export type ChainStatusType = "SUSPENDED" | "ACTIVE" | "DEACTIVE";
  
  export interface CreateChainDto {
    slug: string;
    symbol: string;
    description?: string;
  }
  
  export interface UpdateChainDto {
    slug: string;
    symbol: string;
    description?: string;
    status: ChainStatusType;
  }
  
  export interface PMChain {
    createdAt: string;
    updatedAt: string;
    status: ChainStatusType;
    chainId: string;
    slug: string;
    symbol: string;
    description?: string;
  }
  
  export interface GMChain {
    createdAt: string;
    updatedAt: string;
    status: ChainStatusType;
    chainId: string;
    slug: string;
    symbol: string;
    description?: string;
  }
  
  export interface FilterChain {
    // Add specific filter fields for chain if needed
  }
  
  export interface SortChain {
    createdAt?: 1 | -1;
  }
  
  export interface FilterChainDto {
    page: number;
    limit: number;
    filter?: FilterChain;
    sort?: SortChain;
  }
  
  // Chain response interfaces
  export interface CreateChainResponse {
    statusCode: number;
    result: PMChain;
    timestamp: string;
  }
  
  export interface GetChainResponse {
    statusCode: number;
    result: GMChain;
    timestamp: string;
  }
  
  export interface UpdateChainResponse {
    statusCode: number;
    result: PMChain;
    timestamp: string;
  }
  
  export interface DeleteChainResponse {
    statusCode: number;
    timestamp: string;
  }
  
  export interface PaginatedChainResponse {
    statusCode: number;
    result: PaginatedResult<PMChain>;
    timestamp: string;
  }
  
  // Arch API Types (for chain arch pagination)
  export type ArchStatusType = "SUSPENDED" | "ACTIVE" | "DEACTIVE";
  
  export interface CreateArchDto {
    chainId: string;
    slug: string;
    symbol: string;
    description?: string;
  }
  
  export interface UpdateArchDto {
    chainId: string;
    slug: string;
    symbol: string;
    description?: string;
    status: ArchStatusType;
  }
  
  export interface PMArch {
    createdAt: string;
    updatedAt: string;
    status: ArchStatusType;
    archId: string;
    slug: string;
    symbol: string;
    description?: string;
  }
  
  export interface GMArch {
    createdAt: string;
    updatedAt: string;
    status: ArchStatusType;
    archId: string;
    slug: string;
    symbol: string;
    description?: string;
  }
  
  export interface FilterArch {
    // Add specific filter fields for arch if needed
  }
  
  export interface SortArch {
    createdAt?: 1 | -1;
  }
  
  export interface FilterArchDto {
    page: number;
    limit: number;
    filter?: FilterArch;
    sort?: SortArch;
  }
  
  // Arch response interfaces
  export interface CreateArchResponse {
    statusCode: number;
    result: PMArch;
    timestamp: string;
  }
  
  export interface GetArchResponse {
    statusCode: number;
    result: GMArch;
    timestamp: string;
  }
  
  export interface UpdateArchResponse {
    statusCode: number;
    result: PMArch;
    timestamp: string;
  }
  
  export interface DeleteArchResponse {
    statusCode: number;
    timestamp: string;
  }
  
  export interface PaginatedArchResponse {
    statusCode: number;
    result: PaginatedResult<PMArch>;
    timestamp: string;
  }
  
  // Asset API Types
  export type AssetType = "CRYPTO" | "FIAT" | "VM_CRYPTO" | "UNKNOWN";
  export type AssetStatusType = "SUSPENDED" | "ACTIVE" | "DEACTIVE";
  
  export interface CreateAssetDto {
    slug: string;
    symbol: string;
    typeAsset: AssetType;
    isStable: boolean;
  }
  
  export interface UpdateAssetDto {
    slug: string;
    symbol: string;
    typeAsset: AssetType;
    isStable: boolean;
    status: AssetStatusType;
  }
  
  export interface PMAsset {
    createdAt: string;
    updatedAt: string;
    status: AssetStatusType;
    assetId: string;
    slug: string;
    symbol: string;
    typeAsset: AssetType;
    isStable: boolean;
  }
  
  export interface GMAsset {
    createdAt: string;
    updatedAt: string;
    status: AssetStatusType;
    assetId: string;
    slug: string;
    symbol: string;
    typeAsset: AssetType;
    isStable: boolean;
  }
  
  export interface FilterAsset {
    // Add specific filter fields for asset if needed
  }
  
  export interface SortAsset {
    createdAt?: 1 | -1;
  }
  
  export interface FilterAssetDto {
    page: number;
    limit: number;
    filter?: FilterAsset;
    sort?: SortAsset;
  }
  
  // Asset response interfaces
  export interface CreateAssetResponse {
    statusCode: number;
    result: PMAsset;
    timestamp: string;
  }
  
  export interface GetAssetResponse {
    statusCode: number;
    result: GMAsset;
    timestamp: string;
  }
  
  export interface UpdateAssetResponse {
    statusCode: number;
    result: PMAsset;
    timestamp: string;
  }
  
  export interface DeleteAssetResponse {
    statusCode: number;
    timestamp: string;
  }
  
  export interface PaginatedAssetResponse {
    statusCode: number;
    result: PaginatedResult<PMAsset>;
    timestamp: string;
  }
  
  // Payment Setting API Types
  export type PaymentSettingProviderType = "HOME" | "CAR";
  export type PaymentSettingStatusType = "SUSPENDED" | "ACTIVE" | "DEACTIVE";
  export type TypeCalcEnum = "CONST" | "PERCENTAGE" | "UNKNOWN";
  export type WhenEnum = "BEFORE_CONTRACT" | "SIGN_CONTRACT" | "AFTER_CONTRACT" | "UNKNOWN";
  
  export interface InfoPolicyGuaranteePaymentSettingDto {
    wage: number;
    typeCalc: TypeCalcEnum;
    when: WhenEnum;
  }
  
  export interface InfoPolicyCommissionPaymentSettingDto {
    wage: number;
    typeCalc: TypeCalcEnum;
    when: WhenEnum;
  }
  
  export interface CreatePaymentSettingDto {
    assetId: string;
    providerType: PaymentSettingProviderType;
    infoPolicyGuaranteeBuyer: InfoPolicyGuaranteePaymentSettingDto;
    infoPolicyGuaranteeSeller: InfoPolicyGuaranteePaymentSettingDto;
    infoPolicyCommissionBuyer: InfoPolicyCommissionPaymentSettingDto;
    infoPolicyCommissionSeller: InfoPolicyCommissionPaymentSettingDto;
  }
  
  export interface PMPaymentSetting {
    createdAt: string;
    updatedAt: string;
    status: PaymentSettingStatusType;
    paymentSettingId: string;
    providerId: string;
    assetId: string;
    providerType: PaymentSettingProviderType;
    infoCommissionBuyer?: InfoPolicyCommissionPaymentSettingDto;
    infoCommissionSeller?: InfoPolicyCommissionPaymentSettingDto;
    infoGuaranteeBuyer?: InfoPolicyGuaranteePaymentSettingDto;
    infoGuaranteeSeller?: InfoPolicyGuaranteePaymentSettingDto;
  }
  
  export interface GMPaymentSetting {
    createdAt: string;
    updatedAt: string;
    status: PaymentSettingStatusType;
    paymentSettingId: string;
    providerId: string;
    assetId: string;
    providerType: PaymentSettingProviderType;
    infoCommissionBuyer?: InfoPolicyCommissionPaymentSettingDto;
    infoCommissionSeller?: InfoPolicyCommissionPaymentSettingDto;
    infoGuaranteeBuyer?: InfoPolicyGuaranteePaymentSettingDto;
    infoGuaranteeSeller?: InfoPolicyGuaranteePaymentSettingDto;
  }
  
  export interface FilterPaymentSetting {
    status?: PaymentSettingStatusType;
    providerType?: PaymentSettingProviderType;
    assetId?: string;
    providerId?: string;
    createdAt?: {
      from?: string;
      to?: string;
    };
  }
  
  export interface SortPaymentSetting {
    createdAt?: number;
    updatedAt?: number;
    status?: number;
    providerType?: number;
  }
  
  export interface FilterPaymentSettingDto {
    page: number;
    limit: number;
    filter?: FilterPaymentSetting;
    sort?: SortPaymentSetting;
  }
  
  // Payment Setting response interfaces
  export interface CreatePaymentSettingResponse {
    statusCode: number;
    result: PMPaymentSetting;
    timestamp: string;
  }
  
  export interface GetPaymentSettingResponse {
    statusCode: number;
    result: GMPaymentSetting;
    timestamp: string;
  }
  
  export interface DeletePaymentSettingResponse {
    statusCode: number;
    timestamp: string;
  }
  
  export interface PaginatedPaymentSettingResponse {
    statusCode: number;
    result: {
      data: PMPaymentSetting[];
      metaData: PaginationMetaData;
    };
    timestamp: string;
  }
  