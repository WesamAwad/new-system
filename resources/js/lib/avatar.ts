const palette = ['0f766e', 'ea580c', '1d4ed8', '15803d', 'b91c1c', '7e22ce'];

function hashString(value: string): number {
    let hash = 0;

    for (let i = 0; i < value.length; i++) {
        hash = (hash * 31 + value.charCodeAt(i)) | 0;
    }

    return Math.abs(hash);
}

/**
 * Deterministic placeholder avatar for a workshop that hasn't uploaded a real logo yet.
 * Same name always resolves to the same background color.
 */
export function workshopAvatarUrl(name: string): string {
    const background = palette[hashString(name) % palette.length];

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${background}&color=fff&size=128&bold=true&format=png`;
}
