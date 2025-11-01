export interface SuiID {
    id: string
}

// For UI components that need string keys
export type StringKey = string;

// Profile data structure for UI components
export interface ProfileData {
    name?: string;
    username?: string;
    github?: string;
    linkedin?: string;
    bio?: string;
    slushwallet?: string;
    ava_blod_id?: string;
}

// Profile data structure from blockchain/backend
export interface Profile {
    id: SuiID,
    owner: string,
    name: string,
    username: string,
    github: string,
    linkedin: string,
    bio: string,
    slushwallet: string,
    ava_blod_id: string,
    list_projects: Project[],
    list_certificate: Certificate[]
}

// Project data structure for UI forms
export interface ProjectFormData {
    title: string;
    description: string;
    technologies: string;
    githubLink: string;
    youtubeLink: string;
    img_prj_blods_id: string;
    imageUrl?: string;
    
}

// Project data structure from blockchain/backend
export interface Project {
    id: SuiID,
    owner: string,
    title: string,
    technologies: string[],
    description: string,
    github_link: string,
    youtube_link: string,
    img_prj_blods_id?: string,
    image_url?: string
}

// Certificate data structure for UI forms
export interface CertificateFormData {
    title: string;
    organization: string;
    issueDate: string;
    expiryDate: string;
    verifyLink: string;
    img_cer_blods_id: string;
}

// Certificate data structure from blockchain/backend
export interface Certificate {
    id: SuiID,
    owner: string,
    title: string,
    organization: string,
    date: string,
    expiry_date?: string,
    verify_link: string,
    img_cer_blods_id: string,
    image_url?: string
}

// Upload related types
export interface WalrusBlobObject {
    blobId: string;
    certifiedEpoch: null;
    deletable: boolean;
    encodingType: string;
    id: string;
    registeredEpoch: number;
    size: number;
    storage: {
        id: string;
        startEpoch: number;
        endEpoch: number;
        storageSize: number;
    };
}

export interface WalrusResponse {
    newlyCreated: {
        blobObject: WalrusBlobObject;
        resourceOperation: { registerFromScratch: Record<string, never> };
        cost: number;
    };
}

export interface UploadState {
    isUploading: boolean;
    error: string | null;
    progress: number;
}

export interface AvatarUploadProps {
    onUpload: (data: { info: WalrusResponse; mediaType: string }) => void;
    currentAvatar?: string;
}

export interface CertificateUploadProps {
    onUpload: (data: { info: WalrusResponse; mediaType: string }) => void;
    currentImage?: string;
}

