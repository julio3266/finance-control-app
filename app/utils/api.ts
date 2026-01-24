import { config } from './config';

export interface ApiError {
    message: string;
    status?: number;
}

class ApiClient {
    private baseURL: string;
    private timeout: number;
    private token: string | null = null;

    constructor() {
        this.baseURL = config.apiUrl;
        this.timeout = config.apiTimeout;
    }

    setToken(token: string | null) {
        this.token = token;
    }

    getToken(): string | null {
        return this.token;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const baseUrl = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
        const endpointPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const url = `${baseUrl}${endpointPath}`;

        const method = options.method || 'GET';
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(options.headers as Record<string, string>),
        };

        // Add Authorization header if token exists
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const startTime = Date.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: options.body,
                signal: controller.signal,
                cache: 'no-cache',
                credentials: 'omit',
            });

            clearTimeout(timeoutId);
            const duration = Date.now() - startTime;

            if (!response.ok) {
                let errorData = {};
                try {
                    errorData = await response.json();
                } catch {
                    const text = await response.text().catch(() => '');
                    errorData = text ? { message: text } : {};
                }

                // Log do erro (apenas em desenvolvimento)
                if (__DEV__) {
                    // eslint-disable-next-line no-console
                    console.error('❌ [API Error]', {
                        method,
                        url,
                        status: response.status,
                        statusText: response.statusText,
                        error: errorData,
                        duration: `${duration}ms`,
                    });
                }

                const error: ApiError = {
                    message:
                        (errorData as any).message ||
                        `Erro ${response.status}: ${response.statusText}`,
                    status: response.status,
                };
                throw error;
            }

            const data = await response.json();

            return data;
        } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    const apiError: ApiError = { message: 'Tempo de requisição excedido' };
                    throw apiError;
                }

                const apiError: ApiError = { message: error.message };
                throw apiError;
            }
            throw error;
        }
    }

    async post<T>(endpoint: string, data: unknown, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            headers,
        });
    }

    async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'GET',
            headers,
        });
    }
    async put<T>(endpoint: string, data: unknown, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers,
        });
    }

    async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            headers,
        });
    }
}

export const apiClient = new ApiClient();
