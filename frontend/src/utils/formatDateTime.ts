const formatDateTime = (dateTimeString: string): string => {
    return new Date(dateTimeString).toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

export default formatDateTime;
