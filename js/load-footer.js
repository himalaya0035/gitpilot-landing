document.addEventListener('DOMContentLoaded', () => {
    // Determine path depth based on window.location
    const isBlog = window.location.pathname.includes('/blog/');
    const footerPath = isBlog ? '../footer.html' : 'footer.html';

    fetch(footerPath)
        .then(res => {
            if (!res.ok) throw new Error('Could not fetch footer.html');
            return res.text();
        })
        .then(html => {
            // If we are in a sub-directory, rewrite relative paths to point to the root
            if (isBlog) {
                // Exclude absolute URLs (http), anchor links (#), and mailto
                html = html.replace(/href="(?!http|#|mailto:)(.*?)"/g, 'href="../$1"');
                html = html.replace(/src="(?!http|data:)(.*?)"/g, 'src="../$1"');
            }
            
            const placeholder = document.getElementById('footer-placeholder');
            if (placeholder) {
                placeholder.innerHTML = html;
            }
        })
        .catch(err => console.error('Error loading footer:', err));
});
