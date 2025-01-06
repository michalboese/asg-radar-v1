export function useRandomImage() {
    const images = [
      '/images/event1.jpg',
      '/images/event2.jpg',
      '/images/event3.jpg',
      '/images/event4.jpg',
      '/images/event5.jpg',
      '/images/event6.jpg',
      '/images/event7.jpg',
      '/images/event8.jpg',
      '/images/event9.jpg',
      '/images/event10.jpg',
      '/images/event11.jpg',
    ]
  
    const getRandomImage = () => {
      const randomIndex = Math.floor(Math.random() * images.length)
      return images[randomIndex]
    }
  
    return { getRandomImage }
  }
  