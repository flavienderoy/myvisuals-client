// Trigger a browser download from a Blob (e.g. a ZIP fetched via the API).
export const saveBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
};

// Trigger a browser download from a (signed) URL that already carries a
// content-disposition. Uses an anchor so it doesn't navigate away.
export const openDownloadUrl = (url, filename = '') => {
    const a = document.createElement('a');
    a.href = url;
    if (filename) a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
};
