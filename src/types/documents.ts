export type DocumentCategory = 
  | 'CV & Resume' 
  | 'Academic Transcripts' 
  | 'Certificates & Awards' 
  | 'Recommendation Letters' 
  | 'Project Portfolios' 
  | 'Identity Documents';

export interface StudentDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  fileSize: string;
  fileType: 'pdf' | 'docx' | 'png' | 'zip';
  uploadedAt: string;
  isPrivate: boolean;
  googleDriveFileId?: string;
  downloadUrl?: string;
  tags: string[];
}
