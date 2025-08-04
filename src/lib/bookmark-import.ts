interface ImportedBookmark {
  title: string;
  url: string;
  description?: string;
  tags: string[];
  folder?: string;
}

interface BookmarkFolder {
  name: string;
  bookmarks: ImportedBookmark[];
  subfolders: BookmarkFolder[];
}

export class BookmarkImporter {
  static parseHtmlFile(htmlContent: string): ImportedBookmark[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const bookmarks: ImportedBookmark[] = [];

    // Parse different browser formats
    if (this.isNetscapeFormat(doc)) {
      return this.parseNetscapeFormat(doc);
    } else if (this.isChromeFormat(doc)) {
      return this.parseChromeFormat(doc);
    } else if (this.isFirefoxFormat(doc)) {
      return this.parseFirefoxFormat(doc);
    }

    return bookmarks;
  }

  private static isNetscapeFormat(doc: Document): boolean {
    const meta = doc.querySelector('meta[http-equiv="Content-Type"]');
    return meta?.getAttribute('content')?.includes('text/html') || false;
  }

  private static isChromeFormat(doc: Document): boolean {
    const title = doc.querySelector('title')?.textContent;
    return title?.includes('Bookmarks') || false;
  }

  private static isFirefoxFormat(doc: Document): boolean {
    const h1 = doc.querySelector('h1')?.textContent;
    return h1?.includes('Bookmarks') || false;
  }

  private static parseNetscapeFormat(doc: Document): ImportedBookmark[] {
    const bookmarks: ImportedBookmark[] = [];
    const links = doc.querySelectorAll('a[href]');

    links.forEach(link => {
      const url = link.getAttribute('href');
      const title = link.textContent?.trim();
      
      if (url && title && this.isValidUrl(url)) {
        const parentDT = link.closest('dt');
        const nextDD = parentDT?.nextElementSibling;
        const description = nextDD?.tagName === 'DD' ? nextDD.textContent?.trim() : undefined;
        
        // Extract folder path as tags
        const tags = this.extractFolderPath(link);

        bookmarks.push({
          title,
          url,
          description,
          tags
        });
      }
    });

    return bookmarks;
  }

  private static parseChromeFormat(doc: Document): ImportedBookmark[] {
    return this.parseNetscapeFormat(doc); // Chrome uses Netscape format
  }

  private static parseFirefoxFormat(doc: Document): ImportedBookmark[] {
    return this.parseNetscapeFormat(doc); // Firefox also uses Netscape format
  }

  private static extractFolderPath(element: Element): string[] {
    const folders: string[] = [];
    let current = element.parentElement;

    while (current) {
      if (current.tagName === 'DL') {
        const prevH3 = current.previousElementSibling;
        if (prevH3?.tagName === 'H3') {
          const folderName = prevH3.textContent?.trim();
          if (folderName && folderName !== 'Bookmarks Toolbar' && folderName !== 'Bookmarks Menu') {
            folders.unshift(folderName);
          }
        }
      }
      current = current.parentElement;
    }

    return folders;
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static async processBookmarksForImport(
    bookmarks: ImportedBookmark[],
    userId: string
  ): Promise<any[]> {
    return bookmarks.map(bookmark => ({
      user_id: userId,
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description || null,
      tags: bookmark.tags,
      is_favorite: false
    }));
  }
}