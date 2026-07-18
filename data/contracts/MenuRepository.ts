export interface MenuRepository {
  getDesignerDraft(): Promise<any[]>;
  saveDesignerDraft(elements: any[]): Promise<void>;
  publishMenu(elements: any[]): Promise<void>;
  getPublishedDesign(): Promise<any[]>;
}
