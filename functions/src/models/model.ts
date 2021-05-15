
export interface WholeSaler extends Heritage {
    wholeSallerId: string;
    wholeSallerName?: string;
}


export interface Zone extends Heritage {
    id?: string;
    name: string;
    wholeSalerId: string;
}

export interface Parc extends Heritage {
    id?: string;
    parcName: string;
    wholeSalerId?: string;
    blockId: string;
    isActive: boolean;
    zoneId: string;
}


export interface Member extends Heritage {
    id?: string;
    name: string;
    lastName: string;
    phone?: Phone;
    email?: string;
    password?: string;
    place?: string;
    role?: Role[];
    wholeSalerId?: string;
}

export interface User extends Heritage {
    id?: string;
    phone?: Phone;
    password?: string;
    memberId?: string;
    wholeSalerId?: string;
}

export interface BlocWoleSaler extends Heritage {
    id?: string;
    userId?: string;
    wholeSalerId?: string;
    zoneId: string;
    blockName: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
}

export interface Commercial extends User {
    id?: string;
    wholeSalerId?: string;
    blocId: string;
    userId?: string;
    zone?: string;
}

export interface Fiche extends Heritage {
    id?: string;
    wholeSallerId: string;
    stk_b: string;
    phones?: Phone[];
    dayOfWork?: string[];
    hourOfWork?: HourOfWork;
    locationDescription?: string;
    photo?: Storage;
    isDualWallet?: boolean;
}

export enum Role {
    ADMIN = "ADMINISTRATOR",
    SUPERVISOR = "SUPERVISOR",
    COMMERCIAL = "COMMERCIAL",
}


export interface HourOfWork {
    start: string;
    end: string;
}

export interface DocumentFile {
    file?: File;
    size?: number;
    isUplaoded?: boolean;
    isBigSize?: boolean;
    isBadExtension?: boolean;
    name?: string;
    storage?: Storage;
}

export interface Phone {
    dialCode: string;
    number: string;
    internationalNumber: string;
    countryCode: string;
    nationalNumber: string;
    e164Number: string;
}


export interface Sort {
    text?: string;
    propriete: string;
    action: string;
    value?: string | boolean;
}

export interface GMSPlace {
    name: string;
    placeId: string;
    longitude: number;
    latitude: number;
    url: string;
    formatted_address: string;
}


interface Heritage {
    createdAt?: string;
    updatedAt?: string;
}

export interface Storage {
    downloadURL: string,
    filePath: string
}
