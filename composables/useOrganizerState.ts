export const useOrganizerState = () => {
    return useState('organizer', () => ({
        name: '',
        slug: '',
    }))
}