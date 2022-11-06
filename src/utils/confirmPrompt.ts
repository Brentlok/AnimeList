export const confirmPrompt = (fn: () => void, message = 'Are you sure?') => {
    if (!confirm(message)) {
        return false;
    }

    fn();
    return true;
};