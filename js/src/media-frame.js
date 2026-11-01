/** Draw one decoded media frame for image acquisition. */
export function captureVideoFrame(document, video) {
    if (!video.videoWidth || !video.videoHeight) throw new Error('Video image is not ready');
    const canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Video image is unavailable');
    context.drawImage(video, 0, 0);
    return canvas;
}
