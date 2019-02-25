import { DOMImplementation } from 'xmldom';
import { TextDocument } from '../api/office/TextDocument';
import { DomVisitor } from './DomVisitor';
import { MetaWriter } from './meta/MetaWriter';
import { OdfAttributeName } from './OdfAttributeName';
import { OdfElementName } from './OdfElementName';
import { FontFaceDeclarationsWriter } from './office/FontFaceDeclarationsWriter';

const OFFICE_VERSION = '1.2';

/**
 * Transforms a {@link TextDocument} object into ODF conform XML
 *
 * @since 0.7.0
 */
export class TextDocumentWriter {
  /**
   * Transforms the given {@link TextDocument} into Open Document Format.
   *
   * @param {TextDocument} textDocument The text document to serialize
   * @returns {Document} The XML document
   * @since 0.7.0
   */
  public write (textDocument: TextDocument): Document {
    const document = new DOMImplementation().createDocument(
      'urn:oasis:names:tc:opendocument:xmlns:office:1.0',
      OdfElementName.OfficeDocument,
      null);
    const root = document.firstChild as Element;

    this.setXmlNamespaces(root);

    root.setAttribute(OdfAttributeName.OfficeMimetype, 'application/vnd.oasis.opendocument.text');
    root.setAttribute(OdfAttributeName.OfficeVersion, OFFICE_VERSION);

    new MetaWriter().write(document, root, textDocument.getMeta());

    new FontFaceDeclarationsWriter().write(textDocument.getFontFaceDeclarations(), document, root);

    new DomVisitor().visit(textDocument.getBody(), document, root);

    return document;
  }

  /**
   * Declares the used XML namespaces.
   *
   * @param {Element} root The root element of the document which will be used as parent
   * @private
   */
  private setXmlNamespaces (root: Element): void {
    root.setAttribute('xmlns:dc', 'http://purl.org/dc/elements/1.1');
    root.setAttribute('xmlns:draw', 'urn:oasis:names:tc:opendocument:xmlns:drawing:1.0');
    root.setAttribute('xmlns:fo', 'urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0');
    root.setAttribute('xmlns:meta', 'urn:oasis:names:tc:opendocument:xmlns:meta:1.0');
    root.setAttribute('xmlns:style', 'urn:oasis:names:tc:opendocument:xmlns:style:1.0');
    root.setAttribute('xmlns:svg', 'urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0');
    root.setAttribute('xmlns:text', 'urn:oasis:names:tc:opendocument:xmlns:text:1.0');
    root.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  }
}
