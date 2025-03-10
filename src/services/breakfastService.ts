import axios from 'axios';
import { BreakfastDeal } from '../types';
import { SPOONACULAR_API_KEY } from '../config/keys';
import cheerio from 'cheerio';

const SPOONACULAR_API_BASE_URL = 'https://api.spoonacular.com/recipes';

/**
 * Fetch breakfast recipes from Spoonacular API
 */
const fetchBreakfastFromSpoonacular = async (hotelId: string): Promise<BreakfastDeal[]> => {
  try {
    const response = await axios.get(`${SPOONACULAR_API_BASE_URL}/complexSearch`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        query: 'breakfast',
        type: 'breakfast',
        addRecipeInformation: true,
        number: 5,
      },
    });

    return response.data.results.map((recipe: any) => ({
      id: `spoon_${recipe.id}`,
      hotelId,
      title: recipe.title,
      description: recipe.summary.replace(/<[^>]*>/g, '').slice(0, 200) + '...',
      price: (recipe.pricePerServing * 2.5).toFixed(2), // Convert to reasonable breakfast price
      originalPrice: (recipe.pricePerServing * 3.5).toFixed(2),
      currency: 'USD',
      image: recipe.image,
      availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      ingredients: recipe.extendedIngredients.map((ing: any) => ing.name),
      dietaryOptions: recipe.diets,
      timeSlots: generateTimeSlots(),
    }));
  } catch (error) {
    console.error('Error fetching from Spoonacular API:', error);
    return [];
  }
};

/**
 * Scrape breakfast menu items from hotel websites (fallback)
 */
const scrapeBreakfastMenu = async (hotelId: string, hotelName: string): Promise<BreakfastDeal[]> => {
  try {
    // Search for the hotel's breakfast menu page
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(hotelName + ' breakfast menu')}`;
    const response = await axios.get(searchUrl);
    const $ = cheerio.load(response.data);

    // Extract potential menu items (this is a simplified example)
    const menuItems: BreakfastDeal[] = [];
    $('div:contains("breakfast")').each((_, element) => {
      const title = $(element).text().slice(0, 50);
      if (title.toLowerCase().includes('breakfast')) {
        menuItems.push({
          id: `scraped_${Date.now()}_${menuItems.length}`,
          hotelId,
          title,
          description: 'A delightful breakfast option at ' + hotelName,
          price: 29.99,
          originalPrice: 39.99,
          currency: 'USD',
          image: 'https://source.unsplash.com/random/800x600/?breakfast',
          availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          ingredients: ['Fresh ingredients', 'Chef\'s selection'],
          dietaryOptions: ['Vegetarian options available'],
          timeSlots: generateTimeSlots(),
        });
      }
    });

    return menuItems.slice(0, 3); // Limit to 3 items
  } catch (error) {
    console.error('Error scraping breakfast menu:', error);
    return [];
  }
};

/**
 * Get breakfast deals for a specific hotel
 */
export const getBreakfastDeals = async (hotelId: string, hotelName: string): Promise<BreakfastDeal[]> => {
  // Try Spoonacular API first
  const spoonacularDeals = await fetchBreakfastFromSpoonacular(hotelId);
  if (spoonacularDeals.length > 0) return spoonacularDeals;

  // Fallback to web scraping
  const scrapedDeals = await scrapeBreakfastMenu(hotelId, hotelName);
  if (scrapedDeals.length > 0) return scrapedDeals;

  // If both methods fail, return a default breakfast deal
  return [generateDefaultBreakfastDeal(hotelId, hotelName)];
};

/**
 * Generate default breakfast deal as last resort
 */
const generateDefaultBreakfastDeal = (hotelId: string, hotelName: string): BreakfastDeal => ({
  id: `default_${hotelId}`,
  hotelId,
  title: 'Continental Breakfast Experience',
  description: `Start your day with our signature breakfast at ${hotelName}, featuring a selection of fresh pastries, seasonal fruits, and premium coffee.`,
  price: 24.99,
  originalPrice: 34.99,
  currency: 'USD',
  image: 'https://source.unsplash.com/random/800x600/?continental,breakfast',
  availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  ingredients: [
    'Fresh pastries',
    'Seasonal fruits',
    'Artisanal cheeses',
    'Premium coffee',
    'Fresh juices',
  ],
  dietaryOptions: ['Vegetarian', 'Gluten-free options'],
  timeSlots: generateTimeSlots(),
});

/**
 * Generate time slots for breakfast
 */
const generateTimeSlots = (): string[] => {
  const slots = [];
  for (let hour = 6; hour <= 10; hour++) {
    slots.push(
      `${hour}:00 AM - ${hour}:30 AM`,
      `${hour}:30 AM - ${hour + 1}:00 AM`
    );
  }
  return slots;
}; 