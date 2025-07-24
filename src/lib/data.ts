// This file runs on the client only.
// It contains functions that interact with the API routes.
'use client';

import type { Article, NewArticle } from './types';

const API_ENDPOINT = '/api/news';

export async function getNews(): Promise<Article[]> {
    const response = await fetch(API_ENDPOINT, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error('Failed to fetch news');
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
