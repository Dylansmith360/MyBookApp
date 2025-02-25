import axios from 'axios';

const API_BASE_URL = 'http://localhost:5075/api/books';

export const searchBooks = async (query: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/search`, {
            params: { q: query }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching books:', error);
        throw error;
    }
};

export const getBookReviews = async (bookId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${bookId}/reviews`);
        return response.data;
    } catch (error) {
        console.error('Error fetching book reviews:', error);
        throw error;
    }
};