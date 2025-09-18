export function highlight(text: string, query: string) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "ig");
    const html = text.replace(
      regex,
      '<span class="bg-yellow-100 rounded">$1</span>'
    );
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  }
  