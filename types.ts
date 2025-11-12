
export interface ParsedOutput {
  title: string;
  content: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  title: string;
  originalText: string;
  generatedContent: string;
}
