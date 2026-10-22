export function normalizeInternationalPhone(input: string): string {
    const phone = input.trim().replace(/[\s().-]/g, '');
    if (!/^\+?[1-9]\d{1,14}$/.test(phone)) {
        throw new Error('Enter an international phone number with its country code.');
    }

    return phone.replace(/^\+/, '');
}

export function buildWhatsAppUrl(phone: string, message = ''): string {
    const recipient = phone.trim() ? normalizeInternationalPhone(phone) : '';
    const url = `https://wa.me/${recipient}`;
    return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}