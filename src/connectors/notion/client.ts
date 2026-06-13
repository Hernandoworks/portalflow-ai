export class NotionConnector {
  constructor(private token: string) {}

  async search(query: string) {
    return {
      connector: 'notion',
      action: 'search',
      query,
    };
  }

  async createPage(payload: unknown) {
    return {
      connector: 'notion',
      action: 'create_page',
      payload,
    };
  }

  async updatePage(pageId: string, payload: unknown) {
    return {
      connector: 'notion',
      action: 'update_page',
      pageId,
      payload,
    };
  }
}
