export const runAfterDelay = (callback, delay) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            callback();
            resolve();
        }, delay);
    });
}