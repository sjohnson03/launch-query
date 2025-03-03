export default class Bang {
  public name: string;
  public bang: string;
  public url: string;

  public search(query: string): string {
    return this.url.replace("{searchTerms}", encodeURIComponent(query));
  }

  constructor(name: string, bang: string, url: string) {
    this.name = name;
    this.bang = bang;
    this.url = url;
  }
}
