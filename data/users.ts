export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export const getUserDetailsUrl = (userSlug: string) => (
    `http://localhost:3001/users/${userSlug}`
)

