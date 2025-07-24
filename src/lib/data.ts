// This file runs on the client and the server.
// It contains functions that interact with the API routes.
import type { Article, NewArticle } from './types';

function getApiEndpoint() {
    const VERCEL_URL = process.env.VERCEL_URL;
    const NEXT_PUBLIC_VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL;
    
    if (VERCEL_URL) {
        return `https://${VERCEL_URL}/api/news`;
    }
    if (NEXT_PUBLIC_VERCEL_URL) {
       return `https://${NEXT_PUBLIC_VERCEL_URL}/api/news`;
    }
    // Assume localhost for local development
    return 'http://localhost:9002/api/news';
}


const API_ENDPOINT = getApiEndpoint();

export async function getNews(): Promise<Article[]> {
    const response = await fetch(API_ENDPOINT, { cache: 'no-store' });
    if (!response.ok) {
        console.error("Failed to fetch news, status:", response.status);
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(`Failed to fetch news. Details: ${errorText}`);
    }
    return response.json();
}

export async function addNews(articleData: NewArticle): Promise<Article> {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create article');
    }
    return response.json();
}

export async function updateNews(articleId: number, updateData: Partial<NewArticle>): Promise<Article> {
    const response = await fetch(`${API_ENDPOINT}?id=${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
    });
     if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update article');
    }
    return response.json();
}

export async function deleteNews(articleId: number): Promise<{ success: true }> {
    const response = await fetch(`${API_ENDPOINT}?id=${articleId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
       const errorData = await response.json().catch(() => ({}));
       throw new Error(errorData.error || 'Failed to delete article');
    }
    return response.json();
}

export async function deleteAllNews(): Promise<{ success: true }> {
    const response = await fetch(API_ENDPOINT, {
        method: 'DELETE',
    });
     if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete all articles');
    }
    return response.json();
}
