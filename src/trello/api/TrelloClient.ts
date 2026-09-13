export class TrelloClient {
  private apiKey: string;
  private token: string;
  
  constructor(apiKey: string, token: string) {
    this.apiKey = apiKey;
    this.token = token;
  }
  
  async getBoard(boardId: string) {
    // Fetch board from Trello API
  }
}