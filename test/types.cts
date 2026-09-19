import { Base64, toUint8Array } from 'js-base64';

const bytes = toUint8Array('AQID');
const namespaceBytes = Base64.toUint8Array('AQID');

crypto.subtle.digest('SHA-256', bytes);
crypto.subtle.digest('SHA-256', namespaceBytes);
new Blob([bytes, namespaceBytes]);

// @ts-expect-error The encoded input must be a string.
toUint8Array(new Uint8Array([1, 2, 3]));
