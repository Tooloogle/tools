import { html } from 'lit';
import { IConfigBase, WebComponentBase } from '../_web-component/WebComponentBase.js';
import httpStatusLookupStyles from './http-status-lookup.css.js';
import { customElement, property } from 'lit/decorators.js';
import inputStyles from '../_styles/input.css.js';

interface StatusCode {
    code: number;
    name: string;
    description: string;
    category: string;
}

@customElement('http-status-lookup')
export class HttpStatusLookup extends WebComponentBase<IConfigBase> {
    static override styles = [WebComponentBase.styles, inputStyles, httpStatusLookupStyles];

    @property()
    searchTerm = '';

    @property()
    selectedCategory = 'all';

    private statusCodes: StatusCode[] = [
        // 1xx Informational
        { code: 100, name: 'Continue', description: 'The server has received the request headers and the client should proceed to send the request body.', category: '1xx' },
        { code: 101, name: 'Switching Protocols', description: 'The requester has asked the server to switch protocols.', category: '1xx' },
        { code: 102, name: 'Processing', description: 'The server has received and is processing the request, but no response is available yet.', category: '1xx' },
        
        // 2xx Success
        { code: 200, name: 'OK', description: 'The request succeeded. The meaning varies depending on HTTP method.', category: '2xx' },
        { code: 201, name: 'Created', description: 'The request succeeded and a new resource was created as a result.', category: '2xx' },
        { code: 202, name: 'Accepted', description: 'The request has been received but not yet acted upon.', category: '2xx' },
        { code: 204, name: 'No Content', description: 'There is no content to send for this request, but headers may be useful.', category: '2xx' },
        
        // 3xx Redirection
        { code: 301, name: 'Moved Permanently', description: 'The URL of the requested resource has been changed permanently.', category: '3xx' },
        { code: 302, name: 'Found', description: 'The URI of requested resource has been changed temporarily.', category: '3xx' },
        { code: 304, name: 'Not Modified', description: 'Used for caching purposes. The response has not been modified.', category: '3xx' },
        { code: 307, name: 'Temporary Redirect', description: 'The server sends this response to direct the client to get the requested resource at another URI.', category: '3xx' },
        { code: 308, name: 'Permanent Redirect', description: 'The resource is now permanently located at another URI.', category: '3xx' },
        
        // 4xx Client Errors
        { code: 400, name: 'Bad Request', description: 'The server cannot or will not process the request due to client error.', category: '4xx' },
        { code: 401, name: 'Unauthorized', description: 'Authentication is required and has failed or has not been provided.', category: '4xx' },
        { code: 403, name: 'Forbidden', description: 'The client does not have access rights to the content.', category: '4xx' },
        { code: 404, name: 'Not Found', description: 'The server cannot find the requested resource.', category: '4xx' },
        { code: 405, name: 'Method Not Allowed', description: 'The request method is known but not supported by the target resource.', category: '4xx' },
        { code: 408, name: 'Request Timeout', description: 'The server timed out waiting for the request.', category: '4xx' },
        { code: 409, name: 'Conflict', description: 'The request conflicts with the current state of the server.', category: '4xx' },
        { code: 410, name: 'Gone', description: 'The requested content has been permanently deleted from server.', category: '4xx' },
        { code: 429, name: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time.', category: '4xx' },
        
        // 5xx Server Errors
        { code: 500, name: 'Internal Server Error', description: 'The server has encountered a situation it does not know how to handle.', category: '5xx' },
        { code: 501, name: 'Not Implemented', description: 'The request method is not supported by the server.', category: '5xx' },
        { code: 502, name: 'Bad Gateway', description: 'The server got an invalid response while working as a gateway.', category: '5xx' },
        { code: 503, name: 'Service Unavailable', description: 'The server is not ready to handle the request.', category: '5xx' },
        { code: 504, name: 'Gateway Timeout', description: 'The server is acting as a gateway and cannot get a response in time.', category: '5xx' },
    ];

    private get filteredCodes(): StatusCode[] {
        return this.statusCodes.filter(status => {
            const matchesSearch = !this.searchTerm || 
                status.code.toString().includes(this.searchTerm) ||
                status.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                status.description.toLowerCase().includes(this.searchTerm.toLowerCase());
            
            const matchesCategory = this.selectedCategory === 'all' || status.category === this.selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
    }

    private handleSearchChange(e: Event) {
        const target = e.target as HTMLInputElement;
        this.searchTerm = target.value;
    }

    private handleCategoryChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        this.selectedCategory = target.value;
    }

    private getCategoryColor(category: string): string {
        const colors: Record<string, string> = {
            '1xx': 'bg-blue-50 border-blue-200',
            '2xx': 'bg-green-50 border-green-200',
            '3xx': 'bg-yellow-50 border-yellow-200',
            '4xx': 'bg-orange-50 border-orange-200',
            '5xx': 'bg-red-50 border-red-200',
        };
        return colors[category] || 'bg-gray-50 border-gray-200';
    }

    override render() {
        return html`
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="block">
                        <span class="inline-block py-1">Search</span>
                        <input
                            type="text"
                            class="form-input"
                            .value=${this.searchTerm}
                            @input=${this.handleSearchChange}
                            placeholder="Search by code, name, or description"
                            autofocus
                        />
                    </label>

                    <label class="block">
                        <span class="inline-block py-1">Category</span>
                        <select class="form-select" .value=${this.selectedCategory} @change=${this.handleCategoryChange}>
                            <option value="all">All Categories</option>
                            <option value="1xx">1xx Informational</option>
                            <option value="2xx">2xx Success</option>
                            <option value="3xx">3xx Redirection</option>
                            <option value="4xx">4xx Client Error</option>
                            <option value="5xx">5xx Server Error</option>
                        </select>
                    </label>
                </div>

                <div class="space-y-3">
                    ${this.filteredCodes.map(status => html`
                        <div class="p-4 rounded border ${this.getCategoryColor(status.category)}">
                            <div class="flex items-start justify-between mb-2">
                                <div class="flex items-center gap-3">
                                    <span class="text-2xl font-bold">${status.code}</span>
                                    <span class="text-lg font-semibold">${status.name}</span>
                                </div>
                                <span class="text-sm px-2 py-1 bg-white rounded">${status.category}</span>
                            </div>
                            <p class="text-gray-700">${status.description}</p>
                        </div>
                    `)}
                </div>

                ${this.filteredCodes.length === 0 ? html`
                    <div class="text-center py-8 text-gray-500">
                        No status codes found matching your search.
                    </div>
                ` : ''}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'http-status-lookup': HttpStatusLookup;
    }
}
