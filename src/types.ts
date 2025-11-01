export interface SuiID {
    id: string
}
export type StringKey = string;

export interface ProfileData {
    name?: string;
    username?: string;
    github?: string;
    linkedin?: string;
    bio?: string;
    slushwallet?: string;
    ava_blod_id?: string;
}

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

export interface ProjectFormData {
    title: string;
    description: string;
    technologies: string;
    githubLink: string;
    youtubeLink: string;
    img_prj_blods_id: string;
    imageUrl?: string;
    
}

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

export interface CertificateFormData {
    title: string;
    organization: string;
    issueDate: string;
    expiryDate: string;
    verifyLink: string;
    img_cer_blods_id: string;
}

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

