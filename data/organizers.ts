import { collection } from 'firebase/firestore'
export interface Organizer {
    id: string,
    slug: string,
    name: string,
    count: number
}

export const getOrganizers = () => {
  const organizersRef = collection(useFirestore(), 'organizers')
  const organizers = useCollection<Organizer>(organizersRef)

  console.log('organizers')
  console.log(organizers.data.value)
  return organizers.data
}
